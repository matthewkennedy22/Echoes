/**
 * Wikipedia articles preferred for August Hemme image topics.
 */

import { HEMME_IMAGE_TOPICS } from "./imageTopicCatalog";

export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["Danville station (California)", "Danville, California"],
  "danville-depot": ["Danville station (California)", "Danville, California"],
  "branch-line": [
    "Danville station (California)",
    "Southern Pacific Transportation Company",
    "San Ramon, California",
  ],
  "hemme-station": ["Alamo, California", "Danville, California"],
  "iron-horse-modern": ["Iron Horse Regional Trail"],
  "agriculture-ranch": ["San Ramon Valley", "Contra Costa County, California"],
  "gold-rush": ["California Gold Rush"],
  "railroad-labor": [
    "First Transcontinental Railroad",
    "Central Pacific Railroad",
  ],
};

export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  danville: ["Danville, California", "Danville station (California)"],
  alamo: ["Alamo, California"],
  "san ramon": ["San Ramon, California"],
  "iron horse": ["Iron Horse Regional Trail"],
  railroad: ["Southern Pacific Transportation Company"],
  "southern pacific": ["Southern Pacific Transportation Company"],
  depot: ["Danville station (California)"],
  "gold rush": ["California Gold Rush"],
  "contra costa": ["Contra Costa County, California"],
  hemme: ["Danville, California", "Alamo, California"],
};

export function wikipediaArticlesForTopicKey(key: string): string[] {
  return WIKIPEDIA_BY_TOPIC_KEY[key] ?? [];
}

export function catalogKeysMissingWikipedia(): string[] {
  return HEMME_IMAGE_TOPICS.map((t) => t.key).filter(
    (key) => !WIKIPEDIA_BY_TOPIC_KEY[key]?.length
  );
}
