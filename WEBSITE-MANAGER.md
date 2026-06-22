# Techadyant Labs — Website Manager Operating Manual
_This is the single source of truth for managing https://labs.techadyant.com/ on an ongoing basis._

---

## 1. What we run

| Layer | What it is | Where it lives |
|---|---|---|
| **Homepage** | Editorial hero, featured report, signals grid, Atlas gateway | `app/page.tsx` |
| **Reports** | 13 published + 11 forthcoming; paid/free tiers, PDFs on Supabase | `app/reports/` |
| **Signals** | 12 entries (6 live, 5 monitoring, 1 placeholder); `sources` arrays on all | `app/signals/` |
| **Sanket (newsletter)** | Monthly PDF; 2 issues live | `app/newsletter/` |
| **The Atlas** | `/research` — SID-backed: Overview, Dependencies, Players, Supply Chains, Corridors, Methodology | `app/research/` |
| **Corridors** | 11 national corridors, all deep-tier with node pages, chokepoint maps, scorecards | `app/corridors/` |
| **Briefings** | 8 entries, all forthcoming | `app/briefings/` |
| **Services** | Commissioned research + DPRs | `app/services/` |
| **About** | Principles, outputs, voice | `app/about/` |
| **Admin** | `/admin` SID management console (capture, entities, chokepoints, candidacy, signals, site ops) | `app/admin/` |
| **Automation** | `bake-sid`, `publish-report`, `sync-meta`, `indexnow` | `scripts/` |
| **SEO/GEO docs** | Plan, checklist, outreach log, LinkedIn package, backlink actions | repo root |

---

## 2. Daily 4-step rhythm (non-negotiable)

Every day, in this order:

1. **Metadata / GEO / Content task** — one verifiable change or audit step.
2. **Growth / Outreach / Partnership task** — LinkedIn post, backlink follow-up, or partnership action.
3. **Quality check** — verify yesterday’s changes didn’t break build, links, structured data, or evidence labels.
4. **Log update** — append a row to `SEOGEO-PLAN.md` §8.

If outreach is blocked (no mail tool), substitute with a social/content task in step 2.

---

## 3. Daily task templates

Pick the next item from the list each day; cycle through categories so nothing starves.

### 3.1 Metadata / GEO (step 1)
- Audit one new or recently changed page for:
  - `title`, `description`, `canonical`, OG/Twitter summary image
  - JSON-LD present and valid (`Article` for signals, `FAQPage` for reports, `CollectionPage`/`Dataset` for Atlas pages)
  - Evidence labels (`[V]`, `[V1]`, `[U]`, `[modelled]`) where claims are made
  - `sources[]` arrays populated for report/signal data entries
- Add or refresh one `/llms.txt` entry if a new page went live.
- Check sitemap coverage for any orphaned routes.

### 3.2 Growth / Outreach (step 2)
- LinkedIn: draft or publish one post from `GEO-LINKEDIN-PACKAGE.md`.
- Backlink outreach: read `SEOGEO-OUTREACH-LOG.md`; if a follow-up is due, action it.
- If blocked, do a content/social task: export one corridor card as a shareable image, write one signal summary, or update the LinkedIn queue.
- Partnership: review one target from `SEOGEO-BACKLINK-ACTIONS.md` and prime next contact.

### 3.3 Quality check (step 3)
- Run `npm run lint` and `npx tsc --noEmit` if files were touched.
- Spot-check the live page that was changed.
- Supabase: verify report preview PDF link resolves (HTTP 200, correct `Content-Type`).
- Admin panel: check `/admin` candidacy queue if a promotion was done.
- Verify no orphaned `sources` blocks (especially in `app/signals/data.ts`).

### 3.4 Log update (step 4)
Append to `SEOGEO-PLAN.md` §8:

```
| YYYY-MM-DD | <task> | <status> | <next> | <file> | <owner> |
```

---

## 4. Weekly cadence

| Day | Task |
|---|---|
| Mon | Publish or draft one signal or briefing; verify full metadata + GEO summary + evidence labels + sources. |
| Tue | LinkedIn content QA — queue 3 posts for Tue/Wed/Fri. |
| Wed | Atlas freshness: add or correct 1–3 SID entries (player, relationship, event, or grid revision). Run `npm run bake` to refresh snapshot. |
| Thu | Corridor intel sweep: review `node-data.ts`; back-fill any node that has new PIB/IIG/state data. |
| Fri | Outreach/backlink review: check tiered targets, send follow-ups, update log. |
| Sat | SEO audit: scan for orphan pages, broken internal links, missing JSON-LD, stale `lastUpdated` dates. |
| Sun | Build check: `npm run build` or `next build` passes; confirm deploy; check `/llms.txt` and sitemap freshness. |

### Weekly deliverables
- At least one signal or briefing published/drafted.
- At least one LinkedIn post published.
- `bake-sid.mjs` run after any SID data change.
- `indexnow-submit.mjs` run after a significant public-facing change.

---

## 5. Monthly cadence

