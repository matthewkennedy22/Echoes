#!/usr/bin/env node
/**
 * Gap-finding smoke for Dana Adobe figures.
 *
 * Usage:
 *   npm run dev
 *   node scripts/smoke-test-dana-adobe.mjs
 *   node scripts/smoke-test-dana-adobe.mjs --base http://localhost:3000
 */

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const VALID_LABELS = new Set(["documented", "inference", "contested", "unknown"]);

function ids(r) {
  return (r.images || []).map((i) => i.id);
}

function srcIds(r) {
  return (r.sources || []).map((s) => s.id || s.citation || "").filter(Boolean);
}

const CAPT = [
  {
    id: "identity",
    q: "Who are you?",
    wantPortrait: true,
    expect: /dana|nipomo|boston|captain/i,
    forbid: /i am richard henry dana|i wrote two years before the mast/i,
  },
  {
    id: "look-like",
    q: "What do you look like? Show me a portrait if you have one.",
    wantPortrait: true,
    expect: /portrait|photograph|whisker|mutton|coat|bow/i,
  },
  {
    id: "rh-dana",
    q: "Are you the man who wrote Two Years Before the Mast?",
    expect: /not|kinsman|cousin|different|another dana|richard henry/i,
    forbid: /yes,? i (?:am|wrote)|i wrote two years/i,
  },
  {
    id: "grant",
    q: "How did you come to hold Rancho Nipomo?",
    banPortrait: true,
    expect: /1837|alvarado|grant|naturaliz/i,
  },
  {
    id: "acres",
    q: "How many acres was Rancho Nipomo?",
    expect: /38,?000|37,?887|48,?000|acre/i,
    forbid: /exactly 48,000(?!.*(contest|disagree|home page|partner|angel|landmark))/i,
  },
  {
    id: "adobe",
    q: "Describe the adobe house — how was it laid out?",
    banPortrait: true,
    expect: /adobe|room|wall|patio|kitchen|wing|u-?shape|thirteen|storehouse|dormitor/i,
  },
  {
    id: "chumash",
    q: "Who lived on this land before the grant?",
    expect: /chumash|nipomo|purísima|purisima|1804|village/i,
    forbid: /we hired the chumash tribe of \w+ to build/i,
  },
  {
    id: "indian-labor",
    q: "Did Chumash people build your adobe?",
    expect: /indian labor|labor|adobe|source|record|article|not|don't know|incomplete|brick/i,
    forbid: /yes, the chumash of nipomo built every wall for me/i,
  },
  {
    id: "mail",
    q: "Tell me about the U.S. mail route that used your ranch.",
    expect: /1847|mail|kearny|soldier|sunday|san diego|san francisco/i,
  },
  {
    id: "bryant",
    q: "What did Edwin Bryant write when he camped near your rancho?",
    expect: /bryant|hospitality|bread|1846|fremont|frémont/i,
  },
  {
    id: "hutton",
    q: "William Rich Hutton surveyed here — what did he say about you and the farm?",
    expect: /hutton|survey|cow|butter|good-natured|milk|1850/i,
  },
  {
    id: "marriage",
    q: "How old was María Josefa when you married?",
    expect: /sixteen|16|1828|thirty-one|31/i,
  },
  {
    id: "children",
    q: "How many children do you have?",
    expect: /twenty-one|21|thirteen|13|still growing|later record|family list/i,
  },
  {
    id: "death-1858",
    q: "Tell me about dying in February 1858.",
    expect: /after|beyond|not yet|1850|record|legacy|ahead|cannot narrate|still (?:here|alive)|speaking from/i,
    forbid: /i died on (?:the )?12(?:th)? february 1858 and was buried/i,
  },
  {
    id: "blond-ranchero",
    q: "Have you read The Blond Ranchero?",
    expect: /not|don't|do not|cannot|book|later|unknown|after my|never/i,
  },
  {
    id: "house-pic",
    q: "Show me a picture of the adobe house.",
    banPortrait: true,
    expect: /adobe|house|nipomo|1900|2012|later/i,
    expectImage: /adobe/,
  },
  {
    id: "tallow",
    q: "What's a tallow vat doing on the rancho?",
    expect: /tallow|hide|soap|cattle|vat/i,
  },
  {
    id: "office",
    q: "Did you hold any public offices in Santa Barbara or San Luis Obispo?",
    expect: /alcalde|prefecto|port|appraiser|senate|treasurer|santa barbara/i,
  },
];

