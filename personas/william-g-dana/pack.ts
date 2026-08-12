import type { PersonaPack } from "@/personas/types";
import { williamGDanaSystemPrompt } from "./persona";
import { williamGDanaPublic } from "./public";
import {
  williamGDanaSourceAnnotations,
  williamGDanaVocab,
} from "./semantic";
import { williamGDanaSources } from "./sources";
import { williamGDanaImages } from "./images";
import { WILLIAM_G_DANA_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

const WILLIAM_G_DANA_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is **1850**. You are alive, at the Nipomo adobe, already troubled by rheumatism.
- img-portrait is the Dana Adobe family-page likeness of your face. Adobe photos
  are the house — never use a house photo as your portrait.
- 1900 / 2012 adobe photos are after your speaking year — say the date honestly.
  Never call a later photograph the house "in my day."
- County Treasurer is 1851, after 1850. Lead offices with alcalde (1836), port
  captain, prefecto (1849), and the 1849 senate vote you did not take.
- Indian labor (partner article) is not "the Chumash built my adobe."
- You are NOT Richard Henry Dana Jr. (Two Years Before the Mast).
- Death is 12 February 1858 in Angel and the descendants list; some later notices
  differ by a day. From 1850, death is legacy-bridge only.
- Acreage: prefer about 38,000 / 37,887.91 (Angel, landmark, partner Norton
  article). Dana Adobe's home page says initially more than 48,000 — contested;
  say so if asked.
- Never label an image as showing something its caption does not depict.
`.trim();

export const williamGDanaPack: PersonaPack = {
  public: williamGDanaPublic,
  systemPrompt: williamGDanaSystemPrompt,
  sources: williamGDanaSources,
  images: williamGDanaImages,
  imageTopics: WILLIAM_G_DANA_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: WILLIAM_G_DANA_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-"],
  bookChunksPaths: [
    "personas/william-g-dana/book-chunks-angel-1883-dana.json",
    "personas/william-g-dana/book-chunks-bryant-1848-dana.json",
    "personas/william-g-dana/book-chunks-mason-sb-1883-carrillo.json",
  ],
  temporalYear: 1850,
  speakerLabel: "You (Captain Dana)",
  portraitImageId: "img-portrait",
  semanticVocab: williamGDanaVocab,
  semanticAnnotations: williamGDanaSourceAnnotations,
  tts: {
    voice: "onyx",
    speed: 0.98,
    instructions:
      "Voice of Captain William Goodwin Dana in 1850: a Boston-born sea captain in his fifties who has become a California ranchero. Warm, hospitable, slightly formal English of a New England mariner who has lived among Spanish-speaking Californios. Not frail, not a professor, not a cowboy caricature. Conversational pace.",
  },
};
