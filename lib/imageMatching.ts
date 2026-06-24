import type { ImageAsset } from "@/lib/types";
import { catalogScoreForImage } from "@/personas/myron-angel/imageTopicCatalog";
import {
  CHORIS_1822_IMAGE_IDS,
  CHUMASH_TOMOL_IMAGE_IDS,
  CHUMASH_VERIFIED_IMAGE_IDS,
  isHistoricallyAccurateForStory,
  storyMentionsTomol,
} from "@/lib/imageAccuracy";

/** Visual subject families — used to block cross-theme mismatches. */
export type ImageTheme =
  | "native"
  | "mission"
  | "rancho-fiesta"
  | "rancho-work"
  | "downtown"
  | "railroad"
  | "coast"
  | "education"
  | "portrait"
  | "generic-town";

const IMAGE_THEMES: Record<string, ImageTheme[]> = {
  "img-portrait": ["portrait"],
  "img-chumash-musicians-1873": ["native", "mission"],
  "img-chumash-painted-cave": ["native"],
  "img-chumash-pictograph-oakbrook": ["native"],
  "img-chumash-mortars-exhibit": ["native"],
  "img-chumash-ap-replica": ["native"],
  "img-choris-tule-canoe-1822": ["coast"],
  "img-choris-california-people-1822": ["native"],
  "img-choris-cholovones-hunting-1822": ["coast"],
  "img-ah-louis-store": ["downtown"],
  "img-chinese-railroad-laborers": ["railroad"],
  "img-rancho-fandango-1873": ["rancho-fiesta"],
  "img-rancho-roundup": ["rancho-work"],
  "img-vaqueros-1854": ["rancho-work", "rancho-fiesta"],
  "img-slo-view-1900": ["generic-town"],
};

function themesForImage(img: ImageAsset): ImageTheme[] {
  if (IMAGE_THEMES[img.id]) return IMAGE_THEMES[img.id];
  if (img.id.startsWith("img-mission-")) return ["mission"];
  if (/railroad|train|depot|port-harford|wharf/i.test(img.id)) return ["railroad"];
  if (/street|downtown|courthouse|monterey/i.test(img.id)) return ["downtown"];
  if (/morro|avila|beach|coast|creek/i.test(img.id)) return ["coast"];
  if (/cal-poly|polytechnic/i.test(img.id)) return ["education"];
  if (/rancho|vaquero|fandango/i.test(img.id)) return ["rancho-work"];
  return [];
}

const GENERIC_IMAGE_TOPICS = new Set([
  "town",
  "city",
  "view",
  "landscape",
  "san luis obispo",
  "1900",
  "1905",
  "people",
  "culture",
  "daily life",
  "music",
  "mission",
]);

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-word / phrase match — avoids "rancho" matching inside "ranching". */
export function hayContainsTerm(hay: string, term: string): boolean {
  const t = term.toLowerCase().trim();
  if (!t) return false;
  if (t.includes(" ")) return hay.includes(t);
  return new RegExp(`\\b${escapeRe(t)}\\b`, "i").test(hay);
}

export interface StoryThemeWeights {
  native: number;
  mission: number;
  "rancho-fiesta": number;
  "rancho-work": number;
  downtown: number;
  railroad: number;
  coast: number;
  education: number;
}

