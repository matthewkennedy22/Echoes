#!/usr/bin/env node
/**
 * Ensure every local image in personas/myron-angel/images.ts exists on disk.
 * Runs before production builds so Vercel never ships broken image refs.
 *
 * Usage: npm run verify-images
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES_TS = path.join(ROOT, "personas", "myron-angel", "images.ts");
const PUBLIC = path.join(ROOT, "public");

const src = fs.readFileSync(IMAGES_TS, "utf8");
const localSrcs = [...src.matchAll(/src:\s*"(\/images\/[^"]+)"/g)].map((m) => m[1]);

const missing = [];
for (const rel of localSrcs) {
  const filePath = path.join(PUBLIC, rel.replace(/^\//, ""));
  let ok = false;
  try {
    const st = fs.statSync(filePath);
    ok = st.isFile() && st.size > 512;
  } catch {
    ok = false;
  }
  if (!ok) missing.push(rel);
}

if (missing.length > 0) {
  console.error(
    `✗ ${missing.length} catalogued image(s) missing from public/:\n` +
      missing.map((m) => `  ${m}`).join("\n") +
      "\n\nRun: npm run fetch-images"
  );
  process.exit(1);
}

console.log(`✓ All ${localSrcs.length} local library images present.`);
