import type { SourceChunk } from "@/lib/types";

/**
 * SERVER-ONLY source pack for Hubert Howe Bancroft.
 *
 * Each chunk is a fact-checked statement with a real citation. Facts were
 * verified against Wikipedia (Hubert Howe Bancroft), Britannica, UC Berkeley /
 * Bancroft Library institutional histories, and OAC finding aids for Bancroft
 * Library and publishing records.
 *
 * Reliability notes:
 *  - "high"   = corroborated by multiple authoritative sources or primary record
 *  - "medium" = single reputable source, local tradition, or interpretation
 *
 * Temporal note: speaking year is 1905. Death (1918) is omitted from firsthand
 * voice; include library sale of 1905. Contested literary-factory authorship is
 * included for honest guardrails.
 */

const WIKI = "https://en.wikipedia.org/wiki/Hubert_Howe_Bancroft";
const BRITANNICA = "https://www.britannica.com/biography/Hubert-Howe-Bancroft";
const BANCROFT_LIB =
  "https://www.lib.berkeley.edu/visit/bancroft/about";
const OAC =
  "https://oac.cdlib.org/findaid/ark:/13030/kt8779n9js/";

export const bancroftSources: SourceChunk[] = [
  // ---------------- Biography ----------------
  {
    id: "bio-birth",
    text: "Hubert Howe Bancroft was born on May 5, 1832, in Granville, Ohio, to Azariah Ashley Bancroft and Lucy Howe Bancroft. The Howe and Bancroft families traced roots to New England (Vermont and Massachusetts).",
    topics: ["biography", "early life", "who are you", "yourself", "identity", "ohio"],
    dateRange: "1832",
    sourceType: "biographical",
    citation: "Wikipedia, 'Hubert Howe Bancroft'; Britannica.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-abolitionist-family",
    text: "Bancroft's parents were staunch abolitionists, and the family home in Ohio served as a station on the Underground Railroad.",
    topics: ["biography", "abolition", "underground railroad", "family", "who are you"],
    dateRange: "1830s-1840s",
    sourceType: "biographical",
    citation: "Wikipedia, 'Hubert Howe Bancroft'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-education-bookstore",
    text: "Bancroft attended Doane Academy in Granville for about a year, then became a clerk in his brother-in-law George H. Derby's bookstore in Buffalo, New York.",
    topics: ["biography", "education", "bookstore", "buffalo"],
    dateRange: "1840s-1852",
    sourceType: "biographical",
    citation: "Wikipedia, 'Hubert Howe Bancroft'; OAC finding aid for Bancroft Library and publishing records.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-sf-1852",
    text: "In March 1852 Bancroft was sent to booming San Francisco with an inventory of books to establish a West Coast outlet for the Buffalo firm. He built a successful bookselling business and entered publishing.",
    topics: ["biography", "san francisco", "gold rush", "bookstore", "who are you", "yourself"],
    dateRange: "1852",
    sourceType: "biographical",
    citation: "Wikipedia, 'Hubert Howe Bancroft'; Britannica.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-publishing-firm",
    text: "By the mid-1850s Bancroft's San Francisco firm grew into a major bookselling and publishing house on Montgomery Street, issuing law books, school texts and maps, stationery, and related goods. It became one of the largest bookselling businesses in the West.",
    topics: ["biography", "publishing", "montgomery street", "san francisco", "business"],
    dateRange: "1855-1868",
    sourceType: "biographical",
    citation: "OAC finding aid; Wikipedia, 'Hubert Howe Bancroft'; Britannica.",
    url: OAC,
    reliability: "high",
  },
  {
    id: "bio-resign-1868",
    text: "In 1868 Bancroft resigned from the day-to-day business in favor of his brother A.L. Bancroft, having accumulated a large historical library, and devoted himself to collecting, writing, and publishing history.",
    topics: ["biography", "publishing", "library", "who are you"],
    dateRange: "1868",
    sourceType: "biographical",
    citation: "Wikipedia, 'Hubert Howe Bancroft'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-marriages",
    text: "Bancroft married Emily Ketchum in 1859; they had a daughter, Kate (born 1859). Emily died in childbirth in 1869. In 1879 he married Matilda Coley Griffing, with whom he had four children.",
    topics: ["biography", "family", "marriage"],
    dateRange: "1859-1879",
    sourceType: "biographical",
    citation: "Wikipedia, 'Hubert Howe Bancroft'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-yale-ma",
    text: "Although he never graduated from college, in 1875 Yale awarded Bancroft an honorary Master of Arts degree in recognition of his massive historical work on the Native Races of the Pacific States. He was also elected a member of the American Antiquarian Society in 1875.",
    topics: ["biography", "yale", "honorary degree", "native races", "recognition"],
    dateRange: "1875",
    sourceType: "biographical",
    citation: "Wikipedia, 'Hubert Howe Bancroft'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "bio-spring-valley-ranch",
    text: "In 1885 Bancroft purchased a ranch with an adobe cottage in Spring Valley, San Diego County, as a country retirement home. The Hubert H. Bancroft Ranch House later became a National Historic Landmark.",
    topics: ["biography", "spring valley", "ranch", "san diego county", "adobe"],
    dateRange: "1885",
    sourceType: "reference",
    citation: "Wikipedia, 'Hubert Howe Bancroft' (Bancroft Ranch House).",
    url: WIKI,
    reliability: "high",
  },

  // ---------------- Library ----------------
  {
    id: "library-collecting-start",
    text: "Bancroft dated the beginning of his historical collecting to about 1859, when he assembled books about California and the West as a reference shelf while preparing a Hand-Book Almanac for the Pacific States. He soon expanded to maps, newspapers, manuscripts, and materials from Panama to Alaska.",
    topics: ["library", "collecting", "california", "pacific states", "who are you"],
    dateRange: "1859-",
    sourceType: "reference",
    citation: "UC Berkeley Library, Explore The Bancroft Library; Wikipedia.",
    url: BANCROFT_LIB,
    reliability: "high",
  },
  {
    id: "library-contents",
    text: "Bancroft's library included books, maps, and printed and manuscript documents, plus many narratives dictated to Bancroft or his assistants by pioneers, settlers, and statesmen. Indexing the collection employed about six persons for ten years.",
    topics: ["library", "dictations", "pioneers", "indexing", "collecting"],
    dateRange: "1860s-1900",
    sourceType: "reference",
    citation: "Wikipedia, 'Hubert Howe Bancroft'.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "library-fireproof-1881",
    text: "The library was moved in 1881 to a fireproof building. By about 1900 it numbered roughly 45,000 volumes; by the 1905 sale to the University of California the collection was often described as about 60,000 volumes.",
    topics: ["library", "fireproof", "collecting", "san francisco"],
    dateRange: "1881-1905",
    sourceType: "reference",
    citation: "Wikipedia, 'Hubert Howe Bancroft'; UC Berkeley Bancroft Library history.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "library-sale-uc-1905",
    text: "In 1905 the University of California purchased Bancroft's book and manuscript collections — more than sixty thousand items — for $250,000. Bancroft contributed $100,000 of the purchase price. The collection was to be maintained as a separate library and became the foundation of The Bancroft Library at UC Berkeley.",
    topics: ["library", "university of california", "berkeley", "sale", "1905", "who are you", "yourself"],
    dateRange: "1905",
    sourceType: "reference",
    citation: "OAC finding aid; UC Berkeley Library; Wikipedia, 'Hubert Howe Bancroft'.",
    url: BANCROFT_LIB,
    reliability: "high",
  },

  // ---------------- Works / publishing ----------------
  {
    id: "works-39-volumes",
    text: "Bancroft developed and published a plan for a multi-volume history of the Pacific coast region of North America, from Central America to Alaska. The result was The Works of Hubert Howe Bancroft — commonly described as 39 volumes — published roughly 1874–1890 (with Literary Industries as a late volume describing his methods).",
    topics: ["works", "publishing", "pacific states", "history", "who are you"],
    dateRange: "1874-1890",
    sourceType: "primary",
    citation: "Wikipedia, 'Hubert Howe Bancroft' (Published works); Britannica.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "works-native-races",
    text: "The Native Races of the Pacific States (volumes on wild tribes, civilized nations, myths and languages, antiquities, and primitive history) appeared in the mid-1870s and helped earn Bancroft his Yale honorary M.A. Francis Parkman praised The Native Races in The North American Review.",
    topics: ["native races", "ethnology", "pacific states", "works", "yale"],
    dateRange: "1875-1876",
    sourceType: "secondary",
    citation: "Wikipedia, 'Hubert Howe Bancroft'; Britannica.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "works-history-california",
    text: "Bancroft's History of California spans multiple volumes covering roughly 1542 through 1890, including Spanish and Mexican eras, the American conquest, the Gold Rush years, and later state developments. These volumes are among the most-cited parts of his Works for California history.",
    topics: ["history of california", "california", "gold rush", "works", "san francisco"],
    dateRange: "1884-1890",
    sourceType: "primary",
    citation: "Wikipedia, 'Hubert Howe Bancroft' (History of California volumes XVIII–XXIV).",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "works-pacific-scope",
    text: "Beyond California, the Works include histories of Central America, Mexico, Texas and the North Mexican States, Arizona and New Mexico, Nevada, Colorado and Wyoming, Utah, Oregon, Washington, Idaho and Montana, British Columbia, Alaska, and related essays such as California Pastoral and Popular Tribunals.",
    topics: ["pacific states", "works", "mexico", "oregon", "alaska"],
    dateRange: "1874-1890",
    sourceType: "reference",
    citation: "Wikipedia, 'Hubert Howe Bancroft' (Published works).",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "works-literary-industries",
    text: "Literary Industries (volume XXXIX of the Works) gives Bancroft's own account of his methods of collecting, indexing, and producing the histories — including the use of research assistants and organized compilation.",
    topics: ["literary industries", "methods", "literary factory", "works", "philosophy"],
    dateRange: "1891",
    sourceType: "primary",
    citation: "Wikipedia, 'Hubert Howe Bancroft' (Literary Industries).",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "works-fire-1886",
    text: "In 1886 the publishing establishment of A.L. Bancroft & Company burned, and sheets of seven volumes of history were destroyed — a serious setback to the publishing enterprise.",
    topics: ["publishing", "fire", "san francisco", "works"],
    dateRange: "1886",
    sourceType: "biographical",
    citation: "Wikipedia, 'Hubert Howe Bancroft'.",
    url: WIKI,
    reliability: "high",
  },

  // ---------------- Contested authorship / philosophy ----------------
  {
    id: "philosophy-literary-factory",
    text: "Bancroft employed many writers, researchers, indexers, and copyists — a workshop sometimes called a 'literary factory.' He credited himself as author of the Works, though by modern standards he would often be considered an editor and compiler rather than sole author of every page. Critics charged that he failed to give adequate credit to contributing writers such as Frances Fuller Victor.",
    topics: ["literary factory", "authorship", "assistants", "contested", "philosophy", "credit"],
    dateRange: "1870s-1890s",
    sourceType: "secondary",
    citation: "Wikipedia, 'Hubert Howe Bancroft' (Writing and views; Note on production methods); OAC finding aid.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "philosophy-vallejo",
    text: "Mariano Guadalupe Vallejo served as an important Californio contact and produced a lengthy historical manuscript based on interviews for Bancroft's project. Vallejo was disappointed by how Bancroft used the material — subsuming Mexican Californio stories into a master narrative organized around the Gold Rush and American settlement.",
    topics: ["vallejo", "californio", "contested", "dictations", "philosophy", "credit"],
    dateRange: "1870s-1880s",
    sourceType: "secondary",
    citation: "Wikipedia, 'Hubert Howe Bancroft' (Writing and views).",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "philosophy-criticism",
    text: "By the late nineteenth century, critics attacked Bancroft's authorship claims; the Salt Lake Tribune in 1893 called him a 'purloiner of other peoples' brains.' Historians have long noted uneven quality and inadequate acknowledgment of assistants, even while praising the collection's enduring value as a source base for Western history.",
    topics: ["criticism", "authorship", "contested", "legacy", "philosophy"],
    dateRange: "1890s",
    sourceType: "secondary",
    citation: "Wikipedia, 'Hubert Howe Bancroft' (Legacy); Morris, Oregon Historical Quarterly (1903).",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "philosophy-method",
    text: "Bancroft's staff copied and summarized material in archives throughout California and the Southwest, collected oral 'dictations,' and used index-card systems to organize facts. Originally he intended to rewrite assistants' topical sections into a broad narrative himself; as the work progressed he often used their statements with only slight changes.",
    topics: ["methods", "dictations", "archives", "literary factory", "philosophy"],
    dateRange: "1860s-1890s",
    sourceType: "secondary",
    citation: "Wikipedia, 'Hubert Howe Bancroft' (Note on production methods).",
    url: WIKI,
    reliability: "high",
  },

  // ---------------- San Francisco / California context ----------------
  {
    id: "sf-gold-rush-arrival",
    text: "Bancroft arrived in San Francisco in 1852 during the boom years after the Gold Rush, when the city was the great commercial and publishing center of the Pacific Coast. His bookstore and later historical workshop were rooted in that urban marketplace.",
    topics: ["san francisco", "gold rush", "1852", "commerce"],
    dateRange: "1852",
    sourceType: "biographical",
    citation: "Britannica; Wikipedia, 'Hubert Howe Bancroft'.",
    url: BRITANNICA,
    reliability: "high",
  },
  {
    id: "sf-mission-dolores",
    text: "Mission San Francisco de Asís — commonly called Mission Dolores — was founded in 1776 and is the oldest surviving structure in San Francisco. Bancroft's California volumes treat the mission era as part of the Spanish colonial foundation of the Bay Area.",
    topics: ["mission dolores", "mission san francisco", "spanish era", "san francisco"],
    dateRange: "1776-",
    sourceType: "reference",
    citation: "Wikipedia, 'Mission San Francisco de Asís'; Bancroft History of California (contextual).",
    url: "https://en.wikipedia.org/wiki/Mission_San_Francisco_de_As%C3%ADs",
    reliability: "high",
  },
  {
    id: "sf-golden-gate-strait",
    text: "In Bancroft's day the Golden Gate was the strait connecting San Francisco Bay to the Pacific — crossed by ferries, not by a bridge. Views from Telegraph Hill and the Marin Highlands showed the open gate and Angel Island before any modern suspension bridge existed.",
    topics: ["golden gate", "san francisco bay", "ferry", "telegraph hill", "harbor"],
    dateRange: "pre-1906",
    sourceType: "reference",
    citation: "Period geographic usage; USGS / historic map context (Golden Gate strait).",
    reliability: "high",
  },
  {
    id: "sf-pre-1906-city",
    text: "As of 1905 San Francisco was a large Pacific metropolis of cable cars, ferries, Market Street commerce, and Victorian neighborhoods — still before the earthquake and fire of April 1906. Bancroft speaking in 1905 would not know that disaster as a past event.",
    topics: ["san francisco", "1905", "market street", "temporal", "pre-earthquake"],
    dateRange: "1905",
    sourceType: "persona-note",
    citation: "Temporal guardrail for speaking year 1905 (quake April 18, 1906).",
    reliability: "high",
  },
  {
    id: "california-gold-rush-context",
    text: "The California Gold Rush beginning in 1848–1849 transformed San Francisco and the state. Bancroft's History of California volumes covering 1848–1859 treat those years as a central turning point in his Pacific States narrative — a framing that some Californio informants found reductive.",
    topics: ["gold rush", "california", "history of california", "1849"],
    dateRange: "1848-1859",
    sourceType: "secondary",
    citation: "Wikipedia, 'Hubert Howe Bancroft'; Britannica.",
    url: WIKI,
    reliability: "high",
  },
  {
    id: "collecting-oral-histories",
    text: "Bancroft hired interviewers to travel through the West taking down hundreds of oral histories — 'dictations' — from surviving pioneers of American westward expansion, and in some cases from Native informants. These manuscripts became a core strength of the collection sold to the University of California.",
    topics: ["dictations", "oral history", "pioneers", "library", "collecting"],
    dateRange: "1860s-1880s",
    sourceType: "secondary",
    citation: "Wikipedia, 'Hubert Howe Bancroft'; UC Berkeley Bancroft Library history.",
    url: BANCROFT_LIB,
    reliability: "high",
  },
  {
    id: "subscription-publishing",
    text: "Bancroft's histories were sold largely by subscription. Some subscribers were surprised by the full length of the series — commonly remembered as thirty-nine volumes — rather than a short set of a few books.",
    topics: ["publishing", "subscription", "works", "business"],
    dateRange: "1870s-1890s",
    sourceType: "secondary",
    citation: "Secondary accounts of Bancroft subscription publishing (e.g. History in the Margins / Clark Venture in History summaries).",
    url: WIKI,
    reliability: "medium",
  },
];
