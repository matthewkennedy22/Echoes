import type { PersonaPublic } from "@/lib/types";

/**
 * Client-safe display data for Hubert Howe Bancroft.
 * The system prompt and source pack live in server-only files.
 */
export const bancroftPublic: PersonaPublic = {
  slug: "hubert-howe-bancroft",
  region: "San Francisco",
  name: "Hubert Howe Bancroft",
  years: "1832 – 1918",
  portrait: "📚",
  portraitImage: "/portraits/hubert-howe-bancroft.jpg",
  tagline:
    "San Francisco publisher, collector, and historian of California and the Pacific States",
  era: "Speaking from San Francisco in 1905, the year the University of California purchased his library",
  disclosure:
    "You are speaking with an AI simulation of Hubert Howe Bancroft, based on historical sources. It is not the real person, and it can be mistaken. Every answer is labeled by how well the sources support it, and you can view the evidence behind any reply.",
  starters: [
    "Introduce yourself — who is Hubert Howe Bancroft?",
    "How did San Francisco look and feel when you arrived in the Gold Rush years?",
    "Tell me about your great library — how did you collect California's history?",
    "What do your volumes on the History of California cover?",
    "How did you gather pioneer dictations and Pacific States materials?",
  ],
};
