import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";


/**
 * SERVER-ONLY image library for Mark Twain (Lake Tahoe focus).
 */
export const twainImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/mark-twain.jpg",
    caption:
      "Mark Twain — Samuel Langhorne Clemens — photographed by A.F. Bradley about 1907, near the year from which I speak: an old man recalling a young man's Tahoe.",
    alt: "Studio portrait of elderly Mark Twain with white hair and mustache",
    topics: [
      "mark twain",
      "portrait",
      "appearance",
      "biography",
      "yourself",
      "identity",
      "samuel clemens",
    ],
    dateRange: "1907",
    citation:
      "A.F. Bradley, Mark Twain portrait (copyright 1907). Library of Congress / Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Mark_Twain_1907.jpg",
    license: "Public domain",
  },
  {
    id: "img-twain-brady-1871",
    src: commonsFileUrl("Mark_Twain,_Brady-Handy_photo_portrait,_Feb_7,_1871,_cropped.jpg"),
    caption:
      "A younger Mark Twain, photographed by Mathew Brady in 1871 — closer to the years when Roughing It was taking shape than to my white-haired present.",
    alt: "1871 Mathew Brady portrait of Mark Twain",
    topics: [
      "mark twain",
      "portrait",
      "brady",
      "1871",
      "younger",
      "biography",
    ],
    dateRange: "1871",
    citation:
      "Mathew Brady, Mark Twain (Feb. 7, 1871). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Mark_Twain,_Brady-Handy_photo_portrait,_Feb_7,_1871,_cropped.jpg",
    license: "Public domain",
  },
  {
    id: "img-tahoe-artists-point",
    src: commonsFileUrl("Thomas_Hill_-_Mount_Tallac_from_Lake_Tahoe_(1880).jpg"),
    caption:
      "Mount Tallac from Lake Tahoe (1880) by Thomas Hill — the mountain lake I called the fairest picture the whole earth affords, painted a generation after my timber-claim folly.",
    alt: "1880 Thomas Hill painting of Mount Tallac from Lake Tahoe",
    topics: [
      "lake tahoe",
      "tahoe",
      "view",
      "mountains",
      "fairest picture",
      "tallac",
      "landscape",
    ],
    dateRange: "1880",
    citation:
      "Thomas Hill, Mount Tallac from Lake Tahoe (1880). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Thomas_Hill_-_Mount_Tallac_from_Lake_Tahoe_(1880).jpg",
    license: "Public domain",
  },
  {
    id: "img-tahoe-warm-springs",
    src: commonsFileUrl("Lake_Tahoe_from_the_Warm_Springs,_by_Watkins,_Carleton_E.,_1829-1916.jpg"),
    caption:
      "Lake Tahoe from the Warm Springs — Watkins again, the still surface and mountain wall much as a tramp from Carson might first drink in.",
    alt: "Historic Watkins photograph of Lake Tahoe from Warm Springs",
    topics: [
      "lake tahoe",
      "tahoe",
      "shore",
      "warm springs",
      "landscape",
      "1861",
    ],
    dateRange: "c. 1870s–1880s",
    citation:
      "Carleton E. Watkins, Lake Tahoe from the Warm Springs. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Lake_Tahoe_from_the_Warm_Springs,_by_Watkins,_Carleton_E.,_1829-1916.jpg",
    license: "Public domain",
  },
  {
    id: "img-tahoe-city",
    src: commonsFileUrl("Tahoe_City_from_the_Lake,_by_Watkins,_Carleton_E.,_1829-1916.jpg"),
    caption:
      "Tahoe City from the lake — a later nineteenth-century settlement on the shore; my 1861 timber claim was a brush camp, not this townscape.",
    alt: "Historic Watkins photograph of Tahoe City from Lake Tahoe",
    topics: [
      "tahoe city",
      "lake tahoe",
      "settlement",
      "shore",
      "embarcadero",
    ],
    dateRange: "c. 1870s–1880s",
    citation:
      "Carleton E. Watkins, Tahoe City from the Lake. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Tahoe_City_from_the_Lake,_by_Watkins,_Carleton_E.,_1829-1916.jpg",
    license: "Public domain",
  },
  {
    id: "img-tahoe-shore-muybridge",
    src: commonsFileUrl("The_shore_of_Lake_Tahoe,_near_Tahoe_City,_by_Muybridge,_Eadweard,_1830-1904.jpg"),
    caption:
      "The shore of Lake Tahoe near Tahoe City — Eadweard Muybridge's photograph of pines meeting the water, the sort of timbered edge Johnny Kinney and I coveted.",
    alt: "Muybridge photograph of pine shore on Lake Tahoe near Tahoe City",
    topics: [
      "shore",
      "pine",
      "timber",
      "forest",
      "lake tahoe",
      "muybridge",
      "claim",
    ],
    dateRange: "c. 1870s",
    citation:
      "Eadweard Muybridge, The shore of Lake Tahoe, near Tahoe City. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:The_shore_of_Lake_Tahoe,_near_Tahoe_City,_by_Muybridge,_Eadweard,_1830-1904.jpg",
    license: "Public domain",
  },
  {
    id: "img-emerald-bay",
    src: commonsFileUrl("Emerald_Bay_from_the_Cascades,_Lake_Tahoe,_by_Watkins,_Carleton_E.,_1829-1916.jpg"),
    caption:
      "Emerald Bay, Lake Tahoe — Watkins's view of one of the lake's celebrated arms; useful atmosphere, not a claim that my brush camp stood precisely here.",
    alt: "Historic Watkins photograph of Emerald Bay, Lake Tahoe",
    topics: [
      "emerald bay",
      "lake tahoe",
      "bay",
      "landscape",
      "watkins",
    ],
    dateRange: "c. 1870s–1880s",
    citation:
      "Carleton E. Watkins, Emerald Bay from the Cascades, Lake Tahoe. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Emerald_Bay_from_the_Cascades,_Lake_Tahoe,_by_Watkins,_Carleton_E.,_1829-1916.jpg",
    license: "Public domain",
  },
  {
    id: "img-tallac-hotel",
    src: commonsFileUrl("Hotel_and_Cottages,_Tallac,_Lake_Tahoe,_Cal._C.R._Savage,_Salt_Lake..jpg"),
    caption:
      "Hotel and cottages at Tallac, Lake Tahoe, about 1892 — the steamer-and-cottage era that followed my brush-camp misadventure by a generation.",
    alt: "1892 C.R. Savage photograph of Tallac hotel and cottages on Lake Tahoe",
    topics: [
      "tallac",
      "hotel",
      "cottages",
      "tourism",
      "lake tahoe",
      "1890s",
    ],
    dateRange: "c. 1892",
    citation:
      "C.R. Savage, Hotel and Cottages, Tallac, Lake Tahoe. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Hotel_and_Cottages,_Tallac,_Lake_Tahoe,_Cal._C.R._Savage,_Salt_Lake..jpg",
    license: "Public domain",
  },
  {
    id: "img-steamer-tahoe",
    src: commonsFileUrl("Steamer_Tahoe,_Lake_Tahoe.jpg"),
    caption:
      "Postcard of the steamer Tahoe on Lake Tahoe (published 1910) — a later passenger craft on waters I crossed in a skiff in '61. After my speaking year; shown as period lake life.",
    alt: "Postcard of the steamer Tahoe on Lake Tahoe",
    topics: [
      "steamer",
      "steamer tahoe",
      "boat",
      "lake tahoe",
      "transportation",
    ],
    dateRange: "c. 1910 postcard",
    citation:
      "Steamer Tahoe, Lake Tahoe postcard (Nowman Post Card Co.). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Steamer_Tahoe,_Lake_Tahoe.jpg",
    license: "Public domain",
  },
  {
    id: "img-washoe-1866",
    src: commonsFileUrl("Washoe_Indians_at_Lake_Tahoe.jpg"),
    caption:
      "Washoe people at Lake Tahoe, 1866 — the Indigenous nation of the basin. My book jokes about my own folly more than it teaches Washoe history; this likeness belongs to them.",
    alt: "1866 photograph titled Washoe Indians at Lake Tahoe",
    topics: [
      "washoe",
      "washo",
      "native",
      "indigenous",
      "lake tahoe",
      "1866",
    ],
    dateRange: "1866",
    citation:
      "Lawrence & Houseworth, Washoe Indians—Lake Tahoe (1866). Library of Congress / Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Washoe_Indians_at_Lake_Tahoe.jpg",
    license: "Public domain",
  },
];
