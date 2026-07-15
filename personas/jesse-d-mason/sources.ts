import type { SourceChunk } from "@/lib/types";

/**
 * SERVER-ONLY source pack for Jesse D. Mason.
 *
 * Facts verified against: Mason's 1883 History of Santa Barbara County
 * (Internet Archive), Wikipedia (Mission Santa Barbara, Chumash, Santa Barbara
 * history), standard California mission / rancho reference, and the Amador
 * Ledger Dispatch local-history article on Jesse Dimon Mason (drawing on the
 * Amador County Archives).
 */

const ARCHIVE_1883 = "https://archive.org/details/historyofsantaba00maso";
const LEDGER_BIO =
  "https://www.ledger.news/the-village-smithy-part-vi-ione-blacksmiths/article_23de0188-d009-11e9-815b-2b8339b7ef3d.html";
const WIKI_MISSION = "https://en.wikipedia.org/wiki/Mission_Santa_Barbara";
const WIKI_CHUMASH = "https://en.wikipedia.org/wiki/Chumash";
const WIKI_SB = "https://en.wikipedia.org/wiki/Santa_Barbara,_California";
const WIKI_PRESIDIO = "https://en.wikipedia.org/wiki/Presidio_of_Santa_Barbara";
const WIKI_VENTURA = "https://en.wikipedia.org/wiki/Ventura_County,_California";

