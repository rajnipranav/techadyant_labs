'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';

export default function ResetPasswordPage() {
  const { configured, user, loading, updatePassword } = useAuth();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', marginBottom: 12, background: 'transparent',
    border: '1px solid rgba(255,255,255,0.22)', borderRadius: 8, color: 'inherit', fontSize: 15,
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (pw.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (pw !== confirm) { setErr('Passwords do not match.'); return; }
    setBusy(true);
    const { error } = await updatePassword(pw);
    setBusy(false);
    if (error) { setErr(error); return; }
    setDone(true);
    setTimeout(() => { window.location.assign('/account/'); }, 1800);
  }

  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/account/">Account</Link><span className="sep">/</span><span>Reset password</span>
          </div>
          <h1>Set a new password</h1>
          <p className="lede">Choose a new password for your Techadyant Labs account.</p>
        </div>
      </header>

      <section className="wrap-narrow" style={{ paddingTop: 40 }}>
        {!configured ? (
          <div className="exec-summary">
            <div className="es-label">Accounts</div>
            <p className="serif">Accounts are being set up. Please check back shortly.</p>
          </div>
        ) : done ? (
          <div className="exec-summary">
            <div className="es-label">Password updated</div>
            <p className="serif" style={{ marginBottom: 16 }}>Your password has been changed. Redirecting to your account…</p>
            <Link href="/account/" className="btn-ed btn-ed-primary">Go to account <span className="arr">→</span></Link>
          </div>
        ) : (
          <form onSubmit={submit} className="exec-summary" style={{ maxWidth: 460 }}>
            <div className="es-label">New password</div>
            {!user && !loading && (
              <p className="serif" style={{ color: 'var(--text-muted)', marginBottom: 14 }}>
                Open this page from the reset link in your email. If you came here directly, request a fresh link
                from the sign-in dialog (Forgot password).
              </p>
            )}
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>New password</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" style={inputStyle} />
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Confirm password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" style={inputStyle} />
            {err && <p className="serif" style={{ color: '#e0726a', marginBottom: 12 }}>{err}</p>}
            <button type="submit" className="btn-ed btn-ed-primary" disabled={busy}>
              {busy ? 'Updating…' : 'Update password'} <span className="arr">→</span>
            </button>
          </form>
        )}
      </section>
    </>
  );
}
