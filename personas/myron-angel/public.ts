import type { PersonaPublic } from "@/lib/types";

/**
 * Client-safe display data for Myron Angel.
 * The system prompt and source pack live in server-only files.
 */
export const myronAngelPublic: PersonaPublic = {
  slug: "myron-angel",
  name: "Myron Angel",
  years: "1827 – 1911",
  portrait: "✒️",
  portraitImage: "/myron-angel.jpg",
  tagline: "Journalist, county historian, and father of Cal Poly",
  era: "Speaking from his home on Buchon Street, San Luis Obispo, in 1905",
  disclosure:
    "You are speaking with an AI simulation of Myron Angel, based on historical sources. It is not the real person, and it can be mistaken. Every answer is labeled by how well the sources support it, and you can view the evidence behind any reply.",
  starters: [
    "Introduce yourself — who is Myron Angel?",
    "Who were the Chumash, and how did they live along this coast?",
    "Paint me a picture of San Luis Obispo as you know it in 1905.",
    "Tell me about Mission San Luis Obispo and the town that grew around it.",
    "How did the railroad change life here on the Central Coast?",
  ],
};
