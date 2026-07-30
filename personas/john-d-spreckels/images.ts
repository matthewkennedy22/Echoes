import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";

/**
 * SERVER-ONLY image library for John D. Spreckels (Coronado).
 * Prefer public-domain / Commons files. Note post-1912 dates in captions.
 */

export const spreckelsImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/john-d-spreckels.jpg",
    caption:
      "John Diedrich Spreckels (1853–1926), about 1901 — Coronado’s principal builder: Hotel del Coronado, Tent City, and the bay ferry.",
    alt: "Portrait of John D. Spreckels, circa 1901",
    topics: [
      "john d spreckels",
      "portrait",
      "appearance",
      "biography",
      "yourself",
      "who are you",
    ],
    dateRange: "1901",
    citation:
      "John D. Spreckels, 1901. Public domain via Wikimedia Commons (JohnDSpreckelsB&W1901.jpg).",
    url: "https://commons.wikimedia.org/wiki/File:JohnDSpreckelsB%26W1901.jpg",
    license: "Public domain",
  },
  {
    id: "img-portrait-png",
    src: commonsFileUrl("John_D._Spreckels.png"),
    caption:
      "Another period likeness of John D. Spreckels — sugar heir, shipping man, and Coronado Beach Company owner.",
    alt: "Portrait of John D. Spreckels",
    topics: [
      "john d spreckels",
      "portrait",
      "biography",
      "yourself",
    ],
    dateRange: "early 20th century",
    citation:
      "John D. Spreckels.png. Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:John_D._Spreckels.png",
    license: "Public domain",
  },
  {
    id: "img-mansion-1915",
    src: commonsFileUrl("JohnSpreckelshomeCoronado1915.jpg"),
    caption:
      "Spreckels home on Glorietta Bay, Coronado, 1915 — a view a few years after my 1912 speaking year of the mansion across from the Hotel del Coronado.",
    alt: "John Spreckels home in Coronado, 1915",
    topics: [
      "mansion",
      "glorietta",
      "glorietta bay",
      "home",
      "coronado",
      "residence",
    ],
    dateRange: "1915 (post-1912)",
    citation:
      "John Spreckels home, Coronado, 1915. Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:JohnSpreckelshomeCoronado1915.jpg",
    license: "Public domain",
  },
  {
    id: "img-hotel-del",
    src: commonsFileUrl("CoronadoDelCoronadoHotel_CoronadoCalifornia.jpg"),
    caption:
      "Hotel del Coronado — the great Victorian resort on Coronado Beach that I came to own through the Coronado Beach Company.",
    alt: "Historic view of Hotel del Coronado",
    topics: [
      "hotel del coronado",
      "the del",
      "hotel",
      "coronado",
      "resort",
      "victorian",
    ],
    dateRange: "historic view",
    citation:
      "Hotel del Coronado, Coronado, California. Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:CoronadoDelCoronadoHotel_CoronadoCalifornia.jpg",
    license: "see Commons file page",
  },
  {
    id: "img-del-and-tent-city",
    src: commonsFileUrl("Coronado_Beach_CA_-_Tent_City_(NBY_432406).jpg"),
    caption:
      "Coronado Beach Tent City with the Hotel del Coronado beyond — grand hotel and summer tents sharing the Strand.",
    alt: "Coronado Beach Tent City with Hotel del Coronado",
    topics: [
      "hotel del coronado",
      "tent city",
      "strand",
      "coronado",
      "resort",
    ],
    dateRange: "c. early 20th century",
    citation:
      "Coronado Beach CA - Tent City (NBY 432406). Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Coronado_Beach_CA_-_Tent_City_(NBY_432406).jpg",
    license: "Public domain",
  },
  {
    id: "img-tent-city-promenade",
    src: commonsFileUrl("Double_deck_car_at_Coronado_Tent_City,_Cal.jpg"),
    caption:
      "Double-deck car at Coronado Tent City — summer transit among the tents and thatched cottages south of the Del.",
    alt: "Double-deck streetcar at Coronado Tent City",
    topics: [
      "tent city",
      "streetcar",
      "double deck",
      "summer",
      "coronado",
      "trolley",
    ],
    dateRange: "c. early 1900s",
    citation:
      "Double deck car at Coronado Tent City, Cal. Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Double_deck_car_at_Coronado_Tent_City,_Cal.jpg",
    license: "Public domain",
  },
  {
    id: "img-tent-city-rows",
    src: commonsFileUrl(
      "Coronado_Beach_CA_-_Children's_Bathing_Pool,_Tent_City_(NBY_431879).jpg"
    ),
    caption:
      "Children’s bathing pool at Tent City, Coronado Beach — family resort life on the Strand beside the Del.",
    alt: "Children's bathing pool at Coronado Tent City",
    topics: [
      "tent city",
      "tents",
      "cottages",
      "strand",
      "coronado beach",
      "bathing",
      "children",
    ],
    dateRange: "c. early 1900s",
    citation:
      "Coronado Beach CA - Children's Bathing Pool, Tent City (NBY 431879). Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Coronado_Beach_CA_-_Children%27s_Bathing_Pool,_Tent_City_(NBY_431879).jpg",
    license: "Public domain",
  },
  {
    id: "img-tent-city-postcard",
    src: commonsFileUrl("Tent_City,_Coronado_Beach_(NBY_2569).jpg"),
    caption:
      "Postcard view of Tent City, Coronado Beach — the affordable summer city I opened in 1900 beside the Hotel del Coronado.",
    alt: "Postcard of Tent City at Coronado Beach",
    topics: [
      "tent city",
      "postcard",
      "coronado beach",
      "summer resort",
    ],
    dateRange: "c. early 1900s",
    citation:
      "Tent City, Coronado Beach (NBY 2569). Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Tent_City,_Coronado_Beach_(NBY_2569).jpg",
    license: "Public domain",
  },
  {
    id: "img-tent-city-bathing",
    src: commonsFileUrl("Bathing_scene_coronado_tent_city_1923.jpg"),
    caption:
      "Bathing scene at Coronado Tent City, 1923 — a later summer view after my 1912 speaking year, still the Strand resort I founded in 1900.",
    alt: "Bathers at Coronado Tent City, 1923",
    topics: [
      "tent city",
      "bathing",
      "beach",
      "swimming",
      "strand",
    ],
    dateRange: "1923 (post-1912)",
    citation:
      "Bathing scene, Coronado Tent City, 1923. Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Bathing_scene_coronado_tent_city_1923.jpg",
    license: "Public domain",
  },
  {
    id: "img-del-ocean-plaza",
    src: commonsFileUrl("Ocean_facing_plaza,_Hotel_del_Coronado,_Coronado,_CA.jpg"),
    caption:
      "Ocean-facing plaza at the Hotel del Coronado — the resort’s seaside heart on Coronado Beach.",
    alt: "Ocean-facing plaza at Hotel del Coronado",
    topics: [
      "hotel del coronado",
      "plaza",
      "ocean",
      "the del",
      "beach",
    ],
    dateRange: "modern photo of historic hotel",
    citation:
      "Ocean facing plaza, Hotel del Coronado. Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Ocean_facing_plaza,_Hotel_del_Coronado,_Coronado,_CA.jpg",
    license: "see Commons file page",
  },
];
