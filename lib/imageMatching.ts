import type { ImageAsset } from "@/lib/types";
import { getActivePersona } from "@/lib/activePersona";
import { catalogScoreForImage as scoreFromTopics } from "@/personas/topicCatalog";
import {
  CHORIS_1822_IMAGE_IDS,
  CHUMASH_TOMOL_IMAGE_IDS,
  CHUMASH_VERIFIED_IMAGE_IDS,
  isHistoricallyAccurateForStory,
  storyMentionsTomol,
} from "@/lib/imageAccuracy";

function catalogScoreForImage(
  imageId: string,
  storyHay: string,
  hayContains: (hay: string, term: string) => boolean
): number {
  return scoreFromTopics(
    getActivePersona().imageTopics,
    imageId,
    storyHay,
    hayContains
  );
}

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
  "img-buchon-house": ["downtown"],
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

/** Weak topic tokens — matching these alone must not justify showing an image. */
const GENERIC_WEAK_TOPICS = new Set([
  "town",
  "city",
  "view",
  "landscape",
  "san luis obispo",
  "san francisco",
  "san diego",
  "santa barbara",
  "california",
  "nevada",
  "1900",
  "1905",
  "1885",
  "1890",
  "people",
  "culture",
  "daily life",
  "music",
  "history",
  "county",
  "valley",
  "bay",
  "coast",
  "pacific coast",
  "metropolis",
  "pioneer",
  "biography",
  "appearance",
  "yourself",
  "identity",
  "church",
  "gold rush",
  // Too generic — matching these alone must not attach a Chumash dwelling
  // (or similar) to answers about a Victorian house / residence.
  "house",
  "home",
  "dwelling",
  "look like",
  "sign",
  "lot",
  "hotel",
  "street",
  "downtown",
  "plaza",
  "star",
  "settlement",
]);

