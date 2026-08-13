'use client';

import { useState } from 'react';

export type ShapeType =
  | 'research_suggestion'
  | 'research_question'
  | 'feature_request'
  | 'atlas_contribution'
  | 'site_gap';

const TYPE_OPTIONS: { v: ShapeType; l: string }[] = [
  { v: 'research_suggestion', l: 'Suggest research — a topic we should investigate' },
  { v: 'research_question', l: 'Ask a research question' },
  { v: 'feature_request', l: 'Suggest a feature' },
  { v: 'atlas_contribution', l: 'Improve the Atlas — something we’re missing' },
  { v: 'site_gap', l: 'Report an error or give feedback' },
];

const ATLAS_ENTITIES = ['Company', 'Product', 'Technology', 'Facility', 'Supplier', 'Component', 'Project', 'Corridor', 'Dependency', 'Opportunity', 'Other'];
const PAY = ['Yes', 'Possibly', 'No', 'Not applicable'];
const FOUND = [{ v: 'yes', l: 'Yes' }, { v: 'partly', l: 'Partly' }, { v: 'no', l: 'No' }];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
  color: 'var(--text)', padding: '11px 13px', fontSize: 15, fontFamily: 'inherit', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, letterSpacing: '.04em', textTransform: 'uppercase',
  color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600,
};

function track(event: string, params: Record<string, any> = {}) {
  try { const g = (window as any).gtag; if (typeof g === 'function') g('event', event, params); } catch {}
}

interface Props {
  defaultType?: ShapeType;
  lockType?: boolean;
  /** Submitted with the feedback (e.g. relating to a specific report). */
  reportSlug?: string;
  contentType?: string;
  source?: string;
  heading?: string;
  subheading?: string;
}

