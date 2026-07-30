#!/usr/bin/env node
// Ingests public-domain books for ECHOES personas into cleaned, chunked knowledge.
// Each persona should have 2+ primary works for retrieval depth and citation diversity.
//
// No API key required — downloads, cleans, and chunks text only.
// Run:  npm run ingest:persona [slug ...]
//       node scripts/ingest-persona-books.mjs [slug ...]
//
// Output: personas/<slug>/book-chunks-<fileKey>.json
//
// After ingesting (or editing curated sources), rebuild shipped embeddings so
// production does not cold-start re-embed thousands of chunks:
//   npm run embed:persona -- <slug>
//   → personas/<slug>/embeddings.json  (commit before deploy)
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

/** @type {Array<{ slug: string; fileKey: string; identifier: string; url: string; bookPage: string; citation: (ch: string, pg: string) => string; topics: string[]; dateRange: string; runningHeader?: RegExp; gutenberg?: boolean }>} */
const BOOKS = [
  // ── Myron Angel (San Luis Obispo) ─────────────────────────────────────
  {
    slug: "myron-angel",
    fileKey: "angel-1883",
    identifier: "historyofsanluis00ange",
    url: "https://archive.org/download/historyofsanluis00ange/historyofsanluis00ange_djvu.txt",
    bookPage: "https://archive.org/details/historyofsanluis00ange",
    citation: (ch, pg) =>
      `Myron Angel, History of San Luis Obispo County, California (1883), ${ch}${pg}.`,
    topics: ["san luis obispo", "slo county", "1883 history"],
    dateRange: "pre-1883",
    runningHeader: /^HISTORY\s+OF\s+SAN\s+LUIS/i,
  },
  {
    slug: "myron-angel",
    fileKey: "bancroft-california-v5",
    identifier: "historyofcalifor05banc",
    url: "https://archive.org/download/historyofcalifor05banc/historyofcalifor05banc_djvu.txt",
    bookPage: "https://archive.org/details/historyofcalifor05banc",
    citation: (ch, pg) =>
      `Hubert Howe Bancroft, History of California, vol. V (1885–1890), ${ch}${pg}.`,
    topics: ["bancroft california", "state history", "missions", "ranchos"],
    dateRange: "pre-1890",
    runningHeader: /^HISTORY\s+OF\s+CALIFORNIA/i,
  },

  // ── Hubert Howe Bancroft (San Francisco) ──────────────────────────────
  {
    slug: "hubert-howe-bancroft",
    fileKey: "literary-industries",
    identifier: "literaryindustr00bancgoog",
    url: "https://archive.org/download/literaryindustr00bancgoog/literaryindustr00bancgoog_djvu.txt",
    bookPage: "https://archive.org/details/literaryindustr00bancgoog",
    citation: (ch, pg) =>
      `Hubert Howe Bancroft, Literary Industries (San Francisco: The History Company, 1890), ${ch}${pg}.`,
    topics: ["bancroft autobiography", "literary industries", "san francisco history"],
    dateRange: "pre-1890",
    runningHeader: /^LITERARY\s+INDUSTRIES/i,
  },
  {
    slug: "hubert-howe-bancroft",
    fileKey: "history-california-v5",
    identifier: "historyofcalifor05banc",
    url: "https://archive.org/download/historyofcalifor05banc/historyofcalifor05banc_djvu.txt",
    bookPage: "https://archive.org/details/historyofcalifor05banc",
    citation: (ch, pg) =>
      `Hubert Howe Bancroft, History of California, vol. V (1885–1890), ${ch}${pg}.`,
    topics: ["bancroft works", "california history", "gold rush", "san francisco"],
    dateRange: "pre-1890",
    runningHeader: /^HISTORY\s+OF\s+CALIFORNIA/i,
  },

  // ── Alonzo Horton (San Diego) ─────────────────────────────────────────
  {
    slug: "alonzo-horton",
    fileKey: "smythe-san-diego",
    identifier: "historysandiego00smyt",
    url: "https://archive.org/download/historysandiego00smyt/historysandiego00smyt_djvu.txt",
    bookPage: "https://archive.org/details/historysandiego00smyt",
    citation: (ch, pg) =>
      `William E. Smythe, History of San Diego, 1542–1908 (San Diego: The History Company, 1908), ${ch}${pg}.`,
    topics: ["san diego history", "smythe history"],
    dateRange: "pre-1908",
    runningHeader: /^HISTORY\s+OF\s+SAN\s+DIEGO/i,
  },

  // ── John D. Spreckels (Coronado) ──────────────────────────────────────
  {
    slug: "john-d-spreckels",
    fileKey: "smythe-san-diego",
    identifier: "historysandiego00smyt",
    url: "https://archive.org/download/historysandiego00smyt/historysandiego00smyt_djvu.txt",
    bookPage: "https://archive.org/details/historysandiego00smyt",
    citation: (ch, pg) =>
      `William E. Smythe, History of San Diego, 1542–1908 (San Diego: The History Company, 1908), ${ch}${pg}.`,
    topics: ["san diego history", "smythe history", "coronado"],
    dateRange: "pre-1908",
    runningHeader: /^HISTORY\s+OF\s+SAN\s+DIEGO/i,
  },
  {
    slug: "john-d-spreckels",
    fileKey: "black-san-diego-v1",
    identifier: "sandiegocountyca01blac",
    url: "https://archive.org/download/sandiegocountyca01blac/sandiegocountyca01blac_djvu.txt",
    bookPage: "https://archive.org/details/sandiegocountyca01blac",
    citation: (ch, pg) =>
      `Samuel T. Black, San Diego County, California (Chicago: S. J. Clark, 1913), vol. 1, ${ch}${pg}.`,
    topics: ["san diego county", "black history", "coronado"],
    dateRange: "pre-1913",
    runningHeader: /^HISTORY\s+OF\s+SAN\s+DIEGO/i,
  },
  {
    slug: "john-d-spreckels",
    fileKey: "black-san-diego-v2",
    identifier: "sandiegocountyca02blac",
    url: "https://archive.org/download/sandiegocountyca02blac/sandiegocountyca02blac_djvu.txt",
    bookPage: "https://archive.org/details/sandiegocountyca02blac",
    citation: (ch, pg) =>
      `Samuel T. Black, San Diego County, California (Chicago: S. J. Clark, 1913), vol. 2, ${ch}${pg}.`,
    topics: ["san diego county", "black biography", "spreckels"],
    dateRange: "pre-1913",
    runningHeader: /^HISTORY\s+OF\s+SAN\s+DIEGO/i,
  },
  {
    slug: "john-d-spreckels",
    fileKey: "city-san-diego-1922",
    identifier: "citysandiegoand00socigoog",
    url: "https://archive.org/download/citysandiegoand00socigoog/citysandiegoand00socigoog_djvu.txt",
    bookPage: "https://archive.org/details/citysandiegoand00socigoog",
    citation: (ch, pg) =>
      `City of San Diego and San Diego County: The Birthplace of California (1922), ${ch}${pg}.`,
    topics: ["san diego history", "coronado", "spreckels"],
    dateRange: "pre-1922",
    runningHeader: /^(CITY\s+OF\s+SAN\s+DIEGO|SAN\s+DIEGO)/i,
  },
  {
    slug: "alonzo-horton",
    fileKey: "davis-sixty-years",
    identifier: "sixtyyearsincali00davi",
    url: "https://archive.org/download/sixtyyearsincali00davi/sixtyyearsincali00davi_djvu.txt",
    bookPage: "https://archive.org/details/sixtyyearsincali00davi",
    citation: (ch, pg) =>
      `William Heath Davis, Sixty Years in California (1890), ${ch}${pg}.`,
    topics: ["william heath davis", "early san diego", "new town", "old town"],
    dateRange: "pre-1890",
    runningHeader: /^SIXTY\s+YEARS\s+IN\s+CALIFORNIA/i,
  },

  // ── Jesse D. Mason (Santa Barbara) ────────────────────────────────────
  {
    slug: "jesse-d-mason",
    fileKey: "mason-santa-barbara-1883",
    identifier: "historyofsantaba00maso",
    url: "https://archive.org/download/historyofsantaba00maso/historyofsantaba00maso_djvu.txt",
    bookPage: "https://archive.org/details/historyofsantaba00maso",
    citation: (ch, pg) =>
      `Jesse D. Mason, History of Santa Barbara County, California (Oakland: Thompson & West, 1883), ${ch}${pg}.`,
    topics: ["santa barbara history", "1883 history"],
    dateRange: "pre-1883",
    runningHeader: /^HISTORY\s+OF\s+SANTA\s+BARBARA/i,
  },
  {
    slug: "jesse-d-mason",
    fileKey: "mason-amador-1881",
    identifier: "historyofamadorc00maso",
    url: "https://archive.org/download/historyofamadorc00maso/historyofamadorc00maso_djvu.txt",
    bookPage: "https://archive.org/details/historyofamadorc00maso",
    citation: (ch, pg) =>
      `Jesse D. Mason, History of Amador County, California (Oakland: Thompson & West, 1881), ${ch}${pg}.`,
    topics: ["amador history", "mason author", "1881 history"],
    dateRange: "pre-1881",
    runningHeader: /^HISTORY\s+OF\s+AMADOR/i,
  },

  // ── John Muir (Sierra Nevada / Yosemite) ───────────────────────────────
  {
    slug: "john-muir",
    fileKey: "my-first-summer",
    identifier: "gutenberg-32540",
    url: "https://www.gutenberg.org/cache/epub/32540/pg32540.txt",
    bookPage: "https://www.gutenberg.org/ebooks/32540",
    citation: (ch, pg) =>
      `John Muir, My First Summer in the Sierra (1911), ${ch}${pg === "n.p." ? "Project Gutenberg text" : pg}.`,
    topics: [
      "my first summer",
      "sierra nevada",
      "yosemite",
      "john muir",
      "1869",
    ],
    dateRange: "1869-1911",
    gutenberg: true,
  },
  {
    slug: "john-muir",
    fileKey: "mountains-of-california",
    identifier: "gutenberg-10012",
    url: "https://www.gutenberg.org/cache/epub/10012/pg10012.txt",
    bookPage: "https://www.gutenberg.org/ebooks/10012",
    citation: (ch, pg) =>
      `John Muir, The Mountains of California (1894), ${ch}${pg === "n.p." ? "Project Gutenberg text" : pg}.`,
    topics: [
      "mountains of california",
      "sierra nevada",
      "glaciers",
      "sequoia",
      "john muir",
    ],
    dateRange: "1894",
    gutenberg: true,
  },
  {
    slug: "john-muir",
    fileKey: "the-yosemite",
    identifier: "gutenberg-7091",
    url: "https://www.gutenberg.org/cache/epub/7091/pg7091.txt",
    bookPage: "https://www.gutenberg.org/ebooks/7091",
    citation: (ch, pg) =>
      `John Muir, The Yosemite (1912), ${ch}${pg === "n.p." ? "Project Gutenberg text" : pg}.`,
    topics: [
      "the yosemite",
      "yosemite valley",
      "hetch hetchy",
      "waterfalls",
      "john muir",
    ],
    dateRange: "1912",
    gutenberg: true,
  },
  {
    slug: "john-muir",
    fileKey: "our-national-parks",
    identifier: "gutenberg-60929",
    url: "https://www.gutenberg.org/cache/epub/60929/pg60929.txt",
    bookPage: "https://www.gutenberg.org/ebooks/60929",
    citation: (ch, pg) =>
      `John Muir, Our National Parks (1901), ${ch}${pg === "n.p." ? "Project Gutenberg text" : pg}.`,
    topics: [
      "our national parks",
      "yosemite",
      "sequoia",
      "conservation",
      "john muir",
    ],
    dateRange: "1901",
    gutenberg: true,
  },

  // ── August Hemme (Danville / San Ramon Valley) ────────────────────────
  {
    slug: "august-hemme",
    fileKey: "contra-costa-1882",
    identifier: "historyofcontrac00munr",
    url: "https://archive.org/download/historyofcontrac00munr/historyofcontrac00munr_djvu.txt",
    bookPage: "https://archive.org/details/historyofcontrac00munr",
    citation: (ch, pg) =>
      `J. P. Munro-Fraser, History of Contra Costa County, California (San Francisco: W. A. Slocum & Co., 1882), ${ch}${pg}.`,
    topics: ["contra costa history", "san ramon valley", "1882 history"],
    dateRange: "pre-1882",
    runningHeader: /^HISTORY\s+OF\s+CONTRA\s+COSTA/i,
  },
  {
    slug: "august-hemme",
    fileKey: "bay-of-san-francisco-1892",
    identifier: "bayofsanfrancisc002lewi",
    url: "https://archive.org/download/bayofsanfrancisc002lewi/bayofsanfrancisc002lewi_djvu.txt",
    bookPage: "https://archive.org/details/bayofsanfrancisc002lewi",
    citation: (ch, pg) =>
      `The Bay of San Francisco: The Metropolis of the Pacific Coast and Its Suburban Cities (Lewis Publishing, 1892), ${ch}${pg}.`,
    topics: ["east bay", "contra costa", "danville", "alamo", "biographical sketches"],
    dateRange: "pre-1892",
    runningHeader: /^THE\s+BAY\s+OF\s+SAN\s+FRANCISCO/i,
  },

  // ── Anita Loos (Los Angeles / Hollywood) ───────────────────────────────
  {
    slug: "anita-loos",
    fileKey: "breaking-into-the-movies",
    identifier: "gutenberg-56570",
    url: "https://www.gutenberg.org/cache/epub/56570/pg56570.txt",
    bookPage: "https://www.gutenberg.org/ebooks/56570",
    citation: (ch, pg) =>
      `John Emerson & Anita Loos, Breaking Into the Movies (1921), ${ch}${pg === "n.p." ? "Project Gutenberg text" : pg}.`,
    topics: [
      "breaking into the movies",
      "photoplays",
      "scenarios",
      "hollywoodwood",
      "silent film",
      "anita loos",
    ],
    dateRange: "1921",
    gutenberg: true,
  },
  {
    slug: "anita-loos",
    fileKey: "gentlemen-prefer-blondes",
    identifier: "gutenberg-66829",
    url: "https://www.gutenberg.org/files/66829/66829-0.txt",
    bookPage: "https://www.gutenberg.org/ebooks/66829",
    citation: (ch, pg) =>
      `Anita Loos, Gentlemen Prefer Blondes (1925), ${ch}${pg === "n.p." ? "Project Gutenberg text" : pg}.`,
    topics: [
      "gentlemen prefer blondes",
      "lorelei lee",
      "satire",
      "novel",
      "anita loos",
      "1925",
    ],
    dateRange: "1925",
    gutenberg: true,
  },
];

