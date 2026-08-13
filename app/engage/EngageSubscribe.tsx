'use client';

import { useState } from 'react';

/** Tile-native subscribe form for the Engage hub — big input + full-width
 *  button, styled to sit inside an .eng-tile (not the homepage band look). */
export function EngageSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending'); setErr('');
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'engage' }),
      });
      let d: { ok?: boolean; message?: string } | null = null;
      try { d = await r.json(); } catch {}
      if (!r.ok || !d?.ok) { setStatus('error'); setErr(d?.message || 'Something went wrong. Please try again.'); return; }
      setStatus('sent');
    } catch { setStatus('error'); setErr('Could not reach the server. Please try again.'); }
  }

  if (status === 'sent') {
    return <p className="eng-note" style={{ color: 'var(--signal-live, #34D399)', fontSize: 14.5, fontWeight: 600 }}>✓ You&rsquo;re on the list — check your inbox.</p>;
  }

  return (
    <form className="eng-sub" onSubmit={submit}>
      <input
        className="eng-input"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@organisation.com"
        disabled={status === 'sending'}
        required
        aria-label="Email address"
      />
      <button className="eng-cta" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Subscribing…' : 'Subscribe'} <span aria-hidden>→</span>
      </button>
      {status === 'error' && <p className="eng-note" style={{ color: 'var(--accent-warm, #FB923C)' }}>{err}</p>}
      <p className="eng-note">No spam. Unsubscribe anytime.</p>
    </form>
  );
}
