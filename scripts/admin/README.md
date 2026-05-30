# Techadyant Labs — Report Publisher (local admin)

A small, dependency-free dashboard that wires a **new report** into the site so you
don't hand-edit five files every time. It runs locally on your machine and patches the
repo; you commit and push as usual.

## What it does

Given the form fields, it writes:

| File | What it adds |
|---|---|
| `app/reports/data.ts` | the catalogue entry (title, summary, price, cover, preview…) — inserted at the **top** so the newest report leads |
| `functions/api/_shared.js` | the **server-authoritative** `REPORTS` entry (price + storage object key) — this is what makes the report **purchasable / downloadable** |
| `app/reports/content/<slug>.tsx` | *(optional)* the in-page online reading version, from the sections you enter |
| `app/reports/[slug]/page.tsx` | registers the content component (import + registry) |
| `public/covers/<slug>.jpg` | *(optional)* the cover image you upload |

A `.bak` of every modified file is written first (and `*.bak` / `*.del` are git-ignored).

## What it does NOT do

- It does **not** upload PDFs. Upload those yourself **before** publishing:
  - **Paid full report** → private `reports` bucket, named exactly `<slug>.pdf`
  - **Free condensed report** → public `report-free` (or `reports-free`) bucket
- It does not run `npm run build` or deploy. After it patches the files, run a build
  and push; Cloudflare Pages redeploys.

## Run it

From the repo root (`techadyant_labs-main/`):

```bash
node scripts/admin/server.mjs
```

Then open **http://localhost:4321** and fill the form.

## The checklist for a new report

1. **Upload the PDFs to Supabase** (paid → `reports` bucket as `<slug>.pdf`; free condensed → `report-free` bucket).
2. Run the server, fill the form:
   - **Slug** must equal the PDF name in the `reports` bucket (minus `.pdf`).
   - **Access = paid** → set the price (and tick *PDF is uploaded* so the `_shared.js` entry is written).
   - **Free preview object**: `report-free/<slug>-condensed.pdf` for a Supabase public-bucket file, or a bare `<file>.pdf` for one placed in `/public/previews/`.
   - **Cover**: upload an image (saved to `/public/covers/<slug>.jpg`) or leave blank for an auto-generated branded cover.
   - **Online reading version** (optional): add sections; you can hand-edit the generated `.tsx` afterwards to drop in SVG figures (copy the `ChokepointFigure` pattern from an existing content file).
3. Click **Add report to repo** (optionally tick *git commit*).
4. Review the diff, run `npm run build`, then `git push`.
5. *(optional)* `npm run sync-meta` to replace the fallback page-count / reading-time with the real numbers from the PDF.

## Notes

- The tool refuses to add a slug that already exists.
- It binds to `localhost:4321` only — not exposed to the network.
- If something looks wrong, the `.bak` files next to each modified file are the
  pre-change versions; copy them back to revert.
