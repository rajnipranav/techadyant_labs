# Report cover images

Drop cover images here and reference them from `app/reports/data.ts` via the
report's `cover` field.

- Recommended: export page 1 of the report PDF as an image, or use a designed cover.
- Format: PNG or JPG. Aim for ~1200×750 (landscape, ~16:10) for crisp cards;
  larger is fine. Keep file size reasonable (< ~400 KB).
- Naming: use the report slug, e.g. `india-fab-ecosystem.png`.

Then in app/reports/data.ts add to that report:

    cover: '/covers/india-fab-ecosystem.png',

If `cover` is omitted, a branded cover is generated automatically.
Served by Cloudflare's CDN from /covers/<file>. These are public marketing
images — never put the paid PDF here (that stays in the private Supabase bucket).
