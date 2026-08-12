'use client';

import { useState } from 'react';

type FeedbackType = 'report_request' | 'site_gap' | 'report_rating' | 'general';

const TYPE_OPTIONS: { v: FeedbackType; l: string }[] = [
  { v: 'report_request', l: 'Request a report / suggest a topic' },
  { v: 'site_gap', l: "I couldn't find what I was looking for" },
  { v: 'general', l: 'General feedback or suggestion' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  color: 'var(--text)',
  padding: '11px 13px',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  letterSpacing: '.04em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: 6,
  fontWeight: 600,
};

interface Props {
  /** Preselected feedback type; hides the type selector when `lockType` is true. */
  defaultType?: FeedbackType;
  lockType?: boolean;
  /** When set, submitted with the feedback (e.g. rating a specific report). */
  reportSlug?: string;
  source?: string;
  /** Compact heading text; omit for no heading. */
  heading?: string;
  subheading?: string;
}

export function FeedbackForm({
  defaultType = 'report_request',
  lockType = false,
  reportSlug,
  source = 'feedback-form',
  heading,
  subheading,
}: Props) {
  const [type, setType] = useState<FeedbackType>(defaultType);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!topic.trim() && !message.trim()) {
      setStatus('error');
      setErrorText('Please tell us the topic you want, or add a short message.');
      return;
    }
    setStatus('sending');
    setErrorText('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type,
          topic: topic.trim(),
          message: message.trim(),
          email: email.trim(),
          report_slug: reportSlug,
          subscribe: subscribe && !!email.trim(),
          source,
          page_url: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      });
      let data: { ok?: boolean; message?: string } | null = null;
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.ok) {
        setStatus('error');
        setErrorText(data?.message || 'Something went wrong. Please try again, or email labs@techadyant.com.');
        return;
      }
      setStatus('sent');
    } catch {
      setStatus('error');
      setErrorText('Could not reach the server. Please check your connection and try again.');
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 26px' }} role="status">
        <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--signal-live, #34D399)', marginBottom: 10 }}>
          Received
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>Thank you — noted.</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
          We read every request. It goes straight into our research pipeline, and it genuinely shapes what we publish next
          {email.trim() ? <> — we may write to <strong>{email.trim()}</strong> if we take it up.</> : '.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '26px', display: 'grid', gap: 15 }}>
      {heading && <div><h3 style={{ margin: '0 0 4px', fontSize: 20 }}>{heading}</h3>{subheading && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{subheading}</p>}</div>}

      {!lockType && (
        <div>
          <label style={labelStyle} htmlFor="fb-type">What&rsquo;s this about?</label>
          <select id="fb-type" style={{ ...inputStyle, appearance: 'auto' }} value={type} onChange={(e) => setType(e.target.value as FeedbackType)} disabled={status === 'sending'}>
            {TYPE_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
      )}

      {type === 'report_request' && (
        <div>
          <label style={labelStyle} htmlFor="fb-topic">Topic or sector</label>
          <input id="fb-topic" style={inputStyle} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. India's power-electronics supply chain" disabled={status === 'sending'} />
        </div>
      )}
      {type === 'site_gap' && (
        <div>
          <label style={labelStyle} htmlFor="fb-topic">What were you looking for?</label>
          <input id="fb-topic" style={inputStyle} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. a report on solar inverter manufacturing" disabled={status === 'sending'} />
        </div>
      )}

      <div>
        <label style={labelStyle} htmlFor="fb-msg">{type === 'general' ? 'Your feedback' : 'Anything else? (optional)'}</label>
        <textarea id="fb-msg" style={{ ...inputStyle, minHeight: 96, resize: 'vertical' }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={type === 'general' ? 'What would make the platform more useful for you?' : 'Any context on why, and how you’d use it.'} disabled={status === 'sending'} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="fb-email">Email (optional)</label>
        <input id="fb-email" type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organisation.com — if you'd like a reply" disabled={status === 'sending'} />
      </div>

      {email.trim() && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} disabled={status === 'sending'} />
          Also add me to the list, so I hear when this ships.
        </label>
      )}

      {status === 'error' && <p role="alert" style={{ fontSize: 14, color: 'var(--accent-warm, #FB923C)', margin: 0 }}>{errorText}</p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <button type="submit" className="btn-ed btn-ed-primary" disabled={status === 'sending'} style={{ cursor: status === 'sending' ? 'wait' : 'pointer' }}>
          {status === 'sending' ? 'Sending…' : 'Send'} <span className="arr">→</span>
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No account needed. We read every one.</span>
      </div>
    </form>
  );
}
