'use client';

import { useState } from 'react';

function track(event: string, params: Record<string, any> = {}) {
  try { const g = (window as any).gtag; if (typeof g === 'function') g('event', event, params); } catch {}
}

interface Props {
  /** report | signal | atlas | corridor | dependency */
  contentType: string;
  /** slug / id of the content */
  contentId?: string;
  /** Prompt wording; defaults to "Did this answer your question?" */
  prompt?: string;
}

/** Lightweight bottom-of-page feedback. One tap for Yes; Partly/No reveals a
 *  short "what were you looking for?" field. Feeds the same /api/feedback store
 *  (type: content_feedback) as the Shape system. Never a long survey. */
export function MicroFeedback({ contentType, contentId, prompt = 'Did this answer your question?' }: Props) {
  const [helpful, setHelpful] = useState<'yes' | 'partly' | 'no' | null>(null);
  const [gap, setGap] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  async function send(h: 'yes' | 'partly' | 'no', withDetail: boolean) {
    setSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'content_feedback',
          helpful: h,
          gap: withDetail ? gap.trim() : '',
          email: withDetail ? email.trim() : '',
          content_type: contentType,
          report_slug: contentId,
          source: `micro-${contentType}`,
          page_url: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      });
    } catch {}
    track(h === 'yes' ? 'content_helpful_yes' : h === 'partly' ? 'content_helpful_partial' : 'content_helpful_no', { content_type: contentType, content_id: contentId });
    if (withDetail && gap.trim()) track('followup_gap_submitted', { content_type: contentType });
    setSending(false);
    setDone(true);
  }

  function choose(h: 'yes' | 'partly' | 'no') {
    setHelpful(h);
    if (h === 'yes') send('yes', false); // one-tap, no detail needed
  }

  if (done) {
    return (
      <div style={box} role="status">
        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Thanks — noted. This helps us decide what to research next.</span>
      </div>
    );
  }

  return (
    <div style={box}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14.5, fontWeight: 600 }}>{prompt}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['yes', 'partly', 'no'] as const).map((h) => (
            <button key={h} type="button" onClick={() => choose(h)} disabled={sending}
              style={{ ...pill, borderColor: helpful === h ? 'var(--accent, #C9A84C)' : 'var(--border)', background: helpful === h ? 'var(--accent, #C9A84C)22' : 'transparent' }}>
              {h === 'yes' ? 'Yes' : h === 'partly' ? 'Partly' : 'No'}
            </button>
          ))}
        </div>
      </div>

      {(helpful === 'partly' || helpful === 'no') && (
        <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>What were you still looking for?</label>
          <input value={gap} onChange={(e) => setGap(e.target.value)} placeholder="The specific thing you couldn’t find" disabled={sending}
            style={field} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional — if you’d like us to follow up)" disabled={sending}
            style={field} />
          <div>
            <button type="button" className="btn-ed btn-ed-primary" onClick={() => send(helpful, true)} disabled={sending} style={{ cursor: sending ? 'wait' : 'pointer' }}>
              {sending ? 'Sending…' : 'Send'} <span className="arr">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const box: React.CSSProperties = {
  border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px',
  background: 'var(--bg-2, rgba(255,255,255,.02))',
};
const pill: React.CSSProperties = {
  padding: '6px 15px', borderRadius: 20, border: '1px solid var(--border)', color: 'var(--text)',
  cursor: 'pointer', fontSize: 14, font: 'inherit',
};
const field: React.CSSProperties = {
  width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
  color: 'var(--text)', padding: '10px 12px', fontSize: 14.5, fontFamily: 'inherit', outline: 'none',
};
