/**
 * Offline verifier scenarios — no API/LLM required.
 * Run: npx tsx scripts/test-answer-verifier.ts
 */

import { verifyGroundedAnswer } from "@/lib/answerVerifier";
import type { PersonaPack } from "@/personas/types";
import type { ImageAsset, SourceChunk } from "@/lib/types";

function mockPack(slug: string, year: number): PersonaPack {
  return {
    public: {
      slug,
      name: "Test Persona",
      shortName: "Test",
      lifespan: "1800–1920",
      tagline: "test",
      eraLabel: String(year),
      locationLabel: "test",
      portraitSrc: "/portraits/test.jpg",
      accentColor: "#000",
      summary: "test",
    },
    temporalYear: year,
    sources: [],
    images: [],
    systemPrompt: "",
    speakerLabel: "Test",
  } as PersonaPack;
}

function chunk(id: string, text: string): SourceChunk {
  return {
    id,
    text,
    citation: id,
    topics: [],
    reliability: "high",
  };
}

function img(id: string, caption: string): ImageAsset {
  return {
    id,
    src: `/images/${id}.jpg`,
    alt: caption,
    caption,
    topics: caption.toLowerCase().split(/\s+/),
    citation: "test",
    license: "test",
  };
}

interface Case {
  name: string;
  run: () => void;
}

let failed = 0;

function assert(cond: boolean, msg: string) {
  if (!cond) {
    failed += 1;
    console.error(`  FAIL: ${msg}`);
  } else {
    console.log(`  ok: ${msg}`);
  }
}

