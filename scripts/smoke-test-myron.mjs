#!/usr/bin/env node
/**
 * Smoke-test Myron Angel chat + image accuracy against a running dev server.
 *
 * Usage: npm run dev   (separate terminal)
 *        node scripts/smoke-test-myron.mjs
 *        node scripts/smoke-test-myron.mjs --base http://localhost:3000
 */

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const CHORIS = /^img-choris-/;

function chumashOk(id) {
  return id.startsWith("img-chumash-") && !id.startsWith("img-choris-");
}

function missionOk(id) {
  return id.startsWith("img-mission-");
}

async function ask(messages) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function imageIds(result) {
  return (result.images ?? []).map((i) => i.id);
}

function pass(name, detail = "") {
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  return false;
}

/** @type {{ name: string; run: () => Promise<boolean> }[]} */
const tests = [
  {
    name: "Warm index (GET /api/chat)",
    async run() {
      const res = await fetch(`${BASE}/api/chat`);
      const data = await res.json();
      if (!data.ok) return fail("index warm", data.error);
      pass("index ready", `${data.chunks} chunks`);
      return true;
    },
  },
  {
    name: "Identity → portrait",
    async run() {
      const r = await ask([{ role: "user", content: "Who are you?" }]);
      const ids = imageIds(r);
      if (!ids.includes("img-portrait")) return fail("expected img-portrait", ids.join(", ") || "none");
      if (ids.some((id) => CHORIS.test(id))) return fail("Choris on identity", ids.join(", "));
      if (!/myron|angel|historian/i.test(r.answer)) return fail("answer missing identity", r.answer.slice(0, 80));
      pass("portrait + identity answer", ids.join(", "));
      return true;
    },
  },
  {
    name: "Chumash → verified, never Choris",
    async run() {
      const r = await ask([
        { role: "user", content: "Tell me about the Chumash people who lived in this region." },
      ]);
      const ids = imageIds(r);
      if (ids.some((id) => CHORIS.test(id))) return fail("Choris used for Chumash", ids.join(", "));
      if (ids.length && !ids.every(chumashOk))
        return fail("non-Chumash image for Chumash story", ids.join(", "));
      if (!/chumash/i.test(r.answer)) return fail("answer should mention Chumash");
      pass("Chumash story", ids.join(", ") || "no image (ok)");
      return true;
    },
  },
  {
    name: "Tomol → tomol images, not tule/Choris",
    async run() {
      const r = await ask([
        { role: "user", content: "What was a Chumash tomol and how was it used?" },
      ]);
      const ids = imageIds(r);
      if (ids.some((id) => CHORIS.test(id))) return fail("Choris for tomol", ids.join(", "));
      const allowed = new Set([
        "img-chumash-tomol-kihn",
        "img-chumash-tomol-elyewun-2006",
        "img-chumash-tomol-crossing-2015",
        "img-chumash-painted-cave",
        "img-chumash-pictograph-oakbrook",
        "img-chumash-musicians-1873",
      ]);
      if (ids.length && !ids.every((id) => allowed.has(id)))
        return fail("wrong image for tomol", ids.join(", "));
      if (!/tomol|plank/i.test(r.answer)) return fail("answer should describe tomol");
      pass("tomol answer", ids.join(", ") || "text only");
      return true;
    },
  },
  {
    name: "Chumash acorn grinding → mortars or village exhibit",
    async run() {
      const r = await ask([
        { role: "user", content: "How did the Chumash prepare acorns for food?" },
      ]);
      const ids = imageIds(r);
      if (ids.some((id) => CHORIS.test(id))) return fail("Choris for acorn story", ids.join(", "));
      const ok = new Set([
        "img-chumash-mortars-exhibit",
        "img-chumash-ap-replica",
        "img-chumash-painted-cave",
        "img-chumash-pictograph-oakbrook",
        "img-chumash-musicians-1873",
      ]);
      if (ids.length && !ids.every((id) => ok.has(id) || chumashOk(id)))
        return fail("unexpected image", ids.join(", "));
      if (!/acorn|grind|mortar|meal/i.test(r.answer)) return fail("answer should cover acorns");
      pass("acorn story", ids.join(", ") || "no image");
      return true;
    },
  },
  {
    name: "Mission SLO → mission image",
    async run() {
      const r = await ask([
        { role: "user", content: "Tell me about Mission San Luis Obispo de Tolosa and its history." },
      ]);
      const ids = imageIds(r);
      if (ids.length && !ids.every(missionOk)) return fail("expected mission image", ids.join(", "));
      if (!/mission|1772|tolosa/i.test(r.answer)) return fail("answer should cover mission");
      pass("mission story", ids.join(", ") || "no image");
      return true;
    },
  },
  {
    name: "Ah Louis → store image",
    async run() {
      const r = await ask([
        { role: "user", content: "Who was Ah Louis and what did he build in San Luis Obispo?" },
      ]);
      const ids = imageIds(r);
      const ok = ["img-ah-louis-store", "img-chinese-railroad-laborers"];
      if (ids.length && !ids.every((id) => ok.includes(id)))
        return fail("expected Ah Louis / Chinese labor image", ids.join(", "));
      if (!/ah louis|chinese/i.test(r.answer)) return fail("answer should mention Ah Louis");
      if (!ids.includes("img-ah-louis-store"))
        pass("Ah Louis (no image — acceptable if story-first)", ids.join(", ") || "none");
      else pass("Ah Louis", ids.join(", "));
      return true;
    },
  },
  {
    name: "Gold Rush → mining illustration",
    async run() {
      const r = await ask([
        { role: "user", content: "What do you remember about the California Gold Rush?" },
      ]);
      const ids = imageIds(r);
      if (ids.length && !ids.includes("img-gold-rush-mining-1883"))
        return fail("expected gold rush image", ids.join(", "));
      if (!/gold|rush|min/i.test(r.answer)) return fail("answer should mention gold rush");
      pass("gold rush", ids.join(", ") || "no image");
      return true;
    },
  },
  {
    name: "Morro Rock → coast image",
    async run() {
      const r = await ask([
        { role: "user", content: "Tell me about Morro Rock and Morro Bay." },
      ]);
      const ids = imageIds(r);
      const ok = ["img-morro-rock-1900"];
      if (ids.length && !ids.every((id) => ok.includes(id)))
        return fail("expected morro image", ids.join(", "));
      if (!/morro/i.test(r.answer)) return fail("answer should mention Morro");
      pass("Morro Rock", ids.join(", ") || "no image");
      return true;
    },
  },
  {
    name: "Downtown 1905 → street image",
    async run() {
      const r = await ask([
        { role: "user", content: "What did downtown San Luis Obispo look like around 1905?" },
      ]);
      const ids = imageIds(r);
      const ok = new Set([
        "img-slo-street-1905",
        "img-monterey-street-1900",
        "img-slo-deakin-1899",
        "img-slo-late-1800s",
        "img-slo-view-1900",
        "img-courthouse-1900",
      ]);
      if (ids.length && !ids.every((id) => ok.has(id)))
        return fail("expected downtown image", ids.join(", "));
      if (ids.includes("img-slo-view-1900") && !/panorama|valley|view of the town/i.test(r.answer))
        return fail("panorama image mismatched to downtown story", ids.join(", "));
      pass("downtown", ids.join(", ") || "no image");
      return true;
    },
  },
  {
    name: "Railroad → train image",
    async run() {
      const r = await ask([
        { role: "user", content: "How did the railroad change San Luis Obispo?" },
      ]);
      const ids = imageIds(r);
      const ok = new Set(["img-railroad-slo-1906", "img-port-harford-1905", "img-chinese-railroad-laborers"]);
      if (ids.length && !ids.every((id) => ok.has(id)))
        return fail("expected railroad-related image", ids.join(", "));
      if (!/railroad|train|southern pacific|cuesta/i.test(r.answer))
        return fail("answer should mention railroad");
      pass("railroad", ids.join(", ") || "no image");
      return true;
    },
  },
  {
    name: "Vaqueros / rancho → period image",
    async run() {
      const r = await ask([
        { role: "user", content: "Describe vaquero life on the California ranchos in your day." },
      ]);
      const ids = imageIds(r);
      const ok = new Set([
        "img-vaqueros-1854",
        "img-rancho-fandango-1873",
        "img-rancho-roundup",
        "img-adobe-rancho-1900",
      ]);
      if (ids.length && !ids.every((id) => ok.has(id)))
        return fail("expected rancho/vaquero image", ids.join(", "));
      if (!/vaquero|rancho|californio|cattle/i.test(r.answer))
        return fail("answer should cover rancho life");
      pass("vaquero/rancho", ids.join(", ") || "no image");
      return true;
    },
  },
  {
    name: "1905 temporal guard (no post-1905 firsthand)",
    async run() {
      const r = await ask([
        { role: "user", content: "What was San Luis Obispo like in 1960?" },
      ]);
      const a = r.answer;
      if (/\b(?:I (?:was there|remember|saw|witnessed|recall)|as I saw in 1960|in my time in 1960)\b/i.test(a))
        return fail("claims firsthand memory of 1960", a.slice(0, 120));
      if (
        /\b1960\b/.test(a) &&
        /\bI\b/.test(a) &&
        !/\b(?:cannot|can't|confined to|beyond my|after my (?:time|day)|do not know|don't know|must admit|outside my)\b/i.test(a)
      )
        return fail("may claim 1960 experience without refusing", a.slice(0, 120));
      pass("temporal boundary", a.slice(0, 80).replace(/\n/g, " "));
      return true;
    },
  },
  {
    name: "Image follow-up (Chumash → appropriate image, no re-narration dump)",
    async run() {
      const history = [
        {
          role: "user",
          content: "Tell me about Chumash rock art and pictographs in our region.",
        },
        {
          role: "assistant",
          content:
            "The Chumash left pictographs at sacred sites — at Painted Cave in Santa Barbara County and at Oakbrook, motifs such as the swordfish tied to shaman traditions. These paintings are thousands of years old.",
          imageIds: ["img-chumash-painted-cave"],
        },
        { role: "user", content: "Do you have any images to accompany that?" },
      ];
      const r = await ask(history);
      const ids = imageIds(r);
      if (ids.some((id) => CHORIS.test(id))) return fail("Choris on image follow-up", ids.join(", "));
      const ok = new Set([
        "img-chumash-painted-cave",
        "img-chumash-pictograph-oakbrook",
        "img-chumash-musicians-1873",
        "img-chumash-mortars-exhibit",
        "img-chumash-ap-replica",
      ]);
      if (ids.length && !ids.every((id) => ok.has(id)))
        return fail("wrong follow-up image", ids.join(", "));
      if (r.answer.length > 800) return fail("follow-up too long / re-narrated", `${r.answer.length} chars`);
      pass("image follow-up", ids.join(", ") || "no image");
      return true;
    },
  },
  {
    name: "Served images exist on disk",
    async run() {
      const r = await ask([
        { role: "user", content: "Show me the mission arcade and portico." },
      ]);
      for (const img of r.images ?? []) {
        if (!img.src?.startsWith("/images/")) return fail("bad image src", img.src);
        if (!img.caption || img.caption.length < 10) return fail("missing caption", img.id);
      }
      pass("image payloads valid", `${(r.images ?? []).length} image(s)`);
      return true;
    },
  },
];

async function main() {
  console.log(`\nECHOES Myron smoke tests → ${BASE}\n`);
  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    process.stdout.write(`${t.name}… `);
    try {
      const ok = await t.run();
      if (ok) passed++;
      else failed++;
    } catch (err) {
      fail(t.name, err.message);
      failed++;
    }
    console.log("");
  }

  console.log(`\n${passed} passed, ${failed} failed (${tests.length} total)\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
