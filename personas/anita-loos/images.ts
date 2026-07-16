import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";

/**
 * SERVER-ONLY image library for Anita Loos (Los Angeles / Hollywood).
 * Remote assets use Wikimedia Commons Special:FilePath URLs.
 */
export const loosImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/anita-loos.jpg",
    caption:
      "Anita Loos — a public-domain studio portrait from about 1920, near the years when I was writing pictures and Vanity Fair pieces: bobbed hair, sharp eyes, the Hollywood colony's soubrette of satire.",
    alt: "Studio portrait of Anita Loos, circa 1920",
    topics: [
      "portrait",
      "likeness",
      "identity",
      "yourself",
      "biography",
      "anita loos",
      "appearance",
    ],
    dateRange: "c. 1920",
    citation:
      "Anita Loos portrait (published 1920). Wikimedia Commons (File:AnitaLoosPortrait.png). Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:AnitaLoosPortrait.png",
    license: "Public domain",
  },
  {
    id: "img-loos-photoplay-1922",
    src: commonsFileUrl("Anita_Loos_-_Apr_1922_Photoplay.jpg"),
    caption:
      "Anita Loos in Photoplay, April 1922 — publicity of the sort that put a scenarist's face beside the stars.",
    alt: "1922 Photoplay magazine portrait of Anita Loos",
    topics: ["anita loos", "photoplay", "publicity", "1922", "screenwriter"],
    dateRange: "1922",
    citation:
      "Anita Loos, Photoplay (April 1922). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Anita_Loos_-_Apr_1922_Photoplay.jpg",
    license: "Public domain",
  },
  {
    id: "img-loos-emerson-1918",
    src: commonsFileUrl("John_Emerson_Anita_Loos_1918.jpg"),
    caption:
      "John Emerson and Anita Loos, 1918 — the writing-and-directing partnership that shaped Fairbanks pictures and later our photoplay manuals.",
    alt: "1918 photograph of John Emerson and Anita Loos",
    topics: [
      "john emerson",
      "emerson",
      "collaboration",
      "anita loos",
      "partnership",
    ],
    dateRange: "1918",
    citation:
      "John Emerson and Anita Loos, 1918. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:John_Emerson_Anita_Loos_1918.jpg",
    license: "Public domain",
  },
  {
    id: "img-wedding-1919",
    src: commonsFileUrl("Emerson_Loos_Wedding_1919.jpg"),
    caption:
      "Wedding photograph of John Emerson and Anita Loos, June 1919 — from Moving Picture World coverage of the ceremony on Long Island.",
    alt: "1919 wedding photograph of Anita Loos and John Emerson",
    topics: ["wedding", "emerson", "marriage", "1919", "anita loos"],
    dateRange: "1919",
    citation:
      "Emerson–Loos wedding, Moving Picture World (June 1919). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Emerson_Loos_Wedding_1919.jpg",
    license: "Public domain",
  },
  {
    id: "img-griffith-portrait",
    src: commonsFileUrl("David_Wark_Griffith_portrait.jpg"),
    caption:
      "D. W. Griffith — the director who put me on the Triangle payroll and asked me to help with Intolerance titles.",
    alt: "Portrait photograph of D. W. Griffith",
    topics: ["griffith", "d w griffith", "director", "triangle", "intolerance"],
    dateRange: "silent era",
    citation:
      "David Wark Griffith portrait. Wikimedia Commons. Public domain / Commons as labeled.",
    url: "https://commons.wikimedia.org/wiki/File:David_Wark_Griffith_portrait.jpg",
    license: "Public domain / Commons",
  },
  {
    id: "img-intolerance-babylon",
    src: commonsFileUrl("Griffith_intolerance.jpg"),
    caption:
      "The Babylon set for Griffith's Intolerance (1916) — monumental silent-era Los Angeles spectacle near Sunset and Hollywood Boulevards; I worked on the titles that led audiences through that epic.",
    alt: "Historic photograph of the Babylon gates set from Intolerance",
    topics: [
      "intolerance",
      "babylon",
      "griffith",
      "sets",
      "hollywood",
      "silent film",
    ],
    dateRange: "1916",
    citation:
      "Intolerance Babylon set (Griffith). Wikimedia Commons (File:Griffith_intolerance.jpg). Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Griffith_intolerance.jpg",
    license: "Public domain",
  },
  {
    id: "img-intolerance-scene",
    src: commonsFileUrl("Intolerance_(1916)_-_6.jpg"),
    caption:
      "A production still from Intolerance (1916) — Griffith's vast silent anthology; my job was words on the screen, not elephants on the lot.",
    alt: "1916 production still from D. W. Griffith's Intolerance",
    topics: ["intolerance", "griffith", "silent film", "1916", "epic"],
    dateRange: "1916",
    citation:
      "Intolerance (1916) still. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Intolerance_(1916)_-_6.jpg",
    license: "Public domain",
  },
  {
    id: "img-fairbanks-1922",
    src: commonsFileUrl("Douglas_Fairbanks_-_Dec_1922_Screenland.jpg"),
    caption:
      "Douglas Fairbanks in Screenland, December 1922 — the athletic star whose personality Emerson and I helped turn into swashbuckling adventure on the screen.",
    alt: "1922 Screenland magazine portrait of Douglas Fairbanks",
    topics: [
      "fairbanks",
      "douglas fairbanks",
      "star",
      "adventure",
      "swashbuckler",
    ],
    dateRange: "1922",
    citation:
      "Douglas Fairbanks, Screenland (December 1922). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Douglas_Fairbanks_-_Dec_1922_Screenland.jpg",
    license: "Public domain",
  },
  {
    id: "img-fairbanks-zorro",
    src: commonsFileUrl("Douglas_Fairbanks_Three_Musketeers_character_promo.jpg"),
    caption:
      "Douglas Fairbanks in costume promotion — the leaping, grinning adventure hero the Emerson–Loos pictures helped invent for the silent screen.",
    alt: "Promotional photograph of Douglas Fairbanks in costume",
    topics: [
      "fairbanks",
      "douglas fairbanks",
      "costume",
      "adventure",
      "musketeers",
      "star persona",
    ],
    dateRange: "early 1920s",
    citation:
      "Douglas Fairbanks Three Musketeers character promo. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Douglas_Fairbanks_Three_Musketeers_character_promo.jpg",
    license: "Public domain",
  },
  {
    id: "img-hollywood-blvd-1922",
    src: commonsFileUrl("Hollywood_Blvd_1922.jpg"),
    caption:
      "Hollywood Boulevard in 1922 — streetcars, storefronts, a town inventing itself while the pictures boomed. This is the colony's street, not a modern Walk of Fame postcard.",
    alt: "Historic 1922 photograph of Hollywood Boulevard",
    topics: [
      "hollywood",
      "hollywood boulevard",
      "los angeles",
      "street",
      "1920s",
      "colony",
    ],
    dateRange: "1922",
    citation:
      "Hollywood Blvd 1922. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Hollywood_Blvd_1922.jpg",
    license: "Public domain",
  },
  {
    id: "img-hollywood-streetcar-1922",
    src: commonsFileUrl(
      "Hollywood_line_streetcar_Pacific_Electric_1922.jpg"
    ),
    caption:
      "A Pacific Electric streetcar on the Hollywood line, 1922 — how the colony moved before freeways, when Hollywood Boulevard still felt like a growing town.",
    alt: "1922 Pacific Electric streetcar on the Hollywood line",
    topics: [
      "hollywood",
      "streetcar",
      "pacific electric",
      "los angeles",
      "transport",
      "1920s",
    ],
    dateRange: "1922",
    citation:
      "Hollywood line streetcar, Pacific Electric, 1922. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Hollywood_line_streetcar_Pacific_Electric_1922.jpg",
    license: "Public domain",
  },
  {
    id: "img-triangle-studios",
    src: commonsFileUrl("Triangle_studios_c.1916.jpg"),
    caption:
      "Triangle studios, about 1916 — the Culver City plant of the company that put me on salary when I joined Griffith's Hollywood payroll.",
    alt: "Historic photograph of Triangle Film Corporation studios circa 1916",
    topics: [
      "triangle",
      "studio",
      "culver city",
      "griffith",
      "hollywood",
      "1916",
    ],
    dateRange: "c. 1916",
    citation:
      "Triangle studios c.1916. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Triangle_studios_c.1916.jpg",
    license: "Public domain",
  },
  {
    id: "img-new-york-hat",
    src: commonsFileUrl("The_New_York_Hat_(Cinema_1912)_(3109264009).jpg"),
    caption:
      "The New York Hat (1912) — Griffith, Pickford, Barrymore: my third scenario and the first that reached the screen, sold by mail before I ever visited a studio.",
    alt: "Still from the 1912 Biograph film The New York Hat",
    topics: [
      "new york hat",
      "pickford",
      "griffith",
      "biograph",
      "first film",
      "scenario",
    ],
    dateRange: "1912",
    citation:
      "The New York Hat (1912). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:The_New_York_Hat_(Cinema_1912)_(3109264009).jpg",
    license: "Public domain",
  },
  {
    id: "img-blondes-illustration",
    src: commonsFileUrl("Gentlemen_Prefer_Blondes_quote_with_illustration.jpg"),
    caption:
      "An illustration tied to Gentlemen Prefer Blondes — my novel's satire in pictures; Lorelei's diary is fiction, not my speaking voice.",
    alt: "Period illustration associated with Gentlemen Prefer Blondes",
    topics: [
      "gentlemen prefer blondes",
      "blondes",
      "lorelei",
      "novel",
      "illustration",
      "satire",
    ],
    dateRange: "1925 era",
    citation:
      "Gentlemen Prefer Blondes quote with illustration. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Gentlemen_Prefer_Blondes_quote_with_illustration.jpg",
    license: "Public domain",
  },
  {
    id: "img-hollywoodland-sign",
    src: commonsFileUrl("Hollywoodland_Sign.jpg"),
    caption:
      "The Hollywoodland real-estate sign (raised 1923) — a hillside billboard of the boom years. A slightly later photograph than my earliest Hollywood days, but the landmark of the town advertising itself by 1926.",
    alt: "Historic photograph of the Hollywoodland sign in the hills",
    topics: [
      "hollywoodland",
      "hollywood sign",
      "hollywood",
      "los angeles",
      "1923",
      "booster",
    ],
    dateRange: "1923 (photo may be later historic view)",
    citation:
      "Hollywoodland Sign. Wikimedia Commons. Public domain / Commons as labeled.",
    url: "https://commons.wikimedia.org/wiki/File:Hollywoodland_Sign.jpg",
    license: "Public domain / Commons",
  },
];