export function FeedbackForm({
  defaultType = 'research_suggestion',
  lockType = false,
  reportSlug,
  contentType,
  source = 'shape-form',
  heading,
  subheading,
}: Props) {
  const [type, setType] = useState<ShapeType>(defaultType);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [decision, setDecision] = useState('');
  const [gap, setGap] = useState('');
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  // type-specific extras
  const [pay, setPay] = useState('');
  const [entityType, setEntityType] = useState('Company');
  const [sourceUrl, setSourceUrl] = useState('');
  const [found, setFound] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const started = useState(false);
  function markStarted() { if (!started[0]) { started[1](true); track('shape_form_started', { form_type: type }); } }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    const primary = type === 'research_question' ? message : (topic || message);
    if (!primary.trim() && !gap.trim()) {
      setStatus('error');
      setErrorText('Please add a topic or your question so we know what you mean.');
      return;
    }
    setStatus('sending');
    setErrorText('');
    const details: Record<string, any> = {};
    if (type === 'research_suggestion' && pay) details.willingness_to_pay = pay;
    if (type === 'atlas_contribution') { details.entity_type = entityType; if (sourceUrl) details.source = sourceUrl; }
    if (type === 'research_question' && found) details.found = found;
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type,
          topic: topic.trim(),
          message: message.trim(),
          decision_context: decision.trim(),
          gap: gap.trim(),
          email: email.trim(),
          report_slug: reportSlug,
          content_type: contentType,
          details,
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
      track('shape_submit', { form_type: type });
      track(`${type}_submitted`);
    } catch {
      setStatus('error');
      setErrorText('Could not reach the server. Please check your connection and try again.');
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '30px 26px' }} role="status">
        <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--signal-live, #34D399)', marginBottom: 10 }}>
          Received
        </div>
        <h3 style={{ margin: '0 0 10px', fontSize: 21 }}>Added to the research queue.</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: '0 0 14px', lineHeight: 1.65 }}>
          What happens next: we review every submission, group similar questions, and let the strongest signals of demand
          shape what we research and build. Selected topics become Signals, Reports, Atlas updates or new features.
        </p>
        {email.trim() ? (
          <p style={{ color: 'var(--text-dim)', fontSize: 14, margin: 0 }}>We&rsquo;ll write to <strong>{email.trim()}</strong> if we take this up.</p>
        ) : (
          <p style={{ color: 'var(--text-dim)', fontSize: 14, margin: 0 }}>Add an email next time if you&rsquo;d like to hear when it ships.</p>
        )}
      </div>
    );
  }

  const askTopic = type !== 'research_question';
  const topicLabel =
    type === 'research_suggestion' ? 'Topic'
    : type === 'feature_request' ? 'Feature, in one line'
    : type === 'atlas_contribution' ? 'Name / entity'
    : 'What were you looking for?';
  const topicPlaceholder =
    type === 'research_suggestion' ? 'e.g. India’s drone battery supply chain'
    : type === 'feature_request' ? 'e.g. compare two corridors side by side'
    : type === 'atlas_contribution' ? 'e.g. Acme Semiconductors Pvt Ltd'
    : 'e.g. a report on solar inverter manufacturing';
  const messageLabel =
    type === 'research_question' ? 'Your question'
    : type === 'research_suggestion' ? 'What should we investigate?'
    : type === 'feature_request' ? 'What problem would it solve?'
    : type === 'atlas_contribution' ? 'What do you know about it?'
    : 'What’s wrong, or what’s missing?';

  return (
    <form onSubmit={handleSubmit} onFocus={markStarted} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '26px', display: 'grid', gap: 15 }}>
      {heading && <div><h3 style={{ margin: '0 0 4px', fontSize: 20 }}>{heading}</h3>{subheading && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{subheading}</p>}</div>}

      {!lockType && (
        <div>
          <label style={labelStyle} htmlFor="fb-type">What would you like to do?</label>
          <select id="fb-type" style={{ ...inputStyle, appearance: 'auto' }} value={type} onChange={(e) => setType(e.target.value as ShapeType)} disabled={status === 'sending'}>
            {TYPE_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
      )}

      {type === 'atlas_contribution' && (
        <div>
          <label style={labelStyle} htmlFor="fb-entity">What are we missing?</label>
          <select id="fb-entity" style={{ ...inputStyle, appearance: 'auto' }} value={entityType} onChange={(e) => setEntityType(e.target.value)} disabled={status === 'sending'}>
            {ATLAS_ENTITIES.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
      )}

      {askTopic && (
        <div>
          <label style={labelStyle} htmlFor="fb-topic">{topicLabel}</label>
          <input id="fb-topic" style={inputStyle} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={topicPlaceholder} disabled={status === 'sending'} />
        </div>
      )}

      <div>
        <label style={labelStyle} htmlFor="fb-msg">{messageLabel}{type === 'research_question' ? '' : ' (optional)'}</label>
        <textarea id="fb-msg" style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder={type === 'research_question' ? 'e.g. Which Indian companies actually manufacture drone motors, versus assemble them?' : 'A few lines of context.'} disabled={status === 'sending'} />
      </div>

      {(type === 'research_suggestion' || type === 'research_question') && (
        <div>
          <label style={labelStyle} htmlFor="fb-decision">What decision would this help you make?</label>
          <input id="fb-decision" style={inputStyle} value={decision} onChange={(e) => setDecision(e.target.value)} placeholder="e.g. whether to invest, where to build capacity, which supplier to evaluate" disabled={status === 'sending'} />
        </div>
      )}

      {type === 'research_question' && (
        <div>
          <label style={labelStyle}>Did you find this on Techadyant already?</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FOUND.map((f) => (
              <button type="button" key={f.v} onClick={() => setFound(f.v)} disabled={status === 'sending'}
                style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${found === f.v ? 'var(--accent, #C9A84C)' : 'var(--border)'}`, background: found === f.v ? 'var(--accent, #C9A84C)22' : 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: 14 }}>
                {f.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {(type === 'site_gap' || (type === 'research_question' && (found === 'partly' || found === 'no'))) && (
        <div>
          <label style={labelStyle} htmlFor="fb-gap">What were you still looking for?</label>
          <input id="fb-gap" style={inputStyle} value={gap} onChange={(e) => setGap(e.target.value)} placeholder="The specific thing you couldn’t find" disabled={status === 'sending'} />
        </div>
      )}

      {type === 'atlas_contribution' && (
        <div>
          <label style={labelStyle} htmlFor="fb-src">Source (link, optional but encouraged)</label>
          <input id="fb-src" style={inputStyle} value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://…" disabled={status === 'sending'} />
        </div>
      )}

      {type === 'research_suggestion' && (
        <div>
          <label style={labelStyle} htmlFor="fb-pay">Would you consider decision-grade research on this?</label>
          <select id="fb-pay" style={{ ...inputStyle, appearance: 'auto' }} value={pay} onChange={(e) => setPay(e.target.value)} disabled={status === 'sending'}>
            <option value="">Prefer not to say</option>
            {PAY.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
      )}

      <div>
        <label style={labelStyle} htmlFor="fb-email">Email (optional)</label>
        <input id="fb-email" type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Only if you’d like us to notify you if we take this up" disabled={status === 'sending'} />
      </div>

      {email.trim() && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} disabled={status === 'sending'} />
          Also add me to the list, so I hear when this ships.
        </label>
      )}

      {type === 'atlas_contribution' && (
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: 0 }}>
          Submissions are reviewed by Techadyant before publication. Submission does not guarantee inclusion.
        </p>
      )}

      {status === 'error' && <p role="alert" style={{ fontSize: 14, color: 'var(--accent-warm, #FB923C)', margin: 0 }}>{errorText}</p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <button type="submit" className="btn-ed btn-ed-primary" disabled={status === 'sending'} style={{ cursor: status === 'sending' ? 'wait' : 'pointer' }}>
          {status === 'sending' ? 'Sending…' : 'Submit'} <span className="arr">→</span>
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No account needed. We read every one.</span>
      </div>
    </form>
  );
}
