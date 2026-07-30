import type { SourceChunk, SourceSemantic } from "@/lib/types";

/** A named historical entity with aliases for query matching. */
export interface SemanticEntity {
  id: string;
  label: string;
  aliases: string[];
}

export interface SemanticPeriod {
  id: string;
  label: string;
  yearStart: number;
  yearEnd: number;
  aliases: string[];
}

/**
 * Controlled vocabulary for one persona (or shared later).
 * Keeps extraction/matching from inventing unbounded junk labels.
 */
export interface PersonaSemanticVocab {
  people: SemanticEntity[];
  places: SemanticEntity[];
  organizations: SemanticEntity[];
  events: SemanticEntity[];
  periods: SemanticPeriod[];
}

/** Per-source semantic tags keyed by SourceChunk.id. */
export type SourceSemanticAnnotations = Record<string, SourceSemantic>;

export interface QuerySemanticIntent {
  people: string[];
  places: string[];
  organizations: string[];
  events: string[];
  periods: string[];
  yearStart?: number;
  yearEnd?: number;
  /** True when the query named at least one vocab entity or year. */
  hasSignal: boolean;
}

const SEMANTIC_ENTITY_BOOST = 0.12;
const SEMANTIC_YEAR_BOOST = 0.1;
const SEMANTIC_TOPIC_BOOST = 0.06;
const SEMANTIC_BOOST_CAP = 0.4;
/** Book OCR tags are noisier than curated — scale their boost down. */
const BOOK_SEMANTIC_SCALE = 0.4;
/** Chunk year spans wider than this get little/no year-only boost. */
const YEAR_SPAN_FULL_BOOST_MAX = 15;
const YEAR_SPAN_HALF_BOOST_MAX = 30;
const YEAR_SPAN_QUARTER_BOOST_MAX = 50;
/** Auto-tag: ignore year ranges wider than this (OCR date laundry lists). */
export const AUTO_YEAR_SPAN_MAX = 30;

/** Pull a year span from human dateRange strings when possible. */
export function parseYearSpan(
  dateRange?: string
): { yearStart?: number; yearEnd?: number } {
  if (!dateRange) return {};
  const s = dateRange.toLowerCase();
  if (/pre-contact|geological|career-long|millennia|historical\b/.test(s)) {
    return {};
  }
  // Book-level "pre-1883" is too blunt for retrieval — ignore.
  if (/^pre-\d{4}$/i.test(dateRange.trim())) return {};

  const years = [...s.matchAll(/\b(1[5-9]\d{2}|20\d{2})\b/g)].map((m) =>
    parseInt(m[1], 10)
  );
  if (years.length === 0) {
    const decade = s.match(/\b(1[5-9]\d)0s\b/);
    if (decade) {
      const start = parseInt(`${decade[1]}0`, 10);
      return { yearStart: start, yearEnd: start + 9 };
    }
    return {};
  }
  return {
    yearStart: Math.min(...years),
    yearEnd: Math.max(...years),
  };
}

/** Years mentioned in chunk body (for book OCR). Drops laundry-list spans. */
export function yearsFromChunkText(text: string): {
  yearStart?: number;
  yearEnd?: number;
} {
  const years = [...text.matchAll(/\b(1[6-9]\d{2}|20[0-2]\d)\b/g)].map((m) =>
    parseInt(m[1], 10)
  );
  if (years.length === 0) return {};
  const yearStart = Math.min(...years);
  const yearEnd = Math.max(...years);
  if (yearEnd - yearStart > AUTO_YEAR_SPAN_MAX) return {};
  return { yearStart, yearEnd };
}

function normalizeHay(s: string): string {
  return s.toLowerCase().replace(/['']/g, "'");
}

/** Prefer word-boundary matches so short aliases ("angel", "brooks") don't false-hit. */
export function textMentionsTerm(hay: string, rawTerm: string): boolean {
  const t = normalizeHay(rawTerm).trim();
  if (t.length < 3) return false;
  if (t.length <= 5 || !t.includes(" ")) {
    const re = new RegExp(
      `(?:^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:[^a-z0-9]|$)`,
      "i"
    );
    return re.test(hay);
  }
  return hay.includes(t);
}

function entityMatchesHay(entity: SemanticEntity, hay: string): boolean {
  const terms = [entity.label, ...entity.aliases, entity.id.replace(/-/g, " ")];
  for (const raw of terms) {
    if (textMentionsTerm(hay, raw)) return true;
  }
  return false;
}

