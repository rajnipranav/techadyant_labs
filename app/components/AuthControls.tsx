'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

/** Masthead account control: "Sign in" when logged out, account link when in. */
export function AuthControls() {
  const { user, loading, openSignIn, signOut } = useAuth();

  if (loading) {
    return <span className="auth-pill auth-pill-ghost" aria-hidden="true">···</span>;
  }

  if (!user) {
    return (
      <button className="auth-pill auth-pill-cta" onClick={() => openSignIn()}>
        Sign in
      </button>
    );
  }

  const initial = (user.email || '?').charAt(0).toUpperCase();
  return (
    <div className="auth-account">
      <Link href="/account/" className="auth-avatar" aria-label="Your account" title={user.email || 'Account'}>
        {initial}
      </Link>
      <button className="auth-signout" onClick={() => signOut()} title="Sign out">
        Sign out
      </button>
    </div>
  );
}
