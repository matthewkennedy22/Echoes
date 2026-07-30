import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";

/**
 * SERVER-ONLY image library for Alonzo Horton.
 *
 * Images use stable Wikimedia Commons Special:FilePath URLs. Captions note
 * when a view post-dates the 1905 speaking year.
 */


export const hortonImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/alonzo-horton.jpg",
    caption:
      "Alonzo Erastus Horton (1813–1909), Father of New San Diego — developer of Horton's Addition on the bay.",
    alt: "Portrait of Alonzo Horton",
    topics: [
      "alonzo horton",
      "portrait",
      "appearance",
      "biography",
      "yourself",
      "who are you",
    ],
    dateRange: "c. 1867",
    citation: "Alonzo Horton. Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Alonzo_Horton.jpg",
    license: "Public domain",
  },
  {
    id: "img-portrait-engraving",
    src: commonsFileUrl("HORTON,_Alonzo_Erastus_(1813-1909).jpg"),
    caption:
      "Engraved likeness of Alonzo Erastus Horton (1813–1909), founder of modern San Diego.",
    alt: "Engraved portrait of Alonzo Erastus Horton",
    topics: [
      "alonzo horton",
      "portrait",
      "engraving",
      "biography",
      "yourself",
    ],
    dateRange: "late 19th century",
    citation:
      "HORTON, Alonzo Erastus (1813-1909). Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:HORTON,_Alonzo_Erastus_(1813-1909).jpg",
    license: "Public domain",
  },
  {
    id: "img-horton-house",
    src: commonsFileUrl("View_of_Horton_House,_by_Parker_&_Parker.jpg"),
    caption:
      "Horton House — my New Town hotel, photographed by Parker & Parker, a landmark of the American city rising on San Diego Bay.",
    alt: "Historic photograph of Horton House hotel in San Diego",
    topics: [
      "horton house",
      "hotel",
      "new town",
      "downtown",
      "buildings",
      "san diego",
    ],
    dateRange: "c. 1870s–1880s",
    citation:
      "View of Horton House, by Parker & Parker. Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:View_of_Horton_House,_by_Parker_%26_Parker.jpg",
    license: "Public domain",
  },
  {
    id: "img-horton-plaza-1915",
    src: commonsFileUrl("HortonPlaza&BroadwayFountain1915.jpg"),
    caption:
      "Horton Plaza and the Broadway Fountain, 1915 — a later view of the downtown plaza named for me (after my speaking year of 1905).",
    alt: "Horton Plaza and Broadway Fountain in San Diego, 1915",
    topics: [
      "horton plaza",
      "plaza",
      "broadway fountain",
      "downtown",
      "fountain",
      "new town",
    ],
    dateRange: "1915 (post-1905)",
    citation:
      "Horton Plaza & Broadway Fountain, 1915. Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:HortonPlaza%26BroadwayFountain1915.jpg",
    license: "Public domain",
  },
  {
    id: "img-plaza-fountain-postcard",
    src: commonsFileUrl(
      "I.J._Wilde_Electric_Fountain_in_Plaza_Park,_U.S._Grant_Hotel_in_Background,_San_Diego,_Cal.jpg"
    ),
    caption:
      "Electric fountain in Plaza Park, San Diego, with the U.S. Grant Hotel behind — the civic heart of New Town near Horton Plaza.",
    alt: "Historic postcard of plaza fountain and U.S. Grant Hotel, San Diego",
    topics: [
      "horton plaza",
      "plaza",
      "fountain",
      "downtown",
      "u.s. grant hotel",
      "new town",
    ],
    dateRange: "c. early 20th century postcard",
    citation:
      "I.J. Wilde Electric Fountain in Plaza Park, San Diego. Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:I.J._Wilde_Electric_Fountain_in_Plaza_Park,_U.S._Grant_Hotel_in_Background,_San_Diego,_Cal.jpg",
    license: "Public domain",
  },
  {
    id: "img-courthouse-1885",
    src: commonsFileUrl("San_Diego_County_Court_House,_circa_1885.jpg"),
    caption:
      "San Diego County Court House, about 1885 — county government planted in the growing New Town rather than Old Town.",
    alt: "San Diego County Courthouse circa 1885",
    topics: [
      "courthouse",
      "county government",
      "downtown",
      "new town",
      "buildings",
      "1885",
    ],
    dateRange: "c. 1885",
    citation:
      "San Diego County Court House, circa 1885. Public domain via Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:San_Diego_County_Court_House,_circa_1885.jpg",
    license: "Public domain",
  },
  {
    id: "img-gaslamp-william-heath-davis",
    src: commonsFileUrl("Gaslamp_Museum.jpg"),
    caption:
      "The William Heath Davis House (Gaslamp Museum) — a surviving New Town house tied to Davis's earlier bay-front settlement that adjoined my Addition.",
    alt: "William Heath Davis House / Gaslamp Museum in San Diego",
    topics: [
      "william heath davis",
      "new town",
      "gaslamp",
      "davis house",
      "old new town",
    ],
    dateRange: "historic house (modern photo)",
    citation: "Gaslamp Museum (William Heath Davis House). Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Gaslamp_Museum.jpg",
    license: "see Commons file page",
  },
];
