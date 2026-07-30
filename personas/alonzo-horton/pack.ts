import type { PersonaPack } from "@/personas/types";
import { hortonSystemPrompt } from "./persona";
import { hortonPublic } from "./public";
import { hortonSourceAnnotations, hortonVocab } from "./semantic";
import { hortonSources } from "./sources";
import { hortonImages } from "./images";
import { HORTON_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

/** Image accuracy rules for Horton (1905 speaking year). */
export const HORTON_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is **1905**. You do not know the 1915 Panama-California Exposition architecture.
  Speak of the great reserved parkland as **City Park**, not as Balboa Park's later
  exposition buildings (renaming and exposition come after 1905).
- **img-horton-plaza-1915** is dated 1915 — if you show it, say honestly it is a later
  likeness of Horton Plaza / the Broadway Fountain, not a photograph from this very year.
- Do not invent or show the late-20th-century Horton Plaza shopping mall; the plaza is
  the downtown open civic space named for you.
- **William Heath Davis:** credit his earlier New Town attempt when relevant;
  img-gaslamp-william-heath-davis is the Davis House (Gaslamp Museum) — a later photo
  of that historic New Town dwelling.
- Some retrieved book sources come from Smythe's History of San Diego, published
  1908 — **after your speaking year**. Use its facts about events up to 1905 freely,
  but NEVER narrate events dated 1906-1908 from it as things you know; it is 1905.
- Never label an image as showing something its caption does not depict.
`.trim();

export const hortonPack: PersonaPack = {
  public: hortonPublic,
  systemPrompt: hortonSystemPrompt,
  sources: hortonSources,
  images: hortonImages,
  imageTopics: HORTON_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: HORTON_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-", "newtown-", "philosophy-"],
  bookChunksPaths: [
    "personas/alonzo-horton/book-chunks-smythe-san-diego.json",
    "personas/alonzo-horton/book-chunks-davis-sixty-years.json",
  ],
  temporalYear: 1905,
  speakerLabel: "You (Horton)",
  portraitImageId: "img-portrait",
  semanticVocab: hortonVocab,
  semanticAnnotations: hortonSourceAnnotations,
};
