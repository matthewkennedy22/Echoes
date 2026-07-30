/**
 * Wikipedia articles preferred for Jesse D. Mason image topics.
 */

import { MASON_IMAGE_TOPICS } from "./imageTopicCatalog";

export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["Mission Santa Barbara", "Santa Barbara, California"],
  "mission-founding": ["Mission Santa Barbara", "Fermín de Lasuén"],
  "mission-facade": ["Mission Santa Barbara"],
  franciscans: ["Mission Santa Barbara", "Franciscans"],
  "chumash-verified": ["Chumash", "Chumash Painted Cave State Historic Park"],
  "chumash-rock-art": ["Chumash Painted Cave State Historic Park", "Chumash"],
  "chumash-tomol": ["Tomol", "Chumash"],
  "chumash-mission-era": ["Chumash", "Mission San Buenaventura"],
  "rancho-cattle": ["Ranchos of California", "Vaquero", "Californio"],
  "rancho-fiesta": ["Californio"],
  "american-period": ["Santa Barbara, California", "California"],
  ventura: ["Ventura County, California", "Mission San Buenaventura"],
};

export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  chumash: ["Chumash", "Chumash Painted Cave State Historic Park"],
  mission: ["Mission Santa Barbara"],
  "santa barbara": ["Santa Barbara, California", "Mission Santa Barbara"],
  ventura: ["Ventura County, California"],
  rancho: ["Ranchos of California"],
  vaquero: ["Vaquero"],
  tomol: ["Tomol"],
  pictograph: ["Chumash Painted Cave State Historic Park"],
  presidio: ["Presidio of Santa Barbara"],
  franciscan: ["Mission Santa Barbara"],
};

export function wikipediaArticlesForTopicKey(key: string): string[] {
  return WIKIPEDIA_BY_TOPIC_KEY[key] ?? [];
}

export function catalogKeysMissingWikipedia(): string[] {
  return MASON_IMAGE_TOPICS.map((t) => t.key).filter(
    (key) => !WIKIPEDIA_BY_TOPIC_KEY[key]?.length
  );
}
