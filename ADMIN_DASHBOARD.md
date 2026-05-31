# Techadyant Admin Dashboard — `/admin`

Consolidated, admin-only management console at `labs.techadyant.com/admin`. Replaces the standalone `techadyant-dashboard` Worker. Public site is unaffected.

## What's built

**Frontend** (`app/admin/`, client-rendered, static-export safe):
- `/admin` — Overview (KPIs, entities by corridor/type)
- `/admin/sid/capture` — Dependency Capture Map (corridors × 6 layers heatmap, click a cell → assessment + rationale)
- `/admin/sid/entities` — Entity explorer (filter by corridor, search name/alias, node detail with relationships)
- `/admin/sid/chokepoints` — Chokepoint analysis (nodes ranked by dependency weight; foreign flagged)
- `/admin/sid/candidacy` — Candidacy review queue (promote / merge / reject)
- `/admin/signals` — live scored signals cross-linked to SID nodes
- `/admin/site` — subscribers + commission inquiries (Research Reports project)

**API** (`functions/api/admin/[[path]].js`): one Access-guarded BFF. Re-checks `Cf-Access-Authenticated-User-Email`, holds the n8ndb service key server-side, proxies to the SECURITY DEFINER RPCs (`sid_overview`, `sid_capture_grid`, `sid_entities`, `sid_entity_detail`, `sid_chokepoints`, `sid_candidates`, `sid_recent_signals`, and the action RPCs). `sid` stays unexposed to PostgREST.

## 1. Environment variables (Cloudflare Pages → Settings → Environment variables)
Add to **Production** (and Preview if used):

| Var | Value |
|---|---|
| `ADMIN_EMAIL` | `praveenrajnipranav@gmail.com` |
| `N8NDB_URL` | `https://umtfafscgbxgmmqlktlx.supabase.co` |
| `N8NDB_SERVICE_ROLE_KEY` | n8ndb service-role key (Supabase → n8ndb → Settings → API → `service_role`) |

`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (already set, → Research Reports project) power the `/site` pillar.
For local `next dev` only, set `DEV_ADMIN=true` to bypass the Access header check — never in production.

## 2. Cloudflare Access (the gate)
Zero Trust → Access → Applications → **Add → Self-hosted**:
- Application domain: `labs.techadyant.com`, **path** `admin` (covers `/admin/*`).
- Add a **second** self-hosted app for path `api/admin` (covers `/api/admin/*`).
- For each: Policy → Action **Allow** → Include → **Emails** → `praveenrajnipranav@gmail.com`.
- Identity provider: Google (or One-time PIN).

This blocks everyone else at the edge; normal visitors never reach `/admin`.

## 3. Deploy & verify
1. Commit + push the repo → Cloudflare Pages builds and deploys (`functions/` auto-deploys with it).
2. Visit `https://labs.techadyant.com/admin` → Access login → dashboard loads.
3. Check `/admin/sid/capture` renders the heatmap and `/admin/sid/candidacy` lists candidates.
4. First real use: the 4 low-relevance test candidates from the live-fire can be rejected straight from the queue.
5. Retire the old Worker (`techadyant-dashboard`) once confirmed.

## Notes
- Promote creates a real watchlist node (+aliases +corridor links) and marks the candidate — it's live, so review before confirming.
- Relationships are seeded `single_source`; upgrade to verified during report fact-checking.
- To add an `x-cron-secret`/JWT layer later, the BFF already isolates all DB creds server-side.
