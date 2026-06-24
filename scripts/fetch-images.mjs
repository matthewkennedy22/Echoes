#!/usr/bin/env node
/**
 * Download verified public-domain images into public/images/myron-angel/.
 *
 * Prefer Wikimedia Commons (upload.wikimedia.org) — same files used on Wikipedia.
 * CHS photos not mirrored on Commons fall back to USC Digital Library thumbnails.
 *
 * Usage: npm run fetch-images
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "images", "myron-angel");

/** Wikimedia Commons — primary source (Wikipedia gallery files). */
const WIKIMEDIA = {
  "choris-tule-canoe-1822.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/4/49/Choris_1822_gri_33125010887327_0174.jpg",
  "choris-california-people-1822.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/b/ba/Choris_1822_gri_33125010887327_0166.jpg",
  "choris-cholovones-hunting-1822.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/Choris_1822_gri_33125010887327_0190.jpg",
  "chumash-painted-cave.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/3/32/PaintedCaveArtCA.jpg",
  "chumash-pictograph-oakbrook.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/9/95/Oakbrook_regional_park_chumash_indian_museum_thousand_oaks_cave_paintings_pictographs.jpg",
  "chumash-mortars-exhibit.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/9/9d/Chumash_indian_museum_mortars_pestles.jpg",
  "chumash-ap-replica.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/4/40/Chumash_indian_museum_thousand_oaks.jpg",
  "chumash-musicians-1873.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/f/f6/Chmash_musicians_1873.jpg",
  "chumash-tomol-kihn.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/6/65/Chumash_Canoes.jpg",
  "chumash-tomol-elyewun-2006.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Chumash_Tomol_%27Elye%27wun_paddlers%2C_CINMS.jpg/1280px-Chumash_Tomol_%27Elye%27wun_paddlers%2C_CINMS.jpg",
  "chumash-tomol-crossing-2015.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/4/49/CINMS_-_Tomol_Crossing_Sunrise_.jpg",
  "ah-louis-store.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/3/37/Ah_Louis_Store.jpg",
  "chinese-railroad-laborers.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Chinese_Railroad_Laborers.jpg",
  "gold-rush-mining-1883.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Henry_Sandham_-_The_Cradle.jpg/1280px-Henry_Sandham_-_The_Cradle.jpg",
  "california-vaqueros-1854.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/9/9c/California_Vaqueros%2C_1854.jpg",
  "rancho-fandango-1873.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/6/63/The_Fandango.JPG",
  "mission-1883.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/c/cf/History_of_San_Luis_Obispo_County%2C_California%3B_with_illustrations_and_biographical_sketches_of_its_prominent_men_and_pioneers_%281883%29_%2814594368737%29.jpg",
  "mission-1900.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mission_San_Luis_Obispo_De_Tolosa%2C_California_%28NYPL_b12647398-74244%29.tiff/1280px-Mission_San_Luis_Obispo_De_Tolosa%2C_California_%28NYPL_b12647398-74244%29.tiff.jpg",
  "slo-late-1800s.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/e/e6/San_Luis_Obispo_%28late_19th_century%29.jpg",
  "slo-deakin-1899.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/2/2f/San_Luis_Obispo_%28Edwin_Deakin%2C_1899%29.jpg",
};

/** USC CHS thumbnails — only when no Commons mirror exists. */
const USC_CHS = {
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

const DOWNLOADS = { ...WIKIMEDIA, ...USC_CHS };

function download(name, url) {
  const dest = path.join(OUT_DIR, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 512) {
    console.log(`· ${name} (already present)`);
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          rejectUnauthorized: false,
          headers: {
            "User-Agent": "EchoesImageFetcher/1.0 (local dev; echoes historical app)",
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} from ${url}`));
            res.resume();
            return;
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const buf = Buffer.concat(chunks);
            if (buf.length <= 512) {
              reject(new Error(`file too small (${buf.length} bytes)`));
              return;
            }
            fs.writeFileSync(dest, buf);
            console.log(`✓ ${name} (${Math.round(buf.length / 1024)} KB)`);
            resolve();
          });
        }
      )
      .on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    await sleep(400);
  }
  console.log(`\nDone: ${ok} downloaded, ${fail} failed.`);
  console.log(`  Wikimedia: ${Object.keys(WIKIMEDIA).length}, USC CHS fallback: ${Object.keys(USC_CHS).length}`);
  console.log(`Images live in ${OUT_DIR}`);
  if (fail > 0) process.exit(1);
}

main();
