import type { SourceChunk } from "@/lib/types";

/**
 * SERVER-ONLY source pack for John Muir — Sierra Nevada / Yosemite focus.
 *
 * Grounding citations prefer Muir's own public-domain books, Library of Congress
 * authorities, and federal/park primary records — not Wikipedia.
 * (Wikipedia article maps remain for image search only, in wikipediaTopics.ts.)
 */

const GUT_FIRST = "https://www.gutenberg.org/ebooks/32540";
const GUT_MOUNTAINS = "https://www.gutenberg.org/ebooks/10012";
const GUT_YOSEMITE = "https://www.gutenberg.org/ebooks/7091";
const GUT_PARKS = "https://www.gutenberg.org/ebooks/60929";
const GUT_BOYHOOD = "https://www.gutenberg.org/ebooks/18359";
const GUT_THOUSAND = "https://www.gutenberg.org/ebooks/60749";
const LOC_NAF = "https://id.loc.gov/authorities/names/n79078692.html";
const LOC_ROOSEVELT_MUIR =
  "https://www.loc.gov/item/93503130/";
const NPS_YOSEMITE_HISTORY =
  "https://www.nps.gov/yose/learn/historyculture/index.htm";

export const muirSources: SourceChunk[] = [
  // ---------------- Biography (brief) ----------------
  {
    id: "bio-birth",
    text: "John Muir was born April 21, 1838, in Dunbar, Scotland. His family emigrated to Wisconsin in 1849. He later became famous as a naturalist, writer, and advocate for Sierra Nevada and Yosemite preservation.",
    topics: [
      "biography",
      "who are you",
      "yourself",
      "identity",
      "scotland",
      "wisconsin",
    ],
    dateRange: "1838-1849",
    sourceType: "biographical",
    citation:
      "John Muir, The Story of My Boyhood and Youth (1913), Project Gutenberg text; Library of Congress Name Authority File (Muir, John, 1838–1914).",
    url: GUT_BOYHOOD,
    reliability: "high",
  },
  {
    id: "bio-california-1868",
    text: "After a long journey that included a walk to the Gulf of Mexico and passage to California, Muir arrived in San Francisco in 1868 and soon made his way to the Sierra Nevada and Yosemite country — the mountains that became the center of his life's work.",
    topics: [
      "biography",
      "california",
      "1868",
      "who are you",
      "yosemite",
      "sierra",
    ],
    dateRange: "1868",
    sourceType: "biographical",
    citation:
      "John Muir, A Thousand-Mile Walk to the Gulf (1916 ed., Project Gutenberg); My First Summer in the Sierra (1911) opening context.",
    url: GUT_THOUSAND,
    reliability: "high",
  },
  {
    id: "bio-elderly-1912",
    text: "By 1912 Muir was an elderly, internationally known naturalist and author — white-bearded, long associated with Yosemite and the Sierra Club — looking back across decades when recounting the mountains.",
    topics: ["biography", "1912", "who are you", "yourself", "appearance"],
    dateRange: "1912",
    sourceType: "biographical",
    citation:
      "Publication of The Yosemite (Century Co., 1912) and prior books (Mountains of California 1894; Our National Parks 1901; My First Summer 1911); LOC Name Authority dates.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "bio-death-note",
    text: "John Muir died December 24, 1914, in a Los Angeles hospital. In this ECHOES simulation he speaks from 1912 and must not narrate his own death as a lived completed event.",
    topics: ["biography", "legacy", "1914"],
    dateRange: "1914",
    sourceType: "persona-note",
    citation:
      "Library of Congress Name Authority File (Muir, John, 1838–1914); ECHOES temporal guardrail (speaking year 1912).",
    url: LOC_NAF,
    reliability: "high",
  },
  {
    id: "bio-martinez-brief",
    text: "Muir married Louie Wanda Strentzel and for years managed fruit ranching at Martinez in the Alhambra Valley while still escaping to the Sierra. In this conversation Martinez is background; the Sierra and Yosemite remain the focus.",
    topics: ["biography", "martinez", "family", "strentzel", "ranch"],
    dateRange: "1880s-1900s",
    sourceType: "biographical",
    citation:
      "John Muir Papers / Strentzel-Muir family correspondence context summarized in LOC Name Authority File notes; Muir's own later Sierra books treat Martinez as home base between mountain seasons.",
    url: LOC_NAF,
    reliability: "medium",
  },
  {
    id: "bio-sierra-club",
    text: "The Sierra Club was founded in 1892; Muir served as its first president. The club organized mountain outings and advocated for forest and park protection, with Yosemite and the Sierra at the heart of early campaigns.",
    topics: [
      "sierra club",
      "1892",
      "conservation",
      "advocacy",
      "biography",
      "who are you",
    ],
    dateRange: "1892 onward",
    sourceType: "biographical",
    citation:
      "Sierra Club founding / early Bulletin record (1892–); Muir's conservation essays in Our National Parks (1901) and The Yosemite (1912).",
    url: GUT_PARKS,
    reliability: "high",
  },

  // ---------------- First summer / Sierra entry ----------------
  {
    id: "sierra-first-summer-1869",
    text: "In the summer of 1869 Muir accompanied a sheep band into the High Sierra as a kind of shepherd's assistant and naturalist — living outdoors from the foothills up toward Yosemite high country. The journals of that season became My First Summer in the Sierra (published 1911).",
    topics: [
      "first summer",
      "1869",
      "sheep",
      "sierra",
      "my first summer",
      "yosemite",
    ],
    dateRange: "1869 / published 1911",
    sourceType: "primary",
    citation:
      "John Muir, My First Summer in the Sierra (1911), Project Gutenberg text.",
    url: GUT_FIRST,
    reliability: "high",
  },
  {
    id: "sierra-sheep-delaney",
    text: "The 1869 sheep drive was associated with owner Pat Delaney and herder Billy (often named in Muir's narrative). Muir's book blends shepherd-camp routine with botanical and geological excursions away from the flock.",
    topics: ["sheep", "delaney", "billy", "1869", "first summer", "camp"],
    dateRange: "1869",
    sourceType: "primary",
    citation: "John Muir, My First Summer in the Sierra (1911).",
    url: GUT_FIRST,
    reliability: "high",
  },
  {
    id: "sierra-botany-enthusiasm",
    text: "My First Summer is dense with plant and animal observation — Muir rhapsodizes over meadows, flowers, pines, and the 'Range of Light,' treating the Sierra as a living museum rather than mere scenery.",
    topics: [
      "botany",
      "plants",
      "flowers",
      "range of light",
      "first summer",
      "description",
    ],
    dateRange: "1869 / 1911",
    sourceType: "primary",
    citation: "John Muir, My First Summer in the Sierra (1911).",
    url: GUT_FIRST,
    reliability: "high",
  },
  {
    id: "sierra-range-of-light",
    text: "Muir famously called the Sierra Nevada the 'Range of Light' — celebrating its clarity of sky, granite brilliance, and luminous mountain atmosphere in The Mountains of California and related writings.",
    topics: [
      "range of light",
      "sierra nevada",
      "description",
      "mountains of california",
      "quote",
    ],
    dateRange: "1894",
    sourceType: "primary",
    citation: "John Muir, The Mountains of California (1894).",
    url: GUT_MOUNTAINS,
    reliability: "high",
  },

  // ---------------- Yosemite Valley ----------------
  {
    id: "yosemite-first-sight",
    text: "Muir's first approaches to Yosemite Valley left him astonished by cliff walls, waterfalls, and the Merced River — a glacial temple of granite he would describe for decades. Exact day-by-day first-entry wording varies across essays; treat vivid description as grounded in repeated residence, not a single tourist snapshot.",
    topics: [
      "yosemite",
      "yosemite valley",
      "first saw",
      "description",
      "merced",
      "1868",
    ],
    dateRange: "1868 onward",
    sourceType: "primary",
    citation:
      "John Muir, The Yosemite (1912); My First Summer in the Sierra (1911).",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "yosemite-falls",
    text: "Yosemite Falls — among the world's great waterfall leaps in a single cliff system — is central to Muir's valley descriptions: Upper Fall, Middle Cascades, and Lower Fall pouring toward the valley floor.",
    topics: [
      "yosemite falls",
      "waterfall",
      "yosemite valley",
      "description",
    ],
    dateRange: "1868-1912",
    sourceType: "primary",
    citation: "John Muir, The Yosemite (1912); valley waterfall chapters.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "yosemite-el-capitan-half-dome",
    text: "El Capitan and Half Dome are signature Yosemite landmarks Muir repeatedly invokes — sheer granite faces and the great dome as emblems of glacial sculpture and valley grandeur.",
    topics: [
      "el capitan",
      "half dome",
      "granite",
      "yosemite valley",
      "landmarks",
    ],
    dateRange: "1868-1912",
    sourceType: "primary",
    citation: "John Muir, The Yosemite (1912); The Mountains of California (1894).",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "yosemite-bridalveil",
    text: "Bridalveil Fall (Pohono in some nineteenth-century usages Muir and photographers record) is one of the valley's celebrated side falls — a white veil opposite El Capitan's mass in classic views.",
    topics: ["bridalveil", "pohono", "waterfall", "yosemite valley"],
    dateRange: "1860s-1912",
    sourceType: "primary",
    citation:
      "John Muir, The Yosemite (1912); period Watkins titles using Pohono / Bridal Veil.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "yosemite-national-park-1890",
    text: "Yosemite National Park was established by federal law in 1890 (building on earlier Yosemite Grant of 1864 for the Valley and Mariposa Grove). Muir and magazine allies, notably Robert Underwood Johnson of The Century, lobbied to protect a larger high-country park around the old grant.",
    topics: [
      "yosemite national park",
      "1890",
      "johnson",
      "conservation",
      "century magazine",
    ],
    dateRange: "1864 / 1890",
    sourceType: "reference",
    citation:
      "Act of Oct. 1, 1890 (26 Stat. 650) establishing Yosemite National Park; Muir, The Yosemite (1912), dedication to Robert Underwood Johnson; NPS Yosemite history overview.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },

  // ---------------- Glaciers / Whitney dispute ----------------
  {
    id: "glacier-theory",
    text: "Muir argued that Yosemite Valley and much Sierra topography were carved primarily by glaciers — ice rivers grinding granite, leaving polished pavements, moraines, and U-shaped valleys. He traced living and extinct glacial evidence in the High Sierra.",
    topics: [
      "glacier",
      "glacial",
      "geology",
      "yosemite",
      "sierra",
      "ice",
    ],
    dateRange: "1870s-1894",
    sourceType: "primary",
    citation:
      "John Muir, The Mountains of California (1894); glacial chapters.",
    url: GUT_MOUNTAINS,
    reliability: "high",
  },
  {
    id: "glacier-whitney-contested",
    text: "State Geologist Josiah Dwight Whitney favored a catastrophic origin for Yosemite — essentially that the valley floor dropped in a convulsion — and dismissed glacial excavation as inadequate. In Muir's day this was a sharp public scientific dispute; later geology largely vindicated glacial sculpture. Label the nineteenth-century argument as contested in its time.",
    topics: [
      "whitney",
      "contested",
      "catastrophe",
      "subsidence",
      "glacier",
      "geology",
    ],
    dateRange: "1870s controversy",
    sourceType: "secondary",
    citation:
      "Muir's glacial essays vs. J. D. Whitney, The Yosemite Guide-Book (period State Geological Survey); Muir restates the dispute in The Mountains of California and The Yosemite.",
    url: GUT_MOUNTAINS,
    reliability: "high",
  },
  {
    id: "glacier-living-ice",
    text: "Muir described lingering Sierra glaciers and névé fields — including work around Mount Lyell and other High Sierra peaks — as living remnants of the ice that once filled the valleys.",
    topics: [
      "mount lyell",
      "glacier",
      "high sierra",
      "neve",
      "mountains of california",
    ],
    dateRange: "1870s-1894",
    sourceType: "primary",
    citation: "John Muir, The Mountains of California (1894).",
    url: GUT_MOUNTAINS,
    reliability: "high",
  },

  // ---------------- Sequoias / forests ----------------
  {
    id: "sequoia-mariposa-grove",
    text: "The giant sequoias of the Mariposa Grove (and other Sierra groves) astonished Muir — immense trunks, fire-scarred bark, and cathedral-like stands he defended against wasteful logging and careless fire.",
    topics: [
      "sequoia",
      "mariposa grove",
      "grizzly giant",
      "forest",
      "trees",
    ],
    dateRange: "1868-1912",
    sourceType: "primary",
    citation:
      "John Muir, The Mountains of California (1894); The Yosemite (1912); Our National Parks (1901).",
    url: GUT_MOUNTAINS,
    reliability: "high",
  },
  {
    id: "forest-preservation",
    text: "Muir's conservation writing links forest protection to watersheds, climate, and beauty — arguing that Sierra forests are not merely timber boards but living infrastructure for the state.",
    topics: [
      "forest",
      "conservation",
      "watershed",
      "preservation",
      "logging",
    ],
    dateRange: "1890s-1912",
    sourceType: "primary",
    citation:
      "John Muir, Our National Parks (1901); forest / watershed essays.",
    url: GUT_PARKS,
    reliability: "high",
  },

  // ---------------- Roosevelt 1903 ----------------
  {
    id: "roosevelt-1903",
    text: "In May 1903 President Theodore Roosevelt camped and rode in Yosemite with Muir — including time near Glacier Point — a widely photographed wilderness conference that bolstered national-park and forest-reserve politics.",
    topics: [
      "roosevelt",
      "theodore roosevelt",
      "1903",
      "glacier point",
      "camping",
      "yosemite",
    ],
    dateRange: "May 1903",
    sourceType: "reference",
    citation:
      "Library of Congress photograph: Theodore Roosevelt and John Muir on Glacier Point, Yosemite Valley, 1903 (LC-DIG-ppmsca-36575 / related LOC holdings).",
    url: LOC_ROOSEVELT_MUIR,
    reliability: "high",
  },

  // ---------------- Hetch Hetchy ----------------
  {
    id: "hetch-hetchy-valley",
    text: "Hetch Hetchy is a glacially carved valley on the Tuolumne River in Yosemite National Park — Muir called it a counterpart to Yosemite Valley, a 'Tuolumne Yosemite' of cliffs, falls, and meadows.",
    topics: [
      "hetch hetchy",
      "tuolumne",
      "valley",
      "yosemite",
      "description",
    ],
    dateRange: "pre-dam / 1912 advocacy",
    sourceType: "primary",
    citation: "John Muir, The Yosemite (1912), Hetch Hetchy chapters.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "hetch-hetchy-fight",
    text: "San Francisco sought to dam Hetch Hetchy for a municipal water supply. Muir and the Sierra Club led a national campaign to keep the valley wild. In 1912 the fight is still urgent and contested; do not invent later legislative outcomes as calm firsthand certainty from this speaking year.",
    topics: [
      "hetch hetchy",
      "dam",
      "san francisco",
      "contested",
      "conservation",
      "1912",
    ],
    dateRange: "1900s-1913 fight",
    sourceType: "primary",
    citation:
      "John Muir, The Yosemite (1912), Hetch Hetchy advocacy; contemporaneous Sierra Club campaign literature.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "hetch-hetchy-outcome-note",
    text: "The Raker Act authorizing the Hetch Hetchy reservoir passed in December 1913 — after this simulation's 1912 speaking year. Treat flooding of the valley as the threatened future Muir feared, not as a completed event he calmly narrates from 1912.",
    topics: ["hetch hetchy", "raker act", "1913", "legacy", "temporal"],
    dateRange: "December 1913",
    sourceType: "persona-note",
    citation:
      "Raker Act (Dec. 19, 1913); ECHOES temporal guardrail (speaking year 1912).",
    url: GUT_YOSEMITE,
    reliability: "high",
  },

  // ---------------- Books ----------------
  {
    id: "books-mountains-of-california",
    text: "The Mountains of California (1894) is Muir's major early book on Sierra geography — glaciers, forests, passes, animal life, and the character of the range.",
    topics: [
      "mountains of california",
      "books",
      "1894",
      "sierra",
      "who are you",
    ],
    dateRange: "1894",
    sourceType: "primary",
    citation:
      "John Muir, The Mountains of California (1894), Project Gutenberg text.",
    url: GUT_MOUNTAINS,
    reliability: "high",
  },
  {
    id: "books-my-first-summer",
    text: "My First Summer in the Sierra (1911) publishes Muir's 1869 journal of the sheep summer — day-by-day mountain living, botany, and approaches to Yosemite wonders.",
    topics: [
      "my first summer",
      "books",
      "1911",
      "1869",
      "journal",
      "who are you",
    ],
    dateRange: "1911",
    sourceType: "primary",
    citation:
      "John Muir, My First Summer in the Sierra (1911), Project Gutenberg text.",
    url: GUT_FIRST,
    reliability: "high",
  },
  {
    id: "books-the-yosemite",
    text: "The Yosemite (1912) gathers Muir's guide-like portrait of the valley, its approaches, waterfalls, and the case for keeping wild places — including Hetch Hetchy — undammed.",
    topics: ["the yosemite", "books", "1912", "guide", "hetch hetchy"],
    dateRange: "1912",
    sourceType: "primary",
    citation:
      "John Muir, The Yosemite (New York: Century Co., 1912), Project Gutenberg text.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },

  // ---------------- Place / peoples context ----------------
  {
    id: "sierra-geography",
    text: "The Sierra Nevada is a vast mountain range of California (and a slice of Nevada) — granite batholiths, alpine lakes, sequoia groves, and deep river canyons. Yosemite Valley is one famous glacial canyon on the western slope.",
    topics: ["sierra nevada", "geography", "california", "mountains"],
    dateRange: "geological / historic",
    sourceType: "primary",
    citation:
      "John Muir, The Mountains of California (1894), opening Sierra chapters.",
    url: GUT_MOUNTAINS,
    reliability: "high",
  },
  {
    id: "yosemite-native-peoples",
    text: "Yosemite Valley and surrounding Sierra country were home to Indigenous peoples, including Ahwahneechee / Southern Sierra Miwok communities, long before tourist and park eras. Muir's published books center landscape, glaciers, and forests more than full Indigenous history; when Native presence is discussed, treat it respectfully and do not invent ethnographic detail the sources do not support.",
    topics: [
      "ahwahneechee",
      "miwok",
      "native",
      "indigenous",
      "yosemite",
    ],
    dateRange: "pre-contact–nineteenth century",
    sourceType: "reference",
    citation:
      "Muir, The Yosemite (1912), early-history acknowledgments (incl. debt to Bunnell); NPS Yosemite Indigenous history pages; ECHOES respect note — do not invent ethnography beyond sources.",
    url: NPS_YOSEMITE_HISTORY,
    reliability: "medium",
  },
  {
    id: "sierra-passes-travel",
    text: "Nineteenth-century travel into Yosemite used horseback and foot trails — Coulterville, Mariposa, and Big Oak Flat approaches among them — not modern paved park roads as default firsthand experience of 1869.",
    topics: [
      "trails",
      "mariposa",
      "coulterville",
      "travel",
      "approaches",
      "1869",
    ],
    dateRange: "1860s-1890s",
    sourceType: "primary",
    citation:
      "John Muir, The Yosemite (1912), approaches / how-to-enter chapters; My First Summer travel narrative.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "books-composite-memory",
    text: "My First Summer was published more than forty years after 1869; journal material was revised for book form. Treat vivid comic or lyrical detail as literature grounded in real seasons in the mountains, not a surveyor's minute-by-minute log.",
    topics: ["memory", "journal", "1911", "1869", "contested", "revision"],
    dateRange: "1869-1911",
    sourceType: "secondary",
    citation:
      "Publication note: My First Summer in the Sierra (1911) from 1869 journals; treat as revised memoir.",
    url: GUT_FIRST,
    reliability: "medium",
  },
  {
    id: "sierra-wild-sheep",
    text: "Besides domestic sheep of the 1869 drive — which Muir often blamed for meadow damage — he wrote with admiration of wild mountain sheep (bighorn) on High Sierra cliffs in The Mountains of California.",
    topics: [
      "bighorn",
      "wild sheep",
      "animals",
      "high sierra",
      "mountains of california",
    ],
    dateRange: "1894",
    sourceType: "primary",
    citation: "John Muir, The Mountains of California (1894).",
    url: GUT_MOUNTAINS,
    reliability: "high",
  },
  {
    id: "yosemite-waterfalls-spring",
    text: "Muir emphasizes seasonal rhythm: spring snowmelt thunders the falls; late summer thins many cascades to ribbons. Valley beauty is not a single static postcard.",
    topics: ["waterfall", "seasons", "snowmelt", "yosemite", "description"],
    dateRange: "1868-1912",
    sourceType: "primary",
    citation: "John Muir, The Yosemite (1912); My First Summer seasonal notes.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },

  // ---------------- Additional Sierra / Yosemite depth ----------------
  {
    id: "books-our-national-parks",
    text: "Our National Parks (1901) collects Muir's Century Magazine–era essays urging Americans to visit and defend public wildlands — with substantial chapters on Yosemite, the sequoia parks, and the Yellowstone region as models of national-park value.",
    topics: [
      "our national parks",
      "books",
      "1901",
      "conservation",
      "century magazine",
      "who are you",
    ],
    dateRange: "1901",
    sourceType: "primary",
    citation: "John Muir, Our National Parks (1901), Project Gutenberg text.",
    url: GUT_PARKS,
    reliability: "high",
  },
  {
    id: "yosemite-dedication-johnson",
    text: "Muir dedicated The Yosemite (1912) to Robert Underwood Johnson — editor at The Century Magazine — calling him a faithful defender of forests and an originator of the Yosemite National Park campaign.",
    topics: [
      "johnson",
      "robert underwood johnson",
      "century magazine",
      "the yosemite",
      "1890",
      "advocacy",
    ],
    dateRange: "1890 / 1912",
    sourceType: "primary",
    citation: "John Muir, The Yosemite (1912), dedication page.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "yosemite-vernal-nevada-falls",
    text: "Above the main valley floor, Muir describes the Merced canyon stairway of Vernal Fall and Nevada Fall — mist, rainbow spray, and polished granite of the Mist Trail country — as among Yosemite's grandest waterfall sequences.",
    topics: [
      "vernal fall",
      "nevada fall",
      "mist trail",
      "merced",
      "waterfall",
      "yosemite",
    ],
    dateRange: "1868-1912",
    sourceType: "primary",
    citation: "John Muir, The Yosemite (1912); waterfall chapters.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "yosemite-tuolumne-meadows",
    text: "Tuolumne Meadows and the upper Tuolumne basin are High Sierra parkland Muir celebrated — open meadows, dome country, and river headwaters tied both to alpine wandering and to the Hetch Hetchy water fight downstream.",
    topics: [
      "tuolumne meadows",
      "tuolumne",
      "high sierra",
      "meadows",
      "hetch hetchy",
    ],
    dateRange: "1869-1912",
    sourceType: "primary",
    citation: "John Muir, The Yosemite (1912); My First Summer High Sierra passages.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "yosemite-tenaya",
    text: "Tenaya Lake and Tenaya Canyon appear in Muir's High Sierra itineraries — glacially carved lake and gorge country above Yosemite Valley, named in period usage after Ahwahneechee leader Tenaya.",
    topics: ["tenaya", "tenaya lake", "high sierra", "glacier", "yosemite"],
    dateRange: "1869-1912",
    sourceType: "primary",
    citation:
      "John Muir, The Yosemite (1912) and My First Summer place descriptions; Muir notes early-history sources such as Bunnell for naming.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "sierra-hoofed-locusts",
    text: "Muir repeatedly criticized domestic sheep in the High Sierra as 'hoofed locusts' that cropped meadows bare and damaged watershed cover — a conservation argument running through My First Summer and later park essays.",
    topics: [
      "sheep",
      "hoofed locusts",
      "meadows",
      "damage",
      "conservation",
      "first summer",
    ],
    dateRange: "1869-1901",
    sourceType: "primary",
    citation:
      "John Muir, My First Summer in the Sierra (1911); Our National Parks (1901).",
    url: GUT_FIRST,
    reliability: "high",
  },
  {
    id: "yosemite-hutchings-sawmill",
    text: "In his early Yosemite years Muir worked for James Mason Hutchings, including mill and cabin labor in the valley, while spending free hours climbing, botanizing, and studying glacial evidence — a working residence, not only tourist visits.",
    topics: [
      "hutchings",
      "sawmill",
      "work",
      "yosemite valley",
      "1870s",
      "biography",
    ],
    dateRange: "1869-1870s",
    sourceType: "biographical",
    citation:
      "Muir's early Yosemite residence as recounted across My First Summer, The Mountains of California, and The Yosemite; contemporaneous Hutchings Yosemite tourism context.",
    url: GUT_FIRST,
    reliability: "medium",
  },
  {
    id: "yosemite-earthquake-1872",
    text: "Muir wrote a famous account of the March 1872 Owens Valley / Lone Pine earthquake as felt in Yosemite — rockfall, cliff dust, and his excitement at seeing living mountain motion — later retold in The Yosemite.",
    topics: [
      "earthquake",
      "1872",
      "rockfall",
      "yosemite",
      "owens valley",
    ],
    dateRange: "March 1872",
    sourceType: "primary",
    citation: "John Muir, The Yosemite (1912), earthquake chapter/passage.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "yosemite-grant-1864",
    text: "The 1864 Yosemite Grant gave the Valley and Mariposa Grove to California as a park before the larger 1890 Yosemite National Park. Muir's later advocacy sought stronger federal protection of the surrounding high country that fed the valley's waters and scenery.",
    topics: [
      "yosemite grant",
      "1864",
      "mariposa grove",
      "california",
      "national park",
    ],
    dateRange: "1864 / 1890",
    sourceType: "reference",
    citation:
      "Yosemite Valley Grant Act (June 30, 1864); Act of Oct. 1, 1890 (26 Stat. 650); Muir, The Yosemite (1912) on park protection.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "parks-yellowstone-brief",
    text: "In Our National Parks Muir also praises Yellowstone and other reserved wonderlands as proof that the nation can keep wild beauty for public use — but this conversation's center remains the Sierra and Yosemite.",
    topics: ["yellowstone", "our national parks", "national parks", "books"],
    dateRange: "1901",
    sourceType: "primary",
    citation: "John Muir, Our National Parks (1901).",
    url: GUT_PARKS,
    reliability: "high",
  },
  {
    id: "hetch-hetchy-tuolumne-yosemite",
    text: "Muir argued Hetch Hetchy was a 'Tuolumne Yosemite' — comparable cliffs, falls, and meadows — and that damming a park valley for a city's water would set a ruinous precedent against the national-park idea.",
    topics: [
      "hetch hetchy",
      "tuolumne yosemite",
      "precedent",
      "national park",
      "dam",
      "quote",
    ],
    dateRange: "1900s-1912",
    sourceType: "primary",
    citation: "John Muir, The Yosemite (1912), Hetch Hetchy advocacy.",
    url: GUT_YOSEMITE,
    reliability: "high",
  },
  {
    id: "sierra-pass-walker-tioga",
    text: "Muir's High Sierra writing treats passes and divide crossings — including country later associated with Tioga / Mono approaches — as gateways between western slope forests and the desert-facing eastern escarpment.",
    topics: [
      "tioga",
      "pass",
      "mono",
      "high sierra",
      "approaches",
      "escarpment",
    ],
    dateRange: "1870s-1912",
    sourceType: "primary",
    citation:
      "John Muir, The Mountains of California (1894); The Yosemite (1912) High Sierra / pass descriptions.",
    url: GUT_MOUNTAINS,
    reliability: "high",
  },
];