export const masonSources: SourceChunk[] = [
  // ---------------- Biography / identity (honest thin record) ----------------
  {
    id: "bio-identity",
    text: "Jesse Dimon Mason is the named author of Thompson & West's History of Santa Barbara County, California (Oakland, 1883). A man of many talents in the fashion of his generation — schoolteacher, farmer, blacksmith, newspaper editor, and county historian — he is best understood as the county chronicler speaking through that volume.",
    topics: ["biography", "who are you", "yourself", "identity", "jesse d mason", "jesse dimon mason"],
    dateRange: "1883",
    sourceType: "biographical",
    citation:
      "Jesse D. Mason, History of Santa Barbara County, California (Oakland: Thompson & West, 1883); Amador Ledger Dispatch, 'The Village Smithy — Part VI: Ione Blacksmiths' (drawing on Amador County Archives).",
    url: ARCHIVE_1883,
    reliability: "high",
  },
  {
    id: "bio-new-hampshire",
    text: "Mason began his working life as a young schoolteacher in New Hampshire before emigrating to California about 1858–1859. The habits of the schoolroom — patience with facts, care with the written word — stayed with him through every later occupation.",
    topics: ["biography", "new hampshire", "schoolteacher", "youth", "early life", "came to california", "before california"],
    dateRange: "c. 1840s-1859",
    sourceType: "biographical",
    citation:
      "Amador Ledger Dispatch, 'The Village Smithy — Part VI: Ione Blacksmiths' (drawing on Amador County Archives).",
    url: LEDGER_BIO,
    reliability: "medium",
  },
  {
    id: "bio-amador-farm",
    text: "In California, Mason took up a 76.3-acre parcel in the Jackson Valley of Amador County, where he farmed and offered his services as a farrier and blacksmith. Directories and early Amador newspapers record him at the forge; his smithing likely ran alongside his ranching, for there is no mention of it after he left the county.",
    topics: ["biography", "amador", "jackson valley", "farm", "blacksmith", "farrier", "forge", "ranching"],
    dateRange: "c. 1859-1879",
    sourceType: "biographical",
    citation:
      "Amador Ledger Dispatch, 'The Village Smithy — Part VI: Ione Blacksmiths' (drawing on Amador County Archives).",
    url: LEDGER_BIO,
    reliability: "medium",
  },
  {
    id: "bio-amador-civic",
    text: "While in Amador County, Mason served as a trustee of the Buena Vista School District and stood as a candidate for State Senator on the Republican ticket in 1861. His literary gifts are evident in letters he wrote home to his mother, now preserved in the Amador County Archives.",
    topics: ["biography", "school trustee", "buena vista", "state senator", "republican", "1861", "letters", "mother", "civic"],
    dateRange: "1861-1879",
    sourceType: "biographical",
    citation:
      "Amador Ledger Dispatch, 'The Village Smithy — Part VI: Ione Blacksmiths'; letters held by the Amador County Archives.",
    url: LEDGER_BIO,
    reliability: "medium",
  },
  {
    id: "bio-oakland-editor",
    text: "About 1879–1880 Mason relocated to Oakland and took up the pen in place of farming. His journalistic career included editing the San Luis Obispo Tribune, the San Jose Herald, the San Jose Mercury, and the Los Gatos Mail — he was editor of the Mail when its first issue came off the press in 1884 — besides writing pieces for various periodicals.",
    topics: ["biography", "oakland", "editor", "journalist", "newspaper", "san luis obispo tribune", "san jose", "los gatos mail"],
    dateRange: "1879-1885",
    sourceType: "biographical",
    citation:
      "Amador Ledger Dispatch, 'The Village Smithy — Part VI: Ione Blacksmiths' (drawing on Amador County Archives).",
    url: LEDGER_BIO,
    reliability: "medium",
  },
  {
    id: "bio-amador-history",
    text: "Before the Santa Barbara volume, Mason wrote and edited Thompson & West's History of Amador County, California (1881). He then compiled the histories of Santa Barbara and Ventura counties in the 1883 volume, continuing the publisher's series of illustrated county histories.",
    topics: ["biography", "amador history", "1881", "thompson west", "county history", "author", "books"],
    dateRange: "1881-1883",
    sourceType: "biographical",
    citation:
      "Jesse D. Mason, History of Amador County, California (Oakland: Thompson & West, 1881); Amador Ledger Dispatch, 'The Village Smithy — Part VI: Ione Blacksmiths'.",
    url: LEDGER_BIO,
    reliability: "high",
  },
  {
    id: "bio-no-portrait",
    text: "No verified photograph of Jesse D. Mason is known to survive in public archives. The likeness offered for identity questions is an artist's impression in the style of an 1880s studio photograph, and should be described honestly as illustrative rather than authentic.",
    topics: ["biography", "portrait", "likeness", "identity", "yourself"],
    dateRange: "1885",
    sourceType: "persona-note",
    citation: "ECHOES persona note: no verified photograph of Mason located.",
    reliability: "medium",
  },
  {
    id: "philosophy-county-history",
    text: "Nineteenth-century California 'mug book' county histories mixed documentary narrative with paid biographical sketches of pioneers. Mason's 1883 volume belongs to that tradition: useful for names, places, and period viewpoints, but requiring critical reading for Native history and booster language.",
    topics: ["philosophy", "history writing", "sources", "method"],
    dateRange: "1883",
    sourceType: "secondary",
    citation:
      "General assessment of Thompson & West county histories; Mason 1883 title page and structure on Internet Archive.",
    url: ARCHIVE_1883,
    reliability: "medium",
  },

  // ---------------- The 1883 book ----------------
  {
    id: "county-book-1883",
    text: "History of Santa Barbara County, California; with Illustrations and Biographical Sketches of its Prominent Men and Pioneers was published by Thompson & West of Oakland in 1883, authored by Jesse D. Mason. The full public-domain text is on the Internet Archive.",
    topics: ["books", "1883 history", "santa barbara", "county", "who are you"],
    dateRange: "1883",
    sourceType: "primary",
    citation:
      "Jesse D. Mason, History of Santa Barbara County, California (Oakland: Thompson & West, 1883). Internet Archive identifier historyofsantaba00maso.",
    url: ARCHIVE_1883,
    reliability: "high",
  },
  {
    id: "county-ventura-linked",
    text: "Although Ventura County had been organized separately from Santa Barbara County in the early 1870s, Mason's 1883 Thompson & West volume still includes Ventura County history and biographical material bound with Santa Barbara — cover titles sometimes read as History of Santa Barbara & Ventura Counties.",
    topics: ["ventura", "county", "1883 history", "american period", "books"],
    dateRange: "1872-1883",
    sourceType: "primary",
    citation:
      "Mason 1883 volume contents / Open Library notes on Ventura material; Wikipedia: Ventura County, California.",
    url: ARCHIVE_1883,
    reliability: "high",
  },
  {
    id: "county-ventura-created",
    text: "Ventura County was created from the eastern portion of Santa Barbara County by the California Legislature in 1872 (effective 1873), with San Buenaventura as county seat — a recent administrative change still reflected in how the 1883 regional history was marketed and bound.",
    topics: ["ventura", "county", "american period", "government"],
    dateRange: "1872-1873",
    sourceType: "reference",
    citation: "Wikipedia: Ventura County, California.",
    url: WIKI_VENTURA,
    reliability: "high",
  },

  // ---------------- Mission Santa Barbara ----------------
  {
    id: "county-mission-founding",
    text: "Mission Santa Barbara was founded on December 4, 1786 — the feast of Saint Barbara — by Father Fermín Lasuén of the Franciscan order, as the tenth mission in Alta California. It is often called the 'Queen of the Missions.'",
    topics: ["mission", "mission santa barbara", "founding", "1786", "franciscan"],
    dateRange: "1786",
    sourceType: "reference",
    citation: "Wikipedia: Mission Santa Barbara; corroborated in Mason 1883 county history.",
    url: WIKI_MISSION,
    reliability: "high",
  },
  {
    id: "county-mission-serra-lasuen",
    text: "Junípero Serra had raised the cross at the Santa Barbara Presidio in 1782 and planned a mission there, but he died in 1784. It was Fermín Lasuén, his successor as president of the California missions, who founded Mission Santa Barbara in 1786.",
    topics: ["mission", "serra", "lasuén", "presidio", "founding"],
    dateRange: "1782-1786",
    sourceType: "reference",
    citation: "Wikipedia: Mission Santa Barbara.",
    url: WIKI_MISSION,
    reliability: "high",
  },
  {
    id: "county-mission-church-1812",
    text: "Earlier adobe churches at Mission Santa Barbara were replaced after the great earthquake of December 1812 destroyed the third church. The stone church completed around 1820 — with its twin towers and classical facade — became the enduring image of the mission.",
    topics: ["mission", "earthquake", "1812", "church", "architecture"],
    dateRange: "1812-1820",
    sourceType: "reference",
    citation: "Wikipedia: Mission Santa Barbara; National Register documentation.",
    url: WIKI_MISSION,
    reliability: "high",
  },
  {
    id: "county-mission-chumash-labor",
    text: "Mission Santa Barbara was built and maintained with the labor of Chumash people (often called Canalino or Barbareño in period sources). Adobe, tile, and later stone construction depended on Native work under the mission system.",
    topics: ["mission", "chumash", "labor", "building"],
    dateRange: "1786-1830s",
    sourceType: "reference",
    citation: "Wikipedia: Mission Santa Barbara; SAH Archipedia mission history.",
    url: WIKI_MISSION,
    reliability: "high",
  },
  {
    id: "county-mission-contested",
    text: "Mission history is contested. Spain sought to convert local Chumash communities and integrate them into the colonial economy. Livestock herds, epidemics, and military force meant many people had little real choice about entering mission life — a forced servitude that period boosters often softened or ignored.",
    topics: ["mission", "chumash", "contested", "colonization", "conversion"],
    dateRange: "1786-1834",
    sourceType: "reference",
    citation:
      "Wikipedia: Mission Santa Barbara (missionization and Chumash experience); treat Mason 1883 with critical caution on Native topics.",
    url: WIKI_MISSION,
    reliability: "high",
  },
  {
    id: "county-mission-secularization",
    text: "Under Mexican rule, California missions were secularized beginning in the 1830s (Santa Barbara secularized in 1834). Mission lands were broken up; unlike many missions that fell into ruin, Franciscans continued to occupy Santa Barbara's buildings through the transitional years.",
    topics: ["mission", "secularization", "mexican era", "franciscan"],
    dateRange: "1834-1846",
    sourceType: "reference",
    citation: "Wikipedia: Mission Santa Barbara; National Register nomination summary.",
    url: WIKI_MISSION,
    reliability: "high",
  },
  {
    id: "county-mission-returned-1865",
    text: "In 1865 the United States returned a portion of the original mission property — including the church and key buildings — to the Catholic Church. Mission Santa Barbara remained under continuous Franciscan guidance, unusual among California missions.",
    topics: ["mission", "american period", "1865", "catholic church"],
    dateRange: "1865",
    sourceType: "reference",
    citation: "Wikipedia: Mission Santa Barbara; National Register documentation.",
    url: WIKI_MISSION,
    reliability: "high",
  },

  // ---------------- Presidio & town ----------------
  {
    id: "county-presidio-1782",
    text: "El Presidio Real de Santa Bárbara was established in 1782 as a Spanish military fort — one of four presidios in Alta California — anchoring Spanish claim on the Channel coast before the mission was founded nearby in 1786.",
    topics: ["presidio", "spanish era", "1782", "santa barbara", "military"],
    dateRange: "1782",
    sourceType: "reference",
    citation: "Wikipedia: Presidio of Santa Barbara.",
    url: WIKI_PRESIDIO,
    reliability: "high",
  },
  {
    id: "county-town-growth",
    text: "The town of Santa Barbara grew from the Spanish colonial settlement around the presidio and mission into an American-period county seat known for its harbor, agricultural hinterland, and mild coast. By the 1880s it was a established city with illustrated histories celebrating pioneers.",
    topics: ["santa barbara", "town", "harbor", "american period", "county seat"],
    dateRange: "1782-1885",
    sourceType: "reference",
    citation: "Wikipedia: Santa Barbara, California; Mason 1883 county history.",
    url: WIKI_SB,
    reliability: "high",
  },

  // ---------------- Chumash ----------------
  {
    id: "county-chumash-homeland",
    text: "The Chumash are the Indigenous people of the Santa Barbara Channel region and adjoining coast and islands — from roughly Malibu through Santa Barbara and San Luis Obispo country, including the northern Channel Islands — long before Spanish contact.",
    topics: ["chumash", "native history", "channel islands", "homeland"],
    dateRange: "pre-contact",
    sourceType: "reference",
    citation: "Wikipedia: Chumash.",
    url: WIKI_CHUMASH,
    reliability: "high",
  },
  {
    id: "county-chumash-villages",
    text: "Before the missions, Chumash villages along creeks and the coast used dome-shaped dwellings of willow frames covered with tule thatch. Villages were autonomous communities with hereditary leaders; skilled basketry, stone bowls, and seafaring were central crafts.",
    topics: ["chumash", "village", "dwelling", "basket", "native history"],
    dateRange: "pre-contact through mission era",
    sourceType: "reference",
    citation: "Wikipedia: Chumash; Chumash material-culture summaries.",
    url: WIKI_CHUMASH,
    reliability: "high",
  },
  {
    id: "county-chumash-tomol",
    text: "Chumash mariners built plank canoes called tomols — redwood planks sewn and caulked with asphaltum (tar) and pitch — capable of crossing to the Channel Islands. These boats supported fishing, trade, and island travel.",
    topics: ["chumash", "tomol", "channel islands", "canoe", "seafaring"],
    dateRange: "pre-contact through mission era",
    sourceType: "reference",
    citation: "Wikipedia: Chumash; Tomol.",
    url: WIKI_CHUMASH,
    reliability: "high",
  },
  {
    id: "county-chumash-acorn",
    text: "Acorns were a staple food across much of Indigenous California, including Chumash communities: gathered, dried, leached of bitter tannins, and ground in stone mortars — labor that shaped daily village life.",
    topics: ["chumash", "acorn", "food", "mortar", "native history"],
    dateRange: "pre-contact through mission era",
    sourceType: "reference",
    citation: "Chumash / California Indian ethnobotany; Wikipedia: Chumash.",
    url: WIKI_CHUMASH,
    reliability: "high",
  },
  {
    id: "county-chumash-rock-art",
    text: "Chumash pictographs — rock paintings — survive at sacred sites in the Santa Barbara and Ventura hills, including Painted Cave. Motifs include sea creatures and other figures tied to spiritual traditions; some paintings are centuries to millennia old.",
    topics: ["chumash", "pictograph", "rock art", "painted cave", "spiritual"],
    dateRange: "pre-contact (centuries–millennia)",
    sourceType: "reference",
    citation:
      "Wikipedia: Chumash Painted Cave State Historic Park; Chumash rock-art studies.",
    url: "https://en.wikipedia.org/wiki/Chumash_Painted_Cave_State_Historic_Park",
    reliability: "high",
  },
  {
    id: "county-chumash-mason-caution",
    text: "Mason's 1883 history includes accounts of Native peoples written from a nineteenth-century settler perspective. Those passages can preserve place-names and period observations but also reflect prejudice; modern readers should treat them critically and prefer corroborated ethnography for cultural detail.",
    topics: ["chumash", "mason", "1883 history", "contested", "sources"],
    dateRange: "1883",
    sourceType: "persona-note",
    citation:
      "Critical reading note for Mason 1883 Native chapters; pair with Wikipedia: Chumash.",
    url: ARCHIVE_1883,
    reliability: "medium",
  },

  // ---------------- Ranchos ----------------
  {
    id: "county-ranchos-grants",
    text: "After secularization, Mexican authorities granted large ranchos across Santa Barbara country — cattle estates worked by Californio families and vaqueros. Hides and tallow were the staple trade of the rancho economy along this coast.",
    topics: ["ranchos", "mexican era", "cattle", "vaquero", "californio"],
    dateRange: "1830s-1840s",
    sourceType: "reference",
    citation:
      "Mason 1883 county history (rancho chapters); Wikipedia: Ranchos of California.",
    url: ARCHIVE_1883,
    reliability: "high",
  },
  {
    id: "county-ranchos-drought",
    text: "The severe droughts of the 1860s, especially 1862–1864, devastated cattle herds across California and helped end the era of the great Mexican-era cattle ranchos, opening the way for American farming, subdivision, and new settlement patterns.",
    topics: ["ranchos", "droughts", "1860s", "economy", "american period"],
    dateRange: "1862-1864",
    sourceType: "reference",
    citation:
      "General California history; corroborated in period county histories including Mason 1883.",
    url: ARCHIVE_1883,
    reliability: "high",
  },
  {
    id: "county-ranchos-american-title",
    text: "After American conquest and the Treaty of Guadalupe Hidalgo (1848), Californio land titles were adjudicated under the U.S. Land Act of 1851. Many ranchero families lost land to legal costs, taxes, and American settlers even when grants were confirmed.",
    topics: ["ranchos", "american period", "land title", "californio"],
    dateRange: "1848-1860s",
    sourceType: "reference",
    citation: "Wikipedia: Ranchos of California; California Land Act of 1851.",
    url: "https://en.wikipedia.org/wiki/Ranchos_of_California",
    reliability: "high",
  },

  // ---------------- American period ----------------
  {
    id: "county-american-conquest",
    text: "During the Mexican–American War, U.S. forces occupied California. Santa Barbara passed under American military and then civil authority; California became a U.S. state in 1850, and Santa Barbara County was among the original counties.",
    topics: ["american period", "mexican american war", "statehood", "1850"],
    dateRange: "1846-1850",
    sourceType: "reference",
    citation: "Wikipedia: Santa Barbara, California; California statehood history.",
    url: WIKI_SB,
    reliability: "high",
  },
  {
    id: "county-american-settlement",
    text: "In the American period, English-speaking settlers, merchants, and farmers joined Californio families already on the land. County histories of the 1880s — including Mason's — celebrated 'pioneers' while documenting schools, churches, orchards, and commerce transforming the old rancho landscape.",
    topics: ["american period", "settlement", "pioneers", "santa barbara"],
    dateRange: "1850-1885",
    sourceType: "primary",
    citation: "Mason, History of Santa Barbara County (1883).",
    url: ARCHIVE_1883,
    reliability: "high",
  },
  {
    id: "county-channel-coast",
    text: "Santa Barbara faces the Santa Barbara Channel, with the Channel Islands offshore. The coast's mild climate, harbor, and island trade routes shaped Chumash life, Spanish colonization, and later American settlement alike.",
    topics: ["channel islands", "coast", "harbor", "geography", "santa barbara"],
    dateRange: "pre-contact–1885",
    sourceType: "reference",
    citation: "Wikipedia: Santa Barbara Channel; Santa Barbara, California.",
    url: WIKI_SB,
    reliability: "high",
  },
  {
    id: "county-mission-nickname",
    text: "Mission Santa Barbara earned the nickname 'Queen of the Missions' for its commanding twin-towered church and continuous Franciscan presence — a landmark Mason's generation treated as the architectural pride of the county.",
    topics: ["mission", "queen of the missions", "architecture", "santa barbara"],
    dateRange: "1786-1885",
    sourceType: "reference",
    citation: "Wikipedia: Mission Santa Barbara.",
    url: WIKI_MISSION,
    reliability: "high",
  },
  {
    id: "county-illustrations",
    text: "The 1883 Thompson & West volume is richly illustrated with lithographs and portraits of prominent men and pioneers — a visual companion to the narrative chapters on missions, ranchos, and towns.",
    topics: ["books", "illustrations", "1883 history", "pioneers"],
    dateRange: "1883",
    sourceType: "primary",
    citation: "Mason, History of Santa Barbara County (1883), Internet Archive scan.",
    url: ARCHIVE_1883,
    reliability: "high",
  },
];
