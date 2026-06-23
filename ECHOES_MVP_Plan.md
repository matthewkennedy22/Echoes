# ECHOES — MVP Plan of Attack

**Working name:** ECHOES
**Owner:** Matthew Kennedy
**Plan date:** June 22, 2026
**Status:** Strategy locked (local-history wedge). Building toward first pilot.

> This document supersedes the strategic conclusions of
> `Planning Documents/Historical_AI_Conversation_Platform_Action_Plan.docx`
> where they conflict. The original action plan is still a great reference for
> pedagogy, feature lists, and detailed checklists — but its core "differentiation"
> has since become table stakes (see §2). This plan repositions accordingly.

---

## 1. One-sentence positioning

> **ECHOES turns a community's *own* archives — oral histories, founder papers, local
> museum collections, and namesake figures — into trustworthy, sourced conversations.
> Generic textbook figures are a commodity; *local history* is the product.**

Keep this visible in every product and sales decision.

---

## 2. Competitive reality check (updated June 22, 2026)

The original plan's research was a "brief web scan" from June 18. A deeper teardown
shows the market matured faster than the doc assumed. **The "winning wedge" the doc
describes — sourced, teacher-controlled, evidence-labeled conversations with QR
deployment — has already been shipped by competitors.**

| Competitor | What they've already shipped | Funding / scale | Implication |
|---|---|---|---|
| **Humy.ai** (Stockholm) | 1,200+ primary-source-grounded figures with **inline citations**, link/QR access **with no student accounts**, FERPA/COPPA/GDPR, DPAs in 15 states, auto-graded assignments (DBQ/LEQ/essay), voice, 50+ languages, custom figures from uploads, topic scoping, standards alignment; schools + universities + museums. Free tier + **$129/user/yr**. | Only **~$150K pre-seed** (2024) | They built the doc's "differentiated MVP" on a shoestring. Source-grounding + teacher control + QR + museums = **table stakes**, not differentiation. |
| **SchoolAI** (Utah) | Broad classroom platform; historical-figure "Spaces" with content warnings (Holocaust/slavery) built with historians; **"Mission Control"** real-time monitoring + safety alerts; SOC 2; **ESSA Tier 3** (measured 28% critical-thinking gain). | **$32.5M raised, ~$84M valuation**, 1M+ classrooms, 400+ districts | Owns **teacher monitoring + safety + distribution**. Don't fight them on monitoring or district reach. |
| **Ask Mona** (France) | Museum/cultural conversational guides; **OpenAI partnership**, Versailles deployment, multilingual QR, museum-validated knowledge bases, "Museum AI Pledge." | Well-established, enterprise/cultural | Owns **big museums / cultural heritage**, esp. Europe. Small US local museums + historical societies are still underserved. |
| **Hello History** (consumer) | Mobile app, hundreds of figures, ungrounded. Its "AI Hitler" denied the Holocaust (Jerusalem Post). | Consumer | **Cautionary tale** that validates the trust thesis. Not an institutional competitor. |

**Bottom line:** Building exactly what the .docx describes = a worse-funded clone of
Humy and SchoolAI. We must compete where they structurally can't.

---

## 3. The defensible opening

The giants all own the **generic textbook layer** (Lincoln, Cleopatra, da Vinci).
**None of them have *your town*.** Our wedge:

1. **Hyper-local & custom personas as the *core product*, not an add-on.**
   School namesakes, town founders, local-museum archives, veterans' and immigrants'
   oral histories, indigenous community history. Service-heavy curation is *why* it's a
   moat — the platforms won't do it at scale.

