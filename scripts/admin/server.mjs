#!/usr/bin/env node
/**
 * Techadyant Labs — local report-publishing admin.
 * Dependency-free. Run from the repo root:
 *     node scripts/admin/server.mjs
 * then open http://localhost:4321
 *
 * It serves the dashboard and patches the repo so a new report is wired into:
 *   - app/reports/data.ts                       (catalogue entry)
 *   - functions/api/_shared.js                  (server REPORTS map: price + storage object)
 *   - app/reports/content/<slug>.tsx            (optional online reading version)
 *   - app/reports/[slug]/page.tsx               (registry import + entry, if content added)
 *   - public/covers/<slug>.<ext>                (cover image, if uploaded)
 * Supabase PDF uploads are done by you, separately, before using this.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');               // repo root
const P = {
  data: path.join(ROOT, 'app', 'reports', 'data.ts'),
  shared: path.join(ROOT, 'functions', 'api', '_shared.js'),
  slugPage: path.join(ROOT, 'app', 'reports', '[slug]', 'page.tsx'),
  contentDir: path.join(ROOT, 'app', 'reports', 'content'),
  coversDir: path.join(ROOT, 'public', 'covers'),
};
const PORT = 4321;

/* ---------- helpers ---------- */
const read = (f) => fs.readFileSync(f, 'utf8');
const write = (f, s) => fs.writeFileSync(f, s, 'utf8');
const backup = (f) => { try { fs.copyFileSync(f, f + '.bak'); } catch {} };
// safe single-quoted TS/JS string literal
const q = (s) => "'" + String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ') + "'";
const slugify = (s) => String(s).toLowerCase().trim()
  .replace(/[’']/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function existingSlugs() {
  const t = read(P.data);
  return [...t.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
}

/* ---------- mutations ---------- */
function insertDataEntry(r) {
  const t = read(P.data);
  const anchor = 'const baseReports: ReportMeta[] = [';
  if (!t.includes(anchor)) throw new Error('data.ts anchor not found');
  const L = [];
  L.push('  {');
  L.push(`    slug: ${q(r.slug)},`);
  L.push(`    title: ${q(r.title)},`);
  L.push(`    subtitle: ${q(r.subtitle)},`);
  L.push(`    domain: ${q(r.domain)},`);
  L.push(`    edition: ${q(r.edition)},`);
  L.push(`    published: ${q(r.published)},`);
  L.push(`    publishedLabel: ${q(r.publishedLabel)},`);
  L.push(`    readingTime: ${q(r.readingTime)},`);
  L.push(`    status: ${q(r.status)},`);
  L.push(`    accent: ${q(r.accent)},`);
  L.push(`    summary:`);
  L.push(`      ${q(r.summary)},`);
  L.push(`    access: ${q(r.access)},`);
  if (r.access === 'paid') { L.push(`    price: ${Number(r.price) || 4900},`); L.push(`    currency: 'INR',`); }
  L.push(`    hasPdf: ${r.hasPdf ? 'true' : 'false'},`);
  if (r.pages) L.push(`    pages: ${Number(r.pages)},`);
  if (r.cover) L.push(`    cover: ${q(r.cover)},`);
  if (r.previewObject) L.push(`    previewObject: ${q(r.previewObject)},`);
  if (r.previewPages) L.push(`    previewPages: ${Number(r.previewPages)},`);
  L.push('  },');
  const block = L.join('\n') + '\n';
  backup(P.data);
  write(P.data, t.replace(anchor, anchor + '\n' + block));
  return 'app/reports/data.ts';
}

function insertSharedEntry(r) {
  const t = read(P.shared);
  const anchor = 'export const REPORTS = {';
  if (!t.includes(anchor)) throw new Error('_shared.js REPORTS anchor not found');
  const L = [];
  L.push(`  ${q(r.slug)}: {`);
  L.push(`    access: ${q(r.access)},`);
  if (r.access === 'paid') L.push(`    priceInr: ${Number(r.price) || 4900},`);
  if (r.access === 'free') { L.push(`    bucket: ${q(r.freeBucket || 'reports-free')},`); L.push('    publicBucket: true,'); }
  L.push(`    object: ${q(r.object || (r.slug + '.pdf'))},`);
  L.push(`    filename: ${q(r.downloadName || (r.slug + '.pdf'))},`);
  L.push(`    title: ${q(r.title)},`);
  L.push('  },');
  const block = L.join('\n') + '\n';
  backup(P.shared);
  write(P.shared, t.replace(anchor, anchor + '\n' + block));
  return 'functions/api/_shared.js';
}

function writeContentComponent(r) {
  // r.sections = [{label, html}]
  const secs = (r.sections || []).filter((s) => s.label && s.html);
  const toc = secs.map((s) => ({ id: slugify(s.label), label: s.label }));
  const tocLines = toc.map((s) => `  { id: ${q(s.id)}, label: ${q(s.label)} },`).join('\n');
  const body = secs.map((s) => {
    const id = slugify(s.label);
    const html = JSON.stringify(s.html); // safe JS string for dangerouslySetInnerHTML
    return `      <section id=${q(id)}>\n        <h2>${s.label.replace(/</g, '&lt;')}</h2>\n        <div dangerouslySetInnerHTML={{ __html: ${html} }} />\n      </section>`;
  }).join('\n');
  const tsx = `import type { TocItem } from '../../components/ReportReader';\n\n` +
    `// Generated by scripts/admin. Free online reading version. Hand-edit to add SVG figures.\n` +
    `export const toc: TocItem[] = [\n${tocLines}\n];\n\n` +
    `export function ReportContent() {\n  return (\n    <>\n${body}\n    </>\n  );\n}\n`;
  const file = path.join(P.contentDir, r.slug + '.tsx');
  write(file, tsx);
  // register in [slug]/page.tsx
  const pg = read(P.slugPage);
  const importAnchor = "import { ReportContent as AiTransitionContent, toc as aiTransitionToc } from '../content/india-ai-industrial-transition-2026-2035';";
  const camel = r.slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  const Cn = camel.charAt(0).toUpperCase() + camel.slice(1);
  const importLine = `import { ReportContent as ${Cn}Content, toc as ${camel}Toc } from '../content/${r.slug}';`;
  const regAnchor = "const registry: Record<string, ReportModule> = {";
  const regLine = `  ${q(r.slug)}: { toc: ${camel}Toc, Content: ${Cn}Content },`;
  let np = pg;
  if (!np.includes(importLine)) np = np.replace(importAnchor, importAnchor + '\n' + importLine);
  if (!np.includes(regLine)) np = np.replace(regAnchor, regAnchor + '\n' + regLine);
  backup(P.slugPage);
  write(P.slugPage, np);
  return [`app/reports/content/${r.slug}.tsx`, 'app/reports/[slug]/page.tsx'];
}

function saveCover(r) {
  if (!r.coverDataUrl) return null;
  const m = /^data:image\/(png|jpe?g|webp);base64,(.+)$/i.exec(r.coverDataUrl);
  if (!m) return null;
  const ext = m[1].toLowerCase() === 'jpeg' ? 'jpg' : m[1].toLowerCase();
  const file = path.join(P.coversDir, `${r.slug}.${ext}`);
  fs.writeFileSync(file, Buffer.from(m[2], 'base64'));
  return `public/covers/${r.slug}.${ext}`;
}

function gitCommit(slug, files) {
  execFileSync('git', ['add', '-A'], { cwd: ROOT });
  execFileSync('git', ['commit', '-m', `Add report: ${slug}`], { cwd: ROOT });
  return true;
}

/* ---------- request handling ---------- */
function mdToHtml(md) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s) => esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  const out = [];
  for (const b0 of md.replace(/\r/g, '').split(/\n\s*\n/)) {
    const b = b0.trim(); if (!b) continue;
    if (/^###\s+/.test(b)) out.push('<h3>' + inline(b.replace(/^###\s+/, '')) + '</h3>');
    else if (/^##?\s+/.test(b)) { const x = b.replace(/^##?\s+/, ''); out.push('<h2 id="' + slugify(x) + '">' + inline(x) + '</h2>'); }
    else if (/^[-*]\s+/m.test(b)) out.push('<ul>' + b.split(/\n/).filter((l) => /^[-*]\s+/.test(l)).map((l) => '<li>' + inline(l.replace(/^[-*]\s+/, '')) + '</li>').join('') + '</ul>');
    else out.push('<p>' + inline(b).replace(/\n/g, ' ') + '</p>');
  }
  return out.join('\n');
}

function registerContentTsx(slug, tsx) {
  write(path.join(P.contentDir, slug + '.tsx'), tsx);
  const pg = read(P.slugPage);
  const importAnchor = "import { ReportContent as AiTransitionContent, toc as aiTransitionToc } from '../content/india-ai-industrial-transition-2026-2035';";
  const camel = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  const Cn = camel.charAt(0).toUpperCase() + camel.slice(1);
  const importLine = `import { ReportContent as ${Cn}Content, toc as ${camel}Toc } from '../content/${slug}';`;
  const regLine = `  ${q(slug)}: { toc: ${camel}Toc, Content: ${Cn}Content },`;
  let np = pg;
  if (!np.includes(importLine)) np = np.replace(importAnchor, importAnchor + '\n' + importLine);
  if (!np.includes(regLine)) np = np.replace('const registry: Record<string, ReportModule> = {', 'const registry: Record<string, ReportModule> = {' + '\n' + regLine);
  backup(P.slugPage); write(P.slugPage, np);
  return [`app/reports/content/${slug}.tsx`, 'app/reports/[slug]/page.tsx'];
}

function writeContentFromMarkup(r) {
  let html = (r.markupFormat === 'html') ? r.markup : mdToHtml(r.markup);
  const toc = [];
  html = html.replace(/<h2(?:\s+id="([^"]*)")?\s*>([\s\S]*?)<\/h2>/g, (m, id, inner) => {
    const label = inner.replace(/<[^>]+>/g, '').trim();
    const theId = id || slugify(label); toc.push({ id: theId, label });
    return `<h2 id="${theId}">${inner}</h2>`;
  });
  const tocLines = toc.map((s) => `  { id: ${q(s.id)}, label: ${q(s.label)} },`).join('\n');
  const tsx = `import type { TocItem } from '../../components/ReportReader';\n\n` +
    `// Generated by scripts/admin from pasted Markdown/HTML. Hand-edit to add SVG figures.\n` +
    `export const toc: TocItem[] = [\n${tocLines}\n];\n\n` +
    `export function ReportContent() {\n  return (\n    <div className="report-richtext" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(html)} }} />\n  );\n}\n`;
  return registerContentTsx(r.slug, tsx);
}

