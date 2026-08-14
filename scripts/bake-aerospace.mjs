#!/usr/bin/env node
/**
 * Bake the Military Aerospace Atlas into app/research/_aerospace.json.
 *
 * Reads ../../Database/MTA Manufacturing/MTA Atlas/*.json - including the
 * VERIFIED sources.json (Phase 0 audit, 2026-08-14) - and produces the
 * committed site dataset. Run manually and commit the JSON; the Cloudflare
 * build has no access to the source folder (same contract as bake-suppliers).
 *
 *   node scripts/bake-aerospace.mjs
 *
 * Every record carries resolved source objects (id/title/url/tier/verdict)
 * plus an `indicative` flag when any supporting source is unresolved/retired
 * or the record itself is labelled indicative. The UI renders those records
 * with a visible "Indicative - needs primary-source verification" label.
 *
 * Factual corrections from the Phase 0 audit are applied at the SOURCE level
 * (Database/MTA Manufacturing/MTA Atlas/*.json, correction pass 2026-08-14)
 * - the dataset is the single source of truth, so re-baking is idempotent:
 *   C-390 partner = Mahindra Defence (not HAL); IAF has not selected the
 *   C-390; C-295 contract 8 Sep 2021; HTT-40 7 Mar 2023; 568F-5 propeller;
 *   P&WC APS2600 APU; Do-228 authority GA-ATS; Dynamatic flap-tracks =
 *   A320/A330; C-130J induction Feb 2011. Confidence is demoted to
 *   `indicative` wherever a record cites an indicative-tier source, so the
 *   flag and the field always agree.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const ATLAS = join(ROOT, '..', 'Database', 'MTA Manufacturing', 'MTA Atlas');
const j = (f) => JSON.parse(readFileSync(join(ATLAS, f), 'utf-8'));

// ---------------------------------------------------------------- sources --
const sources = j('sources.json').records;
const srcById = new Map(sources.map((s) => [s.id, s]));

const srcInfo = (ids) => (ids || []).map((id) => {
  const s = srcById.get(id);
  if (!s) return { id, title: id, url: null, tier: 'unknown', verdict: 'MISSING', resolved: false, indicative: true };
  return {
    id,
    title: s.title,
    url: s.url,
    tier: s.trust_tier,
    verdict: (s.verification && s.verification.verdict) || null,
    resolved: !!(s.verification && s.verification.resolved_url),
    indicative: s.trust_tier === 'indicative',
  };
});

const slug = (id, prefix) => id.replace(new RegExp('^' + prefix + '-'), '');

// ------------------------------------------------------------------ modules --
const plat = j('platforms.json').records.map((r) => ({ ...r, slug: slug(r.id, 'plat'), sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) }));
const comp = j('companies.json').records.map((r) => ({ ...r, slug: slug(r.id, 'org'), sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) }));
const sup = j('suppliers.json').records.map((r) => ({ ...r, sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) }));
const sys = j('systems.json').records.map((r) => ({ ...r, sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) }));
const loc = j('localization.json').records.map((r) => ({ ...r, sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) }));
const dep = j('dependencies.json').records.map((r) => ({ ...r, slug: slug(r.id, 'dep'), sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) }));
const opp = j('opportunities.json').records.map((r) => ({ ...r, sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) }));
const geoRaw = j('geography.json');
const geo = {
  records: geoRaw.records.map((r) => ({ ...r, sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) })),
  clusters: geoRaw.clusters.map((r) => ({ ...r, sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) })),
};
const mro = j('mro.json').records.map((r) => ({ ...r, sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) }));
const prog = j('programmes.json').records.map((r) => ({ ...r, sources: srcInfo(r.sources), indicative: r.confidence === 'indicative' || srcInfo(r.sources).some((x) => x.indicative) }));

// -------------------------------------------------------------------- meta --
const cnt = (arr, key, val) => arr.filter((x) => x[key] === val).length;
const byCount = (arr, key) => {
  const m = new Map();
  for (const x of arr) {
    const v = x[key] ?? 'unknown';
    m.set(v, (m.get(v) || 0) + 1);
  }
  return [...m.entries()].map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n);
};

const indicativeRecords = [...plat, ...comp, ...sup, ...sys, ...loc, ...dep, ...opp, ...geo.records, ...mro, ...prog].filter((x) => x.indicative).length;

const meta = {
  updated: '2026-08-14',
  atlasVersion: j('index.json').atlas_version,
  platforms: plat.length,
  companies: comp.length,
  suppliers: sup.length,
  systems: sys.length,
  programmes: prog.length,
  localization: loc.length,
  geoSites: geo.records.length,
  clusters: geo.clusters.length,
  dependencies: dep.length,
  opportunities: opp.length,
  mro: mro.length,
  sources: sources.length,
  sourcesResolved: sources.filter((s) => s.verification && s.verification.verdict !== 'UNRESOLVED' && s.verification.verdict !== 'RETIRED').length,
  sourcesUnresolved: sources.filter((s) => s.verification && (s.verification.verdict === 'UNRESOLVED' || s.verification.verdict === 'RETIRED')).length,
  indicativeRecords,
  platformByCategory: byCount(plat, 'category'),
  platformByStatus: byCount(plat, 'production_status'),
  companyByType: byCount(comp, 'type'),
  supplierByTier: byCount(sup, 'tier'),
  dependencyByCriticality: byCount(dep, 'criticality'),
  dependencyByConcentration: byCount(dep, 'supply_concentration'),
  localizationByDepth: byCount(loc, 'localization_depth'),
  localizationByStatus: byCount(loc, 'localization_status'),
  clusterByState: byCount(geo.clusters, 'state'),
  siteByState: byCount(geo.records, 'state'),
  programmeByMilestone: byCount(prog, 'milestone'),
  programmeByStatus: byCount(prog, 'status'),
  systemByDependency: byCount(sys, 'dependency'),
  opportunityByCategory: byCount(opp, 'category'),
  mroByStatus: byCount(mro, 'current_status'),
};

const out = { meta, platforms: plat, companies: comp, suppliers: sup, systems: sys, localization: loc, dependencies: dep, opportunities: opp, geography: geo, mro, programmes: prog };
const dest = join(ROOT, 'app', 'research', '_aerospace.json');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, JSON.stringify(out, null, 2), 'utf-8');
console.log(`Wrote ${dest}`);
console.log(`  platforms=${plat.length} companies=${comp.length} suppliers=${sup.length} systems=${sys.length} dependencies=${dep.length}`);
console.log(`  indicative records=${indicativeRecords} | sources resolved=${meta.sourcesResolved}/${sources.length}`);
