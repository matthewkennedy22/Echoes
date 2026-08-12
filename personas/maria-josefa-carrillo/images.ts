import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";

/**
 * SERVER-ONLY image library for María Josefa Carrillo de Dana.
 * Portrait is the likeness published on the Dana Adobe family page.
 */

export const mariaJosefaCarrilloImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/maria-josefa-carrillo.jpg",
    caption:
      "María Josefa Carrillo de Dana — the portrait published by Dana Adobe. Lace mantilla, white collar, hoop earring; a later photograph of her as an older woman.",
    alt: "Historical oval portrait of María Josefa Carrillo de Dana in a lace mantilla",
    topics: [
      "portrait",
      "likeness",
      "identity",
      "yourself",
      "biography",
      "appearance",
    ],
    dateRange: "later 19th century",
    citation:
      "Portrait of María Josefa Carrillo Dana, published by Dana Adobe on the Dana Family page.",
    url: "https://www.danaadobe.org/family/",
    license: "Used from Dana Adobe (partner site)",
  },
  {
    id: "img-adobe-salon",
    src: commonsFileUrl("Dana_Adobe,_main_salon.jpg"),
    caption:
      "The main salon of the Nipomo adobe as restored in 2012 — later furniture and finish, but the room of the house I kept.",
    alt: "Interior of the restored Dana Adobe main salon, 2012",
    topics: ["salon", "interior", "house", "adobe", "hospitality"],
    dateRange: "2012",
    citation:
      "Ken Figlioli, Dana Adobe main salon, 28 July 2012. Wikimedia Commons. CC BY-SA 2.0.",
    url: "https://commons.wikimedia.org/wiki/File:Dana_Adobe,_main_salon.jpg",
    license: "CC BY-SA 2.0",
  },
  {
    id: "img-adobe-1900",
    src: "/images/william-g-dana/dana-adobe-ca1900.jpg",
    caption:
      "The Nipomo adobe about 1900 — after my lifetime. Whitewashed walls and a wooden walk to the door; a later photograph of the house, not of 1855.",
    alt: "Historic photograph of the Dana Adobe at Nipomo, about 1900",
    topics: ["adobe", "nipomo", "house", "1900", "casa de dana"],
    dateRange: "c. 1900",
    citation:
      "“Exterior of Captain William G. Dana's Nipomo adobe… ca.1900,” California Historical Society Collection. Courtesy of USC Libraries and the California Historical Society. CC BY.",
    url: "https://calisphere.org/item/a7e83a900bdc6417596fd93649ca6e1c/",
    license: "CC BY (USC Libraries / California Historical Society)",
  },
  {
    id: "img-adobe-restored",
    src: commonsFileUrl("Rancho_Nipomo_Dana_Adobe_(7816869126).jpg"),
    caption:
      "The adobe as restored in 2012 — a later view of the thirteen-room house on its rise above the valley.",
    alt: "Color photograph of the restored Dana Adobe exterior, 2012",
    topics: ["adobe", "dana adobe", "nipomo", "restoration", "house"],
    dateRange: "2012",
    citation:
      "Ken Figlioli, restored Dana Adobe, 28 July 2012. Wikimedia Commons. CC BY-SA 2.0.",
    url: "https://commons.wikimedia.org/wiki/File:Rancho_Nipomo_Dana_Adobe_(7816869126).jpg",
    license: "CC BY-SA 2.0",
  },
  {
    id: "img-mission-sb",
    src: commonsFileUrl("Mission_Santa_Barbara_by_Carleton_Watkins,_1876.jpg"),
    caption:
      "Mission Santa Barbara in 1876 — the mission of the town where I was born and married. Watkins made this view long after my girlhood.",
    alt: "Carleton Watkins photograph of Mission Santa Barbara, 1876",
    topics: [
      "mission santa barbara",
      "santa barbara",
      "birth",
      "marriage",
      "carrillo",
      "presidio",
    ],
    dateRange: "1876",
    citation:
      "Carleton Watkins, Mission Santa Barbara (1876). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Mission_Santa_Barbara_by_Carleton_Watkins,_1876.jpg",
    license: "Public domain",
  },
  {
    id: "img-mission-slo-front",
    src: "/images/myron-angel/mission-front-1880.jpg",
    caption:
      "Mission San Luis Obispo de Tolosa, about 1875–1880 — the mission north of us on El Camino Real, photographed after my speaking year.",
    alt: "Historic photograph of Mission San Luis Obispo de Tolosa",
    topics: [
      "mission",
      "san luis obispo",
      "el camino real",
      "tolosa",
    ],
    dateRange: "c. 1875–1880",
    citation:
      "California Historical Society Collection, via USC Libraries. Public domain (CC BY).",
    license: "Public domain (CC BY)",
  },
  {
    id: "img-vaqueros",
    src: commonsFileUrl("California_Vaqueros,_1854.jpg"),
    caption:
      "“California Vaqueros, Returned from the Chase” (1854) — horsemen and families of the rancho years, close to 1855, though not a picture of our own vaqueros at Nipomo.",
    alt: "1854 engraving of California vaqueros",
    topics: [
      "vaquero",
      "rancho",
      "cattle",
      "californio",
      "horses",
    ],
    dateRange: "1854",
    citation:
      "“California Vaqueros, Returned from the Chase” (1854). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:California_Vaqueros,_1854.jpg",
    license: "Public domain",
  },
  {
    id: "img-chumash-tomol",
    src: "/images/myron-angel/chumash-tomol-kihn.jpg",
    caption:
      "A Chumash tomol — the plank canoe of this coast's first people. Nipomo was a Chumash place-name; this is not a picture of the Nipomo village.",
    alt: "Painting of a Chumash tomol plank canoe",
    topics: ["chumash", "tomol", "indigenous", "nipomo"],
    dateRange: "historic illustration",
    citation:
      "Chumash tomol illustration in the ECHOES SLO image library. Period / public-domain illustration.",
    license: "Public domain / partner image library",
  },
  {
    id: "img-chumash-cave",
    src: "/images/myron-angel/chumash-painted-cave.jpg",
    caption:
      "Chumash pictographs at Painted Cave, in the Santa Barbara hinterland of my family's coast — related people, not the Nipomo village itself.",
    alt: "Chumash pictographs at Painted Cave",
    topics: ["chumash", "pictograph", "painted cave", "santa barbara"],
    dateRange: "historic / public domain view",
    citation:
      "Chumash Painted Cave. Public-domain / Commons image in the ECHOES SLO library.",
    license: "Public domain / Commons",
  },
];
