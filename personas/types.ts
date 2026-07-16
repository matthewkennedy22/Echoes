import type { ImageAsset, PersonaPublic, SourceChunk } from "@/lib/types";

/** Topic → buzzword → image map entry for a persona's visual library. */
export interface ImageTopic {
  key: string;
  label: string;
  buzzwords: string[];
  imageIds: string[];
}

/**
 * Full server-side persona pack. Client code should only import `public`.
 * Each historian is one of these — same shape Myron uses today.
 */
export interface PersonaPack {
  public: PersonaPublic;
  /** System prompt: voice, era, guardrails. */
  systemPrompt: string;
  /** Hand-verified claim bank. */
  sources: SourceChunk[];
  /** Curated image library. */
  images: ImageAsset[];
  /** Topic catalog for image matching + prompt guide. */
  imageTopics: ImageTopic[];
  /** Catalog topic key → Wikipedia article titles. */
  wikipediaByTopicKey: Record<string, string[]>;
  /** Extra keyword → Wikipedia articles for live image search. */
  wikipediaKeywordArticles?: Record<string, string[]>;
  /**
   * Optional paths (relative to process.cwd()) for ingested book/OCR chunks.
   * Each file is one public-domain primary work; personas should have 2+ for depth.
   */
  bookChunksPaths?: string[];
  /** @deprecated Use bookChunksPaths. Kept for single-book packs. */
  bookChunksPath?: string;
  /** Optional override for image accuracy rules in the prompt. */
  accuracyPrompt?: string;
  /**
   * Source id prefixes pinned for "who are you" questions.
   * Default: ["bio-"]
   */
  identitySourceIdPrefixes?: string[];
  /** Speaking year for temporal guardrails (e.g. 1905). */
  temporalYear?: number;
  /** Label used in conversation brief, e.g. "You (Myron)". */
  speakerLabel?: string;
  /** Portrait image id for identity questions. Default: "img-portrait". */
  portraitImageId?: string;
  /**
   * Optional OpenAI TTS overrides. When omitted, the default elderly-gentleman
   * voice in lib/llm.ts is used (most California Speaks figures).
   */
  tts?: {
    /** OpenAI voice id, e.g. "onyx", "nova", "coral", "shimmer". */
    voice: string;
    /** Delivery style for gpt-4o-mini-tts `instructions`. */
    instructions: string;
    /** Playback speed (default from OPENAI_TTS_SPEED / 1.12). */
    speed?: number;
  };
}