function periodMatchesHay(period: SemanticPeriod, hay: string): boolean {
  const terms = [period.label, ...period.aliases, period.id.replace(/-/g, " ")];
  for (const raw of terms) {
    const t = normalizeHay(raw).trim();
    if (t.length < 4) continue;
    if (textMentionsTerm(hay, t)) return true;
  }
  return false;
}

/**
 * Tag free text with controlled vocab (book OCR enrichment).
 * Only emits ids whose labels/aliases actually appear in the text.
 */
export function tagTextWithVocab(
  text: string,
  vocab: PersonaSemanticVocab
): SourceSemantic {
  const hay = normalizeHay(text);
  const people = vocab.people.filter((e) => entityMatchesHay(e, hay)).map((e) => e.id);
  const places = vocab.places.filter((e) => entityMatchesHay(e, hay)).map((e) => e.id);
  const organizations = vocab.organizations
    .filter((e) => entityMatchesHay(e, hay))
    .map((e) => e.id);
  const events = vocab.events.filter((e) => entityMatchesHay(e, hay)).map((e) => e.id);
  const periodHit = vocab.periods.find((p) => periodMatchesHay(p, hay));
  const years = yearsFromChunkText(text);

  const out: SourceSemantic = {};
  if (people.length) out.people = people;
  if (places.length) out.places = places;
  if (organizations.length) out.organizations = organizations;
  if (events.length) out.events = events;
  if (periodHit) out.period = periodHit.id;
  if (years.yearStart != null) {
    out.yearStart = years.yearStart;
    out.yearEnd = years.yearEnd;
  }
  return out;
}

function semanticIsEmpty(s: SourceSemantic): boolean {
  return !(
    (s.people?.length ?? 0) ||
    (s.places?.length ?? 0) ||
    (s.organizations?.length ?? 0) ||
    (s.events?.length ?? 0) ||
    s.period ||
    s.yearStart != null
  );
}

export { semanticIsEmpty };

/** Detect entities / years mentioned in the user question. */
export function detectQueryIntent(
  query: string,
  vocab?: PersonaSemanticVocab | null
): QuerySemanticIntent {
  const empty: QuerySemanticIntent = {
    people: [],
    places: [],
    organizations: [],
    events: [],
    periods: [],
    hasSignal: false,
  };
  const hay = normalizeHay(query);
  if (!hay.trim()) return empty;

  const years = [...hay.matchAll(/\b(1[5-9]\d{2}|20\d{2})\b/g)].map((m) =>
    parseInt(m[1], 10)
  );
  let yearStart: number | undefined;
  let yearEnd: number | undefined;
  if (years.length === 0) {
    const decade = hay.match(/\b(1[5-9]\d)0s\b/);
    if (decade) {
      yearStart = parseInt(`${decade[1]}0`, 10);
      yearEnd = yearStart + 9;
    }
  } else {
    yearStart = Math.min(...years);
    yearEnd = Math.max(...years);
  }

  if (!vocab) {
    return {
      ...empty,
      yearStart,
      yearEnd,
      hasSignal: yearStart != null,
    };
  }

  const people = vocab.people.filter((e) => entityMatchesHay(e, hay)).map((e) => e.id);
  const places = vocab.places.filter((e) => entityMatchesHay(e, hay)).map((e) => e.id);
  const organizations = vocab.organizations
    .filter((e) => entityMatchesHay(e, hay))
    .map((e) => e.id);
  const events = vocab.events.filter((e) => entityMatchesHay(e, hay)).map((e) => e.id);
  const periods = vocab.periods
    .filter((p) => periodMatchesHay(p, hay))
    .map((p) => p.id);

  // Period alias hit can imply a year window when the query didn't name a year.
  if (yearStart == null && periods.length > 0) {
    const matched = vocab.periods.filter((p) => periods.includes(p.id));
    if (matched.length > 0) {
      yearStart = Math.min(...matched.map((p) => p.yearStart));
      yearEnd = Math.max(...matched.map((p) => p.yearEnd));
    }
  }

  const hasSignal =
    people.length +
      places.length +
      organizations.length +
      events.length +
      periods.length >
      0 ||
    yearStart != null;

  return {
    people,
    places,
    organizations,
    events,
    periods,
    yearStart,
    yearEnd,
    hasSignal,
  };
}

function chunkYears(chunk: SourceChunk): {
  yearStart?: number;
  yearEnd?: number;
} {
  const sem = chunk.semantic;
  if (sem?.yearStart != null || sem?.yearEnd != null) {
    return {
      yearStart: sem.yearStart ?? sem.yearEnd,
      yearEnd: sem.yearEnd ?? sem.yearStart,
    };
  }
  return parseYearSpan(chunk.dateRange);
}

