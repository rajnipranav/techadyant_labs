/**
 * POST /api/subscribe — newsletter signup for The Dispatch.
 *
 * Body JSON: { email: string, source?: string, turnstileToken?: string }
 *
 * Flow:
 *   1. Verify Cloudflare Turnstile token (if TURNSTILE_SECRET_KEY is set).
 *   2. Validate / normalise email.
 *   3. Upsert into public.subscribers via Supabase REST + service-role key.
 *   4. Send a confirmation email to the subscriber via Resend (from FROM_EMAIL).
 *   5. Send a notification to INBOX_LABS so labs@techadyant.com sees the signup.
 *
 * Returns 200 { ok: true } on success, 4xx with { error, message } otherwise.
 * Idempotent — re-subscribing with the same email returns 200 (already on the list).
 */
import { json } from './_shared.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET_KEY) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: 'missing_token' };
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    const data = await r.json();
    return { ok: !!data.success, raw: data };
  } catch (e) {
    return { ok: false, reason: 'verify_error', message: e.message };
  }
}

async function upsertSubscriber(env, row) {
  // PostgREST upsert: POST with Prefer: resolution=merge-duplicates,return=representation
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/subscribers?on_conflict=email`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(row),
  });
  if (!r.ok) {
    let detail = ''; try { detail = (await r.text()).slice(0, 400); } catch {}
    return { ok: false, status: r.status, detail };
  }
  let rows = null; try { rows = await r.json(); } catch {}
  return { ok: true, row: Array.isArray(rows) ? rows[0] : rows };
}

async function sendEmail(env, { to, subject, html, text, replyTo }) {
  if (!env.RESEND_API_KEY) return { ok: false, reason: 'no_resend_key' };
  const from = env.FROM_EMAIL || 'labs@techadyant.com';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: `Techadyant Labs <${from}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      reply_to: replyTo || from,
    }),
  });
  if (!r.ok) {
    let detail = ''; try { detail = (await r.text()).slice(0, 400); } catch {}
    return { ok: false, status: r.status, detail };
  }
  return { ok: true };
}

function welcomeEmailHtml() {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#0B0B14;color:#E8E8F0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.55">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto"><tr><td>
  <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.18em;color:#F5B544;text-transform:uppercase;margin-bottom:18px">Techadyant Labs · The Dispatch</div>
  <h1 style="font-size:24px;line-height:1.25;letter-spacing:-0.02em;margin:0 0 16px;color:#fff">Welcome.</h1>
  <p style="font-size:15px;color:#C8C8D6;margin:0 0 14px">You're on the list for The Dispatch — our infrequent strategic-intelligence brief on India's industrial systems.</p>
  <p style="font-size:15px;color:#C8C8D6;margin:0 0 14px">Expect long-form reports, intelligence signals and executive briefings on semiconductors, AI infrastructure, industrial corridors and the second-order economic effects of India's manufacturing transition. No sponsored coverage. No spam. You can unsubscribe at any time.</p>
  <p style="font-size:15px;color:#C8C8D6;margin:0 0 24px">Our latest free report — <em>India's AI Industrial Transition and Infrastructure Transformation (2026–2035)</em> — is available now: <a href="https://labs.techadyant.com/reports/india-ai-industrial-transition-2026-2035/" style="color:#818CF8">read it here</a>.</p>
  <p style="font-size:13px;color:#9898A8;margin:24px 0 0;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08)">— Techadyant Labs<br>Bengaluru / Hyderabad, India<br><a href="https://labs.techadyant.com" style="color:#818CF8">labs.techadyant.com</a></p>
</td></tr></table>
</body></html>`;
}

function welcomeEmailText() {
  return `Welcome to The Dispatch.

You're on the list for Techadyant Labs' infrequent strategic-intelligence brief on India's industrial systems. Long-form reports, intelligence signals and executive briefings on semiconductors, AI infrastructure, industrial corridors and the second-order economic effects of India's manufacturing transition.

Our latest free report — India's AI Industrial Transition and Infrastructure Transformation (2026–2035) — is available now:
https://labs.techadyant.com/reports/india-ai-industrial-transition-2026-2035/

— Techadyant Labs
labs.techadyant.com`;
}

function adminNotifyHtml({ email, source, ip, country, ua }) {
  return `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;color:#222;padding:16px">
<p><strong>New subscriber</strong></p>
<table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse">
  <tr><td style="color:#666">Email</td><td><strong>${escapeHtml(email)}</strong></td></tr>
  <tr><td style="color:#666">Source</td><td>${escapeHtml(source || '—')}</td></tr>
  <tr><td style="color:#666">Country</td><td>${escapeHtml(country || '—')}</td></tr>
  <tr><td style="color:#666">IP</td><td>${escapeHtml(ip || '—')}</td></tr>
  <tr><td style="color:#666;vertical-align:top">User-Agent</td><td>${escapeHtml(ua || '—')}</td></tr>
</table>
<p style="color:#666;font-size:12px;margin-top:18px">Sent automatically by labs.techadyant.com /api/subscribe</p>
</body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = String(body.email || '').trim().toLowerCase();
    const source = String(body.source || 'homepage').slice(0, 64);
    const turnstileToken = body.turnstileToken;

    if (!EMAIL_RE.test(rawEmail) || rawEmail.length > 254) {
      return json(400, { error: 'invalid_email', message: 'Please enter a valid email address.' });
    }

    const ip = request.headers.get('cf-connecting-ip') || '';
    const country = request.headers.get('cf-ipcountry') || '';
    const ua = (request.headers.get('user-agent') || '').slice(0, 300);

    // 1. Turnstile (skip if not configured).
    const t = await verifyTurnstile(env, turnstileToken, ip);
    if (!t.ok && !t.skipped) {
      return json(400, { error: 'turnstile_failed', message: 'Verification failed. Please try again.' });
    }

    // 2. Store
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return json(503, { error: 'storage_unconfigured' });
    }
    const stored = await upsertSubscriber(env, {
      email: rawEmail,
      source,
      ip,
      country,
      user_agent: ua,
    });
    if (!stored.ok) {
      return json(502, { error: 'storage_error', status: stored.status, detail: stored.detail });
    }
    const isNew = stored.row && stored.row.created_at &&
      Date.now() - new Date(stored.row.created_at).getTime() < 60_000;

    // 3. Welcome email to the subscriber (fire-and-forget — log but don't fail
    //    the request if Resend hiccups, the row is already saved).
    if (isNew) {
      const w = await sendEmail(env, {
        to: rawEmail,
        subject: 'Welcome to The Dispatch — Techadyant Labs',
        html: welcomeEmailHtml(),
        text: welcomeEmailText(),
      });
      if (!w.ok) console.warn('welcome_email_failed', w);

      // 4. Notify labs inbox.
      if (env.INBOX_LABS) {
        const n = await sendEmail(env, {
          to: env.INBOX_LABS,
          subject: `New subscriber: ${rawEmail}`,
          html: adminNotifyHtml({ email: rawEmail, source, ip, country, ua }),
          text: `New subscriber: ${rawEmail}\nSource: ${source}\nCountry: ${country}\nIP: ${ip}\nUA: ${ua}`,
          replyTo: rawEmail,
        });
        if (!n.ok) console.warn('admin_notify_failed', n);
      }
    }

    return json(200, { ok: true, isNew });
  } catch (e) {
    return json(500, { error: 'exception', message: e && e.message ? e.message : String(e) });
  }
}

// Block other methods cleanly.
export const onRequestGet = () => json(405, { error: 'method_not_allowed' });
