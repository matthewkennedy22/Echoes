/**
 * Offline image-matching scenarios — no API/LLM required.
 * Run: npx tsx scripts/test-image-matching-static.ts
 */

import { listPersonaPacks } from "@/personas";
import { withPersona } from "@/lib/activePersona";
import {
  answerSupportsImage,
  detectStoryThemes,
  imageMatchesQueryIntent,
  imageStoryMatchScore,
  pickBestStoryImage,
} from "@/lib/imageMatching";

interface Scenario {
  slug: string;
  label: string;
  userQuery: string;
  storyHay: string;
  wantId?: string;
  banIds?: RegExp;
  minScore?: number;
}

const SCENARIOS: Scenario[] = [
  // Myron — Buchon vs Chumash 'ap (original bug)
  {
    slug: "myron-angel",
    label: "Buchon residence answer → house, not Chumash 'ap",
    userQuery: "Where did you live?",
    storyHay:
      "I resided at 714 Buchon Street in San Luis Obispo — my house on Buchon, a modest Victorian home downtown.",
    wantId: "img-buchon-house",
    banIds: /chumash-ap|choris/,
  },
  {
    slug: "myron-angel",
    label: "Chumash 'ap village → replica ok",
    userQuery: "What did a Chumash village look like?",
    storyHay:
      "The Chumash lived in 'ap houses — tule and willow dwellings at the village, not Victorian homes.",
    wantId: "img-chumash-ap-replica",
  },
  // August Hemme — ranch vs fandango
  {
    slug: "august-hemme",
    label: "Walnut ranch → not Californio fandango",
    userQuery: "Tell me about your ranch.",
    storyHay:
      "My Hemme Ranch grew to three thousand acres — walnuts, grain, hay, and cattle on the San Ramon Valley floor.",
    banIds: /fandango/,
  },
  {
    slug: "august-hemme",
    label: "Danville depot → depot image",
    userQuery: "Show me the Danville depot.",
    storyHay:
      "The Southern Pacific combination depot on Railroad Avenue opened in 1891 when our branch line arrived.",
    wantId: "img-danville-depot",
  },
  // Anita Loos — Hollywood place vs Griffith portrait
  {
    slug: "anita-loos",
    label: "Hollywood look-like → boulevard, not Griffith",
    userQuery: "What did Hollywood look like in your day?",
    storyHay:
      "Hollywood Boulevard in the 1920s — streetcars, storefronts, the colony inventing itself.",
    wantId: "img-hollywood-blvd-1922",
    banIds: /griffith-portrait|fairbanks/,
  },
  {
    slug: "anita-loos",
    label: "Fairbanks → Fairbanks image",
    userQuery: "Tell me about Douglas Fairbanks.",
    storyHay:
      "Douglas Fairbanks — the athletic star whose swashbuckling adventure pictures Emerson and I helped shape.",
    wantId: "img-fairbanks-1922",
  },
  // Alonzo Horton — Davis vs Horton House
  {
    slug: "alonzo-horton",
    label: "Davis house → Gaslamp, not Horton House",
    userQuery: "Tell me about William Heath Davis.",
    storyHay:
      "William Heath Davis built an earlier New Town attempt; his Davis house survives in the Gaslamp quarter.",
    wantId: "img-gaslamp-william-heath-davis",
    banIds: /horton-house/,
  },
  {
    slug: "alonzo-horton",
    label: "Horton House hotel → Horton House",
    userQuery: "Tell me about the Horton House hotel.",
    storyHay:
      "The Horton House was my New Town hotel on the bay — Parker & Parker photographed the landmark.",
    wantId: "img-horton-house",
  },
  // Bancroft — Spring Valley ranch
  {
    slug: "hubert-howe-bancroft",
    label: "Spring Valley country home → ranch image",
    userQuery: "Where did you retire?",
    storyHay:
      "I retired to my Spring Valley country home — the Bancroft Ranch adobe in San Diego County.",
    wantId: "img-bancroft-ranch",
  },
  // John Muir — sequoias vs valley landmarks
  {
    slug: "john-muir",
    label: "Mariposa Grove sequoias → Grizzly Giant, not El Capitan",
    userQuery: "Tell me about the Grizzly Giant sequoia.",
    storyHay:
      "The Grizzly Giant in the Mariposa Grove — a living sequoia monument among the big trees.",
    wantId: "img-grizzly-giant",
    banIds: /el-capitan|half-dome|hetch/,
  },
  // Jesse Mason — Chumash vs mission on native query
  {
    slug: "jesse-d-mason",
    label: "Chumash rock art → painted cave",
    userQuery: "Tell me about Chumash pictographs.",
    storyHay:
      "Chumash pictographs and rock art in painted caves — spiritual symbols along the Santa Barbara coast.",
    wantId: "img-chumash-painted-cave",
    banIds: /^img-mission-/,
  },
];

async function runScenario(s: Scenario): Promise<{
  label: string;
  slug: string;
  ok: boolean;
  problems: string[];
  picked: string | null;
  error?: string;
}> {
  const pack = listPersonaPacks().find((p) => p.public.slug === s.slug);
  if (!pack) {
    return {
      label: s.label,
      slug: s.slug,
      ok: false,
      problems: [],
      picked: null,
      error: `unknown slug ${s.slug}`,
    };
  }

  return withPersona(pack, async () => {
    const themes = detectStoryThemes(s.storyHay);
    const candidates = pack.images;
    const best = pickBestStoryImage(candidates, s.storyHay, themes, s.minScore ?? 3);
    const problems: string[] = [];

    if (s.wantId && best?.id !== s.wantId) {
      problems.push(`expected ${s.wantId}, got ${best?.id ?? "none"}`);
    }
    if (s.banIds && best && s.banIds.test(best.id)) {
      problems.push(`banned image matched: ${best.id}`);
    }
    if (best && !answerSupportsImage(best, s.storyHay)) {
      problems.push(`answerSupportsImage failed for ${best.id}`);
    }
    if (best && !imageMatchesQueryIntent(s.userQuery, best)) {
      problems.push(`imageMatchesQueryIntent failed for ${best.id}`);
    }

    // Also check no banned image scores high
    if (s.banIds) {
      for (const img of candidates) {
        if (!s.banIds.test(img.id)) continue;
        const score = imageStoryMatchScore(img, s.storyHay);
        if (
          score >= 4 &&
          answerSupportsImage(img, s.storyHay) &&
          imageMatchesQueryIntent(s.userQuery, img)
        ) {
          problems.push(`banned ${img.id} would match (score ${score})`);
        }
      }
    }

    return {
      label: s.label,
      slug: s.slug,
      ok: problems.length === 0,
      problems,
      picked: best?.id ?? null,
    };
  });
}

async function main() {
  console.log("\nECHOES static image-matching scenarios\n");
  let pass = 0;
  let fail = 0;

  for (const s of SCENARIOS) {
    const r = await runScenario(s);
    const mark = r.ok ? "✓" : "✗";
    console.log(`${mark} [${r.slug}] ${r.label}`);
    if (!r.ok) {
      for (const p of r.problems) console.log(`    → ${p}`);
      if (r.error) console.log(`    → ${r.error}`);
      console.log(`    picked: ${r.picked ?? "?"}`);
      fail++;
    } else {
      console.log(`    picked: ${r.picked ?? "none"}`);
      pass++;
    }
  }

  console.log(`\nTOTAL: ${pass} passed, ${fail} failed\n`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
