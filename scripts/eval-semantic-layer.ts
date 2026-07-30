#!/usr/bin/env npx tsx
/**
 * A/B eval: semantic layer ON vs OFF across personas.
 *
 * Usage:
 *   npm run eval:semantic
 *   npm run eval:semantic -- --slug myron-angel
 *   npm run eval:semantic -- --all
 *   npm run eval:semantic:answers -- --slug anita-loos
 *   npm run eval:semantic -- --all --json
 */
import fs from "node:fs";
import path from "node:path";

function loadDotEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(process.cwd(), name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      if (process.env[m[1]] != null) continue;
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}
loadDotEnv();

import { answerQuestion, rankSourcesForQuery, warmIndex } from "../lib/rag";
import { getPersonaPack, listPersonaPacks } from "../personas";
import type { PersonaPack } from "../personas/types";

import {
  CASES_BY_SLUG,
  type SemanticEvalCase as Case,
} from "./eval-semantic-cases";

const TOP_K = 10;
const withAnswers = process.argv.includes("--answers");
const asJson = process.argv.includes("--json");
const runAll = process.argv.includes("--all");
const slugArgIdx = process.argv.indexOf("--slug");
const slugArg =
  slugArgIdx >= 0 ? process.argv[slugArgIdx + 1]?.trim().toLowerCase() : null;

function bestRank(hits: { id: string; rank: number }[], ids: string[]): number | null {
  let best: number | null = null;
  const set = new Set(ids);
  for (const h of hits) {
    if (!set.has(h.id)) continue;
    if (best == null || h.rank < best) best = h.rank;
  }
  return best;
}

function hitAtK(hits: { id: string }[], ids: string[], k: number): boolean {
  const top = new Set(hits.slice(0, k).map((h) => h.id));
  return ids.some((id) => top.has(id));
}

function allHitAtK(hits: { id: string }[], ids: string[], k: number): boolean {
  const top = new Set(hits.slice(0, k).map((h) => h.id));
  return ids.every((id) => top.has(id));
}

function mrr(rank: number | null): number {
  return rank == null ? 0 : 1 / rank;
}

type SideMetrics = {
  hit1: boolean;
  hit3: boolean;
  hit10: boolean;
  all10: boolean;
  bestRank: number | null;
  mrr: number;
  topIds: string[];
};

function metricsFor(hits: { id: string; rank: number }[], c: Case): SideMetrics {
  const expect = c.expectAnyOf;
  const rank = bestRank(hits, expect);
  return {
    hit1: hitAtK(hits, expect, 1),
    hit3: hitAtK(hits, expect, 3),
    hit10: hitAtK(hits, expect, 10),
    all10: c.expectAllOf
      ? allHitAtK(hits, c.expectAllOf, 10)
      : hitAtK(hits, expect, 10),
    bestRank: rank,
    mrr: mrr(rank),
    topIds: hits.slice(0, 5).map((h) => h.id),
  };
}

function winner(off: SideMetrics, on: SideMetrics): "on" | "off" | "tie" {
  if (on.mrr !== off.mrr) return on.mrr > off.mrr ? "on" : "off";
  if (on.hit1 !== off.hit1) return on.hit1 ? "on" : "off";
  if (on.hit3 !== off.hit3) return on.hit3 ? "on" : "off";
  if (on.hit10 !== off.hit10) return on.hit10 ? "on" : "off";
  return "tie";
}

