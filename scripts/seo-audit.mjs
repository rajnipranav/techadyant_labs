/**
 * Manual SEO/GEO audit script for Techadyant Labs.
 *
 * Run: node scripts/seo-audit.mjs
 *
 * Reads GSC/OAuth/Bing/Ahrefs credentials from environment and prints a
 * plain-text report of issues and opportunities. Nothing is sent automatically.
 *
 * Required env vars:
 *   GSC_CLIENT_ID, GSC_CLIENT_SECRET, GSC_REFRESH_TOKEN, GSC_PROPERTY_URL
 * Optional:
 *   BING_API_KEY, AHREFS_API_TOKEN
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());

function loadEnv() {
  for (const f of ['.env', '.env.local']) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] = process.env[m[1]] || m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const hasGsc = !!(process.env.GSC_CLIENT_ID && process.env.GSC_CLIENT_SECRET && process.env.GSC_REFRESH_TOKEN && process.env.GSC_PROPERTY_URL);
const hasBing = !!process.env.BING_API_KEY;
const hasAhrefs = !!process.env.AHREFS_API_TOKEN;

function heading(t) { console.log(`\n=== ${t} ===`); }
function item(t) { console.log(`- ${t}`); }

async function getGscAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GSC_CLIENT_ID,
      client_secret: process.env.GSC_CLIENT_SECRET,
      refresh_token: process.env.GSC_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.access_token) throw new Error(`GSC token fetch failed: ${j?.error || res.status}`);
  return j.access_token;
}

async function gscRequest(token, url, method = 'GET', body) {
  const opts = {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  let j; try { j = JSON.parse(text); } catch { j = text; }
  if (!res.ok) throw new Error(`GSC ${url} failed: ${typeof j === 'string' ? j : j?.error?.message || res.status}`);
  return j;
}

async function auditGsc() {
  heading('Google Search Console');
  if (!hasGsc) { console.log('Skipped: missing GSC_* env vars.'); return; }
  const token = await getGscAccessToken();
  const site = encodeURIComponent(process.env.GSC_PROPERTY_URL);

  const [qry, idx, pages] = await Promise.all([
    gscRequest(token, `https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query?fields=query,clicks,impressions,ctr,position&rowLimit=10&startDate=2026-07-01&endDate=2026-08-10`, 'POST', { rowLimit: 10 }),
    gscRequest(token, `https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query?fields=query,clicks,impressions,ctr,position&rowLimit=10&startDate=2026-07-01&endDate=2026-08-10&dimensions=page`, 'POST', { rowLimit: 10 }),
    gscRequest(token, `https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query?fields=query,clicks,impressions,ctr,position&rowLimit=10&startDate=2026-07-01&endDate=2026-08-10&dimensions=page&aggregationType=auto`, 'POST', { rowLimit: 10 }),
  ]);

  console.log('Top queries (last ~6 weeks):');
  for (const r of qry.rows || []) {
    item(`${r.query} | clicks=${r.clicks} imps=${r.impressions} ctr=${(r.ctr * 100).toFixed(1)}% pos=${r.position.toFixed(1)}`);
  }

  console.log('Top pages (last ~6 weeks):');
  for (const r of pages.rows || []) {
    item(`${r.keys?.[0] || '(unknown)'} | clicks=${r.clicks} imps=${r.impressions}`);
  }
}

async function auditBing() {
  heading('Bing Webmaster');
  if (!hasBing) { console.log('Skipped: missing BING_API_KEY.'); return; }
  const siteUrl = process.env.GSC_PROPERTY_URL || 'https://labs.techadyant.com/';
  const enc = encodeURIComponent(siteUrl);
  const q = `api.from('cms_reports').select('*')`;
  // Use Bing Webmaster API: get crawl issues if available
  const url = `https://ssl.bing.com/webmaster/api.svc/json/GetUrlIssues?siteUrl=${enc}&key=${process.env.BING_API_KEY}`;
  const res = await fetch(url);
  const text = await res.text();
  let j; try { j = JSON.parse(text); } catch { j = text; }
  if (!res.ok) { console.log(`Bing request failed: ${typeof j === 'string' ? j : j?.Message || res.status}`); return; }
  const issues = j?.d?.UrlIssues || j?.UrlIssues || [];
  console.log(`Bing URL issues: ${issues.length}`);
  for (const issue of issues.slice(0, 20)) {
    item(`${issue.Url || '(unknown)'} | ${issue.Message || issue.Issue || JSON.stringify(issue).slice(0, 120)}`);
  }
}

async function auditAhrefs() {
  heading('Ahrefs');
  if (!hasAhrefs) { console.log('Skipped: missing AHREFS_API_TOKEN.'); return; }
  // Minimal live/backlink check using Ahrefs site audit-like endpoint if available; otherwise print fallback.
  console.log('Ahrefs API token detected. Run these manually in Ahrefs if needed:');
  item('Site Audit → https://ahrefs.com/site-audit');
  item('Site Explorer → https://ahrefs.com/site-explorer');
  item('Keywords Explorer → https://ahrefs.com/keywords-explorer');
}

async function auditLocalSeo() {
  heading('Local SEO / GEO checklist');
  const reports = await import('../reports/data.ts').catch(() => ({ default: { reports: [] } }));
  const data = reports.default || {};
  const list = Array.isArray(data.reports) ? data.reports : [];
  const published = list.filter((r) => r.status === 'published');
  const noSummary = published.filter((r) => !r.summary || r.summary.trim().length < 80);
  const noKeywords = published.filter((r) => !Array.isArray(r.keywords) || !r.keywords.length);
  const badSlug = published.filter((r) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.slug));
  const duplicateSlugs = published.map((r) => r.slug).filter((x, i, arr) => arr.indexOf(x) !== i);
  const missingPdfFree = published.filter((r) => r.access === 'free' && !r.hasPdf && !r.preview_object);
  const longSummaries = published.filter((r) => (r.summary || '').length > 1000);

  item(`Published reports: ${published.length}`);
  if (noSummary.length) item(`Short/missing summary (${noSummary.length}): ${noSummary.map(r => r.slug).join(', ')}`);
  if (noKeywords.length) item(`Missing keywords (${noKeywords.length}): ${noKeywords.map(r => r.slug).join(', ')}`);
  if (badSlug.length) item(`Bad slug pattern (${badSlug.length}): ${badSlug.map(r => r.slug).join(', ')}`);
  if (duplicateSlugs.length) item(`Duplicate slugs: ${[...new Set(duplicateSlugs)].join(', ')}`);
  if (missingPdfFree.length) item(`Free report missing PDF/preview (${missingPdfFree.length}): ${missingPdfFree.map(r => r.slug).join(', ')}`);
  if (longSummaries.length) item(`Very long summary (${longSummaries.length}): ${longSummaries.map(r => r.slug).join(', ')}`);
}

async function main() {
  console.log('Techadyant Labs manual SEO/GEO audit');
  console.log('Run this whenever you want: node scripts/seo-audit.mjs');
  await Promise.all([auditLocalSeo(), auditGsc(), auditBing(), auditAhrefs()]);
  console.log('\nDone.\n');
}

main().catch((e) => { console.error('Audit failed:', e.message); process.exit(1); });
