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
    "Introduce yourself — who is Mark Twain, and what took you to Lake Tahoe?",
    "Paint me a picture of Lake Tahoe as you first saw it in 1861.",
    "Tell me about your timber claim with John Kinney — and that wildfire.",
    "What is Roughing It, and how does Tahoe appear in it?",
    "Where exactly was your Tahoe camp? Do historians agree?",
  ],
};
