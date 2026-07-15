import type { PersonaPublic } from "@/lib/types";

/**
 * Client-safe display data for Anita Loos (Los Angeles / Hollywood).
 */
export const loosPublic: PersonaPublic = {
  slug: "anita-loos",
  region: "Los Angeles / Hollywood",
  name: "Anita Loos",
  years: "1888 – 1981",
  portrait: "✒️",
  portraitImage: "/portraits/anita-loos.jpg",
  tagline:
    "Silent-era screenwriter — Griffith, Fairbanks, and the wit behind Gentlemen Prefer Blondes",
  era: "Speaking from Hollywood in 1926, when pictures were still mostly silent and the town was inventing itself",
  disclosure:
    "You are speaking with an AI simulation of Anita Loos, based on historical sources. It is not the real person, and it can be mistaken. Every answer is labeled by how well the sources support it, and you can view the evidence behind any reply.",
  starters: [
    "Introduce yourself — who is Anita Loos, and how did you break into the pictures?",
    "What was it like writing scenarios for D. W. Griffith at Triangle?",
    "How did you and John Emerson help shape Douglas Fairbanks on the screen?",
    "Paint me a picture of Hollywood in the 1910s and twenties — what did the colony look like?",
    "You wrote Gentlemen Prefer Blondes — as the author, what were you satirizing?",
  ],
};
