import type {
  PersonaSemanticVocab,
  SourceSemanticAnnotations,
} from "@/lib/semantic";

/** Controlled vocabulary for John D. Spreckels (Coronado-first). */
export const spreckelsVocab: PersonaSemanticVocab = {
  people: [
    {
      id: "john-d-spreckels",
      label: "John D. Spreckels",
      aliases: [
        "spreckels",
        "john diedrich spreckels",
        "j.d. spreckels",
        "j. d. spreckels",
        "john spreckels",
        "sugar prince",
      ],
    },
    {
      id: "claus-spreckels",
      label: "Claus Spreckels",
      aliases: ["claus", "sugar king", "claus sr"],
    },
    {
      id: "lillie-siebein",
      label: "Lillie Siebein Spreckels",
      aliases: ["lillie", "lily siebein", "siebein", "mrs spreckels"],
    },
    {
      id: "e-s-babcock",
      label: "E. S. Babcock",
      aliases: ["babcock", "elisha babcock", "e.s. babcock"],
    },
    {
      id: "hampton-story",
      label: "Hampton L. Story",
      aliases: ["story", "hampton story", "h.l. story"],
    },
    {
      id: "c-t-hinde",
      label: "Captain C. T. Hinde",
      aliases: ["hinde", "captain hinde", "c.t. hinde", "charles t. hinde"],
    },
    {
      id: "harrison-albright",
      label: "Harrison Albright",
      aliases: ["albright", "harrison albright"],
    },
    {
      id: "adolph-spreckels",
      label: "Adolph B. Spreckels",
      aliases: ["adolph", "a.b. spreckels"],
    },
    {
      id: "claus-jr",
      label: "Claus Spreckels (son)",
      aliases: ["claus jr", "son claus"],
    },
  ],
  places: [
    {
      id: "coronado",
      label: "Coronado",
      aliases: ["coronado island", "coronado beach", "the island"],
    },
    {
      id: "hotel-del-coronado",
      label: "Hotel del Coronado",
      aliases: ["the del", "hotel del", "del coronado", "coronado hotel"],
    },
    {
      id: "tent-city",
      label: "Tent City",
      aliases: [
        "coronado tent city",
        "tent city coronado",
        "silver strand tents",
        "thatched cottages",
      ],
    },
    {
      id: "glorietta-bay",
      label: "Glorietta Bay",
      aliases: ["glorietta", "glorietta boulevard", "spreckels mansion"],
    },
    {
      id: "north-island",
      label: "North Island",
      aliases: ["north island coronado", "coronado heights"],
    },
    {
      id: "silver-strand",
      label: "Silver Strand",
      aliases: ["the strand", "strand"],
    },
    {
      id: "orange-avenue",
      label: "Orange Avenue",
      aliases: ["orange ave", "orange avenue coronado"],
    },
    {
      id: "san-diego-bay",
      label: "San Diego Bay",
      aliases: ["the bay", "harbor", "san diego harbor"],
    },
    {
      id: "san-diego",
      label: "San Diego",
      aliases: ["san diego city", "downtown san diego"],
    },
    {
      id: "san-francisco",
      label: "San Francisco",
      aliases: ["sf", "frisco"],
    },
    {
      id: "charleston",
      label: "Charleston, South Carolina",
      aliases: ["charleston", "south carolina"],
    },
    {
      id: "hawaii",
      label: "Hawaiian Islands",
      aliases: ["hawaii", "sandwich islands", "honolulu"],
    },
    {
      id: "hanover",
      label: "Hanover, Germany",
      aliases: ["hanover", "germany", "polytechnic"],
    },
  ],
  organizations: [
    {
      id: "coronado-beach-company",
      label: "Coronado Beach Company",
      aliases: ["beach company", "coronado beach co"],
    },
    {
      id: "san-diego-coronado-ferry",
      label: "San Diego and Coronado Ferry Company",
      aliases: ["ferry", "ferry company", "coronado ferry"],
    },
    {
      id: "sdery",
      label: "San Diego Electric Railway",
      aliases: [
        "electric railway",
        "street railway",
        "streetcar",
        "trolley",
        "sdery",
      ],
    },
    {
      id: "sda-railway",
      label: "San Diego & Arizona Railway",
      aliases: [
        "san diego and arizona",
        "sd&a",
        "impossible railroad",
        "arizona railroad",
      ],
    },
    {
      id: "oceanic",
      label: "Oceanic Steamship Company",
      aliases: ["oceanic", "steamship", "j.d. spreckels & brothers"],
    },
    {
      id: "mountain-water",
      label: "Southern California Mountain Water Company",
      aliases: ["mountain water", "water company", "morena", "otay"],
    },
    {
      id: "san-diego-union",
      label: "San Diego Union",
      aliases: ["the union", "union newspaper", "tribune"],
    },
    {
      id: "republican-party",
      label: "Republican Party",
      aliases: ["republican"],
    },
  ],
  events: [
    {
      id: "lurline-1887",
      label: "Lurline arrival 1887",
      aliases: ["yacht lurline", "first visit", "lurline"],
    },
    {
      id: "del-ownership",
      label: "Coronado Beach Company ownership",
      aliases: ["acquired hotel", "third partner", "bought the del"],
    },
    {
      id: "tent-city-founding",
      label: "Tent City founded 1900",
      aliases: ["opened tent city", "established tent city", "1900 tent"],
    },
    {
      id: "quake-1906",
      label: "1906 San Francisco earthquake",
      aliases: ["earthquake", "quake", "moved to coronado"],
    },
    {
      id: "mansion-1908",
      label: "Glorietta mansion completed",
      aliases: ["mansion finished", "albright house"],
    },
    {
      id: "electrify-1892",
      label: "Street railway electrified 1892",
      aliases: ["horse to electric", "electrified streetcars"],
    },
    {
      id: "boom-bust",
      label: "San Diego boom and bust",
      aliases: ["boom burst", "land boom", "boom collapsed"],
    },
  ],
  periods: [
    {
      id: "early-career",
      label: "Sugar, Hawaii, and Oceanic years",
      yearStart: 1853,
      yearEnd: 1887,
      aliases: ["hawaii years", "sugar years", "before san diego"],
    },
    {
      id: "coronado-acquisition",
      label: "Coronado Beach Company acquisition era",
      yearStart: 1887,
      yearEnd: 1900,
      aliases: ["acquiring the del", "after lurline", "boom bust years"],
    },
    {
      id: "tent-city-era",
      label: "Tent City and Coronado residence era",
      yearStart: 1900,
      yearEnd: 1912,
      aliases: ["tent city years", "glorietta years", "coronado home years"],
    },
    {
      id: "speaking-year",
      label: "Speaking year 1912",
      yearStart: 1912,
      yearEnd: 1912,
      aliases: ["1912", "present day"],
    },
  ],
};

