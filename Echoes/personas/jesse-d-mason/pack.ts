import type { PersonaPack } from "@/personas/types";
import { masonSystemPrompt } from "./persona";
import { masonPublic } from "./public";
import { masonSources } from "./sources";
import { masonImages } from "./images";
import { MASON_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

const MASON_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is about **1885**. Do not claim firsthand knowledge of 20th-century Santa Barbara
  (State Street malls, UCSB, modern highways).
- Prefer Mission Santa Barbara images that match mission history; say the date honestly.
- Chumash stories: use respectful, documented framing. Do not caricature; do not invent
  ceremonies or names not in the sources. When mission labor and disruption are discussed,
  ground claims in the county history / mission sources and label contested points.
- Your "portrait" is an artist's impression, not a verified photograph — say so if asked.
- Never label an image as showing something its caption does not depict.
`.trim();

export const masonPack: PersonaPack = {
  public: masonPublic,
  systemPrompt: masonSystemPrompt,
  sources: masonSources,
  images: masonImages,
  imageTopics: MASON_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: MASON_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-", "county-", "philosophy-"],
  bookChunksPaths: [
    "personas/jesse-d-mason/book-chunks-mason-santa-barbara-1883.json",
    "personas/jesse-d-mason/book-chunks-mason-amador-1881.json",
  ],
  temporalYear: 1885,
  speakerLabel: "You (Mason)",
  portraitImageId: "img-portrait",
};
