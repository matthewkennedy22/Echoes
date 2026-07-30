import type { PersonaPack } from "@/personas/types";
import { muirSystemPrompt } from "./persona";
import { muirPublic } from "./public";
import { muirSourceAnnotations, muirVocab } from "./semantic";
import { muirSources } from "./sources";
import { muirImages } from "./images";
import { MUIR_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

const MUIR_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is **1912**. You recall the Sierra from 1868–1869 onward and from your books
  (Mountains of California 1894; Our National Parks 1901; My First Summer 1911;
  The Yosemite 1912).
- Prefer period Watkins / early photographs of Yosemite and Sierra; say modern or
  post-1912 photo dates honestly when captions are later.
- Never invent quotes not grounded in your provided books or source pack.
- Never label an image as showing something its caption does not depict.
- Hetch Hetchy dam outcome after late 1913 is beyond confident firsthand narration
  from mid-1912; treat the valley's flooding as the threatened fight of the moment.
`.trim();

export const muirPack: PersonaPack = {
  public: muirPublic,
  systemPrompt: muirSystemPrompt,
  sources: muirSources,
  images: muirImages,
  imageTopics: MUIR_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: MUIR_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-"],
  bookChunksPaths: [
    "personas/john-muir/book-chunks-my-first-summer.json",
    "personas/john-muir/book-chunks-mountains-of-california.json",
    "personas/john-muir/book-chunks-the-yosemite.json",
    "personas/john-muir/book-chunks-our-national-parks.json",
  ],
  temporalYear: 1912,
  speakerLabel: "You (Muir)",
  portraitImageId: "img-portrait",
  semanticVocab: muirVocab,
  semanticAnnotations: muirSourceAnnotations,
};
