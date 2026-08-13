/**
 * Offline checks for Show evidence excerpts and curated-source preference.
 * Run: npx tsx scripts/test-evidence-display.ts
 */

import type { SourceChunk } from "@/lib/types";
import {
  buildEvidenceItems,
  deriveUsedForFromAnswer,
  excerptFromSource,
  factualAnswerText,
  isBookChunkId,
  isFollowUpOffer,
  parseUsedSourceEntries,
  preferCuratedSources,
  sanitizeUsedFor,
} from "@/lib/evidenceDisplay";

let failed = 0;

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`ok  ${name}`);
  } else {
    console.error(`FAIL ${name}${detail ? `: ${detail}` : ""}`);
    failed += 1;
  }
}

function chunk(
  id: string,
  text: string,
  extra?: Partial<SourceChunk>
): SourceChunk {
  return {
    id,
    text,
    topics: extra?.topics ?? ["test"],
    sourceType: extra?.sourceType ?? "secondary",
    citation: extra?.citation ?? `${id} citation`,
    url: extra?.url,
    reliability: "high",
  };
}

check(
  "book-chunk id detection",
  isBookChunkId("smythe-san-diego-0430") &&
    isBookChunkId("book-0088") &&
    !isBookChunkId("ferry-system") &&
    !isBookChunkId("water-company")
);

const boomPage = chunk(
  "smythe-san-diego-0430",
  "We are going to have electric street railways, motor roads to National City and Pacific Beach, a ferry across the bay, a big hotel on the peninsula, and many other things. And then, pointing with pride to the sidewalk, he exclaimed: And we have this sidewalk!"
);
const waterCurated = chunk(
  "water-company",
  "Spreckels organized the Southern California Mountain Water Company, which built Morena and Otay reservoir works and pipelines; water began flowing abundantly into San Diego on August 6, 1906.",
  { topics: ["water", "mountain water"], citation: "Black 1913, Spreckels sketch." }
);
const ferryCurated = chunk(
  "ferry-system",
  "Spreckels owned and operated the San Diego and Coronado Ferry Company, linking downtown San Diego with Coronado across the bay.",
  { topics: ["ferry"], citation: "Black 1913, corporate interests." }
);

const answer =
  "I was involved with the Southern California Mountain Water Company, which supplied water to San Diego. I also invested in the San Diego and Coronado Ferry Company.";

const excerpt = excerptFromSource(waterCurated.text, answer);
check(
  "excerpt prefers the water sentence",
  /Mountain Water Company/.test(excerpt) && excerpt.length < 400,
  excerpt.slice(0, 120)
);

const boomExcerpt = excerptFromSource(boomPage.text, answer);
check(
  "excerpt from boom page is short, not the whole page",
  boomExcerpt.length < boomPage.text.length && boomExcerpt.length <= 320
);

const preferred = preferCuratedSources(
  answer,
  [boomPage],
  [boomPage, waterCurated, ferryCurated],
  new Set(["water-company", "ferry-system"])
);
check(
  "replaces boom OCR with curated water claim",
  preferred.some((s) => s.id === "water-company"),
  preferred.map((s) => s.id).join(",")
);
check(
  "adds curated ferry when answer mentions the ferry company",
  preferred.some((s) => s.id === "ferry-system"),
  preferred.map((s) => s.id).join(",")
);

const items = buildEvidenceItems({
  answer,
  cited: [boomPage],
  retrieved: [boomPage, waterCurated, ferryCurated],
  curatedIds: new Set(["water-company", "ferry-system"]),
  usedForById: new Map([
    ["smythe-san-diego-0430", "A ferry across the bay in a boom-era speech"],
  ]),
});
check("caps evidence at 4", items.length <= 4);
check(
  "each item has excerpt and citation",
  items.every((e) => e.excerpt.length > 20 && e.citation.length > 5)
);
check(
  "does not dump the full boom page",
  items.every((e) => e.excerpt.length <= 320)
);

const parsed = parseUsedSourceEntries([
  { id: "water-company", used_for: "Southern California Mountain Water Company" },
  "ferry-system",
]);
check(
  "parses used_sources objects and bare ids",
  parsed[0]?.id === "water-company" &&
    parsed[0]?.usedFor.includes("Water") &&
    parsed[1]?.id === "ferry-system"
);

check(
  "sanitizeUsedFor truncates",
  sanitizeUsedFor("x".repeat(300), "short answer").length <= 161
);

check(
  "strips markdown bold from used_for",
  sanitizeUsedFor(
    "partner in the **Coronado Beach Company** in 1889",
    "answer"
  ) === "partner in the Coronado Beach Company in 1889"
);

const derived = deriveUsedForFromAnswer(answer, waterCurated);
check(
  "derives used-for claim from the answer",
  /Mountain Water|water/i.test(derived),
  derived
);

const noClaimItems = buildEvidenceItems({
  answer,
  cited: [waterCurated, ferryCurated],
  retrieved: [waterCurated, ferryCurated],
  curatedIds: new Set(["water-company", "ferry-system"]),
  usedForById: new Map(),
});
check(
  "fills usedFor when model omits used_for",
  noClaimItems.every((e) => e.usedFor.length > 8),
  noClaimItems.map((e) => e.usedFor).join(" | ")
);

const closing =
  "I often enjoyed local seafood from the bay. If you are interested, I can share more about the culinary scene or the dining options at the Hotel del Coronado and Tent City.";
check(
  "detects follow-up offer sentences",
  isFollowUpOffer(
    "If you are interested, I can share more about the culinary scene or the dining options at the Hotel del Coronado and Tent City."
  ) && !isFollowUpOffer("I often enjoyed local seafood from the bay.")
);
check(
  "factualAnswerText strips closing offers",
  /seafood/i.test(factualAnswerText(closing)) &&
    !/If you are interested/i.test(factualAnswerText(closing))
);

const forefather = chunk(
  "nickname-forefather",
  "Local memory often calls Spreckels 'Coronado's Forefather' for his ownership of the Del, Tent City, ferry links, and decades of island investment.",
  { topics: ["forefather", "coronado"] }
);
const residence = chunk(
  "speaking-year-1912",
  "In 1912 Spreckels speaks from Coronado as a settled resident of the Glorietta Bay mansion, owner of the Hotel del Coronado and Tent City.",
  { topics: ["1912", "mansion"] }
);
const closingItems = buildEvidenceItems({
  answer: closing,
  cited: [forefather, residence],
  retrieved: [forefather, residence],
  curatedIds: new Set(["nickname-forefather", "speaking-year-1912"]),
  usedForById: new Map([
    [
      "speaking-year-1912",
      "If you are interested, I can share more about the culinary scene or the dining options at the Hotel del Coronado and Tent City.",
    ],
    [
      "nickname-forefather",
      "In Coronado, I have often enjoyed the local seafood, particularly the fresh fish caught in the bay.",
    ],
  ]),
});
check(
  "drops cards whose Used for is a follow-up offer",
  !closingItems.some((e) => /interested|culinary scene/i.test(e.usedFor)),
  closingItems.map((e) => e.usedFor).join(" | ")
);
check(
  "drops mismatched Forefather card for seafood claim",
  !closingItems.some((e) => e.id === "nickname-forefather"),
  closingItems.map((e) => e.id).join(",")
);

console.log("");
if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log("Evidence display checks passed.");
