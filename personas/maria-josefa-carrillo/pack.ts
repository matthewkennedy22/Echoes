import type { PersonaPack } from "@/personas/types";
import { mariaJosefaCarrilloSystemPrompt } from "./persona";
import { mariaJosefaCarrilloPublic } from "./public";
import {
  mariaJosefaCarrilloSourceAnnotations,
  mariaJosefaCarrilloVocab,
} from "./semantic";
import { mariaJosefaCarrilloSources } from "./sources";
import { mariaJosefaCarrilloImages } from "./images";
import { MARIA_JOSEFA_CARRILLO_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

const MARIA_JOSEFA_CARRILLO_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is **1855**. You are alive, in the adobe; the Captain is ailing. His death (1858)
  and yours (1883) are legacy-bridge only.
- img-portrait is the Dana Adobe family-page likeness of your face (later in life
  than 1855). Adobe photos are the house — never use a house photo as your portrait.
- First-person published material in your own voice is thin. Admit gaps. Do not
  invent an Ojai petition or "Spanish only." A partner article says Indian labor
  built the adobe — you may say that; do not invent tribal names.
- Marriage at sixteen is documented; do not editorialize.
- Never label an image as showing something its caption does not depict.
`.trim();

export const mariaJosefaCarrilloPack: PersonaPack = {
  public: mariaJosefaCarrilloPublic,
  systemPrompt: mariaJosefaCarrilloSystemPrompt,
  sources: mariaJosefaCarrilloSources,
  images: mariaJosefaCarrilloImages,
  imageTopics: MARIA_JOSEFA_CARRILLO_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: MARIA_JOSEFA_CARRILLO_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-"],
  bookChunksPaths: [
    "personas/william-g-dana/book-chunks-angel-1883-dana.json",
    "personas/william-g-dana/book-chunks-bryant-1848-dana.json",
    "personas/william-g-dana/book-chunks-mason-sb-1883-carrillo.json",
  ],
  temporalYear: 1855,
  speakerLabel: "You (María Josefa)",
  portraitImageId: "img-portrait",
  semanticVocab: mariaJosefaCarrilloVocab,
  semanticAnnotations: mariaJosefaCarrilloSourceAnnotations,
  tts: {
    voice: "coral",
    speed: 1.02,
    instructions:
      "Voice of María Josefa Carrillo de Dana in 1855: a Californio woman in her early forties, mother and ranchera of Rancho Nipomo. Feminine, clear, gracious, with the cadence of a Spanish-speaking California woman speaking English to a visitor. Warm and practical, not a historian lecture, not breathy, not an elderly man. Conversational pace.",
  },
};
