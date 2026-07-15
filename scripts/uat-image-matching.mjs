#!/usr/bin/env node
/**
 * Image-matching UAT for all ECHOES personas.
 *
 * Usage: node scripts/uat-image-matching.mjs [--base http://localhost:3000] [--persona slug]
 */

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";
const ONLY = process.argv.includes("--persona")
  ? process.argv[process.argv.indexOf("--persona") + 1]
  : null;

const MISSION_IMAGE =
  /\b(?:mission(?:\s+(?:san|dolores|santa|de|del|los|la))?|(?:los\s+)?dolores|padres?|friars?|franciscan|1776|1772|1782|1786|adobe mission|mission church)\b/i;
const GOLDEN_GATE_IMAGE =
  /\b(?:golden gate|angel island|telegraph hill|mount tamalpais|tamalpais|the strait|ferry|marina|waterfront|bay shore)\b/i;
const RAILROAD_IMAGE =
  /\b(?:railroad|railway|train|depot|locomotive|southern pacific|right of way|hemme station|tracks|branch line)\b/i;
const TAHOE_IMAGE =
  /\b(?:tahoe|lake tahoe|timber claim|nevada|carson city|roughing it|sierra nevada|emerald bay|shore)\b/i;
const HARBOR_IMAGE =
  /\b(?:harbor|harbour|wharf|bay|pier|waterfront|dock|port)\b/i;
const DOWNTOWN_IMAGE =
  /\b(?:street|downtown|higuera|monterey|plaza|horton house|addition)\b/i;

function imageAnswerAligned(answer, imageId) {
  const a = (answer || "").toLowerCase();
  if (!imageId || imageId === "img-portrait" || imageId === "img-portrait-engraving")
    return true;
  if (/mission/i.test(imageId)) return MISSION_IMAGE.test(a);
  if (/golden-gate|angel-island|telegraph-hill|tamalpais/i.test(imageId))
    return GOLDEN_GATE_IMAGE.test(a);
  if (/railroad|train|depot|station|locomotive/i.test(imageId))
    return RAILROAD_IMAGE.test(a);
  if (/tahoe|timber|nevada|carson|emerald|tallac|steamer|washoe/i.test(imageId))
    return TAHOE_IMAGE.test(a);
  if (/morro|avila|beach|port-harford|wharf/i.test(imageId)) return HARBOR_IMAGE.test(a);
  if (/street|downtown|plaza|horton-house|courthouse|gaslamp|slo-/i.test(imageId))
    return DOWNTOWN_IMAGE.test(a);
  if (/chumash|vaquero|rancho|fandango|tomol|choris|painted-cave/i.test(imageId))
    return /\b(?:chumash|vaquero|rancho|fandango|tomol|native|pictograph|cave)\b/i.test(a);
  if (/-1890|map/i.test(imageId)) return /\b(?:map|mapped|cartograph|survey|city)\b/i.test(a);
  return true;
}

