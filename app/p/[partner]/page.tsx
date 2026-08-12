import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPartner,
  isKnownPartnerId,
  listPartnerPersonaPublic,
  listPartners,
} from "@/partners";

export function generateStaticParams() {
  return listPartners().map((p) => ({ partner: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ partner: string }>;
}): Promise<Metadata> {
  const { partner: partnerId } = await params;
  const partner = getPartner(partnerId);
  if (!partner) return {};
  return {
    title: `Private beta — ${partner.name}`,
    description: partner.tagline,
  };
}

export default async function PartnerLandingPage({
  params,
}: {
  params: Promise<{ partner: string }>;
}) {
  const { partner: partnerId } = await params;
  if (!isKnownPartnerId(partnerId)) notFound();

  const partner = getPartner(partnerId);
  if (!partner) notFound();

  const personas = listPartnerPersonaPublic(partner.id);

  return (
    <main className="app">
      <div className="brandbar">
        <Link className="brand" href={`/p/${partner.id}`} aria-label="ECHOES — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/echoes-logo.png" alt="ECHOES" />
        </Link>
      </div>

      <header className="masthead">
        <div className="kicker">Private beta · ECHOES</div>
        <h1>{partner.name}</h1>
        <p className="sub">{partner.tagline}</p>
      </header>

      <p className="partner-landing-note">{partner.disclosure}</p>

      <section
        className="persona-gallery"
        aria-label={`Historical figures for ${partner.name}`}
      >
        {personas.map((p) => (
          <Link
            key={p.slug}
            href={`/p/${partner.id}/${p.slug}`}
            className="persona-card"
          >
            <div className="persona-card-portrait" aria-hidden>
              {p.portraitImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.portraitImage}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="persona-card-glyph">{p.portrait}</span>
              )}
            </div>
            <div className="persona-card-body">
              <p className="persona-card-region">{p.region}</p>
              <h2>
                {p.name}{" "}
                <span className="persona-card-years">{p.years}</span>
              </h2>
              <p className="persona-card-tagline">{p.tagline}</p>
              <p className="persona-card-era">{p.era}</p>
              <span className="persona-card-cta">Start conversation →</span>
            </div>
          </Link>
        ))}
      </section>

      <footer className="footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="footer-logo" src="/echoes-logo.png" alt="" aria-hidden />
        <span>
          ECHOES · Private beta for {partner.name} · Source-grounded local history
        </span>
      </footer>
    </main>
  );
}
