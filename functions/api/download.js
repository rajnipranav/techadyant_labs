/**
 * Secure report delivery from Cloudflare R2 — Pages Function.
 *
 * GET /api/download?report=<slug>[&asset=deck]
 *   Auth + entitlement checks stay on Supabase (Postgres) — unchanged.
 *   File bytes are served from R2:
 *     - Paid → a short-lived R2 presigned S3 URL is returned as { url, filename };
 *              the browser navigates to it. Same contract as before → no frontend change.
 *     - Free → the public R2 custom-domain URL. (In practice free reports and paid
 *              free-previews are served directly from cms_reports.preview_object on the
 *              report page and do NOT route through here; this path is a safe fallback.)
 *
 * Env (Pages → Settings → Environment variables):
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   — auth + entitlements (unchanged)
 *   R2_S3_ENDPOINT     — https://<accountid>.r2.cloudflarestorage.com
 *   R2_ACCESS_KEY_ID   — R2 S3 API token (Object Read is enough)
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET          — private bucket holding paid PDFs/decks, e.g. techadyant-reports
 *   R2_PUBLIC_BASE     — public bucket custom domain, e.g. https://library.techadyant.com
 *   R2_FREE_PREFIX     — (optional) folder prefix for free PDFs in the public bucket.
 *                        Defaults to "free reports". Set to "" for bucket root.
 *
 * Diagnostics:
 *   ?probe=1     → env presence + code version, no outbound calls
 *   ?probe=key   → show the R2 object key + fully-encoded key for &report=, no signing
 */
import { AwsClient } from 'aws4fetch';
import { REPORTS, json } from './_shared.js';

const CODE_VERSION = 'download-r2-v1';
const TTL = 90; // presigned-URL lifetime, seconds

/**
 * RFC 3986 percent-encoding of an S3 object key, preserving "/" between path
 * segments. This matches the canonical-URI encoding R2/S3 use to validate a
 * SigV4 presigned request, so keys containing spaces or apostrophes (e.g.
 * "who-build-india's drones.pdf") sign and resolve correctly. encodeURIComponent
 * leaves !'()* unencoded, so we finish the job to be fully RFC 3986 compliant.
 */
function encodeKey(key) {
  return String(key)
    .split('/')
    .map((seg) =>
      encodeURIComponent(seg).replace(
        /[!'()*]/g,
        (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()
      )
    )
    .join('/');
}

async function verifyEntitled(env, token, slug) {
  const ur = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!ur.ok) return { ok: false, code: 401, error: 'auth_invalid' };
  const user = await ur.json().catch(() => null);
  if (!user || !user.id) return { ok: false, code: 401, error: 'auth_no_user' };
  const er = await fetch(
    `${env.SUPABASE_URL}/rest/v1/entitlements?select=id&user_id=eq.${encodeURIComponent(user.id)}&report_slug=eq.${encodeURIComponent(slug)}&limit=1`,
    { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
  );
  if (!er.ok) return { ok: false, code: 502, error: 'entitlement_fetch_failed' };
  const rows = await er.json().catch(() => []);
  if (!Array.isArray(rows) || rows.length === 0) return { ok: false, code: 402, error: 'payment_required' };
  return { ok: true };
}

async function presign(env, objectKey, filename) {
  const client = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
  });
  const endpoint = env.R2_S3_ENDPOINT.replace(/\/$/, '');
  const u = new URL(`${endpoint}/${env.R2_BUCKET}/${encodeKey(objectKey)}`);
  u.searchParams.set('X-Amz-Expires', String(TTL));
  u.searchParams.set('response-content-disposition', `attachment; filename="${filename.replace(/"/g, '')}"`);
  const signed = await client.sign(u.toString(), { method: 'GET', aws: { signQuery: true } });
  return signed.url;
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const probe = url.searchParams.get('probe');

    if (probe === '1') {
      return json(200, {
        ok: true,
        codeVersion: CODE_VERSION,
        have: {
          SUPABASE_URL: !!env.SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY: !!env.SUPABASE_SERVICE_ROLE_KEY,
          R2_S3_ENDPOINT: !!env.R2_S3_ENDPOINT,
          R2_ACCESS_KEY_ID: !!env.R2_ACCESS_KEY_ID,
          R2_SECRET_ACCESS_KEY: !!env.R2_SECRET_ACCESS_KEY,
          R2_BUCKET: env.R2_BUCKET || null,
          R2_PUBLIC_BASE: env.R2_PUBLIC_BASE || null,
        },
        knownReports: Object.keys(REPORTS),
      });
    }

    const slug = url.searchParams.get('report');
    const entry = slug && REPORTS[slug];
    if (!entry) return json(404, { error: 'not_found', codeVersion: CODE_VERSION });

    if (probe === 'key') {
      const asset = url.searchParams.get('asset');
      const useDeck = asset === 'deck' && entry.deckObject;
      const objectKey = useDeck ? entry.deckObject : entry.object;
      return json(200, { codeVersion: CODE_VERSION, access: entry.access, objectKey, encoded: encodeKey(objectKey) });
    }

    // ── Paid: auth + entitlement (Supabase), then presigned R2 URL ──
    if (entry.access === 'paid') {
      const auth = request.headers.get('authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) return json(401, { error: 'auth_required', message: 'Please sign in to download this report.' });

      const chk = await verifyEntitled(env, token, slug);
      if (!chk.ok) return json(chk.code, { error: chk.error });

      const asset = url.searchParams.get('asset');
      const useDeck = asset === 'deck' && entry.deckObject;
      const objectKey = useDeck ? entry.deckObject : entry.object;
      const filename = useDeck ? (entry.deckFilename || `${slug}.pptx`) : (entry.filename || `${slug}.pdf`);

      if (!env.R2_S3_ENDPOINT || !env.R2_BUCKET || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
        return json(503, { error: 'storage_unconfigured', codeVersion: CODE_VERSION });
      }
      const signedUrl = await presign(env, objectKey, filename);
      return json(200, { url: signedUrl, filename, expiresIn: TTL, codeVersion: CODE_VERSION });
    }

    // ── Free: public R2 custom-domain URL (fallback; UI normally uses preview_object) ──
    if (!env.R2_PUBLIC_BASE) return json(503, { error: 'storage_unconfigured', codeVersion: CODE_VERSION });
    const filename = entry.filename || `${slug}.pdf`;
    const base = env.R2_PUBLIC_BASE.replace(/\/$/, '');
    const prefix = (env.R2_FREE_PREFIX ?? 'free reports').replace(/^\/|\/$/g, '');
    const key = prefix ? `${prefix}/${entry.object}` : entry.object;
    const publicUrl = `${base}/${encodeKey(key)}?download=${encodeURIComponent(filename)}`;
    return json(200, { url: publicUrl, filename, public: true, codeVersion: CODE_VERSION });
  } catch (e) {
    return json(500, { error: 'exception', message: (e && e.message) || String(e), codeVersion: CODE_VERSION });
  }
}
