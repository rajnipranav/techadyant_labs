#!/usr/bin/env node
/**
 * prune-redirects.mjs — build guard for public/_redirects
 *
 * WHY THIS EXISTS (RCA, Sept 2026):
 * A re-slug migration bulk-added ~3,250 redirect rules, taking _redirects to
 * 3,300+ lines. Cloudflare Pages then dropped most of them for TWO reasons:
 *   1. Static-redirect limit: max 2,000 static + 100 dynamic
 *      (https://developers.cloudflare.com/pages/platform/limits/#redirects).
 *   2. ORDERING: static rules must appear BEFORE any dynamic (splat/placeholder)
 *      rule. A single splat rule near the TOP made Cloudflare treat every rule
 *      after it as "dynamic", hit the 100-dynamic cap, and skip ~1,520 lines:
 *        "Maximum number of dynamic rules supported is 100. Skipping remaining
 *         1520 lines of file."
 *
 * FIX (applied here, deterministically, every build):
 *   a. Drop UUID-source rules (never indexed — not in sitemap/internal links).
 *   b. Split into static vs dynamic (source contains `*` or a `:placeholder`).
 *   c. Emit ALL static rules first, then ALL dynamic rules — never interleaved.
 *   d. Cap static < 2,000 and dynamic <= 100; fail the build loudly if exceeded.
 *
 * Runs before `next build` so the rewritten file is what `output: 'export'`
 * copies into `out/`. Idempotent.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', '_redirects');

const STATIC_LIMIT = 2000;
const DYNAMIC_LIMIT = 100;
const SAFE_STATIC = 1950; // headroom for a few hand-added rules

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const isComment = (l) => l.trimStart().startsWith('#');
const isBlank = (l) => l.trim() === '';
const isRule = (l) => !isComment(l) && !isBlank(l);
const source = (l) => l.trim().split(/\s+/)[0] ?? '';
// Cloudflare treats a rule as dynamic if its SOURCE uses a splat (*) or a :placeholder.
const isDynamic = (l) => source(l).includes('*') || /\/:/.test(source(l));

const lines = readFileSync(FILE, 'utf8').split(/\r?\n/);

let droppedUuid = 0;
const rules = [];
for (const l of lines) {
  if (!isRule(l)) continue;                 // comments/blanks are re-emitted from scratch below
  if (UUID.test(source(l))) { droppedUuid++; continue; }
  rules.push(l.trim().replace(/\s+/g, ' '));
}

// De-dupe by source (keep first — Cloudflare applies the top-most match).
const seen = new Set();
const unique = rules.filter((r) => { const s = source(r); if (seen.has(s)) return false; seen.add(s); return true; });

let staticRules = unique.filter((r) => !isDynamic(r));
let dynamicRules = unique.filter((r) => isDynamic(r));

const overStatic = Math.max(0, staticRules.length - SAFE_STATIC);
const overDynamic = Math.max(0, dynamicRules.length - DYNAMIC_LIMIT);
if (overStatic) staticRules = staticRules.slice(0, SAFE_STATIC);
if (overDynamic) dynamicRules = dynamicRules.slice(0, DYNAMIC_LIMIT);

const out = [
  '# AUTO-ORGANISED by scripts/prune-redirects.mjs — do not hand-sort.',
  '# Cloudflare _redirects rules: ALL static rules must precede ALL dynamic',
  '# (splat/placeholder) rules; limits are 2,000 static + 100 dynamic. UUID-source',
  '# rules are dropped (never indexed). Edit sources in the CMS, not here.',
  '',
  '# ---- Static redirects ----',
  ...staticRules,
  '',
  '# ---- Dynamic redirects (splats / placeholders) — MUST come last ----',
  ...dynamicRules,
  '',
].join('\n');

writeFileSync(FILE, out, 'utf8');

console.log(
  `prune-redirects: dropped ${droppedUuid} UUID rules; ` +
  `${staticRules.length} static + ${dynamicRules.length} dynamic (limits ${STATIC_LIMIT}+${DYNAMIC_LIMIT}); ` +
  `static-before-dynamic enforced.`
);
if (overStatic || overDynamic || staticRules.length > STATIC_LIMIT || dynamicRules.length > DYNAMIC_LIMIT) {
  console.error(
    `prune-redirects: OVER LIMIT (static over by ${overStatic}, dynamic over by ${overDynamic}). ` +
    `Move overflow to Cloudflare Bulk Redirects.`
  );
  process.exit(1);
}
