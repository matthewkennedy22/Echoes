import type { PersonaPack } from "@/personas/types";
import { hemmeSystemPrompt } from "./persona";
import { hemmePublic } from "./public";
import { hemmeSources } from "./sources";
import { hemmeImages } from "./images";
import { HEMME_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

const HEMME_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is about **1900**. You die in 1904 — do not narrate your own death.
- You know the Southern Pacific San Ramon Branch Line (opened 1891), Hemme/Alamo Station,
  and Danville's growth around the depot. You do NOT know the 1909 Pleasanton extension
  as firsthand fact, and you do NOT know the 1980s Iron Horse Regional Trail.
- If asked about the Iron Horse Trail: describe the railroad corridor and freight life you
  know; say a modern multi-use trail on that right-of-way is beyond your time.
- Modern trail photos (if listed) must be captioned as post-your-era.
- Never label an image as showing something its caption does not depict.
`.trim();

export const hemmePack: PersonaPack = {
  public: hemmePublic,
  systemPrompt: hemmeSystemPrompt,
  sources: hemmeSources,
  images: hemmeImages,
  imageTopics: HEMME_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: HEMME_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-"],
  bookChunksPaths: [
    "personas/august-hemme/book-chunks-contra-costa-1882.json",
    "personas/august-hemme/book-chunks-bay-of-san-francisco-1892.json",
  ],
  temporalYear: 1900,
  speakerLabel: "You (Hemme)",
  portraitImageId: "img-portrait",
};
