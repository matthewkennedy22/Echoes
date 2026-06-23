"use client";

import { useEffect, useRef, useState } from "react";
import { myronAngelPublic as persona } from "@/personas/myron-angel/public";
import type { EvidenceLabel, ImageAsset, SourceChunk } from "@/lib/types";

interface UiMessage {
  role: "user" | "assistant";
  content: string;
  evidenceLabel?: EvidenceLabel;
  sources?: SourceChunk[];
  images?: ImageAsset[];
  imageIds?: string[];
  showEvidence?: boolean;
}

const LABEL_TEXT: Record<EvidenceLabel, string> = {
  documented: "Documented",
  inference: "Reasonable inference",
  contested: "Contested",
  unknown: "Not in the sources",
};

function AssistantRoleTag({ name }: { name: string }) {
  return (
    <div className="role-tag">
      {persona.portraitImage ? (
        <span className="role-avatar" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={persona.portraitImage} alt="" />
        </span>
      ) : null}
      {name}
    </div>
  );
}

/** Tiny silent MP3 — played synchronously on tap so iOS/Android allow later playback. */
const SILENT_MP3 =
  "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAABAAADhADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjQ5AAAAAAAAAAAAAAAAJAAAAAAAAAAAA4SmZmgg";

function isIosSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/i.test(ua) &&
    /Safari/i.test(ua) &&
    !/Chrome|CriOS|FxiOS|EdgiOS/i.test(ua)
  );
}

function canStreamMse(): boolean {
  if (typeof window === "undefined") return false;
  const mime = "audio/mpeg";
  return "MediaSource" in window && window.MediaSource.isTypeSupported(mime);
}

