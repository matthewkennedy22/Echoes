#!/usr/bin/env node
/**
 * Grounding UAT — checks that answers stay tied to sources, not general knowledge.
 *
 * Usage: node scripts/uat-grounding.mjs [--base http://localhost:3000] [--persona slug]
 */

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";
const ONLY = process.argv.includes("--persona")
  ? process.argv[process.argv.indexOf("--persona") + 1]
  : null;

const HONEST_UNKNOWN =
  /\b(?:do not|don't|cannot|can't|not in (?:my|the) sources|passages before me|must be honest|I must be honest)\b/i;

const TESTS = [
  {
    slug: "hubert-howe-bancroft",
    cases: [
      {
        label: "mayor question → unknown or honest admission, not fabricated biography",
        q: "who was the first mayor of sf",
        assert(r) {
          const problems = [];
          const a = r.answer ?? "";
          const label = r.evidenceLabel ?? r.evidence_label;
          const sources = r.sources ?? [];
          if (label !== "unknown") {
            problems.push(`expected evidenceLabel unknown, got ${label}`);
          }
          if (sources.length > 0) {
            problems.push(`expected no displayed sources, got ${sources.length}`);
          }
          if (a.length > 120 && !HONEST_UNKNOWN.test(a)) {
            problems.push(
              "substantive answer without honest admission — likely general knowledge"
            );
          }
          if (/\b(?:geary|teschemacher)\b/i.test(a) && !sources.length) {
            problems.push("named a mayor without supporting sources in evidence panel");
          }
          return problems;
        },
      },
      {
        label: "documented topic → has sources when labeled documented",
        q: "Tell me about your library sale to the University of California.",
        assert(r) {
          const problems = [];
          const label = r.evidenceLabel ?? r.evidence_label;
          if (label === "documented" && (r.sources ?? []).length === 0) {
            problems.push("documented label but no sources shown");
          }
          return problems;
        },
      },
    ],
  },
  {
    slug: "myron-angel",
    cases: [
      {
        label: "Ah Louis → no Wikipedia citations in evidence panel",
        q: "tell me about ah luis",
        assert(r) {
          const problems = [];
          for (const s of r.sources ?? []) {
            const cite = `${s.citation ?? ""} ${s.url ?? ""}`.toLowerCase();
            if (cite.includes("wikipedia")) {
              problems.push(`Wikipedia source surfaced: ${s.id}`);
            }
          }
          if ((r.evidenceLabel ?? r.evidence_label) === "documented" && (r.sources ?? []).length === 0) {
            problems.push("documented label but no sources shown");
          }
          return problems;
        },
      },
    ],
  },
];

async function ask(slug, q) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona: slug, messages: [{ role: "user", content: q }] }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

async function main() {
  console.log(`\nECHOES grounding UAT → ${BASE}\n`);
  const targets = TESTS.filter((p) => !ONLY || p.slug === ONLY);
  const rows = [];

  for (const persona of targets) {
    try {
      await fetch(`${BASE}/api/chat?persona=${persona.slug}`);
    } catch {}

    for (const spec of persona.cases) {
      const started = Date.now();
      try {
        const r = await ask(persona.slug, spec.q);
        const problems = spec.assert(r);
        rows.push({
          slug: persona.slug,
          label: spec.label,
          q: spec.q,
          ok: problems.length === 0,
          problems,
          evidenceLabel: r.evidenceLabel ?? r.evidence_label,
          sourceCount: (r.sources ?? []).length,
          ms: Date.now() - started,
          preview: (r.answer || "").slice(0, 140).replace(/\n/g, " "),
        });
      } catch (err) {
        rows.push({
          slug: persona.slug,
          label: spec.label,
          q: spec.q,
          ok: false,
          problems: [err.message],
          ms: Date.now() - started,
        });
      }
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  for (const row of rows) {
    const mark = row.ok ? "✓" : "✗";
    console.log(`  ${mark} [${row.slug}] ${row.label}`);
    console.log(`      Q: ${row.q}`);
    if (row.evidenceLabel) console.log(`      Label: ${row.evidenceLabel}, sources: ${row.sourceCount ?? "?"}`);
    if (!row.ok) {
      for (const p of row.problems) console.log(`      → ${p}`);
      if (row.preview) console.log(`      ans: ${row.preview}…`);
    }
  }

  const pass = rows.filter((r) => r.ok).length;
  const fail = rows.filter((r) => !r.ok).length;
  console.log(`\nTOTAL: ${pass} passed, ${fail} failed (${rows.length} checks)\n`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
