import type { ImageTopic } from "@/personas/types";

/** Format topic → image guide for the grounding prompt. */
export function formatTopicCatalogForPrompt(topics: ImageTopic[]): string {
  return topics
    .map((t) => {
      const ids =
        t.imageIds.length > 0
          ? t.imageIds.slice(0, 3).join(", ") +
            (t.imageIds.length > 3 ? ", …" : "")
          : "(none — use empty image_ids)";
      return `• ${t.label} (${t.key}): ${ids}\n  Buzzwords: ${t.buzzwords.slice(0, 12).join(", ")}${t.buzzwords.length > 12 ? ", …" : ""}`;
    })
    .join("\n");
}

export function catalogScoreForImage(
  topics: ImageTopic[],
  imageId: string,
  storyHay: string,
  hayContains: (hay: string, term: string) => boolean
): number {
  let score = 0;
  for (const topic of topics) {
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
  topics: ImageTopic[],
  storyHay: string,
  hayContains: (hay: string, term: string) => boolean
): { key: string; hits: number }[] {
  const found: { key: string; hits: number }[] = [];
  for (const topic of topics) {
    let hits = 0;
    for (const word of topic.buzzwords) {
      if (hayContains(storyHay, word)) hits++;
    }
    if (hits > 0) found.push({ key: topic.key, hits });
  }
  return found.sort((a, b) => b.hits - a.hits);
}

export function wikipediaArticlesForTopicKeys(
  byTopicKey: Record<string, string[]>,
  keys: string[]
): string[] {
  const out = new Set<string>();
  for (const key of keys) {
    for (const title of byTopicKey[key] ?? []) out.add(title);
  }
  return [...out];
}

export function resolveWikipediaArticlesFromHaystack(
  hay: string,
  keywordArticles: Record<string, string[]> = {}
): string[] {
  const lower = hay.toLowerCase();
  const out = new Set<string>();
  for (const [keyword, titles] of Object.entries(keywordArticles)) {
    if (lower.includes(keyword.toLowerCase())) {
      for (const t of titles) out.add(t);
    }
  }
  return [...out];
}