export default function Chat() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [voicePreparingIndex, setVoicePreparingIndex] = useState<number | null>(
    null
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  function isBenignPlayError(err: unknown): boolean {
    return (
      err instanceof DOMException &&
      (err.name === "AbortError" || err.name === "NotAllowedError")
    );
  }

  async function safePlay(audio: HTMLAudioElement): Promise<boolean> {
    try {
      const promise = audio.play();
      playPromiseRef.current = promise;
      await promise;
      return true;
    } catch (err) {
      if (!isBenignPlayError(err)) throw err;
      return false;
    } finally {
      playPromiseRef.current = null;
    }
  }

  function getPlayer(): HTMLAudioElement {
    if (!playerRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      playerRef.current = audio;
    }
    return playerRef.current;
  }

  /** Must run synchronously inside a click/tap handler, before any await. */
  function unlockAudio() {
    if (audioUnlockedRef.current) return;
    const audio = getPlayer();
    audio.src = SILENT_MP3;
    const promise = audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audioUnlockedRef.current = true;
      })
      .catch((err) => {
        if (!isBenignPlayError(err)) {
          /* ignore unlock failures — a later tap can retry */
        }
      });
    playPromiseRef.current = promise;
    void promise.finally(() => {
      if (playPromiseRef.current === promise) playPromiseRef.current = null;
    });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function stopAudio() {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    void playPromiseRef.current?.catch(() => {});
    playPromiseRef.current = null;
    const audio = playerRef.current;
    if (audio) {
      audio.onended = null;
      audio.onplaying = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setSpeakingIndex(null);
    setVoicePreparingIndex(null);
  }

  async function playFromUrl(
    audio: HTMLAudioElement,
    url: string,
    index: number
  ) {
    audio.onended = () => {
      setSpeakingIndex((cur) => (cur === index ? null : cur));
      setVoicePreparingIndex(null);
    };
    audio.onplaying = () => {
      setVoicePreparingIndex((cur) => (cur === index ? null : cur));
    };
    audio.src = url;
    audio.load();
    await safePlay(audio);
  }

  async function playBlob(audio: HTMLAudioElement, blob: Blob, index: number) {
    const url = URL.createObjectURL(blob);
    audio.onended = () => {
      URL.revokeObjectURL(url);
      setSpeakingIndex((cur) => (cur === index ? null : cur));
    };
    audio.src = url;
    audio.load();
    await safePlay(audio);
  }

  async function speak(text: string, index: number) {
    stopAudio();
    setVoiceError(null);
    setSpeakingIndex(index);
    setVoicePreparingIndex(index);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const audio = getPlayer();

      // iOS Safari: get a play URL instantly, then let the browser stream the MP3.
      if (isIosSafari()) {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, format: "url" }),
          signal: controller.signal,
        });
        if (!res.ok) {
          let detail = "Voice unavailable right now.";
          try {
            const data = await res.json();
            if (data?.error) detail = data.error;
          } catch {
            /* not JSON */
          }
          setVoiceError(detail);
          setSpeakingIndex(null);
          setVoicePreparingIndex(null);
          return;
        }
        const { url } = (await res.json()) as { url: string };
        await playFromUrl(audio, url, index);
        return;
      }

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      if (!res.ok) {
        let detail = "Voice unavailable right now.";
        try {
          const data = await res.json();
          if (data?.error) detail = data.error;
        } catch {
          /* not JSON */
        }
        setVoiceError(detail);
        setSpeakingIndex(null);
        setVoicePreparingIndex(null);
        return;
      }

      const mime = "audio/mpeg";

      // Desktop / Android: progressive playback via MediaSource.
      if (canStreamMse() && res.body) {
        const mediaSource = new MediaSource();
        const url = URL.createObjectURL(mediaSource);
        audio.src = url;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setSpeakingIndex((cur) => (cur === index ? null : cur));
          setVoicePreparingIndex(null);
        };
        audio.onplaying = () => {
          setVoicePreparingIndex((cur) => (cur === index ? null : cur));
        };

        await new Promise<void>((resolve, reject) => {
          mediaSource.addEventListener(
            "sourceopen",
            () => {
              const sourceBuffer = mediaSource.addSourceBuffer(mime);
              const reader = res.body!.getReader();
              const queue: Uint8Array[] = [];
              let done = false;
              let playStarted = false;
              let hasBuffered = false;

              const tryPlay = () => {
                if (playStarted || !hasBuffered) return;
                playStarted = true;
                void safePlay(audio).catch(() => {
                  playStarted = false;
                });
              };

              const flush = () => {
                if (sourceBuffer.updating) return;
                if (queue.length > 0) {
                  hasBuffered = true;
                  sourceBuffer.appendBuffer(queue.shift()! as BufferSource);
                } else if (done && mediaSource.readyState === "open") {
                  try {
                    mediaSource.endOfStream();
                  } catch {
                    /* already ended */
                  }
                }
              };

              sourceBuffer.addEventListener("updateend", () => {
                flush();
                tryPlay();
              });

              void (async () => {
                try {
                  while (true) {
                    const { value, done: streamDone } = await reader.read();
                    if (streamDone) break;
                    if (value) queue.push(value);
                    flush();
                  }
                } catch {
                  /* aborted or network error */
                } finally {
                  done = true;
                  flush();
                }
              })();
              resolve();
            },
            { once: true }
          );
          mediaSource.addEventListener(
            "error",
            () => reject(new Error("MediaSource failed")),
            { once: true }
          );
        });

        if (audio.paused) await safePlay(audio);
        return;
      }

      // Fallback: wait for the full file, then play.
      await playBlob(audio, await res.blob(), index);
      setVoicePreparingIndex(null);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setVoiceError("Tap Hear this again to allow audio on this device.");
      } else if (!(err instanceof DOMException && err.name === "AbortError")) {
        setVoiceError("Could not play audio. Check your volume and try again.");
      }
      setSpeakingIndex((cur) => (cur === index ? null : cur));
      setVoicePreparingIndex(null);
    }
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    stopAudio();
    unlockAudio();
    setError(null);
    setVoiceError(null);
    const nextMessages: UiMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
            ...(m.imageIds?.length ? { imageIds: m.imageIds } : {}),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }
      const assistantIndex = nextMessages.length;
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.answer,
          evidenceLabel: data.evidenceLabel,
          sources: data.sources,
          images: data.images,
          imageIds: Array.isArray(data.images)
            ? data.images
                .map((img: ImageAsset) => img?.id)
                .filter(
                  (id: string | undefined): id is string =>
                    typeof id === "string" && id.length > 0
                )
            : undefined,
        },
      ]);
      if (voiceOn && data.answer) {
        speak(data.answer, assistantIndex);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages(nextMessages);
    } finally {
      setLoading(false);
    }
  }

  function toggleEvidence(index: number) {
    setMessages((prev) =>
      prev.map((m, i) =>
        i === index ? { ...m, showEvidence: !m.showEvidence } : m
      )
    );
  }

  return (
    <>
      {messages.length === 0 && (
        <div className="starters">
          {persona.starters.map((s) => (
            <button
              key={s}
              className="starter"
              onClick={() => {
                stopAudio();
                unlockAudio();
                void send(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="voicebar">
        <button
          className="voice-toggle"
          onClick={() => {
            unlockAudio();
            const next = !voiceOn;
            setVoiceOn(next);
            if (!next) stopAudio();
          }}
          aria-pressed={voiceOn}
        >
          {voiceOn ? "🔊 Voice on" : "🔇 Voice off"}
        </button>
      </div>

      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === "user" ? (
              <div className="role-tag user">You</div>
            ) : (
              <AssistantRoleTag name={persona.name} />
            )}
            <div className="bubble">
              {m.role === "assistant" && m.images && m.images.length > 0 && (
                <div className="figures">
                  {m.images.map((img) => (
                    <figure key={img.id} className="figure">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.alt} loading="lazy" />
                      <figcaption>
                        <span className="fig-caption">{img.caption}</span>
                        <span className="fig-cite">
                          {img.citation}
                          {img.url && (
                            <>
                              {" "}
                              <a href={img.url} target="_blank" rel="noreferrer">
                                [source]
                              </a>
                            </>
                          )}{" "}
                          · {img.license}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
              {m.content}
            </div>

            {m.role === "assistant" && m.evidenceLabel && (
              <div className="evidence">
                <span className={`badge ${m.evidenceLabel}`}>
                  {LABEL_TEXT[m.evidenceLabel]}
                </span>
                <button
                  className="evidence-toggle"
                  onClick={() => {
                    if (speakingIndex === i) {
                      stopAudio();
                    } else {
                      stopAudio();
                      unlockAudio();
                      void speak(m.content, i);
                    }
                  }}
                >
                  {speakingIndex === i
                    ? voicePreparingIndex === i
                      ? "⏳ Preparing…"
                      : "■ Stop"
                    : "🔊 Hear this"}
                </button>
                {m.sources && m.sources.length > 0 && (
                  <button
                    className="evidence-toggle"
                    onClick={() => toggleEvidence(i)}
                  >
                    {m.showEvidence ? "Hide evidence" : "Show evidence"}
                  </button>
                )}
                {m.showEvidence && m.sources && (
                  <div className="sources">
                    {m.sources.map((s) => (
                      <div key={s.id} className="source">
                        <span className="stitle">{s.text}</span>
                        <br />
                        <span className="scite">{s.citation}</span>
                        {s.url && (
                          <>
                            {" "}
                            <a href={s.url} target="_blank" rel="noreferrer">
                              [source]
                            </a>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="msg assistant">
            <AssistantRoleTag name={persona.name} />
            <div className="typing">consulting the records…</div>
          </div>
        )}

        {error && <div className="error">{error}</div>}
        {voiceError && <div className="error">{voiceError}</div>}
        <div ref={bottomRef} />
      </div>

      <div className="composer">
        <textarea
          value={input}
          placeholder={`Ask ${persona.name} a question…`}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
        />
        <button
          className="send"
          onClick={() => {
            stopAudio();
            unlockAudio();
            void send(input);
          }}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </>
  );
}
