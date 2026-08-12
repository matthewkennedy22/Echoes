import type {
  PersonaSemanticVocab,
  SourceSemanticAnnotations,
} from "@/lib/semantic";

export const williamGDanaVocab: PersonaSemanticVocab = {
  people: [
    {
      id: "william-g-dana",
      label: "Capt. William G. Dana",
      aliases: [
        "captain dana",
        "william goodwin dana",
        "wm. g. dana",
        "guillermo g. dana",
        "guillermo dana",
      ],
    },
    {
      id: "maria-josefa-carrillo",
      label: "María Josefa Carrillo de Dana",
      aliases: [
        "maria josefa",
        "mrs. dana",
        "senora dana",
        "josefa carrillo",
      ],
    },
    {
      id: "carlos-antonio-carrillo",
      label: "Carlos Antonio Carrillo",
      aliases: ["don carlos", "carrillo", "governor carrillo"],
    },
    {
      id: "edwin-bryant",
      label: "Edwin Bryant",
      aliases: ["bryant"],
    },
    {
      id: "john-c-fremont",
      label: "John C. Frémont",
      aliases: ["fremont", "frémont", "colonel fremont"],
    },
    {
      id: "pablo-de-la-guerra",
      label: "Pablo de la Guerra",
      aliases: ["de la guerra"],
    },
    {
      id: "john-f-dana",
      label: "John Francis Dana",
      aliases: ["john f. dana", "juan francisco dana"],
    },
  ],
  places: [
    {
      id: "rancho-nipomo",
      label: "Rancho Nipomo",
      aliases: ["nipomo", "the rancho", "the grant"],
    },
    {
      id: "dana-adobe",
      label: "Dana Adobe",
      aliases: ["the adobe", "casa de dana", "the house"],
    },
    {
      id: "santa-barbara",
      label: "Santa Barbara",
      aliases: ["presidio of santa barbara"],
    },
    {
      id: "san-luis-obispo",
      label: "San Luis Obispo",
      aliases: ["slo", "the mission town"],
    },
    {
      id: "boston",
      label: "Boston",
      aliases: ["massachusetts"],
    },
    {
      id: "oahu",
      label: "Oahu",
      aliases: ["honolulu", "sandwich islands", "hawaii"],
    },
    {
      id: "mission-la-purisima",
      label: "Mission La Purísima",
      aliases: ["la purisima", "la purísima"],
    },
  ],
  organizations: [
    {
      id: "mexican-republic",
      label: "Mexican Republic",
      aliases: ["mexico", "alta california"],
    },
  ],
  events: [
    {
      id: "nipomo-grant",
      label: "Rancho Nipomo grant 1837",
      aliases: ["land grant", "alvarado grant"],
    },
    {
      id: "marriage-1828",
      label: "Dana–Carrillo marriage 1828",
      aliases: ["wedding", "marriage"],
    },
    {
      id: "us-mail-1847",
      label: "U.S. mail exchange 1847",
      aliases: ["mail route", "1847 mail"],
    },
  ],
  periods: [
    {
      id: "pacific-trade",
      label: "Pacific trade years",
      yearStart: 1815,
      yearEnd: 1828,
      aliases: ["waverly years", "hawaii years"],
    },
    {
      id: "adobe-years",
      label: "Adobe years at Nipomo",
      yearStart: 1839,
      yearEnd: 1858,
      aliases: ["rancho years", "nipomo years"],
    },
  ],
};

export const williamGDanaSourceAnnotations: SourceSemanticAnnotations = {
  "bio-identity": {
    people: ["william-g-dana"],
    places: ["rancho-nipomo", "boston"],
    yearStart: 1797,
    yearEnd: 1858,
    period: "adobe-years",
  },
  "bio-birth-boston": {
    people: ["william-g-dana"],
    places: ["boston"],
    yearStart: 1797,
    yearEnd: 1797,
    period: "pacific-trade",
  },
  "bio-marriage-1828": {
    people: ["william-g-dana", "maria-josefa-carrillo"],
    places: ["santa-barbara"],
    events: ["marriage-1828"],
    yearStart: 1828,
    yearEnd: 1828,
  },
  "rancho-grant-1837": {
    people: ["william-g-dana"],
    places: ["rancho-nipomo"],
    events: ["nipomo-grant"],
    yearStart: 1835,
    yearEnd: 1837,
  },
  "rancho-move-1839-adobe": {
    people: ["william-g-dana", "maria-josefa-carrillo"],
    places: ["dana-adobe", "rancho-nipomo"],
    yearStart: 1839,
    yearEnd: 1839,
    period: "adobe-years",
  },
  "bryant-1846-visit": {
    people: ["william-g-dana", "edwin-bryant", "john-c-fremont"],
    places: ["rancho-nipomo"],
    yearStart: 1846,
    yearEnd: 1846,
    period: "adobe-years",
  },
  "mail-route-1847": {
    people: ["william-g-dana"],
    places: ["rancho-nipomo"],
    events: ["us-mail-1847"],
    yearStart: 1847,
    yearEnd: 1847,
  },
  "rheumatism-and-death": {
    people: ["william-g-dana"],
    places: ["dana-adobe", "san-luis-obispo"],
    yearStart: 1850,
    yearEnd: 1858,
    period: "adobe-years",
  },
};
