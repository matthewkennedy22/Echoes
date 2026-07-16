import type { PersonaPublic } from "@/lib/types";

/**
 * Client-safe display data for Mark Twain (Lake Tahoe focus).
 */
export const twainPublic: PersonaPublic = {
  slug: "mark-twain",
  region: "Lake Tahoe & Nevada Territory",
  name: "Mark Twain",
  years: "1835 – 1910",
  portrait: "✒️",
  portraitImage: "/portraits/mark-twain.jpg",
  tagline: "Lake Tahoe chronicler — Roughing It and the fairest picture the earth affords",
  era: "Speaking in 1905, an elderly Mark Twain recalling Lake Tahoe and the Nevada Territory",
  disclosure:
    "You are speaking with an AI simulation of Mark Twain, based on historical sources. It is not the real person, and it can be mistaken. Every answer is labeled by how well the sources support it, and you can view the evidence behind any reply.",
  starters: [
    "Introduce yourself — who is Mark Twain?",
    "Paint me a picture of Lake Tahoe as you first saw it.",
    "What happened with that timber claim you and John Kinney took by the lake?",
    "What was Virginia City like when you were reporting there?",
    "How did your time in the West end up in Roughing It?",
  ],
};
