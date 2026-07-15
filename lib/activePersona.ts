import {
  DEFAULT_PERSONA_SLUG,
  getPersonaPack,
} from "@/personas";
import type { PersonaPack } from "@/personas/types";

/**
 * Request-scoped active persona for RAG / image helpers.
 * Set at the start of answerQuestion / warmIndex; safe for Node's
 * single-threaded request handling (one chat at a time per isolate is fine).
 */
let active: PersonaPack | null = null;

export function setActivePersona(pack: PersonaPack | null) {
  active = pack;
}

export function getActivePersona(): PersonaPack {
  return active ?? getPersonaPack(DEFAULT_PERSONA_SLUG);
}

export async function withPersona<T>(
  pack: PersonaPack,
  fn: () => Promise<T>
): Promise<T> {
  const prev = active;
  active = pack;
  try {
    return await fn();
  } finally {
    active = prev;
  }
}
