import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { embed, embedMany, chatJSON, EMBED_DIM } from "@/lib/llm";
import { myronAngelSystemPrompt } from "@/personas/myron-angel/persona";
import { myronAngelSources } from "@/personas/myron-angel/sources";
import {
  isContextualFollowUp,
  isHistoricalImageAsset,
  isImageFollowUpQuery,
  isIntroOrMetaQuery,
  queryWantsImageSearch,
  searchHistoricalImages,
} from "@/lib/imageSearch";
import { myronAngelImages } from "@/personas/myron-angel/images";
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

const BOOK_PATH = path.join(
  process.cwd(),
  "personas",
  "myron-angel",
  "book-chunks.json"
);
const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_PATH = path.join(CACHE_DIR, "myron-angel-embeddings.json");

/** Load the ingested 1883 book chunks (if present) as SourceChunks. */
function loadBookSources(): SourceChunk[] {
  try {
    const raw = fs.readFileSync(BOOK_PATH, "utf8");
    const data = JSON.parse(raw) as SourceChunk[];
    return data.map((d) => ({
      id: d.id,
      text: d.text,
      topics: d.topics ?? ["san luis obispo history"],
      dateRange: d.dateRange ?? "pre-1883",
      sourceType: "primary",
      citation: d.citation,
      url: d.url,
      reliability: d.reliability ?? "medium",
    }));
  } catch {
    return [];
  }
}

// Build the combined corpus once. Curated facts come first.
const bookSources = loadBookSources();
const corpus: SourceChunk[] = [...myronAngelSources, ...bookSources];
const curatedCount = myronAngelSources.length;

function corpusHash(): string {
  const h = crypto.createHash("sha1");
  h.update(`dim:${EMBED_DIM}|n:${corpus.length}`);
  for (const c of corpus) h.update(`${c.id}:${c.text.length}|`);
  return h.digest("hex");
}

let corpusEmbeddings: number[][] | null = null;
let embeddingJob: Promise<number[][]> | null = null;

function tryLoadCache(): number[][] | null {
  try {
    const raw = fs.readFileSync(CACHE_PATH, "utf8");
    const cached = JSON.parse(raw) as {
      hash: string;
      vectors: number[][];
    };
    if (cached.hash === corpusHash() && cached.vectors.length === corpus.length) {
      return cached.vectors;
    }
  } catch {
    /* no usable cache */
  }
  return null;
}

function saveCache(vectors: number[][]) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(
      CACHE_PATH,
      JSON.stringify({ hash: corpusHash(), vectors }),
      "utf8"
    );
  } catch {
    /* read-only fs: keep embeddings in memory only */
  }
}

async function ensureEmbeddings(): Promise<number[][]> {
  if (corpusEmbeddings) return corpusEmbeddings;

  const cached = tryLoadCache();
  if (cached) {
    corpusEmbeddings = cached;
    return cached;
  }

  if (!embeddingJob) {
    const texts = corpus.map((c) => `${c.topics.join(", ")}: ${c.text}`);
    console.log(
      `[ECHOES] Indexing ${texts.length} source chunks (one-time)…`
    );
    embeddingJob = embedMany(texts, (done, total) => {
      if (done % 480 === 0 || done === total) {
        console.log(`[ECHOES] embedded ${done}/${total}`);
      }
    }).then((vectors) => {
      corpusEmbeddings = vectors;
      saveCache(vectors);
      console.log("[ECHOES] Index ready.");
      return vectors;
    });
  }
  return embeddingJob;
}

// --- Image index (tiny: embedded once in memory) ---
let imageEmbeddings: number[][] | null = null;
let imageEmbeddingJob: Promise<number[][]> | null = null;

async function ensureImageEmbeddings(): Promise<number[][]> {
  if (imageEmbeddings) return imageEmbeddings;
  if (myronAngelImages.length === 0) return (imageEmbeddings = []);
  if (!imageEmbeddingJob) {
    const texts = myronAngelImages.map(
      (img) => `${img.topics.join(", ")}: ${img.caption}`
    );
    imageEmbeddingJob = embedMany(texts).then((vectors) => {
      imageEmbeddings = vectors;
      return vectors;
    });
  }
  return imageEmbeddingJob;
}

