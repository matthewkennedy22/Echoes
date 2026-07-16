import Link from "next/link";
import { portraitCropStyle } from "@/lib/portraitCrop";
import { listPersonaPublic } from "@/personas";

export default function Home() {
  const personas = listPersonaPublic();

  return (
    <main className="app">
      <div className="brandbar">
        <Link className="brand" href="/" aria-label="ECHOES — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/echoes-logo.png" alt="ECHOES" />
        </Link>
      </div>

      <header className="masthead">
        <div className="kicker">Local History, Made Conversational</div>
        <h1>California Speaks</h1>
        <p className="sub">
          Source-grounded conversations with figures from California&apos;s past.
          Every answer is labeled by evidence.
        </p>
      </header>

      <section className="persona-gallery" aria-label="Historical figures by region">
        {personas.map((p) => (
          <Link key={p.slug} href={`/${p.slug}`} className="persona-card">
            <div className="persona-card-portrait" aria-hidden>
              {p.portraitImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.portraitImage}
                  alt=""
                  referrerPolicy="no-referrer"
                  style={portraitCropStyle(p.slug, "landing")}
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

      <section className="landing-partner">
        <h2>Partner with ECHOES</h2>
        <p>
          Museums, libraries, and schools: we turn <em>your</em> archives into a
          trustworthy conversation visitors can open by scanning a QR code. Free
          beta pilots available — America250–ready.
        </p>
        <a className="partner-cta" href="mailto:matthewkennedy22@gmail.com">
          Request a figure for your collection
        </a>
      </section>

      <footer className="footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="footer-logo" src="/echoes-logo.png" alt="" aria-hidden />
        <span>ECHOES · California Speaks · Source-grounded local history</span>
      </footer>
    </main>
  );
}
