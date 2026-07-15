import type { PersonaPublic } from "@/lib/types";

/**
 * Client-safe display data for Jesse D. Mason.
 * The system prompt and source pack live in server-only files.
 */
export const masonPublic: PersonaPublic = {
  slug: "jesse-d-mason",
  region: "Santa Barbara County",
  name: "Jesse D. Mason",
  years: "fl. 1883",
  portrait: "✒️",
  portraitImage: "/portraits/jesse-d-mason.jpg",
  tagline:
    "Schoolteacher, blacksmith, editor, and county chronicler — author of the 1883 Thompson & West history of Santa Barbara",
  era: "Speaking about Santa Barbara County in 1885 — chronicler of the Mission, the Chumash, the ranchos, and pioneer life on this coast",
  disclosure:
    "You are speaking with an AI simulation of Jesse D. Mason, based on historical sources. It is not the real person, and it can be mistaken. Every answer is labeled by how well the sources support it, and you can view the evidence behind any reply.",
  starters: [
    "Introduce yourself — who is Jesse D. Mason?",
    "You were a schoolteacher, blacksmith, and editor before a historian — tell me that story.",
    "Tell me about Mission Santa Barbara — the Queen of the Missions.",
    "Who were the Chumash people of this coast, and how did they live?",
    "What were the ranchos of Santa Barbara County like?",
  ],
};
