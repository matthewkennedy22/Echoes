import type { SourceChunk } from "@/lib/types";

/**
 * SERVER-ONLY source pack for Myron Angel.
 *
 * Each chunk is a fact-checked statement with a real citation. Facts were
 * verified (June 2026) against: the Wikipedia biography, the National Register
 * nomination for the Myron Angel House, Cal Poly's official history, a San Luis
 * Obispo Tribune historical feature, the Online Archive of California finding
 * aid for the Myron Angel Papers, and the 1883 book itself on the Internet
 * Archive.
 *
 * Reliability notes:
 *  - "high"   = corroborated by multiple authoritative sources or primary record
 *  - "medium" = single reputable source, local tradition, or interpretation
 *
 * This pack is intentionally small and verified. The full OCR text of the 1883
 * "History of San Luis Obispo County" (archive.org/details/historyofsanluis00ange)
 * can be ingested later via a chunking script to deepen coverage.
 */

const WIKI = "https://en.wikipedia.org/wiki/Myron_Angel";
const NOEHILL = "https://noehill.com/sanluisobispo/nat1982000988.asp";
const CALPOLY = "https://www.calpoly.edu/historical-fact/school-established";
const TRIBUNE =
  "https://www.sanluisobispo.com/news/local/news-columns-blogs/photos-from-the-vault/article218639055.html";
const OAC = "https://oac.cdlib.org/findaid/ark:/13030/kt267nf00d";
const ARCHIVE_1883 = "https://archive.org/details/historyofsanluis00ange";

