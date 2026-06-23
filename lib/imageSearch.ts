import crypto from "node:crypto";
import type { ImageAsset } from "@/lib/types";

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const SEARCH_ENABLED = process.env.IMAGE_SEARCH_ENABLED !== "false";
const SEARCH_MAX = Number(process.env.IMAGE_SEARCH_MAX || 4);
const CACHE_TTL_MS = 15 * 60 * 1000;

/** Licenses we will show (attribution required where noted). */
const ALLOWED_LICENSE = /public domain|cc0|cc by|cc-by|pd-|no restrictions/i;

const STOP_WORDS =
  /\b(?:me|please|the|a|an|with|and|or|about|tell|what|who|show|picture|photo|historical|county|san|luis|obispo|california|you|your|yourself|why|does|matter)\b/i;

/** Reject clearly modern or irrelevant subject matter. */
const MODERN_REJECT =
  /\b(?:pickup|pick-up|truck|suv|sedan|minivan|highway|freeway|iphone|selfie|protest|rally|thin blue|blue lives|donald trump|maga|202[0-9]|201[0-9]|200[0-9]|199[0-9]|19[89]\d|digital photo|color photo|wikimedia photo challenge)\b/i;

/** Latest year we will show without strong historical-documentary context (e.g. HABS). */
const MAX_CASUAL_YEAR = 1930;

/** Extra search phrases for well-known SLO County places. */
const PLACE_HINTS: Record<string, string[]> = {
  nipomo: [
    "Dana Adobe Nipomo HABS",
    "William G Dana House Nipomo",
    "Rancho Nipomo historical",
  ],
  avila: ["Avila Beach California", "Port San Luis Avila"],
  morro: ["Morro Rock California", "Morro Bay California"],
  pismo: ["Pismo Beach California historical"],
  paso: ["Paso Robles California historical"],
  "san luis obispo": ["San Luis Obispo mission", "San Luis Obispo downtown historical"],
  "arroyo grande": ["Arroyo Grande California historical"],
  cambria: ["Cambria California historical"],
  guadalupe: ["Guadalupe California historical"],
  chumash: ["Chumash California historical"],
};

const cache = new Map<string, { at: number; images: ImageAsset[] }>();

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function metaValue(
  ext: Record<string, { value?: string }> | undefined,
  key: string
): string {
  const raw = ext?.[key]?.value;
  return raw ? stripHtml(raw) : "";
}

function commonsId(title: string): string {
  const hash = crypto.createHash("sha1").update(title).digest("hex").slice(0, 10);
  return `commons-${hash}`;
}

function isAllowedLicense(license: string, copyrighted: string): boolean {
  const lic = license.toLowerCase();
  if (ALLOWED_LICENSE.test(lic)) return true;
  if (/copyrighted|all rights reserved|fair use|non-free/i.test(lic)) return false;
  if (copyrighted.toLowerCase() === "false") return true;
  return false;
}

function captionFromTitle(title: string): string {
  return title
    .replace(/^File:/, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/_/g, " ")
    .trim();
}

function cleanCaption(description: string, title: string): string {
  const d = description.trim();
  if (!d || /^subjects:?$/i.test(d) || d.length < 8) {
    return captionFromTitle(title);
  }
  return d.slice(0, 280);
}