function yearsOverlap(
  aStart?: number,
  aEnd?: number,
  bStart?: number,
  bEnd?: number
): boolean {
  if (aStart == null || bStart == null) return false;
  const aE = aEnd ?? aStart;
  const bE = bEnd ?? bStart;
  return aStart <= bE && bStart <= aE;
}

/** Wide chunk spans (mission "1772–1905") should not fully match a decade query. */
function yearBoostMultiplier(chunkStart?: number, chunkEnd?: number): number {
  if (chunkStart == null) return 0;
  const span = (chunkEnd ?? chunkStart) - chunkStart;
  if (span <= YEAR_SPAN_FULL_BOOST_MAX) return 1;
  if (span <= YEAR_SPAN_HALF_BOOST_MAX) return 0.5;
  if (span <= YEAR_SPAN_QUARTER_BOOST_MAX) return 0.25;
  return 0;
}

function listOverlap(a: string[] | undefined, b: string[]): number {
  if (!a?.length || !b.length) return 0;
  const set = new Set(a.map((x) => x.toLowerCase()));
  let n = 0;
  for (const id of b) {
    if (set.has(id.toLowerCase())) n += 1;
  }
  return n;
}

/**
 * Soft score boost when chunk semantic tags match the query intent.
 * Does not hard-filter — sparse/untagged corpora still retrieve via cosine.
 *
 * Guards against "garbage in":
 * - year-only boosts shrink/vanish on wide spans
 * - book OCR tags get a reduced scale vs curated claims
 * - entity boosts require tag overlap (book tags only written when text matched)
 */
export function semanticScoreForChunk(
  chunk: SourceChunk,
  intent: QuerySemanticIntent,
  opts?: { curated?: boolean }
): number {
  if (!intent.hasSignal) return 0;

  let score = 0;
  const sem = chunk.semantic;
  const scale = opts?.curated === false ? BOOK_SEMANTIC_SCALE : 1;

  const entityHits =
    listOverlap(sem?.people, intent.people) +
    listOverlap(sem?.places, intent.places) +
    listOverlap(sem?.organizations, intent.organizations) +
    listOverlap(sem?.events, intent.events) +
    (intent.periods.length && sem?.period && intent.periods.includes(sem.period)
      ? 1
      : 0);

  score += listOverlap(sem?.people, intent.people) * SEMANTIC_ENTITY_BOOST;
  score += listOverlap(sem?.places, intent.places) * SEMANTIC_ENTITY_BOOST;
  score +=
    listOverlap(sem?.organizations, intent.organizations) * SEMANTIC_ENTITY_BOOST;
  score += listOverlap(sem?.events, intent.events) * SEMANTIC_ENTITY_BOOST;

  if (intent.periods.length && sem?.period) {
    if (intent.periods.includes(sem.period)) score += SEMANTIC_ENTITY_BOOST;
  }

  if (intent.yearStart != null) {
    const cy = chunkYears(chunk);
    if (yearsOverlap(intent.yearStart, intent.yearEnd, cy.yearStart, cy.yearEnd)) {
      const mult = yearBoostMultiplier(cy.yearStart, cy.yearEnd);
      // Year-only on a vague span: no boost. With entity hit, allow reduced year nudge.
      if (mult > 0) {
        score += SEMANTIC_YEAR_BOOST * mult;
      } else if (entityHits > 0) {
        score += SEMANTIC_YEAR_BOOST * 0.15;
      }
    }
  }

  if (chunk.topics?.length) {
    const topicHay = chunk.topics.join(" ").toLowerCase();
    for (const id of [
      ...intent.events,
      ...intent.places,
      ...intent.people,
      ...intent.organizations,
    ]) {
      const needle = id.replace(/-/g, " ");
      if (needle.length >= 4 && topicHay.includes(needle)) {
        score += SEMANTIC_TOPIC_BOOST;
      }
    }
  }

  return Math.min(score * scale, SEMANTIC_BOOST_CAP);
}

