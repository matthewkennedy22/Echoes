import type { SourceChunk } from "@/lib/types";

/**
 * SERVER-ONLY source pack for María Josefa Carrillo de Dana.
 *
 * Grounding: Angel 1883 (marriage and Carrillo family chapter; Dana
 * biography); Bryant 1848 (visitor to the house); OHP landmark #1033;
 * Dana Adobe partner site (home, history, family, descendants list, and
 * the Gladys Norton 1956 article they publish). No Find a Grave, Wikipedia,
 * Blond Ranchero, or uncorroborated volunteer-essay beats (Ojai petition,
 * "Spanish only").
 */

const ANGEL_1883 =
  "https://archive.org/details/historyofsanluis00ange";
const BRYANT_1848 =
  "https://www.gutenberg.org/files/13002/13002-h/13002-h.htm";
const OHP_1033 =
  "https://ohp.parks.ca.gov/ListedResources/Detail/1033";
const DANA_HISTORY = "https://www.danaadobe.org/history/";
const DANA_HOME = "https://www.danaadobe.org/";
const DANA_FAMILY = "https://www.danaadobe.org/family/";
const DANA_NORTON =
  "https://www.danaadobe.org/2021/09/22/looking-back-a-story-by-gladys-norton-in-1956/";
const DANA_DESCENDANTS =
  "https://www.danaadobe.org/wp-content/uploads/2023/11/Dana-Descendants.pdf";

