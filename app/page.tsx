import Chat from "@/components/Chat";
import FirstVisitNotice from "@/components/FirstVisitNotice";
import { myronAngelPublic as persona } from "@/personas/myron-angel/public";

export default function Home() {
  return (
    <main className="app">
      <FirstVisitNotice />
      <div className="brandbar">
        <a className="brand" href="/" aria-label="ECHOES — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/echoes-logo.png" alt="ECHOES" />
        </a>
      </div>

      <header className="masthead">
        <div className="kicker">Local History, Made Conversational</div>
        <h1>San Luis Obispo Speaks</h1>
        <p className="sub">A living conversation with the people who built the Central Coast</p>
      </header>

      <section className="persona">
        <div className="portrait" aria-hidden>
          {persona.portraitImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={persona.portraitImage} alt={persona.name} />
          ) : (
            persona.portrait
          )}
        </div>
        <div className="meta">
          <h2>
            {persona.name} <span style={{ fontWeight: "normal", color: "var(--ink-soft)" }}>· {persona.years}</span>
          </h2>
          <p>{persona.tagline}</p>
          <p>{persona.era}</p>
        </div>
      </section>

      <div className="disclosure">
        <span aria-hidden>ⓘ</span>
        <span>{persona.disclosure}</span>
      </div>

      <Chat />

      <footer className="footer">
        ECHOES · An AI simulation grounded in public-domain historical sources ·
        Answers are labeled by evidence and may contain errors.
      </footer>
    </main>
  );
}
