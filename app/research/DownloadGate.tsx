'use client';

import { useEffect, useState } from 'react';

const FILES = [
  { href: '/data/atlas/dependency-grid.csv', label: 'Dependency grid (CSV)' },
  { href: '/data/atlas/players.csv', label: 'Players directory (CSV)' },
];

export function DownloadGate() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [unlocked, setUnlocked] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    try { if (localStorage.getItem('atlas_unlocked') === '1') setUnlocked(true); } catch {}
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending'); setErr('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'atlas-download' }),
      });
      let data: { ok?: boolean; message?: string } | null = null;
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.ok) { setStatus('error'); setErr(data?.message || 'Something went wrong.'); return; }
      try { localStorage.setItem('atlas_unlocked', '1'); } catch {}
      setUnlocked(true); setStatus('idle');
    } catch { setStatus('error'); setErr('Could not reach the server.'); }
  }

  return (
    <div className="atlas-gate" id="downloads">
      <div className="ed-kicker">Take it with you</div>
      <h2>Download the data</h2>
      {unlocked ? (
        <>
          <p>Here are the current Atlas datasets, free to use with attribution to Techadyant Labs.</p>
          <div className="gate-files">
            {FILES.map((f) => (
              <a key={f.href} href={f.href} download className="btn-ed btn-ed-primary">{f.label} <span className="arr">↓</span></a>
            ))}
          </div>
          <p className="atlas-gate-fine">Thanks — you’re on the list for update alerts too.</p>
        </>
      ) : (
        <>
          <p>
            Get the dependency grids and the full players directory as CSV — free, in exchange for an
            email. We’ll also tell you when an assessment changes.
          </p>
          <form className="gate-form" onSubmit={submit}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@institution.org" aria-label="Email" />
            <button type="submit" className="btn-ed btn-ed-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Unlocking…' : 'Unlock downloads'}
            </button>
          </form>
          {status === 'error' && <p className="gate-err" role="alert">{err}</p>}
          <p className="atlas-gate-fine">Free · no spam · unsubscribe anytime</p>
        </>
      )}
    </div>
  );
}
