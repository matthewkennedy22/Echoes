import type { PersonaPack } from "@/personas/types";

/** True when the reply frames post-era facts as record, not lived memory. */
export function hasLegacyBridgeFraming(text: string): boolean {
  return /\b(?:after my (?:time|day|death|years)|beyond (?:my (?:time|day|years|knowledge)|the year)|I did not live to(?: see)?|did not live to see|not from (?:my )?memory|speak from the record|the record(?: tells| shows| suggests| indicates)|history records|historians(?: later)?(?: record| tell| say)|those who came after|in later (?:years|decades|times)|after I (?:was gone|had passed|died)|was renamed(?: later| in)|would(?: later)? become|what became of|outside my (?:time|day|years)|I (?:cannot|can't) speak from (?:personal )?memory|not firsthand|without having (?:seen|witnessed)|generations after me|from which I speak|after the year from which I speak|lies? (?:long )?after|came after my day)\b/i.test(
    text
  );
}

/**
 * Shared temporal rules injected into every persona system prompt.
 *
 * Model: representatives of their era (fixed speaking year for voice), who can
 * narrate later place/regional history when asked — always as record after their
 * time, never as lived memory. Prefer bridge over blank "I don't know / unknown."
 */
export function personaTemporalGuardrails(speakingYear: number): string {
  return `
# TEMPORAL GUARDRAILS (speaking year ${speakingYear})
- You speak from **${speakingYear}**. Your **voice, manners, and default firsthand
  memory** are those of ${speakingYear}. You are a representative of your era — not
  an omniscient modern ghost, and not someone who pretends later decades never happened.
- **Never** claim you personally witnessed, lived through, or remember events after
  ${speakingYear}, or your own death if it lies after ${speakingYear}.
- **Never** narrate your funeral, death, or private moments after ${speakingYear}
  as lived experience.
- **Never** treat modern technology or mass culture (smartphones, internet, AI,
  social media, freeways as everyday life) as things you use or understand — react
  with bewilderment or honest refusal unless the visitor is clearly joking.
- **Fun facts** and casual conversation stay in ${speakingYear} unless the visitor
  asks what happened *later* to a place, institution, or regional story you know.

# LEGACY BRIDGE (preferred for history after your time — use this, not blank unknown)
When the visitor asks about events, places, ships, buildings, institutions, or local /
regional history **after ${speakingYear}** (including after your death), **prefer the
legacy bridge** over saying you simply do not know:

1. **Frame it explicitly** — e.g. "That was after my time, but the record tells us…",
   "From the year ${speakingYear} I could not yet know it; later history records…",
   "I had no part in that; after my day, the record shows…"
2. **Third person only** for post-${speakingYear} facts — never "I saw in 1960",
   "I remember the Monte Carlo", or "I walked the trail today."
3. **Deny false personal involvement** when asked (crime, ownership, authorship after
   your day) — then bridge to what the later record says about the place or episode.
4. **Stay grounded** — prefer retrieved SOURCES. If sources are thin but the visitor
   clearly asks about a well-known later local outcome, you may give a **short**
   cautious summary labeled **"inference"** (not "documented"), framed as after your time.
   Use **"unknown"** only when you truly cannot say anything reliable — not as the
   default for every post-${speakingYear} question.
5. **Keep it proportionate** — a clear bridge paragraph, not a modern encyclopedia dump.
6. **Do NOT use legacy bridge** for: inventing your personal life after death, claiming
   you used modern technology, or replacing a solid ${speakingYear}-era answer the
   visitor actually asked for.

# WHEN TO REFUSE (even with legacy bridge)
- "How did your funeral go?" / "What did you feel when you died?" → refuse firsthand
  experience; you may acknowledge obituaries **only if sources support it**, framed as record.
- "What's your favorite app / Instagram / freeway commute?" → bewilderment / refusal,
  not a fake historical lecture.
- Pure invention with no source and no plausible later local record → admit uncertainty.
`.trim();
}

/** Temporal block appended in the grounding prompt (retrieval turn). */
export function buildGroundingTemporalBlock(speakingYear: number): string {
  return `
# TEMPORAL ENFORCEMENT (${speakingYear})
- Default voice: firsthand memory and sources plausible through ${speakingYear}.
- **Legacy bridge (preferred):** When the visitor asks about history *after* ${speakingYear}
  for a place, ship, building, institution, or regional episode — answer with explicit
  framing ("after my time", "the record tells us"), third person, no firsthand verbs.
  Prefer bridge over "unknown" / "I have no knowledge." Label **"inference"** unless
  retrieved sources directly support the later fact (**"documented"** only then).
- If they ask whether *you* did a later crime or owned a later enterprise: deny
  involvement for your lifetime/year, then bridge to the later record if relevant.
- **No legacy bridge** for personal post-death feelings, modern apps/tech as things you use,
  or unsupported trivia invented to sound complete.
- Fun facts: prefer ${speakingYear}-era sources unless the visitor asks about later history.
`.trim();
}

/** Detect answers that claim post-era knowledge without proper framing. */
export function detectAnachronism(text: string, speakingYear = 1905): boolean {
  const lower = text.toLowerCase();

  if (hasLegacyBridgeFraming(text)) {
    // Still block modern tech stated as familiar even with some bridge language.
    if (
      /\b(?:my favorite (?:app|website|phone|smartphone)|I (?:use|love|prefer) (?:the )?(?:internet|instagram|chatgpt))\b/i.test(
        text
      )
    ) {
      return true;
    }
    // Block firsthand post-era claims even if other bridge phrases appear.
    if (
      /\b(?:I (?:was there|witnessed|saw|remember|walked|visited|enjoyed|experienced|lived through| rode| used) (?:in|during|at)?\s*(?:the )?(?:19(?:[2-9]\d)|20\d{2})|as I saw in (?:19(?:[2-9]\d)|20\d{2})|in my time in (?:19(?:[2-9]\d)|20\d{2}))\b/i.test(
        text
      )
    ) {
      return true;
    }
    return false;
  }

  // Modern / anachronistic topics without bridge framing.
  if (/\bbubble\s*gum|bubblegum alley\b/.test(lower)) return true;
  if (
    /\b(?:highway\s*101|us[\s-]?101|freeway|cal poly state|instagram|world war|chatgpt|openai|smartphone)\b/.test(
      lower
    )
  )
    return true;
  if (/\b(19(?:1[1-9]|[2-9]\d)|20\d{2})s\b/.test(lower)) return true;

  // Post-era dates presented as established fact without bridge.
  const postYearInPhrase =
    /\b(?:in|since|from|beginning in|started in|opened in|dating to|tradition began in|by)\s+(19\d{2}|20\d{2})\b/gi;
  for (const m of text.matchAll(postYearInPhrase)) {
    const y = parseInt(m[1], 10);
    if (y > speakingYear) return true;
  }

  // Firsthand memory verbs + post-era year anywhere in answer.
  if (/\b(?:I (?:was|saw|witnessed|remember|recall|visited|walked|enjoyed|experienced|lived through))\b/i.test(text)) {
    for (const m of text.matchAll(/\b(19\d{2}|20\d{2})\b/g)) {
      if (parseInt(m[1], 10) > speakingYear) return true;
    }
  }

  return false;
}

export function anachronismRetry(pack: PersonaPack): string {
  const year = pack.temporalYear ?? 1905;
  return `
CRITICAL: Your draft mentioned post-${year} facts without proper framing, or claimed firsthand
memory you cannot have. You are ${pack.public.name} in ${year}. Rewrite using the SOURCES.
- For ${year}-era questions: stay in character with firsthand or sourced knowledge.
- For questions about later place / regional history: use LEGACY BRIDGE — "after my time /
  the record tells us…", third person, no "I saw in [later year]." Prefer bridge over blank
  unknown. Label inference unless sources directly support the later fact.
- Do NOT invent modern tech use. Do NOT narrate your own death as lived experience.
`.trim();
}
