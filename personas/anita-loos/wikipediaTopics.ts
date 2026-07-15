/**
 * Wikipedia articles preferred for Anita Loos image topics.
 */

import { LOOS_IMAGE_TOPICS } from "./imageTopicCatalog";

export const WIKIPEDIA_BY_TOPIC_KEY: Record<string, string[]> = {
  identity: ["Anita Loos"],
  "emerson-partnership": ["Anita Loos", "John Emerson (filmmaker)"],
  "griffith-triangle": [
    "D. W. Griffith",
    "Triangle Film Corporation",
    "Anita Loos",
  ],
  intolerance: ["Intolerance (film)", "D. W. Griffith", "Intolerance Babylon set"],
  fairbanks: ["Douglas Fairbanks", "Anita Loos"],
  "hollywood-place": ["Hollywood, Los Angeles", "Hollywood Boulevard"],
  studios: ["Triangle Film Corporation", "Culver City, California"],
  "new-york-hat": ["The New York Hat", "Mary Pickford", "Anita Loos"],
  "blondes-novel": ["Gentlemen Prefer Blondes (novel)", "Anita Loos"],
  "hollywoodland-sign": ["Hollywood Sign", "Hollywood, Los Angeles"],
};

export const WIKIPEDIA_KEYWORD_ARTICLES: Record<string, string[]> = {
  "anita loos": ["Anita Loos"],
  hollywood: ["Hollywood, Los Angeles", "Hollywood Boulevard"],
  griffith: ["D. W. Griffith", "Intolerance (film)"],
  fairbanks: ["Douglas Fairbanks"],
  intolerance: ["Intolerance (film)", "Intolerance Babylon set"],
  blondes: ["Gentlemen Prefer Blondes (novel)"],
  lorelei: ["Gentlemen Prefer Blondes (novel)"],
  triangle: ["Triangle Film Corporation"],
  pickford: ["Mary Pickford", "The New York Hat"],
  emerson: ["John Emerson (filmmaker)", "Anita Loos"],
  "los angeles": ["Los Angeles", "Hollywood, Los Angeles"],
  silent: ["Silent film", "Anita Loos"],
  photoplay: ["Screenplay", "Anita Loos"],
};

export function wikipediaArticlesForTopicKey(key: string): string[] {
  return WIKIPEDIA_BY_TOPIC_KEY[key] ?? [];
}

export function catalogKeysMissingWikipedia(): string[] {
  return LOOS_IMAGE_TOPICS.map((t) => t.key).filter(
    (key) => !WIKIPEDIA_BY_TOPIC_KEY[key]?.length
  );
}
