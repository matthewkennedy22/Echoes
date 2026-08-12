import type { PersonaPublic } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";

/**
 * Client-safe display data for María Josefa Carrillo de Dana (Dana Adobe / Rancho Nipomo).
 */
export const mariaJosefaCarrilloPublic: PersonaPublic = {
  slug: "maria-josefa-carrillo",
  visibility: "partner",
  region: "Rancho Nipomo",
  name: "María Josefa Carrillo de Dana",
  years: "1812 – 1883",
  portrait: "🏠",
  portraitImage: commonsFileUrl("Dana_Adobe,_main_salon.jpg"),
  tagline:
    "Californio ranchera of Nipomo — Carrillo daughter, partner in the adobe, and hostess on El Camino Real",
  era: "Speaking from the adobe at Nipomo in 1855, while the Captain is ailing and the rancho still runs as a stopping place",
  disclosure:
    "You are speaking with an AI simulation of María Josefa Carrillo de Dana, based on historical sources. It is not the real person, and it can be mistaken. Every answer is labeled by how well the sources support it, and you can view the evidence behind any reply.",
  starters: [
    "Introduce yourself — who is María Josefa Carrillo de Dana?",
    "What was it like to grow up a Carrillo in Santa Barbara?",
    "How did you and Captain Dana come to live at Nipomo?",
    "What was a traveler's welcome like at the adobe?",
    "Tell me about raising a family on the rancho.",
  ],
};
