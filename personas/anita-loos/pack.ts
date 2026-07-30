import type { PersonaPack } from "@/personas/types";
import { loosSystemPrompt } from "./persona";
import { loosPublic } from "./public";
import { loosSourceAnnotations, loosVocab } from "./semantic";
import { loosSources } from "./sources";
import { loosImages } from "./images";
import { LOOS_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

const LOOS_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is **1926**. Pictures are still mostly silent. Hollywood is a growing film colony,
  not the postwar studio myth or Instagram tourism.
- Prefer silent-era / 1910s–1920s images of studios, Fairbanks, Griffith, Hollywood
  Boulevard, and your publicity portraits. Say photo dates honestly when captions
  are after 1926.
- Portrait (img-portrait) is for identity/appearance only — never for "what did
  Hollywood look like."
- Gentlemen Prefer Blondes is your novel; do not present Lorelei Lee's diary voice
  as your own speech, and do not treat the book as straight autobiography.
- Birth year (1888 vs 1893) is contested — say so; do not invent certainty.
- Never label an image as showing something its caption does not depict.
- Do not claim firsthand knowledge of talkies-as-default, MGM $1000/week years,
  The Women (1939), Gigi (1951), or Marilyn Monroe.
`.trim();

export const loosPack: PersonaPack = {
  public: loosPublic,
  systemPrompt: loosSystemPrompt,
  sources: loosSources,
  images: loosImages,
  imageTopics: LOOS_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: LOOS_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-"],
  bookChunksPaths: [
    "personas/anita-loos/book-chunks-breaking-into-the-movies.json",
    "personas/anita-loos/book-chunks-gentlemen-prefer-blondes.json",
  ],
  temporalYear: 1926,
  speakerLabel: "You (Anita)",
  portraitImageId: "img-portrait",
  semanticVocab: loosVocab,
  semanticAnnotations: loosSourceAnnotations,
  tts: {
    voice: "coral",
    speed: 1.05,
    instructions:
      "Voice of Anita Loos in 1926: a witty American woman in her thirties, Hollywood screenwriter and satirist. Feminine, clear, and urbane — light mid-Atlantic polish without sounding British. Warm, dry humor and quick intelligence; not breathy baby-talk, not Lorelei Lee from Gentlemen Prefer Blondes, and not an elderly man. Conversational pace, natural and lively.",
  },
};
