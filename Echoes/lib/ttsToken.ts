import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 2 * 60 * 1000;

function getSecret(): string {
  const secret =
    process.env.TTS_TOKEN_SECRET || process.env.OPENAI_API_KEY || "dev-only";
  if (secret === "dev-only" && process.env.NODE_ENV === "production") {
    throw new Error("Set TTS_TOKEN_SECRET or OPENAI_API_KEY for voice playback.");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encodePayload(text: string): string {
  return Buffer.from(
    JSON.stringify({ text, exp: Date.now() + TOKEN_TTL_MS }),
    "utf8"
  ).toString("base64url");
}

/** Create a short-lived signed token for GET /api/tts/play. */
export function createTtsPlayToken(text: string): string {
  const payload = encodePayload(text.slice(0, 4000));
  return `${payload}.${sign(payload)}`;
}

/** Verify token and return the text, or null if invalid/expired. */
export function verifyTtsPlayToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);

  try {
    const a = Buffer.from(sig, "base64url");
    const b = Buffer.from(expected, "base64url");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const { text, exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { text?: string; exp?: number };
    if (!text || typeof exp !== "number" || Date.now() > exp) return null;
    return text;
  } catch {
    return null;
  }
}
