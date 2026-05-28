'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import { getSupabase } from '../lib/supabase';
import { reports } from '../reports/data';

interface Entitlement { report_slug: string; granted_at: string }

export default function AccountPage() {
  const { user, loading, configured, openSignIn, signOut, accessToken } = useAuth();
  const [ents, setEnts] = useState<Entitlement[] | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    supabase
      .from('entitlements')
      .select('report_slug, granted_at')
      .eq('user_id', user.id)
      .then(({ data }) => setEnts((data as Entitlement[]) ?? []));
  }, [user]);

  async function download(slug: string) {
    const res = await fetch(`/api/download?report=${encodeURIComponent(slug)}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u; a.download = `${slug}.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(u);
  }

  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Account</span>
          </div>
          <h1>Your account</h1>
          <p className="lede">Your reader profile and report library.</p>
        </div>
      </header>

      <section className="wrap-narrow" style={{ paddingTop: 40 }}>
        {!configured ? (
          <div className="exec-summary"><div className="es-label">Accounts</div>
            <p className="serif">Accounts are being set up. Please check back shortly.</p>
          </div>
        ) : loading ? (
          <p className="serif" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : !user ? (
          <div className="exec-summary">
            <div className="es-label">Sign in required</div>
            <p className="serif" style={{ marginBottom: 16 }}>Sign in to view your library and downloads.</p>
            <button className="btn-ed btn-ed-primary" onClick={() => openSignIn()}>Sign in <span className="arr">→</span></button>
          </div>
        ) : (
          <>
            <div className="account-head">
              <div>
                <div className="label">Signed in as</div>
                <div className="account-email">{user.email}</div>
              </div>
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
                <p className="serif" style={{ marginBottom: 16 }}>
                  You haven’t purchased any reports yet. Browse the catalogue to get started.
                </p>
                <Link href="/reports" className="btn-ed btn-ed-ghost">Browse reports <span className="arr">→</span></Link>
              </div>
            ) : (
              <div className="briefings rule-top">
                {ents.map((e) => {
                  const r = reports.find((x) => x.slug === e.report_slug);
                  return (
                    <div key={e.report_slug} className="briefing" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                      <Link href={`/reports/${e.report_slug}`} className="briefing-title">{r?.title ?? e.report_slug}</Link>
                      <button className="see-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => download(e.report_slug)}>Download PDF ↓</button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
