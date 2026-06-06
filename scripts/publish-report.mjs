#!/usr/bin/env node
/**
 * One-shot publishing pipeline for a new report.
 *
 * Usage:
 *   npm run publish-report -- <slug>              # local-only (no Supabase upload)
 *   npm run publish-report -- <slug> --upload     # also uploads the full PDF
 *   npm run publish-report -- <slug> --dry-run    # plan only, no changes
 *   npm run publish-report -- <slug> --no-sync    # skip the sync-meta step
 *
 * Reads report-configs/<slug>.json. Validates everything (config fields,
 * asset existence, slug consistency, no `.pdf.pdf` filenames). Copies the
 * preview + cover into public/. Optionally uploads the full PDF to Supabase
 * Storage (private `reports` bucket). Inserts or updates the catalogue
 * entry in app/reports/data.ts and functions/api/_shared.js using a
 * brace-balanced parser — idempotent and safe to re-run.
 *
 * Dependencies: Node 18+ built-ins only.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve, basename, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const slug = argv.find((a) => !a.startsWith('--'));
const opts = {
  upload: argv.includes('--upload'),
  noSync: argv.includes('--no-sync'),
  dryRun: argv.includes('--dry-run'),
};

const C = { dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m', reset: '\x1b[0m' };
const log = (m) => console.log(m);
const ok = (m) => console.log(`${C.green}✓${C.reset} ${m}`);
const info = (m) => console.log(`${C.cyan}→${C.reset} ${m}`);
const warn = (m) => console.log(`${C.yellow}!${C.reset} ${m}`);
const die = (m) => { console.error(`${C.red}✗${C.reset} ${m}`); process.exit(1); };

if (!slug) {
  console.error('Usage: npm run publish-report -- <slug> [--upload] [--dry-run] [--no-sync]');
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  die(`Invalid slug "${slug}". Use lowercase letters, digits, hyphens only.`);
}

// ── 1. Load config ───────────────────────────────────────────────────────
const cfgPath = join(REPO, 'report-configs', `${slug}.json`);
if (!existsSync(cfgPath)) die(`Missing config: ${cfgPath}\nCopy report-configs/_template.json to ${slug}.json and fill it in.`);
let cfg;
try { cfg = JSON.parse(readFileSync(cfgPath, 'utf8')); }
catch (e) { die(`Cannot parse config: ${e.message}`); }
info(`Loaded ${cfgPath}`);

// ── 2. Validate config ───────────────────────────────────────────────────
const required = ['slug','title','subtitle','domain','edition','published','publishedLabel','summary','accent','status','access','source'];
for (const k of required) if (cfg[k] === undefined || cfg[k] === null || cfg[k] === '') die(`Config missing required field: ${k}`);
if (cfg.slug !== slug) die(`Config slug "${cfg.slug}" doesn't match argument "${slug}"`);
if (cfg.access === 'paid' && !cfg.price) die(`access="paid" needs a price (whole rupees)`);
if (cfg.access !== 'paid' && cfg.access !== 'free') die(`access must be "paid" or "free", got "${cfg.access}"`);
if (cfg.status !== 'published' && cfg.status !== 'forthcoming') die(`status must be "published" or "forthcoming", got "${cfg.status}"`);
if (!cfg.source.pdf) die(`source.pdf is required`);
ok('Config validated');

// ── 3. Validate source assets ────────────────────────────────────────────
const fullPdfPath = resolve(cfg.source.pdf);
if (!existsSync(fullPdfPath)) die(`Source PDF not found: ${fullPdfPath}`);
if (basename(fullPdfPath).toLowerCase().endsWith('.pdf.pdf')) die(`Source PDF has the .pdf.pdf double-extension trap: ${fullPdfPath}\nRename it to a single .pdf.`);
const pdfSize = statSync(fullPdfPath).size;
ok(`Full PDF: ${basename(fullPdfPath)} (${(pdfSize / 1048576).toFixed(2)} MB)`);

const previewPath = cfg.source.preview ? resolve(cfg.source.preview) : null;
if (previewPath) {
  if (!existsSync(previewPath)) die(`Preview PDF not found: ${previewPath}`);
  if (basename(previewPath).toLowerCase().endsWith('.pdf.pdf')) die(`Preview PDF has .pdf.pdf double-extension: ${previewPath}`);
  ok(`Preview PDF: ${basename(previewPath)} (${(statSync(previewPath).size / 1024).toFixed(0)} KB)`);
}

const coverPath = cfg.source.cover ? resolve(cfg.source.cover) : null;
if (coverPath) {
  if (!existsSync(coverPath)) die(`Cover image not found: ${coverPath}`);
  ok(`Cover image: ${basename(coverPath)} (${(statSync(coverPath).size / 1024).toFixed(0)} KB)`);
}

if (opts.dryRun) { warn('--dry-run set: stopping before any writes.'); process.exit(0); }

// ── 4. Copy preview + cover into public/ ─────────────────────────────────
if (previewPath) {
  const dstDir = join(REPO, 'public', 'previews');
  mkdirSync(dstDir, { recursive: true });
  const dst = join(dstDir, `${slug}-preview.pdf`);
  copyFileSync(previewPath, dst);
  ok(`Copied preview → public/previews/${slug}-preview.pdf`);
}
if (coverPath) {
  const ext = basename(coverPath).match(/\.(jpe?g|png|webp)$/i)?.[1].toLowerCase().replace('jpeg','jpg') || 'jpg';
  const dstDir = join(REPO, 'public', 'covers');
  mkdirSync(dstDir, { recursive: true });
  const dst = join(dstDir, `${slug}.${ext}`);
  copyFileSync(coverPath, dst);
  cfg._coverExt = ext;  // pass to data.ts generator
  ok(`Copied cover → public/covers/${slug}.${ext}`);
}

// ── 5. Optional: upload full PDF to Supabase ─────────────────────────────
if (opts.upload) {
  const envPath = join(REPO, '.env.local');
  let env = { ...process.env };
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = env.REPORTS_BUCKET || 'reports';
  if (!url || !key) die(`--upload requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local or env.`);
  const object = `${slug}.pdf`;
  const endpoint = `${url}/storage/v1/object/${bucket}/${object}`;
  info(`Uploading to ${bucket}/${object} (${(pdfSize / 1048576).toFixed(2)} MB)...`);
  const buf = readFileSync(fullPdfPath);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'content-type': 'application/pdf',
      'x-upsert': 'true',
    },
    body: buf,
  });
  if (!res.ok) die(`Supabase upload failed: ${res.status} ${await res.text().catch(()=>'')}`);
  ok(`Uploaded → ${bucket}/${object}`);
}

// ── 6. Insert/update entry in app/reports/data.ts ────────────────────────
const dataTsPath = join(REPO, 'app', 'reports', 'data.ts');
let dataTs = readFileSync(dataTsPath, 'utf8');
const tsEntry = renderTsEntry(cfg);
dataTs = upsertInArrayLiteral(dataTs, 'const baseReports: ReportMeta[] = [', 'slug', slug, tsEntry);
writeFileSync(dataTsPath, dataTs);
ok(`app/reports/data.ts: ${dataTs.includes(`slug: '${slug}'`) ? 'entry present' : 'INSERT FAILED'}`);

// ── 7. Insert/update entry in functions/api/_shared.js (paid only) ──────
if (cfg.access === 'paid') {
  const sharedPath = join(REPO, 'functions', 'api', '_shared.js');
  let shared = readFileSync(sharedPath, 'utf8');
  const jsEntry = renderJsEntry(cfg);
  shared = upsertInObjectLiteral(shared, 'export const REPORTS = {', slug, jsEntry);
  writeFileSync(sharedPath, shared);
  ok(`functions/api/_shared.js: entry upserted`);
}

// ── 7b. Optional: inject signal entry into app/signals/data.ts ───────────
if (cfg.signal) {
  const sigPath = join(REPO, 'app', 'signals', 'data.ts');
  let s = readFileSync(sigPath, 'utf8');
  const sigSlug = cfg.signal.slug || `${cfg.slug}-launch`;
  const entry = renderSignalEntry(cfg, cfg.signal, sigSlug);
  s = upsertInArrayLiteral(s, 'export const signals: SignalMeta[] = [', 'slug', sigSlug, entry);
  writeFileSync(sigPath, s);
  ok(`app/signals/data.ts: signal '${sigSlug}' upserted`);
}

// ── 7c. Optional: inject briefing entry into app/briefings/data.ts ───────
if (cfg.briefing) {
  const bpath = join(REPO, 'app', 'briefings', 'data.ts');
  let b = readFileSync(bpath, 'utf8');
  const entry = renderBriefingEntry(cfg.briefing);
  b = upsertInArrayLiteral(b, 'export const briefings: BriefingMeta[] = [', 'title', cfg.briefing.title, entry);
  writeFileSync(bpath, b);
  ok(`app/briefings/data.ts: briefing '${cfg.briefing.title}' upserted`);
}

// ── 8. Sync metadata (page count + reading time) ─────────────────────────
if (!opts.noSync) {
  info('Running sync-meta...');
  try { execSync('npm run sync-meta', { cwd: REPO, stdio: 'inherit' }); }
  catch { warn('sync-meta failed (continuing — you can run it manually).'); }
}

// ── 8b. Auto-draft a launch announcement (published reports only) ─────────
if (cfg.status === 'published' && !opts.dryRun) {
  const env = loadEnv();
  const url = env.SUPABASE_URL, key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    warn('Announcement draft skipped (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local to enable).');
  } else {
    try {
      const hdr = { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' };
      const listR = await fetch(`${url}/rest/v1/rpc/broadcast_list`, { method: 'POST', headers: hdr, body: '{}' });
      const existing = listR.ok ? await listR.json() : [];
      if (Array.isArray(existing) && existing.some((b) => b.report_slug === slug)) {
        info('Announcement draft already exists for this report — skipping.');
      } else {
        const subject = `New report — ${cfg.title}`;
        const body = `We've just published **${cfg.title}**.\n\n${cfg.subtitle}\n\n${cfg.summary}\n\nRead it here: [${cfg.title}](https://labs.techadyant.com/reports/${slug}/)\n\n— Techadyant Labs`;
        const saveR = await fetch(`${url}/rest/v1/rpc/broadcast_save`, { method: 'POST', headers: hdr,
          body: JSON.stringify({ p_id: null, p_subject: subject, p_body: body, p_segment: 'all', p_report_slug: slug }) });
        if (saveR.ok) ok('Draft announcement created → review & send at /admin/announcements');
        else warn(`Announcement draft failed: ${saveR.status} ${await saveR.text().catch(() => '')}`);
      }
    } catch (e) { warn(`Announcement draft error: ${e.message}`); }
  }
}

// ── 9. Show git status + next steps ──────────────────────────────────────
log('');
try { execSync('git status --short', { cwd: REPO, stdio: 'inherit' }); } catch {}
log('');
ok(`Report '${slug}' is staged. Next:`);
log(`  git add -A`);
log(`  git commit -m "publish: ${slug}"`);
log(`  git push origin main`);


// ════════════════════════ helpers ════════════════════════════════════════

function renderTsEntry(c) {
  const fields = [];
  fields.push(`    slug: ${q(c.slug)},`);
  fields.push(`    title: ${q(c.title)},`);
  fields.push(`    subtitle: ${q(c.subtitle)},`);
  fields.push(`    domain: ${q(c.domain)},`);
  fields.push(`    edition: ${q(c.edition)},`);
  fields.push(`    published: ${q(c.published)},`);
  fields.push(`    publishedLabel: ${q(c.publishedLabel)},`);
  fields.push(`    readingTime: ${q(c.readingTime || '— min read')},`);
  fields.push(`    status: ${q(c.status)},`);
  fields.push(`    accent: ${q(c.accent)},`);
  fields.push(`    summary:`);
  fields.push(`      ${q(c.summary)},`);
  fields.push(`    access: ${q(c.access)},`);
  if (c.access === 'paid') {
    fields.push(`    price: ${c.price},`);
    fields.push(`    currency: 'INR',`);
  }
  fields.push(`    hasPdf: ${c.hasPdf === false ? 'false' : 'true'},`);
  if (c.pages) fields.push(`    pages: ${c.pages},`);
  if (c._coverExt) fields.push(`    cover: ${q(`/covers/${c.slug}.${c._coverExt}`)},`);
  else if (c.cover) fields.push(`    cover: ${q(c.cover)},`);
  if (c.source?.preview || c.previewObject) {
    fields.push(`    previewObject: ${q(c.previewObject || `${c.slug}-preview.pdf`)},`);
  }
  if (c.previewPages) fields.push(`    previewPages: ${c.previewPages},`);
  return `  {\n${fields.join('\n')}\n  },`;
}

function renderJsEntry(c) {
  return `  '${c.slug}': {
    access: 'paid',
    priceInr: ${c.price},
    object: '${c.slug}.pdf',
    filename: '${c.downloadFilename || `${c.slug}.pdf`}',
    title: ${jq(c.title)},
  },`;
}

function renderSignalEntry(c, sig, sigSlug) {
  // sig: { no, title?, domain?, date?, dateLabel?, excerpt?, readingTime?, status?, takeaways?, body? }
  const title = sig.title || `New report: ${c.title}`;
  const domain = sig.domain || c.domain;
  const date = sig.date || c.published;
  const dateLabel = sig.dateLabel || c.publishedLabel;
  const status = sig.status || 'live';
  const readingTime = sig.readingTime || '2 min';
  const excerpt = sig.excerpt || `Our latest report — ${c.title} — is now available.`;
  const takeaways = sig.takeaways || [];
  const body = sig.body || [
    { type: 'p', text: c.summary },
    { type: 'p', text: `Read the full report at /reports/${c.slug}/.` },
  ];
  const fmtBody = (b) => {
    if (b.type === 'list') {
      return `      { type: 'list', items: [\n${b.items.map((it) => `        ${q(it)}`).join(',\n')}\n      ] }`;
    }
    return `      { type: ${q(b.type)}, text: ${q(b.text)} }`;
  };
  const tkBlock = takeaways.length
    ? `    takeaways: [\n${takeaways.map((t) => `      ${q(t)}`).join(',\n')}\n    ],\n`
    : '';
  const bodyBlock = body.length
    ? `    body: [\n${body.map(fmtBody).join(',\n')}\n    ],\n`
    : '';
  return `  {
    slug: ${q(sigSlug)},
    no: ${q(sig.no)},
    title: ${q(title)},
    domain: ${q(domain)},
    date: ${q(date)},
    dateLabel: ${q(dateLabel)},
    status: ${q(status)},
    readingTime: ${q(readingTime)},
    excerpt:
      ${q(excerpt)},
${tkBlock}${bodyBlock}  },`;
}

function renderBriefingEntry(b) {
  return `  {
    date: ${q(b.date)},
    title: ${q(b.title)},
    tag: ${q(b.tag)},
    read: ${q(b.read)},
    blurb:
      ${q(b.blurb)},
  },`;
}

// Single-quote a string for TS/JS source. Uses double quotes if the value contains a single quote.
function q(s) {
  if (typeof s !== 'string') return JSON.stringify(s);
  return s.includes("'") ? JSON.stringify(s) : `'${s}'`;
}
function jq(s) { return JSON.stringify(String(s)); }

/** Find an array literal that starts with `headerLine` (verbatim) and either
 *  update the entry whose `slug: '<slug>'` matches, or insert before the
 *  closing `];`. Brace-balanced — robust to multi-line entries.
 *
 *  Strategy: locate the literal `slug: '<slug>'` (or `slug: "<slug>"`)
 *  occurrence inside the array body, then walk backwards counting brackets
 *  to find the enclosing `{` of that entry. This avoids the "first `{`
 *  in body wins" bug a forward regex has. */
