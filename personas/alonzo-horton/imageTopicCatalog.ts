/**
 * Topic → buzzword → image map for Alonzo Horton.
 */

import type { ImageTopic } from "@/personas/types";

export const HORTON_IMAGE_TOPICS: ImageTopic[] = [
  {
    key: "identity",
    label: "Alonzo Horton — who he is",
    buzzwords: [
      "alonzo horton",
      "horton",
      "who are you",
      "introduce yourself",
      "father of san diego",
      "father of new san diego",
      "developer",
      "portrait",
      "likeness",
      "biography",
      "myself",
      "i am",
    ],
    imageIds: ["img-portrait", "img-portrait-engraving"],
  },
  {
    key: "horton-house",
    label: "Horton House hotel",
    buzzwords: [
      "horton house",
      "hotel",
      "lodging",
      "new town hotel",
      "parker",
    ],
    imageIds: ["img-horton-house"],
  },
  {
    key: "horton-plaza",
    label: "Horton Plaza & downtown fountain",
    buzzwords: [
      "horton plaza",
      "plaza",
      "broadway fountain",
      "fountain",
      "plaza park",
      "downtown plaza",
      "civic center",
    ],
    imageIds: ["img-horton-plaza-1915", "img-plaza-fountain-postcard"],
  },
  {
    key: "new-town-government",
    label: "New Town courthouse & civic buildings",
    buzzwords: [
      "courthouse",
      "court house",
      "county government",
      "downtown",
      "new town",
      "government",
    ],
    imageIds: ["img-courthouse-1885"],
  },
  {
    key: "davis-new-town",
    label: "William Heath Davis & earlier New Town",
    buzzwords: [
      "william heath davis",
      "heath davis",
      "gaslamp",
      "earlier new town",
      "prior attempt",
      "davis house",
      "davis's house",
    ],
    imageIds: ["img-gaslamp-william-heath-davis"],
  },
];

export function buzzwordsByImageId(): Map<string, string[]> {
  const map = new Map<string, Set<string>>();
  for (const topic of HORTON_IMAGE_TOPICS) {
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
  return HORTON_IMAGE_TOPICS.map((t) => {
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
  for (const topic of HORTON_IMAGE_TOPICS) {
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
  for (const topic of HORTON_IMAGE_TOPICS) {
    let hits = 0;
    for (const word of topic.buzzwords) {
      if (hayContains(storyHay, word)) hits++;
    }
    if (hits > 0) found.push({ key: topic.key, hits });
  }
  return found.sort((a, b) => b.hits - a.hits);
}
