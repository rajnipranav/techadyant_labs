/**
 * POST /api/checkout  { report: <slug> }
 * Auth: Bearer <supabase access token>
 *
 * Creates a Razorpay order for the report (price is authoritative server-side),
 * records a pending row in `orders`, and returns the data the browser needs to
 * open Razorpay Checkout. It grants NOTHING — entitlement is only written after
 * a verified payment (verify-payment.js / razorpay-webhook.js).
 */
import { REPORTS, json, getUserFromRequest } from './_shared.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(503, { error: 'unconfigured', message: 'Payments are not configured yet.' });
  }

  const user = await getUserFromRequest(request, env);
  if (!user) return json(401, { error: 'auth_required', message: 'Please sign in to purchase.' });

  let body;
  try { body = await request.json(); } catch { return json(400, { error: 'bad_request' }); }
  const slug = body?.report;
  const entry = slug && REPORTS[slug];
  if (!entry || entry.access !== 'paid' || !entry.priceInr) {
    return json(404, { error: 'not_purchasable' });
  }

  const amountPaise = entry.priceInr * 100;

  // 1) Create the Razorpay order.
  const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`),
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: `${slug}:${user.id}:${Date.now()}`,
      notes: { report: slug, user_id: user.id, email: user.email || '' },
    }),
  });
  if (!rzpRes.ok) {
    return json(502, { error: 'razorpay_error', status: rzpRes.status });
  }
  const order = await rzpRes.json();

  // 2) Record the pending order (service role).
  await fetch(`${env.SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      user_id: user.id,
      email: user.email || null,
      report_slug: slug,
      amount_inr: entry.priceInr,
      currency: 'INR',
      status: 'created',
      razorpay_order_id: order.id,
    }),
  });

  return json(200, {
    orderId: order.id,
    amount: amountPaise,
    currency: 'INR',
    keyId: env.RAZORPAY_KEY_ID,
    reportTitle: entry.title,
  });
}
