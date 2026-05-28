'use client';

import { useReportCommerce } from './ReportCommerce';

/** Top-of-report purchase / download panel. Renders inside ReportCommerceProvider. */
export function ReportAccess({ pages, readingTime }: { pages?: number; readingTime: string }) {
  const { access, priceLabel, entitled, checking, busy, message, purchase, download } = useReportCommerce();

  const meta = [pages ? `${pages}-page PDF` : null, readingTime, 'Figures & citations included']
    .filter(Boolean).join(' · ');

  return (
    <div className="report-access" data-tier={access}>
      <div className="ra-head">
        <span className="ra-price">{access === 'free' ? 'Free' : priceLabel}</span>
        {access === 'paid' && <span className="ra-badge">{entitled ? 'Owned' : 'Complete report'}</span>}
      </div>

      <p className="ra-meta">{meta}</p>

      {entitled ? (
        <>
          <button className="btn-ed btn-ed-primary ra-btn" onClick={download} disabled={busy}>
            {busy ? 'Preparing…' : 'Download PDF'} <span className="arr">↓</span>
          </button>
          <p className="ra-fine">{access === 'free' ? 'Free — no registration required.' : 'You own this report · lifetime access.'}</p>
        </>
      ) : checking ? (
        <p className="ra-fine">Checking your access…</p>
      ) : (
        <>
          <button className="btn-ed btn-ed-primary ra-btn" onClick={purchase} disabled={busy}>
            {busy ? 'Opening checkout…' : `Buy the complete report — ${priceLabel}`} <span className="arr">→</span>
          </button>
          <p className="ra-fine">One-time purchase · lifetime access · secure checkout via Razorpay.</p>
        </>
      )}

      {message && (
        <p className={`ra-msg ${message.kind === 'error' ? 'ra-msg-error' : ''}`} role="status">{message.text}</p>
      )}
    </div>
  );
}
