import type { SourceChunk } from "@/lib/types";

/** True when a chunk's provenance is Wikipedia (not used to ground written answers). */
export function isWikipediaSource(chunk: SourceChunk): boolean {
  const url = (chunk.url ?? "").toLowerCase();
  if (/wikipedia\.org/i.test(url)) return true;

  const cite = chunk.citation.trim().toLowerCase();
  if (/^wikipedia\b/.test(cite) || /^wikipedia,/.test(cite)) return true;
  if (/^wikipedia:/.test(cite)) return true;

  return false;
}

/** Sources that may ground persona answers, appear in the evidence panel, or pass verification. */
export function sourcesForGrounding(sources: SourceChunk[]): SourceChunk[] {
  return sources.filter((s) => !isWikipediaSource(s));
}

export function groundingSourceIds(sources: SourceChunk[]): Set<string> {
  return new Set(sourcesForGrounding(sources).map((s) => s.id));
}
