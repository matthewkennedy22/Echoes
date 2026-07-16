#!/usr/bin/env node
/**
 * Static audit of persona image topic catalogs — finds mismatch risks
 * like generic buzzwords shared across topics or weak image topics.
 *
 * Usage: node scripts/audit-image-topics.mjs [--json]
 */

import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");
const PERSONAS_DIR = join(ROOT, "personas");

/** Buzzwords that must not appear alone — they cause cross-topic steals. */
const RISKY_GENERIC = new Set([
  "town",
  "city",
  "street",
  "sign",
  "lot",
  "hotel",
  "house",
  "home",
  "dwelling",
  "church",
  "people",
  "music",
  "native",
  "indigenous",
  "ranch",
  "look like",
  "downtown",
  "plaza",
  "bay",
  "view",
  "settlement",
  "star",
  "partner",
  "davis",
]);

const SLUGS = readdirSync(PERSONAS_DIR).filter((d) => {
  try {
    return readdirSync(join(PERSONAS_DIR, d)).includes("imageTopicCatalog.ts");
  } catch {
    return false;
  }
});

function extractTopics(ts) {
  const topics = [];
  const blocks = ts.split(/\{\s*key:\s*"/);
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const key = block.match(/^([^"]+)"/)?.[1];
    const label = block.match(/label:\s*"([^"]+)"/)?.[1];
    const buzzMatch = block.match(/buzzwords:\s*\[([\s\S]*?)\]/);
    const idsMatch = block.match(/imageIds:\s*\[([\s\S]*?)\]/);
    if (!key) continue;
    const buzzwords = buzzMatch
      ? [...buzzMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1].toLowerCase())
      : [];
    const imageIds = idsMatch
      ? [...idsMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      : [];
    topics.push({ key, label, buzzwords, imageIds });
  }
  return topics;
}

function extractImages(ts) {
  const images = [];
  const blocks = ts.split(/\{\s*id:\s*"/);
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const id = block.match(/^([^"]+)"/)?.[1];
    const topicsMatch = block.match(/topics:\s*\[([\s\S]*?)\]/);
    const caption = block.match(/caption:\s*\n?\s*"([^"]{0,80})/)?.[1];
    if (!id) continue;
    const topics = topicsMatch
      ? [...topicsMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1].toLowerCase())
      : [];
    images.push({ id, topics, caption });
  }
  return images;
}

function auditPersona(slug) {
  const dir = join(PERSONAS_DIR, slug);
  const catalogTs = readFileSync(join(dir, "imageTopicCatalog.ts"), "utf8");
  const imagesTs = readFileSync(join(dir, "images.ts"), "utf8");
  const topics = extractTopics(catalogTs);
  const images = extractImages(imagesTs);
  const imageById = new Map(images.map((img) => [img.id, img]));

  const riskyBuzzwords = [];
  const crossCollisions = [];
  const weakImageTopics = [];
  const orphanImages = [];
  const emptyTopics = [];

  const buzzToTopics = new Map();
  for (const topic of topics) {
    if (topic.imageIds.length === 0) emptyTopics.push(topic.key);
    for (const w of topic.buzzwords) {
      if (RISKY_GENERIC.has(w)) {
        riskyBuzzwords.push({ topic: topic.key, buzzword: w });
      }
      if (!buzzToTopics.has(w)) buzzToTopics.set(w, []);
      buzzToTopics.get(w).push(topic.key);
    }
  }

  for (const [w, keys] of buzzToTopics) {
    if (keys.length > 1 && RISKY_GENERIC.has(w)) {
      crossCollisions.push({ buzzword: w, topics: [...new Set(keys)] });
    }
  }

  for (const img of images) {
    const weak = img.topics.filter((t) => RISKY_GENERIC.has(t));
    if (weak.length > 0) {
      weakImageTopics.push({ id: img.id, weakTopics: weak });
    }
    const referenced = topics.some((t) => t.imageIds.includes(img.id));
    if (!referenced) orphanImages.push(img.id);
  }

  return {
    slug,
    topicCount: topics.length,
    imageCount: images.length,
    topics: topics.map((t) => ({
      key: t.key,
      label: t.label,
      imageIds: t.imageIds,
      buzzwordCount: t.buzzwords.length,
    })),
    riskyBuzzwords,
    crossCollisions,
    weakImageTopics,
    orphanImages,
    emptyTopics,
    images: images.map((i) => ({ id: i.id, caption: i.caption })),
  };
}

function main() {
  const jsonOut = process.argv.includes("--json");
  const reports = SLUGS.map(auditPersona);

  if (jsonOut) {
    console.log(JSON.stringify(reports, null, 2));
    return;
  }

  console.log("\nECHOES image topic audit\n");
  let totalRisky = 0;
  let totalCollisions = 0;
  let totalWeak = 0;

  for (const r of reports) {
    totalRisky += r.riskyBuzzwords.length;
    totalCollisions += r.crossCollisions.length;
    totalWeak += r.weakImageTopics.length;

    console.log(`════ ${r.slug} (${r.topicCount} topics, ${r.imageCount} images) ════`);

    if (r.crossCollisions.length) {
      console.log("  CROSS-TOPIC collisions (risky buzzword shared):");
      for (const c of r.crossCollisions) {
        console.log(`    • "${c.buzzword}" → ${c.topics.join(", ")}`);
      }
    }

    if (r.riskyBuzzwords.length) {
      console.log("  Risky buzzwords in topics:");
      const byTopic = new Map();
      for (const { topic, buzzword } of r.riskyBuzzwords) {
        if (!byTopic.has(topic)) byTopic.set(topic, []);
        byTopic.get(topic).push(buzzword);
      }
      for (const [topic, words] of byTopic) {
        console.log(`    • ${topic}: ${words.join(", ")}`);
      }
    }

    if (r.weakImageTopics.length) {
      console.log("  Weak image topics[] (generic tokens):");
      for (const w of r.weakImageTopics) {
        console.log(`    • ${w.id}: ${w.weakTopics.join(", ")}`);
      }
    }

    if (r.emptyTopics.length) {
      console.log(`  Topics with no images: ${r.emptyTopics.join(", ")}`);
    }

    if (r.orphanImages.length) {
      console.log(`  Images not in any topic: ${r.orphanImages.join(", ")}`);
    }

    if (
      !r.crossCollisions.length &&
      !r.riskyBuzzwords.length &&
      !r.weakImageTopics.length
    ) {
      console.log("  ✓ No risky generic buzzword issues detected");
    }
    console.log("");
  }

  console.log("──────────────────────────────────────────");
  console.log(
    `TOTAL: ${totalRisky} risky buzzwords, ${totalCollisions} cross-collisions, ${totalWeak} weak image topic entries`
  );
  console.log(`Personas audited: ${SLUGS.join(", ")}\n`);

  process.exit(totalCollisions > 0 ? 1 : 0);
}

main();