/** Detect what the *story* is about from Myron's answer (not just the visitor's question). */
export function detectStoryThemes(answerHay: string): StoryThemeWeights {
  const w: StoryThemeWeights = {
    native: 0,
    mission: 0,
    "rancho-fiesta": 0,
    "rancho-work": 0,
    downtown: 0,
    railroad: 0,
    coast: 0,
    education: 0,
  };

  const bump = (key: keyof StoryThemeWeights, n = 1) => {
    w[key] += n;
  };

  if (
    /\b(?:chumash|indigenous|native peoples|first peoples|basket|baskets|weaving|weave|crafts?|tule|tomol|acorn)\b/i.test(
      answerHay
    )
  ) {
    bump("native", 3);
  }
  if (
    /\b(?:canoe|canoes|tomol|tule|rush boat|paddle|paddling|plank canoe)\b/i.test(
      answerHay
    )
  ) {
    bump("native", 2);
    bump("coast", 2);
  }
  if (
    /\b(?:pictograph|rock art|cave painting|ancient tradition|before the mission|pre-contact|gentile|ancestors)\b/i.test(
      answerHay
    )
  ) {
    bump("native", 2);
  }
  if (/\b(?:settlers?|two cultures|melding|bridge between)\b/i.test(answerHay)) {
    bump("native", 1);
  }
  if (
    /\b(?:mission san luis|san luis obispo de tolosa|the mission|our mission|missionaries|padres|founded 1772)\b/i.test(
      answerHay
    )
  ) {
    bump("mission", 2);
  }
  if (/\b(?:fandango|fiesta|danc(?:e|ing)|celebration|feast|party)\b/i.test(answerHay)) {
    bump("rancho-fiesta", 3);
  }
  if (/\b(?:vaquero|californio|rodeo|round-up|cattle round|cattle herd)\b/i.test(answerHay)) {
    bump("rancho-work", 2);
  }
  if (/\b(?:\brancho\b|ranching|ranchero)\b/i.test(answerHay)) {
    bump("rancho-work", 1);
  }
  if (/\b(?:downtown|main street|storefront|higuera|monterey street)\b/i.test(answerHay)) {
    bump("downtown", 2);
  }
  if (/\b(?:railroad|southern pacific|train|depot|tracks)\b/i.test(answerHay)) {
    bump("railroad", 2);
  }
  if (/\b(?:morro|avila|beach|coast|ocean|harbor|wharf)\b/i.test(answerHay)) {
    bump("coast", 2);
  }
  if (/\b(?:polytechnic|cal poly|vocational school)\b/i.test(answerHay)) {
    bump("education", 2);
  }
  if (/\b(?:ah louis|chinese community|chinese pioneer|chinese-owned)\b/i.test(answerHay)) {
    bump("downtown", 1);
  }
  if (/\b(?:gold rush|forty-niner|49er|hydraulic mining)\b/i.test(answerHay)) {
    bump("native", 1);
  }

  return w;
}

function imageSearchHaystack(img: ImageAsset): string {
  return `${img.caption} ${img.alt} ${img.topics.join(" ")}`.toLowerCase();
}

