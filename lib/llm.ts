import OpenAI from "openai";
import type { ChatMessage } from "@/lib/types";

let client: OpenAI | null = null;

/** Lazily create the OpenAI client so a missing key doesn't break the build. */
function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set. Copy .env.local.example to .env.local and add your key."
    );
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
const EMBED_MODEL = process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";
export const EMBED_DIM = Number(process.env.OPENAI_EMBED_DIM || 512);

const EMBED_BATCH = 96;

/** Embed an array of strings in a single request (<= ~96 items). */
export async function embed(texts: string[]): Promise<number[][]> {
  const res = await getClient().embeddings.create({
    model: EMBED_MODEL,
    input: texts,
    dimensions: EMBED_DIM,
  });
  return res.data.map((d) => d.embedding as number[]);
}

/** Embed any number of strings, batching to stay within request limits. */
export async function embedMany(
  texts: string[],
  onProgress?: (done: number, total: number) => void
): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += EMBED_BATCH) {
    const batch = texts.slice(i, i + EMBED_BATCH);
    let attempt = 0;
    // simple retry for transient rate-limit / network errors
    while (true) {
      try {
        const vectors = await embed(batch);
        out.push(...vectors);
        break;
      } catch (err) {
        if (++attempt >= 4) throw err;
        await new Promise((r) => setTimeout(r, attempt * 1500));
      }
    }
    onProgress?.(Math.min(i + EMBED_BATCH, texts.length), texts.length);
  }
  return out;
}

const TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE = process.env.OPENAI_TTS_VOICE || "onyx";
const TTS_SPEED = Number(process.env.OPENAI_TTS_SPEED || 1.12);
const TTS_INSTRUCTIONS =
  process.env.OPENAI_TTS_INSTRUCTIONS ||
  "Voice of a very old man, about 78 years old, in the year 1905 — a frail but dignified 19th-century gentleman. The timbre is aged and weathered: low, dry, and noticeably gravelly, with a slight tremor and quaver of old age, and a touch of breathiness as if speaking takes a little effort. He sounds like an elderly grandfather, not a middle-aged man. Keep the tone warm and kindly, with the cadence of an old storyteller, at a natural, easy conversational pace.";

/** Synthesize speech for a persona's reply. Returns MP3 bytes. */
export async function tts(text: string): Promise<Buffer> {
  const res = await getClient().audio.speech.create({
    model: TTS_MODEL,
    voice: TTS_VOICE,
    input: text.slice(0, 4000),
    instructions: TTS_INSTRUCTIONS,
    speed: TTS_SPEED,
  });
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Synthesize speech and return the raw MP3 byte stream as it is produced,
 * so the client can begin playback before the whole file is ready.
 */
export async function ttsStream(
  text: string
): Promise<ReadableStream<Uint8Array>> {
  const res = await getClient().audio.speech.create({
    model: TTS_MODEL,
    voice: TTS_VOICE,
    input: text.slice(0, 4000),
    instructions: TTS_INSTRUCTIONS,
    speed: TTS_SPEED,
    response_format: "mp3",
  });
  const body = res.body as ReadableStream<Uint8Array> | null;
  if (!body) throw new Error("No audio stream returned from TTS provider.");
  return body;
}

/**
 * Ask the chat model to produce a grounded answer as JSON.
 * `system` carries the persona + grounding instructions; `history` is the
 * prior conversation. Returns the raw JSON string from the model.
 */
export async function chatJSON(
  system: string,
  history: ChatMessage[]
): Promise<string> {
  const res = await getClient().chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.6,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ],
  });
  return res.choices[0]?.message?.content ?? "";
}
