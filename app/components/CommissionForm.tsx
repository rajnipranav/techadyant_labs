'use client';

import { useState } from 'react';

const ENGAGEMENTS = [
  { v: 'bespoke-research', l: 'Bespoke research' },
  { v: 'dpr', l: 'Detailed Project Report (DPR)' },
  { v: 'both', l: 'Bespoke research + DPR' },
  { v: 'other', l: 'Other / not sure yet' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  color: 'var(--text)',
  padding: '12px 14px',
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

export function CommissionForm({ source = 'services' }: { source?: string }) {
  const [form, setForm] = useState({
    name: '', organisation: '', email: '',
    engagementType: 'bespoke-research', project: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!form.name.trim() || !form.email.trim()) {
      setStatus('error');
      setErrorText('Please add your name and email so we can reply.');
      return;
    }
    setStatus('sending');
    setErrorText('');
    try {
      const res = await fetch('/api/commission', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
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
      <div
        id="enquire"
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '32px 28px',
        }}
        role="status"
      >
        <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--signal-live, #34D399)', marginBottom: 10 }}>
          Enquiry received
        </div>
        <h3 style={{ margin: '0 0 10px', fontSize: 22 }}>Thank you — we’ll be in touch.</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
          A confirmation is on its way to <strong>{form.email}</strong>. We read every enquiry
          personally and reply within two working days to discuss scope, timeline and fit.
        </p>
      </div>
    );
  }

  return (
    <form
      id="enquire"
      onSubmit={handleSubmit}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '28px', display: 'grid', gap: 16,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="cf-row">
        <div>
          <label style={labelStyle} htmlFor="cf-name">Name *</label>
          <input id="cf-name" style={inputStyle} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" disabled={status === 'sending'} required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="cf-org">Organisation</label>
          <input id="cf-org" style={inputStyle} value={form.organisation} onChange={(e) => set('organisation', e.target.value)} placeholder="Company / institution" disabled={status === 'sending'} />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="cf-email">Email *</label>
        <input id="cf-email" type="email" style={inputStyle} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@organisation.com" disabled={status === 'sending'} required />
      </div>

      <div>
        <label style={labelStyle} htmlFor="cf-eng">What do you need?</label>
        <select id="cf-eng" style={{ ...inputStyle, appearance: 'auto' }} value={form.engagementType} onChange={(e) => set('engagementType', e.target.value)} disabled={status === 'sending'}>
          {ENGAGEMENTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="cf-proj">Project, in one line</label>
        <input id="cf-proj" style={inputStyle} value={form.project} onChange={(e) => set('project', e.target.value)} placeholder="e.g. DPR for a 500 MW data-centre park in Telangana" disabled={status === 'sending'} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="cf-msg">Anything else? (scope, timeline, deadline)</label>
        <textarea id="cf-msg" style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="A few lines on what you’re trying to decide or build." disabled={status === 'sending'} />
      </div>

      {status === 'error' && (
        <p role="alert" style={{ fontSize: 14, color: 'var(--accent-warm, #FB923C)', margin: 0 }}>{errorText}</p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button type="submit" className="btn-ed btn-ed-primary" disabled={status === 'sending'} style={{ cursor: status === 'sending' ? 'wait' : 'pointer' }}>
          {status === 'sending' ? 'Sending…' : 'Send enquiry'} <span className="arr">→</span>
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Or email <a href="mailto:labs@techadyant.com" style={{ color: 'var(--text)' }}>labs@techadyant.com</a>
        </span>
      </div>
    </form>
  );
}