const MARIA = [
  {
    id: "identity",
    q: "Who are you?",
    wantPortrait: true,
    expect: /josefa|carrillo|dana|nipomo/i,
  },
  {
    id: "look-like",
    q: "What do you look like? Show me a portrait if you have one.",
    wantPortrait: true,
    expect: /portrait|photograph|mantilla|lace|earring|later/i,
  },
  {
    id: "father",
    q: "Tell me about your father.",
    expect: /carlos|carrillo|governor|legislator|santa barbara/i,
  },
  {
    id: "marriage",
    q: "How old were you when you married Captain Dana?",
    expect: /sixteen|16|1828/i,
  },
  {
    id: "adobe",
    q: "What was it like to keep the adobe for travelers?",
    banPortrait: true,
    expect: /adobe|hospitality|traveler|camino|house|welcome|guest/i,
  },
  {
    id: "layout",
    q: "How was the house laid out — kitchen, rooms, where did the children sleep?",
    expect: /kitchen|storehouse|patio|dormitor|wing|wall|fig|upstairs|upper/i,
  },
  {
    id: "children",
    q: "How many children do you have?",
    expect: /twenty-one|21|thirteen|13|family/i,
  },
  {
    id: "tefft",
    q: "Tell me about your daughter who married Henry Tefft.",
    expect: /tefft|daughter|wedding|porch|constitution|assembly/i,
  },
  {
    id: "illness",
    q: "How was the Captain's health in his last years?",
    expect: /rheumatism|ailing|ill|health|pain|1858|died|death/i,
  },
  {
    id: "spanish-only",
    q: "Did you speak only Spanish, never English?",
    expect: /spanish|english|household|not|do not|cannot prove|sources/i,
    forbid: /i spoke only spanish and never a word of english/i,
  },
  {
    id: "ojai",
    q: "Did you petition for land in Ojai?",
    expect: /not|don't|do not|record|unknown|sources|no (?:such|petition)|cannot/i,
  },
  {
    id: "diary",
    q: "Read me a page from your diary or a letter in your own hand.",
    expect: /no memoir|not|thin|record|letter|sources|cannot|don't have|no diary/i,
  },
  {
    id: "widow-rail",
    q: "Tell me about giving the Pacific Coast Railway a right of way across the rancho.",
    expect: /1881|railway|right.of.way|widow|depot|nipomo|free rid/i,
  },
  {
    id: "death-1883",
    q: "Describe your funeral in 1883.",
    expect: /after|beyond|1882|1883|not yet|record|cannot|alive|speaking from|legacy/i,
    forbid: /i was buried at old mission cemetery in 1883 after a long illness/i,
  },
  {
    id: "chumash-labor",
    q: "Did Chumash people build this adobe?",
    expect: /indian labor|labor|article|record|not|incomplete|brick|source/i,
  },
  {
    id: "house-pic",
    q: "Show me a picture of the adobe house.",
    banPortrait: true,
    expect: /adobe|house|later|1900|2012/i,
    expectImage: /adobe/,
  },
  {
    id: "mail",
    q: "What was the mail route that met at this ranch?",
    expect: /1847|mail|kearny|soldier|sunday/i,
  },
];

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const text = await res.text().catch(() => "");
  return { status: res.status, location: res.headers.get("location") || "", text };
}

async function ask(slug, q) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      persona: slug,
      messages: [{ role: "user", content: q }],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

async function warm(slug) {
  const res = await fetch(`${BASE}/api/chat?persona=${encodeURIComponent(slug)}`);
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(data.error || `warm failed HTTP ${res.status}`);
  return data;
}

function classify(spec, r) {
  const a = r.answer || "";
  const imageIds = ids(r);
  const problems = [];
  let kind = "pass";

  if (!a.trim()) problems.push("empty answer");
  if (!VALID_LABELS.has(r.evidenceLabel)) {
    problems.push(`bad evidenceLabel: ${r.evidenceLabel}`);
  }
  if (spec.wantPortrait && !imageIds.includes("img-portrait")) {
    problems.push(`wanted portrait, got [${imageIds.join(", ") || "none"}]`);
  }
  if (spec.banPortrait && imageIds.includes("img-portrait")) {
    problems.push("portrait on a house/history question");
  }
  if (spec.expectImage && imageIds.length && !imageIds.some((id) => spec.expectImage.test(id))) {
    problems.push(`wanted image /${spec.expectImage.source}/, got [${imageIds.join(",")}]`);
  }
  if (spec.forbid && spec.forbid.test(a)) {
    problems.push("hallucination / forbidden claim");
    kind = "fail";
  }
  if (spec.expect && !spec.expect.test(a)) {
    problems.push(`missed /${spec.expect.source}/`);
    if (kind !== "fail") kind = "gap";
  }
  if (r.evidenceLabel === "unknown" && spec.expect && !spec.expect.test(a)) {
    if (kind !== "fail") kind = "gap";
  }
  if (problems.length && kind === "pass") kind = "fail";
  return { kind, problems, a, imageIds };
}

