import { IMAGE_ACCURACY_PROMPT } from "@/lib/imageAccuracy";
import type { PersonaPack } from "@/personas/types";
import { myronAngelSystemPrompt } from "./persona";
import { myronAngelPublic } from "./public";
import { myronAngelSources } from "./sources";
import { myronAngelImages } from "./images";
import { MYRON_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

export const myronAngelPack: PersonaPack = {
  public: myronAngelPublic,
  systemPrompt: myronAngelSystemPrompt,
  sources: myronAngelSources,
  images: myronAngelImages,
  imageTopics: MYRON_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  bookChunksPaths: [
    "personas/myron-angel/book-chunks-angel-1883.json",
    "personas/myron-angel/book-chunks-bancroft-california-v5.json",
  ],
  accuracyPrompt: IMAGE_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-", "calpoly-", "philosophy-"],
  temporalYear: 1905,
  speakerLabel: "You (Myron)",
  portraitImageId: "img-portrait",
};
