/**
 * Topic → buzzword → image map for Myron Angel.
 *
 * Buzzwords are matched against Myron's *answer text* (whole words/phrases).
 * imageIds are priority order — first id is the best default for that topic.
 *
 * ACCURACY: Chumash-specific topics use ONLY verified Chumash images.
 * Louis Choris (1822) engravings are in "choris-bay-area" — Ohlone/Cholovones, NOT Chumash.
 */

export interface MyronImageTopic {
  key: string;
  label: string;
  buzzwords: string[];
  imageIds: string[];
}

export const MYRON_IMAGE_TOPICS: MyronImageTopic[] = [
  {
    key: "identity",
    label: "Myron Angel — who he is",
    buzzwords: [
      "myron angel",
      "who are you",
      "introduce yourself",
      "journalist",
      "historian",
      "buchon street",
      "portrait",
      "likeness",
      "biography",
      "myself",
      "i am",
    ],
    imageIds: ["img-portrait"],
  },
  {
    key: "chumash-verified",
    label: "Chumash people (verified images only)",
    buzzwords: [
      "chumash",
      "indigenous",
      "native peoples",
      "first peoples",
      "ancestors",
      "acorn",
      "village",
      "basket",
      "baskets",
      "weaving",
      "weave",
      "crafts",
      "gentile",
    ],
    imageIds: [
      "img-chumash-painted-cave",
      "img-chumash-pictograph-oakbrook",
      "img-chumash-musicians-1873",
      "img-chumash-mortars-exhibit",
      "img-chumash-ap-replica",
    ],
  },
  {
    key: "chumash-rock-art",
    label: "Chumash rock art & spiritual heritage",
    buzzwords: [
      "pictograph",
      "pictographs",
      "rock art",
      "cave painting",
      "painted cave",
      "petroglyph",
      "spiritual tradition",
      "cosmology",
      "ancient",
      "symbols",
      "swordfish",
      "shaman",
    ],
    imageIds: ["img-chumash-painted-cave", "img-chumash-pictograph-oakbrook"],
  },
  {
    key: "chumash-acorn-village",
    label: "Chumash daily life — acorn grinding & village dwellings",
    buzzwords: [
      "acorn",
      "acorns",
      "grinding",
      "mortar",
      "mortars",
      "pestle",
      "meal",
      "village",
      "dwelling",
      "ap",
      "house",
      "home",
      "tule",
      "willow",
      "basket rush",
      "ethnobotany",
    ],
    imageIds: ["img-chumash-mortars-exhibit", "img-chumash-ap-replica"],
  },
  {
    key: "chumash-mission-era",
    label: "Chumash in the mission period (post-contact)",
    buzzwords: [
      "mission san buenaventura",
      "musicians",
      "instruments",
      "neophyte",
      "converted",
      "mission period",
      "1873",
      "after contact",
    ],
    imageIds: ["img-chumash-musicians-1873"],
  },
  {
    key: "chumash-tomol",
    label: "Chumash tomols (plank canoe — illustration & modern photos)",
    buzzwords: [
      "tomol",
      "tomols",
      "plank canoe",
      "plank-built",
      "channel islands",
      "limuw",
      "crossing the channel",
      "elye'wun",
      "house of the sea",
    ],
    imageIds: [
      "img-chumash-tomol-kihn",
      "img-chumash-tomol-elyewun-2006",
      "img-chumash-tomol-crossing-2015",
    ],
  },
  {
    key: "choris-bay-area",
    label: "Bay Area indigenous / tule boats (Choris 1822 — NOT Chumash)",
    buzzwords: [
      "tule",
      "rush boat",
      "california indians",
      "indigenous life",
      "before the mission",
      "pre-contact",
      "native peoples",
    ],
    imageIds: [
      "img-choris-tule-canoe-1822",
      "img-choris-cholovones-hunting-1822",
      "img-choris-california-people-1822",
    ],
  },
  {
    key: "mission-founding",
    label: "Mission founding & Angel's 1883 history",
    buzzwords: [
      "founded 1772",
      "1772",
      "founding of the mission",
      "franciscan",
      "padres",
      "father",
      "my history",
      "1883 history",
      "history of san luis obispo county",
      "engraving from my book",
    ],
    imageIds: [
      "img-mission-1883",
      "img-mission-front-1880",
      "img-mission-exterior",
    ],
  },
  {
    key: "mission-facade",
    label: "Mission San Luis Obispo — facade, entrance, street view",
    buzzwords: [
      "mission san luis",
      "san luis obispo de tolosa",
      "mission church",
      "facade",
      "entrance",
      "bell tower",
      "stairs",
      "main front",
      "south view",
      "mass",
      "worshippers",
    ],
    imageIds: [
      "img-mission-front-1880",
      "img-mission-view-south-1904",
      "img-mission-exterior",
      "img-mission-1900",
      "img-mission-south-1888",
    ],
  },
  {
    key: "mission-arcade",
    label: "Mission arcade, portico, courtyard",
    buzzwords: [
      "arcade",
      "portico",
      "corridor",
      "columns",
      "colonnade",
      "courtyard",
      "adobe walls",
      "el portico",
    ],
    imageIds: ["img-mission-arcade-1870", "img-mission-south-1888"],
  },
  {
    key: "rancho-fiesta",
    label: "Rancho fiesta, dancing, californio social life",
    buzzwords: [
      "fandango",
      "fiesta",
      "dancing",
      "dance",
      "celebration",
      "feast",
      "party",
      "californio",
      "californios",
      "mexican era social",
    ],
    imageIds: ["img-rancho-fandango-1873"],
  },
  {
    key: "rancho-cattle",
    label: "Vaqueros, cattle, round-ups, ranching work",
    buzzwords: [
      "vaquero",
      "vaqueros",
      "cattle",
      "round-up",
      "roundup",
      "rodeo",
      "herd",
      "herds",
      "livestock",
      "horsemen",
      "ranching work",
      "ranchero",
    ],
    imageIds: ["img-rancho-roundup", "img-vaqueros-1854"],
  },
  {
    key: "rancho-adobe",
    label: "Adobe ranchos & Mexican-era architecture",
    buzzwords: [
      "adobe",
      "rancho",
      "land grant",
      "mexican era",
      "spanish era",
      "ranch house",
      "ruins",
      "hacienda",
    ],
    imageIds: ["img-adobe-rancho-1900", "img-mission-arcade-1870"],
  },
  {
    key: "downtown",
    label: "Downtown streets & commerce",
    buzzwords: [
      "downtown",
      "main street",
      "higuera",
      "monterey street",
      "storefront",
      "storefronts",
      "shops",
      "commercial street",
      "carriages",
      "old town",
      "business district",
    ],
    imageIds: [
      "img-slo-street-1905",
      "img-monterey-street-1900",
      "img-slo-deakin-1899",
      "img-courthouse-1900",
    ],
  },
  {
    key: "town-panorama",
    label: "Town & valley views",
    buzzwords: [
      "panorama",
      "view of the town",
      "town spread",
      "valley view",
      "looking north",
      "beneath the peaks",
      "morros",
      "what did the town look",
      "arrived in 1883",
    ],
    imageIds: [
      "img-slo-view-1900",
      "img-slo-late-1800s",
      "img-slo-deakin-1899",
      "img-railroad-slo-1906",
    ],
  },
  {
    key: "government",
    label: "County government & courthouse",
    buzzwords: [
      "courthouse",
      "court house",
      "county government",
      "hall of records",
      "county seat",
      "government",
      "osos street",
    ],
    imageIds: ["img-courthouse-1900"],
  },
  {
    key: "railroad",
    label: "Southern Pacific & railroad transformation",
    buzzwords: [
      "railroad",
      "southern pacific",
      "train",
      "trains",
      "depot",
      "station",
      "tracks",
      "cuesta grade",
      "tunnel",
      "transcontinental",
      "changed san luis obispo",
    ],
    imageIds: ["img-railroad-slo-1906", "img-port-harford-1905"],
  },
  {
    key: "chinese-community",
    label: "Ah Louis & Chinese pioneers in SLO",
    buzzwords: [
      "ah louis",
      "chinese",
      "chinese-american",
      "chinese community",
      "chinese pioneer",
      "palm street",
      "chinese store",
      "chinese-owned",
    ],
    imageIds: ["img-ah-louis-store", "img-chinese-railroad-laborers"],
  },
  {
    key: "chinese-railroad",
    label: "Chinese laborers building railroads",
    buzzwords: [
      "chinese labor",
      "chinese laborers",
      "chinese workers",
      "built the railroad",
      "railroad workers",
      "cuesta grade tunnels",
      "central pacific",
    ],
    imageIds: ["img-chinese-railroad-laborers", "img-railroad-slo-1906"],
  },
  {
    key: "gold-rush",
    label: "California Gold Rush (Myron's early years)",
    buzzwords: [
      "gold rush",
      "forty-niner",
      "49er",
      "mining",
      "miners",
      "hydraulic mining",
      "1849",
      "1850",
    ],
    imageIds: ["img-gold-rush-mining-1883"],
  },
  {
    key: "coast-morro",
    label: "Morro Bay & Morro Rock",
    buzzwords: [
      "morro rock",
      "morro bay",
      "seven sisters",
      "volcanic peak",
      "sailboats",
    ],
    imageIds: ["img-morro-rock-1900"],
  },
  {
    key: "coast-avila",
    label: "Avila Beach & Port San Luis",
    buzzwords: [
      "avila",
      "avila beach",
      "port harford",
      "port san luis",
      "wharf",
      "pier",
      "steamship",
      "shipping",
      "harbor",
    ],
    imageIds: ["img-port-harford-1905", "img-avila-beach-1905"],
  },
  {
    key: "cal-poly",
    label: "Cal Poly / Polytechnic School",
    buzzwords: [
      "cal poly",
      "polytechnic",
      "california polytechnic",
      "vocational school",
      "learn by doing",
      "campus",
      "college",
      "students",
      "1903",
    ],
    imageIds: ["img-cal-poly-1900"],
  },
  {
    key: "nature-creek",
    label: "Creek, trees & countryside",
    buzzwords: [
      "creek",
      "san luis obispo creek",
      "stream",
      "grove",
      "trees",
      "forest",
      "wilderness",
      "countryside",
    ],
    imageIds: ["img-slo-creek-1905"],
  },
];

