import type { SourceChunk } from "@/lib/types";

/**
 * SERVER-ONLY source pack for Alonzo Horton.
 *
 * Each chunk is a fact-checked statement with a real citation. Facts were
 * verified against Wikipedia (Alonzo Horton), the San Diego History Center,
 * City of San Diego digital archives, and San Diego Union-Tribune historical
 * features.
 *
 * Reliability notes:
 *  - "high"   = corroborated by multiple authoritative sources or primary record
 *  - "medium" = single reputable source, local tradition, or interpretation
 *
 * Temporal note: speaking year is 1905. Death (1909) is omitted from firsthand
 * voice. City Park (1868) is the era name for what later became Balboa Park.
 */

const WIKI = "https://en.wikipedia.org/wiki/Alonzo_Horton";
const SDHC =
  "https://sandiegohistory.org/archives/biographysubject/aehorton/";
const CITY =
  "https://www.sandiego.gov/digitalarchives/community/lesson-plans/bios/horton";
const UT =
  "https://www.sandiegouniontribune.com/2017/05/28/alonzo-horton-150-years-of-legacy/";

export const hortonSources: SourceChunk[] = [
  // ---------------- Biography ----------------
  {
    id: "bio-birth",
    text: "Alonzo Erastus Horton was born on October 24, 1813, in Union, Connecticut, of an old New England family, and grew up in Onondaga County, New York.",
    topics: ["biography", "early life", "who are you", "yourself", "identity", "connecticut"],
    dateRange: "1813",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-oswego-youth",
    text: "By his early twenties Horton showed an entrepreneurial streak: around 1834 he transported grain by boat from Oswego, New York, on Lake Ontario to Canada, taught school, and ran for constable on the Whig ticket.",
    topics: ["biography", "oswego", "early life", "business"],
    dateRange: "1834",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-wisconsin-hortonville",
    text: "Advised to move west for his health, Horton went to Wisconsin in 1836. In 1848 he filed land warrants and founded what became Hortonville, Wisconsin (Outagamie County), trading land, establishing businesses, and dealing in cattle.",
    topics: ["biography", "hortonville", "wisconsin", "who are you"],
    dateRange: "1836-1851",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'; Wisconsin Historical Society.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-california-gold-ice",
    text: "In 1851 Horton sold his Wisconsin interests for about $7,000 and joined the California Gold Rush, traveling to El Dorado County. He prospered less by mining gold than by trading ice in the mining towns.",
    topics: ["biography", "gold rush", "ice trade", "california", "who are you"],
    dateRange: "1851-1857",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'; San Diego Union-Tribune historical feature.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-sf-furniture",
    text: "In 1862 Horton returned to California and opened a furniture and household goods store at Sixth and Market streets in San Francisco. There he heard lectures praising San Diego's climate and harbor.",
    topics: ["biography", "san francisco", "furniture", "market street"],
    dateRange: "1862-1867",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'; San Diego Union-Tribune.",
    url: UT,
    reliability: "high",
  },
  {
    id: "bio-decide-san-diego",
    text: "After a lecture on California ports, Horton later recalled he could not sleep for thinking of San Diego. He told his wife he would sell his goods and go south to build a city. He sold out his San Francisco merchandise and sailed for San Diego in 1867.",
    topics: ["biography", "san diego", "motivation", "who are you", "yourself"],
    dateRange: "1867",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'; San Diego History Center biographical sketch.",
    url: SDHC,
    reliability: "high",
  },
  {
    id: "bio-unitarian-republican",
    text: "Horton was one of San Diego's early Unitarians and helped found the first Unitarian church in the city. Politically he was a Republican booster; told that San Diego was a 'Copperhead hole,' he replied that he would make it a 'Republican hole' and encouraged Republican sentiment in local newspapers.",
    topics: ["biography", "unitarian", "republican", "politics", "religion"],
    dateRange: "1860s-1870s",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-healthiest-spot",
    text: "Horton famously praised San Diego as 'the healthiest spot in the world' with one of the finest harbors in the world — the slogan that drew him from San Francisco and that he used in boosting New Town.",
    topics: ["san diego", "climate", "harbor", "booster", "who are you"],
    dateRange: "1867",
    sourceType: "biographical",
    citation: "City of San Diego digital archives; San Diego History Center.",
    url: CITY,
    reliability: "high",
  },

  // ---------------- New Town / Horton's Addition ----------------
  {
    id: "newtown-purchase-1867",
    text: "In 1867 Horton bought about 960 acres of land on San Diego Bay for roughly 27½ cents an acre. The tract became known as Horton's Addition and formed the core of New Town San Diego.",
    topics: ["horton's addition", "new town", "purchase", "1867", "who are you", "yourself", "bay"],
    dateRange: "1867",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'; City of San Diego; San Diego History Center.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "newtown-vs-old-town",
    text: "Spanish and Mexican San Diego clustered around the inland Presidio and Old Town near the San Diego River mouth. Horton saw that ships docked on the large bay a few miles south and that no large American settlement yet occupied that waterfront. New Town on the bay eventually eclipsed Old Town as the city's commercial heart.",
    topics: ["old town", "new town", "presidio", "bay", "san diego"],
    dateRange: "1867-1880s",
    sourceType: "secondary",
    citation: "Wikipedia, 'Alonzo Horton'; San Diego History Center.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "newtown-davis-prior",
    text: "About twelve years before Horton, San Francisco merchant William Heath Davis and partners had attempted a 'New Town' on the bay (including a costly wharf). That earlier New Town did not flourish, in part for lack of fresh water. Horton's Addition adjoined Davis's subdivision and succeeded where the earlier attempt had struggled.",
    topics: ["william heath davis", "new town", "wharf", "prior attempt", "water"],
    dateRange: "1850s-1867",
    sourceType: "secondary",
    citation: "Wikipedia, 'Alonzo Horton'; San Diego Union-Tribune.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "newtown-development",
    text: "Horton organized industrial, financial, and commercial enterprises to build New Town: lots, a wharf (often associated with the foot of Fifth Avenue), Horton Hall, and the Horton House hotel. He gave lots to church organizations that asked help getting started.",
    topics: ["horton house", "wharf", "development", "new town", "hotel"],
    dateRange: "1867-1870s",
    sourceType: "biographical",
    citation: "San Diego History Center; City of San Diego archives.",
    url: SDHC,
    reliability: "high",
  },
  {
    id: "newtown-father-title",
    text: "Through his founding of Horton's Addition and relentless civic boosting, Horton earned the popular title 'Father of San Diego' or 'Father of New San Diego' / 'Father of modern San Diego.'",
    topics: ["father of san diego", "legacy", "who are you", "yourself", "identity"],
    dateRange: "1867-",
    sourceType: "biographical",
    citation: "City of San Diego memorial language; Wikipedia, 'Alonzo Horton'.",
    url: CITY,
    reliability: "high",
  },

  // ---------------- City Park / Chamber / Railroad ----------------
  {
    id: "park-city-park-1868",
    text: "In 1867–1868 Horton was among the first to press for a large public city park. In May 1868 a tract of about 1,400 acres of pueblo lots was reserved and named City Park. (It was renamed Balboa Park in 1910–1913 — after Horton's speaking year of 1905.)",
    topics: ["city park", "balboa park", "park", "public land", "1868"],
    dateRange: "1868",
    sourceType: "reference",
    citation: "Wikipedia, 'Alonzo Horton'; City of San Diego digital archives; Christman, Romance of Balboa Park.",
    url: CITY,
    reliability: "high",
  },
  {
    id: "chamber-of-commerce",
    text: "Horton helped establish San Diego's Chamber of Commerce to promote and expand the developing city.",
    topics: ["chamber of commerce", "booster", "business", "civic"],
    dateRange: "1870s",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "railroad-texas-pacific-setback",
    text: "When the U.S. Congress withdrew proposed aid to bring the Texas Pacific Railroad into San Diego, city progress stalled. Many lot buyers who had paid Horton large down payments (often one-third) offered to forfeit their payments if released from contracts. Horton is said to have canceled contracts for those who asked and returned the money paid — at great personal loss.",
    topics: ["railroad", "texas pacific", "panic", "honesty", "contracts"],
    dateRange: "1870s",
    sourceType: "secondary",
    citation: "Wikipedia, 'Alonzo Horton'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "railroad-california-southern-1885",
    text: "The California Southern Railroad (later part of the Santa Fe / BNSF system) became the first line to connect San Diego with the rest of America's rail network in 1885, renewing hopes for New Town's growth.",
    topics: ["railroad", "california southern", "1885", "santa fe", "connection"],
    dateRange: "1885",
    sourceType: "reference",
    citation: "Wikipedia, 'Alonzo Horton'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "boom-bust-1880s",
    text: "Local land prices exploded through much of the 1880s, making Horton wealthy again. But land values crashed in the late 1880s, devastating much of his fortune. By 1905 he remained a celebrated founder whose personal wealth was far reduced from the boom peak.",
    topics: ["boom", "bust", "1880s", "fortune", "real estate", "who are you"],
    dateRange: "1880s-1905",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'; San Diego History Center.",
    url: WIKI,
    reliability: "high",
  },

  // ---------------- Plaza & landmarks ----------------
  {
    id: "plaza-horton-plaza",
    text: "Horton Plaza (the downtown open plaza / park in New Town, later associated with the Broadway Fountain) was named for Alonzo Horton. It became a civic gathering place at the heart of the district he founded.",
    topics: ["horton plaza", "plaza", "downtown", "broadway fountain", "new town"],
    dateRange: "1870s-1905",
    sourceType: "reference",
    citation: "Wikipedia, 'Alonzo Horton'; Journal of San Diego History (Horton Plaza).",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "plaza-horton-house",
    text: "The Horton House hotel was one of Horton's signature New Town buildings — a symbol of the modern American city he meant to raise on the bay, opposite the older settlement at Old Town.",
    topics: ["horton house", "hotel", "new town", "buildings"],
    dateRange: "1870s",
    sourceType: "biographical",
    citation: "San Diego History Center; period photographs (Parker & Parker).",
    url: SDHC,
    reliability: "high",
  },

  // ---------------- Character / philosophy ----------------
  {
    id: "philosophy-happiness",
    text: "Horton summarized his civic creed: 'My principle is to be as happy as I can every day, to try and make everyone else as happy as I can, and to try to make no one unhappy.' Local memory stressed his generosity to churches, friends, and struggling settlers.",
    topics: ["philosophy", "character", "generosity", "who are you"],
    dateRange: "1840s-1905",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton' (Personal life).",
    url: WIKI,
    reliability: "medium",
  },
  {
    id: "philosophy-booster",
    text: "Horton went down in local history as a tireless, enthusiastic supporter of whatever locality he lived in — Hortonville in Wisconsin and especially New San Diego. There was, contemporaries said, no limit to his enthusiasm for the city's possibilities.",
    topics: ["booster", "philosophy", "civic", "san diego"],
    dateRange: "1867-1905",
    sourceType: "secondary",
    citation: "San Diego History Center biographical sketch.",
    url: SDHC,
    reliability: "medium",
  },

  // ---------------- San Diego context ----------------
  {
    id: "sd-bay-harbor",
    text: "San Diego Bay was (and is) one of the great natural harbors of the Pacific Coast. Horton's entire New Town scheme rested on placing the commercial city on the bay where ships already called, rather than at the inland Old Town.",
    topics: ["san diego bay", "harbor", "shipping", "new town"],
    dateRange: "1867-",
    sourceType: "reference",
    citation: "Wikipedia, 'Alonzo Horton'; City of San Diego archives.",
    url: CITY,
    reliability: "high",
  },
  {
    id: "sd-arrival-1867",
    text: "On April 15, 1867, the steamer Pacific brought the fifty-four-year-old Horton to San Diego. He at once began building New Town on the open lands sloping to the bay.",
    topics: ["arrival", "1867", "steamer", "new town", "biography"],
    dateRange: "1867",
    sourceType: "biographical",
    citation: "San Diego History Center (A.E. Horton biographical sketch).",
    url: SDHC,
    reliability: "high",
  },
  {
    id: "sd-marriages",
    text: "Horton married at least three times (relatives claimed as many as about five). His first wife, whom he met in Wisconsin, died of consumption; he later remarried, including during years spent in the East before returning to California.",
    topics: ["biography", "family", "marriage"],
    dateRange: "1840s-1860s",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'.",
    url: WIKI,
    reliability: "medium",
  },
  {
    id: "sd-1905-present",
    text: "By 1905 Horton was an elderly living founder of New San Diego: the railroad had arrived in 1885, the boom had crashed, City Park still bore that name, and downtown New Town remained the commercial center he had planted on the bay — even though his personal fortune was much diminished.",
    topics: ["1905", "legacy", "new town", "who are you", "yourself"],
    dateRange: "1905",
    sourceType: "persona-note",
    citation: "Synthesis from Wikipedia and San Diego History Center for temporal year 1905.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "sd-courthouse-1880s",
    text: "As New Town grew in the 1870s–1880s, county institutions and commercial buildings clustered in the new downtown rather than Old Town — courthouse and business blocks marking the shift Horton had engineered.",
    topics: ["courthouse", "downtown", "new town", "government"],
    dateRange: "1880s",
    sourceType: "reference",
    citation: "Period context; San Diego County Court House circa 1885 (historic photograph).",
    reliability: "medium",
  },
  {
    id: "wisconsin-sale-to-california",
    text: "When Horton left Wisconsin for California in 1851, he sold his Hortonville-area interests for roughly $7,000 — capital that funded his Gold Rush–era ventures and later West Coast businesses.",
    topics: ["wisconsin", "hortonville", "capital", "biography"],
    dateRange: "1851",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "panama-return",
    text: "In 1857 Horton returned east via Panama. During an attack he lost a bag of gold dust said to be worth about $10,000, but kept money he had made trading ice in the mining country.",
    topics: ["panama", "gold", "ice trade", "biography"],
    dateRange: "1857",
    sourceType: "biographical",
    citation: "Wikipedia, 'Alonzo Horton'.",
    url: WIKI,
    reliability: "medium",
  },
];
