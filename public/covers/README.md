# Report cover images

**Covers are served from THIS folder (git-versioned static files), not from R2.**
This is deliberate: it makes covers deploy atomically with the site and
impossible to "mix up" — the file and the reference live together.

## The one rule (do this for every report)

1. Put the cover here as `public/covers/<slug>.jpg` — filename EXACTLY the
   report slug, lowercase, `.jpg`.
2. Set the report's `cover` field to the relative path:

       cover: '/covers/<slug>.jpg'

   Set it in the CMS (`cms_reports.cover`) — that is the source of truth; the
   build's `sync-cms-to-data.mjs` copies it into `app/reports/data.ts`.

That's it. Same string on both sides, keyed by slug. No R2 upload for covers.

## Do NOT

- Do NOT point a cover at `https://library.techadyant.com/covers/...`
  (an absolute R2 URL). Hand-typed R2 filenames drift from the CMS value on
  every publish — that is exactly what used to break covers site-wide.
- Do NOT use spaces, apostrophes, curly quotes, capitals or `.png` in the
  key. Slug + `.jpg`, always.

## Format
PNG/JPG, ~1000×1400 portrait (or ~1200×750 landscape) is fine, keep it
< ~600 KB. If `cover` is omitted a branded cover is generated automatically.

These are public marketing images — never put the paid PDF here (that stays
in the private R2 report bucket).
