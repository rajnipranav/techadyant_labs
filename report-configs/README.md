# report-configs/

One JSON config per report. Drives the `npm run publish-report` automation.

## Workflow

1. Copy `_template.json` to `<your-slug>.json`. Use the same slug as your
   PDF filename (lowercase, hyphenated).
2. Fill in title/subtitle/summary/etc. Point `source.pdf`, `source.preview`,
   `source.cover` at your local files.
3. Run from the repo root:

       npm run publish-report -- <your-slug>           # local-only (no Supabase upload)
       npm run publish-report -- <your-slug> --upload  # also uploads the full PDF to Supabase

4. The script:
   - validates every required field and asset (catches the `.pdf.pdf` trap)
   - copies the preview PDF to `public/previews/<slug>-preview.pdf`
   - copies the cover image to `public/covers/<slug>.jpg`
   - optionally uploads the full PDF to your Supabase `reports` bucket
   - inserts or updates the entry in `app/reports/data.ts` and
     `functions/api/_shared.js` (idempotent — safe to re-run)
   - runs `npm run sync-meta` to refresh page count + reading time

5. Review `git status`, then commit and push:

       git add -A
       git commit -m "publish: <your-slug>"
       git push origin main

## Required env (only if using `--upload`)

Create `.env.local` in the repo root (gitignored):

    SUPABASE_URL=https://<your-project>.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=eyJ...
    REPORTS_BUCKET=reports

These are read only when you pass `--upload`. Local-only runs work without them.

## Slug rules

- Lowercase letters, digits, hyphens only.
- Same string used in: config filename, PDF filename in Supabase, cover image
  filename, preview PDF filename, and the `slug` field inside the config.
- The script verifies all of these match before writing anything.
