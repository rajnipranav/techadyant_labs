/**
 * GET /api/invoice?order=<razorpay_order_id>
 * Auth: Bearer <supabase access token>. Returns a printable HTML invoice for a paid
 * order, but only to the buyer who owns it. GST-aware via _shared.renderInvoiceHtml.
 */
import { COMPANY, REPORTS, json, getUserFromRequest, renderInvoiceHtml } from './_shared.js';

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('order');
    if (!orderId) return json(400, { error: 'missing_order' });

    const user = await getUserFromRequest(request, env);
    if (!user) return json(401, { error: 'auth_required' });

    const r = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?razorpay_order_id=eq.${encodeURIComponent(orderId)}&select=*&limit=1`,
      { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
    );
    const rows = r.ok ? await r.json().catch(() => []) : [];
    const o = Array.isArray(rows) && rows[0];
    if (!o) return json(404, { error: 'not_found' });
    if (o.user_id !== user.id) return json(403, { error: 'forbidden' });
    if (o.status !== 'paid') return json(409, { error: 'not_paid' });

    const entry = REPORTS[o.report_slug] || {};
    const dateLabel = new Date(o.paid_at || o.created_at).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
    });
    const html = renderInvoiceHtml({
      invoiceNo: o.invoice_no,
      dateLabel,
      buyerEmail: o.email,
      buyerName: user.user_metadata?.full_name || user.user_metadata?.name,
      title: entry.title || o.report_slug,
      tier: o.tier,
      amountInr: o.amount_inr,
      paymentId: o.razorpay_payment_id,
      orderId: o.razorpay_order_id,
    });
    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store' },
    });
  } catch (e) {
    return json(500, { error: 'exception', message: (e && e.message) || String(e) });
  }
}