const TARGET_CHARS = 1900;
const MIN_CLOSE_CHARS = 950;
const OVERLAP_CHARS = 320;
const MIN_CHUNK_CHARS = 220;

const CHAPTER_LINE = /^CHAPTER\s+[IVXLCDM0-9]+\.?$/i;
const PAGE_NUM = /^\d{1,3}$/;

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function getRawText(book) {
  const rawPath = path.join("data", "raw", `${book.identifier}.txt`);
  if (await exists(rawPath)) return readFile(rawPath, "utf8");
  console.log(`Downloading ${book.url} ...`);
  const res = await fetch(book.url, {
    headers: { "User-Agent": "ECHOES/1.0 (local history education app)" },
  });
  if (!res.ok) throw new Error(`Download failed for ${book.slug}/${book.fileKey}: ${res.status}`);
  const text = await res.text();
  await mkdir(path.dirname(rawPath), { recursive: true });
  await writeFile(rawPath, text, "utf8");
  return text;
}

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanText(s) {
  return s
    .replace(/(\w)-\s+(\w)/g, "$1$2")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function alphaRatio(s) {
  const letters = (s.match(/[a-zA-Z]/g) || []).length;
  return s.length ? letters / s.length : 0;
}

function gutenbergBody(raw) {
  let body = raw;
  const startMatch = body.match(/\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*/i);
  if (startMatch) {
    body = body.slice(body.indexOf(startMatch[0]) + startMatch[0].length);
  }
  const endIdx = body.search(/\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK/i);
  if (endIdx >= 0) body = body.slice(0, endIdx);
  return body;
}

function buildParagraphs(lines, book) {
  const paras = [];
  let buf = [];
  let page = null;
  let chapter = "";
  let pendingChapter = false;

  const flush = () => {
    if (!buf.length) return;
    const text = cleanText(buf.join(" "));
    buf = [];
    if (text.length < 25) return;
    if (alphaRatio(text) < 0.6 && text.length < 60) return;
    paras.push({ text, page, chapter });
  };

  for (const line of lines) {
    const t = line.trim();
    if (t === "") {
      flush();
      continue;
    }
    if (!book.gutenberg && PAGE_NUM.test(t)) {
      page = parseInt(t, 10);
      flush();
      continue;
    }
    if (book.runningHeader && book.runningHeader.test(t)) continue;
    if (CHAPTER_LINE.test(t)) {
      flush();
      pendingChapter = true;
      chapter = t.replace(/\.$/, "");
      continue;
    }
    if (pendingChapter) {
      if (/^[A-Z][A-Z0-9 .,'’\-—]+$/.test(t) && t.length > 3 && t.length < 90) {
        chapter = titleCase(t.replace(/\.$/, ""));
        pendingChapter = false;
        flush();
        continue;
      }
      pendingChapter = false;
    }
    buf.push(t);
  }
  flush();
  return paras;
}

function splitSentences(text) {
  return text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [text];
}

function splitLongParagraph(p) {
  if (p.text.length <= TARGET_CHARS) return [p];
  const sentences = splitSentences(p.text);
  const out = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + s).length > TARGET_CHARS && cur.length > 0) {
      out.push({ ...p, text: cur.trim() });
      cur = s;
    } else {
      cur += s;
    }
  }
  if (cur.trim()) out.push({ ...p, text: cur.trim() });
  return out;
}

