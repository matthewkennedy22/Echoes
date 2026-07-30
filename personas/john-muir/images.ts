import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";

/**
 * SERVER-ONLY image library for John Muir (Sierra Nevada / Yosemite focus).
 */
export const muirImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/john-muir.jpg",
    caption:
      "John Muir photographed about 1912 — near the year from which I speak: an old mountaineer recalling a lifetime in the Sierra.",
    alt: "Studio portrait of elderly John Muir with full white beard",
    topics: [
      "john muir",
      "portrait",
      "appearance",
      "biography",
      "yourself",
      "identity",
    ],
    dateRange: "c. 1912",
    citation:
      "John Muir portrait (c. 1912). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:John_Muir_1912.jpg",
    license: "Public domain",
  },
  {
    id: "img-muir-c1902",
    src: commonsFileUrl("John Muir c1902.jpg"),
    caption:
      "John Muir about 1902 — a few years before my camping trip with President Roosevelt, already long known as Yosemite's interpreter.",
    alt: "Portrait of John Muir circa 1902",
    topics: [
      "john muir",
      "portrait",
      "1902",
      "younger",
      "biography",
    ],
    dateRange: "c. 1902",
    citation:
      "John Muir c. 1902. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:John_Muir_c1902.jpg",
    license: "Public domain",
  },
  {
    id: "img-yosemite-valley",
    src: commonsFileUrl(
      "Carleton Watkins, Yosemite Valley, California, ca. 1865.jpg"
    ),
    caption:
      "Yosemite Valley about 1865 by Carleton Watkins — the glacial temple of granite and waterfall I entered soon after reaching California.",
    alt: "Carleton Watkins photograph of Yosemite Valley circa 1865",
    topics: [
      "yosemite",
      "yosemite valley",
      "valley",
      "view",
      "landscape",
      "first saw",
      "description",
    ],
    dateRange: "c. 1865",
    citation:
      "Carleton Watkins, Yosemite Valley, California, ca. 1865. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Carleton_Watkins,_Yosemite_Valley,_California,_ca._1865.jpg",
    license: "Public domain",
  },
  {
    id: "img-el-capitan",
    src: commonsFileUrl("El Capitan, Yosemite.jpg"),
    caption:
      "El Capitan — the great granite sentinel at the valley's mouth, a wall of ice-carved stone.",
    alt: "Photograph of El Capitan in Yosemite",
    topics: [
      "el capitan",
      "granite",
      "yosemite valley",
      "cliff",
      "landmarks",
    ],
    dateRange: "historic / public-domain photograph",
    citation:
      "El Capitan, Yosemite. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:El_Capitan,_Yosemite.jpg",
    license: "Public domain",
  },
  {
    id: "img-half-dome",
    src: commonsFileUrl("Half Dome, Yosemite.jpg"),
    caption:
      "Half Dome — the shattered crest that watches the upper valley, emblem of Yosemite's glacial sculpture.",
    alt: "Photograph of Half Dome in Yosemite",
    topics: [
      "half dome",
      "granite",
      "yosemite valley",
      "dome",
      "landmarks",
    ],
    dateRange: "historic / public-domain photograph",
    citation:
      "Half Dome, Yosemite. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Half_Dome,_Yosemite.jpg",
    license: "Public domain",
  },
  {
    id: "img-bridalveil",
    src: commonsFileUrl(
      "Carleton Watkins (American - Pohono, or the Bridal Veil, 900 feet, Mariposa County, Cal. - Google Art Project.jpg"
    ),
    caption:
      "Pohono — Bridalveil Fall — Watkins's nineteenth-century view of the white veil opposite El Capitan's mass.",
    alt: "Carleton Watkins photograph of Bridalveil Fall (Pohono)",
    topics: [
      "bridalveil",
      "pohono",
      "waterfall",
      "yosemite valley",
      "watkins",
    ],
    dateRange: "c. 1860s",
    citation:
      "Carleton Watkins, Pohono, or the Bridal Veil. Wikimedia Commons / Google Art Project. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Carleton_Watkins_(American_-_Pohono,_or_the_Bridal_Veil,_900_feet,_Mariposa_County,_Cal._-_Google_Art_Project.jpg",
    license: "Public domain",
  },
  {
    id: "img-yosemite-falls",
    src: commonsFileUrl(
      "The Yosemite Falls, 2634ft, by Watkins, Carleton E., 1829-1916.jpg"
    ),
    caption:
      "Yosemite Falls by Carleton Watkins — the great leap of water that thunders in snowmelt season down the north wall.",
    alt: "Carleton Watkins photograph of Yosemite Falls",
    topics: [
      "yosemite falls",
      "waterfall",
      "yosemite valley",
      "watkins",
      "snowmelt",
    ],
    dateRange: "c. 1860s–1870s",
    citation:
      "Carleton E. Watkins, The Yosemite Falls, 2634 ft. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:The_Yosemite_Falls,_2634ft,_by_Watkins,_Carleton_E.,_1829-1916.jpg",
    license: "Public domain",
  },
  {
    id: "img-grizzly-giant",
    src: commonsFileUrl(
      "Carleton E. Watkins, Grizzly Giant, Mariposa Grove, 1861, NGA 92377.jpg"
    ),
    caption:
      "The Grizzly Giant, Mariposa Grove, 1861 — Watkins among the sequoias I later defended as living monuments, not mere lumber.",
    alt: "Carleton Watkins 1861 photograph of the Grizzly Giant sequoia",
    topics: [
      "sequoia",
      "grizzly giant",
      "mariposa grove",
      "forest",
      "trees",
      "watkins",
    ],
    dateRange: "1861",
    citation:
      "Carleton E. Watkins, Grizzly Giant, Mariposa Grove, 1861 (NGA). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Carleton_E._Watkins,_Grizzly_Giant,_Mariposa_Grove,_1861,_NGA_92377.jpg",
    license: "Public domain",
  },
  {
    id: "img-roosevelt-muir",
    src: commonsFileUrl(
      "Theodore Roosevelt and John Muir on Glacier Point, Yosemite Valley, California, in 1903 LCCN93503130.jpg"
    ),
    caption:
      "President Theodore Roosevelt and I at Glacier Point, Yosemite, 1903 — a camping council above the valley that helped the cause of parks and forests.",
    alt: "Theodore Roosevelt and John Muir at Glacier Point in 1903",
    topics: [
      "roosevelt",
      "theodore roosevelt",
      "1903",
      "glacier point",
      "camping",
      "yosemite",
    ],
    dateRange: "1903",
    citation:
      "Theodore Roosevelt and John Muir on Glacier Point, 1903 (Library of Congress). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Theodore_Roosevelt_and_John_Muir_on_Glacier_Point,_Yosemite_Valley,_California,_in_1903_LCCN93503130.jpg",
    license: "Public domain",
  },
  {
    id: "img-hetch-hetchy",
    src: commonsFileUrl("Hetch Hetchy Valley.jpg"),
    caption:
      "Hetch Hetchy Valley — the Tuolumne counterpart to Yosemite that San Francisco would dam; in 1912 I am still fighting to keep it wild.",
    alt: "Photograph of Hetch Hetchy Valley",
    topics: [
      "hetch hetchy",
      "tuolumne",
      "dam",
      "conservation",
      "valley",
      "yosemite",
    ],
    dateRange: "historic photograph",
    citation:
      "Hetch Hetchy Valley. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Hetch_Hetchy_Valley.jpg",
    license: "Public domain",
  },
  {
    id: "img-mariposa-trail",
    src: commonsFileUrl(
      "The Yosemite Valley From The Mariposa Trail Yosemite California by Carleton Watkins.jpg"
    ),
    caption:
      "Yosemite Valley from the Mariposa Trail — Watkins's view of the approach many travelers used before automobile roads.",
    alt: "Carleton Watkins view of Yosemite Valley from the Mariposa Trail",
    topics: [
      "mariposa",
      "trail",
      "approach",
      "yosemite valley",
      "travel",
      "watkins",
    ],
    dateRange: "c. 1860s",
    citation:
      "Carleton Watkins, The Yosemite Valley From The Mariposa Trail. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:The_Yosemite_Valley_From_The_Mariposa_Trail_Yosemite_California_by_Carleton_Watkins.jpg",
    license: "Public domain",
  },
];
