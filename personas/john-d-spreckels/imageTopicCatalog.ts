/**
 * Topic → buzzword → image map for John D. Spreckels.
 */

import type { ImageTopic } from "@/personas/types";

export const SPRECKELS_IMAGE_TOPICS: ImageTopic[] = [
  {
    key: "identity",
    label: "John D. Spreckels — who he is",
    buzzwords: [
      "john d spreckels",
      "spreckels",
      "who are you",
      "introduce yourself",
      "forefather",
      "portrait",
      "likeness",
      "biography",
      "myself",
      "i am",
    ],
    imageIds: ["img-portrait", "img-portrait-png"],
  },
  {
    key: "hotel-del",
    label: "Hotel del Coronado",
    buzzwords: [
      "hotel del coronado",
      "the del",
      "del coronado",
      "hotel",
      "victorian resort",
      "babcock",
      "story",
    ],
    imageIds: ["img-hotel-del", "img-del-ocean-plaza", "img-del-and-tent-city"],
  },
  {
    key: "tent-city",
    label: "Coronado Tent City",
    buzzwords: [
      "tent city",
      "tents",
      "cottages",
      "strand",
      "silver strand",
      "summer resort",
      "camping",
      "thatched",
    ],
    imageIds: [
      "img-tent-city-rows",
      "img-tent-city-postcard",
      "img-tent-city-promenade",
      "img-del-and-tent-city",
      "img-tent-city-bathing",
    ],
  },
  {
    key: "mansion",
    label: "Glorietta Bay mansion",
    buzzwords: [
      "mansion",
      "glorietta",
      "glorietta bay",
      "home",
      "residence",
      "inn",
      "albright",
    ],
    imageIds: ["img-mansion-1915"],
  },
  {
    key: "ferry-transit",
    label: "Ferry & Tent City transit",
    buzzwords: [
      "ferry",
      "streetcar",
      "trolley",
      "double deck",
      "electric railway",
      "bay crossing",
    ],
    imageIds: ["img-tent-city-promenade"],
  },
];
