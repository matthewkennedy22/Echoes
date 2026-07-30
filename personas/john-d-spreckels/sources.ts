import type { SourceChunk } from "@/lib/types";

/**
 * SERVER-ONLY source pack for John D. Spreckels (Coronado focus).
 *
 * Grounding prefers primary / near-primary published sources:
 *  - Samuel T. Black, San Diego County California (1913), v.2 bio
 *  - William E. Smythe, History of San Diego (1908)
 *  - Hotel del Coronado historical timeline
 *  - City of San Diego digital archives (Tent City)
 *  - Glorietta Bay Inn history (mansion)
 *
 * Do not cite Wikipedia for grounding.
 * Speaking year: 1912. Death (1926) and SD&A completion (1919) are not firsthand.
 */

const BLACK =
  "https://archive.org/details/sandiegocountyca02blac";
const SMYTHE =
  "https://archive.org/details/historysandiego00smyt";
const HOTEL_DEL =
  "https://www.hoteldel.com/timeline/owner-john-d-spreckels-1890-1926/";
const TENT_CITY =
  "https://www.sandiego.gov/digitalarchives/community/lesson-plans/events/tent-city";
const GLORIETTA =
  "https://www.gloriettabayinn.com/history.php";
const SDHC =
  "https://sandiegohistory.org/archives/biographysubject/spreckels/";

