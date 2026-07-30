#!/usr/bin/env npx tsx
/**
 * Enrich book OCR chunks with semantic tags from each persona's vocab.
 *
 * Deterministic (no LLM): match people/places/orgs/events/periods in chunk
 * text + extract tight year spans from the body. Safe against laundry-list dates.
 *
 * Usage:
 *   npm run enrich:semantic
 *   npm run enrich:semantic -- myron-angel anita-loos
 *
 * Does not change chunk text → embeddings hash stays valid (no re-embed required).
 */
import fs from "node:fs";
import path from "node:path";
import { semanticIsEmpty, tagTextWithVocab } from "../lib/semantic";
import {
  getPersonaPack,
  isKnownPersonaSlug,
  listPersonaPacks,
} from "../personas";
import type { SourceChunk, SourceSemantic } from "../lib/types";

function bookPaths(pack: {
  bookChunksPaths?: string[];
  bookChunksPath?: string;
}) {
  if (pack.bookChunksPaths?.length) return pack.bookChunksPaths;
  if (pack.bookChunksPath) return [pack.bookChunksPath];
  return [];
}

function enrichFile(
  filePath: string,
  vocab: NonNullable<ReturnType<typeof getPersonaPack>["semanticVocab"]>
): { total: number; tagged: number } {
  const abs = path.join(process.cwd(), filePath);
  if (!fs.existsSync(abs)) {
    console.warn(`  missing ${filePath}`);
    return { total: 0, tagged: 0 };
  }
  const data = JSON.parse(fs.readFileSync(abs, "utf8")) as SourceChunk[];
  let tagged = 0;
  const out = data.map((chunk) => {
    const semantic: SourceSemantic = tagTextWithVocab(chunk.text ?? "", vocab);
    if (semanticIsEmpty(semantic)) {
      const { semantic: _s, ...rest } = chunk;
      return rest as SourceChunk;
    }
    tagged += 1;
    return { ...chunk, semantic };
  });
  fs.writeFileSync(abs, JSON.stringify(out, null, 2) + "\n");
  return { total: data.length, tagged };
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const packs = args.length
    ? args.map((slug) => {
        if (!isKnownPersonaSlug(slug)) {
          throw new Error(`Unknown persona: ${slug}`);
        }
        return getPersonaPack(slug);
      })
    : listPersonaPacks();

  for (const pack of packs) {
    const slug = pack.public.slug;
    const vocab = pack.semanticVocab;
    if (!vocab) {
      console.log(`⏭  ${slug}: no semanticVocab`);
      continue;
    }
    const paths = bookPaths(pack);
    if (!paths.length) {
      console.log(`⏭  ${slug}: no book chunks`);
      continue;
    }
    console.log(`▸ ${slug}`);
    let total = 0;
    let tagged = 0;
    for (const p of paths) {
      const r = enrichFile(p, vocab);
      console.log(`  ${p}: ${r.tagged}/${r.total} chunks tagged`);
      total += r.total;
      tagged += r.tagged;
    }
    console.log(
      `  total ${tagged}/${total} (${total ? Math.round((100 * tagged) / total) : 0}%)`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
