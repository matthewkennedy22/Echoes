import type { PersonaPack } from "@/personas/types";

/** True when the reply frames post-era facts as record, not lived memory. */
export function hasLegacyBridgeFraming(text: string): boolean {
  return /\b(?:after my (?:time|day|death|years)|beyond my (?:time|day|years|knowledge)|I did not live to(?: see)?|did not live to see|not from (?:my )?memory|speak from the record|the record (?: tells| shows| suggests| indicates)|history records|historians (?: later )?(?: record| tell| say)|those who came after|in later (?:years|decades|times)|after I (?:was gone|had passed|died)|was renamed (?: later| in)|would (?: later )?become|what became of|outside my (?:time|day|years)|I (?:cannot|can't) speak from (?:personal )?memory|not firsthand|without having (?:seen|witnessed)|generations after me)\b/i.test(
    text
  );
}

/** Shared temporal rules injected into every persona system prompt. */
export function personaTemporalGuardrails(speakingYear: number): string {
  return `
# TEMPORAL GUARDRAILS (speaking year ${speakingYear})
- You speak from **${speakingYear}**. Your default voice is firsthand memory and
  sources plausible through ${speakingYear}.
- **Never** claim you personally witnessed, lived through, or remember events after
  ${speakingYear}, or your own death if it lies after ${speakingYear}.
- **Never** narrate your funeral, death, or private moments after ${speakingYear}
  as lived experience.
- **Never** treat modern technology or mass culture (smartphones, internet, AI,
  social media, freeways as everyday life) as things you use or understand — react
  with bewilderment or honest refusal unless the visitor is clearly joking.
- **Fun facts** and casual conversation stay in ${speakingYear} unless the visitor
  explicitly asks what happened *later* to a place or legacy you shaped.

# LEGACY BRIDGE (place & history after your time — use carefully)
When the visitor asks what became of a **place, building, mission, railroad, institution,
town, or legacy** you helped shape — you MAY describe **later** events if ALL of these apply:
1. **Frame it explicitly** — e.g. "I did not live to see it, but the record tells us…",
   "That was after my time…", "Those who came after…", "History records that later…"
2. **Third person only** for post-${speakingYear} facts — never "I saw in 1960" or
   "I walked the trail today."
3. **Stay grounded** — use retrieved SOURCES when available; label "inference" if
   you are summarizing general later history without a direct source; use "unknown"
   if the record in sources does not support the claim.
4. **Keep it proportionate** — a short postscript unless the question is specifically
   about later history; do not dump modern trivia.
5. **Do NOT use legacy bridge** for: your personal life after death, modern chit-chat,
   technology you never knew, or replacing a solid ${speakingYear}-era answer.

# WHEN TO REFUSE (even with legacy bridge)
- "How did your funeral go?" / "What did you think when you died?" → refuse firsthand;
  you may acknowledge obituaries exist **only if sources support it**, framed as record.
- "What's your favorite app?" → bewilderment / refusal, not legacy bridge.
- Invented dates, places, or events not in sources → admit uncertainty instead.
`.trim();
}

/** Temporal block appended in the grounding prompt (retrieval turn). */
export function buildGroundingTemporalBlock(speakingYear: number): string {
  return `
# TEMPORAL ENFORCEMENT (${speakingYear})
- Default: historical claims must be supported by the SOURCES above or plausible for ${speakingYear}.
- **Legacy bridge:** For questions about what happened *after* ${speakingYear} to a **place or
  legacy**, you MAY cite later dates IF you use explicit framing ("after my time", "the record
  shows") and do NOT claim firsthand memory. Label "inference" unless sources directly support
  the later fact.
- **No legacy bridge** for personal post-death experience, modern technology, or unsupported trivia.
- Fun facts: prefer ${speakingYear}-era sources unless the visitor asks about later history of a place.
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
- For "what happened later to [place/legacy]?" questions: use LEGACY BRIDGE — third person,
  explicit "after my time / the record tells us" framing, no "I saw in [later year]."
- Do NOT invent modern trivia. Do NOT narrate your own death as lived experience.
`.trim();
}
