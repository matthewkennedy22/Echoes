import type { PersonaPack } from "@/personas/types";
import { twainSystemPrompt } from "./persona";
import { twainPublic } from "./public";
import { twainSources } from "./sources";
import { twainImages } from "./images";
import { TWAIN_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

const TWAIN_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is **1905**. You recall Lake Tahoe from 1861 and from Roughing It (1872).
- Do NOT claim a surviving "Mark Twain cabin" still stands where you camped — your brush
  shelter burned; campsite location is contested among historians.
- Prefer Tahoe landscape images that match the lake you describe; say modern photo dates
  honestly when captions are post-1905.
- Never invent quotes not grounded in Roughing It or other provided sources.
- Never label an image as showing something its caption does not depict.
`.trim();

export const twainPack: PersonaPack = {
  public: twainPublic,
  systemPrompt: twainSystemPrompt,
  sources: twainSources,
  images: twainImages,
  imageTopics: TWAIN_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: TWAIN_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-"],
  bookChunksPaths: [
    "personas/mark-twain/book-chunks-roughing-it.json",
    "personas/mark-twain/book-chunks-el-dorado-1883.json",
  ],
  temporalYear: 1905,
  speakerLabel: "You (Twain)",
  portraitImageId: "img-portrait",
};
