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
  const { access, priceLabel, entitled, checking, busy, message, purchase, download, downloadDeck } = useReportCommerce();

  const meta = [pages ? `${pages}-page PDF` : null, readingTime, 'Figures & citations included']
    .filter(Boolean).join(' · ');

  // previewObject may be: an absolute URL; a "<bucket>/<path>" reference served from a
  // Supabase public bucket (built from NEXT_PUBLIC_SUPABASE_URL); or a bare filename
  // under /public/previews/.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const previewHref = previewObject
    ? /^https?:\/\//.test(previewObject)
      ? previewObject
      : previewObject.includes('/')
        ? `${supabaseUrl}/storage/v1/object/public/${previewObject}`
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
          {deckLabel ? (
            <button className="btn-ed btn-ed-ghost ra-btn" onClick={() => downloadDeck()} disabled={busy} style={{ marginTop: 8 }}>
              {deckLabel} <span className="arr">↓</span>
            </button>
          ) : null}
          <p className="ra-fine">You own this report · lifetime access. Your purchase includes the investor deck.</p>
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
