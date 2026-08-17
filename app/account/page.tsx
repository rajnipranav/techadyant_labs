'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import { getSupabase } from '../lib/supabase';
import { reports } from '../reports/data';

const DATA_TIERS = ['report_plus_data', 'data_only', 'bundle'];

interface Ent { report_slug: string; tier: string | null; granted_at: string }
interface Ord {
  report_slug: string; tier: string | null; amount_inr: number | null;
  invoice_no: string | null; razorpay_order_id: string | null;
  status: string; created_at: string; paid_at: string | null;
}
type Tab = 'library' | 'orders' | 'prefs';

function initialsFor(email: string): string {
  const local = (email.split('@')[0] || '').trim();
  const parts = local.split(/[._\-+]+/).filter(Boolean);
  const a = parts[0]?.[0] || '';
  const b = parts[1]?.[0] || parts[0]?.[1] || '';
  return (a + b).toUpperCase();
}

function fmtDate(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtMonthYear(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export default function AccountPage() {
  const { user, loading, configured, openSignIn, signOut, accessToken } = useAuth();
  const [ents, setEnts] = useState<Ent[] | null>(null);
  const [orders, setOrders] = useState<Ord[] | null>(null);
  const [tab, setTab] = useState<Tab>('library');
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    supabase.from('entitlements').select('report_slug, tier, granted_at').eq('user_id', user.id)
      .then(({ data }) => setEnts((data as Ent[]) ?? []));
    supabase.from('orders')
      .select('report_slug, tier, amount_inr, invoice_no, razorpay_order_id, status, created_at, paid_at')
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

  const owned = ents?.length ?? 0;
  const dataPacks = (ents ?? []).filter((e) => {
    const ord = (orders ?? []).find((o) => o.report_slug === e.report_slug);
    return DATA_TIERS.includes(String(e.tier ?? ord?.tier ?? ''));
  }).length;
  const totalInvested = (orders ?? []).reduce((s, o) => s + (o.amount_inr ?? 0), 0);
  const memberSince = fmtMonthYear(user?.created_at);

  const stats = [
    { k: 'Reports owned', v: String(owned), tone: false },
    { k: 'Data packs', v: String(dataPacks), tone: false },
    { k: 'Total invested', v: totalInvested > 0 ? '₹' + totalInvested.toLocaleString('en-IN') : '—', tone: true },
    { k: 'Member since', v: memberSince ?? '—', tone: false },
  ];

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'library', label: 'Library', count: ents ? ents.length : undefined },
    { id: 'orders', label: 'Orders & invoices', count: orders ? orders.length : undefined },
    { id: 'prefs', label: 'Preferences' },
  ];

  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Account</span></div>
          <h1>Your account</h1>
          <p className="lede">Your reader profile, report library, downloads and invoices.</p>
        </div>
      </header>

      <section className="wrap" style={{ paddingTop: 48, paddingBottom: 72 }}>
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
          <div className="account-shell">
            <aside className="account-side">
              <div className="account-side-card">
                <div className="account-avatar" aria-hidden="true">{initialsFor(user.email || '')}</div>
                <div className="account-email">{user.email}</div>
                <div className="account-since">Member since {memberSince ?? '—'}</div>
              </div>
              <nav className="account-tabs" role="tablist" aria-label="Account sections">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    className={'account-tab' + (tab === t.id ? ' is-active' : '')}
                    onClick={() => setTab(t.id)}
                  >
                    {t.label}
                    {typeof t.count === 'number' && <span className="tab-n">{t.count}</span>}
                  </button>
                ))}
              </nav>
              <button className="auth-signout account-signout" onClick={() => signOut()}>Sign out</button>
            </aside>

            <div className="account-main">
              <div className="account-stats">
                {stats.map((s) => (
                  <div className="stat-tile" key={s.k}>
                    <div className={'stat-v' + (s.tone ? ' tone-brass' : '')}>{s.v}</div>
                    <div className="stat-k">{s.k}</div>
                  </div>
                ))}
              </div>

              {tab === 'library' && (
                <section className="account-section">
                  <div className="section-head-ed">
                    <div><div className="ed-kicker">Your library</div><h2>Purchased reports</h2></div>
                  </div>

                  {ents === null ? (
                    <p className="serif" style={{ color: 'var(--text-muted)' }}>Loading library…</p>
                  ) : ents.length === 0 ? (
                    <div className="exec-summary">
                      <div className="es-label">No purchases yet</div>
                      <p className="serif" style={{ marginBottom: 16 }}>You haven&apos;t purchased any reports yet. Browse the catalogue to get started.</p>
                      <Link href="/reports/" className="btn-ed btn-ed-ghost">Browse reports <span className="arr">→</span></Link>
                    </div>
                  ) : (
                    <div className="lib-grid">
                      {ents.map((e) => {
                        const r = reports.find((x) => x.slug === e.report_slug);
                        const ord = (orders ?? []).find((o) => o.report_slug === e.report_slug);
                        const hasData = DATA_TIERS.includes(String(e.tier ?? ord?.tier ?? ''));
                        const granted = fmtDate(e.granted_at);
                        return (
                          <div key={e.report_slug} className="lib-card">
                            <Link href={`/reports/${e.report_slug}/`} className="lib-cover" tabIndex={-1} aria-hidden="true">
                              {r?.cover
                                ? <img src={r.cover} alt="" loading="lazy" />
                                : <span>{(r?.domain?.[0] || 'R').toUpperCase()}</span>}
                            </Link>
                            <div className="lib-body">
                              <div className="lib-top">
                                <Link className="lib-title" href={`/reports/${e.report_slug}/`}>{r?.title ?? e.report_slug}</Link>
                                <span className={'badge' + (hasData ? ' badge-data' : '')}>{hasData ? 'Report + Data' : 'Report'}</span>
                              </div>
                              <div className="lib-meta">
                                {r?.domain && <span>{r.domain}</span>}
                                {r?.edition && <span> · {r.edition}</span>}
                                {granted && <span> · Granted {granted}</span>}
                              </div>
                              <div className="lib-actions">
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
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {tab === 'orders' && (
                <section className="account-section">
                  <div className="section-head-ed">
                    <div><div className="ed-kicker">Billing</div><h2>Orders &amp; invoices</h2></div>
                  </div>

                  {orders === null ? (
                    <p className="serif" style={{ color: 'var(--text-muted)' }}>Loading orders…</p>
                  ) : orders.length === 0 ? (
                    <div className="exec-summary">
                      <div className="es-label">No invoices yet</div>
                      <p className="serif" style={{ marginBottom: 16 }}>When you purchase a report, your order and invoice will appear here.</p>
                      <Link href="/reports/" className="btn-ed btn-ed-ghost">Browse reports <span className="arr">→</span></Link>
                    </div>
                  ) : (
                    <div className="orders-wrap">
                      <table className="orders-table">
                        <thead>
                          <tr><th>Date</th><th>Report</th><th>Licence</th><th>Amount</th><th>Invoice no.</th><th></th></tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => {
                            const r = reports.find((x) => x.slug === o.report_slug);
                            const hasData = DATA_TIERS.includes(String(o.tier ?? ''));
                            return (
                              <tr key={o.razorpay_order_id || o.created_at}>
                                <td>{fmtDate(o.created_at) ?? '—'}</td>
                                <td><Link href={`/reports/${o.report_slug}/`}>{r?.title ?? o.report_slug}</Link></td>
                                <td>{hasData ? 'Report + Data' : 'Report'}</td>
                                <td className="amt">{o.amount_inr != null ? '₹' + o.amount_inr.toLocaleString('en-IN') : '—'}</td>
                                <td>{o.invoice_no || '—'}</td>
                                <td>
                                  {o.razorpay_order_id && (
                                    <button className="btn-ed btn-ed-ghost acct-btn" disabled={busy === 'inv' + o.razorpay_order_id} onClick={() => openInvoice(o.razorpay_order_id!)}>
                                      {busy === 'inv' + o.razorpay_order_id ? 'Opening…' : 'Invoice'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}

              {tab === 'prefs' && (
                <section className="account-section">
                  <div className="section-head-ed">
                    <div><div className="ed-kicker">Settings</div><h2>Preferences</h2></div>
                  </div>

                  <div className="prefs-card">
                    <div className="pref-row">
                      <div><div className="pref-k">Email</div><div className="pref-v">{user.email}</div></div>
                    </div>
                    <div className="pref-row">
                      <div><div className="pref-k">Password</div><div className="pref-v">Update or reset your password.</div></div>
                      <Link href="/account/reset/" className="btn-ed btn-ed-ghost">Reset password</Link>
                    </div>
                    <div className="pref-row">
                      <div><div className="pref-k">Newsletter — Sanket</div><div className="pref-v">Manage your email preferences and briefings.</div></div>
                      <Link href="/newsletter/" className="btn-ed btn-ed-ghost">Manage</Link>
                    </div>
                    <div className="pref-row">
                      <div><div className="pref-k">Account</div><div className="pref-v">Sign out of this device.</div></div>
                      <button className="auth-signout" onClick={() => signOut()}>Sign out</button>
                    </div>
                  </div>
                </section>
              )}

              <p className="note-fine">
                Downloads are personal to your account. Need a formal invoice or a GST invoice once we are registered?
                Email <a href="mailto:info@techadyant.com">info@techadyant.com</a>.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
