import type { PersonaPublic } from "@/lib/types";

/**
 * Client-safe display data for John D. Spreckels (Coronado).
 * System prompt and source pack live in server-only files.
 */
export const spreckelsPublic: PersonaPublic = {
  slug: "john-d-spreckels",
  visibility: "partner",
  region: "Coronado",
  name: "John D. Spreckels",
  years: "1853 – 1926",
  portrait: "🏨",
  portraitImage: "/portraits/john-d-spreckels.jpg",
  tagline:
    "Coronado developer — longtime owner of the Hotel del Coronado, founder of Tent City, ferry & transit builder",
  era: "Speaking from Coronado in 1912, from the mansion on Glorietta Bay across from the Hotel del Coronado",
  disclosure:
    "You are speaking with an AI simulation of John D. Spreckels, based on historical sources. It is not the real person, and it can be mistaken. Every answer is labeled by how well the sources support it, and you can view the evidence behind any reply.",
  starters: [
    "Introduce yourself — who is John D. Spreckels?",
    "How did you come to own the Hotel del Coronado?",
    "What was Tent City like for summer visitors on the Strand?",
    "Why did you make Coronado your home after the San Francisco earthquake?",
    "Paint me a picture of the ferry ride from San Diego to Coronado.",
  ],
};
