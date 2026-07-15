/**
 * Topic → buzzword → image map for August Hemme.
 */

import type { ImageTopic } from "@/personas/types";

export const HEMME_IMAGE_TOPICS: ImageTopic[] = [
  {
    key: "identity",
    label: "August Hemme — who he is (illustrative likeness)",
    buzzwords: [
      "august hemme",
      "who are you",
      "introduce yourself",
      "portrait",
      "likeness",
      "biography",
      "myself",
      "i am",
      "rancher",
    ],
    imageIds: ["img-portrait"],
  },
  {
    key: "danville-depot",
    label: "Danville SP depot & town growth",
    buzzwords: [
      "danville",
      "depot",
      "station",
      "danville depot",
      "railroad avenue",
      "hartz",
      "downtown",
      "boardwalk",
      "warehouse",
    ],
    imageIds: [
      "img-danville-depot",
      "img-museum-srv",
      "img-museum-srv-alt",
    ],
  },
  {
    key: "branch-line",
    label: "San Ramon Branch Line & Southern Pacific",
    buzzwords: [
      "southern pacific",
      "branch line",
      "san ramon branch",
      "railroad",
      "train",
      "tracks",
      "right-of-way",
      "june 7",
      "1891",
      "excursion",
    ],
    imageIds: [
      "img-danville-depot",
      "img-chinese-railroad-laborers",
    ],
  },
  {
    key: "hemme-station",
    label: "Hemme Station / Alamo freight stop",
    buzzwords: [
      "hemme station",
      "alamo station",
      "alamo",
      "freight depot",
      "hemme avenue",
      "hemme ranch",
    ],
    imageIds: ["img-danville-depot"],
  },
  {
    key: "iron-horse-modern",
    label: "Iron Horse Trail (modern — caption carefully)",
    buzzwords: [
      "iron horse trail",
      "iron horse",
      "trail",
      "multi-use",
      "rail-trail",
      "bike path",
    ],
    imageIds: ["img-iron-horse-trail", "img-danville-depot"],
  },
  {
    key: "agriculture-ranch",
    label: "Ranching, cattle & valley farms",
    buzzwords: [
      "ranch",
      "ranching",
      "cattle",
      "farm",
      "agriculture",
      "hay",
      "grain",
      "walnuts",
      "orchard",
      "produce",
      "3000 acres",
    ],
    imageIds: ["img-vaqueros-1854", "img-rancho-roundup"],
  },
  {
    key: "gold-rush",
    label: "Gold Rush youth",
    buzzwords: [
      "gold rush",
      "1849",
      "forty-niner",
      "mining",
      "pioneer",
    ],
    imageIds: ["img-gold-rush-mining"],
  },
  {
    key: "railroad-labor",
    label: "Railroad building era",
    buzzwords: [
      "chinese laborers",
      "built the railroad",
      "construction",
      "central pacific",
      "grading",
    ],
    imageIds: ["img-chinese-railroad-laborers"],
  },
];
