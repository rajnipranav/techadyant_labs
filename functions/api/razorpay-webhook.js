/**
 * POST /api/razorpay-webhook
 * Configure this URL in the Razorpay Dashboard (Settings > Webhooks) for the
 * `payment.captured` and `order.paid` events, with the same secret you set in
 * RAZORPAY_WEBHOOK_SECRET.
 *
 * This is the authoritative, server-to-server confirmation of payment. It
 * verifies the signature over the RAW body, then marks the order paid and
 * grants the entitlement (idempotent). Never trusts the client.
 */
import { REPORTS, json, hmacSha256Hex, safeEqual, markOrderPaid, grantEntitlement, getOrder, assignInvoiceNo, sendReceiptEmail, claimReceipt } from './_shared.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.RAZORPAY_WEBHOOK_SECRET || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(503, { error: 'unconfigured' });
  }

  const raw = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';
  const expected = await hmacSha256Hex(env.RAZORPAY_WEBHOOK_SECRET, raw);
  if (!safeEqual(expected, signature)) {
    return json(400, { error: 'invalid_signature' });
  }

  let evt;
  try { evt = JSON.parse(raw); } catch { return json(400, { error: 'bad_json' }); }

  const event = evt?.event;
  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = evt?.payload?.payment?.entity;
    const orderEntity = evt?.payload?.order?.entity;
    const orderId = payment?.order_id || orderEntity?.id;
    const paymentId = payment?.id || null;
    const notes = payment?.notes || orderEntity?.notes || {};
    const slug = notes.report;
    const userId = notes.user_id;
    const email = notes.email || null;
    const tier = notes.tier || 'report';

    if (orderId) await markOrderPaid(env, orderId, paymentId);
    if (slug && userId) await grantEntitlement(env, { userId, email, slug, orderId: null, tier });

    // Backup path: assign invoice + send receipt exactly once (verify-payment usually
    // does this first; claimReceipt guarantees the email isn't sent twice).
    if (orderId && slug && email) {
      const invoiceNo = await assignInvoiceNo(env, orderId);
      const ord = await getOrder(env, orderId);
      const entry = REPORTS[slug] || {};
      if (await claimReceipt(env, orderId)) {
        await sendReceiptEmail(env, {
          email, title: entry.title, slug, tier,
          amountInr: ord?.amount_inr, invoiceNo, orderId, paymentId,
        });
      }
    }
  }

  // Always 200 so Razorpay doesn't retry indefinitely on handled events.
  return json(200, { received: true });
}
