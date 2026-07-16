/**
 * Topic → buzzword → image map for Mark Twain (Lake Tahoe focus).
 */

import type { ImageTopic } from "@/personas/types";

export const TWAIN_IMAGE_TOPICS: ImageTopic[] = [
  {
    key: "identity",
    label: "Mark Twain — who he is",
    buzzwords: [
      "mark twain",
      "samuel clemens",
      "who are you",
      "introduce yourself",
      "portrait",
      "likeness",
      "biography",
      "myself",
      "i am",
      "humorist",
    ],
    imageIds: ["img-portrait", "img-twain-brady-1871"],
  },
  {
    key: "tahoe-view",
    label: "Lake Tahoe mountain & water views",
    buzzwords: [
      "lake tahoe",
      "tahoe",
      "fairest picture",
      "mountain lake",
      "still surface",
      "clarity",
      "blue water",
      "first saw",
      "description",
    ],
    imageIds: [
      "img-tahoe-artists-point",
      "img-tahoe-warm-springs",
      "img-emerald-bay",
    ],
  },
  {
    key: "tahoe-shore-timber",
    label: "Shore, pines & timber claim country",
    buzzwords: [
      "timber",
      "timber claim",
      "pine",
      "yellow pine",
      "forest",
      "shore",
      "brush shelter",
      "lean-to",
      "fence",
      "300 acres",
    ],
    imageIds: ["img-tahoe-shore-muybridge", "img-tahoe-warm-springs"],
  },
  {
    key: "tahoe-settlement",
    label: "Tahoe City & later shore settlement",
    buzzwords: [
      "tahoe city",
      "embarcadero",
      "tahoe settlement",
      "shore cottages",
      "cottages",
    ],
    imageIds: ["img-tahoe-city", "img-tallac-hotel"],
  },
  {
    key: "emerald-bay",
    label: "Emerald Bay",
    buzzwords: ["emerald bay", "bay", "cascades", "island"],
    imageIds: ["img-emerald-bay"],
  },
  {
    key: "steamer-tourism",
    label: "Steamers, hotels & later tourism",
    buzzwords: [
      "steamer",
      "steamer tahoe",
      "hotel",
      "tallac",
      "cottages",
      "tourism",
      "postcard",
    ],
    imageIds: ["img-steamer-tahoe", "img-tallac-hotel"],
  },
  {
    key: "washoe",
    label: "Washoe people of the Tahoe basin",
    buzzwords: [
      "washoe",
      "washo",
      "native",
      "indigenous",
      "first peoples",
    ],
    imageIds: ["img-washoe-1866"],
  },
  {
    key: "roughing-it",
    label: "Roughing It era & younger Twain",
    buzzwords: [
      "roughing it",
      "1872",
      "memoir",
      "nevada territory",
      "younger",
      "brady",
    ],
    imageIds: ["img-twain-brady-1871", "img-portrait"],
  },
  {
    key: "wildfire",
    label: "Wildfire & camp mishap (use shore/timber atmosphere)",
    buzzwords: [
      "wildfire",
      "fire",
      "campfire",
      "burned",
      "galloping",
      "frying-pan",
      "needles",
    ],
    imageIds: ["img-tahoe-shore-muybridge", "img-tahoe-warm-springs"],
  },
];
