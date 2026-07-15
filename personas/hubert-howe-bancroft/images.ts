import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";

/**
 * SERVER-ONLY image library for Hubert Howe Bancroft.
 *
 * Images use stable Wikimedia Commons Special:FilePath URLs (public domain /
 * Commons-hosted historic photographs). Avoid 1906 earthquake imagery as
 * firsthand for the 1905 speaking year.
 */


export const bancroftImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/hubert-howe-bancroft.jpg",
    caption:
      "Hubert Howe Bancroft (1832–1918), San Francisco publisher, collector, and historian of the Pacific States.",
    alt: "Portrait photograph of Hubert Howe Bancroft",
    topics: [
      "hubert howe bancroft",
      "portrait",
      "appearance",
      "biography",
      "yourself",
      "who are you",
    ],
    dateRange: "c. late 19th century",
    citation: "Hubert Howe Bancroft. Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Hubert_Howe_Bancroft.jpg",
    license: "Public domain",
  },
  {
    id: "img-mission-dolores-1856",
    src: commonsFileUrl("Mission_of_Los_Dolores._1856.jpg"),
    caption:
      "Mission of Los Dolores (Mission San Francisco de Asís), 1856 — the old adobe mission church in the early American years of San Francisco.",
    alt: "1856 view of Mission Dolores in San Francisco",
    topics: [
      "mission dolores",
      "mission san francisco",
      "mission",
      "spanish era",
      "adobe",
      "church",
      "san francisco",
    ],
    dateRange: "1856",
    citation:
      "Mission of Los Dolores, 1856. Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Mission_of_Los_Dolores._1856.jpg",
    license: "Public domain",
  },
  {
    id: "img-mission-dolores",
    src: commonsFileUrl("San_Francisco_Mission_Dolores.jpg"),
    caption:
      "Mission Dolores (Mission San Francisco de Asís) — San Francisco's oldest surviving structure, beside the later parish church at 16th and Dolores.",
    alt: "Mission Dolores church exterior in San Francisco",
    topics: [
      "mission dolores",
      "mission san francisco",
      "mission",
      "church",
      "san francisco",
      "dolores street",
    ],
    dateRange: "modern photograph of historic mission",
    citation:
      "San Francisco Mission Dolores. Wikimedia Commons (Ad Meskens).",
    url: "https://commons.wikimedia.org/wiki/File:San_Francisco_Mission_Dolores.jpg",
    license: "CC BY-SA / see Commons file page",
  },
  {
    id: "img-sf-1890",
    src: commonsFileUrl("San_Francisco_1890.jpg"),
    caption:
      "San Francisco, 1890 — a map-view of our Pacific metropolis in the decade when my Works on California were rolling from the press.",
    alt: "1890 map of San Francisco",
    topics: [
      "san francisco",
      "map",
      "city",
      "1890",
      "metropolis",
      "pacific coast",
    ],
    dateRange: "1890",
    citation:
      "San Francisco 1890 (McAfee, Baldwin & Hammond). Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:San_Francisco_1890.jpg",
    license: "Public domain",
  },
  {
    id: "img-golden-gate-1900",
    src: commonsFileUrl(
      "Entrance_to_Golden_Gate_and_Angel_Island_(before_the_bridge),_San_Francisco,_ca.1900_(CHS-3943).jpg"
    ),
    caption:
      "Entrance to the Golden Gate and Angel Island, about 1900 — the open strait before any bridge, as ferry passengers knew it in my day.",
    alt: "Golden Gate strait and Angel Island about 1900, before the bridge",
    topics: [
      "golden gate",
      "angel island",
      "san francisco bay",
      "harbor",
      "ferry",
      "strait",
      "bay",
    ],
    dateRange: "c. 1900",
    citation:
      "Entrance to Golden Gate and Angel Island (before the bridge), San Francisco, ca.1900 (CHS-3943). California Historical Society / Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Entrance_to_Golden_Gate_and_Angel_Island_(before_the_bridge),_San_Francisco,_ca.1900_(CHS-3943).jpg",
    license: "Public domain",
  },
  {
    id: "img-golden-gate-telegraph-hill",
    src: commonsFileUrl(
      "The_Golden_Gate_and_Mount_Tamalpais_from_Telegraph_Hill,_San_Francisco_Bay_Area,_California,_1900.jpg"
    ),
    caption:
      "The Golden Gate and Mount Tamalpais from Telegraph Hill, 1900 — looking out across the Bay Area from San Francisco's heights.",
    alt: "View of Golden Gate and Mount Tamalpais from Telegraph Hill, 1900",
    topics: [
      "golden gate",
      "telegraph hill",
      "mount tamalpais",
      "san francisco",
      "bay",
      "view",
      "panorama",
    ],
    dateRange: "1900",
    citation:
      "The Golden Gate and Mount Tamalpais from Telegraph Hill, 1900. Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:The_Golden_Gate_and_Mount_Tamalpais_from_Telegraph_Hill,_San_Francisco_Bay_Area,_California,_1900.jpg",
    license: "Public domain",
  },
  {
    id: "img-bancroft-ranch",
    src: commonsFileUrl(
      "Bancroft_House,_9050_Memory_Lane,_Spring_Valley_(San_Diego_County,_California).jpg"
    ),
    caption:
      "The Bancroft Ranch House at Spring Valley, San Diego County — the adobe country place I purchased in 1885 as a retreat from the city.",
    alt: "Historic Bancroft adobe ranch house in Spring Valley, California",
    topics: [
      "spring valley",
      "ranch",
      "adobe",
      "bancroft ranch",
      "san diego county",
      "country home",
    ],
    dateRange: "historic structure (modern photo)",
    citation:
      "Bancroft House, Spring Valley (San Diego County). Wikimedia Commons / HABS.",
    url: "https://commons.wikimedia.org/wiki/File:Bancroft_House,_9050_Memory_Lane,_Spring_Valley_(San_Diego_County,_California).jpg",
    license: "Public domain (HABS)",
  },
];
