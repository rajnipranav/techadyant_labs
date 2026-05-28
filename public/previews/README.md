# /public/previews

Free abridged preview PDFs for paid reports. Files here are served from
the site root at `/previews/<filename>` — public, no auth, no signing.

To add a new preview:
1. Drop the PDF here (e.g. `india-fab-ecosystem-preview.pdf`).
2. In `app/reports/data.ts`, set `previewObject` and `previewPages`
   on the matching report:
       previewObject: 'india-fab-ecosystem-preview.pdf',
       previewPages: 12,
3. Commit + push. Cloudflare rebuilds and the "Free preview" button
   appears on the report page; the "Free preview" pill appears on the
   reports-index card.

Naming convention: `<slug>-preview.pdf` (same slug as in `data.ts`).
