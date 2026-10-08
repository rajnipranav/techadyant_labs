#!/usr/bin/env node
// Tests for the Techadyant scoring engine (methodology v1.0) and the pilot data's score outcomes.
// Run: node --experimental-strip-types scripts/test-industrial-scoring.mjs   (npm run test:industrial)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ICS, CGI, SCCS, IOS, SNS, SCORE_DEFS, CGI_PROFILES, CGI_STATUS_VALUE, COMPLETENESS_THRESHOLD, SUPPLIER_STATUS_VALUE,
  bandValue, computeScore, haversineKm, notYetComputed, round5, roundKm, sccsFromInputs,
} from '../app/research/industrial/scoring.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const J = (f) => JSON.parse(readFileSync(join(ROOT, 'data/industrial-intelligence', f), 'utf8'));
const comp = (key, weight, value, confidence = 'high') => ({ key, label: key, weight, value, confidence, rationale: '' });

test('every score definition has weights summing to 100', () => {
  for (const d of SCORE_DEFS) assert.equal(d.components.reduce((s, c) => s + c.weight, 0), 100, d.key);
  for (const [k, p] of Object.entries(CGI_PROFILES)) assert.equal(Object.values(p).reduce((a, b) => a + b, 0), 100, k);
});

test('methodology document mirrors the ICS weights', () => {
  const doc = readFileSync(join(ROOT, 'docs/industrial-connectivity-methodology.md'), 'utf8');
  for (const c of ICS.components) {
    const re = new RegExp(`\\|\\s*${c.label.replace(/[()]/g, '\\$&')}\\s*\\|\\s*${c.weight}\\s*\\|`);
    assert.match(doc, re, `doc row for ${c.label}`);
  }
});

test('round5 and roundKm avoid false precision', () => {
  assert.equal(round5(54.4), 55);
  assert.equal(round5(52.4), 50);
  assert.equal(roundKm(2), 5);
  assert.equal(roundKm(103.2), 105);
});

test('haversine is sane (Delhi–Mumbai ≈ 1,150 km)', () => {
  const km = haversineKm({ lat: 28.61, lng: 77.21 }, { lat: 19.08, lng: 72.88 });
  assert.ok(km > 1100 && km < 1200, String(km));
});

test('distance bands are monotone and bounded', () => {
  for (const key of ['port', 'airport', 'logistics', 'freight_corridor']) {
    let prev = 1;
    for (const km of [0, 49, 51, 149, 151, 299, 301, 499, 501, 2000]) {
      const v = bandValue(key, km);
      assert.ok(v >= 0 && v <= 1);
      assert.ok(v <= prev, `${key} not monotone at ${km}`);
      prev = v;
    }
  }
  assert.throws(() => bandValue('road', 10));
});

test('missing components are excluded, not zeroed', () => {
  const r = computeScore(ICS, [comp('a', 50, 1), comp('b', 30, 1), comp('c', 20, null)]);
  assert.equal(r.status, 'computed');
  assert.equal(r.score, 100);
  assert.equal(r.data_completeness, 0.8);
});

test('below the completeness threshold the score is Insufficient Data', () => {
  const r = computeScore(ICS, [comp('a', 60, 1), comp('b', 40, null)]);
  assert.ok(0.6 < COMPLETENESS_THRESHOLD);
  assert.equal(r.status, 'insufficient_data');
  assert.equal(r.score, null);
  assert.equal(r.band, null);
});

test('confidence is the lower of completeness and evidence tiers', () => {
  const high = computeScore(ICS, [comp('a', 50, 1, 'high'), comp('b', 50, 0.5, 'high')]);
  assert.equal(high.confidence, 'high');
  const lowEvidence = computeScore(ICS, [comp('a', 50, 1, 'low'), comp('b', 50, 0.5, 'high')]);
  assert.equal(lowEvidence.confidence, 'low');
  const lowCompleteness = computeScore(ICS, [comp('a', 75, 1, 'high'), comp('b', 25, null)]);
  assert.equal(lowCompleteness.confidence, 'low');
});

test('scores always fall in 0..100', () => {
  for (let i = 0; i < 200; i++) {
    const cs = ICS.components.map((c) => comp(c.key, c.weight, Math.random() < 0.15 ? null : Math.random(), ['high', 'medium', 'low'][i % 3]));
    const r = computeScore(ICS, cs);
    if (r.status === 'computed') assert.ok(r.score >= 0 && r.score <= 100 && r.score % 5 === 0);
  }
});

test('defined-but-uncollected scores read Insufficient Data', () => {
  for (const d of [IOS, SNS]) {
    const r = notYetComputed(d);
    assert.equal(r.status, 'insufficient_data');
    assert.equal(r.data_completeness, 0);
  }
});

