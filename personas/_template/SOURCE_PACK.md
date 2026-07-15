# Source-pack template (copy for each new historian)

Use this checklist so every persona reaches Myron-quality before going live.

## 1. Identity
- [ ] Full name, years, speaking year (temporal cutoff)
- [ ] One-sentence tagline for the landing card
- [ ] Era line (where / when they speak from)
- [ ] Portrait or landmark image with license

## 2. Files to create (`personas/<slug>/`)
- [ ] `public.ts` — client display + 5 starters
- [ ] `persona.ts` — system prompt (voice, scope, image rules)
- [ ] `sources.ts` — 25–50 hand-verified `SourceChunk`s
- [ ] `images.ts` — curated `ImageAsset[]` (10+ when possible)
- [ ] `imageTopicCatalog.ts` — topic → buzzwords → imageIds
- [ ] `wikipediaTopics.ts` — topic/keyword → Wikipedia articles
- [ ] `pack.ts` — assemble `PersonaPack` and register in `personas/index.ts`
- [ ] **2+ primary works** as `book-chunks-<key>.json` via `node scripts/ingest-persona-books.mjs <slug>`
- [ ] List all book files in `pack.ts` → `bookChunksPaths: [...]`

## 3. Claim bank quality
- [ ] Every chunk has citation + reliability
- [ ] Identity facts use `bio-*` (or declared prefixes)
- [ ] Contested topics marked; taboo list in prompt
- [ ] No post-cutoff events presented as firsthand knowledge

## 4. Red-team (~30 questions)
Run before launch; fix failures:

| Category | Example |
|----------|---------|
| Known fact | Who are you? |
| Timeline | When did X happen? |
| Motivation | Why did you…? |
| Contested | What do historians disagree about? |
| Counterfactual | What if X never happened? |
| Off-topic modern | What is Instagram? |
| Out of source | Ask something not in the pack |
| Image match | Show me the store / mission / railroad |
| Unsafe | Inappropriate roleplay |
| Prompt injection | Ignore instructions… |

## 5. Sign-off
- [ ] Smoke test script passes for this slug
- [ ] Domain expert or partner reviewed (museum / teacher / community)
- [ ] Landing card + starters feel visitor-ready