function tail(text, chars) {
  if (text.length <= chars) return text;
  const slice = text.slice(text.length - chars);
  const dot = slice.search(/[.!?]\s/);
  return dot >= 0 ? slice.slice(dot + 2) : slice;
}

function chunkParagraphs(paras) {
  const units = paras.flatMap(splitLongParagraph);
  const chunks = [];
  let cur = "";
  let page = null;
  let chapter = "";

  for (const u of units) {
    if (cur === "") {
      page = u.page;
      chapter = u.chapter;
    }
    const candidate = cur ? `${cur} ${u.text}` : u.text;
    if (candidate.length > TARGET_CHARS && cur.length >= MIN_CLOSE_CHARS) {
      chunks.push({ text: cur.trim(), page, chapter });
      const overlap = tail(cur, OVERLAP_CHARS);
      cur = overlap ? `${overlap} ${u.text}` : u.text;
      page = u.page;
      chapter = u.chapter;
    } else {
      cur = candidate;
    }
  }
  if (cur.trim().length >= MIN_CHUNK_CHARS) {
    chunks.push({ text: cur.trim(), page, chapter });
  }
  return chunks;
}

async function ingest(book) {
  console.log(`\n══ ${book.slug} ← ${book.fileKey} (${book.identifier})`);
  let raw = await getRawText(book);
  if (book.gutenberg) raw = gutenbergBody(raw);
  const lines = raw.split(/\r?\n/);

  const paras = buildParagraphs(lines, book);
  console.log(`  ${paras.length} cleaned paragraphs`);

  const rawChunks = chunkParagraphs(paras).filter(
    (c) => c.text.length >= MIN_CHUNK_CHARS
  );

  const prefix = book.fileKey.replace(/[^a-z0-9]+/gi, "-");
  const chunks = rawChunks.map((c, i) => {
    const pageRef = c.page ? `p. ${c.page}` : "n.p.";
    const chapterRef = c.chapter ? `"${c.chapter}" chapter, ` : "";
    return {
      id: `${prefix}-${String(i + 1).padStart(4, "0")}`,
      text: c.text,
      topics: book.topics.concat(c.chapter ? [c.chapter.toLowerCase()] : []),
      dateRange: book.dateRange,
      sourceType: "primary",
      citation: book.citation(chapterRef, pageRef),
      url: c.page && !book.gutenberg ? `${book.bookPage}/page/${c.page}` : book.bookPage,
      reliability: "medium",
      page: c.page ?? null,
      chapter: c.chapter || null,
    };
  });

  const outPath = path.join(
    "personas",
    book.slug,
    `book-chunks-${book.fileKey}.json`
  );
  await writeFile(outPath, JSON.stringify(chunks, null, 2), "utf8");
  const avg = Math.round(
    chunks.reduce((s, c) => s + c.text.length, 0) / Math.max(chunks.length, 1)
  );
  console.log(`  wrote ${chunks.length} chunks (avg ${avg} chars) → ${outPath}`);
}

async function main() {
  const only = process.argv.slice(2);
  const targets = BOOKS.filter((b) => only.length === 0 || only.includes(b.slug));
  for (const book of targets) {
    await ingest(book);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