function extractTopic(userQuery: string): string {
  const aboutMatch = userQuery.match(
    /\b(?:about|tell me about|what is|who is|show me|picture of|photo of)\s+(.+)/i
  );
  return (aboutMatch?.[1] || userQuery)
    .replace(/[^\w\s'-]/g, " ")
    .replace(STOP_WORDS, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Pull nouns from retrieved source text that might improve image search. */
function hintKeywords(sourceHints: string[]): string[] {
  const text = sourceHints.join(" ").toLowerCase();
  const found: string[] = [];
  for (const word of [
    "adobe",
    "mission",
    "rancho",
    "downtown",
    "street",
    "harbor",
    "wharf",
    "port",
    "creek",
    "chumash",
    "vaquero",
    "ranch",
    "railroad",
    "courthouse",
  ]) {
    if (text.includes(word)) found.push(word);
  }
  const proper = sourceHints.join(" ").match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b/g);
  if (proper) {
    for (const p of proper.slice(0, 3)) {
      if (p.length > 3 && !/San Luis|Obispo County|Captain/i.test(p)) {
        found.push(p);
      }
    }
  }
  return [...new Set(found)];
}

/** Build several targeted Commons queries; a single broad query often misses good hits. */
export function buildImageSearchQueries(
  userQuery: string,
  sourceHints: string[] = []
): string[] {
  const topic = extractTopic(userQuery);
  if (!topic) return [];

  const queries = new Set<string>();
  const topicLower = topic.toLowerCase();

  queries.add(`${topic} California historical photograph`);

  const placeHints = PLACE_HINTS[topicLower];
  if (placeHints) {
    for (const h of placeHints) queries.add(h);
  }

  for (const kw of hintKeywords(sourceHints)) {
    queries.add(`${topic} ${kw}`);
    if (/adobe|mission|rancho/i.test(kw)) {
      queries.add(`${kw} ${topic} HABS`);
    }
  }

  // Short topic-only query as fallback (e.g. "nipomo") — always historical
  if (topic.split(/\s+/).length <= 3) {
    queries.add(`${topic} historical`);
  }

  return [...queries].slice(0, 6);
}

/** Intro / meta questions should not trigger a broad image search. */
export function isIntroOrMetaQuery(userQuery: string): boolean {
  return /\b(?:who are you|introduce yourself|why does .+ matter|what are you|tell me about yourself|how do you work|are you real|are you ai|what is echoes)\b/i.test(
    userQuery
  );
}

/** Only run live Commons search for questions about a specific historical subject. */
export function queryWantsImageSearch(
  userQuery: string,
  contextQuery = ""
): boolean {
  if (isIntroOrMetaQuery(userQuery) && !/\b(?:look like|appearance|portrait|likeness|images?|pictures?|photos?)\b/i.test(userQuery)) {
    return /\b(?:look like|appearance|portrait|likeness)\b/i.test(userQuery);
  }
  if (
    /\b(?:images?|pictures?|photos?|illustration|illustrate|accompany|show me)\b/i.test(
      userQuery
    )
  ) {
    return true;
  }
  const combined = `${userQuery} ${contextQuery}`.trim();
  return /\b(?:tell me about|what is|what was|what happened|show me|picture of|photo of|look like|who was|who is|mission|rancho|adobe|rock|beach|creek|town|downtown|nipomo|avila|morro|pismo|arroyo|paso|chumash|vaquero|ranch|harbor|wharf|port|polytechnic|cal poly|courthouse|railroad|street|landmark|figure|native|indigenous|bandit|outlaw|vigilante|pioneer|history|county|settlement|farming|agriculture)\b/i.test(
    combined
  );
}

/** Visitor is asking for an image about the ongoing topic, not a new subject. */
export function isImageFollowUpQuery(userQuery: string): boolean {
  return /\b(?:any images?|do you have (?:any )?images?|images? to accompany|got (?:any )?images?|(?:and )?pics?|pictures?|photos?|show me (?:an? )?(?:image|picture|photo)|illustrat|accompany (?:this|that|the|what))\b/i.test(
    userQuery
  );
}

/** Latest message refers back to the conversation without naming the topic. */
export function isContextualFollowUp(userQuery: string): boolean {
  return (
    isImageFollowUpQuery(userQuery) ||
    /\b(?:this|that|those|it|them|what you (?:just )?(?:said|described|told|mentioned)|the information|more about that|tell me more|go on|continue)\b/i.test(
      userQuery
    )
  );
}

/** Extract the most likely year from caption/title metadata. */
export function extractImageYear(...texts: string[]): number | null {
  const years: number[] = [];
  for (const text of texts) {
    for (const m of text.matchAll(/\b(1[789]\d{2}|19\d{2}|20\d{2})\b/g)) {
      years.push(Number(m[1]));
    }
    for (const m of text.matchAll(/\bca\.?\s*(1[789]\d{2}|19[0-2]\d)\b/gi)) {
      years.push(Number(m[1]));
    }
  }
  if (years.length === 0) return null;
  // Prefer the earliest year cited (usually the subject date, not upload date).
  return Math.min(...years);
}

/** True when an image plausibly dates from Myron's era (roughly pre-1930s). */
export function isHistoricalImageAsset(img: ImageAsset): boolean {
  if (!img.id.startsWith("commons-")) return true;

  const subjectHay = `${img.caption} ${img.alt}`;
  if (MODERN_REJECT.test(subjectHay)) return false;

  const year = extractImageYear(subjectHay);
  if (year !== null) {
    if (year >= 1950) return false;
    if (year > MAX_CASUAL_YEAR) {
      return /historic american buildings survey|habs/i.test(subjectHay);
    }
    return true;
  }

  return /habs|historic american|engraving|lithograph|daguerreotype|albumen|black.?and.?white|ca\.\s*1[89]\d{2}|ca\.\s*19[0-2]\d|19th century|18th century/i.test(
    subjectHay
  );
}

/** @deprecated use buildImageSearchQueries */
export function buildImageSearchQuery(
  userQuery: string,
  sourceHints: string[] = []
): string {
  return buildImageSearchQueries(userQuery, sourceHints)[0] ?? "";
}

function scoreResult(title: string, caption: string, topic: string): number {
  const topicTerms = topic
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 3);
  const hay = `${title} ${caption}`.toLowerCase();
  let score = 0;

  for (const term of topicTerms) {
    if (hay.includes(term)) score += 5;
  }

  if (/adobe|mission|rancho|street|photograph|ca\.\s*\d{4}|habs|historic american/i.test(hay)) {
    score += 3;
  }
  if (/microfilm|blur|skew|tear|inherent to|\.pdf$/i.test(`${caption} ${title}`)) {
    score -= 12;
  }
  if (/banner\.jpg|logo|icon|seal|locationof|202[0-9]|201[0-9]|200[0-9]|199[0-9]|19[89]\d|pickup|pick-up|truck|flag|protest|rally|color photo|digital/i.test(hay)) {
    score -= 20;
  }
  if (/migrant|makeshift|regional park|arctostaphylos/i.test(hay)) {
    score -= 4;
  }

  const year = extractImageYear(title, caption);
  if (year !== null) {
    if (year <= 1911) score += 4;
    else if (year <= MAX_CASUAL_YEAR) score += 2;
    else if (!/habs|historic american/i.test(hay)) score -= 15;
  } else if (!/habs|historic american|engraving|lithograph|ca\.\s*1[89]|ca\.\s*19[0-2]/i.test(hay)) {
    score -= 6;
  }

  return score;
}

interface CommonsPage {
  title?: string;
  imageinfo?: Array<{
    thumburl?: string;
    url?: string;
    descriptionurl?: string;
    extmetadata?: Record<string, { value?: string }>;
  }>;
}

async function fetchCommonsSearch(
  searchQuery: string,
  limit: number,
  topic: string
): Promise<{ score: number; asset: ImageAsset }[]> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: searchQuery,
    gsrnamespace: "6",
    gsrlimit: String(Math.min(limit * 2, 10)),
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "900",
    origin: "*",
  });

  const res = await fetch(`${COMMONS_API}?${params.toString()}`, {
    headers: {
      "User-Agent":
        "ECHOES/0.1 (local history education; matthewkennedy22@gmail.com)",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    query?: { pages?: Record<string, CommonsPage> };
  };
  const pages = data.query?.pages ?? {};
  const ranked: { score: number; asset: ImageAsset }[] = [];

  for (const page of Object.values(pages)) {
    const title = page.title;
    const info = page.imageinfo?.[0];
    if (!title || !info) continue;
    if (/\.pdf$/i.test(title)) continue;

    const src = info.thumburl || info.url;
    if (!src) continue;

    const ext = info.extmetadata;
    const license =
      metaValue(ext, "LicenseShortName") || metaValue(ext, "UsageTerms");
    const copyrighted = metaValue(ext, "Copyrighted");
    if (!isAllowedLicense(license, copyrighted)) continue;

    const description = cleanCaption(
      metaValue(ext, "ImageDescription"),
      title
    );
    const artist = metaValue(ext, "Artist") || metaValue(ext, "Credit");
    const uploadDate =
      metaValue(ext, "DateTimeOriginal") || metaValue(ext, "DateTime");
    const subjectYear = extractImageYear(title, description);
    const date =
      subjectYear !== null
        ? String(subjectYear)
        : uploadDate.slice(0, 30) || undefined;
    const score = scoreResult(title, description, topic);
    if (score <= 0) continue;
    if (!isHistoricalImageAsset({
      id: commonsId(title),
      src,
      caption: description,
      alt: description,
      topics: [],
      dateRange: date,
      citation: "",
      license: license || "",
    })) continue;

    ranked.push({
      score,
      asset: {
        id: commonsId(title),
        src,
        caption: description,
        alt: description.slice(0, 120) || "Historical photograph",
        topics: [searchQuery],
        dateRange: date,
        citation: artist
          ? `${artist}. Wikimedia Commons.`
          : "Wikimedia Commons.",
        url: info.descriptionurl,
        license: license || "See Wikimedia Commons",
      },
    });
  }

  return ranked;
}

/**
 * Search Wikimedia Commons for public-domain / freely licensed historical images
 * related to the user's question. Results are cached briefly per query.
 */
export async function searchHistoricalImages(
  userQuery: string,
  sourceHints: string[] = []
): Promise<ImageAsset[]> {
  if (!SEARCH_ENABLED) return [];

  const topic = extractTopic(userQuery);
  if (!topic.trim()) return [];

  const queries = buildImageSearchQueries(userQuery, sourceHints);
  const cacheKey = `${topic.toLowerCase()}|${queries.join(";")}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.images;

  try {
    const batches = await Promise.all(
      queries.map((q) => fetchCommonsSearch(q, SEARCH_MAX, topic))
    );

    const merged = new Map<string, { score: number; asset: ImageAsset }>();
    for (const batch of batches) {
      for (const item of batch) {
        const existing = merged.get(item.asset.id);
        if (!existing || item.score > existing.score) {
          merged.set(item.asset.id, item);
        }
      }
    }

    const sorted = [...merged.values()].sort((a, b) => b.score - a.score);
    const images = sorted
      .filter((r) => r.score > 0 && isHistoricalImageAsset(r.asset))
      .slice(0, SEARCH_MAX)
      .map((r) => r.asset);

    cache.set(cacheKey, { at: Date.now(), images });
    return images;
  } catch {
    return [];
  }
}
