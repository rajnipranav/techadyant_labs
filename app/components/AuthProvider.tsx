'use client';

import {
  createContext, useContext, useEffect, useState, useCallback, type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase, isAuthConfigured } from '../lib/supabase';

type Result = { error?: string; needsConfirmation?: boolean };

interface AuthCtx {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  accessToken: string | null;
  signInOpen: boolean;
  signInReason: string | null;
  openSignIn: (reason?: string) => void;
  closeSignIn: () => void;
  signInWithPassword: (email: string, password: string) => Promise<Result>;
  signUpWithPassword: (email: string, password: string) => Promise<Result>;
  signInWithEmail: (email: string) => Promise<Result>;
  resetPassword: (email: string) => Promise<Result>;
  updatePassword: (password: string) => Promise<Result>;
  signInWithGoogle: () => Promise<Result>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
const origin = () => (typeof window !== 'undefined' ? window.location.origin : '');

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isAuthConfigured();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInReason, setSignInReason] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session ?? null); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY' && typeof window !== 'undefined'
          && !window.location.pathname.startsWith('/account/reset')) {
        window.location.assign('/account/reset/');
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const openSignIn = useCallback((reason?: string) => { setSignInReason(reason ?? null); setSignInOpen(true); }, []);
  const closeSignIn = useCallback(() => setSignInOpen(false), []);

  const signInWithPassword = useCallback(async (email: string, password: string): Promise<Result> => {
    const s = getSupabase(); if (!s) return { error: 'Authentication is not configured yet.' };
    const { error } = await s.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  }, []);

  const signUpWithPassword = useCallback(async (email: string, password: string): Promise<Result> => {
    const s = getSupabase(); if (!s) return { error: 'Authentication is not configured yet.' };
    const { data, error } = await s.auth.signUp({ email, password, options: { emailRedirectTo: `${origin()}/account` } });
    if (error) return { error: error.message };
    return { needsConfirmation: !data.session };
  }, []);

  const signInWithEmail = useCallback(async (email: string): Promise<Result> => {
    const s = getSupabase(); if (!s) return { error: 'Authentication is not configured yet.' };
    const { error } = await s.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin()}/account` } });
    return error ? { error: error.message } : {};
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<Result> => {
    const s = getSupabase(); if (!s) return { error: 'Authentication is not configured yet.' };
    const { error } = await s.auth.resetPasswordForEmail(email, { redirectTo: `${origin()}/account/reset` });
    return error ? { error: error.message } : {};
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<Result> => {
    const s = getSupabase(); if (!s) return { error: 'Authentication is not configured yet.' };
    const { error } = await s.auth.updateUser({ password });
    return error ? { error: error.message } : {};
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<Result> => {
    const s = getSupabase(); if (!s) return { error: 'Authentication is not configured yet.' };
    const { error } = await s.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${origin()}/account` } });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    const s = getSupabase(); if (s) await s.auth.signOut();
    setSession(null);
  }, []);

  const value: AuthCtx = {
    configured, loading, session, user: session?.user ?? null, accessToken: session?.access_token ?? null,
    signInOpen, signInReason, openSignIn, closeSignIn,
    signInWithPassword, signUpWithPassword, signInWithEmail, resetPassword, updatePassword, signInWithGoogle, signOut,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
