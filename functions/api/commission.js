/**
 * POST /api/commission — intake for bespoke research & DPR commissions.
 *
 * Body JSON: { name, email, organisation?, engagementType?, project?, message?, source? }
 *
 * Flow:
 *   1. Validate name + email (+ light length caps).
 *   2. Insert into public.commission_inquiries via Supabase REST + service-role key.
 *   3. Notify INBOX_LABS (labs@techadyant.com) via Resend with the full enquiry.
 *   4. Send a short acknowledgement to the sender.
 *
 * Returns 200 { ok: true } on success; 4xx/5xx with { error, message } otherwise.
 * Mirrors functions/api/subscribe.js conventions (same env vars, same Resend helper).
 */
import { json } from './_shared.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function insertInquiry(env, row) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/commission_inquiries`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=representation',
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
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
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

const ENGAGEMENT_LABELS = {
  'bespoke-research': 'Bespoke research',
  dpr: 'Detailed Project Report (DPR)',
  both: 'Bespoke research + DPR',
  other: 'Other / not sure yet',
};

function adminHtml(d) {
  const eng = ENGAGEMENT_LABELS[d.engagementType] || d.engagementType || '—';
  return `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.55;color:#222;padding:18px">
<p style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.16em;color:#0D7377;text-transform:uppercase;margin:0 0 14px">New commission enquiry</p>
<table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse">
  <tr><td style="color:#666;vertical-align:top">Name</td><td><strong>${escapeHtml(d.name)}</strong></td></tr>
  <tr><td style="color:#666;vertical-align:top">Email</td><td><a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a></td></tr>
  <tr><td style="color:#666;vertical-align:top">Organisation</td><td>${escapeHtml(d.organisation || '—')}</td></tr>
  <tr><td style="color:#666;vertical-align:top">Engagement</td><td>${escapeHtml(eng)}</td></tr>
  <tr><td style="color:#666;vertical-align:top">Project</td><td>${escapeHtml(d.project || '—')}</td></tr>
  <tr><td style="color:#666;vertical-align:top">Message</td><td>${escapeHtml(d.message || '—').replace(/\n/g, '<br>')}</td></tr>
  <tr><td style="color:#666;vertical-align:top">Country / IP</td><td>${escapeHtml(d.country || '—')} · ${escapeHtml(d.ip || '—')}</td></tr>
</table>
<p style="color:#888;font-size:12px;margin-top:18px">Reply directly to this email to reach ${escapeHtml(d.name)}. Stored in commission_inquiries.</p>
</body></html>`;
}

function ackHtml(name) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#0B0B14;color:#E8E8F0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.55">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto"><tr><td>
  <div style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.18em;color:#F5B544;text-transform:uppercase;margin-bottom:18px">Techadyant Labs · Commissions</div>
  <h1 style="font-size:23px;line-height:1.25;margin:0 0 16px;color:#fff">Thank you${name ? ', ' + escapeHtml(name.split(' ')[0]) : ''}.</h1>
  <p style="font-size:15px;color:#C8C8D6;margin:0 0 14px">We've received your enquiry about commissioned research. A member of the team will read it personally and reply within two working days to discuss scope, timeline and fit.</p>
  <p style="font-size:15px;color:#C8C8D6;margin:0 0 14px">If it's time-sensitive, reply to this email with any deadline and we'll prioritise accordingly.</p>
  <p style="font-size:13px;color:#9898A8;margin:24px 0 0;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08)">— Techadyant Labs<br><a href="https://labs.techadyant.com" style="color:#818CF8">labs.techadyant.com</a></p>
</td></tr></table>
</body></html>`;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || '').trim().slice(0, 200);
    const email = String(body.email || '').trim().toLowerCase().slice(0, 254);
    const organisation = String(body.organisation || '').trim().slice(0, 200);
    const engagementType = String(body.engagementType || '').trim().slice(0, 40);
    const project = String(body.project || '').trim().slice(0, 300);
    const message = String(body.message || '').trim().slice(0, 4000);
    const source = String(body.source || 'services').slice(0, 64);

    if (!name) return json(400, { error: 'invalid_name', message: 'Please enter your name.' });
    if (!EMAIL_RE.test(email)) return json(400, { error: 'invalid_email', message: 'Please enter a valid email address.' });

    const ip = request.headers.get('cf-connecting-ip') || '';
    const country = request.headers.get('cf-ipcountry') || '';
    const ua = (request.headers.get('user-agent') || '').slice(0, 300);

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return json(503, { error: 'storage_unconfigured' });
    }
    const stored = await insertInquiry(env, {
      name, email, organisation, engagement_type: engagementType,
      project, message, source, ip, country, user_agent: ua,
    });
    if (!stored.ok) {
      return json(502, { error: 'storage_error', status: stored.status, detail: stored.detail });
    }

    // Notify the labs inbox (fire-and-forget — row is already saved).
    if (env.INBOX_LABS) {
      const n = await sendEmail(env, {
        to: env.INBOX_LABS,
        subject: `Commission enquiry: ${name}${organisation ? ' (' + organisation + ')' : ''}`,
        html: adminHtml({ name, email, organisation, engagementType, project, message, ip, country }),
        text: `New commission enquiry\nName: ${name}\nEmail: ${email}\nOrg: ${organisation}\nEngagement: ${engagementType}\nProject: ${project}\nMessage: ${message}\nCountry: ${country} IP: ${ip}`,
        replyTo: email,
      });
      if (!n.ok) console.warn('commission_admin_notify_failed', n);
    }

    // Acknowledge the sender.
    const a = await sendEmail(env, {
      to: email,
      subject: 'We received your enquiry — Techadyant Labs',
      html: ackHtml(name),
      text: `Thank you${name ? ', ' + name.split(' ')[0] : ''}. We've received your enquiry about commissioned research and will reply within two working days.\n\n— Techadyant Labs\nlabs.techadyant.com`,
    });
    if (!a.ok) console.warn('commission_ack_failed', a);

    return json(200, { ok: true });
  } catch (e) {
    return json(500, { error: 'exception', message: e && e.message ? e.message : String(e) });
  }
}

export const onRequestGet = () => json(405, { error: 'method_not_allowed' });
