'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export function AuthModal() {
  const { signInOpen, closeSignIn, signInReason, signInWithEmail, signInWithGoogle, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [err, setErr] = useState('');
  const googleEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true';

  if (!signInOpen) return null;

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState('sending');
    setErr('');
    const { error } = await signInWithEmail(email.trim());
    if (error) { setState('error'); setErr(error); }
    else setState('sent');
  }

  async function google() {
    const { error } = await signInWithGoogle();
    if (error) { setState('error'); setErr(error); }
  }

  return (
    <div className="auth-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeSignIn(); }}>
      <div className="auth-card" role="dialog" aria-modal="true" aria-label="Sign in">
        <button className="auth-close" onClick={closeSignIn} aria-label="Close">×</button>

        <div className="auth-kicker">Techadyant Labs</div>
        <h2 className="auth-title">Sign in or create your account</h2>
        <p className="auth-sub">
          {signInReason || 'New here? Just enter your email — we’ll create your account and email you a secure link. No password needed.'}
        </p>

        {!configured ? (
          <p className="auth-note">Sign-in is being configured. If you are the site owner, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Cloudflare and redeploy.</p>
        ) : state === 'sent' ? (
          <div className="auth-sent">
            <div className="auth-sent-mark">✓</div>
            <p>Check your inbox — we sent a secure sign-in link to <strong>{email}</strong>.</p>
            <p className="auth-fine">The link opens your account and signs you in. You can close this window.</p>
          </div>
        ) : (
          <>
            {googleEnabled && (
              <>
                <button className="auth-google" onClick={google} type="button">
                  <span className="g-mark" aria-hidden="true">G</span> Continue with Google
                </button>
                <div className="auth-divider"><span>or</span></div>
              </>
            )}

            <form onSubmit={sendLink} className="auth-form">
              <label className="auth-label">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.org"
                className="auth-input"
                autoFocus
              />
              <button type="submit" className="btn-ed btn-ed-primary auth-submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending link…' : 'Email me a sign-in link'} <span className="arr">→</span>
              </button>
            </form>

            {state === 'error' && <p className="auth-error">{err}</p>}
            <p className="auth-fine">
              First time? This creates your account automatically. Returning? It signs you in. Either way, no password — we email a one-time secure link.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