function addReport(r) {
  const warnings = [], changed = [];
  if (!r.slug) r.slug = slugify(r.title || '');
  if (!r.slug) throw new Error('slug/title required');
  if (existingSlugs().includes(r.slug)) throw new Error(`slug "${r.slug}" already exists`);
  if (!r.publishedLabel) r.publishedLabel = r.status === 'forthcoming' ? 'Forthcoming'
    : new Date(r.published || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  changed.push(insertDataEntry(r));
  if (r.hasPdf) changed.push(insertSharedEntry(r));
  else warnings.push('hasPdf is false — no _shared.js (purchase/download) entry written.');
  if (r.includeReading && r.markup && r.markup.trim()) {
    for (const f of writeContentFromMarkup(r)) changed.push(f);
  } else if (r.includeReading && (r.sections || []).some((s) => s.label && s.html)) {
    for (const f of writeContentComponent(r)) changed.push(f);
  }
  const cov = saveCover(r); if (cov) changed.push(cov);

  let committed = false;
  if (r.commit) { try { committed = gitCommit(r.slug, changed); } catch (e) { warnings.push('git commit failed: ' + e.message); } }
  return { ok: true, slug: r.slug, changed, warnings, committed };
}

const send = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(read(path.join(__dirname, 'index.html')));
  }
  if (req.method === 'GET' && req.url === '/api/state') {
    try { return send(res, 200, { ok: true, slugs: existingSlugs(), root: ROOT }); }
    catch (e) { return send(res, 500, { ok: false, error: e.message }); }
  }
  if (req.method === 'POST' && req.url === '/api/add') {
    let buf = '';
    req.on('data', (c) => { buf += c; if (buf.length > 30e6) req.destroy(); });
    req.on('end', () => {
      try { return send(res, 200, addReport(JSON.parse(buf))); }
      catch (e) { return send(res, 400, { ok: false, error: e.message }); }
    });
    return;
  }
  send(res, 404, { ok: false, error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`\n  Techadyant Labs admin → http://localhost:${PORT}\n  Repo: ${ROOT}\n  (Ctrl+C to stop)\n`);
});