function upsertInArrayLiteral(src, headerLine, keyField, keyValue, newEntry) {
  const headerIdx = src.indexOf(headerLine);
  if (headerIdx < 0) throw new Error(`Could not find header line in target file: ${headerLine}`);
  const openIdx = src.indexOf('[', headerIdx + headerLine.length - 1);
  const closeIdx = matchBracket(src, openIdx, '[', ']');
  if (closeIdx < 0) throw new Error('Could not find matching ] for array');

  // Locate the key-field marker inside the body (try single, then double quotes).
  const bodyStart = openIdx + 1;
  const markers = [`${keyField}: '${keyValue}'`, `${keyField}: "${keyValue}"`];
  let slugAt = -1;
  for (const m of markers) {
    const i = src.indexOf(m, bodyStart);
    if (i >= 0 && i < closeIdx) { slugAt = i; break; }
  }

  if (slugAt < 0) {
    // No existing entry — insert before the closing `]`.
    let prefix = src.slice(0, closeIdx);
    const suffix = src.slice(closeIdx);
    if (!prefix.endsWith('\n')) prefix += '\n';
    return prefix + newEntry + '\n' + suffix;
  }

  // Walk back from slugAt, counting unmatched `}`, to find the entry's `{`.
  const absStart = findEnclosingOpen(src, slugAt, '{', '}', bodyStart);
  if (absStart < 0) throw new Error(`Could not find enclosing { for ${keyField}=${keyValue}`);
  const absEnd = matchBracket(src, absStart, '{', '}');
  if (absEnd < 0) throw new Error(`Could not find matching } for existing ${keyField}=${keyValue}`);
  // Expand the slice to the start of the line containing `{` so we don't
  // double-indent on re-runs (newEntry already starts with its own indent).
  let lineStart = absStart;
  while (lineStart > bodyStart && src[lineStart - 1] !== '\n') lineStart--;
  let end = absEnd + 1;
  if (src[end] === ',') end++;
  return src.slice(0, lineStart) + newEntry + src.slice(end);
}

