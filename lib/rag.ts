import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  buildGroundingTemporalBlock,
  detectAnachronism,
  anachronismRetry,
} from "@/lib/temporalPolicy";
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
const IMAGE_CANDIDATES = 5; // local library images to offer the model
const EVIDENCE_LABELS: EvidenceLabel[] = [
  "documented",
  "inference",
  "contested",
  "unknown",
];

const CACHE_DIR = path.join(process.cwd(), ".cache");

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
function loadBookSources(paths: string[]): SourceChunk[] {
  const out: SourceChunk[] = [];
  for (const bookChunksPath of paths) {
    try {
      const raw = fs.readFileSync(
        path.join(process.cwd(), bookChunksPath),
        "utf8"
      );
      const data = JSON.parse(raw) as SourceChunk[];
      for (const d of data) {
        out.push({
          id: d.id,
          text: d.text,
          topics: d.topics ?? ["local history"],
          dateRange: d.dateRange ?? "historical",
          sourceType: "primary" as const,
          citation: d.citation,
          url: d.url,
          reliability: d.reliability ?? "medium",
        });
      }
    } catch {
      /* missing or unreadable book file — skip */
    }
  }
  return out;
}

function corpusHashFor(corpus: SourceChunk[]): string {
  const h = crypto.createHash("sha1");
  h.update(`dim:${EMBED_DIM}|n:${corpus.length}`);
  for (const c of corpus) h.update(`${c.id}:${c.text.length}|`);
  return h.digest("hex");
}

function getOrCreateIndex(pack: PersonaPack): PersonaIndex {
  const slug = pack.public.slug;
  let idx = indexes.get(slug);
  if (idx) return idx;

  const bookSources = loadBookSources(bookChunkPathsFor(pack));
  const corpus: SourceChunk[] = [...pack.sources, ...bookSources];
  idx = {
    corpus,
    curatedCount: pack.sources.length,
    corpusEmbeddings: null,
    embeddingJob: null,
    imageEmbeddings: null,
    imageEmbeddingJob: null,
    hash: corpusHashFor(corpus),
  };
  indexes.set(slug, idx);
  return idx;
}

function cachePathFor(slug: string): string {
  return path.join(CACHE_DIR, `${slug}-embeddings.json`);
}

function tryLoadCache(idx: PersonaIndex, slug: string): number[][] | null {
  try {
    const raw = fs.readFileSync(cachePathFor(slug), "utf8");
    const cached = JSON.parse(raw) as {
      hash: string;
      vectors: number[][];
    };
    if (
      cached.hash === idx.hash &&
      cached.vectors.length === idx.corpus.length
    ) {
      return cached.vectors;
    }
  } catch {
    /* no usable cache */
  }
  return null;
}

function saveCache(idx: PersonaIndex, slug: string, vectors: number[][]) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(
      cachePathFor(slug),
      JSON.stringify({ hash: idx.hash, vectors }),
      "utf8"
    );
  } catch {
    /* read-only fs: keep embeddings in memory only */
  }
}

