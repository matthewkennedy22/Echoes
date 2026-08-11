import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  buildGroundingTemporalBlock,
  detectAnachronism,
  anachronismRetry,
} from "@/lib/temporalPolicy";
import {
  verifyGroundedAnswer,
  verifierRewritePrompt,
} from "@/lib/answerVerifier";
import {
  isContextualFollowUp,
  isHistoricalImageAsset,
  isImageFollowUpQuery,
  isIntroOrMetaQuery,
  isPersonPortraitRequest,
  queryWantsImageSearch,
  searchHistoricalImages,
} from "@/lib/imageSearch";
import {
  filterServeableImages,
  getAvailableLibraryImages,
} from "@/lib/imageAvailability";
import {
  answerSupportsImage,
  detectStoryThemes,
  imageConflictsWithStory,
  imageMatchesQueryIntent,
  imageStoryMatchScore,
  isStrongStoryMatch,
  pickBestStoryImage,
} from "@/lib/imageMatching";
import { IMAGE_ACCURACY_PROMPT } from "@/lib/imageAccuracy";
import { chatJSON, embed, embedMany, EMBED_DIM } from "@/lib/llm";
import { withPersona } from "@/lib/activePersona";
import {
  applySemanticAnnotations,
  detectQueryIntent,
  formatSemanticBrief,
  parseYearSpan,
  semanticScoreForChunk,
  type QuerySemanticIntent,
} from "@/lib/semantic";
import {
  DEFAULT_PERSONA_SLUG,
  getPersonaPack,
} from "@/personas";
import { formatTopicCatalogForPrompt } from "@/personas/topicCatalog";
import type { PersonaPack } from "@/personas/types";
import type {
  ChatMessage,
  EvidenceLabel,
  GroundedAnswer,
  ImageAsset,
  SourceChunk,
} from "@/lib/types";

const TOP_K = 10;
const NEIGHBOR_RADIUS = 1; // also include N chunks before/after each book hit
const CURATED_BOOST = 0.02; // prefer hand-verified facts on near-ties
/** Extra score when query terms (esp. rare names) appear in a chunk. */
const LEXICAL_HIT_BOOST = 0.18;
const LEXICAL_FUZZY_BOOST = 0.14;
const LEXICAL_BOOST_CAP = 0.55;
const IMAGE_CANDIDATES = 5; // local library images to offer the model
const EVIDENCE_LABELS: EvidenceLabel[] = [
  "documented",
  "inference",
  "contested",
  "unknown",
];

const LEXICAL_STOP = new Set([
  "about",
  "after",
  "again",
  "could",
  "did",
  "does",
  "from",
  "have",
  "here",
  "into",
  "just",
  "know",
  "like",
  "more",
  "much",
  "tell",
  "than",
  "that",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "would",
  "your",
  "please",
  "show",
  "luis",
  "san",
  "obispo",
  "county",
  "california",
]);