/** Walk backward from idx to find the nearest unmatched `open` bracket
 *  (i.e. the one that encloses idx). Stops at `floor`. Returns -1 if none. */
function findEnclosingOpen(src, idx, open, close, floor = 0) {
  let depth = 0;
  let inStr = null;
  for (let i = idx; i >= floor; i--) {
    const c = src[i];
    // Note: backward string detection is imprecise but good enough for
    // our controlled JSON-like literals where slug strings are single-line.
    if (c === "'" || c === '"' || c === '`') {
      if (inStr === c) inStr = null;
      else if (!inStr) inStr = c;
      continue;
    }
    if (inStr) continue;
    if (c === close) depth++;
    else if (c === open) {
      if (depth === 0) return i;
      depth--;
    }
  }
  return -1;
}

/** Same as above but for an object literal like `export const REPORTS = { ... };`
 *  with entries keyed by `'<slug>': { ... }`. */
function upsertInObjectLiteral(src, headerLine, slug, newEntry) {
  const headerIdx = src.indexOf(headerLine);
  if (headerIdx < 0) throw new Error(`Could not find header line in target file: ${headerLine}`);
  const openIdx = src.indexOf('{', headerIdx + headerLine.length - 1);
  const closeIdx = matchBracket(src, openIdx, '{', '}');
  if (closeIdx < 0) throw new Error('Could not find matching } for object');
  const body = src.slice(openIdx + 1, closeIdx);
  const slugRe = new RegExp(`['"\`]${escapeRe(slug)}['"\`]\\s*:\\s*\\{`, 'm');
  const m = body.match(slugRe);
  if (m) {
    const absKeyStart = openIdx + 1 + body.indexOf(m[0]);
    const absBraceStart = src.indexOf('{', absKeyStart);
    const absBraceEnd = matchBracket(src, absBraceStart, '{', '}');
    if (absBraceEnd < 0) throw new Error(`Could not find matching } for existing slug ${slug}`);
    // Walk back to start of the key line
    let entryStart = absKeyStart;
    while (entryStart > 0 && src[entryStart - 1] !== '\n') entryStart--;
    let end = absBraceEnd + 1;
    if (src[end] === ',') end++;
    return src.slice(0, entryStart) + newEntry + src.slice(end);
  } else {
    const insertAt = closeIdx;
    let prefix = src.slice(0, insertAt);
    const suffix = src.slice(insertAt);
    if (!prefix.endsWith('\n')) prefix += '\n';
    return prefix + newEntry + '\n' + suffix;
  }
}

/** Find the matching close char for an open at startIdx, ignoring quoted strings. */
function matchBracket(src, startIdx, open, close) {
  if (src[startIdx] !== open) return -1;
  let depth = 0;
  let inStr = null;  // null | "'" | '"' | '`'
  let esc = false;
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    if (esc) { esc = false; continue; }
    if (inStr) {
      if (c === '\\') { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr = c; continue; }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function loadEnv() {
  const env = { ...process.env };
  const envPath = join(REPO, '.env.local');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
