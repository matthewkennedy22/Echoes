#!/usr/bin/env node
/**
 * Precompute persona corpus embeddings and ship them with the deploy.
 *
 * Kills Vercel cold-start re-embedding: production loads
 * personas/<slug>/embeddings.json instead of calling OpenAI for every chunk.
 *
 * Usage:
 *   npm run embed:persona                  # all registered personas
 *   npm run embed:persona -- john-muir     # one or more slugs
 *
 * After changing curated sources or book-chunks JSON for a persona, re-run
 * this script for that slug before deploying.
 *
 * Requires OPENAI_API_KEY (from .env.local or the environment).
 */

import fs from "node:fs";
import path from "node:path";
import { embedMany, EMBED_DIM } from "../lib/llm";
import {
  buildPersonaCorpus,
  cacheEmbeddingsPath,
  shippedEmbeddingsPath,
  type EmbeddingIndexFile,
} from "../lib/rag";
import {
  listPersonaPacks,
  getPersonaPack,
  isKnownPersonaSlug,
} from "../personas";

/** Minimal .env loader (no dotenv dependency). */
function loadEnvFile(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const ROUND = 6;

function roundVectors(vectors: number[][]): number[][] {
  const f = 10 ** ROUND;
  return vectors.map((v) => v.map((x) => Math.round(x * f) / f));
}

function tryReuseFile(
  filePath: string,
  hash: string,
  count: number
): number[][] | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw) as EmbeddingIndexFile;
    if (data.hash === hash && data.vectors?.length === count) {
      return data.vectors;
    }
  } catch {
    /* miss */
  }
  return null;
}

async function embedSlug(slug: string): Promise<void> {
  const pack = getPersonaPack(slug);
  if (pack.public.slug !== slug) {
    throw new Error(`Unknown persona slug: ${slug}`);
  }

  const { corpus, curatedCount, hash } = buildPersonaCorpus(pack);
  const outPath = shippedEmbeddingsPath(slug);
  const cachePath = cacheEmbeddingsPath(slug);

  console.log(
    `\n══ ${slug}: ${corpus.length} chunks (${curatedCount} curated, ${corpus.length - curatedCount} book) dim=${EMBED_DIM}`
  );
  console.log(`  hash ${hash}`);

  let vectors =
    tryReuseFile(outPath, hash, corpus.length) ??
    tryReuseFile(cachePath, hash, corpus.length);

  if (vectors) {
    console.log(`  reusing existing index (${vectors.length} vectors)`);
    vectors = roundVectors(vectors);
  } else {
    const texts = corpus.map((c) => `${c.topics.join(", ")}: ${c.text}`);
    console.log(`  embedding via OpenAI…`);
    vectors = await embedMany(texts, (done, total) => {
      if (done % 480 === 0 || done === total) {
        console.log(`  embedded ${done}/${total}`);
      }
    });
    vectors = roundVectors(vectors);
  }

  const payload: EmbeddingIndexFile = {
    hash,
    dim: EMBED_DIM,
    count: vectors.length,
    vectors,
  };
  const json = JSON.stringify(payload);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, json, "utf8");
  const mb = (Buffer.byteLength(json) / (1024 * 1024)).toFixed(1);
  console.log(`  wrote ${outPath} (${mb} MB)`);

  try {
    fs.mkdirSync(path.dirname(cachePath), { recursive: true });
    fs.writeFileSync(cachePath, json, "utf8");
    console.log(`  mirrored ${cachePath}`);
  } catch {
    /* ignore cache write failures */
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "OPENAI_API_KEY is not set. Copy .env.local.example to .env.local and add your key."
    );
    process.exit(1);
  }

  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const slugs =
    args.length > 0
      ? args
      : listPersonaPacks().map((p) => p.public.slug);

  for (const slug of slugs) {
    if (!isKnownPersonaSlug(slug)) {
      console.error(`Unknown persona: ${slug}`);
      process.exit(1);
    }
  }

  for (const slug of slugs) {
    await embedSlug(slug);
  }

  console.log(
    "\nDone. Commit personas/<slug>/embeddings.json before deploying."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
