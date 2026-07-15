import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";

/**
 * SERVER-ONLY image library for Jesse D. Mason.
 * Remote assets use Wikimedia Commons Special:FilePath URLs.
 */
export const masonImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/jesse-d-mason.jpg",
    caption:
      "An artist's impression of Jesse D. Mason in the style of an 1880s studio photograph. No verified photograph of Mason survives, so this is an illustrative likeness — not an authentic historical image.",
    alt: "Illustrative sepia-toned portrait of a bearded 19th-century gentleman representing Jesse D. Mason",
    topics: [
      "portrait",
      "likeness",
      "identity",
      "yourself",
      "biography",
    ],
    dateRange: "modern illustration (1880s style)",
    citation:
      "Illustrative likeness created for ECHOES; no verified photograph of Jesse D. Mason survives.",
    license: "ECHOES illustration",
  },
  {
    id: "img-mission-watkins-1876",
    src: commonsFileUrl("Mission_Santa_Barbara_by_Carleton_Watkins,_1876.jpg"),
    caption:
      "Mission Santa Barbara in 1876 — the twin-towered church that earned the name Queen of the Missions, much as it stood when I compiled the county history.",
    alt: "Historic photograph of Mission Santa Barbara by Carleton Watkins, 1876",
    topics: [
      "mission",
      "mission santa barbara",
      "queen of the missions",
      "church",
      "facade",
      "franciscan",
      "1786",
    ],
    dateRange: "1876",
    citation:
      "Carleton Watkins, Mission Santa Barbara (1876). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Mission_Santa_Barbara_by_Carleton_Watkins,_1876.jpg",
    license: "Public domain",
  },
  {
    id: "img-mission-facade",
    src: commonsFileUrl("Mission_Santa_Barbara.jpg"),
    caption:
      "The classical facade of Mission Santa Barbara — the stone church completed after the 1812 earthquake, pride of our coast.",
    alt: "Photograph of Mission Santa Barbara church facade and towers",
    topics: [
      "mission",
      "mission santa barbara",
      "facade",
      "towers",
      "church",
      "architecture",
      "spanish era",
    ],
    dateRange: "historic / public domain view",
    citation: "Mission Santa Barbara. Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Mission_Santa_Barbara.jpg",
    license: "Public domain / Commons",
  },
  {
    id: "img-mission-chapel",
    src: commonsFileUrl("Mission_Santa_Barbara01.jpg"),
    caption:
      "Mission Santa Barbara — the chapel front and arcaded convento that have stood under Franciscan care since the Spanish era.",
    alt: "View of Mission Santa Barbara chapel and arcade",
    topics: [
      "mission",
      "mission santa barbara",
      "chapel",
      "arcade",
      "convento",
      "franciscan",
    ],
    dateRange: "historic view",
    citation: "Mission Santa Barbara. Wikimedia Commons (File:Mission_Santa_Barbara01.jpg).",
    url: "https://commons.wikimedia.org/wiki/File:Mission_Santa_Barbara01.jpg",
    license: "CC / Commons as labeled",
  },
  {
    id: "img-mission-bell-1904",
    src: commonsFileUrl("Mission_Santa_Barbara_bell,_1904_(CHS-1562).jpg"),
    caption:
      "A mission bell at Santa Barbara, photographed in 1904 — a slightly later view than my speaking year, but the same bells that marked the hours for Franciscans and the town.",
    alt: "1904 close-up photograph of a Mission Santa Barbara bell",
    topics: ["mission", "bell", "bells", "mission santa barbara", "franciscan"],
    dateRange: "1904",
    citation:
      "Mission Santa Barbara bell, 1904 (CHS-1562). California Historical Society / Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Mission_Santa_Barbara_bell,_1904_(CHS-1562).jpg",
    license: "Public domain",
  },
  {
    id: "img-franciscans-1904",
    src: commonsFileUrl("Group_portrait_of_about_30_Franciscan_monks_outside_at_Mission_Santa_Barbara,_California,_1904_(CHS-4073).jpg"),
    caption:
      "Franciscan friars gathered at Mission Santa Barbara, 1904 — the order that never fully abandoned this house, unlike so many sister missions.",
    alt: "1904 group portrait of Franciscan monks outside Mission Santa Barbara",
    topics: [
      "mission",
      "franciscan",
      "friars",
      "padres",
      "mission santa barbara",
      "monks",
    ],
    dateRange: "1904",
    citation:
      "Group portrait of Franciscan monks at Mission Santa Barbara, 1904 (CHS-4073). Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Group_portrait_of_about_30_Franciscan_monks_outside_at_Mission_Santa_Barbara,_California,_1904_(CHS-4073).jpg",
    license: "Public domain",
  },
  {
    id: "img-chumash-musicians-1873",
    src: commonsFileUrl("Chmash_musicians_1873.jpg"),
    caption:
      "Chumash musicians photographed in 1873 at Mission San Buenaventura — Native people of our Channel coast in the post-mission generation, holding their instruments.",
    alt: "1873 photograph of six seated Chumash men with musical instruments",
    topics: [
      "chumash",
      "native",
      "indigenous",
      "musicians",
      "mission san buenaventura",
      "ventura",
      "post-contact",
    ],
    dateRange: "1873",
    citation:
      "Chumash musicians at Mission San Buenaventura, 1873. Wikimedia Commons (File:Chmash_musicians_1873.jpg).",
    url: "https://commons.wikimedia.org/wiki/File:Chmash_musicians_1873.jpg",
    license: "Public domain",
  },
  {
    id: "img-chumash-painted-cave",
    src: commonsFileUrl("PaintedCaveArtCA.jpg"),
    caption:
      "Chumash pictographs at Painted Cave, Santa Barbara County — rock paintings of the Chumash spiritual tradition in the hills above our coast.",
    alt: "Photograph of Chumash pictograph rock paintings in Painted Cave",
    topics: [
      "chumash",
      "pictograph",
      "rock art",
      "painted cave",
      "native",
      "indigenous",
      "spiritual",
    ],
    dateRange: "pre-contact (photograph of surviving art)",
    citation:
      "Chumash pictographs, Chumash Painted Cave State Historic Park. Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:PaintedCaveArtCA.jpg",
    license: "Public domain",
  },
  {
    id: "img-vaqueros-1854",
    src: commonsFileUrl("California_Vaqueros,_1854.jpg"),
    caption:
      "“California Vaqueros, Returned from the Chase” (1854) — Californio horsemen of the rancho days that shaped Santa Barbara County before American farms filled the valleys.",
    alt: "1854 engraving of California vaqueros and families with horses",
    topics: [
      "vaquero",
      "vaqueros",
      "rancho",
      "californio",
      "mexican era",
      "cattle",
      "horsemen",
    ],
    dateRange: "1854",
    citation:
      "California Vaqueros, Returned from the Chase (1854). Bancroft Library / Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:California_Vaqueros,_1854.jpg",
    license: "Public domain",
  },
  {
    id: "img-fandango-1873",
    src: commonsFileUrl("The_Fandango.JPG"),
    caption:
      "“The Fandango” (1873) by Charles Nahl — a lively painting of rancho social life in the Mexican era: dancing, music, and feasting.",
    alt: "1873 painting The Fandango showing Californios dancing at a rancho fiesta",
    topics: [
      "fandango",
      "fiesta",
      "rancho",
      "californio",
      "dancing",
      "mexican era",
      "celebration",
    ],
    dateRange: "1873",
    citation:
      "Charles Christian Nahl, The Fandango (1873). Crocker Art Museum / Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:The_Fandango.JPG",
    license: "Public domain",
  },
  {
    id: "img-chumash-tomol-kihn",
    src: commonsFileUrl("Chumash_Canoes.jpg"),
    caption:
      "Artist reconstruction of Chumash plank tomols — the sewn redwood canoes that carried our coastal peoples to the Channel Islands. A later illustration, useful for understanding the craft described in the sources.",
    alt: "Illustration of Chumash plank-built tomol canoes with paddlers",
    topics: [
      "chumash",
      "tomol",
      "canoe",
      "channel islands",
      "plank canoe",
      "seafaring",
    ],
    dateRange: "artist reconstruction (1946)",
    citation:
      "W. Langdon Kihn, Chumash Canoes. Wikimedia Commons (File:Chumash_Canoes.jpg). Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Chumash_Canoes.jpg",
    license: "Public domain",
  },
];
