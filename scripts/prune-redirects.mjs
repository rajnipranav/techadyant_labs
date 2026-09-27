#!/usr/bin/env node
/**
 * prune-redirects.mjs — build guard for public/_redirects
 *
 * WHY THIS EXISTS (RCA, Sept 2026):
 * Commit 7185f18 bulk-appended ~3,250 rules (Player-UUID->Slug, Entity->Player,
 * Legacy-UUID blocks) during a re-slugging migration, taking _redirects to 3,324
 * lines. Cloudflare Pages honors only the FIRST 2,000 static redirects
 * (https://developers.cloudflare.com/pages/platform/limits/#redirects) and
 * SILENTLY DROPS the rest — so ~1,300 real redirects were dead, producing
 * Search Console "Redirect error" / "Not found (404)" at scale.
 *
 * FIX:
 *  1. Drop UUID-source rules (`/path/<uuid>`). Those URLs were never in the
 *     sitemap or internal links, so Google never indexed them — the redirects
 *     protect nothing and only burn the 2,000-rule budget.
 *  2. Hard-cap the remaining STATIC rules below the Cloudflare limit; if the
 *     cap is ever hit, fail the build loudly rather than ship dead redirects.
 *
 * Runs in the build BEFORE `next build` so the pruned file is what
 * `output: 'export'` copies into `out/`. Idempotent — safe to run repeatedly.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'public', '_redirects');

// Cloudflare Pages: 2,000 static + 100 dynamic (splat). Keep headroom.
const STATIC_LIMIT = 2000;
const SAFE_STATIC = 1950; // leave room for a few hand-added rules

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

const isComment = (l) => l.trimStart().startsWith('#');
const isBlank = (l) => l.trim() === '';
const isRule = (l) => !isComment(l) && !isBlank(l);
const source = (l) => l.trim().split(/\s+/)[0] ?? '';
const isSplat = (l) => source(l).includes('*');

const raw = readFileSync(FILE, 'utf8');
const lines = raw.split(/\r?\n/);

let droppedUuid = 0;
let kept = [];
for (const l of lines) {
  if (isRule(l) && UUID.test(source(l))) { droppedUuid++; continue; }         // drop UUID-source rules
  if (isComment(l) && /uuid/i.test(l)) continue;                              // drop now-empty UUID section headers
  kept.push(l);
}

// Collapse 3+ consecutive blank lines into one.
kept = kept.filter((l, i) => !(isBlank(l) && isBlank(kept[i - 1] ?? 'x') && isBlank(kept[i - 2] ?? 'x')));

// Enforce the static-redirect ceiling (order matters: keep the earliest rules).
let staticSeen = 0;
let cappedOut = 0;
const final = [];
for (const l of kept) {
  if (isRule(l) && !isSplat(l)) {
    staticSeen++;
    if (staticSeen > SAFE_STATIC) { cappedOut++; continue; }
  }
  final.push(l);
}

const out = final.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\s*$/, '\n');
writeFileSync(FILE, out, 'utf8');

const staticFinal = final.filter((l) => isRule(l) && !isSplat(l)).length;
const dynamicFinal = final.filter((l) => isRule(l) && isSplat(l)).length;
console.log(
  `prune-redirects: dropped ${droppedUuid} UUID-source rules` +
  (cappedOut ? `, capped ${cappedOut} over the ${SAFE_STATIC} ceiling` : '') +
  ` -> ${staticFinal} static + ${dynamicFinal} dynamic rules (Cloudflare limit ${STATIC_LIMIT}+100).`
);
if (staticFinal > STATIC_LIMIT) {
  console.error(`prune-redirects: STILL over the ${STATIC_LIMIT} static limit — redirects will be dropped by Cloudflare. Move overflow to Bulk Redirects.`);
  process.exit(1);
}
