#!/usr/bin/env node
/**
 * IndexNow auto-submitter — runs as a `postbuild` step on every deploy.
 *
 * Reads the freshly-generated out/sitemap.xml and pings IndexNow (Bing,
 * Yandex, et al.) with URLs whose <lastmod> is recent — i.e. newly
 * published reports / signals / newsletter issues — plus the hub pages
 * when there is fresh content. This makes new reports get indexed fast
 * without re-spamming the whole site on unrelated deploys.
 *
 * Behaviour:
 *   node scripts/indexnow-submit.mjs           → submit only recent URLs
 *   node scripts/indexnow-submit.mjs --all     → submit every URL in the sitemap
 *
 * Config (env, all optional):
 *   INDEXNOW_KEY            default: 7acc3e38d0a646faba6093075235e9ab (public)
 *   INDEXNOW_MAX_AGE_DAYS   default: 7
 *   INDEXNOW_DISABLE=1      skip entirely
 *
 * Never throws: a failed ping must not fail the site build.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const HOST = 'labs.techadyant.com';
const KEY = process.env.INDEXNOW_KEY || '7acc3e38d0a646faba6093075235e9ab';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const MAX_AGE_DAYS = Number(process.env.INDEXNOW_MAX_AGE_DAYS || 7);
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const ALL = process.argv.includes('--all');

const log = (...a) => console.log('[indexnow]', ...a);

async function main() {
  if (process.env.INDEXNOW_DISABLE === '1') return log('disabled via INDEXNOW_DISABLE');

  const sitemapPath = ['out/sitemap.xml', 'out/sitemap.xml/index.html', '.next/server/app/sitemap.xml.body']
    .map((p) => resolve(process.cwd(), p))
    .find((p) => existsSync(p));
  if (!sitemapPath) return log('no sitemap.xml found after build — skipping');

  const xml = readFileSync(sitemapPath, 'utf8');
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const block = m[1];
    const loc = (block.match(/<loc>(.*?)<\/loc>/) || [])[1];
    const lastmod = (block.match(/<lastmod>(.*?)<\/lastmod>/) || [])[1];
    return { loc, lastmod };
  }).filter((e) => e.loc);

  if (!entries.length) return log('sitemap had no <url> entries — skipping');

  let urls;
  if (ALL) {
    urls = entries.map((e) => e.loc);
    log(`--all: submitting all ${urls.length} URLs`);
  } else {
    const cutoff = Date.now() - MAX_AGE_DAYS * 86400_000;
    const isDetail = (u) => /\/(reports|signals|newsletter)\/[^/]+\/?$/.test(u);
    const fresh = entries.filter((e) => {
      const t = e.lastmod ? Date.parse(e.lastmod) : NaN;
      return isDetail(e.loc) && Number.isFinite(t) && t >= cutoff;
    }).map((e) => e.loc);

    if (!fresh.length) return log(`no content newer than ${MAX_AGE_DAYS}d — nothing to submit`);

    // Fresh content means the hubs changed too — include them so listings re-crawl.
    const hubs = [
      `https://${HOST}/`,
      `https://${HOST}/reports`,
      `https://${HOST}/signals`,
      `https://${HOST}/newsletter`,
    ];
    urls = [...new Set([...fresh, ...hubs.filter((h) => entries.some((e) => e.loc === h))])];
    log(`fresh content: ${fresh.length} detail URL(s) + hubs → ${urls.length} total`);
  }

  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls });
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    });
    log(`submitted ${urls.length} URL(s) → HTTP ${res.status} ${res.statusText}`);
    if (res.status >= 400) log('non-2xx response — submission may have been rejected (build NOT failed)');
  } catch (err) {
    log('submission failed (ignored, build continues):', err?.message || err);
  }
}

main().catch((e) => log('unexpected error (ignored):', e?.message || e));
