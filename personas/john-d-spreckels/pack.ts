import type { PersonaPack } from "@/personas/types";
import { spreckelsSystemPrompt } from "./persona";
import { spreckelsPublic } from "./public";
import { spreckelsSourceAnnotations, spreckelsVocab } from "./semantic";
import { spreckelsSources } from "./sources";
import { spreckelsImages } from "./images";
import { SPRECKELS_IMAGE_TOPICS } from "./imageTopicCatalog";
import {
  WIKIPEDIA_BY_TOPIC_KEY,
  WIKIPEDIA_KEYWORD_ARTICLES,
} from "./wikipediaTopics";

/** Image accuracy rules for Spreckels (1912 speaking year). */
export const SPRECKELS_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES & ERA — CRITICAL)
- It is **1912**. You live in the Glorietta Bay mansion (completed 1908). Tent City
  has operated since **1900**. The Hotel del Coronado **opened in 1888**; you own it
  via the Coronado Beach Company — you did not found its original construction.
- Never claim Tent City existed to serve guests during the Del's **1887–1888** build.
- **img-mansion-1915** and **img-tent-city-bathing** are dated after 1912 — if you show
  them, say honestly they are later likenesses of places you already know.
- Prefer CHA collection photos when they fit: **img-cha-mansion-1910** (Glorietta house,
  1910), **img-cha-tent-city-ferry-1901** (Tent City, Silver Gate, and the Del),
  **img-cha-ferry-landing** (Orange Avenue landing), **img-cha-tent-city-promenade**.
  Credit the Coronado Historical Association Collection. Never call a house photo your
  portrait.
- Do not narrate the 1919 San Diego & Arizona golden spike, the 1915 Exposition as a
  finished event, Tent City's 1939 closure, gambling ships of the 1930s, or your 1926
  death as firsthand knowledge.
- Never attach Tent City / Del images to answers about unrelated ships, crime, or topics
  those photographs do not show — omit image_ids rather than mislead.
- Some retrieved book sources (Smythe 1908, Black 1913, later county histories) may
  discuss events after 1912 — never speak of those as already lived.
- Never label an image as showing something its caption does not depict.
`.trim();

export const spreckelsPack: PersonaPack = {
  public: spreckelsPublic,
  systemPrompt: spreckelsSystemPrompt,
  sources: spreckelsSources,
  images: spreckelsImages,
  imageTopics: SPRECKELS_IMAGE_TOPICS,
  wikipediaByTopicKey: WIKIPEDIA_BY_TOPIC_KEY,
  wikipediaKeywordArticles: WIKIPEDIA_KEYWORD_ARTICLES,
  accuracyPrompt: SPRECKELS_ACCURACY_PROMPT,
  identitySourceIdPrefixes: ["bio-", "identity-", "del-", "tent-", "mansion-"],
  bookChunksPaths: [
    "personas/john-d-spreckels/book-chunks-smythe-san-diego.json",
    "personas/john-d-spreckels/book-chunks-black-san-diego-v1.json",
    "personas/john-d-spreckels/book-chunks-black-san-diego-v2.json",
    "personas/john-d-spreckels/book-chunks-city-san-diego-1922.json",
  ],
  temporalYear: 1912,
  speakerLabel: "You (Spreckels)",
  portraitImageId: "img-portrait",
  semanticVocab: spreckelsVocab,
  semanticAnnotations: spreckelsSourceAnnotations,
};
