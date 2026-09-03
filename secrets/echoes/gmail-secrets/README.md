# Keep OAuth secrets here (gitignored)

1. Download Desktop OAuth client JSON from Google Cloud
2. Save it as `credentials.json` in this folder
3. Run `node scripts/gmail-drafts/create-drafts.mjs --dry-run --priority A --limit 3`
4. On first real run, authorize; `token.json` will appear here

See `scripts/gmail-drafts/README.md` for full setup.