// ---- pilot data: mirrors app/research/industrial/data.ts resolution (nearest-target + bands) ----
const infra = J('infrastructure-nodes.json').nodes;
const nodes = J('industrial-nodes.json').nodes;
const FILTERS = {
  'nearest:seaport': (i) => i.type === 'seaport' && i.status === 'operational',
  'nearest:cargo_airport': (i) => i.type === 'airport' && i.status === 'operational' && i.classification === 'international' && i.cargo_handling === true,
  'nearest:dfc': (i) => i.type === 'dfc_station' && i.status === 'operational',
};
const km = (n, i) => roundKm(haversineKm({ lat: n.coordinates.lat, lng: n.coordinates.lng }, { lat: i.coordinates.lat, lng: i.coordinates.lng }));
const resolve = (n, t) => {
  const pool = t.startsWith('infra:') ? infra.filter((i) => i.id === t) : infra.filter(FILTERS[t]);
  return pool.filter((i) => i.coordinates.lat !== null).map((i) => ({ i, km: km(n, i) })).sort((a, b) => a.km - b.km)[0];
};
const icsFor = (n) => computeScore(ICS, ICS.components.map((d) => {
  const x = n.ics_inputs.find((c) => c.key === d.key);
  if (!x) return comp(d.key, d.weight, null, null);
  if (x.derive) {
    const hit = resolve(n, x.derive.target);
    let v = bandValue(d.key, hit.km);
    if (d.key === 'logistics' && hit.i.status !== 'operational') v = Math.min(v, 0.5);
    return comp(d.key, d.weight, v, 'medium');
  }
  return comp(d.key, d.weight, x.value, x.confidence);
}));
const cgiFor = (n) => computeScore(CGI, Object.entries(CGI_PROFILES[n.requirement_profile]).map(([k, w]) => {
  const a = n.cgi_inputs.find((c) => c.key === k);
  return comp(k, w, a ? CGI_STATUS_VALUE[a.status] : null, a?.confidence ?? null);
}));

test('pilot ICS outcomes are stable (golden values — update deliberately with the methodology)', () => {
  const got = Object.fromEntries(nodes.map((n) => [n.slug, icsFor(n).score]));
  assert.deepEqual(got, { dholera: 55, sanand: 85, 'jewar-yeida': 75, jagiroad: 45, 'sriperumbudur-oragadam': 75, kopparthy: 50 });
});

test('pilot CGI: computed only where evidence covers ≥70% of requirement weight', () => {
  const got = Object.fromEntries(nodes.map((n) => [n.slug, cgiFor(n).status]));
  assert.deepEqual(got, { dholera: 'computed', sanand: 'insufficient_data', 'jewar-yeida': 'insufficient_data', jagiroad: 'insufficient_data', 'sriperumbudur-oragadam': 'insufficient_data', kopparthy: 'insufficient_data' });
  assert.equal(cgiFor(nodes.find((n) => n.slug === 'dholera')).score, 60);
});

test('every derived target resolves to an infrastructure node with coordinates', () => {
  for (const n of nodes) for (const c of n.ics_inputs.filter((x) => x.derive)) assert.ok(resolve(n, c.derive.target), `${n.slug}.${c.key}`);
});

const supplierMap = J('supplier-map.json');
const icsInputs = (n) => Object.fromEntries(ICS.components.map((d) => {
  const x = n.ics_inputs.find((c) => c.key === d.key);
  if (!x) return [d.key, { value: null, confidence: null }];
  if (x.derive) {
    const hit = resolve(n, x.derive.target);
    let v = bandValue(d.key, hit.km);
    if (d.key === 'logistics' && hit.i.status !== 'operational') v = Math.min(v, 0.5);
    return [d.key, { value: v, confidence: 'medium' }];
  }
  return [d.key, { value: x.value, confidence: x.confidence }];
}));
const sccsFor = (n) => {
  const cats = supplierMap.categories[n.requirement_profile];
  const rows = cats.map((c) => supplierMap.assessments.find((a) => a.node_id === n.id && a.category === c.key));
  const value = rows.every(Boolean) ? rows.reduce((s, a) => s + SUPPLIER_STATUS_VALUE[a.status], 0) / rows.length : null;
  return computeScore(SCCS, sccsFromInputs(n.requirement_profile, icsInputs(n), { value, confidence: 'low', rationale: '' }));
};

test('supplier map covers every category of every semiconductor node exactly once', () => {
  for (const n of nodes.filter((x) => x.requirement_profile.startsWith('semiconductor_'))) {
    for (const c of supplierMap.categories[n.requirement_profile]) {
      const hits = supplierMap.assessments.filter((a) => a.node_id === n.id && a.category === c.key);
      assert.equal(hits.length, 1, `${n.slug}.${c.key}`);
    }
  }
});

test('pilot SCCS outcomes are stable (golden values)', () => {
  const got = Object.fromEntries(nodes.map((n) => [n.slug, sccsFor(n).score]));
  assert.deepEqual(got, { dholera: 45, sanand: 75, 'jewar-yeida': 60, jagiroad: 30, 'sriperumbudur-oragadam': 70, kopparthy: 40 });
});

test('electronics nodes: partial supplier coverage leaves supplier proximity missing, never zero', () => {
  for (const n of nodes.filter((x) => x.requirement_profile === 'electronics_assembly')) {
    const r = sccsFor(n);
    assert.equal(r.components.find((c) => c.key === 'supplier_proximity').value, null, n.slug);
    assert.ok(r.data_completeness <= 0.75, n.slug);
  }
});
