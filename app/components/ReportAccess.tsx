'use client';

import { useReportCommerce } from './ReportCommerce';

interface Props {
  pages?: number;
  readingTime: string;
  previewObject?: string;
  previewPages?: number;
  deckLabel?: string;
}

/** Top-of-report access panel. Renders inside ReportCommerceProvider. */
export function ReportAccess({ pages, readingTime, previewObject, previewPages, deckLabel }: Props) {
  const { access, priceLabel, entitled, checking, busy, message, purchase, download, downloadDeck,
    hasData, dataPriceLabel, dataEntitled, downloadData } = useReportCommerce();

  const meta = [pages ? `${pages}-page PDF` : null, readingTime, 'Figures & citations included']
    .filter(Boolean).join(' · ');

  // previewObject may be: an absolute URL; a "<bucket>/<path>" reference served from
  // the public R2 bucket/library domain; or a bare filename under /public/previews/.
  const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE || 'https://library.techadyant.com';
  const r2Prefix = (process.env.NEXT_PUBLIC_R2_FREE_PREFIX || 'free reports').replace(/^\/|\/$/g, '');
  const previewHref = previewObject
    ? /^https?:\/\//.test(previewObject)
      ? previewObject
      : previewObject.includes('/')
        ? `${r2Base}/${r2Prefix ? r2Prefix + '/' : ''}${previewObject}`
        : `/previews/${previewObject}`
    : null;

  // FREE report: the public PDF IS the full report — direct download, no commerce flow,
  // no condensed-preview button.
  if (access === 'free') {
    return (
      <div className="report-access" data-tier="free">
        <div className="ra-head"><span className="ra-price">Free</span></div>
        <p className="ra-meta">{meta}</p>
        {previewHref ? (
          <>
            <a className="btn-ed btn-ed-primary ra-btn" href={previewHref} target="_blank" rel="noopener" download>
              Download PDF <span className="arr">↓</span>
            </a>
            <p className="ra-fine">Free — no registration required.</p>
          </>
        ) : (
          <p className="ra-fine">The PDF is being prepared.</p>
        )}
      </div>
    );
  }

  // PAID report: entitlement / purchase, plus the condensed free preview.
  const previewLabel = previewPages ? `Free condensed report · ${previewPages} pages` : 'Free condensed report';
  return (
    <div className="report-access" data-tier={access}>
      <div className="ra-head">
        <span className="ra-price">{priceLabel}</span>
        <span className="ra-badge">{entitled ? 'Owned' : 'Complete report'}</span>
      </div>

      <p className="ra-meta">{meta}</p>

      {entitled ? (
        <>
          <button className="btn-ed btn-ed-primary ra-btn" onClick={download} disabled={busy}>
            {busy ? 'Preparing…' : 'Download PDF'} <span className="arr">↓</span>
          </button>
          {hasData && dataEntitled ? (
            <button className="btn-ed btn-ed-ghost ra-btn" onClick={() => downloadData()} disabled={busy} style={{ marginTop: 8 }}>
              Download data pack (XLSX) <span className="arr">↓</span>
            </button>
          ) : null}
          {deckLabel ? (
            <button className="btn-ed btn-ed-ghost ra-btn" onClick={() => downloadDeck()} disabled={busy} style={{ marginTop: 8 }}>
              {deckLabel} <span className="arr">↓</span>
            </button>
          ) : null}
          <p className="ra-fine">You own this report · lifetime access.{dataEntitled ? ' Your purchase includes the data pack.' : ''}</p>
        </>
      ) : checking ? (
        <p className="ra-fine">Checking your access…</p>
      ) : hasData ? (
        <>
          <button className="btn-ed btn-ed-primary ra-btn" onClick={() => purchase('report')} disabled={busy}>
            {busy ? 'Opening checkout…' : `Report — ${priceLabel}`} <span className="arr">→</span>
          </button>
          <button className="btn-ed btn-ed-primary ra-btn" onClick={() => purchase('report_plus_data')} disabled={busy} style={{ marginTop: 8 }}>
            {busy ? 'Opening checkout…' : `Report + Data pack${dataPriceLabel ? ` — ${dataPriceLabel}` : ''}`} <span className="arr">→</span>
          </button>
          <p className="ra-fine">The data pack adds the full underlying dataset (Excel) behind the report — figures, scores and sources. One-time purchase · lifetime access · Razorpay.</p>
        </>
      ) : (
        <>
          <button className="btn-ed btn-ed-primary ra-btn" onClick={() => purchase('report')} disabled={busy}>
            {busy ? 'Opening checkout…' : `Buy the complete report — ${priceLabel}`} <span className="arr">→</span>
          </button>
          <p className="ra-fine">One-time purchase · lifetime access · secure checkout via Razorpay.</p>
        </>
      )}

      {previewHref && (
        <div className="ra-preview">
          <a className="btn-ed btn-ed-ghost ra-preview-btn" href={previewHref} target="_blank" rel="noopener" download>
            {previewLabel} <span className="arr">↓</span>
          </a>
          <p className="ra-fine ra-preview-fine">
            Free condensed edition — the thesis, the framework and the headline findings, with figures. No signup required.
          </p>
        </div>
      )}

      {message && (
        <p className={`ra-msg ${message.kind === 'error' ? 'ra-msg-error' : ''}`} role="status">{message.text}</p>
      )}
    </div>
  );
}