function queryLexicalTerms(query: string): string[] {
  const raw = query.toLowerCase().match(/[a-z0-9']{4,}/g) ?? [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const t of raw) {
    if (LEXICAL_STOP.has(t) || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

/** True if chunk text mentions term, with light typo tolerance on whole words. */
function textMentionsTerm(hay: string, t: string): boolean {
  if (hay.includes(t)) return true;
  if (t.length < 5) return false;
  const words = hay.match(/[a-z0-9']+/g) ?? [];
  const stem = t.slice(0, -1); // morgant → morgan… but require longer word
  return words.some(
    (w) =>
      w.startsWith(t) ||
      (w.startsWith(stem) && w.length >= t.length && w.length <= t.length + 2)
  );
}

/**
 * Rare query terms (appear in few chunks) get a much stronger boost when matched —
 * this is how "Morganti" / "morgant" beats generic SLO geography embeddings.
 */
function rareTermBoosts(
  corpus: SourceChunk[],
  terms: string[]
): Map<string, number> {
  const boosts = new Map<string, number>();
  if (!terms.length || !corpus.length) return boosts;
  for (const t of terms) {
    let hits = 0;
    for (const c of corpus) {
      if (textMentionsTerm(c.text.toLowerCase(), t)) hits++;
    }
    if (hits === 0) continue;
    // rarer → stronger; cap so one name can dominate retrieval
    if (hits <= 8) boosts.set(t, 0.85);
    else if (hits <= 40) boosts.set(t, 0.35);
    else if (hits <= 200) boosts.set(t, 0.08);
  }
  return boosts;
}

function lexicalScoreForChunk(
  chunkText: string,
  terms: string[],
  rareBoosts: Map<string, number>
): number {
  if (!terms.length) return 0;
  const hay = chunkText.toLowerCase();
  let boost = 0;
  for (const t of terms) {
    if (!textMentionsTerm(hay, t)) continue;
    const rare = rareBoosts.get(t) ?? 0;
    boost += Math.max(LEXICAL_HIT_BOOST, rare);
  }
  return Math.min(boost, 1.2);
}
const CACHE_DIR = path.join(process.cwd(), ".cache");

/** On-disk shape for shipped + local embedding indexes. */
export type EmbeddingIndexFile = {
  hash: string;
  dim: number;
  count: number;
  vectors: number[][];
};

interface PersonaIndex {
  corpus: SourceChunk[];
  curatedCount: number;
  corpusEmbeddings: number[][] | null;
  embeddingJob: Promise<number[][]> | null;
  imageEmbeddings: number[][] | null;
  imageEmbeddingJob: Promise<number[][]> | null;
  hash: string;
}

const indexes = new Map<string, PersonaIndex>();

function bookChunkPathsFor(pack: PersonaPack): string[] {
  if (pack.bookChunksPaths?.length) return pack.bookChunksPaths;
  if (pack.bookChunksPath) return [pack.bookChunksPath];
  return [];
}

/** Load ingested book/OCR chunks (if present) as SourceChunks. */
function resolveBookChunkPath(bookChunksPath: string): string | null {
  const candidates = [
    path.join(process.cwd(), bookChunksPath),
    path.resolve(bookChunksPath),
    // Serverless / traced layouts sometimes nest under the project root twice.
    path.join(process.cwd(), "..", bookChunksPath),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch {
      /* keep trying */
    }
  }
  return null;
}

function loadBookSources(paths: string[]): SourceChunk[] {
  const out: SourceChunk[] = [];
  for (const bookChunksPath of paths) {
    const resolved = resolveBookChunkPath(bookChunksPath);
    if (!resolved) {
      console.warn(
        `[ECHOES] Missing book chunks (not traced or not on disk): ${bookChunksPath}`
      );
      continue;
    }
    try {
      const raw = fs.readFileSync(resolved, "utf8");
      const data = JSON.parse(raw) as SourceChunk[];
      for (const d of data) {
        const parsed = parseYearSpan(d.dateRange);
        const semantic = d.semantic
          ? {
              ...d.semantic,
              yearStart: d.semantic.yearStart ?? parsed.yearStart,
              yearEnd: d.semantic.yearEnd ?? parsed.yearEnd,
            }
          : parsed.yearStart != null
            ? { yearStart: parsed.yearStart, yearEnd: parsed.yearEnd }
            : undefined;
        out.push({
          id: d.id,
          text: d.text,
          topics: d.topics ?? ["local history"],
          dateRange: d.dateRange ?? "historical",
          sourceType: "primary" as const,
          citation: d.citation,
          url: d.url,
          reliability: d.reliability ?? "medium",
          ...(semantic ? { semantic } : {}),
        });
      }
    } catch (err) {
      console.warn(
        `[ECHOES] Failed to load book chunks ${bookChunksPath}:`,
        err instanceof Error ? err.message : err
      );
    }
  }
  return out;
}

/** Stable hash for corpus + embedding dimension (must match embed script). */
export function corpusHashFor(corpus: SourceChunk[]): string {
  const h = crypto.createHash("sha1");
  h.update(`dim:${EMBED_DIM}|n:${corpus.length}`);
  for (const c of corpus) h.update(`${c.id}:${c.text.length}|`);
  return h.digest("hex");
}

/** Build the same corpus the runtime RAG index uses (curated + book chunks). */
export function buildPersonaCorpus(pack: PersonaPack): {
  corpus: SourceChunk[];
  curatedCount: number;
  hash: string;
} {
  const bookSources = loadBookSources(bookChunkPathsFor(pack));
  const curated = applySemanticAnnotations(
    pack.sources,
    pack.semanticAnnotations
  );
  const corpus: SourceChunk[] = [...curated, ...bookSources];
  return {
    corpus,
    curatedCount: curated.length,
    hash: corpusHashFor(corpus),
  };
}

/** Shipped production index (committed / traced with the deploy). */
export function shippedEmbeddingsPath(slug: string): string {
  return path.join(process.cwd(), "personas", slug, "embeddings.json");
}

/** Local-dev cache (gitignored; ephemeral on Vercel). */
export function cacheEmbeddingsPath(slug: string): string {
  return path.join(CACHE_DIR, `${slug}-embeddings.json`);
}

function getOrCreateIndex(pack: PersonaPack): PersonaIndex {
  const slug = pack.public.slug;
  let idx = indexes.get(slug);
  if (idx) return idx;

  const built = buildPersonaCorpus(pack);
  idx = {
    corpus: built.corpus,
    curatedCount: built.curatedCount,
    corpusEmbeddings: null,
    embeddingJob: null,
    imageEmbeddings: null,
    imageEmbeddingJob: null,
    hash: built.hash,
  };
  indexes.set(slug, idx);
  return idx;
}

function parseEmbeddingFile(
  raw: string,
  idx: PersonaIndex
): number[][] | null {
  try {
    const cached = JSON.parse(raw) as EmbeddingIndexFile & {
      vectors: number[][];
    };
    if (
      cached.hash === idx.hash &&
      cached.vectors.length === idx.corpus.length
    ) {
      return cached.vectors;
    }
  } catch {
    /* unusable */
  }
  return null;
}

function tryLoadEmbeddingFile(
  filePath: string,
  idx: PersonaIndex
): number[][] | null {
  try {
    return parseEmbeddingFile(fs.readFileSync(filePath, "utf8"), idx);
  } catch {
    return null;
  }
}

function tryLoadShipped(idx: PersonaIndex, slug: string): number[][] | null {
  return tryLoadEmbeddingFile(shippedEmbeddingsPath(slug), idx);
}

function tryLoadCache(idx: PersonaIndex, slug: string): number[][] | null {
  return tryLoadEmbeddingFile(cacheEmbeddingsPath(slug), idx);
}

function embeddingPayload(
  idx: PersonaIndex,
  vectors: number[][]
): EmbeddingIndexFile {
  return {
    hash: idx.hash,
    dim: EMBED_DIM,
    count: vectors.length,
    vectors,
  };
}

function saveCache(idx: PersonaIndex, slug: string, vectors: number[][]) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(
      cacheEmbeddingsPath(slug),
      JSON.stringify(embeddingPayload(idx, vectors)),
      "utf8"
    );
  } catch {
    /* read-only fs: keep embeddings in memory only */
  }
}

async function ensureEmbeddings(pack: PersonaPack): Promise<number[][]> {
  const idx = getOrCreateIndex(pack);
  if (idx.corpusEmbeddings) return idx.corpusEmbeddings;

  const slug = pack.public.slug;

  const shipped = tryLoadShipped(idx, slug);
  if (shipped) {
    idx.corpusEmbeddings = shipped;
    return shipped;
  }

  const cached = tryLoadCache(idx, slug);
  if (cached) {
    idx.corpusEmbeddings = cached;
    return cached;
  }

  if (!idx.embeddingJob) {
    const texts = idx.corpus.map((c) => `${c.topics.join(", ")}: ${c.text}`);
    console.warn(
      `[ECHOES] No shipped embeddings for ${slug} (expected ${shippedEmbeddingsPath(slug)}). ` +
        `Live-embedding ${texts.length} chunks — run: npm run embed:persona -- ${slug}`
    );
    idx.embeddingJob = embedMany(texts, (done, total) => {
      if (done % 480 === 0 || done === total) {
        console.log(`[ECHOES] ${slug}: embedded ${done}/${total}`);
      }
    }).then((vectors) => {
      idx.corpusEmbeddings = vectors;
      saveCache(idx, slug, vectors);
      console.log(`[ECHOES] Index ready for ${slug}.`);
      return vectors;
    });
  }
  return idx.embeddingJob;
}

async function ensureImageEmbeddings(pack: PersonaPack): Promise<number[][]> {
  const idx = getOrCreateIndex(pack);
  if (idx.imageEmbeddings) return idx.imageEmbeddings;
  const library = getAvailableLibraryImages();
  if (library.length === 0) return (idx.imageEmbeddings = []);
  if (!idx.imageEmbeddingJob) {
    const texts = library.map(
      (img) => `${img.topics.join(", ")}: ${img.caption}`
    );
    idx.imageEmbeddingJob = embedMany(texts).then((vectors) => {
      idx.imageEmbeddings = vectors;
      return vectors;
    });
  }
  return idx.imageEmbeddingJob;
}

/** Pre-build the embedding index (used by the warm-up endpoint). */
export async function warmIndex(
  personaSlug?: string
): Promise<{
  chunks: number;
  curated: number;
  bookChunks: number;
  ready: boolean;
  persona: string;
}> {
  const pack = getPersonaPack(personaSlug);
  return withPersona(pack, async () => {
    const idx = getOrCreateIndex(pack);
    await Promise.all([ensureEmbeddings(pack), ensureImageEmbeddings(pack)]);
    return {
      chunks: idx.corpus.length,
      curated: idx.curatedCount,
      bookChunks: Math.max(0, idx.corpus.length - idx.curatedCount),
      ready: idx.corpusEmbeddings !== null,
      persona: pack.public.slug,
    };
  });
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export type RankedSourceHit = {
  id: string;
  score: number;
  curated: boolean;
  rank: number;
};

/**
 * Rank corpus for a query (eval / A/B). Same scoring path as chat retrieval,
 * without image search. `useSemantic: false` = cosine + lexical + curated only.
 */
export async function rankSourcesForQuery(
  pack: PersonaPack,
  query: string,
  opts?: { useSemantic?: boolean; topK?: number }
): Promise<{
  hits: RankedSourceHit[];
  intent: QuerySemanticIntent;
}> {
  const useSemantic = opts?.useSemantic !== false;
  const topK = opts?.topK ?? TOP_K;
  const idx = getOrCreateIndex(pack);
  const [embeddings, [queryEmbedding]] = await Promise.all([
    ensureEmbeddings(pack),
    embed([query]),
  ]);

  const lexTerms = queryLexicalTerms(query);
  const rareBoosts = rareTermBoosts(idx.corpus, lexTerms);
  const intent = detectQueryIntent(
    query,
    useSemantic ? pack.semanticVocab : null
  );

  const scored = idx.corpus.map((chunk, i) => ({
    id: chunk.id,
    curated: i < idx.curatedCount,
    score:
      cosine(queryEmbedding, embeddings[i]) +
      (i < idx.curatedCount ? CURATED_BOOST : 0) +
      lexicalScoreForChunk(chunk.text, lexTerms, rareBoosts) +
      (useSemantic
        ? semanticScoreForChunk(chunk, intent, {
            curated: i < idx.curatedCount,
          })
        : 0),
  }));
  scored.sort((a, b) => b.score - a.score);

  let hits = scored.slice(0, topK).map((h, rank) => ({ ...h, rank: rank + 1 }));

  if (isIdentityQuery(query)) {
    const prefixes = pack.identitySourceIdPrefixes ?? ["bio-"];
    const pinned = idx.corpus.filter((c) =>
      prefixes.some((p) => c.id.startsWith(p))
    );
    const seen = new Set(hits.map((h) => h.id));
    for (const c of pinned) {
      if (seen.has(c.id)) continue;
      hits.push({
        id: c.id,
        score: 1,
        curated: true,
        rank: hits.length + 1,
      });
      seen.add(c.id);
    }
  }

  // Birth/parentage questions have weak embedding signal ("born") and drown in OCR
  // biographies — inject curated birth/parent sources at the front of the hit list.
  if (isBirthOrParentageQuery(query)) {
    const birth = idx.corpus.filter((c) =>
      /^(?:bio-birth|bio-parents|bio-loc-birth|bio-abolitionist|bio-brother|bio-name)/i.test(
        c.id
      )
    );
    if (birth.length) {
      const birthHits: RankedSourceHit[] = birth.map((c, i) => ({
        id: c.id,
        score: 1.5,
        curated: true,
        rank: i + 1,
      }));
      const seen = new Set(birthHits.map((h) => h.id));
      const rest = hits.filter((h) => !seen.has(h.id));
      hits = [...birthHits, ...rest]
        .slice(0, topK)
        .map((h, rank) => ({ ...h, rank: rank + 1 }));
    }
  }

  return { hits, intent };
}

function isIdentityQuery(query: string): boolean {
  return /\b(?:who are you|introduce yourself|tell me about yourself|why does .+ matter to you)\b/i.test(
    query
  );
}

function isBirthOrParentageQuery(query: string): boolean {
  return /\b(?:where (?:were|was) you born|when (?:were|was) you born|were you born|your birth(?:place| year)?\b|who were your parents|your (?:mother|father|parents)\b|how did you get to america)\b/i.test(
    query
  );
}

/** "What did you look like?", "show me your portrait", etc. — not places. */
function isAppearanceQuery(query: string): boolean {
  return isPersonPortraitRequest(query);
}

/** "Where did you live?", residence, or figure-specific home anchors. */
function isResidenceQuery(query: string): boolean {
  return /\b(?:where (?:do|did) you live|your (?:house|home|residence)|buchon(?:\s+street)?|714\b|angel house|horton house hotel|spring valley(?:\s+country)?\s+home|bancroft ranch|country (?:home|retreat))\b/i.test(
    query
  );
}

const RESIDENCE_IMAGE_BY_SLUG: Record<string, string> = {
  "myron-angel": "img-buchon-house",
  "alonzo-horton": "img-horton-house",
  "hubert-howe-bancroft": "img-bancroft-ranch",
};

/** Always include verified biographical sources for self-introduction questions. */
function pinIdentitySources(
  pack: PersonaPack,
  sources: SourceChunk[]
): SourceChunk[] {
  const prefixes = pack.identitySourceIdPrefixes ?? ["bio-"];
  const pinned = pack.sources.filter((s) =>
    prefixes.some((p) => s.id.startsWith(p))
  );
  const seen = new Set<string>();
  const merged: SourceChunk[] = [];
  for (const s of [...pinned, ...sources]) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    merged.push(s);
  }
  return merged;
}

function portraitId(pack: PersonaPack): string {
  return pack.portraitImageId ?? "img-portrait";
}

/** Blend recent turns into the retrieval query when the visitor says "this" / "images for that". */
function buildRetrievalQuery(history: ChatMessage[]): {
  userQuery: string;
  retrievalQuery: string;
  topicContext: string;
  isImageFollowUp: boolean;
} {
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const userQuery = lastUser?.content?.trim() || "Introduce yourself.";

  if (!isContextualFollowUp(userQuery) || history.length <= 1) {
    return {
      userQuery,
      retrievalQuery: userQuery,
      topicContext: "",
      isImageFollowUp: isImageFollowUpQuery(userQuery),
    };
  }

  const contextParts: string[] = [];
  for (const m of history.slice(-6)) {
    if (m.role === "user" && m.content.trim() !== userQuery) {
      contextParts.push(m.content.trim());
    }
    if (m.role === "assistant") {
      contextParts.push(m.content.trim().slice(0, 600));
    }
  }
  const topicContext = contextParts.join(" ").slice(0, 1200);
  const retrievalQuery = `${topicContext} ${userQuery}`.trim();

  return {
    userQuery,
    retrievalQuery,
    topicContext,
    isImageFollowUp: isImageFollowUpQuery(userQuery),
  };
}

/** Pin library images whose topics strongly match the question. */
function pinTopicImages(topicHay: string, localCandidates: ImageAsset[]): ImageAsset[] {
  const library = getAvailableLibraryImages();
  const hay = topicHay.toLowerCase();
  let pinned = library.filter((img) => imageStoryMatchScore(img, hay) >= 3);
  if (isMissionQuery(hay)) {
    const mission = library.filter(
      (img) => isMissionImage(img) && imageStoryMatchScore(img, hay) >= 2
    );
    pinned = [...mission, ...pinned];
  }
  const seen = new Set<string>();
  const merged: ImageAsset[] = [];
  for (const img of [...pinned, ...localCandidates]) {
    if (seen.has(img.id)) continue;
    seen.add(img.id);
    merged.push(img);
  }
  return merged.slice(0, IMAGE_CANDIDATES + 3);
}

async function retrieveContext(
  pack: PersonaPack,
  retrievalQuery: string,
  opts: {
    userQuery: string;
    topicContext: string;
    isImageFollowUp: boolean;
    /** When false, skip semantic boosts (baseline A/B). Default true. */
    useSemantic?: boolean;
  }
): Promise<{
  sources: SourceChunk[];
  candidateImages: ImageAsset[];
  intent: QuerySemanticIntent;
}> {
  const { userQuery, topicContext, isImageFollowUp } = opts;
  const useSemantic = opts.useSemantic !== false;
  const idx = getOrCreateIndex(pack);
  const library = getAvailableLibraryImages();
  const [embeddings, imgEmbeddings, [queryEmbedding]] = await Promise.all([
    ensureEmbeddings(pack),
    ensureImageEmbeddings(pack),
    embed([retrievalQuery]),
  ]);

  const lexTerms = queryLexicalTerms(`${retrievalQuery} ${userQuery}`);
  const rareBoosts = rareTermBoosts(idx.corpus, lexTerms);
  const intent = detectQueryIntent(
    `${userQuery} ${retrievalQuery} ${topicContext}`,
    useSemantic ? pack.semanticVocab : null
  );
  const scored = idx.corpus.map((chunk, i) => ({
    index: i,
    score:
      cosine(queryEmbedding, embeddings[i]) +
      (i < idx.curatedCount ? CURATED_BOOST : 0) +
      lexicalScoreForChunk(chunk.text, lexTerms, rareBoosts) +
      (useSemantic
        ? semanticScoreForChunk(chunk, intent, {
            curated: i < idx.curatedCount,
          })
        : 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  const topHits = scored.slice(0, TOP_K);

  const selected = new Set<number>();
  for (const hit of topHits) {
    selected.add(hit.index);
    if (hit.index >= idx.curatedCount) {
      for (let d = 1; d <= NEIGHBOR_RADIUS; d++) {
        const before = hit.index - d;
        const after = hit.index + d;
        if (before >= idx.curatedCount) selected.add(before);
        if (after < idx.corpus.length) selected.add(after);
      }
    }
  }

  // Hard-pin chunks that mention rare query names (≤8 corpus hits).
  for (const [term, boost] of rareBoosts) {
    if (boost < 0.8) continue;
    for (let i = 0; i < idx.corpus.length; i++) {
      if (textMentionsTerm(idx.corpus[i].text.toLowerCase(), term)) {
        selected.add(i);
      }
    }
  }

  let sources = [...selected]
    .sort((a, b) => a - b)
    .map((i) => idx.corpus[i]);
  if (isIdentityQuery(userQuery)) {
    sources = pinIdentitySources(pack, sources);
  }
  if (isBirthOrParentageQuery(userQuery)) {
    const birth = idx.corpus.filter((c) =>
      /^(?:bio-birth|bio-parents|bio-loc-birth|bio-abolitionist|bio-brother|bio-name)/i.test(
        c.id
      )
    );
    const seen = new Set(sources.map((s) => s.id));
    for (const c of birth) {
      if (seen.has(c.id)) continue;
      sources = [c, ...sources];
      seen.add(c.id);
    }
  }

  const sourceHints = sources.slice(0, 3).map((s) => s.text.slice(0, 100));
  const imageSearchQuery = topicContext || retrievalQuery;
  const searchImages =
    queryWantsImageSearch(userQuery, topicContext || retrievalQuery)
      ? await searchHistoricalImages(imageSearchQuery, sourceHints)
      : [];

  let localCandidates = library
    .map((img, i) => ({
      img,
      score: imgEmbeddings[i]
        ? cosine(queryEmbedding, imgEmbeddings[i])
        : 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, IMAGE_CANDIDATES)
    .map((x) => x.img);

  localCandidates = pinTopicImages(
    `${topicContext} ${retrievalQuery} ${sourceHints.join(" ")}`,
    localCandidates
  );

  const pid = portraitId(pack);
  if (isIntroOrMetaQuery(userQuery) && !isImageFollowUp) {
    if (isIdentityQuery(userQuery)) {
      const portrait = library.find((img) => img.id === pid);
      localCandidates = portrait ? [portrait] : [];
    } else {
      const wantsPortrait = isPersonPortraitRequest(userQuery);
      localCandidates = wantsPortrait
        ? localCandidates.filter((img) => img.id === pid)
        : [];
    }
  }

  const seen = new Set<string>();
  const candidateImages: ImageAsset[] = [];
  for (const img of [...localCandidates, ...searchImages]) {
    if (seen.has(img.id)) continue;
    seen.add(img.id);
    candidateImages.push(img);
  }

  return {
    sources,
    candidateImages: filterServeableImages(candidateImages),
    intent,
  };
}

function isRepetitionComplaint(userQuery: string): boolean {
  return /\b(?:repeat|repeated|already (?:said|told)|you (?:just )?said|same thing|said that|told me that)\b/i.test(
    userQuery
  );
}

function isShortFollowUp(userQuery: string): boolean {
  const words = userQuery.trim().split(/\s+/).length;
  return words <= 6 && (isImageFollowUpQuery(userQuery) || isContextualFollowUp(userQuery));
}

/** Prior turns for the model — truncated so it knows what NOT to repeat. */
function buildConversationBrief(
  history: ChatMessage[],
  speakerLabel: string
): string {
  if (history.length <= 1) return "";
  const prior = history.slice(0, -1).slice(-4);
  return prior
    .map((m) => {
      const label = m.role === "user" ? "Visitor" : speakerLabel;
      return `${label}: ${m.content.trim().slice(0, 500)}`;
    })
    .join("\n\n");
}

function isMissionQuery(topicHay: string): boolean {
  if (/\bbuenaventura\b/i.test(topicHay)) return false;
  return /\b(?:mission san luis|san luis obispo de tolosa|mission de tolosa|the mission|our mission|mission church|mission history|founded 1772|franciscan padres)\b/i.test(
    topicHay
  );
}

function isMissionImage(img: ImageAsset): boolean {
  return img.id.startsWith("img-mission-");
}

function normId(id: unknown): string {
  const s =
    typeof id === "string" ? id : typeof id === "number" ? String(id) : "";
  if (!s) return "";
  return s.toLowerCase().replace(/(\d+)/g, (n) => String(parseInt(n, 10)));
}

function asStringIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((id) =>
      typeof id === "string"
        ? id.trim()
        : typeof id === "number"
          ? String(id)
          : ""
    )
    .filter(Boolean);
}

function collectPreviouslyShownImageIds(history: ChatMessage[]): Set<string> {
  const shown = new Set<string>();
  for (const m of history) {
    if (m.role !== "assistant") continue;
    for (const id of asStringIds(m.imageIds)) {
      const norm = normId(id);
      if (norm) shown.add(norm);
    }
  }
  return shown;
}

function imageAllowedForStory(
  pack: PersonaPack,
  img: ImageAsset,
  userQuery: string,
  storyHay: string,
  storyThemes: ReturnType<typeof detectStoryThemes>
): boolean {
  if (img.id === portraitId(pack)) {
    return (
      isIdentityQuery(userQuery) ||
      isAppearanceQuery(userQuery) ||
      /\bstore\b/i.test(userQuery)
    );
  }
  return isStrongStoryMatch(img, storyHay, storyThemes) &&
    imageMatchesQueryIntent(userQuery, img);
}

function buildGroundingPrompt(
  pack: PersonaPack,
  sources: SourceChunk[],
  images: ImageAsset[],
  opts?: {
    isImageFollowUp?: boolean;
    topicContext?: string;
    isRepetitionComplaint?: boolean;
    isShortFollowUp?: boolean;
    isFunFactQuery?: boolean;
    conversationBrief?: string;
    shownImageIds?: string[];
    semanticIntent?: QuerySemanticIntent;
  }
): string {
  const year = pack.temporalYear ?? 1905;
  const pid = portraitId(pack);
  const accuracy = pack.accuracyPrompt ?? IMAGE_ACCURACY_PROMPT;
  const sourceBlock = sources
    .map(
      (s) =>
        `[${s.id}] (reliability: ${s.reliability}; ${s.dateRange ?? "n.d."})\n` +
        `${s.text}\nCitation: ${s.citation}`
    )
    .join("\n\n");

  const imageBlock =
    images.length > 0
      ? images
          .map((img) => `[${img.id}] (${img.dateRange ?? "n.d."}) ${img.caption}`)
          .join("\n")
      : "(none available)";

  const semanticBrief = formatSemanticBrief(
    sources,
    opts?.semanticIntent ?? {
      people: [],
      places: [],
      organizations: [],
      events: [],
      periods: [],
      hasSignal: false,
    },
    pack.semanticVocab
  );

  return `
${pack.systemPrompt}

${
  opts?.conversationBrief
    ? `# CONVERSATION SO FAR (already told — do NOT repeat)
${opts.conversationBrief}
`
    : ""
}
${semanticBrief ? `${semanticBrief}\n` : ""}
# SOURCES RETRIEVED FOR THIS QUESTION
Use ONLY the facts below for historical claims. Each is tagged with an id like [bio-birth] or [book-0123].
Some entries may be dense historical prose; paraphrase clearly for the visitor.
${sourceBlock}

${buildGroundingTemporalBlock(year)}

# IMAGES YOU MAY SHOW
You may show at most ONE image per reply. Include an image only when one **clearly and
specifically** illustrates the exact place, building, person, or event you are discussing.
When in doubt, use empty image_ids — a mismatched image is worse than none. Pick from:
${imageBlock}

# TOPIC → IMAGE GUIDE (match buzzwords in your answer to the best id)
${formatTopicCatalogForPrompt(pack.imageTopics)}

${accuracy}
${
  opts?.shownImageIds?.length
    ? `
Already shown this session — do NOT repeat these ids: ${opts.shownImageIds.join(", ")}
`
    : ""
}
Rules for images:
- **Match the story you tell, not loose keywords.** See TOPIC GUIDE and HISTORICAL ACCURACY above.
- **High bar for a match:** The image must depict the **same subject** you are narrating.
  Generic town panoramas do not fit specific stories.
- **Skip when none fit:** Use empty image_ids when no listed image truly matches.
- Do NOT show images for "what is echoes" / "are you AI" meta questions.
- **Never** show ${pid} except for "who are you", introductions, or questions about **your**
  likeness/appearance — not for places ("what did the marina look like").
- For **"who are you"** and other identity introductions → **always** include ${pid}
  when it is listed, and refer to the likeness (or store) in your answer.
- Do NOT show images for "why does SLO matter" unless a listed image directly fits.
- Do NOT show modern photographs, contemporary scenes, or images whose caption does not
  match what you are actually describing.
- Prefer at most ONE image. Do not invent image ids; use only the ids listed above.
- **Integration rule (critical):** If image_ids is not empty, the image renders **above**
  your answer text. Write as though the visitor is already looking at it — one unified
  moment. Never offer to show an image you are simultaneously including. Never end with
  "if you wish" when the image is already in image_ids.
- Good example (mission history with img-mission-1883 listed): "Observe here the Mission
  as it stood in my day — the adobe walls weathered by decades of faithful labor…"
- Bad example: "...If you wish, I can show you a likeness." (while also setting image_ids)
- Prefer the most specific listed image for the subject; do not default to a loose town view.
${
  opts?.isImageFollowUp
    ? `
# IMAGE FOLLOW-UP (visitor asked for a picture about the ongoing topic)
The visitor wants a visual for what you **already discussed** — they do not need the story again.
- Give **2–5 sentences** about what the image shows and how it connects.
- If a listed image matches the topic, include it in image_ids. If none truly fit, say so
  honestly and use **empty image_ids**.
- Refer to the image as already before the visitor; never ask "would that interest you?"
`
    : ""
}
${
  opts?.isRepetitionComplaint
    ? `
# REPETITION COMPLAINT
The visitor noticed you repeated yourself. Reply in **under 80 words**: brief apology,
acknowledge it, offer ONE new thread or ask what they'd like next. **Do not retell any
part of the bandit story, mission history, or prior answer.**
`
    : ""
}
${
  opts?.isShortFollowUp && !opts?.isImageFollowUp
    ? `
# SHORT FOLLOW-UP
The visitor's message is brief — they want something **added**, not the whole story again.
Give only the new information or the next layer of detail not yet covered above.
`
    : ""
}
${
  opts?.isFunFactQuery
    ? `
# FUN FACT REQUEST
Pick ONE surprising but **documented** fact from the sources above. It must be
something you could know in **${year}**. Do NOT use modern trivia from after ${year}.
Unless the fact is specifically about a place, building, or event that one of the
listed images depicts, use **empty image_ids** — a fun fact about naming, politics,
or general history rarely needs a picture.
`
    : ""
}

# IDENTITY QUESTIONS ("who are you", introductions)
When the visitor asks who you are, ground your answer in the biographical sources above.
Label "documented", cite the ids you relied on, and do NOT use "unknown" for a standard
self-introduction. When the visitor asks **who you are**, **introduce yourself**, or
**tell me about yourself**, you MUST include ${pid} in image_ids and weave that image
into your reply — as though you have just set it before them.

# HOW TO LABEL YOUR ANSWER
Choose exactly one "evidence_label", judged by the MAIN factual claims of your answer:
- "documented": the core facts are directly supported by one or more sources above.
- "inference": the core facts are reasonably inferred from the sources but not stated
  outright (say so in-character).
- "contested": sources conflict or historians disagree; present more than one view.
- "unknown": the sources contain NOTHING that supports your answer.

Labeling rules (important):
- If ANY factual claim in your answer is supported by a source above, you must NOT use
  "unknown". Label by your most-supported core claims (usually "documented").
- For **legacy-bridge** answers about history after your speaking year: use **"inference"**
  unless a retrieved source directly states that later fact (then "documented" is fine).
  Do **not** default to "unknown" merely because the event is after your year — bridge it.
- Only use "unknown" when you genuinely could not ground your answer and are admitting
  you lack reliable evidence (and there is no responsible later-record summary to offer).
- When the label is "unknown": do NOT invent biographies, roles, or local deeds. Say
  plainly that this name/topic is not in the sources before you, then offer a nearby
  topic you CAN document (a place, industry, or figure that is in the retrieved sources).
- ALWAYS populate "used_source_ids" with the ids you actually relied on. If your label is
  "documented", "inference", or "contested", this array must NOT be empty. Only "unknown"
  may have an empty array.
- Conversational framing, your feelings, or polite asides do not need a source and should
  not push you toward "unknown" — judge the label by the historical facts you assert.

# OUTPUT FORMAT (STRICT)
Respond with a single JSON object, nothing else:
{
  "answer": "<reply — light **bold** / *italic* OK for short names & emphasis only; NEVER wrap whole paragraphs or the entire answer in italics; NO image links, NO picture URLs>",
  "evidence_label": "documented" | "inference" | "contested" | "unknown",
  "used_source_ids": ["<id>", ...],
  "image_ids": ["<img-id>", ...]
}
The "answer" field is shown to visitors with **bold** and *italic* rendered (markers hidden).
Do not italicize entire sentences or paragraphs — plain prose is the default.
Images listed in image_ids render automatically above your reply — never embed
![...](...) syntax, HTML, or wikimedia URLs in "answer".
`.trim();
}

function isFunFactQuery(userQuery: string): boolean {
  return /\b(?:fun fact|interesting fact|something interesting|tell me something (?:fun|interesting|cool|surprising|neat))\b/i.test(
    userQuery
  );
}

function parseModelAnswer(raw: string): {
  answer?: string;
  evidence_label?: string;
  used_source_ids?: string[];
  image_ids?: string[];
} {
  try {
    return JSON.parse(raw);
  } catch {
    /* fall through to salvage */
  }

  // Salvage: trim to the outermost braces (models occasionally wrap JSON in prose).
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(raw.slice(start, end + 1));
    } catch {
      /* fall through */
    }
  }

  // Salvage: pull the "answer" string field out of malformed/truncated JSON so we
  // never show raw JSON to the visitor.
  const m = raw.match(/"answer"\s*:\s*"((?:[^"\\]|\\.)*)(?:"|$)/);
  if (m) {
    try {
      const answer = JSON.parse(`"${m[1]}"`) as string;
      const labelMatch = raw.match(/"evidence_label"\s*:\s*"([a-z]+)"/);
      return { answer, evidence_label: labelMatch?.[1] };
    } catch {
      return { answer: m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') };
    }
  }

  // Last resort: if it still looks like JSON, don't leak it verbatim.
  if (raw.trim().startsWith("{")) {
    return { answer: "" };
  }
  return { answer: raw };
}

/**
 * Models sometimes wrap every paragraph (or the whole answer) in *italics* /
 * _underscores_, which renders as an all-italic bubble. Keep short emphasis;
 * unwrap paragraph-scale wrapping.
 */
function unwrapParagraphEmphasis(answer: string): string {
  return answer
    .split(/\n\n+/)
    .map((block) => {
      const t = block.trim();
      if (t.length <= 40) return block;
      // Whole-paragraph *wrap* with no inner asterisks.
      if (
        t.startsWith("*") &&
        t.endsWith("*") &&
        !t.slice(1, -1).includes("*")
      ) {
        return t.slice(1, -1);
      }
      if (
        t.startsWith("_") &&
        t.endsWith("_") &&
        !t.slice(1, -1).includes("_")
      ) {
        return t.slice(1, -1);
      }
      return block;
    })
    .join("\n\n");
}

/** Strip markdown/HTML image embeds the model sometimes adds despite image_ids. */
function sanitizeAnswerText(answer: string): string {
  return unwrapParagraphEmphasis(
    answer
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      .replace(/<img\b[^>]*>/gi, "")
      .replace(
        /^\s*https?:\/\/(?:upload\.)?wikimedia\.org\/[^\s]+\s*$/gim,
        ""
      )
      .replace(
        /^\s*https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s]*)?\s*$/gim,
        ""
      )
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

export async function answerQuestion(
  history: ChatMessage[],
  personaSlug?: string,
  opts?: { useSemantic?: boolean }
): Promise<GroundedAnswer> {
  const pack = getPersonaPack(personaSlug ?? DEFAULT_PERSONA_SLUG);
  return withPersona(pack, () =>
    answerQuestionForPack(pack, history, opts)
  );
}

async function answerQuestionForPack(
  pack: PersonaPack,
  history: ChatMessage[],
  opts?: { useSemantic?: boolean }
): Promise<GroundedAnswer> {
  const useSemantic = opts?.useSemantic !== false;
  const pid = portraitId(pack);
  const { userQuery, retrievalQuery, topicContext, isImageFollowUp } =
    buildRetrievalQuery(history);
  const conversationBrief = buildConversationBrief(
    history,
    pack.speakerLabel ?? `You (${pack.public.name})`
  );
  const shownImageIds = collectPreviouslyShownImageIds(history.slice(0, -1));

  let { sources: retrieved, candidateImages, intent } = await retrieveContext(
    pack,
    retrievalQuery,
    { userQuery, topicContext, isImageFollowUp, useSemantic }
  );

  const promptIntent = useSemantic
    ? intent
    : {
        people: [],
        places: [],
        organizations: [],
        events: [],
        periods: [],
        hasSignal: false as const,
      };

  candidateImages = candidateImages.filter((img) => {
    if (!shownImageIds.has(normId(img.id))) return true;
    return (
      img.id === pid && (isIdentityQuery(userQuery) || isAppearanceQuery(userQuery))
    );
  });

  const system = buildGroundingPrompt(pack, retrieved, candidateImages, {
    isImageFollowUp,
    topicContext,
    semanticIntent: promptIntent,
    isRepetitionComplaint: isRepetitionComplaint(userQuery),
    isShortFollowUp: isShortFollowUp(userQuery),
    isFunFactQuery: isFunFactQuery(userQuery),
    conversationBrief,
    shownImageIds: [...shownImageIds],
  });
  let raw = await chatJSON(system, history);
  let parsed = parseModelAnswer(raw);

  if (detectAnachronism(parsed.answer ?? raw, pack.temporalYear ?? 1905)) {
    raw = await chatJSON(
      `${system}\n\n${anachronismRetry(pack)}`,
      history
    );
    parsed = parseModelAnswer(raw);
  }

  let evidenceLabel: EvidenceLabel = EVIDENCE_LABELS.includes(
    parsed.evidence_label as EvidenceLabel
  )
    ? (parsed.evidence_label as EvidenceLabel)
    : "inference";

  // The model sometimes drops the zero-padding (e.g. "book-88" vs "book-0088"),
  // so match on a normalized form rather than exact string equality.
  let usedIds = asStringIds(parsed.used_source_ids);
  const usedNorm = new Set(usedIds.map(normId).filter(Boolean));
  const usedSources = retrieved.filter((s) => usedNorm.has(normId(s.id)));

  const storyHay = (parsed.answer ?? "").toLowerCase();
  const storyThemes = detectStoryThemes(storyHay);
  const imageIds = asStringIds(parsed.image_ids);
  const imageNorm = new Set(imageIds.map(normId).filter(Boolean));
  let images = candidateImages.filter((img) => imageNorm.has(normId(img.id)));

  const eligibleCandidates = (pool: ImageAsset[]) =>
    pool.filter((img) => {
      if (!isHistoricalImageAsset(img)) return false;
      if (isIntroOrMetaQuery(userQuery) && !isImageFollowUp && img.id !== pid)
        return false;
      if (shownImageIds.has(normId(img.id)) && img.id !== pid) return false;
      return imageAllowedForStory(pack, img, userQuery, storyHay, storyThemes);
    });

  // Drop images that fail story relevance, theme conflict, or repeat checks.
  images = eligibleCandidates(images);

  // Reject model-picked images whose subject is not discussed in the answer.
  images = images.filter((img) => {
    if (img.id === pid) {
      return isIdentityQuery(userQuery) || isAppearanceQuery(userQuery);
    }
    return (
      answerSupportsImage(img, storyHay) &&
      isStrongStoryMatch(img, storyHay, storyThemes) &&
      imageMatchesQueryIntent(userQuery, img)
    );
  });

  // If the model picked a weak/conflicting image, swap to the best story match.
  if (images.length > 0) {
    const chosen = images[0];
    const chosenScore = imageStoryMatchScore(chosen, storyHay);
    const best = pickBestStoryImage(
      eligibleCandidates(candidateImages),
      storyHay,
      storyThemes,
      3
    );
    const bestScore = best ? imageStoryMatchScore(best, storyHay) : 0;
    if (
      imageConflictsWithStory(chosen, storyThemes) ||
      !answerSupportsImage(chosen, storyHay) ||
      (best && bestScore >= chosenScore + 2 && best.id !== chosen.id)
    ) {
      images = best &&
        answerSupportsImage(best, storyHay) &&
        imageMatchesQueryIntent(userQuery, best)
        ? [best]
        : [];
    }
  }

  // Fallback: strong story match only, never repeat (except portrait on identity).
  if (images.length === 0 && candidateImages.length > 0) {
    const skipProactive =
      (isIntroOrMetaQuery(userQuery) && !isImageFollowUp) ||
      isRepetitionComplaint(userQuery) ||
      (isShortFollowUp(userQuery) && !isImageFollowUp) ||
      isFunFactQuery(userQuery) ||
      evidenceLabel === "unknown";

    if (!skipProactive) {
      const pinned = pickBestStoryImage(
        eligibleCandidates(candidateImages),
        storyHay,
        storyThemes,
        4
      );
      if (pinned && imageMatchesQueryIntent(userQuery, pinned)) {
        images = [pinned];
      }
    }
  }

  // Appearance questions must show the portrait, never a landmark the model picked.
  if (isAppearanceQuery(userQuery)) {
    const portrait =
      candidateImages.find((img) => img.id === pid) ??
      getAvailableLibraryImages().find((img) => img.id === pid);
    images = portrait ? [portrait] : images;
  }

  // Residence / "where did you live": pin persona-specific home image when available.
  if (isResidenceQuery(userQuery)) {
    const residenceId = RESIDENCE_IMAGE_BY_SLUG[pack.public.slug];
    const house =
      (residenceId &&
        (candidateImages.find((img) => img.id === residenceId) ??
          getAvailableLibraryImages().find((img) => img.id === residenceId))) ??
      null;
    if (house) {
      images = [house];
    } else {
      // Never keep a native-village image on a residence question.
      images = images.filter(
        (img) =>
          !/chumash|choris|tomol|ap-replica/i.test(img.id) &&
          imageMatchesQueryIntent(userQuery, img)
      );
    }
  }

  // "Who are you" / self-introduction: always show the portrait / landmark image.
  if (images.length === 0 && isIdentityQuery(userQuery)) {
    const portrait =
      candidateImages.find((img) => img.id === pid) ??
      getAvailableLibraryImages().find((img) => img.id === pid);
    if (portrait) {
      images = [portrait];
    }
  }

  // Decide which sources to surface to the reader.
  // - "unknown": the model claims no grounding, so show NO sources (showing the
  //   full retrieved candidate list here is misleading — those are just search
  //   hits the model did not stand behind).
  // - Otherwise: show the sources the model actually cited. Only fall back to the
  //   retrieved candidates if the model grounded its answer but forgot to list ids.
  let displaySources: SourceChunk[];
  if (evidenceLabel === "unknown") {
    displaySources = [];
  } else if (usedSources.length > 0) {
    displaySources = usedSources;
  } else {
    displaySources = retrieved;
  }

  // The model sometimes labels identity answers "unknown" even when bio sources
  // were retrieved and the reply is a normal self-introduction.
  if (evidenceLabel === "unknown" && isIdentityQuery(userQuery) && parsed.answer?.trim()) {
    const prefixes = pack.identitySourceIdPrefixes ?? ["bio-"];
    const bioSources = retrieved.filter((s) =>
      prefixes.some((p) => s.id.startsWith(p))
    );
    if (bioSources.length > 0) {
      evidenceLabel = "documented";
      displaySources = usedSources.length > 0 ? usedSources : bioSources.slice(0, 6);
    }
  }

  // Hard cap: one image per reply, keeping the strongest story match.
  if (images.length > 1) {
    images = [...images].sort(
      (a, b) =>
        imageStoryMatchScore(b, storyHay) - imageStoryMatchScore(a, storyHay)
    );
    images = [images[0]];
  }

  // Final guard: never show an image the answer does not actually discuss.
  images = images.filter((img) => {
    if (img.id === pid && (isIdentityQuery(userQuery) || isAppearanceQuery(userQuery))) {
      return true;
    }
    return (
      answerSupportsImage(img, storyHay) &&
      imageMatchesQueryIntent(userQuery, img)
    );
  });

  let answerText = sanitizeAnswerText(
    parsed.answer?.trim() ||
      "Forgive me — I find I cannot put words to that just now."
  );

  const runVerifier = (ans: string, label: EvidenceLabel, ids: string[], imgs: ImageAsset[]) =>
    verifyGroundedAnswer({
      answer: ans,
      evidenceLabel: label,
      usedSourceIds: ids,
      retrieved,
      images: imgs,
      userQuery,
      pack,
      portraitImageId: pid,
      isIdentityQuery: isIdentityQuery(userQuery),
      isAppearanceQuery: isAppearanceQuery(userQuery),
    });

  let verified = runVerifier(answerText, evidenceLabel, usedIds, images);

  // One rewrite pass when chronology / involvement / unframed post-era fails.
  if (verified.needsRewrite && verified.rewriteHint) {
    raw = await chatJSON(
      `${system}\n\n${verifierRewritePrompt(pack, verified.rewriteHint)}`,
      history
    );
    parsed = parseModelAnswer(raw);
    answerText = sanitizeAnswerText(
      parsed.answer?.trim() || answerText
    );
    evidenceLabel = EVIDENCE_LABELS.includes(
      parsed.evidence_label as EvidenceLabel
    )
      ? (parsed.evidence_label as EvidenceLabel)
      : evidenceLabel;
    const rewriteIds = asStringIds(parsed.used_source_ids);
    if (rewriteIds.length > 0) {
      usedIds = rewriteIds;
    }
    const rewriteNorm = new Set(usedIds.map(normId).filter(Boolean));
    const rewriteUsed = retrieved.filter((s) => rewriteNorm.has(normId(s.id)));
    if (evidenceLabel === "unknown") {
      displaySources = [];
    } else if (rewriteUsed.length > 0) {
      displaySources = rewriteUsed;
    } else {
      displaySources = retrieved;
    }
    if (
      evidenceLabel === "unknown" &&
      isIdentityQuery(userQuery) &&
      answerText.trim()
    ) {
      const prefixes = pack.identitySourceIdPrefixes ?? ["bio-"];
      const bioSources = retrieved.filter((s) =>
        prefixes.some((p) => s.id.startsWith(p))
      );
      if (bioSources.length > 0) {
        evidenceLabel = "documented";
        displaySources = rewriteUsed.length > 0 ? rewriteUsed : bioSources.slice(0, 6);
      }
    }

    const rewriteHay = answerText.toLowerCase();
    const rewriteThemes = detectStoryThemes(rewriteHay);
    const rewriteImageIds = asStringIds(parsed.image_ids);
    const rewriteImageNorm = new Set(rewriteImageIds.map(normId).filter(Boolean));
    images = eligibleCandidates(candidateImages).filter((img) => {
      if (img.id === pid) {
        return isIdentityQuery(userQuery) || isAppearanceQuery(userQuery);
      }
      if (rewriteImageNorm.size > 0 && !rewriteImageNorm.has(normId(img.id))) {
        return false;
      }
      return (
        answerSupportsImage(img, rewriteHay) &&
        isStrongStoryMatch(img, rewriteHay, rewriteThemes) &&
        imageMatchesQueryIntent(userQuery, img)
      );
    });
    if (images.length > 1) {
      images = [...images].sort(
        (a, b) =>
          imageStoryMatchScore(b, rewriteHay) - imageStoryMatchScore(a, rewriteHay)
      );
      images = [images[0]];
    }
    if (isAppearanceQuery(userQuery) || isIdentityQuery(userQuery)) {
      const portrait =
        candidateImages.find((img) => img.id === pid) ??
        getAvailableLibraryImages().find((img) => img.id === pid);
      if (portrait && (isAppearanceQuery(userQuery) || images.length === 0)) {
        images = [portrait];
      }
    }

    // Deterministic label/image fixes only — no second rewrite.
    verified = runVerifier(answerText, evidenceLabel, usedIds, images);
  }

  evidenceLabel = verified.evidenceLabel;
  images = verified.images;
  if (evidenceLabel === "unknown") {
    displaySources = [];
  } else if (verified.usedSourceIds.length > 0) {
    const vNorm = new Set(verified.usedSourceIds.map(normId).filter(Boolean));
    const cited = retrieved.filter((s) => vNorm.has(normId(s.id)));
    if (cited.length > 0) displaySources = cited;
  }

  return {
    answer: verified.answer,
    evidenceLabel,
    usedSourceIds: verified.usedSourceIds,
    sources: displaySources,
    images: filterServeableImages(images),
  };
}
