'use client';
import { useState } from 'react';
export function CuasTrack() {
  const [email, setEmail] = useState(''); const [done, setDone] = useState(false); const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) { setErr('Enter a valid email.'); return; }
    setErr('');
    try { const r = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source: 'counter-uas-watch' }) }); if (r.ok) setDone(true); else setErr('Could not subscribe — try again.'); } catch { setErr('Could not subscribe — try again.'); }
  }
  if (done) return <p style={{ fontSize: 14, color: 'var(--brass, #C9A84C)', margin: 0 }}>You&apos;re on the list — we&apos;ll send Counter-UAS Atlas updates.</p>;
  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: '1 1 220px', maxWidth: 300, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text, #e9e7e0)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '9px 12px', fontSize: 14 }} />
      <button type="submit" style={{ cursor: 'pointer', background: 'var(--brass, #C9A84C)', color: 'var(--bg, #0b0b14)', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 700 }}>Track this ecosystem</button>
      {err && <span style={{ fontSize: 12.5, color: '#E24B4A', width: '100%' }}>{err}</span>}
    </form>
  );
}
