'use client';

import { useState } from 'react';

export function TrackCorridor({ code, label, accent }: { code: string; label: string; accent: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: `atlas-watch-${code}` }),
      });
      let data: { ok?: boolean } | null = null;
      try { data = await res.json(); } catch {}
      setStatus(res.ok && data?.ok ? 'done' : 'error');
    } catch { setStatus('error'); }
  }

  return (
    <div className="track-corr" style={{ ['--accent' as string]: accent }}>
      {status === 'done' ? (
        <p className="track-done">✓ You’ll get an email when the {label} picture changes.</p>
      ) : (
        <form onSubmit={submit}>
          <span className="track-k">Track {label}</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@institution.org" aria-label={`Track ${label}`} />
          <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? '…' : 'Notify me'}</button>
        </form>
      )}
    </div>
  );
}
