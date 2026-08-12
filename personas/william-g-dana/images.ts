import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";

/**
 * SERVER-ONLY image library for Capt. William G. Dana.
 * Portrait is the likeness published on the Dana Adobe family page.
 */

export const williamGDanaImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/william-g-dana.jpg",
    caption:
      "Captain William Goodwin Dana — the portrait published by Dana Adobe. Gray wavy hair, muttonchop whiskers, dark coat and bow tie.",
    alt: "Historical oval portrait of Captain William Goodwin Dana",
    topics: [
      "portrait",
      "likeness",
      "identity",
      "yourself",
      "biography",
      "appearance",
    ],
    dateRange: "mid-19th century",
    citation:
      "Portrait of Captain William Goodwin Dana, published by Dana Adobe on the Dana Family page.",
    url: "https://www.danaadobe.org/family/",
    license: "Used from Dana Adobe (partner site)",
  },
  {
    id: "img-adobe-1900",
    src: "/images/william-g-dana/dana-adobe-ca1900.jpg",
    caption:
      "The Nipomo adobe about 1900 — decades after my day. A later photograph of the house, not of 1850.",
    alt: "Historic photograph of the Dana Adobe at Nipomo, about 1900",
    topics: ["adobe", "house", "nipomo", "casa de dana"],
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
      "The Dana Adobe as restored in 2012 — a later view of the house I built of thirteen rooms after we moved to Nipomo in 1839. Not a picture from 1850.",
    alt: "Color photograph of the restored Dana Adobe exterior, 2012",
    topics: [
      "adobe",
      "dana adobe",
      "nipomo",
      "house",
      "casa de dana",
      "restoration",
    ],
    dateRange: "2012",
    citation:
      "Ken Figlioli, restored Dana Adobe during Heritage fiesta, 28 July 2012. Wikimedia Commons. CC BY-SA 2.0.",
    url: "https://commons.wikimedia.org/wiki/File:Rancho_Nipomo_Dana_Adobe_(7816869126).jpg",
    license: "CC BY-SA 2.0",
  },
  {
    id: "img-adobe-salon",
    src: commonsFileUrl("Dana_Adobe,_main_salon.jpg"),
    caption:
      "The main salon of the adobe as restored in 2012 — later furniture and finish, but the room of a house meant for family and travelers.",
    alt: "Interior of the restored Dana Adobe main salon, 2012",
    topics: [
      "salon",
      "interior",
      "parlor",
      "hospitality",
      "rooms",
      "thirteen rooms",
    ],
    dateRange: "2012",
    citation:
      "Ken Figlioli, Dana Adobe main salon, 28 July 2012. Wikimedia Commons. CC BY-SA 2.0.",
    url: "https://commons.wikimedia.org/wiki/File:Dana_Adobe,_main_salon.jpg",
    license: "CC BY-SA 2.0",
  },
  {
    id: "img-adobe-side",
    src: commonsFileUrl("Dana_ad.png"),
    caption:
      "A later photograph of the Dana Adobe at the south end of Oak Glen Avenue, Nipomo — the house on its rise above the valley.",
    alt: "Photograph of the Dana Adobe, Nipomo",
    topics: ["adobe", "nipomo", "oak glen", "house", "rancho"],
    dateRange: "2014",
    citation:
      "Janaisy88, Dana Adobe, Nipomo, 30 September 2014. Wikimedia Commons. CC BY-SA 3.0.",
    url: "https://commons.wikimedia.org/wiki/File:Dana_ad.png",
    license: "CC BY-SA 3.0",
  },
  {
    id: "img-mission-slo-front",
    src: "/images/myron-angel/mission-front-1880.jpg",
    caption:
      "Mission San Luis Obispo de Tolosa, about 1875–1880 — the mission north of us on El Camino Real, photographed a generation after 1850.",
    alt: "Historic photograph of the front of Mission San Luis Obispo de Tolosa",
    topics: [
      "mission",
      "san luis obispo",
      "el camino real",
      "mission san luis obispo",
      "tolosa",
    ],
    dateRange: "c. 1875–1880",
    citation:
      "“Main front of Mission San Luis Obispo de Tolosa, ca.1875-1880,” California Historical Society Collection. Courtesy of USC Libraries and the California Historical Society. Public domain (CC BY).",
    url: "https://calisphere.org/item/493b6fd44d59b64b5ce74126ac405efb/",
    license: "Public domain (CC BY)",
  },
  {
    id: "img-mission-slo-south",
    src: "/images/myron-angel/mission-south-1888.jpg",
    caption:
      "The south wing of Mission San Luis Obispo, 1888 — later than my speaking year, still the old adobe church on the road north.",
    alt: "1888 photograph of Mission San Luis Obispo south wing",
    topics: [
      "mission",
      "san luis obispo",
      "adobe church",
      "el camino real",
    ],
    dateRange: "1888",
    citation:
      "California Historical Society Collection, via USC Libraries. Public domain (CC BY).",
    url: "https://calisphere.org/item/4c803e2c3db4e05bcfadb0ec84766c44/",
    license: "Public domain (CC BY)",
  },
  {
    id: "img-mission-sb",
    src: commonsFileUrl("Mission_Santa_Barbara_by_Carleton_Watkins,_1876.jpg"),
    caption:
      "Mission Santa Barbara in 1876 — the church of the town where I kept a store and married María Josefa in 1828. Watkins made this view long after those years.",
    alt: "Carleton Watkins photograph of Mission Santa Barbara, 1876",
    topics: [
      "mission santa barbara",
      "santa barbara",
      "marriage",
      "presidio",
      "carrillo",
    ],
    dateRange: "1876",
    citation:
      "Carleton Watkins, Mission Santa Barbara (1876). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Mission_Santa_Barbara_by_Carleton_Watkins,_1876.jpg",
    license: "Public domain",
  },
  {
    id: "img-vaqueros",
    src: commonsFileUrl("California_Vaqueros,_1854.jpg"),
    caption:
      "“California Vaqueros, Returned from the Chase” (1854) — Californio horsemen of the rancho years, close to my speaking year, though not a picture of Nipomo itself.",
    alt: "1854 engraving of California vaqueros",
    topics: [
      "vaquero",
      "rancho",
      "cattle",
      "horses",
      "californio",
      "hide",
      "tallow",
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
      "A Chumash tomol (plank canoe) as painted by Henry Sandham after Fernando Librado — the seagoing craft of this coast's first people, not a photograph of the Nipomo village.",
    alt: "Painting of a Chumash tomol plank canoe",
    topics: ["chumash", "tomol", "canoe", "indigenous", "coast"],
    dateRange: "historic illustration",
    citation:
      "Chumash tomol illustration in the public image library used by ECHOES (Myron Angel pack). Period / public-domain illustration.",
    license: "Public domain / partner image library",
  },
  {
    id: "img-chumash-cave",
    src: "/images/myron-angel/chumash-painted-cave.jpg",
    caption:
      "Chumash pictographs at Painted Cave in the Santa Barbara hinterland — related Chumash people, not a picture of the Nipomo village itself.",
    alt: "Chumash pictographs at Painted Cave",
    topics: [
      "chumash",
      "pictograph",
      "painted cave",
      "rock art",
      "indigenous",
    ],
    dateRange: "historic / public domain view",
    citation:
      "Chumash Painted Cave. Public-domain / Commons image in the ECHOES SLO library.",
    license: "Public domain / Commons",
  },
];
