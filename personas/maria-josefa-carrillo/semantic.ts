import type {
  PersonaSemanticVocab,
  SourceSemanticAnnotations,
} from "@/lib/semantic";

export const mariaJosefaCarrilloVocab: PersonaSemanticVocab = {
  people: [
    {
      id: "maria-josefa-carrillo",
      label: "María Josefa Carrillo de Dana",
      aliases: [
        "maria josefa",
        "mrs. dana",
        "senora dana",
        "josefa carrillo",
        "maria josefa petra del carmen",
      ],
    },
    {
      id: "william-g-dana",
      label: "Capt. William G. Dana",
      aliases: [
        "captain dana",
        "the captain",
        "william goodwin dana",
        "guillermo dana",
      ],
    },
    {
      id: "carlos-antonio-carrillo",
      label: "Carlos Antonio Carrillo",
      aliases: ["my father", "don carlos", "governor carrillo"],
    },
    {
      id: "raymundo-carrillo",
      label: "Raymundo Carrillo",
      aliases: ["grandfather", "don raymundo"],
    },
    {
      id: "john-f-dana",
      label: "John Francis Dana",
      aliases: ["john f. dana", "juan francisco"],
    },
    {
      id: "henry-tefft",
      label: "Henry Amos Tefft",
      aliases: ["tefft", "henry tefft", "son-in-law"],
    },
    {
      id: "maria-josefa-dana-tefft",
      label: "María Josefa Dana Tefft",
      aliases: ["mrs. tefft", "daughter josefa"],
    },
  ],
  places: [
    {
      id: "dana-adobe",
      label: "Dana Adobe",
      aliases: ["the adobe", "the house", "casa de dana"],
    },
    {
      id: "rancho-nipomo",
      label: "Rancho Nipomo",
      aliases: ["nipomo", "the rancho"],
    },
    {
      id: "santa-barbara",
      label: "Santa Barbara",
      aliases: ["the presidio", "mission santa barbara"],
    },
    {
      id: "san-luis-obispo",
      label: "San Luis Obispo",
      aliases: ["the mission", "old mission cemetery"],
    },
  ],
  organizations: [],
  events: [
    {
      id: "marriage-1828",
      label: "Marriage at Santa Barbara 1828",
      aliases: ["wedding", "august 1828"],
    },
    {
      id: "move-1839",
      label: "Move to Nipomo 1839",
      aliases: ["1839", "left santa barbara"],
    },
    {
      id: "us-mail-1847",
      label: "U.S. mail exchange 1847",
      aliases: ["mail route", "1847 mail", "kearny mail"],
    },
    {
      id: "railway-1881",
      label: "Pacific Coast Railway right-of-way 1881",
      aliases: ["railway", "right of way", "1881", "depot"],
    },
  ],
  periods: [
    {
      id: "santa-barbara-years",
      label: "Santa Barbara years",
      yearStart: 1812,
      yearEnd: 1839,
      aliases: ["girlhood", "early marriage"],
    },
    {
      id: "adobe-years",
      label: "Adobe years at Nipomo",
      yearStart: 1839,
      yearEnd: 1858,
      aliases: ["rancho years"],
    },
    {
      id: "widow-years",
      label: "Widow years at Nipomo",
      yearStart: 1858,
      yearEnd: 1883,
      aliases: ["after the captain", "railway years"],
    },
  ],
};

export const mariaJosefaCarrilloSourceAnnotations: SourceSemanticAnnotations = {
  "bio-identity": {
    people: ["maria-josefa-carrillo", "william-g-dana"],
    places: ["dana-adobe", "santa-barbara"],
    yearStart: 1812,
    yearEnd: 1883,
    period: "adobe-years",
  },
  "bio-birth-santa-barbara": {
    people: ["maria-josefa-carrillo"],
    places: ["santa-barbara"],
    yearStart: 1812,
    yearEnd: 1812,
    period: "santa-barbara-years",
  },
  "bio-marriage-1828": {
    people: ["maria-josefa-carrillo", "william-g-dana"],
    places: ["santa-barbara"],
    events: ["marriage-1828"],
    yearStart: 1828,
    yearEnd: 1828,
    period: "santa-barbara-years",
  },
  "rancho-grant-move": {
    people: ["maria-josefa-carrillo", "william-g-dana"],
    places: ["rancho-nipomo", "dana-adobe"],
    events: ["move-1839"],
    yearStart: 1837,
    yearEnd: 1839,
    period: "adobe-years",
  },
  "hospitality-hostess": {
    people: ["maria-josefa-carrillo", "william-g-dana"],
    places: ["dana-adobe", "rancho-nipomo"],
    yearStart: 1839,
    yearEnd: 1858,
    period: "adobe-years",
  },
  "mail-1847": {
    people: ["maria-josefa-carrillo", "william-g-dana"],
    places: ["rancho-nipomo"],
    events: ["us-mail-1847"],
    yearStart: 1847,
    yearEnd: 1847,
  },
  "partner-daughter-tefft": {
    people: [
      "maria-josefa-carrillo",
      "henry-tefft",
      "maria-josefa-dana-tefft",
      "william-g-dana",
    ],
    places: ["dana-adobe"],
    yearStart: 1849,
    yearEnd: 1858,
    period: "adobe-years",
  },
  "partner-portraits": {
    people: ["maria-josefa-carrillo", "william-g-dana"],
    yearStart: 1870,
    yearEnd: 1883,
    period: "widow-years",
  },
  "widow-years-legacy": {
    people: ["maria-josefa-carrillo", "john-f-dana"],
    places: ["rancho-nipomo"],
    events: ["railway-1881"],
    yearStart: 1858,
    yearEnd: 1883,
    period: "widow-years",
  },
  "captain-illness": {
    people: ["william-g-dana", "maria-josefa-carrillo"],
    places: ["dana-adobe"],
    yearStart: 1850,
    yearEnd: 1858,
    period: "adobe-years",
  },
};
