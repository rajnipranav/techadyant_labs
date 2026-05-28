'use client';

import { useEffect, useState } from 'react';
import { useReportCommerce } from './ReportCommerce';
import { useAuth } from './AuthProvider';

const LOCKED_SECTIONS = [
  '04 · Water, power & land',
  '05 · The packaging layer',
  '06 · Who captures the value',
  '07 · The talent constraint',
  '08 · Second-order effects',
  '09 · What to watch · references',
];

export function PremiumBody() {
  const { slug, entitled, checking, priceLabel, purchase, busy } = useReportCommerce();
  const { accessToken, user } = useAuth();
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!entitled || html) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/report-body?report=${encodeURIComponent(slug)}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d?.html) setHtml(d.html); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [entitled, slug, accessToken, html]);

  if (entitled) {
    if (loading) return <p className="serif" style={{ color: 'var(--text-muted)' }}>Loading the full report…</p>;
    if (html) return <div dangerouslySetInnerHTML={{ __html: html }} />;
    return null;
  }

  // Paywall (not entitled)
  return (
    <div className="premium-gate" aria-label="The rest of this report is premium">
      <div className="premium-fade" aria-hidden="true" />
      <div className="premium-card">
        <div className="pg-kicker">Continue reading</div>
        <h3 className="pg-title">Unlock the complete report</h3>
        <p className="pg-sub">
          You’re reading the free preview. The full analysis continues with six more sections
          and the downloadable PDF edition.
        </p>
        <ul className="pg-locked">
          {LOCKED_SECTIONS.map((s) => <li key={s}><span className="pg-lock">🔒</span>{s}</li>)}
        </ul>
        <button className="btn-ed btn-ed-primary pg-btn" onClick={purchase} disabled={busy || checking}>
          {checking ? 'Checking access…' : busy ? 'Opening checkout…' : `Unlock for ${priceLabel}`} <span className="arr">→</span>
        </button>
        <p className="pg-fine">
          {user ? 'One-time purchase · lifetime access · secure checkout via Razorpay.'
                : 'You’ll be asked to sign in, then complete a one-time secure purchase.'}
        </p>
      </div>
    </div>
  );
}
