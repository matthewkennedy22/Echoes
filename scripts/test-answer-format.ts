/**
 * Offline checks for answer sanitizer (bold/italic unwrap, image-slot gaps).
 * Run: npx tsx scripts/test-answer-format.ts
 */

import { sanitizeAnswerText } from "@/lib/answerFormat";

let failed = 0;

function check(name: string, input: string, assert: (out: string) => string | null) {
  const out = sanitizeAnswerText(input);
  const err = assert(out);
  if (err) {
    console.error(`FAIL ${name}: ${err}`);
    console.error(`  in:  ${JSON.stringify(input.slice(0, 160))}`);
    console.error(`  out: ${JSON.stringify(out.slice(0, 160))}`);
    failed += 1;
  } else {
    console.log(`ok  ${name}`);
  }
}

check("keeps short bold names", "I am **John Muir**, of the Sierra.", (out) =>
  out.includes("**John Muir**") ? null : "lost short bold"
);

check("keeps short italics", "I wrote *The Yosemite* in 1912.", (out) =>
  out.includes("*The Yosemite*") ? null : "lost short italic"
);

check(
  "unwraps long bold (Bancroft-style)",
  "I am Hubert Howe Bancroft, **a historian, publisher, and collector, known for my extensive works on the Pacific States, particularly California.**",
  (out) => {
    if (out.includes("**")) return "long bold markers remain";
    if (!/historian, publisher/.test(out)) return "unwrapped text missing";
    return null;
  }
);

check(
  "unwraps long italic (Mason-style book clause)",
  "I am Jesse Dimon Mason, author of the 1883 volume titled *History of Santa Barbara County, California, compiled from original sources and pioneer testimony.*",
  (out) => {
    if (/\*[^*]{49,}\*/.test(out)) return "long italic markers remain";
    if (!/History of Santa Barbara County/.test(out)) return "title missing";
    return null;
  }
);

check("unwraps whole-paragraph italics", "*This entire paragraph is italicized on purpose and should become plain prose.*", (out) =>
  out.startsWith("*") ? "paragraph still italic-wrapped" : null
);

check("strips markdown image slots", "Here is the mission.\n\n![img-mission]\n\nIt still stands.", (out) => {
  if (/!\[/.test(out)) return "markdown image leftover";
  if (/\n{3,}/.test(out)) return "image-sized gap leftover";
  return null;
});

check("collapses triple newlines", "Hello.\n\n\n\nWorld.", (out) =>
  /\n{3,}/.test(out) ? "triple newlines remain" : null
);

console.log("");
if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log("Answer format sanitizer checks passed.");
