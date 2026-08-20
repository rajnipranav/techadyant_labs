# Report Publishing — Gaps & Checklist

> Source of truth for publishing gaps found while fixing the **India AI Compute Corridor Economics** report (20 Aug 2026). Read this **before** running `npm run publish-report` so these mistakes are not repeated.
>
> Companion docs: `report-configs/README.md` (workflow), `public/previews/README.md`, `public/covers/README.md`.

## The 7 gaps that broke the AI Compute publish

### 1. Config `source.*` paths pointed to files that don't exist
**What happened:** `report-configs/india-ai-compute-corridor-economics.json` referenced
`India-AI-Compute-Corridor-Economics-2026-2035.pdf` and `...jpg`, but the package actually contains:

- paid PDF → `Techadyant_AI_Compute_Corridor_Report_2026-2035.pdf`
- preview/free → `Techadyant_AI_Compute_Corridor_Report_2026-2035_Free.pdf`
- cover → `AI_Compute_Corridor_Package.jpg`

**Rule:** `source.pdf` / `source.preview` / `source.cover` must be the **exact filenames on disk** (case-sensitive). The publish script renames them to slug-based names in `public/` and R2 automatically — so point at the real local files, don't invent "canonical" names. Before publishing, confirm all three exist (`Test-Path` / `existsSync`).

### 2. Cover + preview were left untracked in git
**What happened:** `public/covers/<slug>.jpg` and `public/previews/<slug>-preview.pdf` existed on disk but were never committed (`??` untracked). Cloudflare only deploys what is in git, so both 404'd on the live site even though the files looked "done" locally.

**Rule:** after `publish-report`, run `git add -A` and verify `git status --short` shows the cover/preview as `A`/`M`, then commit + push. A file existing in `public/` is not enough — it must be committed.

### 3. R2 upload never ran (missing `.env.local`)
**What happened:** the paid PDF + preview never reached Cloudflare R2 because `.env.local` with R2 credentials was absent (only Supabase vars in `.env`). The paid download stayed 404.

**Rule:** before `--upload-r2`, confirm `.env.local` exists with `R2_S3_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. If missing, ask the owner for credentials — don't silently skip the upload and call it published.

### 4. Data pack (XLSX) is a separate manual R2 upload
**What happened:** `functions/api/_shared.js` has `dataObject: 'data/<slug>.xlsx'`, but `publish-report.mjs` only uploads the PDF + preview — it does **not** upload the data pack. The "Data pack" download 404'd.

**Rule:** upload the data-pack XLSX to `data/<slug>.xlsx` in R2 manually (Cloudflare dashboard / rclone / aws cli). No script handles this today.

### 5. Long-form reading edition used a foreign theme
**What happened:** `app/reports/content/<slug>.body.html` was a generic long-form template with its own CSS — blue `#3b82f6`, teal `#14b8a6`, amber `#f59e0b`, Inter font — and inline SVG figures in the same foreign palette.

**Rule:** long-form reading HTML must use the Techadyant house tokens:

- background `#0B0B14`; surfaces `#161629` / `#1C1C34`
- brass `#F5B544` (labels/borders), cyan "gold" `#00f2ff` (numbers/data), periwinkle `#818CF8` (primary/links), warm `#FB923C`
- prose: Source Serif 4 (`var(--font-serif)`); labels/numbers: JetBrains Mono (`var(--font-jetbrains)`)

Reuse the styles from `app/reports/executive-summaries/executive-summary.module.css`, scoped under `.rv-longform`. Recolor any inline SVG figures to the same palette.

### 6. No live verification after deploy
**What happened:** cover, preview, paid PDF, and data pack were never checked against live URLs, so the 404s were only discovered later by the client.

**Rule:** after the Cloudflare build finishes (~2–5 min), HEAD-check every public asset and require **200**:

- `https://labs.techadyant.com/covers/<slug>.jpg`
- `https://labs.techadyant.com/previews/<slug>-preview.pdf`
- `https://library.techadyant.com/reports/<slug>.pdf` (paid)
- `https://library.techadyant.com/data/<slug>.xlsx` (data pack)

### 7. Placeholder commit messages
**What happened:** several commits were pushed with `"Your message here"`, making it impossible to trace what was published.

**Rule:** use meaningful messages — `publish: <slug>`, `fix(<slug>): ...`. Never push "Your message here".

## Quick checklist (run in order)
- [ ] All three `source.*` paths exist on disk (exact filenames)
- [ ] `.env.local` present with R2 vars (if uploading)
- [ ] `npm run publish-report -- <slug> --upload-r2`
- [ ] Data pack XLSX uploaded to `data/<slug>.xlsx`
- [ ] Long-form `.body.html` uses house tokens (not a foreign theme)
- [ ] `git add -A` → confirm cover/preview tracked → `git commit -m "publish: <slug>"` → `git push`
- [ ] HEAD-check all 4 public URLs return 200

## Tooling gotcha
PowerShell `Get-Content -Raw` mis-decodes UTF-8 (shows `�` for em-dashes / `·`). Read repo files with `[System.IO.File]::ReadAllText($path, [Text.Encoding]::UTF8)` or Python (`open(path, encoding='utf-8')`). Never conclude a file has "encoding corruption" from a console dump alone.