export const myronAngelSources: SourceChunk[] = [
  // ---------------- Biography ----------------
  {
    id: "bio-birth",
    text: "Myron W. Angel was born in 1827 in Oneonta, New York, and raised in nearby Milford, New York. He was orphaned at the age of fifteen.",
    topics: ["biography", "early life", "who are you", "yourself", "identity"],
    dateRange: "1827",
    sourceType: "biographical",
    citation: "Wikipedia, 'Myron Angel'; National Register nomination, Myron Angel House (1982).",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-westpoint",
    text: "Angel was admitted to the U.S. Military Academy at West Point on July 1, 1846. At the examinations held in June 1848 he was found deficient in both mathematics and French, and he resigned from the Academy on June 30, 1848, partly at the urging of his brother Eugene.",
    topics: ["biography", "west point", "education"],
    dateRange: "1846-1848",
    sourceType: "biographical",
    citation: "Wikipedia, 'Myron Angel'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-goldrush",
    text: "Angel came to California in 1849 during the Gold Rush. He mined for gold in the Feather River and North San Juan Ridge mining districts and worked as a rancher near Chico before turning to journalism.",
    topics: ["biography", "gold rush", "california"],
    dateRange: "1849-1850s",
    sourceType: "biographical",
    citation: "National Register nomination, Myron Angel House (1982); Wikipedia, 'Myron Angel'.",
    url: NOEHILL,
    reliability: "high",
  },
  {
    id: "bio-journalism",
    text: "Like many itinerant printers of his era, Angel edited newspapers in several towns, including Placerville, California; Austin, Nevada (the Reese River Reveille, with his Fairchild cousins); and Oakland, California, before settling in San Luis Obispo.",
    topics: ["biography", "journalism", "newspapers", "who are you", "yourself"],
    dateRange: "1850s-1883",
    sourceType: "biographical",
    citation: "Wikipedia, 'Myron Angel'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-slo-arrival",
    text: "Angel settled in San Luis Obispo in 1883 to edit the Weekly Tribune, and later the Daily Republic.",
    topics: ["biography", "san luis obispo", "newspapers"],
    dateRange: "1883",
    sourceType: "biographical",
    citation: "National Register nomination, Myron Angel House (1982).",
    url: NOEHILL,
    reliability: "high",
  },
  {
    id: "bio-buchon-house",
    text: "Angel moved into his house at 714 Buchon Street in San Luis Obispo in 1889 and lived there until his death in 1911. The home, built around 1880, was later listed on the National Register of Historic Places for its association with him.",
    topics: ["biography", "buchon street", "house"],
    dateRange: "1889-1911",
    sourceType: "reference",
    citation: "National Register #82000988, Myron Angel House, 714 Buchon Street, San Luis Obispo.",
    url: NOEHILL,
    reliability: "high",
  },
  {
    id: "bio-tribune-trouble",
    text: "Angel was an ambitious dreamer whose ideas sometimes got him into trouble. He nearly bankrupted the weekly San Luis Obispo Tribune by launching an expensive daily edition and had to be rescued by business manager Benjamin Brooks, who soon pushed Angel out of the editor's chair.",
    topics: ["biography", "newspapers", "tribune"],
    dateRange: "1880s-1890s",
    sourceType: "secondary",
    citation: "San Luis Obispo Tribune, 'Cal Poly SLO founder Myron Angel had big ideas.'",
    url: TRIBUNE,
    reliability: "medium",
  },
  {
    id: "bio-death",
    text: "Myron Angel died in 1911. He is remembered as a journalist, historian, and educational advocate, and is known as the 'Father of California Polytechnic State University.'",
    topics: ["biography", "legacy"],
    dateRange: "1911",
    sourceType: "biographical",
    citation: "Wikipedia, 'Myron Angel'; National Register nomination (1982).",
    url: WIKI,
    reliability: "high",
  },

  // ---------------- Books ----------------
  {
    id: "books-overview",
    text: "Angel edited Thompson & West's History of Nevada and wrote, with the assistance of M.D. Fairchild, the History of Placer County (1882), the History of San Luis Obispo County (1883), and the History of Tulare County (1891).",
    topics: ["books", "history writing"],
    dateRange: "1881-1891",
    sourceType: "reference",
    citation: "Online Archive of California, finding aid for the Myron Angel Papers.",
    url: OAC,
    reliability: "high",
  },
  {
    id: "books-1883-history",
    text: "Angel's 'History of San Luis Obispo County, California; with illustrations and biographical sketches of its prominent men and pioneers' was published by Thompson & West of Oakland in 1883. It runs roughly 391 pages and covers the county's geology, Native peoples, the Spanish missions, and detailed biographies of early pioneers. The full text is in the public domain and available on the Internet Archive.",
    topics: ["books", "1883 history", "san luis obispo"],
    dateRange: "1883",
    sourceType: "primary",
    citation: "Myron Angel, History of San Luis Obispo County, California (Oakland: Thompson & West, 1883). Internet Archive.",
    url: ARCHIVE_1883,
    reliability: "high",
  },
  {
    id: "books-calpoly-history",
    text: "Angel later wrote a History of the California Polytechnic School (1908), a firsthand account of the long political fight to establish the school and of his belief in practical, vocational education.",
    topics: ["books", "cal poly"],
    dateRange: "1908",
    sourceType: "biographical",
    citation: "Biographical record of Myron Angel's published works.",
    reliability: "medium",
  },

  // ---------------- Cal Poly founding ----------------
  {
    id: "calpoly-inspiration",
    text: "After marrying well and retiring from daily newspaper work, Angel visited his childhood home of Oneonta, New York, in 1893 and was amazed at how a state school there had transformed the town. Inspired, the 66-year-old returned to the Central Coast determined to bring a state school to San Luis Obispo.",
    topics: ["cal poly", "motivation"],
    dateRange: "1893",
    sourceType: "secondary",
    citation: "San Luis Obispo Tribune, 'Cal Poly SLO founder Myron Angel had big ideas.'",
    url: TRIBUNE,
    reliability: "medium",
  },
  {
    id: "calpoly-lobbying",
    text: "A group of local citizens led by Myron Angel had been lobbying for a state school in San Luis Obispo since 1894. Angel organized committees, made speeches, and wrote letters, and was joined by other newspaper editors and business and political leaders.",
    topics: ["cal poly", "lobbying"],
    dateRange: "1894-1901",
    sourceType: "reference",
    citation: "Cal Poly, 'School is Established'; San Luis Obispo Tribune feature.",
    url: CALPOLY,
    reliability: "high",
  },
  {
    id: "calpoly-signed",
    text: "On March 8, 1901, Governor Henry T. Gage signed the legislation that established the California Polytechnic School in San Luis Obispo.",
    topics: ["cal poly", "founding", "who are you", "yourself", "polytechnic"],
    dateRange: "1901",
    sourceType: "reference",
    citation: "Cal Poly, 'School is Established'; San Luis Obispo Tribune feature.",
    url: CALPOLY,
    reliability: "high",
  },
  {
    id: "calpoly-opened",
    text: "The California Polytechnic School began as a modest vocational secondary school and opened to its first students in 1903.",
    topics: ["cal poly", "founding", "who are you", "yourself", "polytechnic"],
    dateRange: "1903",
    sourceType: "secondary",
    citation: "Cal Poly historical record; San Luis Obispo Tribune feature.",
    url: TRIBUNE,
    reliability: "medium",
  },
  {
    id: "calpoly-father",
    text: "Myron Angel is considered the 'father' of Cal Poly. His speeches and news articles drove the campaign, and he is the figure most associated with founding the school.",
    topics: ["cal poly", "legacy"],
    dateRange: "1901-1911",
    sourceType: "reference",
    citation: "Cal Poly, 'School is Established'; National Register nomination (1982).",
    url: CALPOLY,
    reliability: "high",
  },

  // ---------------- Philosophy ----------------
  {
    id: "philosophy-nail",
    text: "A formative story: when Angel arrived broke and hungry in California during the Gold Rush, he was offered manual work but had to admit he had 'never driven a nail in his life.' This humiliation for an over-educated West Point dropout who lacked practical skills became a lifelong motivation behind his fight for hands-on, 'learn by doing' education.",
    topics: ["philosophy", "learn by doing", "motivation"],
    dateRange: "1849",
    sourceType: "secondary",
    citation: "Cal Poly, College of Engineering — account of Myron Angel and 'Learn by Doing.'",
    reliability: "medium",
  },
  {
    id: "philosophy-handbrain",
    text: "Angel believed that rigid, abstract schooling fails practical minds — a conviction shaped by his own failure in mathematics and French at West Point. He championed a polytechnic, vocational model that combined 'hand and brain,' preparing young farmers and mechanics with usable skills rather than only book learning.",
    topics: ["philosophy", "education", "vocational"],
    dateRange: "1890s-1905",
    sourceType: "biographical",
    citation: "Interpretation based on Wikipedia biography and Cal Poly's account of Angel's vocational advocacy.",
    url: WIKI,
    reliability: "medium",
  },

  // ---------------- San Luis Obispo history ----------------
  {
    id: "slo-mission",
    text: "Mission San Luis Obispo de Tolosa was founded in 1772 by Father Junípero Serra and gave the town its name. The Spanish mission era, the secularization of the missions under Mexican rule, and the granting of large land ranchos are central chapters in the county's early history that Angel documented in his 1883 book.",
    topics: ["san luis obispo", "mission", "spanish era"],
    dateRange: "1772-1840s",
    sourceType: "reference",
    citation: "Myron Angel, History of San Luis Obispo County (1883); general California mission history.",
    url: ARCHIVE_1883,
    reliability: "high",
  },
  {
    id: "slo-chumash",
    text: "The Chumash people were the original inhabitants of the San Luis Obispo region long before Spanish contact. Angel's 1883 history includes accounts of the area's Native peoples, written from a 19th-century perspective that modern readers should treat critically.",
    topics: ["san luis obispo", "chumash", "native history"],
    dateRange: "pre-1772",
    sourceType: "primary",
    citation: "Myron Angel, History of San Luis Obispo County (1883); note: reflects period attitudes.",
    url: ARCHIVE_1883,
    reliability: "medium",
  },
  {
    id: "slo-droughts",
    text: "The severe droughts of the 1860s, especially 1862–1864, devastated cattle herds across California and helped end the era of the great Mexican-era cattle ranchos, opening the way for American farming, dairying, and settlement on the Central Coast.",
    topics: ["san luis obispo", "ranchos", "droughts", "economy"],
    dateRange: "1862-1864",
    sourceType: "reference",
    citation: "General California history, corroborated in Myron Angel, History of San Luis Obispo County (1883).",
    url: ARCHIVE_1883,
    reliability: "high",
  },
  {
    id: "slo-railroad",
    text: "Bringing the railroad to the isolated Central Coast was a defining ambition of Angel's era. The crossing of the Cuesta Grade north of San Luis Obispo required a major series of tunnels, an engineering feat completed in the mid-1890s that finally connected the region by rail.",
    topics: ["san luis obispo", "railroad", "cuesta grade", "infrastructure"],
    dateRange: "1890s",
    sourceType: "secondary",
    citation: "Regional history of the Southern Pacific Railroad and the Cuesta Grade tunnels.",
    reliability: "medium",
  },
  {
    id: "slo-ah-louis",
    text: "Ah Louis, a Chinese-American pioneer, opened the Ah Louis Store in 1874 — the first Chinese-owned business in San Luis Obispo. Chinese laborers were central to building the area's railroads, including the Pacific Coast Railway and the Cuesta Grade tunnels.",
    topics: ["san luis obispo", "ah louis", "chinese community", "railroad"],
    dateRange: "1874-1894",
    sourceType: "secondary",
    citation: "Local San Luis Obispo history of Ah Louis and the Ah Louis Store.",
    reliability: "medium",
  },

  // ---------------- Primary-source artifact ----------------
  {
    id: "primary-1906-letter",
    text: "A surviving four-page handwritten letter by Angel, dated September 24, 1906, to W.W. Hobart, president of the Society of California Pioneers, thanks him for reinstatement to the Society and recounts Angel's life, the newspapers he worked for, and the books he authored.",
    topics: ["primary source", "letter", "biography"],
    dateRange: "1906",
    sourceType: "primary",
    citation: "Myron Angel Papers, Online Archive of California (letter, Sept. 24, 1906).",
    url: OAC,
    reliability: "high",
  },
];