const TESTS = [
  {
    slug: "myron-angel",
    portrait: "img-portrait",
    cases: [
      { q: "Who are you?", wantPortrait: true, label: "identity → portrait" },
      { q: "What do you look like?", wantPortrait: true, label: "appearance → portrait" },
      {
        q: "What did downtown San Luis Obispo look like in 1905?",
        banPortrait: true,
        label: "place look-like → no portrait",
      },
      {
        q: "Show me a picture of the mission.",
        wantImagePrefix: "img-mission-",
        banPortrait: true,
        label: "mission request → mission image",
      },
      {
        q: "Tell me about Morro Rock.",
        expectImage: /morro|avila|coast|rock/,
        banPortrait: true,
        label: "Morro Rock → coast image or none",
      },
      {
        q: "Tell me a fun fact about the county.",
        banUnrelatedImages: true,
        label: "fun fact → no stray images",
      },
    ],
  },
  {
    slug: "hubert-howe-bancroft",
    portrait: "img-portrait",
    cases: [
      { q: "Who are you?", wantPortrait: true, label: "identity → portrait" },
      { q: "Show me your portrait.", wantPortrait: true, label: "portrait request" },
      {
        q: "What did the marina look like?",
        banPortrait: true,
        expectImage: /golden-gate|angel-island|telegraph|sf-1890|tamalpais/,
        label: "marina look-like → waterfront, not portrait",
      },
      {
        q: "Tell me about Mission Dolores.",
        wantImagePrefix: "img-mission-",
        banPortrait: true,
        label: "Mission Dolores → mission image",
      },
      {
        q: "Describe the Golden Gate before any bridge.",
        banPortrait: true,
        expectImage: /golden-gate|angel-island|telegraph|tamalpais/,
        label: "Golden Gate → strait image or none",
      },
      {
        q: "Tell me a fun fact from your collecting years.",
        banUnrelatedImages: true,
        label: "fun fact → no stray images",
      },
    ],
  },
  {
    slug: "alonzo-horton",
    portrait: "img-portrait",
    cases: [
      { q: "Who are you?", wantPortrait: true, label: "identity → portrait" },
      { q: "Show me what you looked like.", wantPortrait: true, label: "appearance → portrait" },
      {
        q: "What did the harbor look like when you arrived?",
        banPortrait: true,
        label: "harbor look-like → no portrait",
      },
      {
        q: "Tell me about the Horton House hotel.",
        expectImage: /horton-house|plaza|courthouse|gaslamp/,
        banPortrait: true,
        label: "Horton House → building image or none",
      },
      {
        q: "What is Horton Plaza?",
        expectImage: /plaza|fountain|horton/,
        banPortrait: true,
        label: "Horton Plaza → plaza image or none",
      },
      {
        q: "Tell me a fun fact about early San Diego.",
        banUnrelatedImages: true,
        label: "fun fact → no stray images",
      },
    ],
  },
  {
    slug: "jesse-d-mason",
    portrait: "img-portrait",
    cases: [
      { q: "Who are you?", wantPortrait: true, label: "identity → portrait" },
      {
        q: "Show me the mission.",
        wantImagePrefix: "img-mission-",
        banPortrait: true,
        label: "mission request → mission image",
      },
      {
        q: "What did the harbor look like in Santa Barbara?",
        banPortrait: true,
        banImages: /^img-mission-/,
        label: "harbor look-like → no mission portrait",
      },
      {
        q: "Describe the rancho era in Santa Barbara County.",
        expectImage: /vaquero|rancho|fandango/,
        banPortrait: true,
        label: "rancho → rancho image or none",
      },
      {
        q: "Who were the Chumash of this coast?",
        expectImage: /chumash|tomol|painted-cave|musicians/,
        banPortrait: true,
        label: "Chumash → native image or none",
      },
      {
        q: "Tell me a fun fact from your county history.",
        banUnrelatedImages: true,
        label: "fun fact → no stray images",
      },
    ],
  },
  {
    slug: "mark-twain",
    portrait: "img-portrait",
    cases: [
      { q: "Who are you?", wantPortrait: true, label: "identity → portrait" },
      { q: "Show me your portrait.", wantPortrait: true, label: "portrait request" },
      {
        q: "Describe seeing Lake Tahoe for the first time.",
        expectImage: /tahoe|emerald|steamer|washoe/,
        banPortrait: true,
        label: "Tahoe → lake image or none",
      },
      {
        q: "What did the lake shore look like?",
        banPortrait: true,
        expectImage: /tahoe|shore|emerald|warm-springs/,
        label: "lake look-like → Tahoe image, not portrait",
      },
      {
        q: "Tell me about your timber claim.",
        expectImage: /tahoe|timber|nevada/,
        banPortrait: true,
        label: "timber claim → Tahoe image or none",
      },
      {
        q: "Tell me a fun fact about your Tahoe days.",
        banUnrelatedImages: true,
        label: "fun fact → no stray images",
      },
    ],
  },
  {
    slug: "august-hemme",
    portrait: "img-portrait",
    cases: [
      { q: "Who are you?", wantPortrait: true, label: "identity → illustrative portrait" },
      {
        q: "Show me the Danville depot.",
        wantImagePrefix: "img-danville-",
        banPortrait: true,
        label: "depot request → depot image",
      },
      {
        q: "What did the valley look like before the railroad?",
        banPortrait: true,
        label: "valley look-like → no portrait",
      },
      {
        q: "Tell me about the first train trip in 1891.",
        expectImage: /depot|danville|railroad|train|museum/,
        banPortrait: true,
        label: "first train → railroad image or none",
      },
      {
        q: "Tell me about raising the $15,000 for the right of way.",
        expectImage: /depot|railroad|train|museum/,
        banPortrait: true,
        label: "right of way → railroad image or none",
      },
      {
        q: "Tell me a fun fact about the valley.",
        banUnrelatedImages: true,
        label: "fun fact → no stray images",
      },
    ],
  },
  {
    slug: "anita-loos",
    portrait: "img-portrait",
    cases: [
      { q: "Who are you?", wantPortrait: true, label: "identity → portrait" },
      { q: "Show me your portrait.", wantPortrait: true, label: "portrait request" },
      {
        q: "What did Hollywood look like in your day?",
        banPortrait: true,
        expectImage: /hollywood|blvd|streetcar|triangle|studio|sign/,
        label: "Hollywood look-like → place image, not portrait",
      },
      {
        q: "Tell me about Douglas Fairbanks.",
        expectImage: /fairbanks/,
        banPortrait: true,
        label: "Fairbanks → Fairbanks image or none",
      },
      {
        q: "Tell me about Intolerance and Griffith.",
        expectImage: /intolerance|griffith|babylon|triangle/,
        banPortrait: true,
        label: "Griffith/Intolerance → film image or none",
      },
      {
        q: "Tell me a fun fact from silent Hollywood.",
        banUnrelatedImages: true,
        label: "fun fact → no stray images",
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

function checkCase(persona, spec, r) {
  const problems = [];
  const ids = (r.images ?? []).map((i) => i.id);
  const a = r.answer ?? "";

  if ((r.images ?? []).length > 1) problems.push(`more than one image: [${ids.join(", ")}]`);

  if (spec.wantPortrait && !ids.includes(persona.portrait))
    problems.push(`expected portrait, got [${ids.join(", ") || "none"}]`);

  if (spec.wantPortrait === false && ids.includes(persona.portrait))
    problems.push(`unexpected portrait on identity`);

  if (spec.banPortrait && ids.includes(persona.portrait))
    problems.push(`portrait must not appear, got ${persona.portrait}`);

  if (spec.wantImagePrefix && ids.length && !ids.some((id) => id.startsWith(spec.wantImagePrefix)))
    problems.push(`expected prefix ${spec.wantImagePrefix}, got [${ids.join(", ")}]`);

  if (spec.expectImage && ids.length && !ids.some((id) => spec.expectImage.test(id)))
    problems.push(`expected matching image pattern ${spec.expectImage}, got [${ids.join(", ")}]`);

  if (spec.banUnrelatedImages && ids.some((id) => id !== persona.portrait))
    problems.push(`unrelated image on fun fact: [${ids.join(", ")}]`);

  if (spec.banImages && ids.some((id) => spec.banImages.test(id)))
    problems.push(`banned image used: [${ids.join(", ")}]`);

  for (const imgId of ids) {
    if (!imageAnswerAligned(a, imgId))
      problems.push(`image ${imgId} not aligned with answer subject`);
  }

  return problems;
}

async function runPersona(persona) {
  try {
    await fetch(`${BASE}/api/chat?persona=${persona.slug}`);
  } catch {}

  const rows = [];
  for (const spec of persona.cases) {
    const started = Date.now();
    try {
      const r = await ask(persona.slug, spec.q);
      const problems = checkCase(persona, spec, r);
      rows.push({
        slug: persona.slug,
        label: spec.label,
        q: spec.q,
        ok: problems.length === 0,
        problems,
        images: (r.images ?? []).map((i) => i.id),
        ms: Date.now() - started,
        preview: (r.answer || "").slice(0, 120).replace(/\n/g, " "),
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
    await new Promise((r) => setTimeout(r, 200));
  }
  return rows;
}

async function main() {
  console.log(`\nECHOES image-matching UAT → ${BASE}\n`);
  const targets = TESTS.filter((p) => !ONLY || p.slug === ONLY);
  const allRows = [];

  for (const persona of targets) {
    const rows = await runPersona(persona);
    allRows.push(...rows);
    const pass = rows.filter((r) => r.ok).length;
    const fail = rows.filter((r) => !r.ok).length;
    console.log(`════ ${persona.slug} — ${pass}/${rows.length} image checks passed ════`);
    for (const row of rows) {
      const mark = row.ok ? "✓" : "✗";
      const imgs = row.images?.length ? `[${row.images.join(", ")}]` : "[none]";
      console.log(`  ${mark} ${row.label}`);
      console.log(`      Q: ${row.q}`);
      console.log(`      Images: ${imgs}`);
      if (!row.ok) {
        for (const p of row.problems) console.log(`      → ${p}`);
        if (row.preview) console.log(`      ans: ${row.preview}…`);
      }
    }
    console.log("");
  }

  const pass = allRows.filter((r) => r.ok).length;
  const fail = allRows.filter((r) => !r.ok).length;
  const { writeFileSync } = await import("fs");
  writeFileSync(
    "uat-image-results.json",
    JSON.stringify({ base: BASE, at: new Date().toISOString(), rows: allRows }, null, 2)
  );

  console.log(`──────────────────────────────────────────`);
  console.log(`TOTAL: ${pass} passed, ${fail} failed (${allRows.length} image checks)`);
  console.log(`Details written to uat-image-results.json\n`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