export const spreckelsSources: SourceChunk[] = [
  // ---------------- Biography ----------------
  {
    id: "bio-birth",
    text: "John Diedrich Spreckels was born in Charleston, South Carolina, on August 16, 1853, the son of Claus Spreckels and Annie Christina Spreckels. The family moved to New York about 1854 and then to San Francisco.",
    topics: ["biography", "birth", "who are you", "yourself", "identity", "charleston"],
    dateRange: "1853-1856",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (Chicago: S. J. Clark, 1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-education",
    text: "Spreckels attended schools in San Francisco, then Oakland College for about three years, and studied mechanical engineering and chemistry at the Polytechnic College in Hanover, Germany, until 1872.",
    topics: ["biography", "education", "hanover", "oakland", "germany", "who are you"],
    dateRange: "to 1872",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-father-claus",
    text: "John's father was Claus Spreckels (often called the Sugar King), a German-born industrialist. Claus emigrated to the United States in the mid-19th century, worked in grocery and related trades, settled in San Francisco by the mid-1850s, and later built a major sugar refining and beet-sugar empire — not an overnight entry into sugar upon arrival.",
    topics: ["claus spreckels", "father", "sugar king", "germany", "biography", "dad", "claud"],
    dateRange: "1848-1870s",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2 (Claus as father / sugar context).; standard Claus Spreckels biographical outlines (emigration and San Francisco grocery/brewing before sugar refining).",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-father-sugar",
    text: "After returning from Germany, John trained in his father Claus Spreckels's sugar refining business in San Francisco, beginning as a laborer and rising to superintendent, then laboratory work analyzing sugar — family wealth and networks that later supported John's own shipping and Coronado investments (a connection of opportunity, not a simple cause-and-effect claim).",
    topics: ["biography", "sugar", "claus spreckels", "san francisco", "refinery", "father"],
    dateRange: "1872-1876",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-hawaii",
    text: "In 1876 Spreckels was sent to the Hawaiian (Sandwich) Islands to analyze sugar; later he returned to erect a sugar mill and develop a plantation for his father, supervising construction and operation for months.",
    topics: ["biography", "hawaii", "sandwich islands", "sugar", "plantation"],
    dateRange: "1876-1880",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-oceanic",
    text: "Spreckels organized J. D. Spreckels & Brothers as commercial importers with sailing vessels between Hawaii and San Francisco. In 1882 he established a steamship line to Honolulu; by 1884 a line ran from San Francisco to Australia and New Zealand (Oceanic Steamship interests).",
    topics: ["biography", "oceanic", "steamship", "shipping", "hawaii", "australia"],
    dateRange: "1880-1884",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-marriage",
    text: "In October 1877, in Hoboken, New Jersey, Spreckels married Miss Siebein (Lillie Siebein). They had four children: Grace, Lily (Lillie), John D., Jr., and Claus.",
    topics: ["biography", "marriage", "family", "lillie", "children"],
    dateRange: "1877",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-lurline-1887",
    text: "Spreckels's lasting identification with San Diego began when he arrived on a pleasure trip in his yacht Lurline in the summer of 1887, guiding the yacht into San Diego Bay. Impressed by the harbor and climate, he decided to establish commercial interests there.",
    topics: ["biography", "lurline", "yacht", "1887", "san diego bay", "who are you", "yourself"],
    dateRange: "1887",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-wharf-coal",
    text: "One of Spreckels's first San Diego activities was building a wharf with modern coal bunkers and shipping coal to supply the Santa Fe railroad interests, which owed him large sums and depended on his coal in a difficult period.",
    topics: ["wharf", "coal", "santa fe", "broadway", "san diego", "harbor"],
    dateRange: "1887-1890s",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-babcock-hinde",
    text: "Spreckels associated E. S. Babcock, a prominent local businessman, and Captain C. T. Hinde (formerly of St. Louis steamship business) as local managers while Spreckels financed undertakings — a partnership that led into Coronado Beach Company affairs.",
    topics: ["babcock", "hinde", "partners", "coronado beach company", "managers"],
    dateRange: "late 1880s",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "bio-move-after-quake",
    text: "After the 1906 San Francisco earthquake, Spreckels moved his family's permanent residence to the San Diego–Coronado area, making Coronado home while continuing vast San Diego investments.",
    topics: ["1906", "earthquake", "san francisco", "move", "coronado", "home", "who are you"],
    dateRange: "1906",
    sourceType: "biographical",
    citation:
      "San Diego History Center biographical sketch, John D. Spreckels (1853–1926).; Black, San Diego County (1913).",
    url: SDHC,
    reliability: "high",
  },
  {
    id: "bio-speaking-year-1912",
    text: "In 1912 Spreckels speaks from Coronado as a settled resident of the Glorietta Bay mansion (completed 1908), owner of the Hotel del Coronado and Tent City (since 1900), and operator of the San Diego–Coronado ferry — about fifty-nine years old, with Tent City in full summer operation.",
    topics: ["1912", "speaking year", "present", "coronado", "who are you", "what year"],
    dateRange: "1912",
    sourceType: "biographical",
    citation:
      "Composite of Black (1913) residence/ownership timeline; Glorietta Bay Inn mansion dating; City of San Diego Tent City notes — framed to the 1912 speaking year.",
    url: GLORIETTA,
    reliability: "high",
  },
  {
    id: "bio-wealthiest",
    text: "In the decades after settling his interests in San Diego, Spreckels became many times a millionaire and was widely regarded as the wealthiest man in San Diego, employing thousands and paying a large share of local property taxes.",
    topics: ["wealth", "taxes", "employer", "san diego", "biography"],
    dateRange: "1890s-1912",
    sourceType: "biographical",
    citation:
      "San Diego History Center biographical sketch, John D. Spreckels (1853–1926).",
    url: SDHC,
    reliability: "medium",
  },

  // ---------------- Hotel del Coronado / Coronado Beach Co. ----------------
  {
    id: "del-opened-1888",
    text: "The Hotel del Coronado was built by founders including E. S. Babcock and Hampton L. Story; construction began in the late 1880s and the hotel opened in 1888 — more than a decade before Tent City.",
    topics: ["hotel del coronado", "1888", "opened", "babcock", "story", "construction", "the del"],
    dateRange: "1887-1888",
    sourceType: "secondary",
    citation:
      "Hotel del Coronado historical timeline.; Samuel T. Black, San Diego County, California (1913).",
    url: HOTEL_DEL,
    reliability: "high",
  },
  {
    id: "del-founders-boom",
    text: "E. S. Babcock was interested in building the Hotel del Coronado; about the time it opened (1888), San Diego's boom burst. Inflated values collapsed and failure threatened the company owning the great hotel.",
    topics: ["hotel del coronado", "babcock", "boom", "bust", "1888", "the del"],
    dateRange: "1888-1889",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "del-spreckels-advances",
    text: "Spreckels advanced money to carry on every enterprise of the Coronado Beach Company — covering Hotel del Coronado and large landed interests — when the boom collapse endangered the resort.",
    topics: ["hotel del coronado", "coronado beach company", "loans", "rescue", "the del"],
    dateRange: "1888-1890",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2.; Hotel del Coronado timeline, Owner John D. Spreckels.",
    url: HOTEL_DEL,
    reliability: "high",
  },
  {
    id: "del-third-partner-1889",
    text: "Spreckels became a third partner in the Coronado Beach Company in 1889. Not long afterward he acquired the other two-thirds interests.",
    topics: ["coronado beach company", "ownership", "1889", "hotel del coronado", "partner"],
    dateRange: "1889",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "del-full-ownership",
    text: "Through the Coronado Beach Company Spreckels came into possession of the Hotel del Coronado (with related Coronado properties). Hotel del Coronado historians state he remained owner until his death in 1926, with the hotel staying in the family until 1948.",
    topics: ["hotel del coronado", "owner", "the del", "coronado", "ownership"],
    dateRange: "1890-1926",
    sourceType: "secondary",
    citation:
      "Hotel del Coronado timeline, Owner John D. Spreckels (1890–1926).; Black, San Diego County (1913).",
    url: HOTEL_DEL,
    reliability: "high",
  },
  {
    id: "del-babcock-story-credit",
    text: "Hotel del Coronado was founded by Elisha S. Babcock and Hampton L. Story (with associates). Spreckels's role was financial rescue and eventual complete ownership after the founders transferred control — he did not invent the hotel's original design.",
    topics: ["babcock", "story", "founders", "hotel del coronado", "credit"],
    dateRange: "1880s-1890",
    sourceType: "secondary",
    citation:
      "Hotel del Coronado timeline, Owner John D. Spreckels.; Black, San Diego County (1913).",
    url: HOTEL_DEL,
    reliability: "high",
  },
  {
    id: "coronado-lands-islands",
    text: "In connection with the Coronado Beach Company, Spreckels came into possession of half of all the property on South Island and all on North Island and Coronado Heights, along with related railroad and newspaper interests tied to the company.",
    topics: ["north island", "south island", "coronado heights", "land", "coronado beach company"],
    dateRange: "1890s",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },

  // ---------------- Tent City ----------------
  {
    id: "tent-city-1900",
    text: "In 1900 — twelve years after the Hotel del Coronado opened in 1888 — Spreckels / the Coronado Beach Company established Coronado Tent City: a large summertime campground of several hundred tents and thatched-roof cottages south of the Del on the Silver Strand, as an affordable resort adjunct for guests who could not (or preferred not to) pay grand-hotel rates.",
    topics: ["tent city", "1900", "strand", "summer", "resort", "coronado", "cottages", "why", "create", "founded"],
    dateRange: "1900",
    sourceType: "secondary",
    citation:
      "Hotel del Coronado timeline, Tent City Opens (1900).; City of San Diego Digital Archives, Tent City.",
    url: "https://www.hoteldel.com/timeline/tent-city-opens/",
    reliability: "high",
  },
  {
    id: "tent-city-not-original-construction",
    text: "CRITICAL CHRONOLOGY: Tent City was NOT created to house tourists while the Hotel del Coronado was first being built in 1887–1888. The Del opened in 1888; Tent City opened in 1900. Some later accounts link the 1900 launch to hotel renovation/remodeling that year or to demand for cheaper summer lodging beside the already-open Del — not to the original 1880s construction camp.",
    topics: [
      "tent city",
      "construction",
      "renovation",
      "1888",
      "1900",
      "hotel del coronado",
      "why",
      "create",
      "chronology",
      "contested",
    ],
    dateRange: "1888-1900",
    sourceType: "secondary",
    citation:
      "Hotel del Coronado timeline (Del opens 1888; Tent City 1900).; City of San Diego Digital Archives (notes renovation context in 1900).; San Diego Union-Tribune Tent City features summarizing competing origin stories.",
    url: "https://www.hoteldel.com/timeline/tent-city-opens/",
    reliability: "high",
  },
  {
    id: "tent-city-amenities",
    text: "Period Tent City promotions describe furnished tents with electric lights, boarded floors, beds and cots, bedding, wash-stand and mirror, tables and chairs, cooking utensils, clean linen, and tent care — plus restaurants, shops, and beach entertainment. Water and sanitary systems served the camp; do not overclaim that every tent had private modern piped plumbing equivalent to a hotel bath.",
    topics: ["tent city", "amenities", "electricity", "water", "entertainment", "beach", "furnished"],
    dateRange: "1900-1912",
    sourceType: "primary",
    citation:
      "Hotel del Coronado timeline quoting early Tent City brochure accommodations.; City of San Diego Digital Archives, Tent City.",
    url: "https://www.hoteldel.com/timeline/tent-city-opens/",
    reliability: "high",
  },
  {
    id: "later-monte-carlo-ship",
    text: "LEGACY-BRIDGE FACT (after Spreckels's 1912 speaking year and after his 1926 death): The vessel later known as the SS Monte Carlo became notorious as a gambling ship / floating casino off the San Diego–Coronado coast in the mid-1930s and was wrecked ashore in early 1937. Spreckels had no involvement — the episode is entirely after his time. When asked: deny any personal role; frame the ship as later record, not memory; label inference; do not attach Tent City or Del photos unless they depict the ship.",
    topics: [
      "monte carlo",
      "ss monte carlo",
      "gambling ship",
      "casino",
      "criminal",
      "fairy",
      "offshore",
      "later",
      "after my time",
    ],
    dateRange: "1932-1937 (post-speaking-year / post-death)",
    sourceType: "secondary",
    citation:
      "Later Coronado / San Diego coastal history of the SS Monte Carlo gambling ship (1930s) — for legacy-bridge framing only; not firsthand 1912 knowledge.",
    url: "https://www.sandiego.gov/digitalarchives",
    reliability: "medium",
  },
  {
    id: "tent-city-smythe",
    text: "William E. Smythe's History of San Diego illustrated and treated Coronado Tent City as a notable feature of the resort landscape associated with Coronado Beach and the hotel district.",
    topics: ["tent city", "smythe", "coronado beach", "illustration"],
    dateRange: "pre-1908",
    sourceType: "primary",
    citation:
      "William E. Smythe, History of San Diego, 1542–1908 (San Diego: The History Company, 1908), list of illustrations / Coronado Tent City.",
    url: SMYTHE,
    reliability: "high",
  },
  {
    id: "tent-city-season",
    text: "Tent City operated as a seasonal summer resort for decades after 1900 (into the 1930s). From Spreckels's 1912 vantage, it is a thriving summer city of tents and palm-thatched cottages below the Del — not yet closed.",
    topics: ["tent city", "season", "summer", "1912", "strand"],
    dateRange: "1900-1912",
    sourceType: "secondary",
    citation:
      "City of San Diego Digital Archives, Tent City (notes closure 1939 for highway — post-speaking-year).",
    url: TENT_CITY,
    reliability: "high",
  },

  // ---------------- Ferry / rail / transit ----------------
  {
    id: "ferry-system",
    text: "Spreckels owned and operated the San Diego and Coronado Ferry Company (and related transfer companies), linking downtown San Diego with Coronado across the bay — essential to resort and resident traffic before a bridge era.",
    topics: ["ferry", "san diego and coronado ferry", "bay", "transportation", "coronado"],
    dateRange: "1890s-1912",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), corporate interests list / San Diego History Center Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "coronado-belt-line",
    text: "The Coronado Belt Line was constructed by the Coronado Beach Company in connection with hotel development. It extended from the Coronado Ferry wharf along the bay shore toward San Diego connections — over twenty miles of belt railway associated with Coronado resort traffic.",
    topics: ["coronado belt", "railroad", "ferry wharf", "coronado beach company"],
    dateRange: "1880s-1890s",
    sourceType: "primary",
    citation:
      "William E. Smythe, History of San Diego, 1542–1908 (1908), discussion of Coronado Belt Line / Coronado Beach Company railroads.",
    url: SMYTHE,
    reliability: "high",
  },
  {
    id: "electric-railway-1892",
    text: "Spreckels acquired San Diego street railway interests and in 1892 converted lines from horse power to electricity, founding the electrified San Diego Electric Railway era that linked downtown with outlying communities.",
    topics: ["electric railway", "streetcar", "1892", "sdery", "trolley"],
    dateRange: "1892",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2.; San Diego History Center Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "rebuild-streetcars-1901",
    text: "In 1901–1902, while San Diego had not fully recovered from the boom collapse, Spreckels rebuilt the entire street car system — a public signal of faith that put new heart into townspeople.",
    topics: ["streetcar", "1901", "1902", "rebuild", "faith", "san diego"],
    dateRange: "1901-1902",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "transport-philosophy",
    text: "Spreckels's transit philosophy held that before people will live in outlying places, you must show they can get there quickly, comfortably, and cheaply — transportation determines the flow of population.",
    topics: ["transportation", "philosophy", "streetcar", "population", "quote"],
    dateRange: "1890s-1910s",
    sourceType: "secondary",
    citation:
      "Attributed Spreckels transit philosophy as quoted in San Diego Electric Railway historical summaries (Class 1 Streetcars / SDERy histories).",
    url: "https://sandiegohistoricstreetcars.org/",
    reliability: "medium",
  },

  // ---------------- Mansion / Glorietta ----------------
  {
    id: "mansion-glorietta",
    text: "Spreckels's Coronado residence was the Spreckels Mansion at 1630 Glorietta Boulevard, overlooking Glorietta Bay across from the Hotel del Coronado. Architect Harrison Albright designed it; completed in 1908 at a reported cost of about $35,000, with Italian Renaissance lines, six bedrooms, and modern comforts including a brass-cage elevator.",
    topics: ["mansion", "glorietta", "glorietta bay", "home", "albright", "1908", "inn"],
    dateRange: "1906-1908",
    sourceType: "secondary",
    citation:
      "Glorietta Bay Inn, History of the Inn (Spreckels Mansion).; period architectural accounts.",
    url: GLORIETTA,
    reliability: "high",
  },
  {
    id: "mansion-earthquake-proof",
    text: "After living through the 1906 San Francisco earthquake, Spreckels insisted the Coronado mansion be built with reinforced steel and concrete as an earthquake precaution.",
    topics: ["mansion", "earthquake", "concrete", "1906", "construction"],
    dateRange: "1906-1908",
    sourceType: "secondary",
    citation:
      "Glorietta Bay Inn, History of the Inn (Spreckels Mansion).",
    url: GLORIETTA,
    reliability: "high",
  },
  {
    id: "claus-beach-house",
    text: "In 1910 Spreckels built a Coronado beach house at 1043 Ocean Boulevard, also designed by Harrison Albright, as a wedding present for his son Claus.",
    topics: ["claus", "ocean boulevard", "beach house", "1910", "wedding", "albright"],
    dateRange: "1910",
    sourceType: "secondary",
    citation:
      "Glorietta Bay Inn / Coronado mansion histories summarizing Spreckels family Coronado houses.",
    url: GLORIETTA,
    reliability: "medium",
  },

  // ---------------- Water, press, downtown (supporting) ----------------
  {
    id: "water-company",
    text: "Spreckels organized the Southern California Mountain Water Company, which built Morena and Otay reservoir works and pipelines; water began flowing abundantly into San Diego on August 6, 1906. He later sold the water system to the city for about four million dollars — its reported actual cost — believing cities should own their waterworks.",
    topics: ["water", "morena", "otay", "mountain water", "1906", "pipeline"],
    dateRange: "1900s",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "newspapers",
    text: "Spreckels acquired the San Diego Union through Coronado Beach Company connections and later the Evening Tribune (1901). He also owned the San Francisco Call for a time while still based partly in San Francisco.",
    topics: ["union", "tribune", "newspaper", "press", "san francisco call"],
    dateRange: "1890-1901",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913).; San Diego History Center Spreckels sketch.",
    url: SDHC,
    reliability: "high",
  },
  {
    id: "union-building-1908",
    text: "In 1908 Spreckels erected the Union Building — a six-story reinforced-concrete office building facing D Street between Second and Third, named for the San Diego Union — among the first of its kind in the city.",
    topics: ["union building", "1908", "downtown", "concrete", "d street"],
    dateRange: "1908",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "theatre-building-1912",
    text: "About 1910–1912 Spreckels began and completed a major theater and office building on D Street between First and Second — the Spreckels Theatre building — of reinforced concrete, costly and elaborately equipped, with hundreds of offices attached.",
    topics: ["spreckels theatre", "theater", "1912", "downtown", "playhouse"],
    dateRange: "1910-1912",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "sda-underway",
    text: "By Spreckels's 1912 speaking year, the San Diego & Arizona Railroad project — meant to give San Diego a direct eastern rail outlet via Imperial Valley connections — is underway under his presidency, but the famous golden-spike completion lies in the future (1919).",
    topics: ["san diego and arizona", "railroad", "impossible railroad", "1912", "under construction"],
    dateRange: "1906-1912",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913) (lists Spreckels as president of San Diego & Arizona Railroad Company).; later completion 1919 is post-speaking-year.",
    url: BLACK,
    reliability: "high",
  },

  // ---------------- Contested / caution ----------------
  {
    id: "contested-adams-flattery",
    text: "H. Austin Adams's authorized biography The Man, John D. Spreckels (1924) is a fawning contemporary life that later historians warn contains chronological errors and omits private family detail. Treat its praise as booster rhetoric, not as sole proof.",
    topics: ["adams", "biography", "contested", "flattery", "empire builder"],
    dateRange: "1924",
    sourceType: "secondary",
    citation:
      "H. Austin Adams, The Man, John D. Spreckels (San Diego: Press of Frye & Smith, 1924) — use cautiously; modern critiques note authorized flattery.",
    url: "https://sandiegohistory.pastperfectonline.com/Library/6C423AF1-0460-4869-8BC6-218894046927",
    reliability: "medium",
  },
  {
    id: "contested-free-speech",
    text: "During the San Diego free-speech conflicts of about 1911–1913, investigators and some newspapers alleged Spreckels-aligned business/press interests sided with anti-Wobbly vigilante pressure. The record is contested; do not invent private orders or motives beyond what sources state.",
    topics: ["free speech", "wobblies", "1912", "labor", "contested", "stingaree"],
    dateRange: "1911-1913",
    sourceType: "secondary",
    citation:
      "Period accounts of the San Diego free speech fight (Weinstock investigation summaries; later historical treatments).",
    url: SDHC,
    reliability: "medium",
  },
  {
    id: "identity-coronado-forefather",
    text: "Local memory often calls Spreckels 'Coronado's Forefather' for his ownership of the Del, Tent City, ferry links, and decades of island investment — a civic nickname used by Coronado Historical Association and local heritage storytelling.",
    topics: ["forefather", "coronado", "nickname", "who are you", "yourself", "identity"],
    dateRange: "legacy label",
    sourceType: "secondary",
    citation:
      "Coronado Historical Association / local heritage usage (e.g. 'Coronado's Forefather: John D. Spreckels' Bite of History).",
    url: "https://coronadohistory.org/",
    reliability: "medium",
  },
  {
    id: "presidents-companies",
    text: "By 1913 Spreckels was listed as president of numerous firms including Oceanic Steamship Company, Western Sugar Refinery interests, Coronado Beach Company, San Diego Electric Railway, San Diego & Arizona Railroad Company, and related Coronado ferry and water enterprises.",
    topics: ["president", "companies", "oceanic", "coronado beach company", "electric railway"],
    dateRange: "c. 1913",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
  {
    id: "mason-republican",
    text: "Spreckels was a prominent Mason (Oriental Lodge and higher York/Scottish Rite affiliations noted in Black) and gave his political allegiance to the Republican Party.",
    topics: ["mason", "republican", "politics", "fraternal"],
    dateRange: "to 1913",
    sourceType: "biographical",
    citation:
      "Samuel T. Black, San Diego County, California (1913), vol. 2, John D. Spreckels sketch.",
    url: BLACK,
    reliability: "high",
  },
];
