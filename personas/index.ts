import type { PersonaPublic } from "@/lib/types";
import type { PersonaPack } from "@/personas/types";
import { myronAngelPack } from "@/personas/myron-angel/pack";
import { bancroftPack } from "@/personas/hubert-howe-bancroft/pack";
import { hortonPack } from "@/personas/alonzo-horton/pack";
import { masonPack } from "@/personas/jesse-d-mason/pack";
import { muirPack } from "@/personas/john-muir/pack";
import { hemmePack } from "@/personas/august-hemme/pack";
import { loosPack } from "@/personas/anita-loos/pack";
import { spreckelsPack } from "@/personas/john-d-spreckels/pack";
import { williamGDanaPack } from "@/personas/william-g-dana/pack";
import { mariaJosefaCarrilloPack } from "@/personas/maria-josefa-carrillo/pack";

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
  [spreckelsPack.public.slug]: spreckelsPack,
  [williamGDanaPack.public.slug]: williamGDanaPack,
  [mariaJosefaCarrilloPack.public.slug]: mariaJosefaCarrilloPack,
};

/** California Speaks gallery — north to south. Partner-only figures are omitted. */
const LANDING_ORDER = [
  "john-muir",
  "hubert-howe-bancroft",
  "august-hemme",
  "myron-angel",
  "jesse-d-mason",
  "anita-loos",
  "alonzo-horton",
] as const;

function isPublicVisibility(pack: PersonaPack): boolean {
  return (pack.public.visibility ?? "public") === "public";
}

/** All registered persona packs (server-safe), including partner-only figures. */
export function listPersonaPacks(): PersonaPack[] {
  return Object.values(REGISTRY);
}

/** Client-safe cards for the public California Speaks landing. */
export function listPersonaPublic(): PersonaPublic[] {
  return LANDING_ORDER.map((slug) => REGISTRY[slug])
    .filter((p): p is PersonaPack => Boolean(p) && isPublicVisibility(p))
    .map((p) => p.public);
}

export function isPublicPersonaSlug(slug: string): boolean {
  const key = slug.trim().toLowerCase();
  const pack = REGISTRY[key];
  return Boolean(pack) && isPublicVisibility(pack);
}

export function getPersonaPack(slug?: string | null): PersonaPack {
  const key = (slug || DEFAULT_PERSONA_SLUG).trim().toLowerCase();
  return REGISTRY[key] ?? REGISTRY[DEFAULT_PERSONA_SLUG];
}

export function isKnownPersonaSlug(slug: string): boolean {
  return slug.trim().toLowerCase() in REGISTRY;
}

export { REGISTRY };
