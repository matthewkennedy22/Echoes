/**
 * Wikipedia articles whose gallery images we prefer for each Horton image topic.
 */

import { HORTON_IMAGE_TOPICS } from "./imageTopicCatalog";

/** Catalog topic key → Wikipedia article titles (enwiki). */
export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["Alonzo Horton", "San Diego"],
  "horton-house": ["Alonzo Horton", "Gaslamp Quarter, San Diego"],
  "horton-plaza": ["Horton Plaza Park", "Alonzo Horton"],
  "new-town-government": ["San Diego", "Downtown San Diego"],
  "davis-new-town": ["William Heath Davis", "Gaslamp Quarter, San Diego"],
};

/** Extra keyword → articles (matched against visitor query + story text). */
export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  horton: ["Alonzo Horton", "Horton Plaza Park"],
  "san diego": ["San Diego", "History of San Diego"],
  "new town": ["Alonzo Horton", "Downtown San Diego"],
  "old town": ["Old Town San Diego State Historic Park"],
  "horton plaza": ["Horton Plaza Park"],
  "horton house": ["Alonzo Horton"],
  "balboa park": ["Balboa Park (San Diego)"],
  "city park": ["Balboa Park (San Diego)"],
  "william heath davis": ["William Heath Davis"],
  railroad: ["California Southern Railroad", "San Diego"],
  "hortonville": ["Hortonville, Wisconsin"],
  bay: ["San Diego Bay"],
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
  return HORTON_IMAGE_TOPICS.map((t) => t.key).filter(
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

  if (/\bhorton\b/i.test(hay)) {
    articles.add("Alonzo Horton");
    articles.add("Horton Plaza Park");
  }
  if (/\bsan diego\b/i.test(hay)) {
    articles.add("San Diego");
  }
  if (/\bbalboa park\b|\bcity park\b/i.test(hay)) {
    articles.add("Balboa Park (San Diego)");
  }

  return [...articles];
}
