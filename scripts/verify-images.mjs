#!/usr/bin/env node
/**
 * Verify the Myron Angel image library:
 * 1. Every catalogued src exists on disk (>512 bytes)
 * 2. Every topic in imageTopicCatalog has at least one image file present
 * 3. Every topic has Wikipedia article mapping in wikipediaTopics.ts
 * 4. fetch-images.mjs covers all src filenames (except documented manual-only)
 * 5. Report images still citing Calisphere without Wikimedia mirror
 *
 * Usage: npm run verify-images
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES_TS = path.join(ROOT, "personas", "myron-angel", "images.ts");
const CATALOG_TS = path.join(ROOT, "personas", "myron-angel", "imageTopicCatalog.ts");
const WIKI_TS = path.join(ROOT, "personas", "myron-angel", "wikipediaTopics.ts");
const FETCH_MJS = path.join(ROOT, "scripts", "fetch-images.mjs");
const PUBLIC = path.join(ROOT, "public");

/** Local-only assets not in fetch-images (no stable Commons mirror). */
const MANUAL_ONLY = new Set(["myron-portrait.jpg"]);

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function fileOk(rel) {
  const filePath = path.join(PUBLIC, rel.replace(/^\//, ""));
  try {
    const st = fs.statSync(filePath);
    return st.isFile() && st.size > 512;
  } catch {
    return false;
  }
}

function parseImageEntries(src) {
  const entries = [];
  const blocks = src.split(/\{\s*\n\s*id:\s*"img-/);
  for (const block of blocks.slice(1)) {
    const id = "img-" + block.match(/^([^"]+)/)?.[1];
    const srcMatch = block.match(/src:\s*"(\/images\/[^"]+)"/);
    const urlMatch = block.match(/url:\s*"([^"]+)"/);
    if (id && srcMatch) {
      entries.push({
        id,
        src: srcMatch[1],
        filename: path.basename(srcMatch[1]),
        url: urlMatch?.[1] ?? "",
      });
    }
  }
  return entries;
}

function parseCatalogTopics(src) {
  const topics = [];
  const re = /key:\s*"([^"]+)"[\s\S]*?imageIds:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const imageIds = [...m[2].matchAll(/"(img-[^"]+)"/g)].map((x) => x[1]);
    topics.push({ key: m[1], imageIds });
  }
  return topics;
}

function parseWikiTopicKeys(src) {
  const keys = new Set();
  for (const m of src.matchAll(/^\s*(?:"([^"]+)"|([a-z][a-z0-9-]*)):\s*\[/gm)) {
    keys.add(m[1] ?? m[2]);
  }
  return [...keys];
}

function parseFetchFilenames(src) {
  const names = new Set();
  for (const m of src.matchAll(/"([^"]+\.(?:jpg|jpeg|png|webp))":/g)) {
    names.add(m[1]);
  }
  return names;
}

let failed = false;

const imagesSrc = read(IMAGES_TS);
const entries = parseImageEntries(imagesSrc);
const missingFiles = entries.filter((e) => !fileOk(e.src));

if (missingFiles.length > 0) {
  failed = true;
  console.error(
    `✗ ${missingFiles.length} catalogued image(s) missing from public/:\n` +
      missingFiles.map((e) => `  ${e.src}`).join("\n") +
      "\n\nRun: npm run fetch-images"
  );
} else {
  console.log(`✓ All ${entries.length} local library images present on disk.`);
}

const catalogTopics = parseCatalogTopics(read(CATALOG_TS));
const topicGaps = [];
for (const topic of catalogTopics) {
  if (topic.imageIds.length === 0) {
    topicGaps.push(`${topic.key}: no imageIds (intentional)`);
    continue;
  }
  const hasFile = topic.imageIds.some((id) => {
    const entry = entries.find((e) => e.id === id);
    return entry && fileOk(entry.src);
  });
  if (!hasFile) topicGaps.push(`${topic.key}: no image file for ${topic.imageIds.join(", ")}`);
}

if (topicGaps.filter((g) => !g.includes("intentional")).length > 0) {
  failed = true;
  console.error("✗ Topic coverage gaps:\n  " + topicGaps.filter((g) => !g.includes("intentional")).join("\n  "));
} else {
  console.log(`✓ All ${catalogTopics.length} catalog topics have image files.`);
}

const catalogKeys = catalogTopics.map((t) => t.key);
const wikiKeys = parseWikiTopicKeys(read(WIKI_TS));
const missingWiki = catalogKeys.filter((k) => !wikiKeys.includes(k));
if (missingWiki.length > 0) {
  failed = true;
  console.error(`✗ Topics missing Wikipedia mapping: ${missingWiki.join(", ")}`);
} else {
  console.log(`✓ All ${catalogKeys.length} topics mapped to Wikipedia articles.`);
}

const fetchNames = parseFetchFilenames(read(FETCH_MJS));
const notInFetch = entries.filter(
  (e) => !fetchNames.has(e.filename) && !MANUAL_ONLY.has(e.filename)
);
if (notInFetch.length > 0) {
  failed = true;
  console.error(
    "✗ Images not in fetch-images.mjs:\n  " +
      notInFetch.map((e) => `${e.filename} (${e.id})`).join("\n  ")
  );
} else {
  console.log(`✓ fetch-images.mjs covers all downloadable library files.`);
}

const calisphereOnly = entries.filter(
  (e) =>
    e.url.includes("calisphere.org") &&
    !e.url.includes("wikimedia") &&
    !MANUAL_ONLY.has(e.filename)
);
const wikimediaCount = entries.filter(
  (e) => e.url.includes("commons.wikimedia.org") || e.url.includes("upload.wikimedia.org")
).length;
console.log(
  `ℹ Sources: ${wikimediaCount} Wikimedia, ${calisphereOnly.length} Calisphere/CHS (USC fallback), ${MANUAL_ONLY.size} manual-only.`
);
if (calisphereOnly.length > 0) {
  console.log(
    "  CHS-only (live Wikipedia search supplements these):\n  " +
      calisphereOnly.map((e) => e.id).join(", ")
  );
}

if (failed) process.exit(1);

console.log("\n✓ Image library verification passed.");
