import type { PersonaPublic } from "@/lib/types";
import { getPersonaPack, isKnownPersonaSlug } from "@/personas";

/** A museum / heritage partner with its own unlisted landing. */
export interface PartnerSite {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  /** Shown on the partner landing — not official museum content until they approve. */
  disclosure: string;
  /** Ordered figure slugs for this partner's gallery. */
  personaSlugs: string[];
}

const PARTNERS: Record<string, PartnerSite> = {
  cha: {
    id: "cha",
    name: "Coronado Historical Association",
    shortName: "CHA",
    tagline:
      "Source-grounded conversations for Coronado. Every answer is labeled by evidence.",
    disclosure:
      "This is a private ECHOES beta. Anyone with this link can open it, but it is not listed on the public California Speaks site.",
    personaSlugs: ["john-d-spreckels"],
  },
  "dana-adobe": {
    id: "dana-adobe",
    name: "Dana Adobe",
    shortName: "Dana Adobe",
    tagline:
      "Source-grounded conversations at Rancho Nipomo. Every answer is labeled by evidence.",
    disclosure:
      "This is a private ECHOES beta. Anyone with this link can open it, but it is not listed on the public California Speaks site.",
    personaSlugs: ["william-g-dana", "maria-josefa-carrillo"],
  },
};

export function listPartners(): PartnerSite[] {
  return Object.values(PARTNERS);
}

export function isKnownPartnerId(id: string): boolean {
  return id.trim().toLowerCase() in PARTNERS;
}

export function getPartner(id: string): PartnerSite | undefined {
  return PARTNERS[id.trim().toLowerCase()];
}

export function getPartnerForPersonaSlug(slug: string): PartnerSite | undefined {
  const key = slug.trim().toLowerCase();
  return listPartners().find((p) => p.personaSlugs.includes(key));
}

export function partnerOwnsPersona(partnerId: string, slug: string): boolean {
  const partner = getPartner(partnerId);
  if (!partner) return false;
  return partner.personaSlugs.includes(slug.trim().toLowerCase());
}

/** Client-safe cards for a partner landing, in registry order. */
export function listPartnerPersonaPublic(partnerId: string): PersonaPublic[] {
  const partner = getPartner(partnerId);
  if (!partner) return [];
  return partner.personaSlugs
    .filter((slug) => isKnownPersonaSlug(slug))
    .map((slug) => getPersonaPack(slug).public);
}
