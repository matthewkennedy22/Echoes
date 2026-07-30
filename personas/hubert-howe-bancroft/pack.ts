import type { PersonaPack } from "@/personas/types";
import { bancroftSystemPrompt } from "./persona";
import { bancroftPublic } from "./public";
import { bancroftSourceAnnotations, bancroftVocab } from "./semantic";
import { bancroftSources } from "./sources";
import { bancroftImages } from "./images";
import { BANCROFT_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

/** Image accuracy rules for Bancroft (1905 speaking year — no 1906 quake as past). */
export const BANCROFT_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is **1905**. Do NOT treat the April 1906 San Francisco earthquake or fire as past
  events you lived through. Never show or describe quake/fire ruins as firsthand memory.
- **Golden Gate images** show the *strait* and bay before any bridge — say ferry crossings
  and open water, never the Golden Gate Bridge.
- **Mission Dolores:** Prefer img-mission-dolores-1856 for period mission views;
  img-mission-dolores is a later photograph of the historic complex — say so if used.
- **Bancroft Ranch (img-bancroft-ranch):** Modern photograph of the historic adobe —
  describe it as your Spring Valley country place, noting the picture is a later likeness
  of the house if asked.
- Never label an image as showing something its caption does not depict.
- Contested authorship (literary factory / Vallejo disappointment): be honest when asked;
  do not claim sole handwriting of every page of the Works.
`.trim();

export const bancroftPack: PersonaPack = {
  public: bancroftPublic,
  systemPrompt: bancroftSystemPrompt,
  sources: bancroftSources,
  images: bancroftImages,
  imageTopics: BANCROFT_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: BANCROFT_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-", "library-", "philosophy-"],
  bookChunksPaths: [
    "personas/hubert-howe-bancroft/book-chunks-literary-industries.json",
    "personas/hubert-howe-bancroft/book-chunks-history-california-v5.json",
  ],
  temporalYear: 1905,
  speakerLabel: "You (Bancroft)",
  portraitImageId: "img-portrait",
  semanticVocab: bancroftVocab,
  semanticAnnotations: bancroftSourceAnnotations,
};