| Task | Owner | Tool |
|---|---|---|
| Backlink audit + lost-link recovery | Hermes + Operator | `SEOGEO-BACKLINK-ACTIONS.md` + third-party backlink checker |
| Keyword + AI-citation snapshot | Hermes | Manual review of search rankings and AI mention tracking |
| Outreach tier review | Hermes + Operator | `SEOGEO-OUTREACH-LOG.md` |
| Admin queue purge | Hermes | `/admin/sid/candidacy` — promote/merge/reject stale candidates |
| Signals/briefings review | Hermes | `app/signals/data.ts`, `app/briefings/data.ts` |
| Dataset freshness | Hermes | `public/data/atlas/*.csv` timestamps |
| Editorial calendar adjustment | Hermes + Operator | `SEOGEO-PLAN.md` |

---

## 6. Team handoff from Claude coworker

### What was built and is now owned by this manager

| Area | Status | Notes |
|---|---|---|
| **The Atlas (`/research`)** | Live | Overview, Dependencies, Players, Supply Chains, Methodology, Corridors, node pages. `scripts/bake-sid.mjs` bakes SID snapshot. |
| **Corridors deep upgrade** | Live | All 11 corridors to frozen standard. `app/corridors/node-data.ts` holds deep intelligence. |
| **Admin dashboard** | Live | `/admin` with SID views + Cloudflare Access gating. Env vars in place. |
| **India Drone Sensors report** | Published | `app/reports/data.ts` entry + OG card + Supabase PDF wired. |
| **India Fab Ecosystem report** | Published | Config + data entry present; PDF on Supabase ready to publish. |
| **SEO/GEO package** | Implemented | Evidence labels, primary sources blocks, Article/FAQPage JSON-LD, `/llms.txt`, sitemap. |
| **LinkedIn package** | Ready | `GEO-LINKEDIN-PACKAGE.md` post bank. |
| **Outreach playbook** | Ready | Tiered targets, drafts, backlink actions. |

### Continuity rules
- Do not remove or rewrite existing corridor `node-data.ts` without preserving sources and coordinates.
- Run `bake-sid.mjs` after any SID schema/data change.
- Keep `app/corridors/node-data.ts` type-safe; any new field requires a corresponding render update in the node/corridor pages.
- Admin panel RPCs live in `functions/api/admin/[[path]].js`; never add client-side DB calls.

---

## 7. Backlink & promotion workflow

### Tier 1 (already primed)
- Government and multilateral bodies: DPIIT, NITI Aayog, ADB, Indian embassies.
- Industry associations: CII, FICCI, ASSOCHAM, IESA, SEMI, DSDP.
- Research desks: The Ken, Mint, ET, Business Standard, Inc42, Medianama.
- International strategic analysis: RUSI, IISS, Carnegie India, CSEP.

### Tier 2
- Contributed analysis and expert roundups.
- Conference submissions for India tech/manufacturing/climate summits.
- University research portals and think-tank libraries.

### Tier 3
- LinkedIn/X syndication from signals/reports.
- Embeddable summary widgets.
- Dataset/CSV drops from Atlas.

### Execution rules
- One outreach message per day (or partnership form) — quality over volume.
- Every message must contain one precise reason to cite Techadyant Labs.
- Track every attempt in `SEOGEO-OUTREACH-LOG.md`.
- If no mail tool is present, convert the day’s outreach slot into a LinkedIn/post or content asset task.

---

## 8. Escalation paths

| Situation | Action |
|---|---|
| Search console / indexing issue | Check sitemap + `/llms.txt` + robots.txt; verify `app/sitemap.ts` covers the route. |
| Atlas data looks stale | Re-run `npm run bake` (requires `N8NDB_URL` + `N8NDB_SERVICE_ROLE_KEY`). |
| Build breaks | Check Next.js version mismatch, TS errors, missing Supabase env vars. |
| Admin panel access denied | Verify Cloudflare Access app covers `/admin` and `/api/admin`. |
| Outreach blocked | Switch step 2 to LinkedIn/content; do not halt the rhythm. |
| User asks for a deploy | Operator push from repo root (`git push origin main`). |
| Disputed corridor/node data | Flag in `SEOGEO-PLAN.md`, revert to DPIIT/NICDC primary source, note in `node-data.ts` source line. |

---

## 9. Verification checklist (before any push)

- [ ] `npx tsc --noEmit` passes for touched files.
- [ ] `npm run lint` passes (or warnings are understood).
- [ ] New pages have `metadata`, `canonical`, OG/Twitter summary, and JSON-LD.
- [ ] Signal/report entries have `sources[]` and evidence labels where required.
- [ ] Internal links point to correct slugs (no 404 on static pages).
- [ ] `/llms.txt` regenerated or verified current.
- [ ] `indexnow-submit.mjs` run after notable public changes.

---

## 10. Commit message conventions

| Prefix | Use when |
|---|---|
| `seo:` | Metadata, structured data, JSON-LD, `/llms.txt`, sitemap, robots |
| `geo:` | GEO summaries, evidence labels, `sources` arrays |
| `corridors:` | Node data, map, corridor pages, intel updates |
| `atlas:` | Atlas pages, bake script, SID snapshot |
| `admin:` | Dashboard UI or API |
| `publish:` | Report or signal published |
| `outreach:` | Backlink or partnership action |
| `build:` | Dependency or build-tooling fix |

Example: `seo: add Dataset JSON-LD to import-dependencies page`
