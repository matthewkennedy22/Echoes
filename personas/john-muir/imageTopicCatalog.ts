/**
 * Topic → buzzword → image map for John Muir (Sierra Nevada / Yosemite focus).
 */

import type { ImageTopic } from "@/personas/types";

export const MUIR_IMAGE_TOPICS: ImageTopic[] = [
  {
    key: "identity",
    label: "John Muir — who he is",
    buzzwords: [
      "john muir",
      "who are you",
      "introduce yourself",
      "portrait",
      "likeness",
      "biography",
      "myself",
      "i am",
      "naturalist",
    ],
    imageIds: ["img-portrait", "img-muir-c1902"],
  },
  {
    key: "yosemite-valley",
    label: "Yosemite Valley views",
    buzzwords: [
      "yosemite",
      "yosemite valley",
      "valley",
      "first saw",
      "description",
      "granite temple",
      "merced",
    ],
    imageIds: [
      "img-yosemite-valley",
      "img-mariposa-trail",
      "img-el-capitan",
      "img-half-dome",
    ],
  },
  {
    key: "waterfalls",
    label: "Yosemite waterfalls",
    buzzwords: [
      "waterfall",
      "yosemite falls",
      "bridalveil",
      "pohono",
      "cascade",
      "snowmelt",
    ],
    imageIds: ["img-yosemite-falls", "img-bridalveil"],
  },
  {
    key: "landmarks",
    label: "El Capitan & Half Dome",
    buzzwords: [
      "el capitan",
      "half dome",
      "landmarks",
      "granite",
      "dome",
      "cliff",
    ],
    imageIds: ["img-el-capitan", "img-half-dome"],
  },
  {
    key: "sequoia-forest",
    label: "Sequoias & Mariposa Grove",
    buzzwords: [
      "sequoia",
      "mariposa grove",
      "grizzly giant",
      "forest",
      "trees",
      "big trees",
    ],
    imageIds: ["img-grizzly-giant"],
  },
  {
    key: "roosevelt-1903",
    label: "Roosevelt camping trip 1903",
    buzzwords: [
      "roosevelt",
      "theodore roosevelt",
      "teddy",
      "1903",
      "glacier point",
      "camping",
      "president",
    ],
    imageIds: ["img-roosevelt-muir"],
  },
  {
    key: "hetch-hetchy",
    label: "Hetch Hetchy Valley",
    buzzwords: [
      "hetch hetchy",
      "tuolumne",
      "dam",
      "reservoir",
      "san francisco water",
    ],
    imageIds: ["img-hetch-hetchy"],
  },
  {
    key: "sierra-travel",
    label: "Approaches & High Sierra travel",
    buzzwords: [
      "trail",
      "mariposa trail",
      "approach",
      "horseback",
      "first summer",
      "sheep",
      "1869",
    ],
    imageIds: ["img-mariposa-trail", "img-yosemite-valley"],
  },
  {
    key: "glaciers",
    label: "Glacial sculpture (use valley granite views)",
    buzzwords: [
      "glacier",
      "glacial",
      "ice",
      "whitney",
      "geology",
      "moraine",
      "polished",
    ],
    imageIds: [
      "img-yosemite-valley",
      "img-half-dome",
      "img-el-capitan",
    ],
  },
];
