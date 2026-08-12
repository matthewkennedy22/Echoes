import { notFound, redirect } from "next/navigation";
import PersonaChatPage from "@/components/PersonaChatPage";
import {
  getPersonaPack,
  isKnownPersonaSlug,
  isPublicPersonaSlug,
  listPersonaPublic,
} from "@/personas";
import { getPartnerForPersonaSlug } from "@/partners";

export function generateStaticParams() {
  return listPersonaPublic().map((p) => ({ slug: p.slug }));
}

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isKnownPersonaSlug(slug)) notFound();

  if (!isPublicPersonaSlug(slug)) {
    const partner = getPartnerForPersonaSlug(slug);
    if (partner) {
      redirect(`/p/${partner.id}/${slug}`);
    }
    notFound();
  }

  const pack = getPersonaPack(slug);
  const persona = pack.public;

  return (
    <PersonaChatPage
      persona={persona}
      homeHref="/"
      homeLabel="All figures"
    />
  );
}
