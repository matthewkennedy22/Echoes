import type { PersonaPublic } from "@/lib/types";
import type { PersonaPack } from "@/personas/types";
import { myronAngelPack } from "@/personas/myron-angel/pack";
import { bancroftPack } from "@/personas/hubert-howe-bancroft/pack";
import { hortonPack } from "@/personas/alonzo-horton/pack";
import { masonPack } from "@/personas/jesse-d-mason/pack";
import { muirPack } from "@/personas/john-muir/pack";
import { hemmePack } from "@/personas/august-hemme/pack";
import { loosPack } from "@/personas/anita-loos/pack";

/** Default persona when none is specified (backward compatible). */
export const DEFAULT_PERSONA_SLUG = "myron-angel";

/**
 * Registered historians — display order on the landing page.
 * Myron Angel remains the only San Luis Obispo representative.
 */
const REGISTRY: Record<string, PersonaPack> = {
  [myronAngelPack.public.slug]: myronAngelPack,
  [bancroftPack.public.slug]: bancroftPack,
  [hortonPack.public.slug]: hortonPack,
  [masonPack.public.slug]: masonPack,
  [muirPack.public.slug]: muirPack,
  [hemmePack.public.slug]: hemmePack,
  [loosPack.public.slug]: loosPack,
};

/** Stable landing-page order — north to south. */
const LANDING_ORDER = [
  "john-muir",
  "hubert-howe-bancroft",
  "august-hemme",
  "myron-angel",
  "jesse-d-mason",
  "anita-loos",
  "alonzo-horton",
] as const;

/** All registered persona packs (server-safe). */
export function listPersonaPacks(): PersonaPack[] {
  return LANDING_ORDER.map((slug) => REGISTRY[slug]).filter(Boolean);
}

/** Client-safe public cards for the landing page. */
export function listPersonaPublic(): PersonaPublic[] {
  return listPersonaPacks().map((p) => p.public);
}

export function getPersonaPack(slug?: string | null): PersonaPack {
  const key = (slug || DEFAULT_PERSONA_SLUG).trim().toLowerCase();
  return REGISTRY[key] ?? REGISTRY[DEFAULT_PERSONA_SLUG];
}

export function isKnownPersonaSlug(slug: string): boolean {
  return slug.trim().toLowerCase() in REGISTRY;
}

export { REGISTRY };
