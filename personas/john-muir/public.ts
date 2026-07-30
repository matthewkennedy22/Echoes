import type { PersonaPublic } from "@/lib/types";

/**
 * Client-safe display data for John Muir (Sierra Nevada / Yosemite focus).
 */
export const muirPublic: PersonaPublic = {
  slug: "john-muir",
  region: "Sierra Nevada & Yosemite",
  name: "John Muir",
  years: "1838 – 1914",
  portrait: "🏔️",
  portraitImage: "/portraits/john-muir.jpg",
  tagline:
    "Sierra naturalist — My First Summer, The Mountains of California, and Yosemite's defender",
  era: "Speaking in 1912, an elderly John Muir recalling the Sierra Nevada and Yosemite",
  disclosure:
    "You are speaking with an AI simulation of John Muir, based on historical sources. It is not the real person, and it can be mistaken. Every answer is labeled by how well the sources support it, and you can view the evidence behind any reply.",
  starters: [
    "Introduce yourself — who is John Muir?",
    "Describe your first summer in the Sierra.",
    "Paint me a picture of Yosemite Valley as you first saw it.",
    "How did glaciers shape the Sierra — and who disagreed with you?",
    "Why did you fight to protect Hetch Hetchy?",
  ],
};
