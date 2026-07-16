import type { TtsOptions } from "@/lib/llm";
import { getPersonaPack } from "@/personas";

/** Resolve OpenAI TTS voice options for a persona slug (if configured). */
export function ttsOptionsForPersona(slug?: string | null): TtsOptions | undefined {
  if (!slug) return undefined;
  try {
    const pack = getPersonaPack(slug);
    if (!pack.tts) return undefined;
    return {
      voice: pack.tts.voice,
      instructions: pack.tts.instructions,
      speed: pack.tts.speed,
    };
  } catch {
    return undefined;
  }
}
