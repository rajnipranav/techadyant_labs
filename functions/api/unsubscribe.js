/**
 * /api/unsubscribe — one-click unsubscribe.
 *
 *  GET  ?e=<email>&t=<token>   — direct browser click from the footer link.
 *                                Renders a tiny confirmation HTML page.
 *  POST ?e=<email>&t=<token>   — RFC 8058 List-Unsubscribe-Post one-click.
 *                                Body: List-Unsubscribe=One-Click
 *                                Returns 200 with text/plain.
 *
 * Token is an HMAC-SHA-256 of the lowercased email under the same secret used
 * by /api/subscribe (UNSUBSCRIBE_SECRET or SUPABASE_SERVICE_ROLE_KEY), truncated
 * to 32 hex chars. Constant-time-equality compared.
 *
 * On success we PATCH the subscriber row to set unsubscribed=true,
 * unsubscribed_at=now(). Idempotent — re-clicks return the same page.
 */
import { hmacSha256Hex, safeEqual } from './_shared.js';

function htmlPage(message, accent = '#34D399') {
  return `<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribed — Techadyant Labs</title>
<style>
  body{margin:0;background:#0B0B14;color:#E8E8F0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;line-height:1.55}
  .card{max-width:520px;background:#161629;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px}
  .k{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.18em;color:#F5B544;text-transform:uppercase;margin-bottom:18px}
  h1{font-size:22px;line-height:1.25;letter-spacing:-0.02em;margin:0 0 12px;color:#fff}
  p{font-size:15px;color:#C8C8D6;margin:0 0 12px}
  a{color:#818CF8}
  .accent{color:${accent}}
</style></head><body>
<div class="card">
  <div class="k">Techadyant Labs · The Dispatch</div>
  <h1><span class="accent">✓</span> ${message}</h1>
  <p>You will not receive further emails from Techadyant Labs. If this was a mistake, you can <a href="https://labs.techadyant.com/#subscribe">re-subscribe at any time</a>.</p>
  <p style="margin-top:24px;font-size:13px;color:#9898A8">— Techadyant Labs · <a href="https://labs.techadyant.com">labs.techadyant.com</a></p>
</div>
</body></html>`;
}

function htmlError(message) {
  return `<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribe — Techadyant Labs</title>
<style>
  body{margin:0;background:#0B0B14;color:#E8E8F0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;line-height:1.55}
  .card{max-width:520px;background:#161629;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px}
  .k{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.18em;color:#FB923C;text-transform:uppercase;margin-bottom:18px}
  h1{font-size:22px;line-height:1.25;letter-spacing:-0.02em;margin:0 0 12px;color:#fff}
  p{font-size:15px;color:#C8C8D6;margin:0 0 12px}
  a{color:#818CF8}
</style></head><body>
<div class="card">
  <div class="k">Techadyant Labs · Unsubscribe</div>
  <h1>This link is no longer valid.</h1>
  <p>${message}</p>
  <p>If you would like to be removed from our list, email <a href="mailto:labs@techadyant.com?subject=Unsubscribe">labs@techadyant.com</a> with the subject line <em>Unsubscribe</em> and we'll handle it manually.</p>
</div>
</body></html>`;
}

function html(status, body) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}
function text(status, body) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function expectedToken(env, email) {
  const secret = env.UNSUBSCRIBE_SECRET || env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-dev';
  return (await hmacSha256Hex(secret, email)).slice(0, 32);
}

async function markUnsubscribed(env, email) {
  // PATCH the row by email. If RLS or service-key isn't set, fail closed.
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, reason: 'unconfigured' };
  }
  const url = `${env.SUPABASE_URL}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}`;
  const r = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      unsubscribed: true,
      unsubscribed_at: new Date().toISOString(),
    }),
  });
  if (!r.ok) {
    let detail = ''; try { detail = (await r.text()).slice(0, 300); } catch {}
    return { ok: false, status: r.status, detail };
  }
  let rows = []; try { rows = await r.json(); } catch {}
  return { ok: true, rowCount: Array.isArray(rows) ? rows.length : 0 };
}

async function handle(request, env, isPost) {
  const url = new URL(request.url);
  const email = String(url.searchParams.get('e') || '').trim().toLowerCase();
  const token = String(url.searchParams.get('t') || '').trim();

  if (!email || !token) {
    const msg = 'The unsubscribe link is missing required information.';
    return isPost ? text(400, 'invalid_link') : html(400, htmlError(msg));
  }

  const expected = await expectedToken(env, email);
  if (!safeEqual(token, expected)) {
    const msg = 'The unsubscribe link has expired or been tampered with.';
    return isPost ? text(400, 'invalid_token') : html(400, htmlError(msg));
  }

  const upd = await markUnsubscribed(env, email);
  if (!upd.ok) {
    const msg = 'Our database is temporarily unreachable. Please try again in a few minutes.';
    return isPost ? text(503, 'storage_error') : html(503, htmlError(msg));
  }

  // 200 OK either way — even if the email wasn't on the list, the user gets
  // the success page (avoids an enumeration oracle).
  return isPost
    ? text(200, 'unsubscribed')
    : html(200, htmlPage(`You're unsubscribed, ${email.split('@')[0]}.`));
}

export const onRequestGet  = (ctx) => handle(ctx.request, ctx.env, false);
export const onRequestPost = (ctx) => handle(ctx.request, ctx.env, true);