async function evalPersona(pack: PersonaPack) {
  const slug = pack.public.slug;
  const cases = CASES_BY_SLUG[slug];
  if (!cases?.length) {
    console.warn(`No gold cases for ${slug} — skip`);
    return null;
  }
  if (!pack.semanticVocab) {
    console.warn(`${slug} has no semanticVocab — skip`);
    return null;
  }

  console.log(`\n▸ ${pack.public.name} (${slug})`);
  await warmIndex(slug);

  const rows: {
    id: string;
    query: string;
    off: SideMetrics;
    on: SideMetrics;
    winner: "on" | "off" | "tie";
    answer?: {
      offCitesGold: boolean;
      onCitesGold: boolean;
      offAnswerOk: boolean;
      onAnswerOk: boolean;
    };
  }[] = [];

  for (const c of cases) {
    process.stdout.write(`  ${c.id}…`);
    const [offRes, onRes] = await Promise.all([
      rankSourcesForQuery(pack, c.query, { useSemantic: false, topK: TOP_K }),
      rankSourcesForQuery(pack, c.query, { useSemantic: true, topK: TOP_K }),
    ]);
    const off = metricsFor(offRes.hits, c);
    const on = metricsFor(onRes.hits, c);
    const w = winner(off, on);
    const row: (typeof rows)[number] = {
      id: c.id,
      query: c.query,
      off,
      on,
      winner: w,
    };

    if (withAnswers) {
      const history = [{ role: "user" as const, content: c.query }];
      const [ansOff, ansOn] = await Promise.all([
        answerQuestion(history, slug, { useSemantic: false }),
        answerQuestion(history, slug, { useSemantic: true }),
      ]);
      const gold = new Set(c.expectAnyOf);
      const cite = (ids: string[]) => ids.some((id) => gold.has(id));
      const ok = (text: string) =>
        (c.answerMustMatch ?? []).every((re) => re.test(text));
      row.answer = {
        offCitesGold: cite(ansOff.usedSourceIds),
        onCitesGold: cite(ansOn.usedSourceIds),
        offAnswerOk: ok(ansOff.answer),
        onAnswerOk: ok(ansOn.answer),
      };
    }

    rows.push(row);
    console.log(
      ` ${w === "on" ? "SEMANTIC↑" : w === "off" ? "BASELINE↑" : "TIE"}`
    );
  }

  const n = rows.length;
  const sum = (pick: (r: (typeof rows)[0]) => number) =>
    rows.reduce((a, r) => a + pick(r), 0);

  const summary = {
    slug,
    name: pack.public.name,
    cases: n,
    retrieval: {
      baseline: {
        hitAt1: sum((r) => (r.off.hit1 ? 1 : 0)) / n,
        hitAt3: sum((r) => (r.off.hit3 ? 1 : 0)) / n,
        hitAt10: sum((r) => (r.off.hit10 ? 1 : 0)) / n,
        meanMrr: sum((r) => r.off.mrr) / n,
      },
      semantic: {
        hitAt1: sum((r) => (r.on.hit1 ? 1 : 0)) / n,
        hitAt3: sum((r) => (r.on.hit3 ? 1 : 0)) / n,
        hitAt10: sum((r) => (r.on.hit10 ? 1 : 0)) / n,
        meanMrr: sum((r) => r.on.mrr) / n,
      },
      wins: {
        semantic: rows.filter((r) => r.winner === "on").length,
        baseline: rows.filter((r) => r.winner === "off").length,
        tie: rows.filter((r) => r.winner === "tie").length,
      },
    },
    answers: withAnswers
      ? {
          baselineCiteGold: sum((r) => (r.answer?.offCitesGold ? 1 : 0)) / n,
          semanticCiteGold: sum((r) => (r.answer?.onCitesGold ? 1 : 0)) / n,
          baselineAnswerOk: sum((r) => (r.answer?.offAnswerOk ? 1 : 0)) / n,
          semanticAnswerOk: sum((r) => (r.answer?.onAnswerOk ? 1 : 0)) / n,
        }
      : null,
    rows,
  };

  if (!asJson) {
    const b = summary.retrieval.baseline;
    const s = summary.retrieval.semantic;
    console.log(
      `  Hit@1  ${(b.hitAt1 * 100).toFixed(0)}% → ${(s.hitAt1 * 100).toFixed(0)}%   Hit@3  ${(b.hitAt3 * 100).toFixed(0)}% → ${(s.hitAt3 * 100).toFixed(0)}%   Hit@10 ${(b.hitAt10 * 100).toFixed(0)}% → ${(s.hitAt10 * 100).toFixed(0)}%   MRR  ${b.meanMrr.toFixed(3)} → ${s.meanMrr.toFixed(3)}`
    );
    console.log(
      `  Wins   semantic ${summary.retrieval.wins.semantic}  baseline ${summary.retrieval.wins.baseline}  tie ${summary.retrieval.wins.tie}`
    );
    const misses = rows.filter((r) => !r.on.hit10);
    const baseWins = rows.filter((r) => r.winner === "off");
    if (misses.length) {
      console.log(`  MISS@10 (semantic): ${misses.map((r) => r.id).join(", ")}`);
    }
    if (baseWins.length) {
      console.log(`  BASELINE↑ cases: ${baseWins.map((r) => r.id).join(", ")}`);
    }
    if (summary.answers) {
      console.log(
        `  Answers cite gold ${(summary.answers.baselineCiteGold * 100).toFixed(0)}% → ${(summary.answers.semanticCiteGold * 100).toFixed(0)}%`
      );
    }
  }

  return summary;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY (check .env.local)");
    process.exit(1);
  }

  const packs: PersonaPack[] = runAll
    ? listPersonaPacks().filter((p) => CASES_BY_SLUG[p.public.slug])
    : [getPersonaPack(slugArg ?? "myron-angel")];

  if (!runAll && slugArg && !CASES_BY_SLUG[slugArg]) {
    console.error(
      `No gold cases for --slug ${slugArg}. Known: ${Object.keys(CASES_BY_SLUG).join(", ")}`
    );
    process.exit(1);
  }

  console.log(
    `Semantic A/B eval (${withAnswers ? "retrieval+answers" : "retrieval"}) — ${packs.map((p) => p.public.slug).join(", ")}`
  );

  const summaries = [];
  for (const pack of packs) {
    const s = await evalPersona(pack);
    if (s) summaries.push(s);
  }

  if (asJson) {
    console.log(JSON.stringify({ summaries }, null, 2));
  } else {
    console.log("\n══════════════════════════════════════════════════");
    console.log("Thorough topic coverage summary");
    console.log("══════════════════════════════════════════════════");
    let anyRegression = false;
    let anyGain = false;
    let totalCases = 0;
    let totalMiss10 = 0;
    let totalSemWins = 0;
    let totalBaseWins = 0;
    for (const s of summaries) {
      const b = s.retrieval.baseline;
      const sem = s.retrieval.semantic;
      const miss10 = s.rows.filter((r: { on: { hit10: boolean } }) => !r.on.hit10);
      totalCases += s.cases;
      totalMiss10 += miss10.length;
      totalSemWins += s.retrieval.wins.semantic;
      totalBaseWins += s.retrieval.wins.baseline;
      const improved =
        sem.meanMrr > b.meanMrr + 0.01 ||
        sem.hitAt3 > b.hitAt3 ||
        (sem.meanMrr >= b.meanMrr &&
          s.retrieval.wins.semantic > s.retrieval.wins.baseline);
      const regressed =
        sem.meanMrr + 0.01 < b.meanMrr &&
        s.retrieval.wins.baseline > s.retrieval.wins.semantic;
      if (regressed) anyRegression = true;
      if (improved) anyGain = true;
      const label = regressed
        ? "REGRESS"
        : improved
          ? "GAIN"
          : "TIE/OK";
      console.log(
        `${label.padEnd(8)} ${s.slug.padEnd(24)} cases=${String(s.cases).padStart(2)}  Hit@10 ${(sem.hitAt10 * 100).toFixed(0).padStart(3)}%  MRR ${b.meanMrr.toFixed(3)} → ${sem.meanMrr.toFixed(3)}  +${s.retrieval.wins.semantic}/-${s.retrieval.wins.baseline}${miss10.length ? `  miss:${miss10.map((r: { id: string }) => r.id).join("|")}` : ""}`
      );
    }
    console.log("");
    console.log(
      `Totals: ${totalCases} cases · semantic Hit@10 misses ${totalMiss10} · wins +${totalSemWins}/-${totalBaseWins}`
    );
    console.log("");
    if (anyRegression) {
      console.log(
        "VERDICT: At least one persona regressed — inspect before treating rollout as done."
      );
    } else if (totalMiss10 === 0 && totalBaseWins === 0) {
      console.log(
        "VERDICT: Airtight on this gold set — every case Hit@10 under semantic, no baseline wins."
      );
    } else if (anyGain && !anyRegression) {
      console.log(
        "VERDICT: Semantic helps overall. Remaining misses/baseline↑ cases are gaps to tighten (aliases/tags), not blockers for keep-on."
      );
    } else {
      console.log(
        "VERDICT: No clear gain or regression — safe opt-in, keep measuring."
      );
    }
  }

  const ok = summaries.every(
    (s) =>
      s.retrieval.semantic.meanMrr + 1e-9 >= s.retrieval.baseline.meanMrr &&
      s.retrieval.wins.baseline <= s.retrieval.wins.semantic + 1
  );
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
