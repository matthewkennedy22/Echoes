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
    id: "img-cha-mansion-1910",
    src: "/images/john-d-spreckels/spreckels-home-1910.jpg",
    caption:
      "My house on Glorietta Bay, 1910 — two years before I speak with you. Italian Renaissance lines, palms, and the drive. Courtesy of the Coronado Historical Association Collection.",
    alt: "Spreckels home on Glorietta Boulevard, 1910",
    topics: [
      "mansion",
      "glorietta",
      "glorietta bay",
      "home",
      "residence",
      "coronado",
    ],
    dateRange: "1910",
    citation:
      "Spreckels Home 1910, catalog 1900.09.01-114. Courtesy of the Coronado Historical Association Collection.",
    url: "https://coronadohistory.pastperfectonline.com/photo/6E408E83-F587-4E1F-9D9A-487132719351",
    license: "Courtesy of the Coronado Historical Association Collection",
  },
  {
    id: "img-cha-ferry-landing",
    src: "/images/john-d-spreckels/ferry-landing-orange.jpg",
    caption:
      "The foot of Orange Avenue toward the ferry landing — Oxford Hotel, the harbor, and a tall ship. Courtesy of the Coronado Historical Association Collection.",
    alt: "Coronado ferry landing at the foot of Orange Avenue",
    topics: [
      "ferry",
      "orange avenue",
      "landing",
      "harbor",
      "coronado",
    ],
    dateRange: "late 19th / early 20th century",
    citation:
      "Coronado ferry landing at the foot of Orange Avenue, catalog 1900.11.01-81. Courtesy of the Coronado Historical Association Collection.",
    url: "https://coronadohistory.pastperfectonline.com/photo/D68A5337-6CB8-4281-ACD7-108269121865",
    license: "Courtesy of the Coronado Historical Association Collection",
  },
  {
    id: "img-cha-tent-city-ferry-1901",
    src: "/images/john-d-spreckels/tent-city-ferry-silvergate-1901.jpg",
    caption:
      "Tent City in 1901, with the ferry Silver Gate at the landing and the Hotel del Coronado beyond the tents. Courtesy of the Coronado Historical Association Collection.",
    alt: "Tent City, the ferry Silver Gate, and Hotel del Coronado, 1901",
    topics: [
      "tent city",
      "ferry",
      "silver gate",
      "hotel del coronado",
      "strand",
      "coronado",
    ],
    dateRange: "1901",
    citation:
      "Tent City showing the ferry Silver Gate, 1901, catalog 1900.37.02-68A. Courtesy of the Coronado Historical Association Collection.",
    url: "https://coronadohistory.pastperfectonline.com/photo/381C4083-7FA4-4495-B84C-681466110270",
    license: "Courtesy of the Coronado Historical Association Collection",
  },
  {
    id: "img-cha-tent-city-promenade",
    src: "/images/john-d-spreckels/tent-city-promenade.jpg",
    caption:
      "The Tent City boardwalk and beach — visitors in street clothes along the railing, thatched roofs at the left. Courtesy of the Coronado Historical Association Collection.",
    alt: "Promenade on the Tent City boardwalk at Coronado Beach",
    topics: [
      "tent city",
      "boardwalk",
      "promenade",
      "beach",
      "strand",
      "coronado",
    ],
    dateRange: "c. early 1900s",
    citation:
      "Coronado Tent City boardwalk promenade, catalog 1900.19.03-02. Courtesy of the Coronado Historical Association Collection.",
    url: "https://coronadohistory.pastperfectonline.com/photo/3917CB42-4C1B-46CB-BE25-998625463538",
    license: "Courtesy of the Coronado Historical Association Collection",
  },
  {
    id: "img-hotel-del",
    src: commonsFileUrl("Hotel_Del_c1900b.jpg"),
    caption:
      "Hotel del Coronado, about 1900 — the great Victorian resort on Coronado Beach that I came to own through the Coronado Beach Company.",
    alt: "Hotel del Coronado photochrom, circa 1900",
    topics: [
      "hotel del coronado",
      "the del",
      "hotel",
      "coronado",
      "resort",
      "victorian",
    ],
    dateRange: "c. 1900",
    citation:
      "Hotel del Coronado, Coronado Beach, California, c. 1900 (Detroit Publishing / William Henry Jackson). Public domain via Wikimedia Commons / Library of Congress.",
    url: "https://commons.wikimedia.org/wiki/File:Hotel_Del_c1900b.jpg",
    license: "Public domain",
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
    id: "img-hotel-del-beach",
    src: commonsFileUrl("Hotel-Del-Coronado-Beach-cropped.jpg"),
    caption:
      "Hotel del Coronado from the beach, about 1900 — red roofs and turrets as visitors knew the Del in my day.",
    alt: "Hotel del Coronado from the beach, circa 1900",
    topics: [
      "hotel del coronado",
      "the del",
      "beach",
      "ocean",
      "coronado beach",
      "resort",
    ],
    dateRange: "c. 1900",
    citation:
      "Hotel del Coronado, Coronado Beach, California, c. 1900. Public domain via Wikimedia Commons / Library of Congress.",
    url: "https://commons.wikimedia.org/wiki/File:Hotel-Del-Coronado-Beach-cropped.jpg",
    license: "Public domain",
  },
];
