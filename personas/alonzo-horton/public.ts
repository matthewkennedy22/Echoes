import type { PersonaPublic } from "@/lib/types";

/**
 * Client-safe display data for Alonzo Horton.
 * The system prompt and source pack live in server-only files.
 */
export const hortonPublic: PersonaPublic = {
  slug: "alonzo-horton",
  region: "San Diego",
  name: "Alonzo Horton",
  years: "1813 – 1909",
  portrait: "🏗️",
  portraitImage: "/portraits/alonzo-horton.jpg",
  tagline:
    "Father of New San Diego — developer of Horton's Addition on the bay",
  era: "Speaking from San Diego in 1905, still boosting the city he founded by the harbor",
  disclosure:
    "You are speaking with an AI simulation of Alonzo Horton, based on historical sources. It is not the real person, and it can be mistaken. Every answer is labeled by how well the sources support it, and you can view the evidence behind any reply.",
  starters: [
    "Introduce yourself — who is Alonzo Horton?",
    "Why did you move San Diego's center from Old Town down to the bay?",
    "Paint me a picture of Horton's Addition when you were building New Town.",
    "What was it like waiting for the railroad to reach your San Diego?",
    "How did the boom of the 1880s — and the bust after — treat you?",
  ],
};
