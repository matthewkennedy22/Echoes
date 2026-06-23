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
    "How did you come to found the Polytechnic School?",
    "What was San Luis Obispo like when you arrived in 1883?",
    "Why do you believe so much in 'learning by doing'?",
    "Tell me about your book, the History of San Luis Obispo County.",
  ],
};
