# Cowork handoff — `cowork/sourcing-and-followups`

Branch off `main` (PRs #6/#7/#8 merged). Read-only research + code are committed.
Nothing in `_atlas.json` was hand-edited.

## Applied to SID on 2026-10-05 (with your OK for Tasks 2, 3, 4; Task 5/RLS held)

| # | Change | Before → After |
|---|---|---|
| 2 | Created `sid.capture_assessment_sources` (link table) | did not exist → created |
| 3 | CM · Components & Inputs, assessment `540b2f19-36d2-4184-bbf8-2d79c352b763` | `verification_status`: `single_source` → **`verified`**; linked 2 independent primary sources (PIB/Min. Heavy Industries 27 Dec 2025; PIB/Min. Earth Sciences, Rajya Sabha 2 Apr 2026, PRID 2248182); score unchanged at **1 (Nascent)**; rationale corrected from "~100% imported (53,748 t FY25)" to the 84.8–90.4%-by-quantity wording |
| 4 | All other `single_source` rows with no external primary source linked | **78 rows** `single_source` → **`unverified`** |

**Resulting exported (latest-per-cell) verification mix: 1 verified, 44 unverified, 0 single-source.** This reaches the live site only when the committed `_atlas.json` is re-baked from SID (your call; the build re-bakes when it has `N8NDB_*` creds). The two new `sources` rows are both linked (no orphans). These are reversible.

Also committed on the branch: `VERIFICATION_DEFINITIONS` + `VERIFICATION_PROVENANCE` in `app/research/insights.ts` — the approved AI-assisted-audit disclosure wording, ready for the evidence panel (wires in with PR #9).

**Still gated (not applied): Task 5 (RLS).** Draft SQL + test plan below; awaiting your OK.

---
*(Original proposals, for the record:)*

---

## (1) Git sync + build status

| Step | Result |
|---|---|
| `main` synced | ✅ at `4ae1142` (contains #6 `25b56ff`, #7 `aba1e2f`, #8 `4ae1142`). |
| Dossier read | ✅ `claude/sourcing-dossier` → `SOURCING-DOSSIER-2026-10-05.md`. |
| `npm install` | OK. |
| `npx tsc --noEmit` | ✅ passes. |
| `npx next build` | ✅ passes (`/signals/digest` emits). Fonts note: `fonts.googleapis.com` is blocked in the cloud sandbox, so `next/font/google` can't fetch at build time here; verified by temporarily stubbing the three font imports in `app/layout.tsx` and reverting — never committed. Builds unmodified on your machine. |
| Branch | `cowork/sourcing-and-followups`, two code commits cherry-picked (digest, visual summary). |
| Open PRs #9, #10 | Left as-is; not merged, not modified. |

---

## (2) Task 1 — primary-source verification table (read-only)

Sources opened and quoted below. **The 53,748 t discrepancy is resolved: the rationale is wrong; do not rescore to 0.**

| Cell (assessment_id) | Current claim | Source 1 (opened, quoted) | Source 2 (opened, quoted) | Independent? | Verdict |
|---|---|---|---|---|---|
| **CM · Components & Inputs** (`540b2f19…2d79c352b763`, status 1) | "~100% imported (53,748 t FY25)" | **PIB / Min. of Heavy Industries**, "Scheme to Promote Manufacturing of Sintered Rare Earth Permanent Magnet", 27 Dec 2025 — *"import dependence ranging between 59.6% and 81.3% value-wise and 84.8% and 90.4% quantity-wise"* (China, 2022-23→2024-25); target 6,000 MTPA. | **Govt (Dr Jitendra Singh, Lok Sabha, 25 Mar 2026)**, widely reported — domestic REPM capacity to reach **5,000 t by 2030**. | **Yes** (two ministries/occasions) | Claim **INCORRECT**. Real = **84.8–90.4% by quantity**, not ~100%. **53,748 t is broad HS-8505 (all permanent magnets/articles) trade data**, not the ~4,000–5,000 t sintered-NdFeB requirement — a unit/scope conflation. **Keep Nascent (1).** Two independent primary sources exist → eligible for "verified" once recorded (Task 3, gated). Rationale needs correcting. |
| **CM · Refining & Processing** (`7e7ecfe1…85e856c1907c`, status 1) | "~98% China refined NdFeB, ~98% gallium, ~90% battery graphite" | **USGS Mineral Commodity Summaries — Gallium, Feb 2026** — *"China accounted for 99% of worldwide primary low-purity gallium production."* | Graphite ~90% / refined-NdFeB ~98%: **not independently verified** (IEA Global Critical Minerals Outlook / PIB rare-earth strategy not yet opened). | Partial | Gallium figure **verified (99%, ≈ the ~98% claimed)**. Graphite & refined-NdFeB figures = **needs a human source**. Supports Nascent (1). **Not promotable** (only one claim independently sourced). |
| **Defence · Components & Inputs** (`57a4d962…1898606a8329`, status 2) | engine chokepoint; components improving (Emerging) | **HAL–GE F404-GE-IN20 113-engine contract, 7 Nov 2025** (~$1B; LCA Mk1A powered by imported GE engines; deliveries 2027–32). | MoD Year-End Review 2025 (PIB) — candidate, not individually quoted. | S1 primary | "Jet engines wholly import-dependent" is **true and sourced**, but that is a *sub-claim*; the layer also has domestically improving components. **Emerging (2) is defensible — do NOT rescore to 0.** Keep at 2. |
| **Semiconductors · Raw Materials** (`297bc1ba…12da7cee75f3`, status 1) | ">90% imported" (wafers, gases) | ISM 2.0 (PIB press note 154968 / Budget 2026) — confirms materials/gases/equipment are a *targeted gap* (qualitative). | Quantitative ">90%": **GAP — no primary source found** (SEMI/MeitY data needed). | — | Qualitatively supports Nascent (1). The **">90%" number needs a human source**. No rescore. |

**Bottom line on scoring:** none of the four warrants a drop to 0. The one hard data error is CM Components' "~100% / 53,748 t"; corrected figure is 84.8–90.4% by quantity.

---

## (3) Before/after for every proposed row/text change (all gated — not applied)

### Task 2 — schema change (SID). SQL ready; awaiting your OK.
```sql
create table if not exists sid.capture_assessment_sources (
  assessment_id uuid not null references sid.capture_assessments(assessment_id) on delete cascade,
  source_id     uuid not null references sid.sources(source_id),
  supports      text,
  quoted_text   text,
  added_at      timestamptz not null default now(),
  primary key (assessment_id, source_id)
);
```

### Task 3 — record sources + promote (SID). Awaiting your OK, per cell.
Only **CM · Components & Inputs** has two independent primary sources confirmed. Proposed, after the Task 2 table exists:
1. Insert both sources into `sid.sources` (`is_primary=true`): the PIB/HMI REPM scheme note (27 Dec 2025) and the Jitendra Singh 5,000 t-by-2030 statement (25 Mar 2026).
2. Link both to assessment `540b2f19-36d2-4184-bbf8-2d79c352b763` in `capture_assessment_sources`.
3. `update sid.capture_assessments set verification_status='verified' where assessment_id='540b2f19-36d2-4184-bbf8-2d79c352b763';` — **this row only**. Before: `single_source` → After: `verified`.
4. Correct that row's rationale. Before: *"Permanent magnets and finished battery materials still import-dominated; domestic magnet plants not yet at scale."* / (snapshot variant "~100% imported (53,748 t FY25)…") → After (proposed): *"Finished sintered NdFeB magnets 84.8–90.4% imported by quantity (2022-23 to 2024-25, PIB/MHI); domestic requirement ~4,000 t with ~5,000 t capacity targeted by 2030 under the ₹7,280 cr REPM scheme — nascent, not absent."*

CM Refining, Defence Components, Semiconductors Raw Materials: **not promoted** (one source / gap).

### Task 6 — Enterprise Software wording. **No SID write needed — the live SID is already clean.**
The `EDI nn.n (Captured)` wording survives **only in the committed 18-Aug `_atlas.json` snapshot**. The live SID rationales already read correctly:

| Cell | Before (stale snapshot) | After (already in live SID) |
|---|---|---|
| Public Cloud (0) | `EDI 81.7 (Captured). AWS/Azure/GCP dominate; CLOUD Act exposure. No domestic hyperscaler.` | `Hyperscale IaaS/PaaS dominated by global providers; domestic public-cloud share remains marginal…` |
| Productivity (0) | `EDI 72.5. M365/Workspace near-total…` | `Office suites and collaboration still overwhelmingly Microsoft/Google; no scaled sovereign alternative…` |
| Desktop OS (0) | `EDI 70.8. Windows endpoint monopoly.` | `Windows-dominated enterprise desktops; Linux/FOSS present but not the enterprise default.` |

Reaches production when the committed snapshot is re-baked from SID. No change proposed to SID.

### Tasks 7 & 8 — code (committed on this branch)
- **Task 7 (Unmanned Systems card):** already consistent on `main` — strip `['#C0563B','#C0563B','#C0563B','#C99A3B','#2BC5B4','#C99A3B']` (3 red) matches the stat "3 of 6". Verified against `_drones.json` sovereignty: the three import-dependent layers are Propulsion (NdFeB magnets, India 5%), Power (Li-ion cells 12%), Electronics (microcontroller/SoC 15%) — all Critical, all <20%. No change needed.
- **Task 8a (`/signals/digest/`):** static digest of recent live signals, grouped by domain, colour-coded from a shared palette module, "Data as of" anchored to the newest live signal, no auto-refresh, linked from the signals page.
- **Task 8b (report visual summary):** reusable `ReportVisualSummary` (stat tiles + insight boxes + client-side PNG), piloted on Beyond Solar Panels only, using that report's own figures.

---

## (4) RLS proposal and status (Task 5 — gated, not applied)

**Status:** RLS is **disabled on 31 of 32 `sid` tables** (only `patents` has it on), confirmed live.

**Why enabling it is safe for the build:** `scripts/bake-sid.mjs` calls the `public.atlas_export()` RPC using the **service-role key** (`N8NDB_SERVICE_ROLE_KEY`). The service role **bypasses RLS**, and `atlas_export()` is **`SECURITY DEFINER`** (runs as owner, also bypasses RLS). So enabling RLS does **not** break the bake or the RPC read path. The exposure is any direct table read/write with the **anon** key.

**Proposed (show-and-wait):**
```sql
-- Enable RLS on every sid table (default-deny; service role + SECURITY DEFINER RPC still work)
do $$ declare t text; begin
  for t in select tablename from pg_tables where schemaname='sid' loop
    execute format('alter table sid.%I enable row level security;', t);
  end loop;
end $$;
-- No anon policies added → anon key can neither read nor write sid tables directly.
-- (If any client legitimately reads a table with the anon key, add a narrow
--  `for select to anon using (true)` policy on just that table.)
```
**Test plan before apply:** (1) run in a Supabase branch or with a transaction + rollback; (2) call `atlas_export()` with the service role → expect full payload; (3) `npm run bake` with creds → expect unchanged `_atlas.json`; (4) attempt an anon-key `select * from sid.sources` → expect 0 rows / permission denied; (5) `npx next build` → green. Apply to prod only after all five pass and you OK it.

---

## (5) Needs a human decision or a primary source

1. **OK to run Task 2** (create `capture_assessment_sources`)? Required before any "verified".
2. **OK to run Task 3 for CM Components only** (insert 2 sources, link, set `verified`, correct rationale on `540b2f19…`)? The other three cells stay as-is.
3. **Task 4 — label honesty (gated).** All 45 *exported* (latest) rows are labelled `single_source` but cite only the internal pack `internal://atlas-updates/aug-2026` (`is_primary=false`) — not an external primary source. The 34 `single_source`+null-source rows are **historical seed rows (not exported)**. Decide: (a) relabel the exported rows to `unverified` until real primary sources are linked (honest), promoting only where Task 1 confirms two independent sources; or (b) link real sources cell-by-cell. I did not bulk-update anything.
4. **Evidence-panel provenance wording (Task 4, needs your approval).** Proposed line for the verification legend / definitions: *"Part of the August 2026 assessment refresh was AI-assisted (an automated draft pack) and internally reviewed by Techadyant; it is not yet externally source-verified. 'Single-source' here means one cited reference, which may be internal."* (`VERIFICATION_DEFINITIONS` doesn't exist on `main` yet — it's in draft PR #9 — so this would attach there or to `insights.ts`.)
5. **Primary-source gaps:** CM Refining graphite ~90% & refined-NdFeB ~98%; Semiconductors Raw Materials ">90% imported". Need IEA/USGS graphite and SEMI/MeitY semiconductor-materials figures.
6. **RLS:** OK to apply the enable + default-deny on a branch per the test plan above?
7. **Push:** this session can't push (git proxy 403; the device VM has no GitHub credentials). Push `cowork/sourcing-and-followups` from your Windows terminal and open ONE draft PR to `main`.
