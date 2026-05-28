'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

/** Masthead account control: "Sign in" when logged out, account link when in. */
export function AuthControls() {
  const { user, loading, openSignIn, signOut, configured } = useAuth();

  if (!configured) {
    // Auth not wired yet — keep the masthead clean, no control.
    return null;
  }

  if (loading) {
    return <span className="auth-pill auth-pill-ghost" aria-hidden="true">···</span>;
  }

  if (!user) {
    return (
      <button className="auth-pill" onClick={() => openSignIn()}>
        Sign in
      </button>
    );
  }

  const initial = (user.email || '?').charAt(0).toUpperCase();
  return (
    <div className="auth-account">
      <Link href="/account" className="auth-avatar" aria-label="Your account">
        {initial}
      </Link>
      <button className="auth-signout" onClick={() => signOut()} title="Sign out">
        Sign out
      </button>
    </div>
  );
}
