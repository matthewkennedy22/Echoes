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

export type TtsPlayPayload = {
  text: string;
  /** Persona slug so /api/tts/play can use the right voice. */
  persona?: string;
  exp: number;
};

function encodePayload(text: string, persona?: string): string {
  const body: TtsPlayPayload = {
    text,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  if (persona) body.persona = persona;
  return Buffer.from(JSON.stringify(body), "utf8").toString("base64url");
}

/** Create a short-lived signed token for GET /api/tts/play. */
export function createTtsPlayToken(text: string, persona?: string): string {
  const payload = encodePayload(text.slice(0, 4000), persona);
  return `${payload}.${sign(payload)}`;
}

/** Verify token and return text + optional persona, or null if invalid/expired. */
export function verifyTtsPlayToken(
  token: string
): { text: string; persona?: string } | null {
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
    const { text, exp, persona } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as TtsPlayPayload;
    if (!text || typeof exp !== "number" || Date.now() > exp) return null;
    return {
      text,
      persona: typeof persona === "string" ? persona : undefined,
    };
  } catch {
    return null;
  }
}
