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
import { REPORTS, json, tierGrantsData } from './_shared.js';

const CODE_VERSION = 'download-r2-v3';
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
  const email = user.email || null;
  const er = await fetch(
    `${env.SUPABASE_URL}/rest/v1/entitlements?select=id,tier&user_id=eq.${encodeURIComponent(user.id)}&report_slug=eq.${encodeURIComponent(slug)}&limit=1`,
    { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
  );
  if (!er.ok) return { ok: false, code: 502, error: 'entitlement_fetch_failed', email };
  const rows = await er.json().catch(() => []);
  if (!Array.isArray(rows) || rows.length === 0) return { ok: false, code: 402, error: 'payment_required', email };
  return { ok: true, tier: rows[0].tier || 'report', email };
}

const esc = (s) =>
  String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/**
 * Email the labs inbox when an entitled buyer could not be served their file.
 * Fire-and-forget (never blocks or fails the response). Reuses the same Resend
 * setup as /api/feedback — no new env needed beyond what already sends mail.
 */
async function alertAdmin(env, info) {
  try {
    if (!env.RESEND_API_KEY || !env.INBOX_LABS) return;
    const from = env.FROM_EMAIL || 'labs@techadyant.com';
    const rows = [
      ['Report', info.slug],
      ['Asset', info.asset || 'report (pdf)'],
      ['Buyer', info.email || '—'],
      ['Reason', info.reason],
      ['HTTP status', info.status != null ? String(info.status) : '—'],
      ['R2 object key', info.objectKey || '—'],
      ['Filename', info.filename || '—'],
      ['Time (UTC)', new Date().toISOString()],
    ];
    const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;color:#222;padding:16px">
<p><strong>⚠ Report download failed for a paying buyer</strong></p>
<p style="color:#666">A buyer with a valid entitlement could not download their report. The customer saw an error instead of a file. Check that the R2 object below exists in <code>${esc(env.R2_BUCKET || 'techadyant-reports')}</code>.</p>
<table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse">
${rows.map(([k, v]) => `  <tr><td style="color:#666">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join('\n')}
</table>
<p style="color:#666;font-size:12px;margin-top:18px">Sent automatically by labs.techadyant.com /api/download (${esc(CODE_VERSION)})</p>
</body></html>`;
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: `Techadyant Labs <${from}>`,
        to: [env.INBOX_LABS],
        subject: `⚠ Download failed — ${info.slug} (${info.reason})`,
        html,
        reply_to: info.email || from,
      }),
    }).catch(() => {});
  } catch { /* alerting must never break the request */ }
}

/** Signed HEAD to R2 — confirms the object exists and is readable before we hand out a URL. */
async function objectExists(env, objectKey) {
  try {
    const client = new AwsClient({
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      service: 's3',
      region: 'auto',
    });
    const endpoint = env.R2_S3_ENDPOINT.replace(/\/$/, '');
    const u = `${endpoint}/${env.R2_BUCKET}/${encodeKey(objectKey)}`;
    const res = await client.fetch(u, { method: 'HEAD' });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: (e && e.message) || String(e) };
  }
}

const FILE_UNAVAILABLE_MSG =
  'This download is temporarily unavailable. Our team has just been alerted and will fix it shortly — please try again in a little while, or email info@techadyant.com and we will send it to you directly.';

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
      if (!chk.ok) {
        // A buyer blocked by OUR fault (e.g. entitlement lookup down) is a real
        // delivery failure — alert. Normal access control (not signed in / not
        // paid) is expected and must not spam the inbox.
        if (chk.code >= 500) {
          await alertAdmin(env, { slug, reason: chk.error, status: chk.code, email: chk.email });
        }
        return json(chk.code, { error: chk.error });
      }

      const asset = url.searchParams.get('asset');
      const useDeck = asset === 'deck' && entry.deckObject;
      const useData = asset === 'data' && entry.dataObject;
      // The data pack is a premium tier — only report+data (or higher) buyers get it.
      if (useData && !tierGrantsData(chk.tier)) {
        return json(402, { error: 'data_tier_required', message: 'Your purchase does not include the data pack.' });
      }
      const assetLabel = useData ? 'data (xlsx)' : useDeck ? 'deck (pptx)' : 'report (pdf)';
      const objectKey = useData ? entry.dataObject : useDeck ? entry.deckObject : entry.object;
      const filename = useData
        ? (entry.dataFilename || `${slug}.xlsx`)
        : useDeck ? (entry.deckFilename || `${slug}.pptx`) : (entry.filename || `${slug}.pdf`);

      if (!env.R2_S3_ENDPOINT || !env.R2_BUCKET || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
        await alertAdmin(env, { slug, asset: assetLabel, objectKey, filename, reason: 'storage_unconfigured' });
        return json(503, { error: 'storage_unconfigured', message: FILE_UNAVAILABLE_MSG, codeVersion: CODE_VERSION });
      }

      // Hardening: confirm the object is actually there BEFORE handing over a URL.
      // A missing/unreadable object makes R2 return an XML error that the browser
      // would otherwise save as a "corrupt PDF". Verify, then alert + fail clearly.
      const head = await objectExists(env, objectKey);
      if (!head.ok) {
        await alertAdmin(env, {
          slug, asset: assetLabel, objectKey, filename, email: chk.email,
          reason: head.status === 404 ? 'object_missing' : 'object_unreadable', status: head.status,
        });
        return json(502, { error: 'file_unavailable', message: FILE_UNAVAILABLE_MSG, codeVersion: CODE_VERSION });
      }

      const signedUrl = await presign(env, objectKey, filename);
      return json(200, { url: signedUrl, filename, expiresIn: TTL, codeVersion: CODE_VERSION });
    }

    // ── Free: public R2 custom-domain URL (fallback; UI normally uses preview_object) ──
    if (!env.R2_PUBLIC_BASE) return json(503, { error: 'storage_unconfigured', codeVersion: CODE_VERSION });
    const filename = entry.filename || `${slug}.pdf`;
    const base = env.R2_PUBLIC_BASE.replace(/\/$/, '');
    const prefix = (env.R2_FREE_PREFIX ?? 'free reports').replace(/^\/|\/$/g, '');
    const objectKey = entry.object.startsWith('http') ? null : entry.object;
    const publicUrl = objectKey
      ? `${base}/${encodeKey(`${prefix}/${objectKey}`)}?download=${encodeURIComponent(filename)}`
      : entry.object;
    return json(200, { url: publicUrl, filename, public: true, codeVersion: CODE_VERSION });
  } catch (e) {
    const msg = (e && e.message) || String(e);
    try {
      const slug = new URL(request.url).searchParams.get('report');
      await alertAdmin(env, { slug: slug || '(unknown)', reason: `exception: ${msg}` });
    } catch { /* ignore */ }
    return json(500, { error: 'exception', message: FILE_UNAVAILABLE_MSG, detail: msg, codeVersion: CODE_VERSION });
  }
}