export const mariaJosefaCarrilloSources: SourceChunk[] = [
  {
    id: "bio-identity",
    text: "María Josefa Carrillo de Dana — listed on the Dana Adobe descendants chart as María Josefa Petra del Carmen Carrillo — was the eldest daughter of Don Carlos Antonio Carrillo and María Josefa (née Castro) Carrillo of Santa Barbara, and the wife of Capt. William Goodwin Dana of Rancho Nipomo. She is the woman of the adobe, not a published memoirist; most of what survives about her comes through the county history, travelers to the house, and later family lists.",
    topics: [
      "biography",
      "who are you",
      "yourself",
      "identity",
      "maria josefa carrillo",
      "senora dana",
    ],
    dateRange: "1812-1883",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), 'Marriage and Family of Mrs. Dana'; Dana Adobe, Dana Descendants (updated 2023).",
    url: DANA_DESCENDANTS,
    reliability: "high",
  },
  {
    id: "bio-birth-santa-barbara",
    text: "The Dana Adobe descendants list gives her birth as 29 June 1812 in Santa Barbara, California, and her death as 25 September 1883 in Nipomo, buried at Old Mission Cemetery, San Luis Obispo. The partner history page states she died in 1883 at the age of 71.",
    topics: [
      "birth",
      "june 29 1812",
      "santa barbara",
      "death",
      "1883",
      "age 71",
    ],
    dateRange: "1812-1883",
    sourceType: "biographical",
    citation:
      "Dana Adobe, Dana Descendants (b. 29 Jun 1812 Santa Barbara; d. 25 Sep 1883 Nipomo); Dana Adobe, History page.",
    url: DANA_DESCENDANTS,
    reliability: "high",
  },
  {
    id: "bio-parents-carrillo",
    text: "Her father was Don Carlos Antonio Carrillo, resident of the Santa Barbara presidio, later an Alta California governor and Mexican federal legislator. Her mother was María Josefa (née Castro) Carrillo, whom Angel calls sister of General Castro. Her grandfather Don Raymundo Carrillo was among the first commanders of the posts of San Diego and Santa Barbara and founder of the family in California; he married Tomasa Lugo, daughter of an early soldier at Santa Barbara.",
    topics: [
      "carlos antonio carrillo",
      "parents",
      "raymundo carrillo",
      "castro",
      "tomasa lugo",
      "presidio",
    ],
    dateRange: "1812-1852",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), Carrillo family; Dana Adobe, History page.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "bio-sisters",
    text: "Angel names five daughters of Don Carlos Antonio Carrillo who married Americans: María Josefa (Capt. William G. Dana); Encarnación (Capt. Thomas M. Robbins); Francisca (Capt. A. B. Thompson); Manuela (John C. Jones, U.S. consul at Honolulu, later Mrs. M. C. Kettle); and María Antonia (Lewis T. Burton). A San Luis Obispo Tribune notice of May 18, 1883, reprinted by Angel, describes Manuela's return after thirty-eight years to find all her sisters except Mrs. Dana dead, and an affecting meeting between the two.",
    topics: [
      "sisters",
      "encarnacion",
      "robbins",
      "manuela",
      "jones",
      "thompson",
      "burton",
    ],
    dateRange: "1828-1883",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), Carrillo daughters and Tribune notice of 18 May 1883.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "bio-marriage-1828",
    text: "The marriage was solemnized at Santa Barbara on August 20, 1828. Dana had to become a naturalized Mexican citizen and marry in the Catholic Church. She was sixteen (born 29 June 1812); he was thirty-one (born 5 May 1797). The sources record the date, the petition to Echeandía, and Cooper's complaint about the delay — not her private feelings.",
    topics: [
      "marriage",
      "august 20 1828",
      "sixteen",
      "catholic",
      "naturalization",
    ],
    dateRange: "20 Aug 1828",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), marriage 20 August 1828 and Cooper letter; Dana Adobe, Dana Descendants.",
    url: DANA_DESCENDANTS,
    reliability: "high",
  },
  {
    id: "bio-santa-barbara-years",
    text: "Dana had established business at Santa Barbara in 1825. After the 1828 marriage the couple remained based there while he closed Sandwich Islands affairs and, in 1835–1837, sought and received Rancho Nipomo. Angel says he continued in business in Santa Barbara, also carrying on the rancho, until the family moved to Nipomo in the fall of 1839. William C. Dana was born at Santa Barbara May 6, 1836; John Francis Dana on June 22, 1837, also at Santa Barbara.",
    topics: [
      "santa barbara",
      "store",
      "1828-1839",
      "william c dana",
      "john francis",
    ],
    dateRange: "1825-1839",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), Santa Barbara years, 1839 move, sons' birthplaces.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "rancho-grant-move",
    text: "Governor Alvarado granted Rancho Nipomo to Guillermo G. Dana on April 6, 1837. Angel, the California landmark, and Dana Adobe's published Norton article give about 38,000 acres (Angel: 37,887.91). Dana Adobe's home page says the rancho was initially more than 48,000 acres — treat acreage as contested; prefer ~38,000 and say the partner home page uses a larger first figure. The family moved from Santa Barbara in the fall of 1839. Partner pages: adobe built / construction begun 1839; a 1956 article they publish describes a U-shaped house of great adobe bricks, walls two feet thick, patio fig trees, kitchen in one wing, storehouse in the other, upper-floor dormitory for younger children. Their timeline dates wings and a second storey to 1851 — still unfolding in a speaking year of 1855. That adobe is her home.",
    topics: [
      "rancho nipomo",
      "1837",
      "1839",
      "adobe",
      "thirteen rooms",
      "grant",
    ],
    dateRange: "1837-1839",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883); California Historical Landmark #1033; Dana Adobe, Home page (initially more than 48,000 acres; built 1839); Dana Adobe, Gladys Norton, 'Looking Back' (1956), and site timeline (wings/second storey 1851).",
    url: DANA_HOME,
    reliability: "high",
  },
  {
    id: "nipomo-name-chumash",
    text: "Nipomo, in the partner history and in Angel, comes from a local Indian expression meaning at the foot of the hill. Chumash people lived on this coast for millennia; the last recorded member of the Nipomo village was baptized and taken to Mission La Purísima in 1804. The grant occupies former mission lands after secularization. A 1956 article Dana Adobe publishes (Gladys Norton) says the residence was built by Indian labor of adobe bricks with walls two feet thick. Do not invent tribal names or ceremonies; label labor as the partner article states it, incomplete in detail.",
    topics: [
      "nipomo",
      "chumash",
      "la purisima",
      "1804",
      "place name",
      "secularization",
    ],
    dateRange: "to 1839",
    sourceType: "secondary",
    citation:
      "Dana Adobe, History page, Chumash Era and Rancho Era; Angel, History of San Luis Obispo County (1883), Nipomo name; Dana Adobe, Gladys Norton, 'Looking Back' (1956), on danaadobe.org.",
    url: DANA_HISTORY,
    reliability: "medium",
  },
  {
    id: "hospitality-hostess",
    text: "From 1839 until the Captain's death in 1858, Rancho Nipomo was known as a hospitable stopping place on El Camino Real south of Mission San Luis Obispo. Travelers named in the landmark text include Frémont, Edwin Bryant, and Halleck. Angel describes free meals, lodging, relay horses, and guides — Californio hospitality of which this rancho was a conspicuous example. As woman of the house she is the hostess of that welcome, even when the published praise names the Captain.",
    topics: [
      "hospitality",
      "el camino real",
      "travelers",
      "hostess",
      "adobe",
    ],
    dateRange: "1839-1858",
    sourceType: "secondary",
    citation:
      "California Historical Landmark #1033; Angel, History of San Luis Obispo County (1883), hospitality.",
    url: OHP_1033,
    reliability: "high",
  },
  {
    id: "bryant-1846-house",
    text: "On December 18, 1846, Edwin Bryant encamped near the rancho of Captain Dana and wrote that Dana was esteemed throughout California for intelligence, private virtues, and unbounded generosity and hospitality. He bought wheat bread at the rancho for Frémont's men. Bryant does not name María Josefa, but the bread and welcome are the work of the house she kept.",
    topics: [
      "bryant",
      "december 1846",
      "wheat bread",
      "hospitality",
      "fremont",
    ],
    dateRange: "18 Dec 1846",
    sourceType: "primary",
    citation:
      "Edwin Bryant, What I Saw in California (1848), 18 December 1846.",
    url: BRYANT_1848,
    reliability: "high",
  },
  {
    id: "mail-1847",
    text: "In 1847 the Dana ranch became an exchange point on California's first U.S. mail route. Dana Adobe publishes Gladys Norton's 1956 account of General S. W. Kearny's order of April 19, 1847: mail carried on horseback by two soldiers, starting every other Monday from San Diego and San Francisco, the parties to meet at Captain Dana's ranch the next Sunday to exchange mails. The California landmark text also names the 1847 U.S. mail exchange.",
    topics: ["mail", "1847", "postal", "exchange point"],
    dateRange: "1847",
    sourceType: "reference",
    citation:
      "California Historical Landmark #1033; Dana Adobe, Gladys Norton, 'Looking Back' (1956), quoting Kearny's 19 April 1847 mail order.",
    url: DANA_NORTON,
    reliability: "high",
  },
  {
    id: "manufactures-household",
    text: "Angel records soap-making, looms for cloth, serapes, and blankets, furniture from Pacific woods, a blacksmith shop, and improved plows at Nipomo, supplying the household, neighboring ranchos, and the missions of La Purísima and Santa Ynez. These are the industries of the place she ran as a working rancho, not a decorative backdrop.",
    topics: [
      "soap",
      "looms",
      "blankets",
      "furniture",
      "rancho work",
      "missions",
    ],
    dateRange: "1839-1855",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), manufactures at Nipomo.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "captain-illness",
    text: "Angel says that during many later years Captain Dana was a great sufferer from rheumatism, which grew more painful until he was confined to the house, paralyzed and helpless, until his death on February 12, 1858. In a speaking year of 1855 that illness is present and worsening; the death itself is still ahead.",
    topics: [
      "rheumatism",
      "illness",
      "captain dana",
      "paralyzed",
      "1850s",
    ],
    dateRange: "1850s",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), Dana's rheumatism and confinement.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "children-tally",
    text: "Captain and Mrs. Dana were the parents of twenty-one children, of whom eight died in infancy and thirteen reached adulthood (Dana Adobe history page; Angel 1883). Angel, writing in 1883 after her death year, lists living children then on the estate and notes Mrs. S. A. Pollard (María Josefa Dana) died in 1878. The completed tally is a later family record; in 1855 the family is still growing. Handle infant deaths briefly and without graphic detail.",
    topics: ["children", "family", "twenty-one", "thirteen", "infancy"],
    dateRange: "1829-1883",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883); Dana Adobe, History page (21 children / 13 adults).",
    url: DANA_HISTORY,
    reliability: "high",
  },
  {
    id: "language-household",
    text: "This was a Californio–Yankee household on a Mexican grant. Angel notes that son William C. Dana, elected county clerk in 1857 at twenty-one, was not as familiar with English as with Spanish and appointed a deputy while he went to school at Benicia. That is evidence the family's household language included Spanish; it does not prove María Josefa spoke no English.",
    topics: [
      "spanish",
      "language",
      "californio",
      "william c dana",
      "english",
    ],
    dateRange: "1839-1857",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), sketch of William C. Dana (Spanish stronger than English in 1857).",
    url: ANGEL_1883,
    reliability: "medium",
  },
  {
    id: "captain-death-burial",
    text: "Captain Dana died 12 February 1858 and was buried in the Catholic cemetery of San Luis Obispo (Old Mission Cemetery), where Angel says a handsome monument marked his grave. The descendants list places both husband and wife at Old Mission Cemetery, SLO. From a speaking year of 1855, his death is not yet lived.",
    topics: [
      "death",
      "february 12 1858",
      "burial",
      "old mission cemetery",
    ],
    dateRange: "1858",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883); Dana Adobe, Dana Descendants; Landmark #1033 (Dana's death 1858).",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "widow-years-legacy",
    text: "After the Captain's death, Angel says John F. Dana served as trustee of the estate for twenty years until the ranch was divided. Angel, in 1883, describes an elegant home of modern architecture built for 'the venerable and venerated mother,' conspicuous from the passing train — a later wooden house, not the 1839 adobe. Dana Adobe publishes that in 1881 the widow gave the Pacific Coast Railway a right-of-way ten miles long and sixty feet wide, receiving free rides for the rest of her life; a depot was then built on the ranch and the village of Nipomo laid out. The descendants list gives her death as 25 September 1883 at Nipomo, age 71. All of this lies after 1855.",
    topics: [
      "widow",
      "trustee",
      "john f dana",
      "wooden house",
      "1883",
      "september 25",
    ],
    dateRange: "1858-1883",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), John F. Dana trustee and later house for Mrs. Dana; Dana Adobe, Gladys Norton, 'Looking Back' (1956) (1881 railway right-of-way); Dana Adobe, Descendants list.",
    url: DANA_NORTON,
    reliability: "high",
  },
  {
    id: "thin-first-person-record",
    text: "Unlike her husband, María Josefa left no published memoir in this source pack. Angel's 1883 sketch of 'Mrs. Dana' is a family chapter written after her death year; Bryant praises the Captain's hospitality without naming her; the partner site gives lifespan, marriage, 21 children / 13 adults, burial with the Captain, house layout, and (via Norton quoting Hutton) a visitor's 1850 picture of the household. Gaps (letters in her own hand, private feelings, uncorroborated later anecdotes) should be admitted rather than filled.",
    topics: [
      "sources",
      "memoir",
      "gaps",
      "record",
      "evidence",
    ],
    dateRange: "1812-1883",
    sourceType: "persona-note",
    citation:
      "Source-pack note: first-person published material is thin; grounding is Angel 1883, Bryant 1848, Landmark #1033, and Dana Adobe (home, history, family, Norton 1956, descendants).",
    url: DANA_HISTORY,
    reliability: "high",
  },
  {
    id: "edith-house-1848",
    text: "In 1848, after the U.S. steamship Edith went ashore between Point Arguello and Point Sal, Angel records that Captain Dana brought officers and crew to the Nipomo house for two or three weeks, then sent them on to Monterey with horses and guides. Several officers stayed some months. The work of feeding and lodging them fell on the household.",
    topics: [
      "edith",
      "shipwreck",
      "1848",
      "hospitality",
      "officers",
    ],
    dateRange: "1848",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), steamship Edith wreck.",
    url: ANGEL_1883,
    reliability: "medium",
  },
  {
    id: "sister-encarnacion-robbins",
    text: "Encarnación Carrillo, María Josefa's sister, married Capt. Thomas M. Robbins, former mate of Dana's Waverly and later commander of the schooner Santa Barbara that Dana built at Goleta. Robbins became a Santa Barbara resident, owner of Las Positas Rancho, and grantee of Santa Catalina Island. That is documented kin, not a later Encarnación-at-Nipomo anecdote from an uncorroborated essay.",
    topics: [
      "encarnacion",
      "robbins",
      "sister",
      "goleta",
      "santa catalina",
    ],
    dateRange: "1828-1855",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), Robbins marriage to Encarnación Carrillo and Goleta schooner.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "sons-born-santa-barbara",
    text: "William C. Dana, called by Angel the eldest son, was born at Santa Barbara on May 6, 1836; the family moved to Nipomo soon thereafter (fall 1839 in the father's sketch). John Francis Dana was born at Santa Barbara June 22, 1837, and grew up on the rancho after 1839.",
    topics: [
      "william c dana",
      "john francis dana",
      "children",
      "1836",
      "1837",
      "santa barbara",
    ],
    dateRange: "1836-1839",
    sourceType: "biographical",
    citation:
      "Angel, History of San Luis Obispo County (1883), sketches of William C. Dana and John F. Dana.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "jornadas-road",
    text: "Angel gives the regular stopping places on the road between San Luis Obispo and Santa Barbara as Nipomo (about 24 miles from San Luis), then 21 miles to Los Alamos, then 20 miles to Santa Ynez Mission, then Refugio, then Santa Barbara. The adobe sat on a rise with a view of the valley toward the Santa Lucia.",
    topics: [
      "jornada",
      "el camino real",
      "los alamos",
      "santa ynez",
      "refugio",
      "road",
    ],
    dateRange: "1839-1855",
    sourceType: "secondary",
    citation:
      "Angel, History of San Luis Obispo County (1883), jornadas south of San Luis Obispo.",
    url: ANGEL_1883,
    reliability: "high",
  },
  {
    id: "partner-landscape",
    text: "Dana Adobe's history page places the house at the eastern edge of ancient sand dunes that stretch six miles from the coast, with adobe clay from the Temetatte Hills washing into Nipomo Creek to the east. Much of the property, they say, is like it was nearly 200 years ago when Captain Dana first arrived in Nipomo. The home page notes an original tallow vat still on the historic park, along with a Mission grape vineyard and gardens — later park features except the vat, which belongs to the hide-and-tallow work of the rancho.",
    topics: [
      "landscape",
      "sand dunes",
      "temetatte",
      "nipomo creek",
      "tallow vat",
      "nature",
    ],
    dateRange: "1839-1858",
    sourceType: "secondary",
    citation:
      "Dana Adobe, History page; Dana Adobe, Home page (tallow vat, vineyard, gardens).",
    url: DANA_HISTORY,
    reliability: "high",
  },
  {
    id: "partner-spanish-mexican",
    text: "Dana Adobe's history page: the first Spanish ship along this coast in 1542; in 1769 Spain established the first of 21 California missions, bringing Catholicism, new animals, disease, and agricultural change that dramatically affected indigenous peoples. Mexico's independence from Spain is dated 1821; under Mexican rule, efforts to increase California's population led to the ranchos. Twelve years after independence, secularization confiscated former mission lands and, from the 1830s, distributed them to select Mexican citizens — the setting for the 1835 application and 1837 grant.",
    topics: [
      "spanish era",
      "1769",
      "missions",
      "mexico",
      "1821",
      "secularization",
      "ranchos",
    ],
    dateRange: "1542-1837",
    sourceType: "secondary",
    citation: "Dana Adobe, History page, Spanish Era and Rancho Era.",
    url: DANA_HISTORY,
    reliability: "high",
  },
  {
    id: "partner-1849-polling",
    text: "Dana Adobe publishes that in 1849 Nipomo Rancho was one of the voting places that helped decide statehood for California, and later a post office and a stagecoach stop. Their timeline dates the first stagecoach horse-change at the Casa de Dana barn to 1857 — after a speaking year of 1855, treat the stage stop as just beginning or still ahead.",
    topics: [
      "1849",
      "voting",
      "statehood",
      "polling place",
      "post office",
      "stagecoach",
      "1857",
    ],
    dateRange: "1849-1857",
    sourceType: "secondary",
    citation:
      "Dana Adobe, Gladys Norton, 'Looking Back' (1956), and site timeline, on danaadobe.org.",
    url: DANA_NORTON,
    reliability: "medium",
  },
  {
    id: "partner-daughter-tefft",
    text: "Dana Adobe publishes Gladys Norton's 1956 account: when guests assembled in numbers, as at the wedding of María Josefa Dana (the daughter) and Henry Amos Tefft, they passed the night on their saddle blankets on the front porch. Norton names Tefft as a delegate who helped draft California's first constitution, first Assemblyman from San Luis Obispo County, later District Judge, and says Henry Tefft and his wife lived at Casa de Dana. William Rich Hutton, writing in 1850 (quoted on the same partner page), called Captain Dana an excellent good-natured old gentleman and Mrs. Tefft a favorite with all who know her; he noted milk and fresh butter from some thirty or forty tame cows, and that though she had few books she knew them by heart, among them Moratín's comedies. From a speaking year of 1855 this household picture is recent memory, not later invention — still Norton quoting Hutton, not a letter in María Josefa's own hand.",
    topics: [
      "tefft",
      "wedding",
      "daughter",
      "henry amos tefft",
      "hutton",
      "1850",
      "porch",
      "books",
      "moratin",
    ],
    dateRange: "1849-1855",
    sourceType: "secondary",
    citation:
      "Dana Adobe, Gladys Norton, 'Looking Back' (1956), quoting William Rich Hutton (1850), on danaadobe.org.",
    url: DANA_NORTON,
    reliability: "medium",
  },
  {
    id: "partner-portraits",
    text: "Dana Adobe publishes oval portraits of Captain William Goodwin Dana and María Josefa Carrillo Dana on its Dana Family page. Those are the likenesses used for these figures. The photograph of María Josefa shows her later than a speaking year of 1855; say so if asked. They are not pictures of the adobe.",
    topics: ["portrait", "likeness", "appearance", "family page"],
    dateRange: "mid-to-late 19th century",
    sourceType: "secondary",
    citation: "Dana Adobe, Dana Family page, portraits of Captain Dana and María Josefa.",
    url: DANA_FAMILY,
    reliability: "high",
  },
];
