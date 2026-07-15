import type { ImageAsset } from "@/lib/types";
import { commonsFileUrl } from "@/lib/commonsUrl";


/**
 * SERVER-ONLY image library for August Hemme.
 * Iron Horse Trail images are captioned as modern trail when used.
 */
export const hemmeImages: ImageAsset[] = [
  {
    id: "img-portrait",
    src: "/portraits/august-hemme.jpg",
    caption:
      "August Hemme (1833–1904), Alamo rancher and leader of the campaign that brought the Southern Pacific's San Ramon Branch Line to the valley — profile photograph from his later years.",
    alt: "Profile photograph of August Hemme, an elderly man with white hair and a white chin beard",
    topics: [
      "portrait",
      "likeness",
      "identity",
      "yourself",
      "biography",
    ],
    dateRange: "late 19th century",
    citation:
      "Photograph of August Hemme via Find a Grave memorial (pre-1904; public domain).",
    license: "Public domain (pre-1904 photograph)",
  },
  {
    id: "img-danville-depot",
    src: commonsFileUrl("Danville_Southern_Pacific_Railroad_Depot_(Danville,_CA).JPG"),
    caption:
      "Danville's Southern Pacific combination depot — built 1891 when the San Ramon Branch Line opened, the station around which Danville grew.",
    alt: "Historic Danville SP railroad depot building",
    topics: [
      "danville",
      "depot",
      "station",
      "southern pacific",
      "railroad",
      "1891",
      "branch line",
    ],
    dateRange: "1891 building (later photograph)",
    citation:
      "Danville Southern Pacific Railroad Depot. Wikimedia Commons; NRHP-listed.",
    url: "https://commons.wikimedia.org/wiki/File:Danville_Southern_Pacific_Railroad_Depot_(Danville,_CA).JPG",
    license: "Commons as labeled",
  },
  {
    id: "img-museum-srv",
    src: commonsFileUrl("Museum_Of_The_San_Ramon_Valley,_California.jpg"),
    caption:
      "The preserved Danville depot building that today houses the Museum of the San Ramon Valley — the same SP station type that marked our 1891 railroad victory. (Modern museum use is after my time.)",
    alt: "Museum of the San Ramon Valley in the former Danville railroad depot",
    topics: [
      "danville depot",
      "museum",
      "san ramon valley",
      "depot",
      "southern pacific",
    ],
    dateRange: "modern photo of 1891 depot",
    citation:
      "Museum Of The San Ramon Valley, California. Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Museum_Of_The_San_Ramon_Valley,_California.jpg",
    license: "Commons as labeled",
  },
  {
    id: "img-museum-srv-alt",
    src: commonsFileUrl("Museum_Of_The_San_Ramon_Valley.jpg"),
    caption:
      "Another view of the San Ramon Valley museum depot — stick/Eastlake railroad architecture of the branch-line era.",
    alt: "Exterior view of Museum of the San Ramon Valley depot building",
    topics: [
      "depot",
      "danville",
      "architecture",
      "southern pacific",
      "museum",
    ],
    dateRange: "modern photo of 1891 depot",
    citation: "Museum Of The San Ramon Valley.jpg. Wikimedia Commons.",
    url: "https://commons.wikimedia.org/wiki/File:Museum_Of_The_San_Ramon_Valley.jpg",
    license: "Commons as labeled",
  },
  {
    id: "img-iron-horse-trail",
    src: commonsFileUrl("Iron_Horse_Regional_Trail_in_Danville,_May_2019.JPG"),
    caption:
      "Iron Horse Regional Trail in Danville, May 2019 — a modern multi-use path on the old Southern Pacific right-of-way. In my day this corridor carried freight and passenger trains; the recreational trail is beyond my time.",
    alt: "May 2019 photograph of the Iron Horse Regional Trail in Danville",
    topics: [
      "iron horse trail",
      "iron horse",
      "trail",
      "modern",
      "right-of-way",
      "rail-trail",
      "danville",
    ],
    dateRange: "2019 (modern trail)",
    citation:
      "Iron Horse Regional Trail in Danville, May 2019. Wikimedia Commons. Caption notes modern trail use.",
    url: "https://commons.wikimedia.org/wiki/File:Iron_Horse_Regional_Trail_in_Danville,_May_2019.JPG",
    license: "CC BY-SA 3.0",
  },
  {
    id: "img-chinese-railroad-laborers",
    src: commonsFileUrl("Chinese_Railroad_Laborers.jpg"),
    caption:
      "Chinese laborers on the Central Pacific Railroad in the 1860s — representative of the railroad age that later reached our valley by Southern Pacific branch in 1891.",
    alt: "Historical illustration of Chinese railroad laborers at work",
    topics: [
      "railroad",
      "chinese laborers",
      "construction",
      "central pacific",
      "tracks",
    ],
    dateRange: "1860s",
    citation:
      "Central Pacific Railroad — Chinese Laborers at Work. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Chinese_Railroad_Laborers.jpg",
    license: "Public domain",
  },
  {
    id: "img-vaqueros-1854",
    src: commonsFileUrl("California_Vaqueros,_1854.jpg"),
    caption:
      "California vaqueros, 1854 — a reminder of the cattle country I entered as a young drover before the San Ramon Valley ranch years.",
    alt: "1854 engraving of California vaqueros",
    topics: [
      "cattle",
      "vaquero",
      "ranching",
      "1850s",
      "livestock",
      "california",
    ],
    dateRange: "1854",
    citation:
      "California Vaqueros, Returned from the Chase (1854). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:California_Vaqueros,_1854.jpg",
    license: "Public domain",
  },
  {
    id: "img-gold-rush-mining",
    src: commonsFileUrl("Henry_Sandham_-_The_Cradle.jpg"),
    caption:
      "Hydraulic mining in California — the Gold Rush world that drew me west in 1849 before cattle and ranch land proved the surer path.",
    alt: "1883 engraving of hydraulic gold mining in California",
    topics: [
      "gold rush",
      "1849",
      "mining",
      "forty-niner",
      "california",
    ],
    dateRange: "c. 1883 (depicts mining era)",
    citation:
      "Henry Sandham, The Cradle. Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:Henry_Sandham_-_The_Cradle.jpg",
    license: "Public domain",
  },
  {
    id: "img-rancho-roundup",
    src: commonsFileUrl("The_Fandango.JPG"),
    caption:
      "Rancho-era celebration (Nahl's Fandango) — social California of the mid-century, kin to the cattle and land world that shaped early valley fortunes.",
    alt: "1873 painting The Fandango of Californio rancho celebration",
    topics: [
      "ranch",
      "californio",
      "fiesta",
      "valley life",
      "nineteenth century",
    ],
    dateRange: "1873",
    citation:
      "Charles Nahl, The Fandango (1873). Wikimedia Commons. Public domain.",
    url: "https://commons.wikimedia.org/wiki/File:The_Fandango.JPG",
    license: "Public domain",
  },
];
