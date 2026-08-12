/**
 * Offline check: every persona has a portrait, and identity queries resolve to it.
 * Run: npx tsx scripts/test-identity-portraits.ts
 */

import { listPersonaPacks } from "@/personas";
import { withPersona } from "@/lib/activePersona";

// Mirror rag.ts identity patterns closely enough for a regression check.
function isIdentityQuery(query: string, name: string): boolean {
  const q = query.trim();
  if (
    /\b(?:who (?:are|were) you|what(?:'s| is) your name|introduce yourself|tell me about yourself)\b/i.test(
      q
    )
  ) {
    return true;
  }
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (new RegExp(`\\bwho (?:is|was)\\s+${escaped}\\b`, "i").test(q)) return true;
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const last = parts[parts.length - 1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\bwho (?:is|was)\\s+${last}\\b`, "i").test(q)) return true;
  }
  return false;
}

const QUERIES = [
  "who are you",
  "who were you",
  "tell me about yourself",
  "introduce yourself",
  "what's your name",
];

let failed = 0;

console.log("Identity portrait audit\n");

for (const pack of listPersonaPacks()) {
  withPersona(pack, () => {
    const pid = pack.portraitImageId ?? "img-portrait";
    const portrait = pack.images.find((i) => i.id === pid);
    const name = pack.public.name;
    const slug = pack.public.slug;

    if (!portrait) {
      console.error(`FAIL ${slug}: missing image asset ${pid}`);
      failed += 1;
      return;
    }
    if (!portrait.src?.trim()) {
      console.error(`FAIL ${slug}: empty portrait src`);
      failed += 1;
      return;
    }

    const named = [`who is ${name}`, `who was ${name}`];
    const last = name.split(/\s+/).filter(Boolean).pop();
    if (last && last.length > 2) named.push(`who is ${last}`);

    for (const q of [...QUERIES, ...named]) {
      if (!isIdentityQuery(q, name)) {
        console.error(`FAIL ${slug}: "${q}" not detected as identity`);
        failed += 1;
      }
    }

    console.log(
      `ok  ${slug.padEnd(22)} portrait=${pid}  src=${portrait.src}`
    );
  });
}

console.log("");
if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log(`All ${listPersonaPacks().length} personas have identity portraits wired.`);
