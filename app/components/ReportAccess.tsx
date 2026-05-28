'use client';

import { useReportCommerce } from './ReportCommerce';

interface Props {
  pages?: number;
  readingTime: string;
  previewObject?: string;
  previewPages?: number;
}

/** Top-of-report purchase / download panel. Renders inside ReportCommerceProvider. */
export function ReportAccess({ pages, readingTime, previewObject, previewPages }: Props) {
  const { access, priceLabel, entitled, checking, busy, message, purchase, download } = useReportCommerce();

  const meta = [pages ? `${pages}-page PDF` : null, readingTime, 'Figures & citations included']
    .filter(Boolean).join(' · ');

  const previewHref = previewObject ? `/previews/${previewObject}` : null;
  const previewLabel = previewPages ? `Free preview · ${previewPages} pages` : 'Free preview';

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
          <