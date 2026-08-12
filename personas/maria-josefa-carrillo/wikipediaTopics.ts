import { MARIA_JOSEFA_CARRILLO_IMAGE_TOPICS } from "./imageTopicCatalog";

export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["Dana Adobe", "Rancho Nipomo"],
  adobe: ["Dana Adobe", "Rancho Nipomo"],
  hospitality: ["El Camino Real (California)", "Dana Adobe"],
  "santa-barbara": [
    "Mission Santa Barbara",
    "Presidio of Santa Barbara",
    "Carlos Antonio Carrillo",
  ],
  "mission-slo": ["Mission San Luis Obispo de Tolosa"],
  "rancho-cattle": ["Ranchos of California", "Californio"],
  chumash: ["Chumash", "La Purísima Mission"],
};

export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  nipomo: ["Nipomo, California", "Dana Adobe"],
  adobe: ["Dana Adobe"],
  carrillo: ["Carlos Antonio Carrillo"],
  "santa barbara": ["Mission Santa Barbara", "Santa Barbara, California"],
  chumash: ["Chumash"],
  "el camino": ["El Camino Real (California)"],
  rancho: ["Ranchos of California"],
};

export function wikipediaArticlesForTopicKey(key: string): string[] {
  return WIKIPEDIA_BY_TOPIC_KEY[key] ?? [];
}

export function catalogKeysMissingWikipedia(): string[] {
  return MARIA_JOSEFA_CARRILLO_IMAGE_TOPICS.map((t) => t.key).filter(
    (key) => !WIKIPEDIA_BY_TOPIC_KEY[key]?.length
  );
}