export function buzzwordsByImageId(): Map<string, string[]> {
  const map = new Map<string, Set<string>>();
  for (const topic of MYRON_IMAGE_TOPICS) {
    for (const id of topic.imageIds) {
      if (!map.has(id)) map.set(id, new Set());
      for (const w of topic.buzzwords) map.get(id)!.add(w.toLowerCase());
    }
  }
  const out = new Map<string, string[]>();
  for (const [id, set] of map) out.set(id, [...set]);
  return out;
}

export function formatTopicCatalogForPrompt(): string {
  return MYRON_IMAGE_TOPICS.map((t) => {
    const ids =
      t.imageIds.length > 0
        ? t.imageIds.slice(0, 3).join(", ") + (t.imageIds.length > 3 ? ", …" : "")
        : "(none — use empty image_ids)";
    return `• ${t.label} (${t.key}): ${ids}\n  Buzzwords: ${t.buzzwords.slice(0, 12).join(", ")}${t.buzzwords.length > 12 ? ", …" : ""}`;
  }).join("\n");
}

export function catalogScoreForImage(
  imageId: string,
  storyHay: string,
  hayContains: (hay: string, term: string) => boolean
): number {
  let score = 0;
  for (const topic of MYRON_IMAGE_TOPICS) {
    const rank = topic.imageIds.indexOf(imageId);
    if (rank < 0) continue;

    let hits = 0;
    for (const word of topic.buzzwords) {
      if (hayContains(storyHay, word)) hits++;
    }
    if (hits === 0) continue;

    const priority = topic.imageIds.length - rank;
    score += hits * (2 + priority);
    if (hits >= 2) score += 4;
    if (rank === 0) score += 2;
  }
  return score;
}

export function detectCatalogTopics(
  storyHay: string,
  hayContains: (hay: string, term: string) => boolean
): { key: string; hits: number }[] {
  const found: { key: string; hits: number }[] = [];
  for (const topic of MYRON_IMAGE_TOPICS) {
    let hits = 0;
    for (const word of topic.buzzwords) {
      if (hayContains(storyHay, word)) hits++;
    }
    if (hits > 0) found.push({ key: topic.key, hits });
  }
  return found.sort((a, b) => b.hits - a.hits);
}