/** Merge annotations + fill missing years from dateRange (clamps absurd spans). */
export function applySemanticAnnotations(
  sources: SourceChunk[],
  annotations?: SourceSemanticAnnotations | null
): SourceChunk[] {
  return sources.map((s) => {
    const ann = annotations?.[s.id];
    const parsed = parseYearSpan(s.dateRange);
    let semantic: SourceSemantic | undefined = ann
      ? {
          ...ann,
          yearStart: ann.yearStart ?? parsed.yearStart,
          yearEnd: ann.yearEnd ?? parsed.yearEnd,
        }
      : s.semantic
        ? {
            ...s.semantic,
            yearStart: s.semantic.yearStart ?? parsed.yearStart,
            yearEnd: s.semantic.yearEnd ?? parsed.yearEnd,
          }
        : parsed.yearStart != null
          ? { yearStart: parsed.yearStart, yearEnd: parsed.yearEnd }
          : undefined;

    if (semantic?.yearStart != null && semantic.yearEnd != null) {
      const span = semantic.yearEnd - semantic.yearStart;
      // Keep entity tags, but drop years that are too wide to be useful for retrieval.
      if (span > YEAR_SPAN_QUARTER_BOOST_MAX) {
        const { yearStart: _ys, yearEnd: _ye, ...rest } = semantic;
        semantic = rest;
      }
    }

    if (!semantic || semanticIsEmpty(semantic)) {
      const { semantic: _drop, ...rest } = s;
      return rest as SourceChunk;
    }
    return { ...s, semantic };
  });
}

function labelFor(
  id: string,
  list: SemanticEntity[] | SemanticPeriod[] | undefined
): string {
  const hit = list?.find((e) => e.id === id);
  return hit?.label ?? id.replace(/-/g, " ");
}

/** Short structured brief for the LLM (entities/years across retrieved hits). */
export function formatSemanticBrief(
  sources: SourceChunk[],
  intent: QuerySemanticIntent,
  vocab?: PersonaSemanticVocab | null
): string {
  const people = new Set<string>();
  const places = new Set<string>();
  const events = new Set<string>();
  const orgs = new Set<string>();
  const periods = new Set<string>();
  let minY: number | undefined;
  let maxY: number | undefined;

  for (const s of sources) {
    const sem = s.semantic;
    if (!sem) continue;
    for (const p of sem.people ?? []) people.add(p);
    for (const p of sem.places ?? []) places.add(p);
    for (const e of sem.events ?? []) events.add(e);
    for (const o of sem.organizations ?? []) orgs.add(o);
    if (sem.period) periods.add(sem.period);
    const y = chunkYears(s);
    if (y.yearStart != null) {
      minY = minY == null ? y.yearStart : Math.min(minY, y.yearStart);
      maxY = maxY == null ? (y.yearEnd ?? y.yearStart) : Math.max(maxY, y.yearEnd ?? y.yearStart);
    }
  }

  const lines: string[] = [];
  if (intent.hasSignal) {
    const asked: string[] = [];
    if (intent.people.length)
      asked.push(
        `people: ${intent.people.map((id) => labelFor(id, vocab?.people)).join(", ")}`
      );
    if (intent.places.length)
      asked.push(
        `places: ${intent.places.map((id) => labelFor(id, vocab?.places)).join(", ")}`
      );
    if (intent.events.length)
      asked.push(
        `events: ${intent.events.map((id) => labelFor(id, vocab?.events)).join(", ")}`
      );
    if (intent.organizations.length)
      asked.push(
        `orgs: ${intent.organizations.map((id) => labelFor(id, vocab?.organizations)).join(", ")}`
      );
    if (intent.yearStart != null)
      asked.push(
        `years: ${intent.yearStart}${
          intent.yearEnd != null && intent.yearEnd !== intent.yearStart
            ? `–${intent.yearEnd}`
            : ""
        }`
      );
    if (asked.length) lines.push(`Query matched: ${asked.join("; ")}`);
  }

  if (people.size)
    lines.push(
      `People in sources: ${[...people].map((id) => labelFor(id, vocab?.people)).join(", ")}`
    );
  if (places.size)
    lines.push(
      `Places in sources: ${[...places].map((id) => labelFor(id, vocab?.places)).join(", ")}`
    );
  if (events.size)
    lines.push(
      `Events in sources: ${[...events].map((id) => labelFor(id, vocab?.events)).join(", ")}`
    );
  if (orgs.size)
    lines.push(
      `Organizations in sources: ${[...orgs].map((id) => labelFor(id, vocab?.organizations)).join(", ")}`
    );
  if (periods.size)
    lines.push(
      `Periods: ${[...periods].map((id) => labelFor(id, vocab?.periods)).join(", ")}`
    );
  if (minY != null)
    lines.push(`Year span in sources: ${minY}${maxY != null && maxY !== minY ? `–${maxY}` : ""}`);

  if (!lines.length) return "";
  return `# SEMANTIC CONTEXT (structured tags — still ground claims in SOURCES below)
${lines.join("\n")}`;
}