/** Score how well an image fits the story Myron actually told. */
export function imageStoryMatchScore(img: ImageAsset, storyHay: string): number {
  let score = catalogScoreForImage(img.id, storyHay, hayContainsTerm);
  const stack = imageSearchHaystack(img);

  for (const t of img.topics) {
    if (typeof t !== "string") continue;
    const term = t.toLowerCase();
    if (term.length < 4 || GENERIC_IMAGE_TOPICS.has(term)) continue;
    if (!hayContainsTerm(storyHay, term)) continue;
    score += term.includes(" ") ? 5 : term.length >= 10 ? 4 : 3;
  }

  // Caption keywords the catalog may not list in topics.
  const captionTerms = [
    "chumash",
    "basket",
    "weaving",
    "indigenous",
    "canoe",
    "tomol",
    "tule",
    "pictograph",
    "fandango",
    "vaquero",
    "mission",
    "railroad",
    "courthouse",
    "adobe",
    "creek",
  ];
  for (const term of captionTerms) {
    if (hayContainsTerm(storyHay, term) && stack.includes(term)) {
      score += 2;
    }
  }

  const missionNativeStory = /\b(?:mission|missionaries|padres|neophyte|convert|san buenaventura)\b/i.test(
    storyHay
  );
  const chumashStory = /\bchumash\b/i.test(storyHay);

  if (chumashStory && CHUMASH_VERIFIED_IMAGE_IDS.has(img.id)) {
    score += 8;
  }
  if (storyMentionsTomol(storyHay) && CHUMASH_TOMOL_IMAGE_IDS.has(img.id)) {
    score += 10;
  }
  if (
    /\b(?:acorn|grinding|mortar|pestle)\b/i.test(storyHay) &&
    img.id === "img-chumash-mortars-exhibit"
  ) {
    score += 10;
  }
  if (
    /\b(?:village|dwelling|'ap|ap house|tule house)\b/i.test(storyHay) &&
    img.id === "img-chumash-ap-replica"
  ) {
    score += 10;
  }
  if (
    /\b(?:pictograph|rock art|shaman|swordfish)\b/i.test(storyHay) &&
    img.id === "img-chumash-pictograph-oakbrook"
  ) {
    score += 10;
  }
  if (chumashStory && CHORIS_1822_IMAGE_IDS.has(img.id)) {
    score -= 50;
  }
  if (
    hayContainsTerm(storyHay, "chumash") ||
    hayContainsTerm(storyHay, "indigenous")
  ) {
    if (img.id === "img-chumash-musicians-1873") {
      score += missionNativeStory ? 5 : 2;
    }
  }

  return score;
}

export function imageConflictsWithStory(
  img: ImageAsset,
  themes: StoryThemeWeights
): boolean {
  const imgThemes = themesForImage(img);
  if (imgThemes.length === 0) return false;

  const nativeStrong = themes.native >= 3;
  const fiestaStrong = themes["rancho-fiesta"] >= 2;
  const ranchoWorkStrong = themes["rancho-work"] >= 2 && themes.native === 0;

  if (nativeStrong && imgThemes.includes("rancho-fiesta") && !imgThemes.includes("native")) {
    return true;
  }
  if (nativeStrong && imgThemes.includes("rancho-work") && !imgThemes.includes("native")) {
    return true;
  }
  if (fiestaStrong && imgThemes.includes("native") && !imgThemes.includes("rancho-fiesta")) {
    return true;
  }
  if (ranchoWorkStrong && imgThemes.includes("native")) {
    return true;
  }

  return false;
}

export function isStrongStoryMatch(
  img: ImageAsset,
  storyHay: string,
  themes: StoryThemeWeights
): boolean {
  if (!isHistoricallyAccurateForStory(img.id, storyHay)) return false;
  if (imageConflictsWithStory(img, themes)) return false;
  const score = imageStoryMatchScore(img, storyHay);
  if (img.id === "img-slo-view-1900") {
    return (
      score >= 3 &&
      /\b(?:panorama|view of (?:the )?town|town spread|valley view)\b/i.test(storyHay)
    );
  }
  if (themesForImage(img).includes("mission") && themes.mission >= 2) {
    return score >= 2;
  }
  if (themes.native >= 2 && img.id === "img-chumash-musicians-1873") {
    return themes.mission >= 2 && score >= 2;
  }
  if (themes.native >= 2 && CHUMASH_VERIFIED_IMAGE_IDS.has(img.id)) {
    return score >= 2;
  }
  if (
    themes.native >= 2 &&
    storyMentionsTomol(storyHay) &&
    CHUMASH_TOMOL_IMAGE_IDS.has(img.id)
  ) {
    return score >= 2;
  }
  return score >= 3;
}

/** Pick the best image for the answer text, or null if nothing fits well enough. */
export function pickBestStoryImage(
  candidates: ImageAsset[],
  storyHay: string,
  themes: StoryThemeWeights,
  minScore = 4
): ImageAsset | null {
  let best: ImageAsset | null = null;
  let bestScore = 0;

  for (const img of candidates) {
    if (imageConflictsWithStory(img, themes)) continue;
    if (!isHistoricallyAccurateForStory(img.id, storyHay)) continue;
    const score = imageStoryMatchScore(img, storyHay);
    if (score >= minScore && score > bestScore) {
      best = img;
      bestScore = score;
    }
  }

  return best;
}
