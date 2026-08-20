import type { PersonaPack } from "@/personas/types";
import type { EvidenceLabel, ImageAsset, SourceChunk } from "@/lib/types";
import { hasLegacyBridgeFraming, detectAnachronism } from "@/lib/temporalPolicy";

export interface VerifierInput {
  answer: string;
  evidenceLabel: EvidenceLabel;
  usedSourceIds: string[];
  retrieved: SourceChunk[];
  images: ImageAsset[];
  userQuery: string;
  pack: PersonaPack;
  /** Portrait image id — never strip on identity/appearance. */
  portraitImageId?: string;
  isIdentityQuery?: boolean;
  isAppearanceQuery?: boolean;
}

export interface VerifierResult {
  answer: string;
  evidenceLabel: EvidenceLabel;
  usedSourceIds: string[];
  images: ImageAsset[];
  issues: string[];
  needsRewrite: boolean;
  rewriteHint: string;
}

interface Invariant {
  id: string;
  /** Return true when the answer violates the rule. */
  fails: (answer: string, query: string) => boolean;
  hint: string;
}

const STOP = new Set([
  "about",
  "after",
  "again",
  "among",
  "because",
  "before",
  "being",
  "between",
  "could",
  "every",
  "from",
  "have",
  "here",
  "into",
  "just",
  "like",
  "many",
  "more",
  "most",
  "much",
  "only",
  "other",
  "over",
  "same",
  "should",
  "some",
  "such",
  "than",
  "that",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "under",
  "very",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would",
  "your",
  "record",
  "tells",
  "history",
  "later",
  "beyond",
  "speaking",
]);

/** Persona-specific hard contradictions we have already seen in the wild. */
const INVARIANTS_BY_SLUG: Record<string, Invariant[]> = {
  "john-d-spreckels": [
    {
      id: "tent-city-not-original-del-build",
      fails: (answer) => {
        if (!/\btent city\b/i.test(answer)) return false;
        const claimsDuringOriginalBuild =
          /\b(?:while|during|before)\b[\s\S]{0,80}\b(?:hotel del|the del|hotel)\b[\s\S]{0,80}\b(?:under construction|being built|was built|construction)\b/i.test(
            answer
          ) ||
          /\b(?:hotel del|the del)\b[\s\S]{0,80}\b(?:under construction|being built)\b[\s\S]{0,120}\btent city\b/i.test(
            answer
          ) ||
          /\b(?:1887|1888|late 1880s)\b[\s\S]{0,100}\btent city\b/i.test(answer) ||
          /\btent city\b[\s\S]{0,100}\b(?:1887|1888|late 1880s)\b/i.test(answer);
        if (!claimsDuringOriginalBuild) return false;
        // Allow answers that explicitly correct the chronology.
        const corrects =
          /\b(?:opened in 1888|hotel (?:itself )?opened|twelve years|12 years|not created to house|already[- ]operating|already open)\b/i.test(
            answer
          ) && /\b1900\b/.test(answer);
        return !corrects;
      },
      hint: `CHRONOLOGY ERROR: The Hotel del Coronado opened in 1888. Tent City opened in 1900 — about twelve years later — as an affordable adjunct beside the already-open Del. NEVER say Tent City housed guests during the Del's original late-1880s construction. Correct the chronology plainly.`,
    },
    {
      id: "monte-carlo-no-involvement",
      fails: (answer, query) => {
        if (!/\bmonte carlo\b/i.test(answer) && !/\bmonte carlo\b/i.test(query))
          return false;
        // Positive claim of running/owning/participating in the gambling ship.
        return /\b(?:I (?:ran|owned|operated|financed|backed|built)|my (?:gambling|casino)|I was (?:involved|behind))\b[\s\S]{0,60}\b(?:monte carlo|gambling ship|casino)\b/i.test(
          answer
        );
      },
      hint: `INVOLVEMENT ERROR: Deny any personal role in the SS Monte Carlo / gambling-ship episode. From 1912 you knew no such casino ship; the later record places it in the 1930s after your death. Use legacy-bridge framing; label inference.`,
    },
  ],
  "william-g-dana": [
    {
      id: "not-richard-henry-dana-jr",
      fails: (answer) => {
        const claimsIdentity =
          /\b(?:I (?:am|wrote|authored)|my book|my memoir)\b[\s\S]{0,80}\b(?:two years before the mast|richard henry dana)\b/i.test(
            answer
          ) ||
          /\b(?:two years before the mast)\b[\s\S]{0,80}\b(?:I wrote|I am the author|my book)\b/i.test(
            answer
          );
        if (!claimsIdentity) return false;
        const corrects =
          /\b(?:not (?:the same|I)|kinsman|relative|different (?:man|dana)|richard henry)\b/i.test(
            answer
          );
        return !corrects;
      },
      hint: `IDENTITY ERROR: You are Capt. William Goodwin Dana of Nipomo, not Richard Henry Dana Jr., author of Two Years Before the Mast. Correct the confusion plainly.`,
    },
  ],
};

