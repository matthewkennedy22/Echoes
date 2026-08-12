import type { SourceChunk } from "@/lib/types";

/**
 * SERVER-ONLY source pack for Capt. William G. Dana.
 *
 * Grounding: Myron Angel, History of San Luis Obispo County (1883) Dana
 * biography; Edwin Bryant, What I Saw in California (1848); California
 * Historical Landmark #1033; Dana Adobe (partner) history page and
 * descendants list. Wikipedia / Find a Grave / Blond Ranchero are not used.
 */

const ANGEL_1883 =
  "https://archive.org/details/historyofsanluis00ange";
const BRYANT_1848 =
  "https://www.gutenberg.org/files/13002/13002-h/13002-h.htm";
const OHP_1033 =
  "https://ohp.parks.ca.gov/ListedResources/Detail/1033";
const DANA_HISTORY = "https://www.danaadobe.org/history/";
const DANA_DESCENDANTS =
  "https://www.danaadobe.org/wp-content/uploads/2023/11/Dana-Descendants.pdf";

export const williamGDanaSources: SourceChunk[] = [
  {
    id: "bio-identity",
    text: "William Goodwin Dana, known to Americans as Capt. Wm. G. Dana and in Spanish records as Guillermo G. Dana, was a Boston-born sea captain who became ranchero of Rancho Nipomo in what is now San Luis Obispo County. He is not Richard Henry Dana Jr., the author of Two Years Before the Mast — a kinsman of the New England Dana line, not the same man.",
    topics: [
      "biography",
      "who are you",
      "yourself",
      "identity",
      "william goodwin dana",
      "guillermo",
      "richard henry dana",
    ],
    dateRange: "1797-1858",
    sourceType: "biographical",
    citation:
      "Myron Angel, History of San Luis Obispo County, California (Oakland: Thompson & West, 1883), biographical sketch of Capt. Wm. G. Dana.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "bio-birth-boston",
    text: "Dana was born in Boston, Massachusetts, on May 5, 1797. His father bore the same given name; his mother, Elizabeth, was a daughter of Gen. Robert Davis of Massachusetts. The New England Dana line traces to Richard Dana, who settled at Cambridge in 1640.",
    topics: [
      "biography",
      "birth",
      "boston",
      "may 5 1797",
      "elizabeth davis",
      "ancestry",
    ],
    dateRange: "1797",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), Dana biography; Dana Adobe, History page (Boston, 5 May 1797); Dana Adobe, Dana Descendants (updated 2023).",
    url: DANA_HISTORY,
    reliability: "high",
  },
  {
    id: "bio-youth-voyages",
    text: "Dana spent his youth in Boston and received a good education. About age eighteen, just after the War of 1812, he was sent in the service of his uncle, a Boston merchant, to Canton, remaining nearly two years, then to Calcutta for about a year before returning to Boston. He obtained a first-class certificate as a navigator. The Dana Adobe history page notes a circumnavigation on that first voyage at nineteen.",
    topics: [
      "biography",
      "youth",
      "canton",
      "calcutta",
      "china trade",
      "navigator",
      "circumnavigation",
    ],
    dateRange: "c. 1815-1818",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), Dana youth and early travels; Dana Adobe, History page.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "bio-hawaii-waverly",
    text: "Dana's stay in Boston after the India voyage was short. In 1820 he established a commercial business and warehouse at Oahu (Honolulu) in the Sandwich Islands, his headquarters for about five years, with voyages to Canton, Russian America, California, and the South American coast. He is recorded as captain of the brig (sometimes called schooner) Waverly. About 1825 he located a store at Santa Barbara, leaving it in charge of Capt. C. R. Smith while he continued in command of the Waverly.",
    topics: [
      "biography",
      "hawaii",
      "oahu",
      "honolulu",
      "waverly",
      "sandwich islands",
      "santa barbara store",
    ],
    dateRange: "1820-1825",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), Oahu warehouse and brig Waverly; Dana Adobe, History page (about ten years in Hawaii; Santa Barbara by the mid-1820s).",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "bio-naturalization-marriage",
    text: "To marry in California, Dana had to become a naturalized Mexican citizen and be married in the Catholic Church. A letter from John B. R. Cooper, Monterey, July 22, 1828, complains of the trouble given Dana over the marriage. Dana petitioned Political Chief José María de Echeandía from Santa Barbara, March 22, 1828, for authorization to marry Doña María Josefa Carrillo, legitimate daughter of Don Carlos Antonio Carrillo of the Santa Barbara presidio. Echeandía replied from San Diego, May 1, 1828, that the application could not yet be acted upon.",
    topics: [
      "marriage",
      "naturalization",
      "catholic",
      "echeandia",
      "cooper",
      "1828",
    ],
    dateRange: "1828",
    sourceType: "primary",
    citation:
      "Angel, History of San Luis Obispo County (1883), quoting Cooper's letter of 22 July 1828 and Dana's petition of 22 March 1828 to Echeandía.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "bio-marriage-1828",
    text: "The marriage of Captain Dana and María Josefa Carrillo was solemnized at Santa Barbara on August 20, 1828. She was the eldest daughter of Don Carlos Antonio Carrillo and María Josefa (née Castro) Carrillo. He was thirty-one; she was sixteen (born 29 June 1812). The ages are documented; the sources do not record their private feelings about the match.",
    topics: [
      "marriage",
      "august 20 1828",
      "santa barbara",
      "maria josefa carrillo",
      "age at marriage",
    ],
    dateRange: "20 Aug 1828",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), 'Marriage and Family of Mrs. Dana'; Dana Adobe, Dana Descendants (m. 20 Aug 1828, Santa Barbara).",
    url: DANA_DESCENDANTS,
    reliability: "high",
  },
  {
    id: "bio-carrillo-family",
    text: "María Josefa's father, Don Carlos Antonio Carrillo, was an Alta California governor and Mexican federal legislator. Her grandfather Don Raymundo Carrillo was among the early commanders of the posts of San Diego and Santa Barbara and founder of the family in California; he married Tomasa Lugo. Angel names five Carrillo daughters who married Americans: María Josefa (Dana), Encarnación (Capt. Thomas M. Robbins), Francisca (Capt. A. B. Thompson), Manuela (John C. Jones, U.S. consul at Honolulu), and María Antonia (Lewis T. Burton).",
    topics: [
      "carrillo",
      "carlos antonio carrillo",
      "raymundo carrillo",
      "santa barbara",
      "sisters",
    ],
    dateRange: "1828-1850",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), Carrillo family sketch; Dana Adobe, History page (Carrillo's father a governor and legislator).",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "bio-goleta-schooner",
    text: "In 1828 Captain Dana built a schooner on the Santa Barbara coast; the locality still bears the name Goleta, the Spanish word for schooner, from that fact. Angel reports it claimed as the first sea-going vessel launched in California. She was named Santa Barbara and placed under Capt. Thomas M. Robbins, former mate of the Waverly, who later sold her at Acapulco. Robbins married Encarnación Carrillo, sister of Mrs. Dana.",
    topics: [
      "goleta",
      "schooner",
      "santa barbara",
      "robbins",
      "shipbuilding",
      "1828",
    ],
    dateRange: "1828",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), 'Captain Dana Builds a Schooner.'",
    url: ANGEL_1883,
    reliability: "medium",
  },
  {
    id: "rancho-grant-1837",
    text: "In 1835, having become a naturalized citizen of the Mexican Republic and thereby entitled to hold land, Dana applied for Rancho Nipomo. Governor Alvarado granted the request on April 6, 1837. Angel gives the grant as 37,887.91 acres, among the earlier grants, stretching from near the Pacific shore to the base of the Santa Lucia Mountains in the southern part of San Luis Obispo County. The California landmark text describes the rancho as almost 38,000 acres, granted in 1837.",
    topics: [
      "rancho nipomo",
      "land grant",
      "1835",
      "april 6 1837",
      "alvarado",
      "37887",
      "acres",
    ],
    dateRange: "1835-1837",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), 'Obtains the Nipomo Grant'; California Historical Landmark #1033; Dana Adobe, History page.",
    url: OHP_1033,
    reliability: "high",
  },
  {
    id: "rancho-name-nipomo",
    text: "The name Nipomo is derived from a local Indian expression, given by Angel as ne-po-mah, meaning at the foot of the hill or mountain, with the accent on the last syllable. The Dana Adobe history page states that Nipomo meant 'At the Foot of the Hill' in Chumash.",
    topics: [
      "nipomo",
      "place name",
      "chumash",
      "ne-po-mah",
      "foot of the hill",
    ],
    dateRange: "pre-1837",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), Nipomo name; Dana Adobe, History page (Chumash Era).",
    url: DANA_HISTORY,
    reliability: "high",
  },
  {
    id: "chumash-nipomo-village",
    text: "The Dana Adobe history page states that Chumash people lived along more than 160 miles of the Central Coast from Malibu to Avila Bay, and that indigenous people have lived in the area for about 10,000 years. Nipomo was once a Chumash village. The site notes at least two camps on the Dana Adobe property about 2,000 and 9,000 years old, and that the last Chumash tribal member recorded at the Nipomo village departed in 1804 after being baptized and brought to Mission La Purísima Concepción. How labor on the later adobe was organized is not documented in these sources.",
    topics: [
      "chumash",
      "nipomo village",
      "la purisima",
      "1804",
      "mission",
      "indigenous",
    ],
    dateRange: "to 1804",
    sourceType: "secondary",
    citation:
      "Dana Adobe, History page, 'Chumash Era.'",
    url: DANA_HISTORY,
    reliability: "medium",
  },
  {
    id: "rancho-move-1839-adobe",
    text: "After the grant, Dana continued business in Santa Barbara while carrying on the rancho until the fall of 1839, when he moved the family to Nipomo. He erected a large adobe house of thirteen rooms on an elevation overlooking a large area of the grant. Angel, writing in 1883, still called the venerable casa de Dana a conspicuous object on that rise.",
    topics: [
      "1839",
      "adobe",
      "thirteen rooms",
      "casa de dana",
      "move to nipomo",
      "house",
    ],
    dateRange: "1839",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), move to Nipomo and adobe of thirteen rooms.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "hospitality-el-camino",
    text: "From 1839 until Dana's death in 1858, Rancho Nipomo was known throughout the state as a hospitable stopping place for travelers, including Captain John C. Frémont, Edwin Bryant, and General Henry W. Halleck. For many years it was the first stopping place on El Camino Real south of Mission San Luis Obispo. Angel describes the custom of providing meals, lodging, and a relay of horses without charge, and a guide if needed; the regular jornadas south were Nipomo (about 24 miles from San Luis), then Los Alamos, Santa Ynez Mission, Refugio, and Santa Barbara.",
    topics: [
      "hospitality",
      "el camino real",
      "travelers",
      "fremont",
      "bryant",
      "halleck",
      "jornada",
    ],
    dateRange: "1839-1858",
    sourceType: "secondary",
    citation:
      "California Historical Landmark #1033; Angel, History of San Luis Obispo County (1883), hospitality and jornadas.",
    url: OHP_1033,
    reliability: "high",
  },
  {
    id: "bryant-1846-visit",
    text: "Edwin Bryant, marching with Frémont, wrote on December 18, 1846, that the company encamped about three o'clock near the rancho of Captain Dana, in a large and handsome valley well watered by an arroyo. He described Dana as a native of Massachusetts who had resided in the country about thirty years, 'known and esteemed throughout California for his intelligence and private virtues, and his unbounded generosity and hospitality.' Bryant bought wheat bread there for the men — a luxury they had not had since the march began.",
    topics: [
      "bryant",
      "what i saw in california",
      "december 1846",
      "fremont",
      "hospitality",
      "wheat bread",
    ],
    dateRange: "18 Dec 1846",
    sourceType: "primary",
    citation:
      "Edwin Bryant, What I Saw in California (New York: D. Appleton, 1848), journal 18 December 1846.",
    url: BRYANT_1848,
    reliability: "high",
  },
  {
    id: "mail-route-1847",
    text: "In 1847 the Dana ranch became one of four designated exchange points on California's first U.S. mail route.",
    topics: ["mail", "1847", "postal", "exchange point", "united states mail"],
    dateRange: "1847",
    sourceType: "reference",
    citation:
      "California Historical Landmark #1033, Rancho Nipomo (Cpt. William G. Dana Rancho).",
    url: OHP_1033,
    reliability: "high",
  },
  {
    id: "edith-wreck-1848",
    text: "In 1848 the United States steamship Edith went ashore between Point Arguello and Point Sal. Angel records that Captain Dana took the officers and crew to his home, entertained them two or three weeks, then provided horses, saddles, and guides to Monterey. Several officers remained some months at the rancho.",
    topics: [
      "edith",
      "shipwreck",
      "1848",
      "hospitality",
      "point sal",
      "monterey",
    ],
    dateRange: "1848",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), steamship Edith wreck and Dana hospitality.",
    url: ANGEL_1883,
    reliability: "medium",
  },
  {
    id: "manufactures-nipomo",
    text: "Angel records considerable manufacturing at Nipomo: a soap factory, looms for coarse cloths, serapes, and blankets, a turning lathe and furniture shop (including work in sandal and other woods from the Pacific trade), a blacksmith shop, and improved plows that surprised Californios used to the pointed-stick arada. Dana supplied his own people, neighboring ranchos, and the missions of La Purísima and Santa Ynez.",
    topics: [
      "soap",
      "looms",
      "blankets",
      "furniture",
      "blacksmith",
      "plows",
      "manufacturing",
    ],
    dateRange: "1839-1850",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), manufactures at Nipomo.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "civic-prefecto-senate",
    text: "Under Mexican rule Dana served as prefecto of the district, which Angel calls the highest office in the gift of the Governor. At the first election for officers under the California Constitution, in 1849, Angel says Dana received the largest vote for the Senate, but because of informalities the office was accorded to Don Pablo de la Guerra of Santa Barbara. He later declined to run again. Angel also notes he took little part in political controversies, was believed friendly to his father-in-law Carrillo's gubernatorial claim, and that rheumatism limited his activity at the change of flag; friendship with Frémont is cited as evidence he favored the American cause.",
    topics: [
      "prefecto",
      "senate",
      "1849",
      "pablo de la guerra",
      "politics",
      "carrillo governor",
    ],
    dateRange: "1830s-1849",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), Dana civic offices and 1849 senate vote.",
    url: ANGEL_1883,
    reliability: "medium",
  },
  {
    id: "slo-frame-building-1850",
    text: "After gold was discovered in 1848, Dana established business at the new county seat of San Luis Obispo. In 1850 he erected what Angel calls the first frame building in the town or county, fronting the road past the mission to Monterey (later Monterey Street), near the old palm tree. In 1851 he was elected Treasurer of San Luis Obispo County, and he built the adobe 'Casa Grande' in town — a later building, not the Nipomo adobe.",
    topics: [
      "san luis obispo",
      "1850",
      "frame building",
      "monterey street",
      "county treasurer",
      "casa grande slo",
    ],
    dateRange: "1850-1851",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), first frame building (1850) and Casa Grande (1851).",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "rheumatism-and-death",
    text: "During many later years Captain Dana suffered severely from rheumatism. Angel says that after his sea years, when he might have enjoyed ease on Nipomo, the disease returned at intervals, grew more painful, and so incapacitated him that he could not take the part in public affairs at the change of flag that he wished. Shortly thereafter he became confined to the house, paralyzed and helpless, until his death on February 12, 1858. He was buried in the Catholic cemetery of San Luis Obispo (Old Mission Cemetery). The Dana Adobe descendants list agrees on 12 February 1858; some later notices differ by a day.",
    topics: [
      "rheumatism",
      "illness",
      "death",
      "february 12 1858",
      "burial",
      "old mission cemetery",
    ],
    dateRange: "1850s-1858",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), rheumatism and death 12 February 1858; Dana Adobe, Dana Descendants; Landmark #1033 (death 1858).",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "children-tally",
    text: "Captain and Mrs. Dana were the parents of twenty-one children, of whom eight died in infancy. Angel, writing in 1883, names one adult daughter already dead (Mrs. S. A. Pollard, María Josefa Dana, 1878) and lists living sons and daughters then on the Nipomo estate. The Dana Adobe history page states 21 children of whom 13 reached adulthood. That completed tally belongs to the later family record, not to a closed count in 1850.",
    topics: [
      "children",
      "family",
      "twenty-one",
      "thirteen",
      "infancy",
    ],
    dateRange: "1829-1883",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), twenty-one children; Dana Adobe, History page (21 children / 13 adults).",
    url: DANA_HISTORY,
    reliability: "high",
  },
  {
    id: "john-f-trustee",
    text: "John Francis Dana, born Santa Barbara June 22, 1837, moved with the family to Nipomo in 1839. Upon his father's death he was appointed trustee of the estate and, Angel says, executed the trust for twenty years until the ranch was divided among the family. That trustee period and the later division lie after Captain Dana's lifetime.",
    topics: [
      "john francis dana",
      "trustee",
      "estate",
      "division",
      "1837",
    ],
    dateRange: "1858-c. 1878",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), sketch of John F. Dana.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "landmark-nipomo",
    text: "Rancho Nipomo (Capt. William G. Dana Rancho) is California Historical Landmark #1033, registered August 11, 2000. The landmark text summarizes the 1837 grant of almost 38,000 acres, the El Camino Real stop south of Mission San Luis Obispo, hospitality to Frémont, Bryant, and Halleck from 1839 to 1858, and the 1847 U.S. mail exchange.",
    topics: [
      "landmark",
      "1033",
      "california historical landmark",
      "nipomo",
    ],
    dateRange: "1837-1858",
    sourceType: "reference",
    citation:
      "California Office of Historic Preservation, Listed Resources, Landmark #1033.",
    url: OHP_1033,
    reliability: "high",
  },
  {
    id: "waverly-otter-lading",
    text: "A bill of lading reproduced by Angel, for the brig Waverly, Wm. G. Dana master, lying in the harbour of Santa Barbara and bound for Oahu, lists Spanish dollars, bars of silver, otter skins, fur-seal skins, and a lump of gold. Dana is also recorded, 20 December 1826, as captain (with Thomas M. Robbins as mate) on a document vouching for Jedediah S. Smith.",
    topics: [
      "waverly",
      "otter",
      "hides",
      "bill of lading",
      "jedediah smith",
      "santa barbara",
      "oahu",
    ],
    dateRange: "1826",
    sourceType: "primary",
    citation:
      "Angel, History of San Luis Obispo County (1883), Waverly bill of lading and Jedediah Smith voucher, 20 December 1826.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "reynolds-1836-farm",
    text: "Stephen Reynolds wrote Dana from Oahu, 17 March 1836, urging him to send hides and to 'stick to your farm,' glad that Dana's prospects were good for becoming a wealthy farmer. The letter shows Dana already turning from island trade toward the California rancho before the 1837 grant was complete.",
    topics: [
      "reynolds",
      "hides",
      "farm",
      "1836",
      "oahu",
      "sandwich islands",
    ],
    dateRange: "17 Mar 1836",
    sourceType: "primary",
    citation:
      "Angel, History of San Luis Obispo County (1883), quoting Stephen Reynolds to Dana, Oahu, 17 March 1836.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "tulare-raids",
    text: "Angel says the adobe was placed on an elevation in part to watch for marauding Indians and to command a view of the valley. He records that Indians from the Tulare Valley frequently raided coast stock ranchos, and that men of the place would arm and ride out. Treat this as Angel's 1883 account of rancho defense, not as a license to invent battles or tribal names he does not give.",
    topics: [
      "tulare",
      "raids",
      "stock",
      "defense",
      "adobe location",
      "indians",
    ],
    dateRange: "1839-1850",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), siting of the house and Tulare Valley raids.",
    url: ANGEL_1883,
    reliability: "medium",
  },
];
