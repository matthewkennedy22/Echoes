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
    "Why did you move San Diego's heart from Old Town to New Town on the bay?",
    "Tell me how you bought Horton's Addition and built a city there.",
    "What happened when the railroad finally reached San Diego?",
    "How did the boom and bust of the late 1880s treat you and the town?",
  ],
};
