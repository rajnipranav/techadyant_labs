# Storage migration — Supabase Storage → Cloudflare R2

**Status:** plan, ready to execute. Goal: move report/newsletter binaries off Supabase Storage
(1 GB file cap, 5 GB/mo free egress then billed) onto Cloudflare R2 (10 GB free, **$0 egress at
any volume**, native to the Pages project the site already runs on).

## Principle — hybrid, not a lift-and-shift

Keep Supabase for what it is good at and move only the heavy binaries:

| Layer | Stays / moves | Where |
|---|---|---|
| Postgres — CMS (`cms_*`), entitlements, subscribers, orders | **stays** | Supabase |
| Auth (sign-in, tokens) | **stays** | Supabase |
| Paid report PDFs, decks | **moves** | R2 (private) |
| Free PDFs, newsletters, covers | **moves** | R2 (public, existing library bucket) |

The entitlement check (who has paid) stays a Postgres query; only the file bytes move.

## Buckets — one new bucket, reuse the existing public one

We already have **`labs-techadyant-library`** (public, on `library.techadyant.com`) holding the
Atlas source-document library (pillar folders: `semiconductors/`, `critical_minerals/`,
`ai_infrastructure/`, `defence/`, `enterprise_software/`). **Keep it untouched** — the Atlas
"Sources" pages link to it via `app/research/_sources.json` `mirror_url`.

| Bucket | Access | Holds | New? |
|---|---|---|---|
| **`techadyant-reports`** | **private** | paid report PDFs + decks | **new — create this** |
| **`labs-techadyant-library`** | public (`library.techadyant.com`) | covers, free PDFs, newsletters — under **new prefixes** | reuse |

Paid content **must** be private (a public URL would leak a ₹6,999 report), so paid needs its own
private bucket. Public files reuse the library bucket under dedicated prefixes so the source-docs
stay cleanly separated:

```
library.techadyant.com/
  semiconductors/ …            ← existing source docs (untouched)
  critical_minerals/ …         ← existing source docs (untouched)
  covers/<slug>.jpg            ← NEW — report + newsletter covers
  reports-free/<slug>.pdf      ← NEW — free report PDFs + newsletter PDFs
```

**Object-key hygiene (do this during the copy):** rename keys to clean ASCII — no spaces or
apostrophes. e.g. `semicon 2.0 opportunity map.pdf` → `semicon-2-0-opportunity-map.pdf`,
`who-build-india's drones.pdf` → `who-builds-indias-drones.pdf`. Removes every URL-signing edge
case. The `object` fields in `_shared.js` get updated to match.

## Env vars to set (Pages → Settings → Environment variables)

```
# unchanged — auth + entitlements stay on Supabase
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

# new — R2 (paid, private bucket)
R2_S3_ENDPOINT        = https://<account_id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID      = <R2 API token — Object Read on techadyant-reports>
R2_SECRET_ACCESS_KEY  = <secret>
R2_BUCKET             = techadyant-reports
R2_PUBLIC_BASE        = https://library.techadyant.com   # existing public bucket domain
```

R2 access key/secret: Cloudflare → R2 → **Manage R2 API Tokens** → create a token scoped to
Object Read on `techadyant-reports`.

## Code changes (my side)

1. **`functions/api/download-r2.js`** — drafted (this repo). Keeps the Supabase auth + entitlement
   check; swaps serving:
   - paid → short-lived **R2 presigned S3 URL** (`aws4fetch`) returned as `{ url, filename }` —
     the exact contract the frontend already consumes → **no frontend change**.
   - free → `R2_PUBLIC_BASE/<key>` (key includes the `reports-free/` prefix).
   Cutover = rename `download-r2.js` → `download.js`.
2. **`npm i aws4fetch`** — tiny Workers-compatible SigV4 signer for the presigned URLs.
3. **`functions/api/_shared.js`** — update each paid `object:`/`deckObject:` to its clean
   `techadyant-reports` key; update free `object:` to `reports-free/<clean>.pdf`.
4. **CMS** (`cms_reports`, `cms_newsletters`): repoint public URLs to `library.techadyant.com`:
   - `cover` → `https://library.techadyant.com/covers/<slug>.jpg`
   - free `preview_object` → store `reports-free/<slug>.pdf` and point the report page's
     `fullPdfUrl` at `R2_PUBLIC_BASE` (one edit in `app/reports/[slug]/page.tsx`).
   - newsletter `seo.pdf` / `seo.card` → `library.techadyant.com/reports-free|covers/…`.

## Copy the files (one-time, from your machine — the sandbox can't reach Supabase or R2)

Both Supabase Storage and R2 speak S3, so `rclone` copies bucket-to-bucket:

```ini
# ~/.config/rclone/rclone.conf
[supa]
type = s3
provider = Other
access_key_id = <supabase S3 access key>      # Supabase → Project Settings → Storage → S3 connection
secret_access_key = <supabase S3 secret>
endpoint = https://<project-ref>.supabase.co/storage/v1/s3
region = <your region>

[r2]
type = s3
provider = Cloudflare
access_key_id = <R2 access key>
secret_access_key = <R2 secret>
endpoint = https://<account_id>.r2.cloudflarestorage.com
region = auto
```

```bash
# paid PDFs → new private bucket
rclone copy supa:reports        r2:techadyant-reports              --progress
# free PDFs + covers → existing public bucket, under prefixes
rclone copy supa:reports-free   r2:labs-techadyant-library/reports-free --progress
rclone copy supa:covers         r2:labs-techadyant-library/covers       --progress
```

For the few keys with spaces/apostrophes, copy them to clean names explicitly, e.g.:
```bash
rclone copyto "supa:reports/semicon 2.0 opportunity map.pdf" "r2:techadyant-reports/semicon-2-0-opportunity-map.pdf"
```

## Cutover

1. Create `techadyant-reports` (private) + an R2 API token (Object Read).
2. Set the env vars; `npm i aws4fetch`; deploy `download-r2.js` alongside the current function.
3. Run the rclone copy (with clean keys).
4. **Test `/api/download-r2?report=<slug>`** — one free, one paid (signed in). Confirm the download
   works and non-buyers are still blocked.
5. I update `_shared.js` keys + the CMS cover/preview URLs; verify covers render.
6. **Swap:** rename `download-r2.js` → `download.js`; deploy.
7. Watch a week, then delete the Supabase `reports` / `reports-free` / `covers` buckets.

## Rollback

Trivial before step 6 (old `download.js` + Supabase buckets untouched — revert = redeploy). After
step 6, keep the Supabase buckets a week as the rollback path before deleting.

## Cost

~25 reports × a few MB sits well inside R2's **10 GB free** with **$0 egress** — effectively free,
and stays free to ~10 GB stored ($0.015/GB-month beyond, still $0 egress). The Supabase egress
line disappears.

## Split of work

- **Me:** `download-r2.js` (done), the `_shared.js` key updates, the CMS URL repoints, and the one
  `fullPdfUrl` edit — done at cutover (steps 5–6).
- **You (Cloudflare + your machine):** create `techadyant-reports` + API token, set the Pages env
  vars, `npm i aws4fetch`, run the rclone copy. The public bucket + custom domain already exist.
