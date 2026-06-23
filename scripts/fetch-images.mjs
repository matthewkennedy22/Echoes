#!/usr/bin/env node
/**
 * Download verified public-domain images into public/images/myron-angel/.
 * Sources: USC Digital Library (California Historical Society) thumbnail URLs.
 *
 * Usage: npm run fetch-images
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "images", "myron-angel");

/** filename -> USC CHS thumbnail URL (HTTPS) */
const DOWNLOADS = {
  "slo-street-1905.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-8333.jpg",
  "slo-view-1900.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-7739.jpg",
  "morro-rock-1900.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-8340.jpg",
  "avila-beach-1905.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-8344.jpg",
  "port-harford-1905.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-8346.jpg",
  "slo-creek-1905.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-8348.jpg",
  "cal-poly-1900.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-7511.jpg",
  "rancho-roundup.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-8350.jpg",
  "courthouse-1900.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-45401.jpg",
  "monterey-street-1900.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-45410.jpg",
  "adobe-rancho-1900.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-12430.jpg",
  "railroad-slo-1906.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-7510.jpg",
  "mission-south-1888.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-94.jpg",
  "mission-front-1880.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-971.jpg",
  "mission-arcade-1870.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-2962.jpg",
  "mission-exterior.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-46670.jpg",
  "mission-view-south-1904.jpg": "https://thumbnails.digitallibrary.usc.edu/CHS-1820.jpg",
};

async function download(name, url) {
  const dest = path.join(OUT_DIR, name);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${name}: HTTP ${res.status} from ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`✓ ${name} (${Math.round(buf.length / 1024)} KB)`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  let fail = 0;
  for (const [name, url] of Object.entries(DOWNLOADS)) {
    try {
      await download(name, url);
      ok++;
    } catch (err) {
      console.error(`✗ ${name}: ${err.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} downloaded, ${fail} failed.`);
  console.log(`Images live in ${OUT_DIR}`);
  if (fail > 0) process.exit(1);
}

main();
