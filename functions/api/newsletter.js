/**
 * /api/newsletter - account-scoped newsletter status + toggle.
 *
 *  GET           -> { email, subscribed, confirmed } for the signed-in user.
 *  POST {action} -> { action: 'subscribe' | 'unsubscribe' } toggles the
 *                   subscriber row for the signed-in user's email.
 *
 * Auth: Supabase Bearer token (same as /api/download). All writes use the
 * service-role key, so the anonymous client key is never involved.
 */
import { json, getUserFromRequest } from './_shared.js';

async function getStatus(env, email) {
  const url = `${env.SUPABASE_URL}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}&select=email,confirmed,unsubscribed&limit=1`;
  const r = await fetch(url, {
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
  });
  if (!r.ok) return null;
  const rows = await r.json();
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const user = await getUserFromRequest(request, env);
  if (!user || !user.email) {
    return json(401, { error: 'unauthorized', message: 'Sign in to manage your newsletter.' });
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(503, { error: 'unconfigured' });
  }
  const row = await getStatus(env, user.email);
  return json(200, {
    email: user.email,
    subscribed: !!row && !row.unsubscribed,
    confirmed: !!(row && row.confirmed),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const user = await getUserFromRequest(request, env);
  if (!user || !user.email) {
    return json(401, { error: 'unauthorized', message: 'Sign in to manage your newsletter.' });
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(503, { error: 'unconfigured' });
  }

  const body = await request.json().catch(() => ({}));
  const action = String(body.action || '').toLowerCase();
  const email = user.email.toLowerCase();
  const now = new Date().toISOString();

  if (action === 'subscribe') {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/subscribers?on_conflict=email`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'content-type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        email,
        source: 'account',
        confirmed: true,
        confirmed_at: now,
        unsubscribed: false,
        unsubscribed_at: null,
      }),
    });
    if (!r.ok) return json(502, { error: 'storage_error', status: r.status });
    return json(200, { email, subscribed: true, confirmed: true });
  }

  if (action === 'unsubscribe') {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'content-type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ unsubscribed: true, unsubscribed_at: now }),
    });
    if (!r.ok) return json(502, { error: 'storage_error', status: r.status });
    return json(200, { email, subscribed: false, confirmed: true });
  }

  return json(400, { error: 'bad_action', message: 'action must be "subscribe" or "unsubscribe".' });
}
