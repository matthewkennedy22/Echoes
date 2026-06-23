export type EvidenceLabel = "documented" | "inference" | "contested" | "unknown";

export type Reliability = "high" | "medium" | "low";

/** A single retrievable, cited chunk of historical knowledge. */
export interface SourceChunk {
  id: string;
  /** The factual content, written plainly for retrieval and grounding. */
  text: string;
  /** Short topic tags used for organization and debugging. */
  topics: string[];
  /** Human-readable date or range this fact concerns, e.g. "1901" or "1849-1850". */
  dateRange?: string;
  sourceType:
    | "primary"
    | "secondary"
    | "reference"
    | "biographical"
    | "persona-note";
  /** Human-readable citation shown to users in the evidence panel. */
  citation: string;
  /** Optional URL to the underlying source. */
  url?: string;
  reliability: Reliability;
}

/** A historical image the persona can show, with provenance. */
export interface ImageAsset {
  id: string;
  src: string; // path under /public
  caption: string; // shown to the user
  alt: string;
  topics: string[];
  dateRange?: string;
  citation: string;
  url?: string;
  license: string;
}

/** Public, client-safe display info for a persona. */
export interface PersonaPublic {
  slug: string;
  name: string;
  years: string;
  portrait: string; // emoji or short glyph fallback
  portraitImage?: string; // path to a real portrait in /public
  tagline: string;
  era: string;
  disclosure: string;
  starters: string[];
}

/** Chat message exchanged with the API. */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** The structured answer returned by the model + server. */
export interface GroundedAnswer {
  answer: string;
  evidenceLabel: EvidenceLabel;
  usedSourceIds: string[];
  sources: SourceChunk[];
  images: ImageAsset[];
}
