/**
 * Wikipedia articles preferred for John Muir image topics.
 */

import { MUIR_IMAGE_TOPICS } from "./imageTopicCatalog";

export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["John Muir"],
  "yosemite-valley": ["Yosemite Valley", "Yosemite National Park"],
  waterfalls: ["Yosemite Falls", "Bridalveil Fall"],
  landmarks: ["El Capitan", "Half Dome"],
  "sequoia-forest": ["Mariposa Grove", "Sequoiadendron giganteum"],
  "roosevelt-1903": ["John Muir", "Theodore Roosevelt"],
  "hetch-hetchy": ["Hetch Hetchy", "Yosemite National Park"],
  "sierra-travel": ["Yosemite National Park", "My First Summer in the Sierra"],
  glaciers: ["Sierra Nevada", "Yosemite Valley", "John Muir"],
};

export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  muir: ["John Muir"],
  "john muir": ["John Muir"],
  yosemite: ["Yosemite National Park", "Yosemite Valley"],
  "yosemite valley": ["Yosemite Valley"],
  sierra: ["Sierra Nevada"],
  "sierra nevada": ["Sierra Nevada"],
  "hetch hetchy": ["Hetch Hetchy"],
  sequoia: ["Sequoiadendron giganteum", "Mariposa Grove"],
  "mariposa grove": ["Mariposa Grove"],
  glacier: ["Sierra Nevada", "Yosemite Valley"],
  whitney: ["Josiah Whitney", "John Muir"],
  roosevelt: ["Theodore Roosevelt", "John Muir"],
  "sierra club": ["Sierra Club"],
  "first summer": ["My First Summer in the Sierra"],
  "mountains of california": ["The Mountains of California"],
  "our national parks": ["John Muir", "Yosemite National Park"],
  "the yosemite": ["Yosemite National Park", "John Muir"],
  "el capitan": ["El Capitan"],
  "half dome": ["Half Dome"],
  bridalveil: ["Bridalveil Fall"],
  miwok: ["Ahwahnechee", "Southern Sierra Miwok"],
  ahwahneechee: ["Ahwahnechee"],
};

export function wikipediaArticlesForTopicKey(key: string): string[] {
  return WIKIPEDIA_BY_TOPIC_KEY[key] ?? [];
}

export function catalogKeysMissingWikipedia(): string[] {
  return MUIR_IMAGE_TOPICS.map((t) => t.key).filter(
    (key) => !WIKIPEDIA_BY_TOPIC_KEY[key]?.length
  );
}