async function ensureEmbeddings(pack: PersonaPack): Promise<number[][]> {
  const idx = getOrCreateIndex(pack);
  if (idx.corpusEmbeddings) return idx.corpusEmbeddings;

  const cached = tryLoadCache(idx, pack.public.slug);
  if (cached) {
    idx.corpusEmbeddings = cached;
    return cached;
  }

  if (!idx.embeddingJob) {
    const texts = idx.corpus.map((c) => `${c.topics.join(", ")}: ${c.text}`);
    console.log(
      `[ECHOES] Indexing ${texts.length} source chunks for ${pack.public.slug}…`
    );
    idx.embeddingJob = embedMany(texts, (done, total) => {
      if (done % 480 === 0 || done === total) {
        console.log(`[ECHOES] ${pack.public.slug}: embedded ${done}/${total}`);
      }
    }).then((vectors) => {
      idx.corpusEmbeddings = vectors;
      saveCache(idx, pack.public.slug, vectors);
      console.log(`[ECHOES] Index ready for ${pack.public.slug}.`);
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
): Promise<{ chunks: number; ready: boolean; persona: string }> {
  const pack = getPersonaPack(personaSlug);
  return withPersona(pack, async () => {
    const idx = getOrCreateIndex(pack);
    await Promise.all([ensureEmbeddings(pack), ensureImageEmbeddings(pack)]);
    return {
      chunks: idx.corpus.length,
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

function isIdentityQuery(query: string): boolean {
  return /\b(?:who are you|introduce yourself|tell me about yourself|why does .+ matter to you)\b/i.test(
    query
  );
}

/** "What did you look like?", "show me your portrait", etc. — not places. */
function isAppearanceQuery(query: string): boolean {
  return isPersonPortraitRequest(query);
}

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
  }
): Promise<{ sources: SourceChunk[]; candidateImages: ImageAsset[] }> {
  const { userQuery, topicContext, isImageFollowUp } = opts;
  const idx = getOrCreateIndex(pack);
  const library = getAvailableLibraryImages();
  const [embeddings, imgEmbeddings, [queryEmbedding]] = await Promise.all([
    ensureEmbeddings(pack),
    ensureImageEmbeddings(pack),
    embed([retrievalQuery]),
  ]);

  const scored = idx.corpus.map((chunk, i) => ({
    index: i,
    score:
      cosine(queryEmbedding, embeddings[i]) +
      (i < idx.curatedCount ? CURATED_BOOST : 0),
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

  let sources = [...selected]
    .sort((a, b) => a - b)
    .map((i) => idx.corpus[i]);
  if (isIdentityQuery(userQuery)) {
    sources = pinIdentitySources(pack, sources);
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

  return { sources, candidateImages: filterServeableImages(candidateImages) };
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

  return `
${pack.systemPrompt}

${
  opts?.conversationBrief
    ? `# CONVERSATION SO FAR (already told — do NOT repeat)
${opts.conversationBrief}
`
    : ""
}
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
- Only use "unknown" when you genuinely could not ground your answer and are admitting
  you lack reliable evidence.
- ALWAYS populate "used_source_ids" with the ids you actually relied on. If your label is
  "documented", "inference", or "contested", this array must NOT be empty. Only "unknown"
  may have an empty array.
- Conversational framing, your feelings, or polite asides do not need a source and should
  not push you toward "unknown" — judge the label by the historical facts you assert.

# OUTPUT FORMAT (STRICT)
Respond with a single JSON object, nothing else:
{
  "answer": "<plain-text reply only — NO Markdown, NO image links, NO URLs for pictures>",
  "evidence_label": "documented" | "inference" | "contested" | "unknown",
  "used_source_ids": ["<id>", ...],
  "image_ids": ["<img-id>", ...]
}
The "answer" field is shown as plain text. Images listed in image_ids render automatically
above your reply — never embed ![...](...) syntax, HTML, or wikimedia URLs in "answer".
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

/** Strip markdown/HTML image embeds the model sometimes adds despite image_ids. */
function sanitizeAnswerText(answer: string): string {
  return answer
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/<img\b[^>]*>/gi, "")
    .replace(
      /^\s*https?:\/\/(?:upload\.)?wikimedia\.org\/[^\s]+\s*$/gim,
      ""
    )
    .replace(/^\s*https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s]*)?\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function answerQuestion(
  history: ChatMessage[],
  personaSlug?: string
): Promise<GroundedAnswer> {
  const pack = getPersonaPack(personaSlug ?? DEFAULT_PERSONA_SLUG);
  return withPersona(pack, () => answerQuestionForPack(pack, history));
}

async function answerQuestionForPack(
  pack: PersonaPack,
  history: ChatMessage[]
): Promise<GroundedAnswer> {
  const pid = portraitId(pack);
  const { userQuery, retrievalQuery, topicContext, isImageFollowUp } =
    buildRetrievalQuery(history);
  const conversationBrief = buildConversationBrief(
    history,
    pack.speakerLabel ?? `You (${pack.public.name})`
  );
  const shownImageIds = collectPreviouslyShownImageIds(history.slice(0, -1));

  let { sources: retrieved, candidateImages } = await retrieveContext(
    pack,
    retrievalQuery,
    { userQuery, topicContext, isImageFollowUp }
  );

  candidateImages = candidateImages.filter((img) => {
    if (!shownImageIds.has(normId(img.id))) return true;
    return (
      img.id === pid && (isIdentityQuery(userQuery) || isAppearanceQuery(userQuery))
    );
  });

  const system = buildGroundingPrompt(pack, retrieved, candidateImages, {
    isImageFollowUp,
    topicContext,
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
  const usedIds = asStringIds(parsed.used_source_ids);
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

  return {
    answer: sanitizeAnswerText(
      parsed.answer?.trim() ||
        "Forgive me — I find I cannot put words to that just now."
    ),
    evidenceLabel,
    usedSourceIds: usedIds,
    sources: displaySources,
    images: filterServeableImages(images),
  };
}
