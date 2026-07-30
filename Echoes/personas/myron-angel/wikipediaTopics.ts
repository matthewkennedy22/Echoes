/**
 * Wikipedia articles whose gallery images we prefer for each Myron image topic.
 * Used by live image search and documented in verify-images.
 *
 * @see https://en.wikipedia.org/wiki/Chumash_Indian_Museum (Chumash culture)
 * @see https://en.wikipedia.org/wiki/Mission_San_Luis_Obispo_de_Tolosa
 * @see https://en.wikipedia.org/wiki/San_Luis_Obispo,_California
 */

import { MYRON_IMAGE_TOPICS } from "./imageTopicCatalog";

/** Catalog topic key → Wikipedia article titles (enwiki). */
export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["Myron Angel"],
  "chumash-verified": ["Chumash", "Chumash Indian Museum", "Tomol"],
  "chumash-rock-art": [
    "Chumash Indian Museum",
    "Chumash Painted Cave State Historic Park",
  ],
  "chumash-acorn-village": ["Chumash Indian Museum", "Chumash"],
  "chumash-mission-era": ["Chumash", "Mission San Buenaventura"],
  "chumash-tomol": ["Tomol", "Chumash Indian Museum"],
  "choris-bay-area": ["Ohlone", "Indigenous peoples of California"],
  "mission-founding": [
    "Mission San Luis Obispo de Tolosa",
    "Junípero Serra",
  ],
  "mission-facade": ["Mission San Luis Obispo de Tolosa"],
  "mission-arcade": ["Mission San Luis Obispo de Tolosa"],
  "rancho-fiesta": ["Californio"],
  "rancho-cattle": ["Vaquero", "Ranchos of California"],
  "rancho-adobe": ["Ranchos of California", "Adobe"],
  downtown: ["San Luis Obispo, California"],
  "town-panorama": ["San Luis Obispo, California", "San Luis Obispo County, California"],
  government: [
    "San Luis Obispo County, California",
    "San Luis Obispo, California",
  ],
  railroad: [
    "Central Pacific Railroad",
    "First Transcontinental Railroad",
    "San Luis Obispo, California",
  ],
  "chinese-community": ["Ah Louis Store", "San Luis Obispo, California"],
  "chinese-railroad": [
    "First Transcontinental Railroad",
    "Central Pacific Railroad",
  ],
  "gold-rush": ["California Gold Rush"],
  "coast-morro": ["Morro Rock", "Morro Bay, California"],
  "coast-avila": ["Avila Beach, California", "Port San Luis"],
  "cal-poly": ["California Polytechnic State University"],
  "nature-creek": ["San Luis Obispo, California"],
};

/** Extra keyword → articles (matched against visitor query + story text). */
export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  tomol: ["Tomol"],
  chumash: ["Chumash", "Chumash Indian Museum"],
  mission: ["Mission San Luis Obispo de Tolosa"],
  "san luis obispo": [
    "San Luis Obispo, California",
    "Mission San Luis Obispo de Tolosa",
  ],
  morro: ["Morro Rock", "Morro Bay, California"],
  avila: ["Avila Beach, California", "Port San Luis"],
  "port harford": ["Port San Luis", "Avila Beach, California"],
  "ah louis": ["Ah Louis Store"],
  vaquero: ["Vaquero"],
  fandango: ["Californio"],
  "gold rush": ["California Gold Rush"],
  railroad: ["Central Pacific Railroad", "First Transcontinental Railroad"],
  "cal poly": ["California Polytechnic State University"],
  polytechnic: ["California Polytechnic State University"],
  courthouse: ["San Luis Obispo County, California"],
  adobe: ["Ranchos of California"],
  acorn: ["Chumash Indian Museum"],
  pictograph: ["Chumash Indian Museum"],
  basket: ["Chumash Indian Museum"],
};

export function wikipediaArticlesForTopicKey(key: string): string[] {
  return WIKIPEDIA_BY_TOPIC_KEY[key] ?? [];
}

export function wikipediaArticlesForTopicKeys(keys: string[]): string[] {
  const out = new Set<string>();
  for (const key of keys) {
    for (const title of wikipediaArticlesForTopicKey(key)) out.add(title);
  }
  return [...out];
}

/** Ensure every catalog topic has Wikipedia article coverage. */
export function catalogKeysMissingWikipedia(): string[] {
  return MYRON_IMAGE_TOPICS.map((t) => t.key).filter(
    (key) => !WIKIPEDIA_BY_TOPIC_KEY[key]?.length
  );
}

export function resolveWikipediaArticlesFromHaystack(hay: string): string[] {
  const lower = hay.toLowerCase();
  const articles = new Set<string>();

  for (const [keyword, titles] of Object.entries(WIKIPEDIA_KEYWORD_ARTICLES)) {
    if (lower.includes(keyword)) {
      for (const t of titles) articles.add(t);
    }
  }

  if (/\btomol/i.test(hay)) articles.add("Tomol");
  if (/\bchumash\b/i.test(hay)) {
    articles.add("Chumash");
    articles.add("Chumash Indian Museum");
  }
  if (/\bmission\b/i.test(hay) && !/\bbuenaventura\b/i.test(hay)) {
    articles.add("Mission San Luis Obispo de Tolosa");
  }

  return [...articles];
}