const cases: Case[] = [
  {
    name: "Tent City during Del construction → rewrite",
    run: () => {
      const pack = mockPack("john-d-spreckels", 1912);
      const r = verifyGroundedAnswer({
        answer:
          "While the Hotel del Coronado was under construction in the late 1880s, Tent City housed the overflow guests.",
        evidenceLabel: "documented",
        usedSourceIds: ["tent-city"],
        retrieved: [
          chunk(
            "tent-city",
            "Tent City opened in 1900 beside the Hotel del Coronado, which had opened in 1888."
          ),
        ],
        images: [],
        userQuery: "Tell me about Tent City",
        pack,
      });
      assert(r.needsRewrite, "needsRewrite true");
      assert(
        r.issues.some((i) => i.includes("tent-city-not-original")),
        "invariant flagged"
      );
    },
  },
  {
    name: "Tent City with correct chronology → pass",
    run: () => {
      const pack = mockPack("john-d-spreckels", 1912);
      const r = verifyGroundedAnswer({
        answer:
          "The Hotel del Coronado opened in 1888. Tent City opened in 1900 — twelve years later — as an affordable adjunct beside the already-open hotel.",
        evidenceLabel: "documented",
        usedSourceIds: ["tent-city"],
        retrieved: [
          chunk(
            "tent-city",
            "Tent City opened in 1900 beside the Hotel del Coronado, which had opened in 1888."
          ),
        ],
        images: [],
        userQuery: "Tell me about Tent City",
        pack,
      });
      assert(!r.needsRewrite, "no rewrite");
      assert(r.evidenceLabel === "documented", "stays documented");
    },
  },
  {
    name: "Monte Carlo personal involvement → rewrite",
    run: () => {
      const pack = mockPack("john-d-spreckels", 1912);
      const r = verifyGroundedAnswer({
        answer:
          "I operated the Monte Carlo gambling ship off Coronado — a fine casino enterprise of mine.",
        evidenceLabel: "documented",
        usedSourceIds: [],
        retrieved: [
          chunk(
            "later-monte-carlo-ship",
            "The SS Monte Carlo gambling ship ran in the 1930s, after Spreckels's death."
          ),
        ],
        images: [],
        userQuery: "Did you run the Monte Carlo?",
        pack,
      });
      assert(r.needsRewrite, "needsRewrite");
      assert(
        r.issues.some((i) => i.includes("monte-carlo")),
        "monte carlo invariant"
      );
    },
  },
  {
    name: "Post-era bridge labeled documented → inference",
    run: () => {
      const pack = mockPack("john-d-spreckels", 1912);
      const r = verifyGroundedAnswer({
        answer:
          "After my time, the record tells us the SS Monte Carlo ran as a gambling ship in the 1930s.",
        evidenceLabel: "documented",
        usedSourceIds: ["bio-spreckels"],
        retrieved: [
          chunk("bio-spreckels", "John D. Spreckels owned the Hotel del Coronado by 1912."),
        ],
        images: [],
        userQuery: "What about the Monte Carlo ship?",
        pack,
      });
      assert(!r.needsRewrite, "bridge is ok (no rewrite)");
      assert(r.evidenceLabel === "inference", "downgraded to inference");
      assert(
        r.issues.some((i) => i.includes("post-era-bridge")),
        "issue logged"
      );
    },
  },
  {
    name: "Documented with no cited sources → inference",
    run: () => {
      const pack = mockPack("myron-angel", 1905);
      const r = verifyGroundedAnswer({
        answer: "San Luis Obispo grew rapidly after the railroad arrived.",
        evidenceLabel: "documented",
        usedSourceIds: ["missing-id"],
        retrieved: [chunk("book-1", "The railroad reached San Luis Obispo in 1894.")],
        images: [],
        userQuery: "How did the town grow?",
        pack,
      });
      assert(r.evidenceLabel === "inference", "downgraded");
    },
  },
  {
    name: "Unknown strips images",
    run: () => {
      const pack = mockPack("myron-angel", 1905);
      const r = verifyGroundedAnswer({
        answer: "I cannot say.",
        evidenceLabel: "unknown",
        usedSourceIds: [],
        retrieved: [],
        images: [img("img-mission", "Mission San Luis Obispo")],
        userQuery: "What is quantum computing?",
        pack,
      });
      assert(r.images.length === 0, "images cleared");
    },
  },
  {
    name: "Unrelated image stripped",
    run: () => {
      const pack = mockPack("john-d-spreckels", 1912);
      const r = verifyGroundedAnswer({
        answer:
          "I owned the ferry that connected San Diego and Coronado across the bay.",
        evidenceLabel: "documented",
        usedSourceIds: ["ferry"],
        retrieved: [
          chunk("ferry", "Spreckels operated the Coronado ferry across San Diego Bay."),
        ],
        images: [img("img-tent-city", "Tent City beach cottages at Coronado")],
        userQuery: "Tell me about the ferry",
        pack,
      });
      assert(r.images.length === 0, "tent city image stripped from ferry answer");
    },
  },
  {
    name: "Inference with strong citations → documented",
    run: () => {
      const pack = mockPack("john-d-spreckels", 1912);
      const r = verifyGroundedAnswer({
        answer:
          "Yes, I own the Hotel del Coronado, having acquired it through the Coronado Beach Company after the founders Babcock and Story opened the hotel in 1888.",
        evidenceLabel: "inference",
        usedSourceIds: ["del-full-ownership", "del-opened-1888"],
        retrieved: [
          chunk(
            "del-full-ownership",
            "Through the Coronado Beach Company Spreckels came into possession of the Hotel del Coronado."
          ),
          chunk(
            "del-opened-1888",
            "The Hotel del Coronado was built by founders including E. S. Babcock and Hampton L. Story; the hotel opened in 1888."
          ),
        ],
        images: [],
        userQuery: "Did you own the Hotel del Coronado?",
        pack,
      });
      assert(r.evidenceLabel === "documented", "upgraded to documented");
      assert(
        r.issues.some((i) => i.includes("inference-strong-overlap")),
        "upgrade logged"
      );
    },
  },
  {
    name: "Legacy-bridge inference stays inference",
    run: () => {
      const pack = mockPack("john-d-spreckels", 1912);
      const r = verifyGroundedAnswer({
        answer:
          "From 1912 I could not yet know it; after my time, the record tells us the Panama-California Exposition opened in 1915.",
        evidenceLabel: "inference",
        usedSourceIds: ["bio-spreckels"],
        retrieved: [
          chunk(
            "bio-spreckels",
            "John D. Spreckels owned the Hotel del Coronado by 1912 and lived on Glorietta Bay."
          ),
        ],
        images: [],
        userQuery: "What about the 1915 exposition?",
        pack,
      });
      assert(r.evidenceLabel === "inference", "stays inference for later-record bridge");
    },
  },
];

console.log("Answer verifier static tests\n");
for (const c of cases) {
  console.log(`• ${c.name}`);
  c.run();
}
console.log("");
if (failed) {
  console.error(`${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("All verifier static tests passed.");
