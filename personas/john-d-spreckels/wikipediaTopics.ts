/**
 * Wikipedia articles whose gallery images we prefer for Spreckels image topics.
 * (Images only — never use Wikipedia as RAG grounding.)
 */

import { SPRECKELS_IMAGE_TOPICS } from "./imageTopicCatalog";

export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["John D. Spreckels", "Coronado, California"],
  "hotel-del": ["Hotel del Coronado", "Coronado, California"],
  "tent-city": ["Hotel del Coronado", "Coronado, California"],
  mansion: ["John D. Spreckels", "Coronado, California"],
  "ferry-transit": ["San Diego Electric Railway", "Coronado, California"],
};

export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  spreckels: ["John D. Spreckels"],
  coronado: ["Coronado, California", "Hotel del Coronado"],
  "hotel del": ["Hotel del Coronado"],
  "tent city": ["Hotel del Coronado", "Coronado, California"],
  ferry: ["Coronado, California"],
  "north island": ["Naval Air Station North Island", "Coronado, California"],
  "glorietta": ["John D. Spreckels", "Coronado, California"],
  "electric railway": ["San Diego Electric Railway"],
  "san diego": ["San Diego", "History of San Diego"],
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

export function catalogKeysMissingWikipedia(): string[] {
  return SPRECKELS_IMAGE_TOPICS.map((t) => t.key).filter(
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

  if (/\bspreckels\b/i.test(hay)) articles.add("John D. Spreckels");
  if (/\bcoronado\b/i.test(hay)) articles.add("Coronado, California");
  if (/\bhotel del\b|\bthe del\b/i.test(hay)) articles.add("Hotel del Coronado");

  return [...articles];
}
