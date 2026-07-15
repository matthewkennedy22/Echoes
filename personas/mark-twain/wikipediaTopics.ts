/**
 * Wikipedia articles preferred for Mark Twain image topics.
 */

import { TWAIN_IMAGE_TOPICS } from "./imageTopicCatalog";

export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["Mark Twain"],
  "tahoe-view": ["Lake Tahoe"],
  "tahoe-shore-timber": ["Lake Tahoe", "Roughing It"],
  "tahoe-settlement": ["Tahoe City, California", "Lake Tahoe"],
  "emerald-bay": ["Emerald Bay State Park", "Lake Tahoe"],
  "steamer-tourism": ["Lake Tahoe", "SS Tahoe"],
  washoe: ["Washoe people", "Lake Tahoe"],
  "roughing-it": ["Roughing It", "Mark Twain"],
  wildfire: ["Roughing It", "Lake Tahoe"],
};

export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  tahoe: ["Lake Tahoe"],
  "lake tahoe": ["Lake Tahoe"],
  "mark twain": ["Mark Twain"],
  clemens: ["Mark Twain"],
  "roughing it": ["Roughing It"],
  washoe: ["Washoe people"],
  "emerald bay": ["Emerald Bay State Park"],
  "carson city": ["Carson City, Nevada"],
  comstock: ["Comstock Lode"],
  orion: ["Orion Clemens"],
  timber: ["Lake Tahoe", "Roughing It"],
  steamer: ["SS Tahoe", "Lake Tahoe"],
};

export function wikipediaArticlesForTopicKey(key: string): string[] {
  return WIKIPEDIA_BY_TOPIC_KEY[key] ?? [];
}

export function catalogKeysMissingWikipedia(): string[] {
  return TWAIN_IMAGE_TOPICS.map((t) => t.key).filter(
    (key) => !WIKIPEDIA_BY_TOPIC_KEY[key]?.length
  );
}
