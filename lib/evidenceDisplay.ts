import type { EvidenceItem, SourceChunk } from "@/lib/types";

const MAX_ITEMS = 4;
const MAX_EXCERPT = 320;
const MAX_USED_FOR = 160;

const STOP = new Set([
  "that",
  "this",
  "with",
  "from",
  "have",
  "been",
  "were",
  "they",
  "their",
  "which",
  "would",
  "could",
  "about",
  "into",
  "when",
  "what",
  "your",
  "there",
  "then",
  "than",
  "also",
  "only",
  "over",
  "after",
  "before",
  "other",
  "some",
  "such",
  "very",
  "more",
  "most",
  "many",
]);

export function isBookChunkId(id: string): boolean {
  return /^book-/i.test(id) || /-\d{3,4}[a-z]?$/i.test(id);
}

function tokens(text: string): string[] {
  return (text.toLowerCase().match(/[a-z][a-z0-9'-]{3,}/g) ?? []).filter(
    (w) => !STOP.has(w)
  );
}

function overlapScore(a: string, bTokens: Set<string>): number {
  const t = tokens(a);
  if (!t.length || !bTokens.size) return 0;
  let hits = 0;
  const seen = new Set<string>();
  for (const w of t) {
    if (seen.has(w)) continue;
    seen.add(w);
    if (bTokens.has(w)) hits += 1;
  }
  return hits / Math.max(seen.size, 1);
}

export function overlapWithAnswer(answer: string, chunk: SourceChunk): number {
  return overlapScore(chunk.text, new Set(tokens(answer)));
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
}

/** Strip markdown bold/italic markers so Used for never shows raw **. */
export function stripMarkdownMarkers(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/[*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : [text];
}

/**
 * Closing offers / "shall I tell you more about…" lines are conversation, not claims.
 * They must not get evidence cards or drive Used for / retrieval overlap.
 */
export function isFollowUpOffer(text: string): boolean {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return false;
  return /\b(?:if you (?:are |would be )?interested|would you like(?: to)?|shall I(?: also)?|I (?:can|could|might) (?:also )?(?:share|tell|speak|say more)|care to hear|want (?:to know|me to)|more about|happy to (?:tell|share|continue)|ask me about|let me know if)\b/i.test(
    t
  );
}

/** Answer text with closing offers removed — for overlap / Used for derivation. */
export function factualAnswerText(answer: string): string {
  return splitSentences(cleanText(answer))
    .filter((s) => !isFollowUpOffer(s))
    .join(" ")
    .trim();
}

/** Cut a short quote from the chunk that actually overlaps the answer. */
export function excerptFromSource(
  text: string,
  answer: string,
  maxChars = MAX_EXCERPT
): string {
  const cleaned = cleanText(text);
  if (!cleaned) return "";
  const focus = factualAnswerText(answer) || answer;
  const answerTok = new Set(tokens(focus));
  const sentences = splitSentences(cleaned);

  let bestIdx = 0;
  let best = -1;
  for (let i = 0; i < sentences.length; i++) {
    const score = overlapScore(sentences[i], answerTok);
    if (score > best) {
      best = score;
      bestIdx = i;
    }
  }

  let excerpt = sentences[bestIdx] ?? cleaned;
  if (
    sentences[bestIdx + 1] &&
    excerpt.length < maxChars * 0.55 &&
    overlapScore(sentences[bestIdx + 1], answerTok) >= best * 0.4
  ) {
    excerpt = `${excerpt} ${sentences[bestIdx + 1]}`;
  }

  if (excerpt.length > maxChars) {
    excerpt = `${excerpt.slice(0, maxChars).replace(/\s+\S*$/, "")}…`;
  }
  return excerpt;
}

export function sanitizeUsedFor(raw: string, answer: string): string {
  let s = stripMarkdownMarkers(raw.replace(/\s+/g, " "));
  if (!s) return "";
  if (isFollowUpOffer(s)) return "";
  if (s.length > MAX_USED_FOR) {
    s = `${s.slice(0, MAX_USED_FOR).replace(/\s+\S*$/, "")}…`;
  }
  void answer;
  return s;
}

/** Pick the answer sentence that best matches this chunk — for Used for. */
export function deriveUsedForFromAnswer(
  answer: string,
  chunk: SourceChunk
): string {
  const sentences = splitSentences(cleanText(answer)).filter(
    (s) => s.length > 24 && s.length < 220 && !isFollowUpOffer(s)
  );
  if (!sentences.length) return "";
  const chunkTok = new Set(tokens(chunk.text));
  let best = "";
  let bestScore = 0;
  for (const s of sentences) {
    const score = overlapScore(s, chunkTok);
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  if (bestScore < 0.18 || !best) return "";
  // Shorten to a claim phrase, not a full speech paragraph.
  let claim = stripMarkdownMarkers(
    best.replace(/^(?:I |we |and |also )/i, "").trim()
  );
  if (claim.length > MAX_USED_FOR) {
    claim = `${claim.slice(0, MAX_USED_FOR).replace(/\s+\S*$/, "")}…`;
  }
  if (!claim) return "";
  return claim.charAt(0).toUpperCase() + claim.slice(1);
}

function fallbackUsedFor(answer: string, chunk: SourceChunk): string {
  const fromAnswer = deriveUsedForFromAnswer(answer, chunk);
  if (fromAnswer) return fromAnswer;
  const topic = chunk.topics.find((t) => t.length > 3 && t.length < 48);
  if (topic) {
    return topic.charAt(0).toUpperCase() + topic.slice(1);
  }
  return "";
}

const GENERIC_CLAIM = new Set([
  ...STOP,
  "coronado",
  "diego",
  "california",
  "local",
  "often",
  "island",
  "city",
  "hotel",
  "del",
  "tent",
  "bay",
  "years",
  "year",
  "time",
  "place",
  "people",
  "company",
]);

/** Drop cards where the excerpt does not actually back the Used for claim. */
export function evidenceSupportsClaim(
  usedFor: string,
  excerpt: string,
  chunk: SourceChunk
): boolean {
  if (!usedFor || isFollowUpOffer(usedFor)) return false;
  if (!excerpt || excerpt.length < 20) return false;
  const claimTok = tokens(usedFor);
  if (!claimTok.length) return false;

  const pool = `${excerpt} ${chunk.text}`.toLowerCase();
  const distinctive = claimTok.filter((w) => !GENERIC_CLAIM.has(w) && w.length > 4);
  if (distinctive.length >= 2) {
    const covered = distinctive.filter((w) => pool.includes(w)).length;
    if (covered / distinctive.length < 0.34) return false;
  }

  const claimSet = new Set(claimTok);
  const excerptScore = overlapScore(excerpt, claimSet);
  const chunkScore = overlapScore(chunk.text, claimSet);
  return excerptScore >= 0.12 || chunkScore >= 0.15;
}

/**
 * If the model cited a long book page but a short curated claim in the
 * retrieved pool covers the same facts better, prefer the curated source.
 */
export function preferCuratedSources(
  answer: string,
  cited: SourceChunk[],
  retrieved: SourceChunk[],
  curatedIds: Set<string>
): SourceChunk[] {
  const factual = factualAnswerText(answer) || answer;
  const out = [...cited];
  const have = new Set(out.map((s) => s.id));
  const curatedHits = retrieved
    .filter((s) => curatedIds.has(s.id) && !have.has(s.id))
    .map((s) => ({ s, score: overlapWithAnswer(factual, s) }))
    .filter((x) => x.score >= 0.18)
    .sort((a, b) => b.score - a.score);

  for (const { s, score } of curatedHits) {
    const bookIdx = out.findIndex((c) => {
      if (curatedIds.has(c.id)) return false;
      return overlapWithAnswer(factual, c) + 0.04 < score;
    });
    if (bookIdx >= 0) {
      have.delete(out[bookIdx].id);
      out[bookIdx] = s;
      have.add(s.id);
    } else if (out.length < MAX_ITEMS) {
      out.push(s);
      have.add(s.id);
    }
  }
  return out.slice(0, MAX_ITEMS);
}

export function selectEvidenceChunks(opts: {
  answer: string;
  cited: SourceChunk[];
  retrieved: SourceChunk[];
  curatedIds: Set<string>;
}): SourceChunk[] {
  const factual = factualAnswerText(opts.answer) || opts.answer;
  if (opts.cited.length > 0) {
    return preferCuratedSources(
      factual,
      opts.cited,
      opts.retrieved,
      opts.curatedIds
    );
  }
  const ranked = [...opts.retrieved]
    .map((s) => ({
      s,
      score: overlapWithAnswer(factual, s),
      curated: opts.curatedIds.has(s.id) ? 1 : 0,
    }))
    .filter((x) => x.score >= 0.12)
    .sort((a, b) => b.curated - a.curated || b.score - a.score)
    .slice(0, MAX_ITEMS)
    .map((x) => x.s);
  return ranked;
}

export function buildEvidenceItems(opts: {
  answer: string;
  cited: SourceChunk[];
  retrieved: SourceChunk[];
  curatedIds: Set<string>;
  usedForById: Map<string, string>;
}): EvidenceItem[] {
  const preferred = selectEvidenceChunks(opts);
  const factual = factualAnswerText(opts.answer) || opts.answer;

  const items: EvidenceItem[] = [];
  for (const chunk of preferred) {
    const raw =
      opts.usedForById.get(chunk.id) ||
      opts.usedForById.get(chunk.id.toLowerCase()) ||
      "";
    const usedFor = stripMarkdownMarkers(
      sanitizeUsedFor(raw, opts.answer) ||
        fallbackUsedFor(opts.answer, chunk)
    );
    if (!usedFor || isFollowUpOffer(usedFor)) continue;

    const excerpt = excerptFromSource(chunk.text, factual);
    if (!evidenceSupportsClaim(usedFor, excerpt, chunk)) continue;

    items.push({
      id: chunk.id,
      usedFor,
      excerpt,
      citation: chunk.citation,
      ...(chunk.url ? { url: chunk.url } : {}),
    });
  }
  return items;
}

export function parseUsedSourceEntries(
  raw: unknown
): { id: string; usedFor: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { id: string; usedFor: string }[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) {
      out.push({ id: item.trim(), usedFor: "" });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const rec = item as { id?: unknown; used_for?: unknown; usedFor?: unknown };
    const id = typeof rec.id === "string" ? rec.id.trim() : "";
    if (!id) continue;
    const usedFor =
      typeof rec.used_for === "string"
        ? rec.used_for.trim()
        : typeof rec.usedFor === "string"
          ? rec.usedFor.trim()
          : "";
    out.push({ id, usedFor });
  }
  return out;
}