/** Thematic images require the answer to mention their subject, not just the region. */
const SUBJECT_ANCHOR_RULES: {
  test: (img: ImageAsset) => boolean;
  pattern: RegExp;
}[] = [
  {
    test: (img) =>
      /mission/i.test(img.id) ||
      img.topics.some((t) =>
        /\bmission (?:dolores|san|santa|de)\b/i.test(t)
      ),
    pattern:
      /\b(?:mission(?:\s+(?:san|dolores|santa|de|del|los|la))?|(?:los\s+)?dolores|padres?|friars?|franciscan|1776|1772|1782|1786|adobe mission|mission church|san francisco de as[ií]s|san luis obispo de tolosa|tolosa|queen of the missions)\b/i,
  },
  {
    test: (img) =>
      /golden-gate|angel-island|telegraph-hill|tamalpais/i.test(img.id),
    pattern:
      /\b(?:golden gate|angel island|telegraph hill|mount tamalpais|tamalpais|the strait|ferry|marina(?: district)?|waterfront|sandy shore|bay shore|san francisco bay)\b/i,
  },
  {
    test: (img) => /railroad|train|depot|station|locomotive/i.test(img.id),
    pattern:
      /\b(?:railroad|railway|train|depot|locomotive|southern pacific|right of way|hemme station|tracks|branch line)\b/i,
  },
  {
    test: (img) => /tahoe|timber-claim|nevada|carson/i.test(img.id),
    pattern:
      /\b(?:tahoe|lake tahoe|timber claim|nevada|carson city|roughing it|sierra nevada)\b/i,
  },
  {
    test: (img) =>
      /-1890|map/i.test(img.id) || img.topics.some((t) => t.toLowerCase() === "map"),
    pattern: /\b(?:map|mapped|cartograph|survey|bird.?s eye|panorama of the city)\b/i,
  },
  {
    test: (img) => /morro|avila|harford|wharf|slo-creek|slo-street|slo-view/i.test(img.id),
    pattern:
      /\b(?:morro rock|morro|avila|port harford|harford|san luis creek|higuera|monterey street)\b/i,
  },
  {
    test: (img) => /bancroft-ranch|spring-valley/i.test(img.id),
    pattern: /\b(?:spring valley|bancroft ranch|country home|country retreat)\b/i,
  },
  {
    test: (img) => /horton-house|horton-plaza|city-park|gaslamp|old-town/i.test(img.id),
    pattern:
      /\b(?:horton house|horton plaza|city park|balboa park|gaslamp|old town|new town|whale fishery)\b/i,
  },
  {
    test: (img) => /courthouse|court-house/i.test(img.id),
    pattern: /\b(?:courthouse|court house|county government|judicial)\b/i,
  },
  {
    test: (img) => /vaquero|fandango|rancho-roundup/i.test(img.id),
    pattern: /\b(?:vaquero|californio|fandango|fiesta|round-?up|rodeo)\b/i,
  },
  {
    test: (img) => /presidio|state-street|painted-cave/i.test(img.id),
    pattern:
      /\b(?:presidio|state street|painted cave|pictograph|rock art)\b/i,
  },
  {
    test: (img) => /danville|alamo|san-ramon/i.test(img.id),
    pattern: /\b(?:danville|alamo|san ramon|hemme station)\b/i,
  },
  {
    test: (img) =>
      img.id === "img-chumash-ap-replica" ||
      img.id === "img-chumash-mortars-exhibit",
    pattern:
      /\b(?:chumash|indigenous|native peoples|first peoples|'ap|ap house|tule house|acorn|mortar|pestle|sap'?wi)\b/i,
  },
  {
    test: (img) => img.id === "img-buchon-house",
    pattern:
      /\b(?:buchon|714|my (?:house|home|residence)|angel house|where i (?:live|lived)|resided)\b/i,
  },
  {
    test: (img) => /fairbanks/i.test(img.id),
    pattern:
      /\b(?:fairbanks|douglas fairbanks|swashbuckler|zorro|musketeers|picture in the papers)\b/i,
  },
  {
    test: (img) =>
      /griffith|intolerance|triangle-studios|new-york-hat/i.test(img.id) &&
      !/hollywood-blvd|streetcar|hollywoodland/i.test(img.id),
    pattern:
      /\b(?:griffith|d\.?\s*w\.?\s*griffith|intolerance|babylon|triangle|new york hat|pickford|biograph)\b/i,
  },
  {
    test: (img) => /hollywood-blvd|hollywood-streetcar|hollywoodland/i.test(img.id),
    pattern:
      /\b(?:hollywood(?:\s+boulevard)?|hollywoodland|streetcar|pacific electric|colony|what did hollywood)\b/i,
  },
  {
    test: (img) => /emerson|wedding-1919/i.test(img.id),
    pattern: /\b(?:john emerson|emerson|wedding|marriage|husband|mr e)\b/i,
  },
  {
    test: (img) => /blondes/i.test(img.id),
    pattern: /\b(?:gentlemen prefer blondes|lorelei|blondes|harper's)\b/i,
  },
  {
    test: (img) => /gaslamp|william-heath-davis/i.test(img.id),
    pattern:
      /\b(?:william heath davis|davis house|gaslamp|davis's|davis')\b/i,
  },
  {
    test: (img) => /washoe/i.test(img.id),
    pattern: /\b(?:washoe|washo)\b/i,
  },
  {
    test: (img) => /gold-rush|mining/i.test(img.id) && !/danville/i.test(img.id),
    pattern: /\b(?:gold rush|1849|forty-niner|mining|hydraulic)\b/i,
  },
  {
    test: (img) => /fandango|roundup/i.test(img.id) && !/vaquero/i.test(img.id),
    pattern: /\b(?:fandango|fiesta|danc(?:e|ing)|celebration|feast)\b/i,
  },
];

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
    /\b(?:mission (?:san |dolores|santa |de |del )|(?:los\s+)?dolores|san luis obispo de tolosa|(?:the|our|a) mission|missionaries|padres|founded 1772|founded 1776|founded 1786)\b/i.test(
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
  if (/\b(?:morro|avila|beach|coast|ocean|harbor|wharf|marina|waterfront|bay shore)\b/i.test(answerHay)) {
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
    if (term.length < 4 || GENERIC_WEAK_TOPICS.has(term)) continue;
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
    (/\b(?:'ap|ap house|tule house)\b/i.test(storyHay) ||
      (/\bchumash\b/i.test(storyHay) &&
        /\b(?:village|dwelling|willow|tule)\b/i.test(storyHay))) &&
    img.id === "img-chumash-ap-replica"
  ) {
    score += 10;
  }
  if (
    /\b(?:buchon|714|angel house|my house|my home|resided)\b/i.test(storyHay) &&
    img.id === "img-buchon-house"
  ) {
    score += 12;
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

/** True when the answer text actually discusses what the image depicts. */
export function answerSupportsImage(
  img: ImageAsset,
  storyHay: string,
  opts?: { allowPortrait?: boolean }
): boolean {
  if (opts?.allowPortrait && img.topics.includes("portrait")) return true;

  for (const rule of SUBJECT_ANCHOR_RULES) {
    if (rule.test(img)) return rule.pattern.test(storyHay);
  }

  const specifics = img.topics.filter((t) => {
    const term = t.toLowerCase();
    return term.length >= 5 && !GENERIC_WEAK_TOPICS.has(term);
  });
  if (specifics.length === 0) return false;
  return specifics.some((t) => hayContainsTerm(storyHay, t));
}

export function isStrongStoryMatch(
  img: ImageAsset,
  storyHay: string,
  themes: StoryThemeWeights
): boolean {
  if (!isHistoricallyAccurateForStory(img.id, storyHay)) return false;
  if (imageConflictsWithStory(img, themes)) return false;
  if (!answerSupportsImage(img, storyHay)) return false;
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

/**
 * When the visitor asks what a specific place looked like, do not show images for
 * other subjects that merely appear in passing within the answer.
 */
export function imageMatchesQueryIntent(
  userQuery: string,
  img: ImageAsset
): boolean {
  const q = userQuery.toLowerCase();
  const id = img.id.toLowerCase();
  const stack = imageSearchHaystack(img);

  // Residence / "where did you live" must never show indigenous village dwellings.
  const asksResidence =
    /\b(?:where (?:do|did) you live|your (?:house|home|residence)|buchon|714)\b/i.test(
      q
    );
  if (asksResidence) {
    if (themesForImage(img).includes("native")) return false;
    if (/chumash|ap-replica|tomol|choris/i.test(id)) return false;
    if (
      img.id !== "img-buchon-house" &&
      img.id !== "img-horton-house" &&
      img.id !== "img-bancroft-ranch" &&
      img.id !== "img-portrait" &&
      !/\bbuchon|angel house|714|horton house|spring valley|bancroft ranch\b/i.test(
        stack
      )
    ) {
      // Prefer residence-specific photos; block unrelated landmarks.
      if (/mission|railroad|vaquero|fandango|morro|avila|cal-poly|griffith|fairbanks/i.test(id)) {
        return false;
      }
    }
  }

  // Biographical fact questions (mayor, artist, etc.) — not scenic place photos.
  const asksBiographicalFact =
    /\b(?:who was|who were|first\s+(?:mayor|governor|alcalde)|popular\s+artist|which\s+artist|what\s+artist)\b/i.test(
      q
    );
  if (asksBiographicalFact) {
    if (/golden-gate|gate-1900|telegraph-hill|angel-island|bay-view/i.test(id)) {
      return false;
    }
  }

  const asksHollywoodPlace =
    /\bhollywood\b/.test(q) &&
    (/\blook(?:s|ed)? like\b/.test(q) ||
      /\bwhat did (?:\w+\s+){0,3}hollywood\b/.test(q) ||
      /\bwhat was hollywood\b/.test(q));
  if (asksHollywoodPlace) {
    if (/griffith|fairbanks|emerson|blondes|new-york-hat|portrait/i.test(id)) {
      return false;
    }
    if (
      !/hollywood|streetcar|triangle-studios/i.test(id) &&
      !/\bhollywood|streetcar|boulevard|colony\b/.test(stack)
    ) {
      return false;
    }
  }

  const placeLookLike =
    /\blook(?:s|ed)? like\b/.test(q) ||
    /\bwhat did (?:the |this )?(?:\w+\s+){0,4}(?:look|appear)\b/.test(q) ||
    /\bwhat was (?:the |this )?(?:\w+\s+){0,4}like\b/.test(q);

  if (!placeLookLike) return true;

  const asksHarbor = /\b(?:harbor|harbour|wharf|pier|waterfront|marina|dock|port)\b/.test(
    q
  );
  const asksValley =
    /\b(?:valley|countryside|landscape)\b/.test(q) &&
    /\bbefore\b/.test(q);

  if (asksHarbor) {
    if (/mission/i.test(id) && !/\bmission\b/.test(q)) return false;
    if (/courthouse|court-house/i.test(id) && !/\bcourthouse\b/.test(q))
      return false;
    if (/vaquero|fandango|rancho/i.test(id)) return false;
    if (/depot|railroad|train|locomotive/i.test(id)) return false;
    if (
      !/harbor|wharf|port|coast|bay|gate|waterfront|stearns|roadstead/i.test(
        id
      ) &&
      !/\b(?:harbor|harbour|wharf|pier|waterfront|bay|dock|roadstead|stearns)\b/.test(
        stack
      )
    ) {
      return false;
    }
  }

  if (asksValley) {
    if (/vaquero|fandango|rancho-roundup/i.test(id)) return false;
    if (/depot|railroad|train|locomotive/i.test(id)) return false;
    if (/gold-rush|mining/i.test(id)) return false;
  }

  return true;
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
    if (!answerSupportsImage(img, storyHay)) continue;
    const score = imageStoryMatchScore(img, storyHay);
    if (score >= minScore && score > bestScore) {
      best = img;
      bestScore = score;
    }
  }

  return best;
}
