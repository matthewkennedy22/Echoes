# ECHOES

**Local history, made conversational.**

ECHOES turns a community's own archives into trustworthy, source-grounded
conversations. This repo contains the first hero persona — **Myron Angel**
(1827–1911), pioneer journalist, county historian, and father of Cal Poly —
built as a demo-ready San Luis Obispo pilot.

It is a Next.js app with a small Retrieval-Augmented Generation (RAG) engine:
answers are grounded in a fact-checked source pack, and every reply is labeled by
how well the sources support it (**documented / reasonable inference / contested /
not in the sources**) with a "show evidence" panel that reveals the citations.

---

## Quick start

1. **Add your API key.** Copy the example env file and paste in an OpenAI key
   (get one at https://platform.openai.com/api-keys):

   ```bash
   cp .env.local.example .env.local
   # then edit .env.local and set OPENAI_API_KEY=sk-...
   ```

2. **Run it:**

   ```bash
   npm install      # already done if you've built before
   npm run dev
   ```

3. **Build the search index once** (Myron now knows his whole 1883 county
   history — 1,600+ passages — so they need to be embedded one time). With the
   dev server running, visit:

   ```
   http://localhost:3000/api/chat
   ```

   Wait until it returns `{"ok":true,...}` (about 20–40 seconds). The index is
   cached to `.cache/` so this only happens once. You can skip this step — the
   first chat message will build it automatically (it'll just be slow once).

4. Open http://localhost:3000 and talk to Myron Angel.

> Cost is tiny — building the index is a fraction of a cent, and each
> conversation runs a few cents or less on the default `gpt-4o-mini` +
> `text-embedding-3-small` models.

---

## How it works

```
app/
  page.tsx              Landing page: masthead, persona card, disclosure
  api/chat/route.ts     POST endpoint -> grounded answer
components/
  Chat.tsx              Client chat UI + evidence panel
lib/
  llm.ts                OpenAI client (embeddings + chat). Swap provider here.
  rag.ts                Retrieval, prompt assembly, evidence labeling
  types.ts              Shared types
personas/
  myron-angel/
    public.ts           Client-safe display info (name, starters, disclosure)
    persona.ts          SERVER-ONLY voice + 1905 guardrails
    sources.ts          SERVER-ONLY fact-checked, cited source pack
```

**Request flow:** user message → embed the question → cosine-similarity search over
the source pack (embedded once, cached in memory) → top chunks are injected into
the persona prompt → the model answers as Myron Angel (1905) and returns JSON with
an `evidence_label` and the source ids it used → the UI shows the answer, label,
and citations.

---

## Editing the history (the part that matters most)

The product's quality and moat live in `personas/myron-angel/sources.ts`. Each
entry is a single fact with a real citation and a reliability rating. To improve
Myron:

- **Add a fact:** append a new object to `myronAngelSources` with `text`,
  `topics`, `citation`, and `reliability`. It becomes retrievable immediately.
- **Adjust his voice:** edit `persona.ts`.
- **Change starter questions / disclosure:** edit `public.ts`.

Every fact here was verified (June 2026) against the Wikipedia biography, the
National Register nomination for the Myron Angel House, Cal Poly's official
history, a San Luis Obispo Tribune feature, the Online Archive of California
finding aid, and the 1883 book on the Internet Archive.

### The ingested 1883 book
Myron is grounded in two layers:

1. **`sources.ts`** — ~26 hand-verified, high-reliability facts (his biography,
   Cal Poly, key SLO milestones). These are boosted slightly in retrieval.
2. **`book-chunks.json`** — 1,665 passages auto-extracted from the full OCR text
   of his own 1883 *History of San Luis Obispo County* (public domain), each
   tagged with its page and chapter for citation. This is what makes him a real
   guide to SLO's mission, rancho, conquest, and pioneer history through ~1905.

To regenerate the book layer (e.g., to tweak chunking):

```bash
npm run ingest      # downloads + cleans + chunks the book (no API key needed)
```

This rewrites `book-chunks.json`. The embedding index rebuilds automatically the
next time you warm `/api/chat` (the cache invalidates when the corpus changes).

---

## Adding a second persona

The structure is built to scale to Ah Louis, Pierre Dallidet, or any local
figure: duplicate the `personas/myron-angel/` folder, swap the content, and wire a
persona selector. (Not built yet — single hero for the first pilot.)

---

## Roadmap (see `ECHOES_MVP_Plan.md`)

- [ ] Ingest full public-domain source texts
- [ ] Teacher/curator dashboard + QR code generation
- [ ] Transcript export + "what's uncertain?" view
- [ ] Move source store to Supabase + pgvector for scale
- [ ] Second and third SLO personas
