#!/usr/bin/env node
/**
 * Google Search Console report (Route A).
 *
 * Usage:
 *   1. One-time credential setup (see SEOGEO-CONNECTIONS.md):
 *      - Google Cloud project with the "Search Console API" enabled
 *      - OAuth 2.0 Client ID of type "Desktop app"
 *      - Save the downloaded file as seo-credentials/gsc-client-secret.json
 *      - Add the consent account as a user of the Search Console property
 *   2. Run: node scripts/gsc-report.mjs
 *      First run opens the browser for one-time Google authorisation;
 *      the token is cached in seo-tokens/gsc-token.json (gitignored).
 *
 * Output: seo-reports/gsc-YYYY-MM-DD.md (top queries, top pages, CTR
 * opportunities) plus a console summary.
 *
 * Env (all optional):
 *   GSC_SITE            default: sc-domain:labs.techadyant.com
 *   GSC_CLIENT_SECRET   path to client_secret.json
 *   GSC_OAUTH_PORT      default: 18345
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import * as path from 'node:path';
import * as os from 'node:os';

const ROOT = path.resolve(process.cwd());
const SITE = process.env.GSC_SITE || ''; // empty = auto-discover from the account\'s properties
const DEFAULT_HOST = 'labs.techadyant.com';
const PORT = Number(process.env.GSC_OAUTH_PORT || 18345);
const SECRET_PATH = process.env.GSC_CLIENT_SECRET || path.join(ROOT, 'seo-credentials', 'gsc-client-secret.json');
const TOKEN_PATH = path.join(ROOT, 'seo-tokens', 'gsc-token.json');
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

function loadEnv() {
  for (const f of ['.env', '.env.local']) {
    const p = path.join(ROOT, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] = process.env[m[1]] || m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

if (!existsSync(SECRET_PATH)) {
  console.error('Missing Google OAuth client secret.');
  console.error('Expected at:', SECRET_PATH);
  console.error('Setup (3 steps, ~5 minutes):');
  console.error('  1. https://console.cloud.google.com -> create/select a project');
  console.error('  2. Enable the "Search Console API" (APIs & Services > Library)');
  console.error('  3. Credentials > Create Credentials > OAuth client ID > Desktop app > Download JSON');
  console.error('     Save the downloaded file to seo-credentials/gsc-client-secret.json');
  console.error('  4. In Search Console: Settings > Users and permissions -> add the Google account you will authorise with.');
  process.exit(1);
}
const secret = JSON.parse(readFileSync(SECRET_PATH, 'utf8'));
const { client_id, client_secret } = secret.installed || secret.web || secret;

function loadToken() {
  if (!existsSync(TOKEN_PATH)) return null;
  try { return JSON.parse(readFileSync(TOKEN_PATH, 'utf8')); } catch { return null; }
}
function saveToken(t) { mkdirSync(path.dirname(TOKEN_PATH), { recursive: true }); writeFileSync(TOKEN_PATH, JSON.stringify(t, null, 2)); }

async function exchange(code, verifier) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code, client_id, client_secret, code_verifier: verifier,
      redirect_uri: `http://localhost:${PORT}/callback`,
      grant_type: 'authorization_code',
    }),
  });
  const t = await res.json();
  if (!t.access_token) throw new Error(`token exchange failed: ${JSON.stringify(t)}`);
  t.expires_at = Date.now() + (t.expires_in || 3600) * 1000;
  return t;
}

async function refresh(t) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: t.refresh_token, client_id, client_secret, grant_type: 'refresh_token',
    }),
  });
  const r = await res.json();
  if (!r.access_token) throw new Error(`token refresh failed: ${JSON.stringify(r)}`);
  t.access_token = r.access_token;
  t.expires_at = Date.now() + (r.expires_in || 3600) * 1000;
  return t;
}

function openBrowser(url) {
  try {
    // Windows: never pass the raw URL through cmd /c start - the '&' in the
    // query string is treated as a command separator and truncates the URL.
    // Use PowerShell Start-Process with the URL as a single quoted argument.
    if (process.platform === 'win32') spawn('powershell', ['-NoProfile', '-WindowStyle', 'Hidden', '-Command', `Start-Process '${url.replace(/'/g, "''")}'`], { detached: true, stdio: 'ignore' }).unref();
    else if (process.platform === 'darwin') spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    else spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
  } catch { /* printed URL is the fallback */ }
}

async function authorize() {
  const state = randomBytes(16).toString('hex');
  // RFC 7636 PKCE with S256 - Google rejects 'plain' and requires the
  // code_verifier to be sent at the token exchange step.
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
    client_id, redirect_uri: `http://localhost:${PORT}/callback`,
    response_type: 'code', scope: SCOPE, state, access_type: 'offline',
    prompt: 'consent', code_challenge: challenge, code_challenge_method: 'S256',
  });
  const token = await new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      const u = new URL(req.url, `http://localhost:${PORT}`);
      if (u.pathname !== '/callback') { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body style="font-family:sans-serif;padding:40px"><h2>Techadyant GSC report</h2><p>Authorisation complete. You can close this tab and return to the terminal.</p></body></html>');
      server.close();
      if (u.searchParams.get('state') !== state) return reject(new Error('state mismatch'));
      const code = u.searchParams.get('code');
      if (!code) return reject(new Error('no code in callback'));
      try { resolve(await exchange(code, verifier)); } catch (e) { reject(e); }
    });
    server.listen(PORT, '127.0.0.1', () => { console.log('Open this URL in your browser (opening automatically...):\n' + url + '\n'); openBrowser(url); });
  });
  saveToken(token);
  return token;
}

