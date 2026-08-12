export type EvidenceLabel = "documented" | "inference" | "contested" | "unknown";

export type Reliability = "high" | "medium" | "low";

/**
 * Optional structured tags for the semantic layer.
 * Used at retrieve time (filter/boost) and in the grounding prompt brief.
 * Canonical ids should match the persona's semantic vocab when present.
 */
export interface SourceSemantic {
  /** Canonical person ids (e.g. "myron-angel", "ah-louis"). */
  people?: string[];
  /** Canonical place ids (e.g. "san-luis-obispo", "morro-bay"). */
  places?: string[];
  /** Canonical organization ids. */
  organizations?: string[];
  /** Canonical event ids (e.g. "gold-rush", "cal-poly-founding"). */
  events?: string[];
  /** Historical period id (e.g. "early-statehood", "progressive-era"). */
  period?: string;
  /** Inclusive start year when known (parsed from dateRange or set by hand). */
  yearStart?: number;
  /** Inclusive end year when known. */
  yearEnd?: number;
}

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
  /** Structured who/what/where/when tags (semantic layer). */
  semantic?: SourceSemantic;
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

/** Where a figure appears. Omitted = public California Speaks gallery. */
export type PersonaVisibility = "public" | "partner";

/** Public, client-safe display info for a persona. */
export interface PersonaPublic {
  slug: string;
  /** Primary place or region this figure represents — shown prominently on cards. */
  region: string;
  name: string;
  years: string;
  portrait: string; // emoji or short glyph fallback
  portraitImage?: string; // path to a real portrait in /public
  tagline: string;
  era: string;
  disclosure: string;
  starters: string[];
  /**
   * `partner` figures are omitted from California Speaks and live on a
   * partner landing (`/p/...`). Default is `public`.
   */
  visibility?: PersonaVisibility;
}

/** Chat message exchanged with the API. */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** Image ids already shown with this assistant turn (for deduping). */
  imageIds?: string[];
}

/** The structured answer returned by the model + server. */
export interface GroundedAnswer {
  answer: string;
  evidenceLabel: EvidenceLabel;
  usedSourceIds: string[];
  sources: SourceChunk[];
  images: ImageAsset[];
}
