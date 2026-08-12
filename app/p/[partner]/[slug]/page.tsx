import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PersonaChatPage from "@/components/PersonaChatPage";
import { getPersonaPack, isKnownPersonaSlug } from "@/personas";
import {
  getPartner,
  isKnownPartnerId,
  listPartners,
  partnerOwnsPersona,
} from "@/partners";

export function generateStaticParams() {
  return listPartners().flatMap((p) =>
    p.personaSlugs.map((slug) => ({ partner: p.id, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ partner: string; slug: string }>;
}): Promise<Metadata> {
  const { partner: partnerId, slug } = await params;
  const partner = getPartner(partnerId);
  if (!partner || !partnerOwnsPersona(partnerId, slug) || !isKnownPersonaSlug(slug)) {
    return {};
  }
  const persona = getPersonaPack(slug).public;
  return {
    title: `${persona.name} — ${partner.name}`,
    description: persona.tagline,
  };
}

export default async function PartnerPersonaPage({
  params,
}: {
  params: Promise<{ partner: string; slug: string }>;
}) {
  const { partner: partnerId, slug } = await params;
  if (!isKnownPartnerId(partnerId) || !isKnownPersonaSlug(slug)) notFound();
  if (!partnerOwnsPersona(partnerId, slug)) notFound();

  const partner = getPartner(partnerId);
  if (!partner) notFound();

  const persona = getPersonaPack(slug).public;

  return (
    <PersonaChatPage
      persona={persona}
      homeHref={`/p/${partner.id}`}
      homeLabel={partner.name}
      footerLine={`ECHOES · Private beta for ${partner.name} · An AI simulation grounded in historical sources · Answers are labeled by evidence and may contain errors.`}
    />
  );
}
