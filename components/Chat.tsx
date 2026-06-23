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
  showEvidence?: boolean;
}

const LABEL_TEXT: Record<EvidenceLabel, string> = {
  documented: "Documented",
  inference: "Reasonable inference",
  contested: "Contested",
  unknown: "Not in the sources",
};

export default function Chat() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function stopAudio() {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
    setSpeakingIndex(null);
  }

  async function speak(text: string, index: number) {
    stopAudio();
    setSpeakingIndex(index);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        setSpeakingIndex(null);
        return;
      }

      const mime = "audio/mpeg";
      const canStream =
        typeof window !== "undefined" &&
        "MediaSource" in window &&
        window.MediaSource.isTypeSupported(mime);

      // Progressive playback: start as soon as the first chunk arrives.
      if (canStream) {
        const mediaSource = new MediaSource();
        const url = URL.createObjectURL(mediaSource);
        const audio = new Audio();
        audio.src = url;
        audioRef.current = audio;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setSpeakingIndex((cur) => (cur === index ? null : cur));
        };

        mediaSource.addEventListener("sourceopen", () => {
          const sourceBuffer = mediaSource.addSourceBuffer(mime);
          const reader = res.body!.getReader();
          const queue: Uint8Array[] = [];
          let done = false;

          const flush = () => {
            if (sourceBuffer.updating) return;
            if (queue.length > 0) {
              sourceBuffer.appendBuffer(queue.shift()! as BufferSource);
            } else if (done && mediaSource.readyState === "open") {
              try {
                mediaSource.endOfStream();
              } catch {
                /* already ended */
              }
            }
          };

          sourceBuffer.addEventListener("updateend", flush);

          (async () => {
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
        });

        await audio.play();
        return;
      }

      // Fallback (e.g. Safari): wait for the full file, then play.
      const url = URL.createObjectURL(await res.blob());
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setSpeakingIndex((cur) => (cur === index ? null : cur));
      };
      await audio.play();
    } catch {
      setSpeakingIndex((cur) => (cur === index ? null : cur));
    }
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    stopAudio();
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
            <button key={s} className="starter" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="voicebar">
        <button
          className="voice-toggle"
          onClick={() => {
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
            <div className="role-tag">
              {m.role === "user" ? "You" : persona.name}
            </div>
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
                  onClick={() =>
                    speakingIndex === i ? stopAudio() : speak(m.content, i)
                  }
                >
                  {speakingIndex === i ? "■ Stop" : "🔊 Hear this"}
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
            <div className="role-tag">{persona.name}</div>
            <div className="typing">consulting the records…</div>
          </div>
        )}

        {error && <div className="error">{error}</div>}
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
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </>
  );
}
