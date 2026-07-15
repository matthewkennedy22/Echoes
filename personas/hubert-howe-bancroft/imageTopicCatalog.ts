/**
 * Topic → buzzword → image map for Hubert Howe Bancroft.
 */

import type { ImageTopic } from "@/personas/types";

export const BANCROFT_IMAGE_TOPICS: ImageTopic[] = [
  {
    key: "identity",
    label: "Hubert Howe Bancroft — who he is",
    buzzwords: [
      "hubert howe bancroft",
      "bancroft",
      "who are you",
      "introduce yourself",
      "historian",
      "publisher",
      "collector",
      "portrait",
      "likeness",
      "biography",
      "myself",
      "i am",
    ],
    imageIds: ["img-portrait"],
  },
  {
    key: "mission-dolores",
    label: "Mission Dolores / Mission San Francisco de Asís",
    buzzwords: [
      "mission dolores",
      "mission san francisco",
      "los dolores",
      "mission church",
      "spanish mission",
      "1776",
      "adobe mission",
    ],
    imageIds: ["img-mission-dolores-1856", "img-mission-dolores"],
  },
  {
    key: "san-francisco-city",
    label: "San Francisco metropolis & maps",
    buzzwords: [
      "san francisco",
      "metropolis",
      "city",
      "market street",
      "montgomery street",
      "pacific coast",
      "1890",
      "map of the city",
    ],
    imageIds: ["img-sf-1890"],
  },
  {
    key: "golden-gate",
    label: "Golden Gate strait & Bay views (pre-bridge)",
    buzzwords: [
      "golden gate",
      "angel island",
      "san francisco bay",
      "harbor",
      "ferry",
      "strait",
      "telegraph hill",
      "mount tamalpais",
      "bay view",
      "marina",
      "waterfront",
      "presidio",
    ],
    imageIds: ["img-golden-gate-1900", "img-golden-gate-telegraph-hill"],
  },
  {
    key: "bancroft-ranch",
    label: "Spring Valley ranch / Bancroft House",
    buzzwords: [
      "spring valley",
      "ranch",
      "adobe",
      "country home",
      "retirement",
      "san diego county",
      "bancroft ranch",
    ],
    imageIds: ["img-bancroft-ranch"],
  },
];

export function buzzwordsByImageId(): Map<string, string[]> {
  const map = new Map<string, Set<string>>();
  for (const topic of BANCROFT_IMAGE_TOPICS) {
    for (const id of topic.imageIds) {
      if (!map.has(id)) map.set(id, new Set());
      for (const w of topic.buzzwords) map.get(id)!.add(w.toLowerCase());
    }
  }
  const out = new Map<string, string[]>();
  for (const [id, set] of map) out.set(id, [...set]);
  return out;
}

export function formatTopicCatalogForPrompt(): string {
  return BANCROFT_IMAGE_TOPICS.map((t) => {
    const ids =
      t.imageIds.length > 0
        ? t.imageIds.slice(0, 3).join(", ") + (t.imageIds.length > 3 ? ", …" : "")
        : "(none — use empty image_ids)";
    return `• ${t.label} (${t.key}): ${ids}\n  Buzzwords: ${t.buzzwords.slice(0, 12).join(", ")}${t.buzzwords.length > 12 ? ", …" : ""}`;
  }).join("\n");
}

export function catalogScoreForImage(
  imageId: string,
  storyHay: string,
  hayContains: (hay: string, term: string) => boolean
): number {
  let score = 0;
  for (const topic of BANCROFT_IMAGE_TOPICS) {
    const rank = topic.imageIds.indexOf(imageId);
    if (rank < 0) continue;

    let hits = 0;
    for (const word of topic.buzzwords) {
      if (hayContains(storyHay, word)) hits++;
    }
    if (hits === 0) continue;

    const priority = topic.imageIds.length - rank;
    score += hits * (2 + priority);
    if (hits >= 2) score += 4;
    if (rank === 0) score += 2;
  }
  return score;
}

export function detectCatalogTopics(
  storyHay: string,
  hayContains: (hay: string, term: string) => boolean
): { key: string; hits: number }[] {
  const found: { key: string; hits: number }[] = [];
  for (const topic of BANCROFT_IMAGE_TOPICS) {
    let hits = 0;
    for (const word of topic.buzzwords) {
      if (hayContains(storyHay, word)) hits++;
    }
    if (hits > 0) found.push({ key: topic.key, hits });
  }
  return found.sort((a, b) => b.hits - a.hits);
}
