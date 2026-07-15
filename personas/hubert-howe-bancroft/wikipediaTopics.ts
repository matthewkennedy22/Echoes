/**
 * Wikipedia articles whose gallery images we prefer for each Bancroft image topic.
 */

import { BANCROFT_IMAGE_TOPICS } from "./imageTopicCatalog";

/** Catalog topic key → Wikipedia article titles (enwiki). */
export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["Hubert Howe Bancroft", "Bancroft Library"],
  "mission-dolores": ["Mission San Francisco de Asís"],
  "san-francisco-city": [
    "San Francisco",
    "History of San Francisco",
    "California Gold Rush",
  ],
  "golden-gate": ["Golden Gate", "San Francisco Bay", "Angel Island (California)"],
  "bancroft-ranch": [
    "Hubert H. Bancroft Ranch House",
    "Spring Valley, San Diego County, California",
  ],
};

/** Extra keyword → articles (matched against visitor query + story text). */
export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  bancroft: ["Hubert Howe Bancroft", "Bancroft Library"],
  "san francisco": ["San Francisco", "History of San Francisco"],
  "mission dolores": ["Mission San Francisco de Asís"],
  "golden gate": ["Golden Gate", "San Francisco Bay"],
  "gold rush": ["California Gold Rush"],
  library: ["Bancroft Library"],
  vallejo: ["Mariano Guadalupe Vallejo"],
  "native races": ["Hubert Howe Bancroft"],
  "spring valley": ["Hubert H. Bancroft Ranch House"],
  california: ["History of California", "Hubert Howe Bancroft"],
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
  return BANCROFT_IMAGE_TOPICS.map((t) => t.key).filter(
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

  if (/\bbancroft\b/i.test(hay)) {
    articles.add("Hubert Howe Bancroft");
    articles.add("Bancroft Library");
  }
  if (/\bmission dolores\b/i.test(hay)) {
    articles.add("Mission San Francisco de Asís");
  }
  if (/\bgolden gate\b/i.test(hay)) {
    articles.add("Golden Gate");
  }

  return [...articles];
}