async function runPersona(slug, cases) {
  console.log(`\n════ ${slug} ════`);
  const w = await warm(slug);
  console.log(`  index ${w.chunks ?? "?"} chunks`);

  const rows = [];
  for (const spec of cases) {
    process.stdout.write(`  ${spec.id}… `);
    try {
      const r = await ask(slug, spec.q);
      const { kind, problems, a, imageIds } = classify(spec, r);
      const tag = kind === "pass" ? "ok" : kind.toUpperCase();
      const src = (r.sources || [])
        .slice(0, 3)
        .map((s) => s.id || s.title || s.citation || "?")
        .join(" · ");
      console.log(
        `${tag} — ${r.evidenceLabel}${imageIds.length ? ` · ${imageIds.join(",")}` : ""}${src ? ` · ${src}` : ""}`
      );
      if (kind !== "pass") {
        console.log(`      q: ${spec.q}`);
        console.log(`      ${problems.join("; ")}`);
        console.log(`      «${a.replace(/\s+/g, " ").slice(0, 280)}»`);
      }
      rows.push({
        slug,
        id: spec.id,
        q: spec.q,
        kind,
        problems,
        evidenceLabel: r.evidenceLabel,
        images: imageIds,
        sources: srcIds(r).slice(0, 6),
        answer: a.replace(/\s+/g, " ").slice(0, 500),
      });
    } catch (err) {
      console.log(`FAIL — ${err.message}`);
      rows.push({
        slug,
        id: spec.id,
        q: spec.q,
        kind: "fail",
        problems: [err.message],
        evidenceLabel: "",
        images: [],
        sources: [],
        answer: "",
      });
    }
  }
  return rows;
}

async function routes() {
  console.log("Routes");
  const rows = [];
  const home = await fetchText("/");
  const listed =
    /william-g-dana/.test(home.text) || /maria-josefa-carrillo/.test(home.text);
  if (home.status === 200 && !listed) {
    console.log("    ok — Dana figures not on California Speaks");
    rows.push({ kind: "pass" });
  } else {
    console.log("    FAIL — Dana figures on public home or home down");
    rows.push({ kind: "fail" });
  }

  const landing = await fetchText("/p/dana-adobe");
  if (landing.status === 200 && /Dana Adobe/.test(landing.text)) {
    console.log("    ok — /p/dana-adobe");
    rows.push({ kind: "pass" });
  } else {
    console.log(`    FAIL — /p/dana-adobe HTTP ${landing.status}`);
    rows.push({ kind: "fail" });
  }
  return rows;
}

async function main() {
  console.log(`\nECHOES Dana Adobe gap smoke → ${BASE}\n`);
  const all = [...(await routes())];
  all.push(...(await runPersona("william-g-dana", CAPT)));
  all.push(...(await runPersona("maria-josefa-carrillo", MARIA)));

  const pass = all.filter((r) => r.kind === "pass").length;
  const gap = all.filter((r) => r.kind === "gap");
  const fail = all.filter((r) => r.kind === "fail");

  console.log("\n════════ GAPS (missed expected content, not a hard fail) ════════");
  if (!gap.length) console.log("  none");
  for (const g of gap) {
    console.log(`  [${g.slug}] ${g.id}: ${g.problems.join("; ")}`);
    console.log(`      ${g.answer.slice(0, 220)}`);
  }

  console.log("\n════════ FAILS ════════");
  if (!fail.length) console.log("  none");
  for (const f of fail) {
    console.log(`  [${f.slug}] ${f.id}: ${f.problems.join("; ")}`);
  }

  console.log(`\n${pass} passed, ${gap.length} gaps, ${fail.length} failed\n`);

  const { writeFile } = await import("node:fs/promises");
  const out = new URL("../uat-dana-adobe-results.json", import.meta.url);
  await writeFile(
    out,
    JSON.stringify({ when: new Date().toISOString(), rows: all }, null, 2)
  );
  console.log(`Wrote ${out.pathname}`);
  process.exit(fail.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
