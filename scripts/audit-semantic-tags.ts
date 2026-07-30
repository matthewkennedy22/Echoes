#!/usr/bin/env npx tsx
/**
 * Human audit helper for semantic tags.
 *
 * Prints chunk text beside assigned tags so you can spot-check accuracy.
 * Also flags obvious mismatches (year not in text, entity id with no
 * matching vocab term in text).
 *
 * Usage:
 *   npm run audit:semantic -- myron-angel
 *   npm run audit:semantic -- myron-angel --books --sample 20
 *   npm run audit:semantic -- anita-loos --curated
 *   npm run audit:semantic -- myron-angel --books --only-flagged
 *   npm run audit:semantic -- august-hemme --books --id contra-costa-1882-0237
 */
import fs from "node:fs";
import path from "node:path";
import {
  applySemanticAnnotations,
  textMentionsTerm,
  type PersonaSemanticVocab,
} from "../lib/semantic";
import {
  getPersonaPack,
  isKnownPersonaSlug,
} from "../personas";
import type { SourceChunk, SourceSemantic } from "../lib/types";

function loadDotEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(process.cwd(), name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m || process.env[m[1]] != null) continue;
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

function argValue(flag: string): string | null {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] ?? null : null;
}

function bookPaths(pack: {
  bookChunksPaths?: string[];
  bookChunksPath?: string;
}): string[] {
  if (pack.bookChunksPaths?.length) return pack.bookChunksPaths;
  if (pack.bookChunksPath) return [pack.bookChunksPath];
  return [];
}

function loadBooks(paths: string[]): SourceChunk[] {
  const out: SourceChunk[] = [];
  for (const rel of paths) {
    const abs = path.join(process.cwd(), rel);
    if (!fs.existsSync(abs)) continue;
    const data = JSON.parse(fs.readFileSync(abs, "utf8")) as SourceChunk[];
    out.push(...data);
  }
  return out;
}

function entityTerms(
  vocab: PersonaSemanticVocab,
  kind: keyof Pick<
    PersonaSemanticVocab,
    "people" | "places" | "organizations" | "events"
  >,
  id: string
): string[] {
  const hit = vocab[kind].find((e) => e.id === id);
  if (!hit) return [id.replace(/-/g, " ")];
  return [hit.label, ...hit.aliases, id.replace(/-/g, " ")];
}

type Flag = { code: string; detail: string };

function flagsForChunk(
  chunk: SourceChunk,
  vocab: PersonaSemanticVocab | undefined,
  opts: { curated: boolean }
): Flag[] {
  const sem = chunk.semantic;
  if (!sem) return [];
  const hay = (chunk.text ?? "").toLowerCase();
  const flags: Flag[] = [];

  if (sem.yearStart != null) {
    const y0 = String(sem.yearStart);
    const y1 = String(sem.yearEnd ?? sem.yearStart);
    const inText = hay.includes(y0) || (y1 !== y0 && hay.includes(y1));
    const inDate = (chunk.dateRange ?? "").includes(y0);
    if (!inText && !inDate && !opts.curated) {
      flags.push({
        code: "year-not-in-text",
        detail: `${y0}${y1 !== y0 ? `–${y1}` : ""} not found in chunk text`,
      });
    }
    if (sem.yearEnd != null && sem.yearEnd - sem.yearStart > 30) {
      flags.push({
        code: "wide-year-span",
        detail: `${sem.yearStart}–${sem.yearEnd} (${sem.yearEnd - sem.yearStart} yrs)`,
      });
    }
  }

  if (!vocab) return flags;

  const check = (
    kind: "people" | "places" | "organizations" | "events",
    ids: string[] | undefined
  ) => {
    for (const id of ids ?? []) {
      const terms = entityTerms(vocab, kind, id);
      const ok = terms.some((t) => textMentionsTerm(hay, t));
      if (!ok) {
        // Curated annotations may use synonym tags not literally in the short claim.
        flags.push({
          code: opts.curated ? "entity-not-literal" : "entity-not-in-text",
          detail: `${kind}:${id} — none of [${terms.slice(0, 3).join(" | ")}] in text`,
        });
      }
    }
  };

  check("people", sem.people);
  check("places", sem.places);
  check("organizations", sem.organizations);
  check("events", sem.events);

  return flags;
}

