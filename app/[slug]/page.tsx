import { notFound } from "next/navigation";
import Chat from "@/components/Chat";
import FirstVisitNotice from "@/components/FirstVisitNotice";
import LeaveChatLink from "@/components/LeaveChatLink";
import { portraitCropStyle } from "@/lib/portraitCrop";
import {
  getPersonaPack,
  isKnownPersonaSlug,
  listPersonaPublic,
} from "@/personas";

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

  const pack = getPersonaPack(slug);
  const persona = pack.public;
  const portraitShape =
    slug === "august-hemme" ||
    slug === "anita-loos" ||
    slug === "jesse-d-mason"
      ? "rect"
      : "round";

  return (
    <main className="app">
      <FirstVisitNotice />
      <div className="brandbar">
        <LeaveChatLink className="brand" href="/" aria-label="ECHOES — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/echoes-logo.png" alt="ECHOES" />
        </LeaveChatLink>
        <LeaveChatLink className="brand-back" href="/">
          All figures
        </LeaveChatLink>
      </div>

      <header className="persona-hero">
        <div
          className={`persona-hero-portrait persona-hero-portrait--${portraitShape}`}
          aria-hidden
        >
          {persona.portraitImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={persona.portraitImage}
              alt=""
              referrerPolicy="no-referrer"
              style={portraitCropStyle(slug)}
            />
          ) : (
            <span className="persona-hero-glyph">{persona.portrait}</span>
          )}
        </div>
        <p className="persona-card-region persona-page-region">{persona.region}</p>
        <h1>{persona.name}</h1>
        <p className="sub persona-page-meta">
          {persona.years} · {persona.tagline}
        </p>
        <p className="persona-page-era">{persona.era}</p>
      </header>

      <div className="disclosure">
        <span aria-hidden>ⓘ</span>
        <span>{persona.disclosure}</span>
      </div>

      <Chat persona={persona} />

      <footer className="footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="footer-logo" src="/echoes-logo.png" alt="" aria-hidden />
        <span>
          ECHOES · California Speaks · An AI simulation grounded in public-domain
          historical sources · Answers are labeled by evidence and may contain errors.
        </span>
      </footer>
    </main>
  );
}
