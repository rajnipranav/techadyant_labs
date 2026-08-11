/**
 * POST /api/verify-payment
 *   { razorpay_order_id, razorpay_payment_id, razorpay_signature, report }
 * Auth: Bearer <supabase access token>
 *
 * Verifies the Razorpay client signature and, if valid, marks the order paid
 * and grants the entitlement immediately (for instant unlock). The webhook is
 * the redundant, authoritative backup in case the browser never returns.
 */
import { REPORTS, json, getUserFromRequest, hmacSha256Hex, safeEqual, markOrderPaid, grantEntitlement, getOrder, assignInvoiceNo, sendReceiptEmail, claimReceipt, upsertSubscriber } from './_shared.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RAZORPAY_KEY_SECRET || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(503, { error: 'unconfigured' });
  }

  const user = await getUserFromRequest(request, env);
  if (!user) return json(401, { error: 'auth_required' });

  let body;
  try { body = await request.json(); } catch { return json(400, { error: 'bad_request' }); }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, report } = body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !report) {
    return json(400, { error: 'missing_fields' });
  }
  if (!REPORTS[report]) return json(404, { error: 'not_found' });

  const expected = await hmacSha256Hex(env.RAZORPAY_KEY_SECRET, `${razorpay_order_id}|${razorpay_payment_id}`);
  if (!safeEqual(expected, razorpay_signature)) {
    return json(400, { error: 'invalid_signature' });
  }

  // The tier is authoritative from the order we recorded at checkout, not the client.
  const order = await getOrder(env, razorpay_order_id);
  const tier = order?.tier || 'report';

  await markOrderPaid(env, razorpay_order_id, razorpay_payment_id);
  await grantEntitlement(env, { userId: user.id, email: user.email, slug: report, tier });

  // Invoice number + confirmation/receipt email (never block the unlock on these).
  const invoiceNo = await assignInvoiceNo(env, razorpay_order_id);
  const entry = REPORTS[report] || {};
  await upsertSubscriber(env, user.email, 'purchase');
  if (await claimReceipt(env, razorpay_order_id)) {
    await sendReceiptEmail(env, {
      email: user.email, title: entry.title, slug: report, tier,
      amountInr: order?.amount_inr, invoiceNo, orderId: razorpay_order_id, paymentId: razorpay_payment_id,
    });
  }

  return json(200, { ok: true, tier, invoiceNo });
}