function formatSem(sem: SourceSemantic | undefined): string {
  if (!sem) return "(none)";
  const parts: string[] = [];
  if (sem.people?.length) parts.push(`people=${sem.people.join(",")}`);
  if (sem.places?.length) parts.push(`places=${sem.places.join(",")}`);
  if (sem.organizations?.length)
    parts.push(`orgs=${sem.organizations.join(",")}`);
  if (sem.events?.length) parts.push(`events=${sem.events.join(",")}`);
  if (sem.period) parts.push(`period=${sem.period}`);
  if (sem.yearStart != null)
    parts.push(
      `years=${sem.yearStart}${
        sem.yearEnd != null && sem.yearEnd !== sem.yearStart
          ? `–${sem.yearEnd}`
          : ""
      }`
    );
  return parts.join(" · ") || "(empty)";
}

function printChunk(
  chunk: SourceChunk,
  flags: Flag[],
  idx: number,
  total: number
) {
  const mark = flags.length ? "⚠" : "·";
  console.log(`\n${mark} [${idx + 1}/${total}] ${chunk.id}`);
  console.log(`  dateRange: ${chunk.dateRange ?? "—"}`);
  console.log(`  tags: ${formatSem(chunk.semantic)}`);
  if (flags.length) {
    for (const f of flags) console.log(`  FLAG ${f.code}: ${f.detail}`);
  }
  const excerpt = (chunk.text ?? "").replace(/\s+/g, " ").trim().slice(0, 360);
  console.log(`  text: ${excerpt}${excerpt.length >= 360 ? "…" : ""}`);
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const slug = args[0]?.toLowerCase();
  if (!slug || !isKnownPersonaSlug(slug)) {
    console.error(
      "Usage: npm run audit:semantic -- <slug> [--curated|--books] [--sample N] [--only-flagged] [--id <chunk-id>]"
    );
    process.exit(1);
  }

  const pack = getPersonaPack(slug);
  const wantCurated =
    process.argv.includes("--curated") ||
    (!process.argv.includes("--books") && !process.argv.includes("--curated"));
  const wantBooks = process.argv.includes("--books");
  const onlyFlagged = process.argv.includes("--only-flagged");
  const sampleN = Math.max(1, parseInt(argValue("--sample") ?? "15", 10) || 15);
  const onlyId = argValue("--id");

  type Row = { chunk: SourceChunk; curated: boolean; flags: Flag[] };
  const rows: Row[] = [];

  if (wantCurated && !wantBooks) {
    const curated = applySemanticAnnotations(
      pack.sources,
      pack.semanticAnnotations
    );
    for (const chunk of curated) {
      if (!chunk.semantic) continue;
      if (onlyId && chunk.id !== onlyId) continue;
      rows.push({
        chunk,
        curated: true,
        flags: flagsForChunk(chunk, pack.semanticVocab, { curated: true }),
      });
    }
  }

  if (wantBooks) {
    const books = loadBooks(bookPaths(pack)).filter((c) => c.semantic);
    for (const chunk of books) {
      if (onlyId && chunk.id !== onlyId) continue;
      rows.push({
        chunk,
        curated: false,
        flags: flagsForChunk(chunk, pack.semanticVocab, { curated: false }),
      });
    }
  }

  let pool = onlyFlagged ? rows.filter((r) => r.flags.length > 0) : rows;

  if (!onlyId && pool.length > sampleN) {
    // Stratified-ish: shuffle then take sampleN
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    pool = pool.slice(0, sampleN);
  }

  const flaggedTotal = rows.filter((r) => r.flags.length > 0).length;
  console.log(
    `Audit ${slug}: ${rows.length} tagged items in scope · ${flaggedTotal} auto-flagged · showing ${pool.length}`
  );
  console.log(
    "How to judge: does the TEXT clearly support each tag? Years should appear in the passage (or intentional curated dateRange)."
  );

  pool.forEach((r, i) => printChunk(r.chunk, r.flags, i, pool.length));

  console.log(`\n── Checklist ─────────────────────────────────────`);
  console.log(`□ People/places named in tags appear in the excerpt`);
  console.log(`□ Year tags match a date actually discussed (not a header OCR glitch)`);
  console.log(`□ Events aren’t stretched (e.g. “gold-rush” on a random 1852 mention)`);
  console.log(`□ If FLAG entity-not-in-text on books → bad alias or bad auto-tag`);
  console.log(`□ If FLAG entity-not-literal on curated → OK if claim implies it; else fix semantic.ts`);
  console.log(`\nRe-run: npm run audit:semantic -- ${slug} --books --only-flagged --sample 30`);
}

main();
