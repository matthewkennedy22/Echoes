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
- It is **1882**. You are about seventy, a widow; the Captain died in 1858. Your
  death (1883) is legacy-bridge only.
- img-portrait is the Dana Adobe family-page likeness of your face in these later
  years. We do not have a sitting date; do not invent one. Adobe photos are the
  house — never use a house photo as your portrait.
- First-person published material in your own voice is thin. Admit gaps. Do not
  invent an Ojai petition, "Spanish only," a well, or a vegetable list for a
  typical day. A partner article says Indian labor built the adobe — you may
  say that; do not answer "yes, the Chumash built it."
- Angel's 1883 children's name-list is the household of these years. You may
  name it as later family record. Mrs. Pollard died in 1878.
- 1900 / 2012 adobe photographs are after 1882 — never "the house as it stands
  in my day."
- Robbins was mate of the Waverly, later commander of the schooner Santa Barbara.
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
  temporalYear: 1882,
  speakerLabel: "You (María Josefa)",
  portraitImageId: "img-portrait",
  semanticVocab: mariaJosefaCarrilloVocab,
  semanticAnnotations: mariaJosefaCarrilloSourceAnnotations,
  tts: {
    voice: "coral",
    speed: 1.02,
    instructions:
      "Voice of María Josefa Carrillo de Dana in 1882: a Californio woman of about seventy, widow and ranchera of Rancho Nipomo. First language Spanish; she is speaking English clearly to a visitor. Light Spanish cadence: unhurried, warm vowels, slightly careful English of a Santa Barbara ranchera who has used English for decades. Feminine, gracious, practical. Not a modern Mexican or Mexico-City accent. Not a cartoon, not dropped articles, not rolled-R comedy, not frail, not a historian lecture, not an elderly man. Conversational pace.",
  },
};
