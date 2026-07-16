# Gmail draft creator (semi-automated outreach)

Creates **Gmail drafts** from `outreach/Lead_List.csv`. You review each draft in Gmail and hit **Send**. The script never sends mail by itself.

Credentials stay local in `outreach/.gmail-secrets/` (gitignored).

---

## 1. Google Cloud setup (one time, ~10 min)

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (e.g. `echoes-outreach`) or pick an existing one
3. **APIs & Services → Library** → enable **Gmail API**
4. **APIs & Services → OAuth consent screen**
   - User type: **External** (unless you have a Workspace org)
   - App name: `ECHOES Outreach Drafts`
   - Your email as support / developer contact
   - Scopes: add `https://www.googleapis.com/auth/gmail.compose` (compose/drafts only)
   - Test users: add **matthewkennedy22@gmail.com**
   - Publishing status can stay **Testing**
5. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Desktop app**
   - Name: `ECHOES Drafts CLI`
6. Download the JSON → save as:

```
outreach/.gmail-secrets/credentials.json
```

Create the folder if needed:

```bash
mkdir -p outreach/.gmail-secrets
```

---

## 2. Install dependency

From the repo root:

```bash
npm install googleapis
```

---

## 3. Dry run (no Gmail)

```bash
node scripts/gmail-drafts/create-drafts.mjs --dry-run --priority A --limit 5
```

---

## 4. Create real drafts

First run opens a browser auth URL; paste the code back into the terminal. Token is saved to `outreach/.gmail-secrets/token.json`.

```bash
# First 10 Priority A leads with verified-ish emails
node scripts/gmail-drafts/create-drafts.mjs --priority A --limit 10 --attach

# Specific leads
node scripts/gmail-drafts/create-drafts.mjs --ids 1,7,9,13 --attach

# Short template
node scripts/gmail-drafts/create-drafts.mjs --priority A --limit 5 --template b --attach
```

Then open **Gmail → Drafts**, personalize the greeting if you know a name, and Send.

---

## Options

| Flag | Meaning |
|------|---------|
| `--dry-run` | Print only |
| `--priority A` | Filter A / B / C |
| `--limit N` | Max drafts |
| `--ids 1,2,3` | Exact lead ids |
| `--template a\|b\|c` | Full / short / SLO-soft |
| `--attach` | Attach `outreach/ECHOES Beta Pamphlet.pdf` |
| `--verified-only` | Only `email_confidence=Verified` |

Skips rows with no parseable email, contact forms, or status already `Draft created` / `Emailed` / `Yes` / `No`.

After success, updates `Lead_List.csv` status → `Draft created`.

---

## Security

- Never commit `credentials.json` or `token.json`
- Scope is **compose only** (drafts), not full mailbox send
- Revoke access anytime: Google Account → Security → Third-party access
