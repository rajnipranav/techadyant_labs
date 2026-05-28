#!/usr/bin/env node
/**
 * Read every PDF under <root> and produce app/reports/report-meta.json:
 *   { "<slug>": { pages, words, readingMinutes, readingTime, syncedAt } }
 *
 * Slug = PDF filename without ".pdf", lowercased. Match the same slug used
 * in app/reports/data.ts and functions/api/_shared.js.
 *
 * Usage:
 *   npm run sync-meta
 *   npm run sync-meta -- "D:/path/to/Research Reports"
 *   REPORTS_PDF_DIR="D:/..." npm run sync-meta
 *
 * Reading speed: 220 words/minute (a publication-friendly speed for dense
 * but well-structured analytical writing). Adjust WPM below if needed.
 *
 * readingTime format:
 *   < 60 min  →  "X min read"
 *   ≥ 60 min  →  "Xh Ym read"  (omits "0m" so "2h read" is possible)
 */
import { readFileSync, writeFileSync, statSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, basename, dirname } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

const DEFAULT_ROOT = 'D:\\techadyant\\labs\\Research Reports';
const ROOT = process.argv[2] || process.env.REPORTS_PDF_DIR || DEFAULT_ROOT;
const OUT = resolve(process.cwd(), 'app/reports/report-meta.json');
const WPM = 220;

function formatReadingTime(minutes) {
  if (minutes < 60) return `${minutes} min read`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h read` : `${h}h ${m}m read`;
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, acc);
    else if (name.toLowerCase().endsWith('.pdf')) acc.push(p);
  }
  return acc;
}

async function main() {
  console.log(`Scanning: ${ROOT}`);
  if (!existsSync(ROOT)) {
    console.error(`Folder not found: ${ROOT}`);
    console.error('Pass a path: npm run sync-meta -- "C:/path/to/PDFs"');
    process.exit(1);
  }

  const files = walk(ROOT);
  if (!files.length) console.warn('No .pdf files found.');

  let out = {};
  if (existsSync(OUT)) {
    try { out = JSON.parse(readFileSync(OUT, 'utf8')); } catch {}
  }

  for (const f of files) {
    const slug = basename(f, '.pdf').toLowerCase();
    try {
      const buf = readFileSync(f);
      const data = await pdfParse(buf);
      const pages = data.numpages || 0;
      const text = (data.text || '').replace(/\s+/g, ' ').trim();
      const words = text ? text.split(' ').length : 0;
      const minutes = Math.max(1, Math.round(words / WPM));
      const readingTime = formatReadingTime(minutes);
      out[slug] = {
        pages,
        words,
        readingMinutes: minutes,
        readingTime,
        wpm: WPM,
        sourceFile: basename(f),
        syncedAt: new Date().toISOString(),
      };
      console.log(`  ${slug}: ${pages}p, ${words.toLocaleString()}w  ->  ${readingTime}`);
    } catch (e) {
      console.warn(`  ${slug}: failed (${e.message})`);
    }
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`\nWrote ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
