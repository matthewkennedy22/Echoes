import { WILLIAM_G_DANA_IMAGE_TOPICS } from "./imageTopicCatalog";

export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["Dana Adobe", "Rancho Nipomo"],
  adobe: ["Dana Adobe", "Rancho Nipomo"],
  "grant-map": ["Rancho Nipomo", "Dana Adobe"],
  hospitality: ["El Camino Real (California)", "Dana Adobe"],
  "santa-barbara": ["Mission Santa Barbara", "Presidio of Santa Barbara"],
  "mission-slo": ["Mission San Luis Obispo de Tolosa"],
  "rancho-cattle": ["Ranchos of California", "Vaquero", "Californio"],
  chumash: ["Chumash", "La Purísima Mission"],
  tomol: ["Chumash"],
};

export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  nipomo: ["Nipomo, California", "Rancho Nipomo", "Dana Adobe"],
  adobe: ["Dana Adobe"],
  chumash: ["Chumash", "La Purísima Mission"],
  "santa barbara": ["Mission Santa Barbara", "Santa Barbara, California"],
  "san luis obispo": ["Mission San Luis Obispo de Tolosa"],
  "el camino": ["El Camino Real (California)"],
  rancho: ["Ranchos of California"],
  carrillo: ["Carlos Antonio Carrillo"],
  fremont: ["John C. Frémont"],
  bryant: ["Edwin Bryant"],
};

export function wikipediaArticlesForTopicKey(key: string): string[] {
  return WIKIPEDIA_BY_TOPIC_KEY[key] ?? [];
}

export function catalogKeysMissingWikipedia(): string[] {
  return WILLIAM_G_DANA_IMAGE_TOPICS.map((t) => t.key).filter(
    (key) => !WIKIPEDIA_BY_TOPIC_KEY[key]?.length
  );
}
