/**
 * Create Gmail drafts from outreach/Lead_List.csv (review in Gmail, then Send).
 *
 * Setup: see scripts/gmail-drafts/README.md
 *
 * Usage:
 *   node scripts/gmail-drafts/create-drafts.mjs --dry-run --priority A --limit 5
 *   node scripts/gmail-drafts/create-drafts.mjs --priority A --limit 10
 *   node scripts/gmail-drafts/create-drafts.mjs --ids 1,7,9,13
 *   node scripts/gmail-drafts/create-drafts.mjs --priority A --limit 5 --attach
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { google } from "googleapis";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SECRETS_DIR = path.join(ROOT, "outreach/.gmail-secrets");
const CREDENTIALS_PATH = path.join(SECRETS_DIR, "credentials.json");
const TOKEN_PATH = path.join(SECRETS_DIR, "token.json");
const LEADS_PATH = path.join(ROOT, "outreach/Lead_List.csv");
const PAMPHLET_PATH = path.join(ROOT, "outreach/ECHOES Beta Pamphlet.pdf");

const SCOPES = ["https://www.googleapis.com/auth/gmail.compose"];
const DEMO_URL = "https://echoes-inky-zeta.vercel.app/";
const FROM_NAME = "Matthew Kennedy";
const FROM_EMAIL = "matthewkennedy22@gmail.com";

function parseArgs(argv) {
  const args = {
    dryRun: false,
    priority: null,
    limit: Infinity,
    ids: null,
    attach: false,
    template: "a", // a | b | c
    verifiedOnly: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--attach") args.attach = true;
    else if (a === "--verified-only") args.verifiedOnly = true;
    else if (a === "--priority") args.priority = String(argv[++i] || "").toUpperCase();
    else if (a === "--limit") args.limit = Number(argv[++i] || 0);
    else if (a === "--ids") args.ids = new Set(String(argv[++i] || "").split(",").map((s) => s.trim()).filter(Boolean));
    else if (a === "--template") args.template = String(argv[++i] || "a").toLowerCase();
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function printHelp() {
  console.log(`Create Gmail drafts from Lead_List.csv (you review & Send in Gmail).

Options:
  --dry-run          Print drafts only; do not call Gmail
  --priority A|B|C   Filter by priority
  --limit N          Max drafts to create
  --ids 1,7,9        Only these lead ids
  --template a|b|c   Email template (default: a)
  --attach           Attach outreach/ECHOES Beta Pamphlet.pdf
  --verified-only    Only rows with email_confidence=Verified
  --help             Show this help

First-time setup: scripts/gmail-drafts/README.md
`);
}

function parseCsv(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return row;
  });
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function extractEmail(raw) {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (
    lower.includes("contact form") ||
    lower.includes("find on site") ||
    lower.includes("phone/site") ||
    lower.includes("school sites") ||
    lower === "—" ||
    lower === "-"
  ) {
    return null;
  }
  const match = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : null;
}

function orgShortName(org) {
  return String(org || "")
    .replace(/\s*\/\s*.*$/, "")
    .replace(/\s*\(.*\)\s*$/, "")
    .trim();
}

function subjectFor(org) {
  return `Free beta for ${orgShortName(org)}: source-grounded history conversations`;
}

function hookSentence(row) {
  const hook = (row.persona_hook || "").trim();
  const city = (row.city_region || "").trim();
  if (hook) {
    return `of your work on ${hook.split("/")[0].trim()} and local history in ${city || "your region"}`;
  }
  return `you steward local history in ${city || "your community"}`;
}

function bodyTemplateA(row, greeting) {
  const org = orgShortName(row.organization);
  const hook = hookSentence(row);
  return `Dear ${greeting},

I'm Matthew Kennedy, a Cal Poly MSBA alumnus and San Luis Obispo resident. I'm building ECHOES, a source-grounded way for people to converse with figures from California history. Answers come from curated public-domain sources and primary texts, with evidence labels and citations. When the record is incomplete, the figure says so.

The live beta (California Speaks) already includes seven figures from Tahoe to San Diego. You can try it here:

${DEMO_URL}

Works on any phone or computer. No app, no account. (The first question for a figure may take 30-60 seconds while sources load; after that it's much faster.)

I'm reaching out to ${org} because ${hook}. During the beta, access is free for your organization and visitors. I can also build a custom figure for your town, region, or exhibit as a collaborative pilot, using sources you recommend.

I've attached a short overview. No commitment needed. I'd simply value your expert read on whether this is accurate, useful, and worth developing with the people who keep these stories alive.

If it's interesting, I'm happy to meet for 15 minutes (in person, phone, or video) at a time that works for you.

Thank you for the work you do.

Warm regards,
Matthew Kennedy
ECHOES - Local history, made conversational
matthewkennedy22@gmail.com · (925) 285-2090`;
}

function bodyTemplateB(row, greeting) {
  const city = (row.city_region || "your region").trim();
  return `Dear ${greeting},

I'm Matthew Kennedy. I've built ECHOES, a source-grounded conversation platform for California history (evidence labels + citations, not open-internet invention).

Try the free beta: ${DEMO_URL}

I'm looking for museum / society / archive / education partners. Happy to offer free visitor access and, if useful, a custom figure for ${city} as a beta pilot.

Overview attached. 15-minute demo anytime.

Matthew Kennedy
matthewkennedy22@gmail.com · (925) 285-2090`;
}

function bodyTemplateC(row, greeting) {
  const org = orgShortName(row.organization);
  return `Dear ${greeting},

I'm a longtime San Luis Obispo resident building ECHOES: source-grounded conversations with California history figures. One of the live figures is Myron Angel (SLO County historian / Cal Poly founding story), alongside others from Tahoe to San Diego.

${DEMO_URL}

I'd love ${org}'s expert eye on accuracy and visitor usefulness. Beta access is free. If helpful, I can also build a custom figure for your town or exhibit with sources you recommend.

Short overview attached. Happy to do a 15-minute demo whenever convenient.

Thank you,
Matthew Kennedy · matthewkennedy22@gmail.com · (925) 285-2090`;
}

function buildBody(template, row) {
  const greeting = "colleagues"; // safer than guessing a name
  if (template === "b") return bodyTemplateB(row, greeting);
  if (template === "c") return bodyTemplateC(row, greeting);
  return bodyTemplateA(row, greeting);
}

function encodeSubject(subject) {
  // RFC 2047 for non-ascii; keep simple for ASCII subjects
  if (/^[\x20-\x7E]+$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function buildMime({ to, subject, bodyText, attachmentPath }) {
  const boundary = `echoes_${Date.now().toString(36)}`;
  const headers = [
    `To: ${to}`,
    `From: ${FROM_NAME} <${FROM_EMAIL}>`,
    `Subject: ${encodeSubject(subject)}`,
    "MIME-Version: 1.0",
  ];

  if (!attachmentPath) {
    headers.push('Content-Type: text/plain; charset="UTF-8"');
    return `${headers.join("\r\n")}\r\n\r\n${bodyText}`;
  }

  const filename = path.basename(attachmentPath);
  const fileB64 = fs.readFileSync(attachmentPath).toString("base64").replace(/(.{76})/g, "$1\r\n");
  headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);

  return [
    headers.join("\r\n"),
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    bodyText,
    "",
    `--${boundary}`,
    `Content-Type: application/pdf; name="${filename}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${filename}"`,
    "",
    fileB64,
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

function toBase64Url(str) {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => rl.question(question, resolve));
  rl.close();
  return String(answer || "").trim();
}

function waitForLocalCode(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
        const code = url.searchParams.get("code");
        const err = url.searchParams.get("error");
        if (err) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`<h1>Auth failed</h1><p>${err}</p><p>You can close this tab.</p>`);
          server.close();
          reject(new Error(`OAuth error: ${err}`));
          return;
        }
        if (!code) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Missing code");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>ECHOES authorized</h1><p>You can close this tab and return to the terminal.</p>");
        server.close();
        resolve(code);
      } catch (e) {
        server.close();
        reject(e);
      }
    });
    server.on("error", reject);
    server.listen(port, "127.0.0.1");
  });
}

async function authorize() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      `Missing ${CREDENTIALS_PATH}\nFollow scripts/gmail-drafts/README.md to download OAuth credentials.`
    );
  }
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id } =
    credentials.installed || credentials.web || {};
  if (!client_id || !client_secret) {
    throw new Error("credentials.json must be a Desktop OAuth client (installed) JSON from Google Cloud.");
  }

  // Desktop clients allow loopback on any port; we listen so Chrome doesn't show "refused".
  const port = 42813;
  const redirectUri = `http://127.0.0.1:${port}`;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    redirect_uri: redirectUri,
  });

  console.log("\nAuthorize this app by visiting:\n");
  console.log(authUrl);
  console.log(`\nWaiting for Google redirect on ${redirectUri} ...`);
  console.log("If the browser still fails, look at the address bar for ?code=... and paste it below.\n");

  const codePromise = waitForLocalCode(port);
  const pastePromise = prompt("Or paste the code here (then Enter): ");

  const code = await Promise.race([
    codePromise,
    pastePromise.then((c) => {
      if (!c) return new Promise(() => {}); // keep waiting for local server
      return c;
    }),
  ]);

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.mkdirSync(SECRETS_DIR, { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log(`Saved token to ${TOKEN_PATH}`);
  return oAuth2Client;
}

function selectLeads(rows, args) {
  return rows
    .filter((row) => {
      if (args.ids && !args.ids.has(String(row.id))) return false;
      if (args.priority && String(row.priority || "").toUpperCase() !== args.priority) return false;
      if (args.verifiedOnly && String(row.email_confidence || "") !== "Verified") return false;
      const email = extractEmail(row.best_email);
      if (!email) return false;
      const status = String(row.status || "").toLowerCase();
      if (status.includes("draft") || status.includes("emailed") || status === "yes" || status === "no") {
        return false;
      }
      return true;
    })
    .slice(0, Number.isFinite(args.limit) ? args.limit : undefined);
}

function updateLeadStatuses(ids, newStatus) {
  const text = fs.readFileSync(LEADS_PATH, "utf8");
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const headers = splitCsvLine(lines[0]);
  const idIdx = headers.indexOf("id");
  const statusIdx = headers.indexOf("status");
  const dateIdx = headers.indexOf("date_contacted");
  if (idIdx < 0 || statusIdx < 0) return;

  const idSet = new Set(ids.map(String));
  const today = new Date().toISOString().slice(0, 10);
  const out = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) {
      out.push(lines[i]);
      continue;
    }
    const cols = splitCsvLine(lines[i]);
    if (idSet.has(String(cols[idIdx]))) {
      cols[statusIdx] = newStatus;
      if (dateIdx >= 0) cols[dateIdx] = today;
    }
    out.push(cols.map(csvEscape).join(","));
  }
  fs.writeFileSync(LEADS_PATH, out.join("\n") + (text.endsWith("\n") ? "\n" : ""));
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  if (!fs.existsSync(LEADS_PATH)) {
    throw new Error(`Missing leads file: ${LEADS_PATH}`);
  }

  const rows = parseCsv(fs.readFileSync(LEADS_PATH, "utf8"));
  const selected = selectLeads(rows, args);

  if (!selected.length) {
    console.log("No matching leads (check --priority / --ids / status / email fields).");
    return;
  }

  console.log(`Selected ${selected.length} lead(s):`);
  for (const row of selected) {
    console.log(`  #${row.id}  ${extractEmail(row.best_email)}  —  ${orgShortName(row.organization)}`);
  }

  if (args.attach && !fs.existsSync(PAMPHLET_PATH)) {
    throw new Error(`--attach set but missing PDF: ${PAMPHLET_PATH}`);
  }

  if (args.dryRun) {
    console.log("\n--- DRY RUN (no Gmail calls) ---\n");
    for (const row of selected) {
      const to = extractEmail(row.best_email);
      const subject = subjectFor(row.organization);
      const body = buildBody(args.template, row);
      console.log(`TO: ${to}`);
      console.log(`SUBJECT: ${subject}`);
      console.log(body);
      console.log("\n-----\n");
    }
    return;
  }

  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  const createdIds = [];

  for (const row of selected) {
    const to = extractEmail(row.best_email);
    const subject = subjectFor(row.organization);
    const body = buildBody(args.template, row);
    const raw = buildMime({
      to,
      subject,
      bodyText: body,
      attachmentPath: args.attach ? PAMPHLET_PATH : null,
    });

    const res = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: { raw: toBase64Url(raw) },
      },
    });

    createdIds.push(row.id);
    console.log(`Draft created #${row.id} → ${to}  (draft id: ${res.data.id})`);
  }

  updateLeadStatuses(createdIds, "Draft created");
  console.log(`\nDone. ${createdIds.length} draft(s) in Gmail. Open Gmail → Drafts, review, Send.`);
  console.log("Lead_List.csv status updated to \"Draft created\".");
  if (!args.attach) {
    console.log("Tip: re-run with --attach to include the pamphlet PDF, or attach manually before Send.");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
