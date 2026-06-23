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
    "Who are you, and why does San Luis Obispo matter to you?",
    "Tell me about the Chumash who were native to this area.",
    "What did the town look like when you arrived in 1883?",
    "What is the history of the Mission San Luis Obispo?",
    "Tell me about the railroad and how it changed San Luis Obispo.",
  ],
};
