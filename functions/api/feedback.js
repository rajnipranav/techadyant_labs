/**
 * POST /api/feedback — public feedback / report-request loop.
 *
 * Body JSON: {
 *   type?: 'report_request' | 'site_gap' | 'report_rating' | 'general',
 *   email?: string,           // optional; if given, may be added to the list
 *   message?: string,
 *   topic?: string,           // sector/topic for a report request
 *   report_slug?: string,     // when rating/relating to a report
 *   rating?: number,          // 1-5
 *   page_url?: string,        // where it was submitted from
 *   source?: string,          // form identifier
 *   subscribe?: boolean       // opt-in to the list (default false)
 * }
 *
 * Flow: validate → insert into public.feedback via Supabase REST (service-role) →
 * notify INBOX_LABS → optionally add the email to public.subscribers.
 * Returns 200 { ok: true }. Mirrors /api/subscribe's shape and env usage.
 */
import { json } from './_shared.js';

const TYPES = ['report_request', 'site_gap', 'report_rating', 'general'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function insertFeedback(env, row) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/feedback`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!r.ok) {
    let detail = ''; try { detail = (await r.text()).slice(0, 400); } catch {}
    return { ok: false, status: r.status, detail };
  }
  return { ok: true };
}

async function addSubscriber(env, email, source) {
  // Ignore-duplicates upsert: never touch an existing (possibly unsubscribed) row.
  await fetch(`${env.SUPABASE_URL}/rest/v1/subscribers?on_conflict=email`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({ email, source }),
  }).catch(() => {});
}

async function notifyAdmin(env, row) {
  if (!env.RESEND_API_KEY || !env.INBOX_LABS) return;
  const from = env.FROM_EMAIL || 'labs@techadyant.com';
  const label = { report_request: 'Report request', site_gap: 'Site gap / not found', report_rating: 'Report rating', general: 'Feedback' }[row.type] || 'Feedback';
  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;color:#222;padding:16px">
<p><strong>New ${escapeHtml(label)}</strong></p>
<table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse">
  <tr><td style="color:#666">Type</td><td>${escapeHtml(row.type)}</td></tr>
  ${row.email ? `<tr><td style="color:#666">Email</td><td><strong>${escapeHtml(row.email)}</strong></td></tr>` : ''}
  ${row.topic ? `<tr><td style="color:#666">Topic</td><td>${escapeHtml(row.topic)}</td></tr>` : ''}
  ${row.report_slug ? `<tr><td style="color:#666">Report</td><td>${escapeHtml(row.report_slug)}</td></tr>` : ''}
  ${row.rating ? `<tr><td style="color:#666">Rating</td><td>${escapeHtml(row.rating)}/5</td></tr>` : ''}
  ${row.message ? `<tr><td style="color:#666;vertical-align:top">Message</td><td>${escapeHtml(row.message)}</td></tr>` : ''}
  ${row.page_url ? `<tr><td style="color:#666">Page</td><td>${escapeHtml(row.page_url)}</td></tr>` : ''}
  <tr><td style="color:#666">Country</td><td>${escapeHtml(row.country || '—')}</td></tr>
</table>
<p style="color:#666;font-size:12px;margin-top:18px">Sent automatically by labs.techadyant.com /api/feedback</p>
</body></html>`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: `Techadyant Labs <${from}>`,
      to: [env.INBOX_LABS],
      subject: `${label}${row.topic ? `: ${row.topic}` : ''}`,
      html,
      reply_to: row.email || from,
    }),
  }).catch(() => {});
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const type = TYPES.includes(body.type) ? body.type : 'general';
    const email = String(body.email || '').trim().toLowerCase();
    const message = String(body.message || '').trim().slice(0, 4000);
    const topic = String(body.topic || '').trim().slice(0, 200);
    const reportSlug = String(body.report_slug || '').trim().slice(0, 200);
    const pageUrl = String(body.page_url || '').trim().slice(0, 500);
    const source = String(body.source || 'feedback-form').slice(0, 64);
    let rating = parseInt(body.rating, 10);
    if (!(rating >= 1 && rating <= 5)) rating = null;

    // Require at least something to act on.
    if (!message && !topic && !rating) {
      return json(400, { error: 'empty', message: 'Please add a message, a topic or a rating.' });
    }
    if (email && (!EMAIL_RE.test(email) || email.length > 254)) {
      return json(400, { error: 'invalid_email', message: 'Please enter a valid email address.' });
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return json(503, { error: 'storage_unconfigured' });
    }

    const country = request.headers.get('cf-ipcountry') || '';
    const ip = request.headers.get('cf-connecting-ip') || '';
    const ua = (request.headers.get('user-agent') || '').slice(0, 300);

    const row = {
      type,
      email: email || null,
      message: message || null,
      topic: topic || null,
      report_slug: reportSlug || null,
      rating,
      page_url: pageUrl || null,
      source,
      country,
      ip,
      user_agent: ua,
    };

    const stored = await insertFeedback(env, row);
    if (!stored.ok) {
      return json(502, { error: 'storage_error', status: stored.status, detail: stored.detail });
    }

    // Optional opt-in to the list.
    if (email && body.subscribe === true) {
      await addSubscriber(env, email, `feedback:${type}`);
    }

    // Notify the labs inbox (fire-and-forget).
    await notifyAdmin(env, row);

    return json(200, { ok: true });
  } catch (e) {
    return json(500, { error: 'exception', message: e && e.message ? e.message : String(e) });
  }
}

export const onRequestGet = () => json(405, { error: 'method_not_allowed' });
