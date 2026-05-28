'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

type Mode = 'signin' | 'signup';
type Phase = 'idle' | 'working' | 'magic-sent' | 'confirm-sent' | 'reset-sent';

export function AuthModal() {
  const {
    signInOpen, closeSignIn, signInReason, configured, user,
    signInWithPassword, signUpWithPassword, signInWithEmail, resetPassword, signInWithGoogle,
  } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [err, setErr] = useState('');

  // Auto-close once the user is authenticated.
  useEffect(() => { if (signInOpen && user) closeSignIn(); }, [user, signInOpen, closeSignIn]);

  // Reset transient state each time the modal opens.
  useEffect(() => { if (signInOpen) { setPhase('idle'); setErr(''); setPassword(''); } }, [signInOpen]);

  if (!signInOpen) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setPhase('working'); setErr('');
    const fn = mode === 'signin' ? signInWithPassword : signUpWithPassword;
    const res = await fn(email.trim(), password);
    if (res.error) { setErr(res.error); setPhase('idle'); return; }
    if (mode === 'signup' && res.needsConfirmation) { setPhase('confirm-sent'); return; }
    // success → onAuthStateChange sets user → modal auto-closes
  }

  async function magicLink() {
    if (!email.trim()) { setErr('Enter your email first.'); return; }
    setPhase('working'); setErr('');
    const res = await signInWithEmail(email.trim());
    if (res.error) { setErr(res.error); setPhase('idle'); return; }
    setPhase('magic-sent');
  }

  async function forgot() {
    if (!email.trim()) { setErr('Enter your email first, then tap reset.'); return; }
    setPhase('working'); setErr('');
    const res = await resetPassword(email.trim());
    if (res.error) { setErr(res.error); setPhase('idle'); return; }
    setPhase('reset-sent');
  }

  async function google() {
    setErr('');
    const res = await signInWithGoogle();
    if (res.error) setErr(res.error);
  }

  const sentPhase = phase === 'magic-sent' || phase === 'confirm-sent' || phase === 'reset-sent';

  return (
    <div className="auth-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeSignIn(); }}>
      <div className="auth-card" role="dialog" aria-modal="true" aria-label="Sign in">
        <button className="auth-close" onClick={closeSignIn} aria-label="Close">×</button>
        <div className="auth-kicker">Techadyant Labs</div>

        {!configured ? (
          <>
            <h2 className="auth-title">Sign in</h2>
            <p className="auth-note">Sign-in is being configured. If you are the site owner, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Cloudflare and redeploy.</p>
          </>
        ) : sentPhase ? (
          <div className="auth-sent">
            <div className="auth-sent-mark">✓</div>
            {phase === 'magic-sent' && <><p>Magic link sent to <strong>{email}</strong>.</p><p className="auth-fine">Open it to finish signing in. You can close this window.</p></>}
            {phase === 'confirm-sent' && <><p>Confirm your email</p><p className="auth-fine">We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and sign in.</p></>}
            {phase === 'reset-sent' && <><p>Password reset link sent to <strong>{email}</strong>.</p><p className="auth-fine">Open it to set a new password.</p></>}
          </div>
        ) : (
          <>
            <div className="auth-tabs" role="tablist">
              <button role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setErr(''); }}>Sign in</button>
              <button role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setErr(''); }}>Create account</button>
            </div>

            <p className="auth-sub">
              {signInReason || (mode === 'signin' ? 'Welcome back. Sign in to access your reports.' : 'Create your account to buy and download reports.')}
            </p>

            <button className="auth-google" onClick={google} type="button">
              <span className="g-mark" aria-hidden="true">G</span> Continue with Google
            </button>
            <div className="auth-divider"><span>or</span></div>

            <form onSubmit={submit} className="auth-form">
              <label className="auth-label">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@institution.org" className="auth-input" autoComplete="email" />
              <label className="auth-label">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'Create a password (min 6 chars)' : 'Your password'} className="auth-input" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={6} />
              <button type="submit" className="btn-ed btn-ed-primary auth-submit" disabled={phase === 'working'}>
                {phase === 'working' ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'} <span className="arr">→</span>
              </button>
            </form>

            {err && <p className="auth-error">{err}</p>}

            <div className="auth-alts">
              {mode === 'signin' && <button type="button" className="auth-altlink" onClick={forgot}>Forgot password?</button>}
              <button type="button" className="auth-altlink" onClick={magicLink}>Email me a magic link instead</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