/** Pre-build the embedding index (used by the warm-up endpoint). */
export async function warmIndex(): Promise<{ chunks: number; ready: boolean }> {
  await Promise.all([ensureEmbeddings(), ensureImageEmbeddings()]);
  return { chunks: corpus.length, ready: corpusEmbeddings !== null };
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

/** Always include verified biographical sources for self-introduction questions. */
function pinIdentitySources(sources: SourceChunk[]): SourceChunk[] {
  const pinned = myronAngelSources.filter(
    (s) =>
      s.id.startsWith("bio-") ||
      s.id.startsWith("calpoly-") ||
      s.id.startsWith("philosophy-")
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
  const hay = topicHay.toLowerCase();
  let pinned = myronAngelImages.filter((img) => imageMatchScore(img, hay) >= 3);
  if (isMissionQuery(hay)) {
    const mission = myronAngelImages.filter(
      (img) => isMissionImage(img) && imageMatchScore(img, hay) >= 2
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
  retrievalQuery: string,
  opts: {
    userQuery: string;
    topicContext: string;
    isImageFollowUp: boolean;
  }
): Promise<{ sources: SourceChunk[]; candidateImages: ImageAsset[] }> {
  const { userQuery, topicContext, isImageFollowUp } = opts;
  const [embeddings, imgEmbeddings, [queryEmbedding]] = await Promise.all([
    ensureEmbeddings(),
    ensureImageEmbeddings(),
    embed([retrievalQuery]),
  ]);

  const scored = corpus.map((chunk, i) => ({
    index: i,
    score:
      cosine(queryEmbedding, embeddings[i]) +
      (i < curatedCount ? CURATED_BOOST : 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  const topHits = scored.slice(0, TOP_K);

  // Expand each book hit to include its page-adjacent neighbors, so context
  // that continues across a chunk/page boundary is never truncated. Curated
  // facts are discrete and are not expanded.
  const selected = new Set<number>();
  for (const hit of topHits) {
    selected.add(hit.index);
    if (hit.index >= curatedCount) {
      for (let d = 1; d <= NEIGHBOR_RADIUS; d++) {
        const before = hit.index - d;
        const after = hit.index + d;
        if (before >= curatedCount) selected.add(before);
        if (after < corpus.length) selected.add(after);
      }
    }
  }

  // Return in corpus order: curated facts first, then book passages in
  // page/reading order, so the model sees a continuous narrative.
  let sources = [...selected].sort((a, b) => a - b).map((i) => corpus[i]);
  if (isIdentityQuery(userQuery)) {
    sources = pinIdentitySources(sources);
  }

  const sourceHints = sources.slice(0, 3).map((s) => s.text.slice(0, 100));
  const imageSearchQuery = topicContext || retrievalQuery;
  const searchImages =
    queryWantsImageSearch(userQuery, topicContext || retrievalQuery)
      ? await searchHistoricalImages(imageSearchQuery, sourceHints)
      : [];

  // Rank local library images by retrieval embedding; the model picks from these
  // plus any live search hits (Wikimedia Commons, public domain / CC).
  let localCandidates = myronAngelImages
    .map((img, i) => ({ img, score: cosine(queryEmbedding, imgEmbeddings[i]) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, IMAGE_CANDIDATES)
    .map((x) => x.img);

  localCandidates = pinTopicImages(
    `${topicContext} ${retrievalQuery} ${sourceHints.join(" ")}`,
    localCandidates
  );

  // Intro / meta: identity questions always get the portrait; other meta gets none.
  if (isIntroOrMetaQuery(userQuery) && !isImageFollowUp) {
    if (isIdentityQuery(userQuery)) {
      const portrait = myronAngelImages.find((img) => img.id === "img-portrait");
      localCandidates = portrait ? [portrait] : [];
    } else {
      const wantsPortrait = /\b(?:look like|appearance|portrait|likeness)\b/i.test(
        userQuery
      );
      localCandidates = wantsPortrait
        ? localCandidates.filter((img) => img.id === "img-portrait")
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

  return { sources, candidateImages };
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
function buildConversationBrief(history: ChatMessage[]): string {
  if (history.length <= 1) return "";
  const prior = history.slice(0, -1).slice(-4);
  return prior
    .map((m) => {
      const label = m.role === "user" ? "Visitor" : "You (Myron)";
      return `${label}: ${m.content.trim().slice(0, 500)}`;
    })
    .join("\n\n");
}

const GENERIC_IMAGE_TOPICS = new Set([
  "town",
  "city",
  "view",
  "landscape",
  "san luis obispo",
  "1900",
  "1905",
]);

/** Panorama / generic town views — only when the visitor asks about a vista. */
const GENERIC_ONLY_IMAGES = new Set(["img-slo-view-1900"]);

function isMissionQuery(topicHay: string): boolean {
  if (/\bbuenaventura\b/i.test(topicHay)) return false;
  return /\b(?:mission san luis|san luis obispo de tolosa|mission de tolosa|the mission|our mission|mission church|mission history|founded 1772|franciscan padres)\b/i.test(
    topicHay
  );
}

function isMissionImage(img: ImageAsset): boolean {
  return img.id.startsWith("img-mission-");
}

function normId(id: string): string {
  return id.toLowerCase().replace(/(\d+)/g, (n) => String(parseInt(n, 10)));
}

function collectPreviouslyShownImageIds(history: ChatMessage[]): Set<string> {
  const shown = new Set<string>();
  for (const m of history) {
    if (m.role === "assistant" && m.imageIds?.length) {
      for (const id of m.imageIds) shown.add(normId(id));
    }
  }
  return shown;
}

function imageMatchScore(img: ImageAsset, topicHay: string): number {
  let score = 0;
  for (const t of img.topics) {
    const term = t.toLowerCase();
    if (term.length < 4 || GENERIC_IMAGE_TOPICS.has(term)) continue;
    if (!topicHay.includes(term)) continue;
    score += term.includes(" ") ? 4 : term.length >= 10 ? 3 : 2;
  }
  if (
    /\b(?:old town|downtown|main street|higuera|monterey street|storefront|commercial street)\b/i.test(
      topicHay
    )
  ) {
    if (
      img.topics.some((t) =>
        /downtown|old town|street|shops|storefronts|monterey/i.test(t)
      )
    ) {
      score += 2;
    }
  }
  return score;
}

/** Avoid auto-showing a generic town panorama when the topic needs something specific. */
function isStrongImageMatch(img: ImageAsset, topicHay: string): boolean {
  if (GENERIC_ONLY_IMAGES.has(img.id)) {
    return /\b(?:panorama|view of (?:the )?town|town spread|valley view|beneath.*peaks|looking north)\b/i.test(
      topicHay
    );
  }
  const score = imageMatchScore(img, topicHay);
  if (isMissionImage(img) && isMissionQuery(topicHay)) return score >= 2;
  return score >= 3;
}

function imageAllowedForQuery(
  img: ImageAsset,
  userQuery: string,
  topicHay: string
): boolean {
  if (img.id === "img-portrait") {
    return (
      isIdentityQuery(userQuery) ||
      /\b(?:look like|appearance|portrait|likeness)\b/i.test(userQuery)
    );
  }
  return isStrongImageMatch(img, topicHay);
}

function buildGroundingPrompt(
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
${myronAngelSystemPrompt}

${
  opts?.conversationBrief
    ? `# CONVERSATION SO FAR (already told — do NOT repeat)
${opts.conversationBrief}
`
    : ""
}
# SOURCES RETRIEVED FOR THIS QUESTION
Use ONLY the facts below for historical claims. Each is tagged with an id like [bio-birth] or [book-0123].
You are in **1905** — do NOT state events, dates, landmarks, or traditions from after 1905.
If the visitor asks for a fun fact, pick one **from these sources only** (pre-1906 history).
Some entries are dense 1883 prose transcribed by OCR; read them carefully and paraphrase clearly for the visitor.
${sourceBlock}

# TEMPORAL ENFORCEMENT (1905)
- Every historical claim must be either (a) supported by a source above, or (b) general
  knowledge plausible for 1905 (e.g. Mission founding 1772, Gold Rush, statehood 1850).
- Never cite dates after **1905** for events you "know" firsthand. Never invent modern SLO trivia.
- If sources do not support an interesting answer, share a documented fact from the sources
  rather than drawing on 20th-century knowledge. Label "unknown" only if truly unsupported.

# IMAGES YOU MAY SHOW
You may show at most ONE image per reply. Include an image only when one **clearly and
specifically** illustrates the exact place, building, person, or event you are discussing.
When in doubt, use empty image_ids — a mismatched image is worse than none. Pick from:
${imageBlock}
${
  opts?.shownImageIds?.length
    ? `
Already shown this session — do NOT repeat these ids: ${opts.shownImageIds.join(", ")}
`
    : ""
}
Rules for images:
- **High bar for a match:** The image must depict the **same subject** you are narrating
  (e.g. Mission photo for mission history, courthouse for county government, railroad
  photo for the Southern Pacific). Generic town panoramas do not fit specific stories.
- **Skip when none fit:** Use empty image_ids for introductions, abstract county pride,
  pure opinions, or topics with no good visual in the list (e.g. an outlaw tale with no
  bandit photograph available). Never force an unrelated image.
- Do NOT show images for "what is echoes" / "are you AI" meta questions.
- For **"who are you"** and other identity introductions → **always** include img-portrait
  when it is listed, and refer to the likeness in your answer.
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
- Good example (with img-portrait): "As this likeness shows, I wore a dark beard in my
  middle years — though in 1905 I am an aged gentleman of seventy-eight, white-haired…"
- Bad example: "...If you wish, I can show you a likeness." (while also setting image_ids)
- Bad example: showing img-slo-view-1900 when answering about Jack Powers — unrelated.
- Mission questions: choose the **most specific** mission image (facade, arcade, south wing,
  street view, engraving, postcard) — six verified views exist; do not default to a town panorama.
${
  opts?.isImageFollowUp
    ? `
# IMAGE FOLLOW-UP (visitor asked for a picture about the ongoing topic)
The visitor wants a visual for what you **already discussed** — they do not need the story again.
- **Do NOT re-narrate** Jack Powers, vigilance committees, or any facts from your prior reply.
- Give **2–5 sentences** about what the image shows and how it connects. Then optionally one
  follow-up question about a **new** angle.
- If a listed image matches the topic, include it in image_ids. If none truly fit (e.g. no
  bandit photo for an outlaw tale), say so honestly and use **empty image_ids** — do NOT show
  an unrelated town panorama.
- Chumash / native peoples → img-chumash-musicians-1873 when listed.
- Old town / downtown → img-slo-street-1905 when listed, not a distant valley view.
- Mission San Luis Obispo → pick the **most specific** mission id (facade: img-mission-front-1880,
  arcade: img-mission-arcade-1870, south wing: img-mission-south-1888, south street view:
  img-mission-view-south-1904, engraving from my book: img-mission-1883, color postcard:
  img-mission-1900, general exterior: img-mission-exterior). Do not repeat an id already shown.
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
Pick ONE surprising but **documented** fact from the sources above — mission history, rancho
era, railroad, native peoples (from sources), your Polytechnic campaign, etc. It must be
something you could know in **1905**. Do NOT use modern trivia (nothing from the 1910s onward).
`
    : ""
}

# IDENTITY QUESTIONS ("who are you", introductions)
When the visitor asks who you are or why San Luis Obispo matters to you, ground your
answer in the biographical sources above (ids starting with bio-, calpoly-, or
philosophy-). Label "documented", cite the ids you relied on, and do NOT use "unknown"
for a standard self-introduction — those biographical sources exist precisely for this.
When the visitor asks **who you are**, **introduce yourself**, or **tell me about yourself**,
you MUST include img-portrait in image_ids and weave the likeness into your reply — as
though you have just set your portrait before them on the table.

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

/** Post-1905 references the 1905 persona should not make. */
function detectAnachronism(text: string): boolean {
  const lower = text.toLowerCase();
  if (/\bbubble\s*gum|bubblegum alley\b/.test(lower)) return true;
  if (
    /\b(?:highway\s*101|us[\s-]?101|freeway|cal poly state|instagram|world war)\b/.test(
      lower
    )
  )
    return true;
  if (/\b(19(?:1[1-9]|[2-9]\d)|20\d{2})s\b/.test(lower)) return true;
  if (
    /\b(?:in|since|from|beginning in|started in|opened in|dating to|tradition began in)\s+(19(?:0[6-9]|[1-9]\d)|20\d{2})\b/i.test(
      text
    )
  )
    return true;
  return false;
}

const ANACHRONISM_RETRY = `
CRITICAL: Your draft mentioned something from AFTER 1905 or not grounded in the sources.
You are Myron Angel in 1905. Rewrite using ONLY the retrieved sources and knowledge
plausible for December 1905. Do not mention Bubblegum Alley, mid-20th-century events,
modern campus life, or any date after 1905 for things you claim to know.
`.trim();

function parseModelAnswer(raw: string): {
  answer?: string;
  evidence_label?: string;
  used_source_ids?: string[];
  image_ids?: string[];
} {
  try {
    return JSON.parse(raw);
  } catch {
    return { answer: raw };
  }
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
  history: ChatMessage[]
): Promise<GroundedAnswer> {
  const { userQuery, retrievalQuery, topicContext, isImageFollowUp } =
    buildRetrievalQuery(history);
  const conversationBrief = buildConversationBrief(history);
  const shownImageIds = collectPreviouslyShownImageIds(history.slice(0, -1));

  let { sources: retrieved, candidateImages } = await retrieveContext(
    retrievalQuery,
    { userQuery, topicContext, isImageFollowUp }
  );

  candidateImages = candidateImages.filter((img) => {
    if (!shownImageIds.has(normId(img.id))) return true;
    return img.id === "img-portrait" && isIdentityQuery(userQuery);
  });

  const system = buildGroundingPrompt(retrieved, candidateImages, {
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

  if (detectAnachronism(parsed.answer ?? raw)) {
    raw = await chatJSON(`${system}\n\n${ANACHRONISM_RETRY}`, history);
    parsed = parseModelAnswer(raw);
  }

  let evidenceLabel: EvidenceLabel = EVIDENCE_LABELS.includes(
    parsed.evidence_label as EvidenceLabel
  )
    ? (parsed.evidence_label as EvidenceLabel)
    : "inference";

  // The model sometimes drops the zero-padding (e.g. "book-88" vs "book-0088"),
  // so match on a normalized form rather than exact string equality.
  const usedIds = Array.isArray(parsed.used_source_ids)
    ? parsed.used_source_ids
    : [];
  const usedNorm = new Set(usedIds.map(normId));
  const usedSources = retrieved.filter((s) => usedNorm.has(normId(s.id)));

  const topicHay = `${topicContext} ${retrievalQuery} ${parsed.answer ?? ""}`.toLowerCase();
  const imageIds = Array.isArray(parsed.image_ids) ? parsed.image_ids : [];
  const imageNorm = new Set(imageIds.map(normId));
  let images = candidateImages.filter((img) => imageNorm.has(normId(img.id)));

  // Drop images that fail period, relevance, or repeat checks.
  images = images.filter((img) => {
    if (!isHistoricalImageAsset(img)) return false;
    if (isIntroOrMetaQuery(userQuery) && !isImageFollowUp && img.id !== "img-portrait")
      return false;
    if (shownImageIds.has(normId(img.id)) && img.id !== "img-portrait") return false;
    return imageAllowedForQuery(img, userQuery, topicHay);
  });

  // Fallback: strong match only, never repeat (except portrait on identity).
  if (images.length === 0 && candidateImages.length > 0) {
    const skipProactive =
      (isIntroOrMetaQuery(userQuery) && !isImageFollowUp) ||
      isRepetitionComplaint(userQuery) ||
      (isShortFollowUp(userQuery) && !isImageFollowUp) ||
      evidenceLabel === "unknown";

    if (!skipProactive) {
      const pinned = candidateImages.find(
        (img) =>
          !shownImageIds.has(normId(img.id)) &&
          isHistoricalImageAsset(img) &&
          imageAllowedForQuery(img, userQuery, topicHay) &&
          imageMatchScore(img, topicHay) >= 4
      );
      if (pinned) {
        images = [pinned];
      }
    }
  }

  // "Who are you" / self-introduction: always show the portrait.
  if (images.length === 0 && isIdentityQuery(userQuery)) {
    const portrait =
      candidateImages.find((img) => img.id === "img-portrait") ??
      myronAngelImages.find((img) => img.id === "img-portrait");
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
    const bioSources = retrieved.filter((s) =>
      /^(bio-|calpoly-|philosophy-)/.test(s.id)
    );
    if (bioSources.length > 0) {
      evidenceLabel = "documented";
      displaySources = usedSources.length > 0 ? usedSources : bioSources.slice(0, 6);
    }
  }

  return {
    answer: sanitizeAnswerText(
      parsed.answer?.trim() ||
        "Forgive me — I find I cannot put words to that just now."
    ),
    evidenceLabel,
    usedSourceIds: usedIds,
    sources: displaySources,
    images,
  };
}
