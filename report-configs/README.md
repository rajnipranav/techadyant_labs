# report-configs/

One JSON config per report. Drives the `npm run publish-report` automation.

## Workflow

1. Copy `_template.json` to `<your-slug>.json`. Use the same slug as your PDF filename (lowercase, hyphenated).
2. Fill in the required fields. Point `source.pdf`, `source.preview`, `source.cover` at your local files.
3. (Optional) Add a `signal` block to also publish a signal announcing this report.
4. (Optional) Add a `briefing` block to also add a briefing entry that references this report.
5. Run from the repo root:

       npm run publish-report -- <your-slug>           # local-only (no Supabase upload)
       npm run publish-report -- <your-slug> --upload  # also uploads the full PDF to Supabase

6. Review `git status`, then commit and push:

       git add -A
       git commit -m "publish: <your-slug>"
       git push origin main

## What the script does

- Validates every required field and asset (catches the `.pdf.pdf` trap).
- Copies the preview PDF to `public/previews/<slug>-preview.pdf`.
- Copies the cover image to `public/covers/<slug>.jpg`.
- Optionally uploads the full PDF to your Supabase `reports` bucket.
- Inserts or updates the entry in `app/reports/data.ts` and `functions/api/_shared.js` (idempotent — safe to re-run).
- If the config has a `signal` block: inserts/updates `app/signals/data.ts` (keyed by signal slug).
- If the config has a `briefing` block: inserts/updates `app/briefings/data.ts` (keyed by briefing title).
- Runs `npm run sync-meta` to refresh page count + reading time.

## Optional: signal block

Add a `signal` block (no leading underscore) to publish a signal entry announcing the new report. Minimum fields:

```json
"signal": {
  "no": "S-005",
  "excerpt": "1-2 sentences for the signals index card.",
  "takeaways": ["...", "...", "..."]
}
```

All other fields default sensibly: `title` becomes "New report: <report title>", `domain` inherits from the report, `date` / `dateLabel` mirror the report's publication date, `status` is `'live'`. You can override any of them in the signal block. You can also supply a full `body` array for a longer signal — see the `SignalBody` type in `app/signals/data.ts`.

Signal slug defaults to `<report-slug>-launch`. Override via `signal.slug`.

## Optional: briefing block

Add a `briefing` block to add an entry to the briefings page and homepage:

```json
"briefing": {
  "date": "15 Jun 2026",
  "title": "A Briefing Title Linked to This Report",
  "tag": "Executive brief",
  "read": "5 min",
  "blurb": "A 1-2 sentence blurb."
}
```

All five fields are required when the block is present. Briefings are keyed by title (no slug field), so re-running the script with the same `briefing.title` updates in place.

## Required env (only if using `--upload`)

Create `.env.local` in the repo root (gitignored):

    SUPABASE_URL=https://<your-project>.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=eyJ...
    REPORTS_BUCKET=reports

These are read only when you pass `--upload`. Local-only runs work without them.

## Slug rules

- Lowercase letters, digits, hyphens only.
- Same string used in: config filename, PDF filename in Supabase, cover image filename, preview PDF filename, and the `slug` field inside the config.
- The script verifies all of these match before writing anything.