function yearsInText(text: string): number[] {
  const out: number[] = [];
  // Bare years (1888) and decade forms (1930s → 1930).
  for (const m of text.matchAll(/\b(1[6-9]\d{2}|20\d{2})s?\b/g)) {
    out.push(parseInt(m[1], 10));
  }
  return [...new Set(out)];
}

function contentTokens(text: string): string[] {
  return (text.toLowerCase().match(/[a-z][a-z0-9'-]{3,}/g) ?? []).filter(
    (w) => !STOP.has(w)
  );
}

function sourceBlob(chunks: SourceChunk[]): string {
  return chunks.map((c) => `${c.text} ${c.topics.join(" ")}`).join("\n").toLowerCase();
}

function overlapRatio(answer: string, sources: SourceChunk[]): number {
  if (!sources.length) return 0;
  const tokens = contentTokens(answer);
  if (tokens.length < 8) return 1; // too short to judge; don't punish
  const blob = sourceBlob(sources);
  let hits = 0;
  const seen = new Set<string>();
  for (const t of tokens) {
    if (seen.has(t)) continue;
    seen.add(t);
    if (blob.includes(t)) hits += 1;
  }
  return hits / Math.max(seen.size, 1);
}

function resolveUsedSources(
  usedIds: string[],
  retrieved: SourceChunk[]
): SourceChunk[] {
  const norm = (id: string) => id.replace(/^0+/, "").toLowerCase();
  const byNorm = new Map(retrieved.map((s) => [norm(s.id), s]));
  const out: SourceChunk[] = [];
  for (const id of usedIds) {
    const hit =
      retrieved.find((s) => s.id === id) ?? byNorm.get(norm(id));
    if (hit) out.push(hit);
  }
  return out;
}

function yearsSupportedBySources(years: number[], sources: SourceChunk[]): number[] {
  if (!sources.length) return [];
  const blob = sourceBlob(sources);
  return years.filter((y) => blob.includes(String(y)));
}

/**
 * Deterministic post-generation verifier.
 * Downgrades dishonest labels, strips unsupported images, and flags rewrites
 * for chronology/involvement contradictions and unframed post-era claims.
 */
export function verifyGroundedAnswer(input: VerifierInput): VerifierResult {
  const issues: string[] = [];
  let { answer, evidenceLabel, usedSourceIds, images } = input;
  const speakingYear = input.pack.temporalYear ?? 1905;
  const retrieved = input.retrieved;
  const usedSources = resolveUsedSources(usedSourceIds, retrieved);
  const groundingPool = usedSources.length > 0 ? usedSources : retrieved;

  // --- 1. Label honesty: empty citations ---
  if (
    evidenceLabel === "documented" &&
    usedSources.length === 0 &&
    !input.isIdentityQuery
  ) {
    evidenceLabel = "inference";
    issues.push("documented-without-cited-sources→inference");
  }

  // --- 2. Post-era years ---
  const years = yearsInText(answer);
  const postYears = years.filter((y) => y > speakingYear);
  const bridged = hasLegacyBridgeFraming(answer);
  const anachronistic = detectAnachronism(answer, speakingYear);

  if (postYears.length > 0) {
    const supportedPost = yearsSupportedBySources(postYears, groundingPool);
    if (bridged) {
      // Later-record narration must not wear a "documented" badge unless sources
      // actually state those later years.
      if (
        evidenceLabel === "documented" &&
        supportedPost.length < postYears.length
      ) {
        evidenceLabel = "inference";
        issues.push("post-era-bridge-documented→inference");
      }
    } else if (anachronistic) {
      issues.push("post-era-without-bridge");
    }
  }

  // --- 3. Lexical grounding for "documented" ---
  // Score against cited sources AND the retrieved pool. Citing one short curated
  // chunk while paraphrasing a fuller answer used to fail the threshold and
  // cascade every Spreckels reply into "inference".
  if (evidenceLabel === "documented" && (usedSources.length > 0 || retrieved.length > 0)) {
    const ratio = Math.max(
      usedSources.length ? overlapRatio(answer, usedSources) : 0,
      retrieved.length ? overlapRatio(answer, retrieved) : 0
    );
    if (ratio < 0.14) {
      evidenceLabel = "inference";
      issues.push(`weak-source-overlap(${ratio.toFixed(2)})→inference`);
    }
  }

  // --- 3b. Upgrade over-cautious "inference" when citations clearly support ---
  if (evidenceLabel === "inference" && usedSources.length > 0) {
    const laterYears = yearsInText(answer).filter((y) => y > speakingYear);
    const bridgedLater =
      hasLegacyBridgeFraming(answer) &&
      laterYears.length > 0 &&
      yearsSupportedBySources(laterYears, groundingPool).length < laterYears.length;
    if (!bridgedLater) {
      const ratio = Math.max(
        overlapRatio(answer, usedSources),
        retrieved.length ? overlapRatio(answer, retrieved) : 0
      );
      if (ratio >= 0.2) {
        evidenceLabel = "documented";
        issues.push(`inference-strong-overlap(${ratio.toFixed(2)})→documented`);
      }
    }
  }

  // --- 4. Persona invariants ---
  const invariants = INVARIANTS_BY_SLUG[input.pack.public.slug] ?? [];
  const failedHints: string[] = [];
  for (const inv of invariants) {
    if (inv.fails(answer, input.userQuery)) {
      issues.push(`invariant:${inv.id}`);
      failedHints.push(inv.hint);
    }
  }

  // --- 5. Image gate: unknown answers show no images; caption must touch answer ---
  if (evidenceLabel === "unknown") {
    images = [];
  } else {
    const hay = answer.toLowerCase();
    images = images.filter((img) => {
      if (
        img.id === (input.portraitImageId ?? "img-portrait") &&
        (input.isIdentityQuery || input.isAppearanceQuery)
      ) {
        return true;
      }
      const captionBits = `${img.caption} ${img.alt} ${img.topics.join(" ")}`
        .toLowerCase()
        .match(/[a-z][a-z0-9'-]{3,}/g) ?? [];
      const distinctive = [
        ...new Set(captionBits.filter((w) => !STOP.has(w))),
      ].slice(0, 12);
      if (!distinctive.length) return true;
      // Prefer multi-word caption phrases (e.g. "tent city") over shared place names.
      const captionLower = `${img.caption} ${img.alt}`.toLowerCase();
      const phrases = captionLower.match(
        /\b(?:tent city|hotel del|buchon street|north island|mission san|walnut creek)\b/g
      );
      if (phrases?.length) {
        if (!phrases.some((p) => hay.includes(p))) {
          issues.push(`image-stripped:${img.id}`);
          return false;
        }
        return true;
      }
      const hits = distinctive.filter((w) => hay.includes(w)).length;
      const need = Math.min(2, distinctive.length);
      if (hits < need) {
        issues.push(`image-stripped:${img.id}`);
        return false;
      }
      return true;
    });
  }

  const needsRewrite = failedHints.length > 0 || anachronistic;
  const rewriteHint = [
    ...failedHints,
    anachronistic
      ? `TEMPORAL: You speak from ${speakingYear}. Post-${speakingYear} facts need explicit legacy-bridge framing ("after my time / the record tells us") and must not claim firsthand memory. Prefer label "inference" for later-record facts.`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    answer,
    evidenceLabel,
    usedSourceIds,
    images,
    issues,
    needsRewrite,
    rewriteHint,
  };
}

/** Prompt appendix for a single verifier-triggered rewrite. */
export function verifierRewritePrompt(pack: PersonaPack, hint: string): string {
  const year = pack.temporalYear ?? 1905;
  return `
# VERIFIER REWRITE (mandatory)
Your previous draft failed historical accuracy checks. Rewrite the JSON answer for ${pack.public.name} speaking from ${year}.

Fix these issues:
${hint}

Rules:
- Stay in character. Use retrieved SOURCES.
- Correct false chronology or false personal involvement explicitly.
- For post-${year} facts: legacy bridge + third person; label "inference" unless a source directly states the later fact.
- Do not attach images that do not depict what you are discussing.
- Return the same JSON schema (answer, evidence_label, used_source_ids, image_ids).
`.trim();
}