/** Hand tags for curated Spreckels sources. */
export const spreckelsSourceAnnotations: SourceSemanticAnnotations = {
  "bio-birth": {
    people: ["john-d-spreckels", "claus-spreckels"],
    places: ["charleston", "san-francisco"],
    yearStart: 1853,
    yearEnd: 1853,
    period: "early-career",
  },
  "bio-lurline-1887": {
    people: ["john-d-spreckels"],
    places: ["san-diego-bay", "san-diego"],
    events: ["lurline-1887"],
    yearStart: 1887,
    yearEnd: 1887,
    period: "coronado-acquisition",
  },
  "del-third-partner-1889": {
    organizations: ["coronado-beach-company"],
    places: ["hotel-del-coronado", "coronado"],
    events: ["del-ownership"],
    yearStart: 1889,
    yearEnd: 1889,
    period: "coronado-acquisition",
  },
  "del-full-ownership": {
    organizations: ["coronado-beach-company"],
    places: ["hotel-del-coronado", "coronado"],
    events: ["del-ownership"],
    period: "coronado-acquisition",
  },
  "tent-city-1900": {
    places: ["tent-city", "hotel-del-coronado", "silver-strand", "coronado"],
    events: ["tent-city-founding"],
    yearStart: 1900,
    yearEnd: 1900,
    period: "tent-city-era",
  },
  "tent-city-not-original-construction": {
    places: ["tent-city", "hotel-del-coronado", "coronado"],
    events: ["tent-city-founding", "del-ownership"],
    yearStart: 1888,
    yearEnd: 1900,
    period: "tent-city-era",
  },
  "del-opened-1888": {
    places: ["hotel-del-coronado", "coronado"],
    people: ["e-s-babcock", "hampton-story"],
    yearStart: 1888,
    yearEnd: 1888,
    period: "coronado-acquisition",
  },
  "later-monte-carlo-ship": {
    places: ["coronado", "san-diego-bay"],
    period: "speaking-year",
  },
  "bio-father-claus": {
    people: ["claus-spreckels", "john-d-spreckels"],
    places: ["san-francisco", "germany"],
    period: "early-career",
  },
  "tent-city-amenities": {
    places: ["tent-city", "silver-strand", "coronado"],
    period: "tent-city-era",
  },
  "mansion-glorietta": {
    people: ["harrison-albright", "john-d-spreckels"],
    places: ["glorietta-bay", "hotel-del-coronado", "coronado"],
    events: ["mansion-1908"],
    yearStart: 1908,
    yearEnd: 1908,
    period: "tent-city-era",
  },
  "ferry-system": {
    organizations: ["san-diego-coronado-ferry"],
    places: ["coronado", "san-diego-bay", "san-diego"],
  },
  "electric-railway-1892": {
    organizations: ["sdery"],
    events: ["electrify-1892"],
    yearStart: 1892,
    yearEnd: 1892,
    period: "coronado-acquisition",
  },
  "bio-move-after-quake": {
    places: ["coronado", "san-francisco"],
    events: ["quake-1906"],
    yearStart: 1906,
    yearEnd: 1906,
    period: "tent-city-era",
  },
  "identity-coronado-forefather": {
    people: ["john-d-spreckels"],
    places: ["coronado"],
  },
  "bio-speaking-year-1912": {
    people: ["john-d-spreckels"],
    places: ["coronado", "glorietta-bay", "hotel-del-coronado", "tent-city"],
    yearStart: 1912,
    yearEnd: 1912,
    period: "speaking-year",
  },
  "water-company": {
    organizations: ["mountain-water"],
    places: ["san-diego"],
    yearStart: 1906,
    yearEnd: 1906,
  },
  "theatre-building-1912": {
    places: ["san-diego"],
    yearStart: 1912,
    yearEnd: 1912,
    period: "speaking-year",
  },
};
