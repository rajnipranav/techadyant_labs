'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import { getSupabase } from '../lib/supabase';
import { reports } from '../reports/data';

const DATA_TIERS = ['report_plus_data', 'data_only', 'bundle'];

interface Ent { report_slug: string; tier: string | null; granted_at: string }
interface Ord { report_slug: string; tier: string | null; invoice_no: string | null; razorpay_order_id: string | null; status: string; created_at: string }

export default function AccountPage() {
  const { user, loading, configured, openSignIn, signOut, accessToken } = useAuth();
  const [ents, setEnts] = useState<Ent[] | null>(null);
  const [orders, setOrders] = useState<Ord[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    supabase.from('entitlements').select('report_slug, tier, granted_at').eq('user_id', user.id)
      .then(({ data }) => setEnts((data as Ent[]) ?? []));
    supabase.from('orders').select('report_slug, tier, invoice_no, razorpay_order_id, status, created_at')
      .eq('user_id', user.id).eq('status', 'paid').order('created_at', { ascending: false })
      .then(({ data }) => setOrders((data as Ord[]) ?? []));
  }, [user]);

  const download = useCallback(async (slug: string, asset?: 'data') => {
    setBusy(slug + (asset || ''));
    try {
      const res = await fetch(`/api/download?report=${encodeURIComponent(slug)}${asset ? `&asset=${asset}` : ''}`,
        { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) window.location.assign(data.url);
    } finally { setBusy(null); }
  }, [accessToken]);

  const openInvoice = useCallback(async (orderId: string) => {
    setBusy('inv' + orderId);
    try {
      const res = await fetch(`/api/invoice?order=${encodeURIComponent(orderId)}`,
        { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} });
      if (!res.ok) return;
      const html = await res.text();
      const w = window.open('', '_blank');
      if (w) { w.document.open(); w.document.write(html); w.document.close(); }
    } finally { setBusy(null); }
  }, [accessToken]);

  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Account</span></div>
          <h1>Your account</h1>
          <p className="lede">Your reader profile, report library, downloads and invoices.</p>
        </div>
      </header>

      <section className="wrap-narrow" style={{ paddingTop: 40 }}>
        {!configured ? (
          <div className="exec-summary"><div className="es-label">Accounts</div><p className="serif">Accounts are being set up. Please check back shortly.</p></div>
        ) : loading ? (
          <p className="serif" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : !user ? (
          <div className="exec-summary">
            <div className="es-label">Sign in required</div>
            <p className="serif" style={{ marginBottom: 16 }}>Sign in to view your library, downloads and invoices.</p>
            <button className="btn-ed btn-ed-primary" onClick={() => openSignIn()}>Sign in <span className="arr">→</span></button>
          </div>
        ) : (
          <>
            <div className="account-head">
              <div><div className="label">Signed in as</div><div className="account-email">{user.email}</div></div>
              <button className="auth-signout" onClick={() => signOut()}>Sign out</button>
            </div>

            <div className="section-head-ed" style={{ marginTop: 40 }}>
              <div><div className="ed-kicker">Your library</div><h2>Purchased reports</h2></div>
            </div>

            {ents === null ? (
              <p className="serif" style={{ color: 'var(--text-muted)' }}>Loading library…</p>
            ) : ents.length === 0 ? (
              <div className="exec-summary">
                <div className="es-label">No purchases yet</div>
                <p className="serif" style={{ marginBottom: 16 }}>You haven’t purchased any reports yet. Browse the catalogue to get started.</p>
                <Link href="/reports/" className="btn-ed btn-ed-ghost">Browse reports <span className="arr">→</span></Link>
              </div>
            ) : (
              <div className="acct-lib">
                {ents.map((e) => {
                  const r = reports.find((x) => x.slug === e.report_slug);
                  const ord = orders.find((o) => o.report_slug === e.report_slug);
                  const hasData = DATA_TIERS.includes(String(e.tier ?? ord?.tier));
                  return (
                    <div key={e.report_slug} className="acct-item">
                      <div className="acct-item-main">
                        <Link href={`/reports/${e.report_slug}/`} className="acct-title">{r?.title ?? e.report_slug}</Link>
                        <div className="acct-meta">
                          {hasData ? 'Report + Data licence' : 'Report licence'}
                          {ord?.invoice_no ? ` · Invoice ${ord.invoice_no}` : ''}
                        </div>
                      </div>
                      <div className="acct-actions">
                        <button className="btn-ed btn-ed-primary acct-btn" disabled={busy === e.report_slug} onClick={() => download(e.report_slug)}>
                          {busy === e.report_slug ? 'Preparing…' : 'PDF'} ↓
                        </button>
                        {hasData && (
                          <button className="btn-ed btn-ed-ghost acct-btn" disabled={busy === e.report_slug + 'data'} onClick={() => download(e.report_slug, 'data')}>
                            {busy === e.report_slug + 'data' ? 'Preparing…' : 'Data (XLSX)'} ↓
                          </button>
                        )}
                        {ord?.razorpay_order_id && (
                          <button className="btn-ed btn-ed-ghost acct-btn" disabled={busy === 'inv' + ord.razorpay_order_id} onClick={() => openInvoice(ord.razorpay_order_id!)}>
                            Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="note-fine" style={{ marginTop: 28 }}>
              Downloads are personal to your account. Need a formal invoice or a GST invoice once we are registered?
              Email <a href="mailto:info@techadyant.com">info@techadyant.com</a>.
            </p>
          </>
        )}
      </section>
    </>
  );
}
