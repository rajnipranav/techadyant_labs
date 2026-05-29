'use client';

import { useState } from 'react';

interface NewsletterProps {
  /** Identifies where the signup originated (homepage, report CTA, etc.) */
  source?: string;
}

export function Newsletter({ source = 'homepage' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    setErrorText('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      let data: { ok?: boolean; message?: string } | null = null;
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.ok) {
        setStatus('error');
        setErrorText(data?.message || 'Something went wrong. Please try again.');
        return;
      }
      setStatus('sent');
    } catch {
      setStatus('error');
      setErrorText('Could not reach the server. Please check your connection and try again.');
    }
  }

  return (
    <div className="newsletter" id="subscribe">
      <div className="nl-kicker">The Dispatch</div>
      <h2>Receive strategic signals and research updates</h2>
      <p>
        New reports, signals and briefings on India’s industrial systems — delivered
        when they publish. Considered, infrequent, and free of sponsored coverage.
      </p>

      {status === 'sent' ? (
        <p className="nl-fine" role="status" style={{ fontSize: 15, color: 'var(--signal-live)' }}>
          ✓ You’re on the list. We’ve sent a welcome note to <strong>{email}</strong> — check your inbox (and the spam folder, just in case).
        </p>
      ) : (
        <form className="nl-form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.org"
            aria-label="Email address"
            disabled={status === 'sending'}
          />
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="nl-fine" role="alert" style={{ fontSize: 14, color: '#FB923C', marginTop: 8 }}>
          {errorText}
        </p>
      )}

      <p className="nl-fine">No spam. Unsubscribe anytime. We never share reader data.</p>
    </div>
  );
}
