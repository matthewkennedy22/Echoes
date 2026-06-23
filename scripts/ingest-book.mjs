// Ingests the public-domain OCR text of Myron Angel's 1883
// "History of San Luis Obispo County, California" into clean, chunked,
// page-tagged knowledge for the RAG source pack.
//
// No API key required — this only downloads, cleans, and chunks text.
// Run with:  npm run ingest
//
// Output: personas/myron-angel/book-chunks.json

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const IDENTIFIER = "historyofsanluis00ange";
const SOURCE_URL = `https://archive.org/download/${IDENTIFIER}/${IDENTIFIER}_djvu.txt`;
const BOOK_PAGE = `https://archive.org/details/${IDENTIFIER}`;
const RAW_PATH = path.join("data", "raw", `${IDENTIFIER}.txt`);
const OUT_PATH = path.join("personas", "myron-angel", "book-chunks.json");

const TARGET_CHARS = 1900; // ~480 tokens
const MIN_CLOSE_CHARS = 950;
const OVERLAP_CHARS = 320;
const MIN_CHUNK_CHARS = 220;

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function getRawText() {
  if (await exists(RAW_PATH)) {
    return readFile(RAW_PATH, "utf8");
  }
  console.log(`Downloading ${SOURCE_URL} ...`);
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const text = await res.text();
  await mkdir(path.dirname(RAW_PATH), { recursive: true });
  await writeFile(RAW_PATH, text, "utf8");
  return text;
}

const RUNNING_HEADER = /^HISTORY\s+OF\s+SAN\s+LUIS\s+OBISPO\s+COUNTY/i;
const CHAPTER_LINE = /^CHAPTER\s+[IVXLCDM]+\.?$/i;
const PAGE_NUM = /^\d{1,3}$/;

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanText(s) {
  return s
    .replace(/(\w)-\s+(\w)/g, "$1$2") // rejoin words split across lines
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function alphaRatio(s) {
  const letters = (s.match(/[a-zA-Z]/g) || []).length;
  return s.length ? letters / s.length : 0;
}

function findBodyStart(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (RUNNING_HEADER.test(lines[i].trim())) {
      for (let j = i; j < Math.min(i + 8, lines.length); j++) {
        if (/^CHAPTER\s+I\.?$/i.test(lines[j].trim())) return i;
      }
    }
  }
  return 0;
}

function buildParagraphs(lines, bodyStart) {
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

  for (let i = bodyStart; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === "") {
      flush();
      continue;
    }
    if (PAGE_NUM.test(t)) {
      page = parseInt(t, 10);
      flush();
      continue;
    }
    if (RUNNING_HEADER.test(t)) continue;
    if (CHAPTER_LINE.test(t)) {
      flush();
      pendingChapter = true;
      continue;
    }
    if (pendingChapter) {
      // The next non-empty line after "CHAPTER X." is the chapter title.
      if (/^[A-Z][A-Z0-9 .,'’\-—]+$/.test(t) && t.length > 3) {
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

async function main() {
  const raw = await getRawText();
  const lines = raw.split(/\r?\n/);
  const bodyStart = findBodyStart(lines);
  console.log(`Body starts at line ${bodyStart} of ${lines.length}.`);

  const paras = buildParagraphs(lines, bodyStart);
  console.log(`Extracted ${paras.length} cleaned paragraphs.`);

  const rawChunks = chunkParagraphs(paras).filter(
    (c) => c.text.length >= MIN_CHUNK_CHARS
  );

  const chunks = rawChunks.map((c, i) => {
    const pageRef = c.page ? `p. ${c.page}` : "n.p.";
    const chapterRef = c.chapter ? `“${c.chapter}” chapter, ` : "";
    return {
      id: `book-${String(i + 1).padStart(4, "0")}`,
      text: c.text,
      topics: ["san luis obispo history", "1883 history"].concat(
        c.chapter ? [c.chapter.toLowerCase()] : []
      ),
      dateRange: "pre-1883",
      sourceType: "primary",
      citation: `Myron Angel, History of San Luis Obispo County, California (1883), ${chapterRef}${pageRef}.`,
      url: c.page ? `${BOOK_PAGE}/page/${c.page}` : BOOK_PAGE,
      reliability: "medium",
      page: c.page ?? null,
      chapter: c.chapter || null,
    };
  });

  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(chunks, null, 2), "utf8");

  const avg = Math.round(
    chunks.reduce((s, c) => s + c.text.length, 0) / Math.max(chunks.length, 1)
  );
  console.log(`Wrote ${chunks.length} chunks to ${OUT_PATH} (avg ${avg} chars).`);
  console.log("Sample chunk:");
  console.log(JSON.stringify(chunks[Math.floor(chunks.length / 2)], null, 2).slice(0, 700));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