async function getToken() {
  let t = loadToken();
  if (t && t.refresh_token && (!t.expires_at || t.expires_at < Date.now() + 60_000)) t = await refresh(t);
  if (t && t.access_token) return t;
  return authorize();
}

async function gscFetch(token, site, endpoint, body) {
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status === 403) throw new Error(`Access denied for property ${site}: the authorised account is not a user of it, or the API is not enabled.`);
  if (res.status === 404) throw new Error(`Property not found: ${site}. Check GSC_SITE (e.g. https://labs.techadyant.com/ or sc-domain:labs.techadyant.com).`);
  if (!res.ok) throw new Error(`GSC API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

// Find the Search Console property for our host from the account's site list.
// Handles both URL-prefix (https://labs.techadyant.com/) and domain
// (sc-domain:labs.techadyant.com) property types.
async function discoverSite(token) {
  const res = await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`GSC sites list ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  const sites = (j.siteEntry || []).map((s) => s.siteUrl);
  const domain = sites.find((u) => u === `sc-domain:${DEFAULT_HOST}`);
  if (domain) return domain;
  const prefix = sites.find((u) => u.includes(`//${DEFAULT_HOST}`));
  if (prefix) return prefix;
  throw new Error(`No Search Console property found for ${DEFAULT_HOST}. Account properties: ${sites.join(', ') || '(none)'}. Add the property at search.google.com/search-console first.`);
}

const days = 27;
const end = new Date();
const start = new Date(Date.now() - days * 86_400_000);
const iso = (d) => d.toISOString().slice(0, 10);
const row = (r) => ({ keys: r.keys?.join(' / ') || '?', clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position });

function mdTable(headers, rows) {
  const esc = (v) => String(v ?? '').replace(/\|/g, '\\|');
  const fmt = (v, i) => {
    if (typeof v !== 'number') return esc(v);
    if (headers[i] === 'CTR') return (v * 100).toFixed(1) + '%';
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  };
  const lines = [['| ' + headers.join(' | ') + ' |'], ['|' + headers.map(() => '---').join('|') + '|']];
  for (const r of rows) lines.push('| ' + r.map(fmt).join(' | ') + ' |');
  return lines.join('\n');
}

async function main() {
  const token = (await getToken()).access_token;
  const site = SITE || (await discoverSite(token));
  console.log('Using Search Console property:', site);
  const q = { startDate: iso(start), endDate: iso(end) };
  const [queries, pages, agg] = await Promise.all([
    gscFetch(token, site, 'searchAnalytics/query', { ...q, dimensions: ['query'], rowLimit: 25 }),
    gscFetch(token, site, 'searchAnalytics/query', { ...q, dimensions: ['page'], rowLimit: 25 }),
    gscFetch(token, site, 'searchAnalytics/query', { ...q, rowLimit: 1 }),
  ]);
  const qRows = (queries.rows || []).map(row);
  const pRows = (pages.rows || []).map(row);
  const a = agg.rows?.[0] || {};
  const opps = pRows.filter((r) => r.impressions >= 100 && r.ctr < 0.02).sort((x, y) => y.impressions - x.impressions).slice(0, 10);
  const qT = qRows.map((r) => [r.keys, r.clicks, r.impressions, r.ctr, r.position]);
  const pT = pRows.map((r) => [r.keys, r.clicks, r.impressions, r.ctr, r.position]);

  const today = new Date().toISOString().slice(0, 10);
  const outPath = path.join(ROOT, 'seo-reports', `gsc-${today}.md`);
  const md = [
    `# Google Search Console report - ${iso(start)} to ${iso(end)}`,
    '',
    `**Property:** ${site}  `,
    `**Totals:** ${a.clicks ?? 0} clicks · ${a.impressions ?? 0} impressions · ${((a.ctr || 0) * 100).toFixed(1)}% CTR · avg position ${(a.position || 0).toFixed(1)}`,
    '',
    '## Top queries',
    mdTable(['Query', 'Clicks', 'Impressions', 'CTR', 'Position'], qT),
    '',
    '## Top pages',
    mdTable(['Page', 'Clicks', 'Impressions', 'CTR', 'Position'], pT),
    '',
    '## CTR opportunities (≥100 impressions, CTR < 2%)',
    opps.length ? mdTable(['Page', 'Impressions', 'CTR'], opps.map((r) => [r.keys, r.impressions, r.ctr])) : '_None this period._',
    '',
    `_Generated by scripts/gsc-report.mjs on ${new Date().toISOString()}._`,
    '',
  ].join('\n');
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, md, 'utf8');
  console.log(`\nGSC report written: ${outPath}`);
  console.log(`Totals: ${a.clicks ?? 0} clicks, ${a.impressions ?? 0} impressions, CTR ${((a.ctr || 0) * 100).toFixed(1)}%, pos ${(a.position || 0).toFixed(1)}`);
  console.log('Top query:', qRows[0]?.keys, `(${qRows[0]?.clicks ?? 0} clicks)`);
}

main().catch((e) => { console.error('\nGSC report failed:', e.message); process.exit(1); });