2. **America250 tailwind (time-boxed, 2026 only).**
   The U.S. 250th anniversary is now. State humanities councils are actively granting
   **$5K–$25K** oral-history / "legacy project" funds to local nonprofits, historical
   societies, libraries, schools, and tribes — many with deadlines this fall (e.g.,
   Idaho's close Sept 30). This is *budget allocated for exactly our product, this year.*

3. **Oral-history-to-persona pipeline is unowned.**
   Capture/transcription tools exist (TheirStory, Lore, OHMS), but nobody turns those
   archives into a trustworthy *conversational* persona. ECHOES is the layer on top.

We still ship **Classroom Mode** and **Exhibit/Tour Mode**, but we *lead* with local.

---

## 4. Sourcing the hero local figure (you don't have archive access yet)

The entire first pilot rides on **one** compelling local persona. Playbook to land it
in ~2 weeks, ranked easiest → hardest:

### Option A — Local historical society / small museum (recommended first call)
- They have archives + a public-engagement mandate + (now) America250 grant access,
  but usually **no digital tools**. Perfect match.
- **Action:** List every historical society, small museum, library local-history room,
  and visitor center within ~30 miles. Email/call 10. Pitch: *"I'll turn one figure or
  exhibit from your collection into a free interactive experience for an America250
  project — no cost to you, you keep the asset."*

### Option B — A school's namesake or founder
- Many schools are named after a local figure with documents in the school/district
  archive or local library. Built-in classroom pilot + the namesake is locally beloved.
- **Action:** Pick one nearby private school; ask the history dept chair / librarian if
  there's a namesake or founder with surviving letters, speeches, board minutes, or news.

### Option C — Town/city founder or civic figure
- City clerk, county records, local library "vertical files," newspaper archives
  (often digitized via the state library or Chronicling America).
- **Action:** Visit the local library's local-history desk; ask the librarian directly —
  they know exactly who has the best surviving documentation.

### Option D — Oral-history subject (highest emotional impact, more work)
- A still-living or recently-passed community figure (veteran, longtime business owner,
  civil-rights figure, immigrant elder). Record/transcribe (TheirStory/Lore) → persona.
- Strongest America250 story; needs consent and more curation time.

**Selection criteria for the hero (pick the figure that maximizes these):**
- [ ] You can get **10–25 reliable primary/secondary sources** within 2 weeks
- [ ] The figure is **locally meaningful** (someone will care it exists)
- [ ] A **partner** (museum/school/society) is excited to pilot it
- [ ] **Rights are clean** (public domain, institution-owned, or permissioned)
- [ ] There's a **plausible America250 angle** for funding

> **First concrete step:** build the target list (Option A + C are fastest). I can draft
> the outreach emails and a one-page "what you get" leave-behind when you're ready.

---

## 5. MVP scope

### In scope (v0 — what gets us to a pilot)
- 1 hero local persona + **2 famous anchor figures** (credibility/demo)
- RAG over curated source packs with **4 evidence labels**
  (documented / reasonable inference / contested / unknown)
- Mobile-first chat: AI-simulation disclosure, starter questions,
  **"show evidence"** + **"what's uncertain"** buttons, transcript export, reflection prompt
- Teacher/curator dashboard: create session link + **QR code**, set audience level +
  objective, review transcripts, basic analytics, export
- Class-code / link access — **no student accounts**
- Institution branding for the pilot partner
- Basic moderation + blocked topics + age level

### Explicitly NOT in v0 (resist scope creep)
- LMS integration, auto-grading, standards mapping
- Giant persona library, persona marketplace
- Native mobile app, location-aware tour GPS
- Polished voice mode (text first; voice is a fast-follow)
- SSO / district enterprise governance
- Multilingual (add when a partner needs it)

---

## 6. Technical architecture

Lean, modern, single reusable platform with two front-end modes (Classroom / Exhibit).

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js (App Router) + TypeScript + Tailwind** | One codebase, SSR, mobile-first, fast to ship |
| DB + Auth + Storage + Vectors | **Supabase** (Postgres + `pgvector` + Storage + Auth) | One service covers DB, file storage, auth, and vector search — minimal ops |
| LLM (chat) | One provider behind an **abstraction layer**; start on a **Flash/mini tier** (Gemini Flash / GPT-mini / Claude Haiku) with **prompt caching** of persona + source pack | Cheap, fast, swappable |
| Embeddings | Provider embeddings → `pgvector` | No separate vector DB needed at MVP scale |
| Moderation | Provider moderation + custom blocked-topic rules | School-grade safety |
| Analytics | **PostHog** | Sessions, evidence clicks, funnels |
| Exports | Server-side PDF/CSV | Transcripts + reports |
| Hosting | **Vercel** (web) + Supabase (backend) | Zero-config deploys |

### Core data model (MVP tables)
- `institution` — name, type, plan, branding, privacy/retention settings
- `user` — role (admin/teacher/curator), institution, permissions
- `persona` — name, era, tags, status, voice settings, links to source pack
- `source_document` — file ref, type, date, author, rights/permissions, reliability
- `source_chunk` — text, embedding (`pgvector`), doc id, date range, topic tags
- `session` — persona, class/exhibit, start/end, settings (audience, objective)
- `message` — user input, model response, retrieved chunk ids, evidence label, flags
- `analytics_event` — scan, session start, evidence click, export, flag

### RAG response pipeline
1. Classify intent / grade level / safety / topic
2. Retrieve top source chunks for the persona (+ optional timeline/claim-bank facts)
3. Generate in persona voice, constrained to retrieved sources
4. Assign evidence label (documented / inference / contested / unknown)
5. Output safety + hallucination check
6. Return answer (+ optional evidence panel); log everything for review

---

## 7. Source-pack spec (the actual moat)

Every persona is a **structured source pack**, not a loose prompt. This is the unit of
quality and the thing customers pay a premium for.

- **Persona brief** (500–1,000 words): person, era, worldview, constraints, voice
- **Primary sources**: letters, speeches, diaries, interviews, records, writings
- **Secondary sources**: scholarly books, museum labels, encyclopedia entries
- **Timeline**: dates, events, locations, affiliations, turning points
- **Claim bank**: 50–100 key facts (figure for famous; fewer ok for local)
- **Known boundaries / taboo list**: topics to refuse or frame carefully
- **Contested topics**: where historians disagree
- **Citation map**: source snippets ↔ claims/topics/date ranges
- **Reading-level settings**: middle / high / college / general / expert

**Red-team test set (per persona, ~30 Qs):** known-fact, date/timeline, motivation/emotion,
counterfactual, contested-interpretation, off-topic-modern, unsafe/inappropriate,
prompt-injection, out-of-source, citation/evidence-request. A human reviewer signs off
before any live use. Re-run as an eval after every prompt/model change.

---

## 8. Build phases & timeline (solo + me; ~6–9 weeks to first pilot)

| Phase | Output | Est. |
|---|---|---|
| 0. Lock wedge + pick hero figure + target partner | Positioning, 1 hero figure, 1 partner conversation started | This week |
| 1. Source packs | Hero + 2 anchors, timelines, claim banks, taboo lists, 30-Q tests | ~1 wk |
| 2. Conversation engine | RAG + evidence labels + chunk logging + eval script | 1–2 wk |
| 3. Student/visitor chat UI | Mobile chat, disclosure, starters, evidence/uncertainty buttons, export, reflection, branding | ~1 wk |
| 4. Teacher/curator dashboard | Session + QR creation, transcript review, analytics, export, retention | 1–2 wk |
| 5. Internal QA | Run all tests + adversarial prompts; fix top 20 issues | 3–5 days |
| 6. Pilot launch | 1 school teacher + 1 museum/society (ideally America250-tied); collect metrics → case study | 2–4 wk |

---

## 9. Unit economics

RAG conversations are cheap in 2026: a 6-turn grounded conversation ≈ **$0.01–0.05**;
~**10,000 conversations/month ≈ $40–150** on the Flash/mini tier (less with prompt
caching of the persona + source pack). **The real cost is human source-pack curation,
not inference** — so productize/templatize curation and price the custom build at a
premium. A $500–1,500 classroom pilot has excellent margins.

---

## 10. Go-to-market

- **Direct outreach only** for the first ~20 pilots (no paid ads).
- **Lead with the local angle + America250 funding**, not "AI for AI's sake."
- Target order: local historical societies/small museums → local private-school history
  teachers → libraries/visitor centers/tour operators.
- Offer a **low-risk pilot**: one figure, one class or exhibit, clear success metrics.
- Convert the strongest pilot into a **case study** (screens, metrics, quotes, sample
  outputs) → sell paid beta to 5–10 institutions.

### Pricing hypotheses (validate willingness to pay, don't optimize yet)
- **Custom Local Figure Build:** $1,500–$7,500 / figure (the headline product)
- **Classroom Pilot:** $500–$1,500 for 4–6 weeks
- **Museum Pilot:** $750–$2,500 setup + monthly
- **Platform subscription (later):** $99–$499/mo small orgs; custom for schools/networks

---

## 11. Risk register (top items)

| Risk | Mitigation |
|---|---|
| Hallucinated facts destroy trust | RAG, evidence labels, uncertainty language, red-team tests, human sign-off |
| **Giants out-build us on generic figures** | Don't compete there — own local/custom + America250 |
| Source-pack labor is service-heavy | Templates, semi-automated ingestion, checklists, premium pricing |
| Content/rights restrictions | Public-domain, institution-owned, or permissioned only |
| Student privacy blocks schools | No accounts, minimal data, retention controls, clear agreements |
| Unsafe roleplay (war/racism/trauma) | Age-level moderation, topic constraints, context-first framing |
| Low repeat usage / novelty fade | Tie to assignments, field trips, recurring units; recurring local content |

---

## 12. Immediate next actions

1. **Build the local-partner target list** (historical societies + small museums + library
   local-history desks within ~30 mi). _I can generate the outreach email + 1-page leave-behind._
2. **Identify 1 America250 grant** you or a partner can apply to (state humanities council).
3. **Pick the hero local figure** once a partner says yes (use §4 criteria).
4. **Scaffold the codebase** (Next.js + Supabase + RAG) — can start in parallel using the
   2 famous anchor figures so the engine is ready when the hero source pack lands.
5. **Draft the source-pack template + red-team test format** (reusable for every future figure).

---

### Appendix — key sources from market research (June 22, 2026)
- Humy.ai pricing/features: humy.ai (pricing, /for-schools, /for-universities, 2026 buyer's guide)
- SchoolAI: schoolai.com (Mission Control, historical-figure spaces); $25M Series A (Apr 2025, Insight Partners); ESSA Tier 3 (Apr 2026)
- Ask Mona: askmona.ai (Versailles, New Delhi/OpenAI, Autun museum case studies)
- Hello History "AI Hitler" failure: reported via Jerusalem Post (cited in Humy 2026 buyer's guide)
- America250 local grants + oral history: Idaho Capital Sun (state historical society grants $5K–$25K)
- RAG/LLM 2026 cost benchmarks: benchr.org, tokenrate.dev, swfte.com
