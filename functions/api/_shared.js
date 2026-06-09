/**
 * Shared helpers for Pages Functions (Workers runtime).
 * No external dependencies — uses fetch + Web Crypto only.
 */

// Authoritative server-side report catalogue. Price/access live here, never trusted from client.
// Entries can override the storage bucket per-report via `bucket`; entries marked
// `publicBucket: true` skip the sign step and return the public storage URL directly.
export const REPORTS = {
  'who-builds-indias-drones': {
    access: 'paid',
    priceInr: 6999,
    object: "who-build-india's drones.pdf",
    filename: 'Who-Builds-Indias-Drones-Techadyant-Labs.pdf',
    title: 'Who Builds India’s Drones?',
  },
  'the-opportunity-beyond-the-fab': {
    access: 'paid',
    priceInr: 6999,
    object: 'the-opportunity-beyond-fab.pdf',
    filename: 'The-Opportunity-Beyond-the-Fab-Techadyant-Labs.pdf',
    title: 'The Opportunity Beyond the Fab',
  },
  'india-fab-ecosystem': {
    access: 'paid',
    priceInr: 4900,
    object: 'india-fab-ecosystem.pdf',
    filename: 'Who-Really-Benefits-from-Indias-Fab-Ecosystem-Techadyant-Labs.pdf',
    title: 'Who Really Benefits from India’s Fab Ecosystem?',
  },
  'india-ai-industrial-transition-2026-2035': {
    access: 'free',
    bucket: 'reports-free',
    publicBucket: true,
    object: 'India-ai-industrial-transition-2026-2035.pdf',
    filename: 'Indias-AI-Industrial-Transition-and-Infrastructure-Transformation-2026-2035-Techadyant-Labs.pdf',
    title: 'India’s AI Industrial Transition and Infrastructure Transformation',
  },
  'india-battlefield-automation-gap': {
    access: 'free',
    bucket: 'reports-free',
    publicBucket: true,
    object: 'india-battlefield-automation-gap.pdf',
    filename: 'Indias-Battlefield-Automation-Gap-Techadyant-Labs.pdf',
    title: 'India’s Battlefield Automation Gap',
  },
  'who-actually-captures-the-india-us-minerals-alliance': {
    access: 'paid',
    priceInr: 4900,
    object: 'who-actually-captures-the-india-us-minerals-alliance.pdf',
    filename: 'Who-Actually-Captures-the-India-US-Minerals-Alliance-Techadyant-Labs.pdf',
    title: 'Who Actually Captures the India–US Minerals Alliance?',
  },
};

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

const enc = new TextEncoder();

/** Hex HMAC-SHA256 (used for Razorpay signature checks). */
export async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time-ish string compare. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Resolve the Supabase user from a Bearer token. Returns {id,email} or null. */
export async function getUserFromRequest(request, env) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const u = await res.json();
  return u && u.id ? { id: u.id, email: u.email } : null;
}

/** True if the user already owns the report. */
export async function hasEntitlement(env, userId, slug) {
  const url =
    `${env.SUPABASE_URL}/rest/v1/entitlements?select=id&user_id=eq.${encodeURIComponent(userId)}&report_slug=eq.${encodeURIComponent(slug)}&limit=1`;
  const res = await fetch(url, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) return false;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0;
}

/** Insert an entitlement (idempotent on user_id+report_slug). */
export async function grantEntitlement(env, { userId, email, slug, orderId }) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/entitlements`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({ user_id: userId, email: email || null, report_slug: slug, order_id: orderId || null }),
  });
}

export async function markOrderPaid(env, razorpayOrderId, razorpayPaymentId) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/orders?razorpay_order_id=eq.${encodeURIComponent(razorpayOrderId)}`, {
    method: 'PATCH',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ status: 'paid', razorpay_payment_id: razorpayPaymentId, paid_at: new Date().toISOString() }),
  });
}
