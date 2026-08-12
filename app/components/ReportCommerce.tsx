'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { getSupabase } from '../lib/supabase';

declare global {
  interface Window { Razorpay?: any }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

type Tier = 'report' | 'report_plus_data';
const DATA_TIERS = ['report_plus_data', 'data_only', 'bundle'];

interface CommerceCtx {
  slug: string;
  access: 'free' | 'paid';
  priceLabel: string;
  entitled: boolean;
  checking: boolean;
  busy: boolean;
  message: { kind: 'info' | 'error' | 'success'; text: string } | null;
  purchase: (tier?: Tier) => Promise<void>;
  download: () => Promise<void>;
  downloadDeck: () => Promise<void>;
  // Report + Data tier
  hasData: boolean;
  dataPriceLabel?: string;
  dataEntitled: boolean;
  downloadData: () => Promise<void>;
}

const Ctx = createContext<CommerceCtx | null>(null);

export function ReportCommerceProvider({
  slug, access, priceLabel, title, hasData = false, dataPriceLabel, children,
}: {
  slug: string; access: 'free' | 'paid'; priceLabel: string; title: string;
  hasData?: boolean; dataPriceLabel?: string; children: ReactNode;
}) {
  const { user, accessToken, openSignIn } = useAuth();
  const [entitled, setEntitled] = useState(access === 'free');
  const [dataEntitled, setDataEntitled] = useState(false);
  const [checking, setChecking] = useState(access === 'paid');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<CommerceCtx['message']>(null);

  const refresh = useCallback(async () => {
    if (access === 'free') { setEntitled(true); setChecking(false); return; }
    const supabase = getSupabase();
    if (!supabase || !user) { setEntitled(false); setDataEntitled(false); setChecking(false); return; }
    setChecking(true);
    const { data } = await supabase
      .from('entitlements').select('id,tier').eq('user_id', user.id).eq('report_slug', slug).limit(1);
    const row = data && data.length ? data[0] : null;
    setEntitled(Boolean(row));
    setDataEntitled(Boolean(row && DATA_TIERS.includes((row as any).tier)));
    setChecking(false);
  }, [access, slug, user]);

  useEffect(() => { refresh(); }, [refresh]);

  const download = useCallback(async () => {
    setBusy(true); setMessage(null);
    try {
      const headers: Record<string, string> = {};
      if (access === 'paid' && accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const res = await fetch(`/api/download?report=${encodeURIComponent(slug)}`, { headers });
      let data: any = null;
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.url) {
        const text = (data && data.message) || 'Download is not available.';
        setMessage({ kind: 'error', text });
        return;
      }
      // Navigate to the short-lived signed URL. Supabase serves it with
      // Content-Disposition: attachment so the browser triggers a download.
      window.location.assign(data.url);
    } catch {
      setMessage({ kind: 'error', text: 'Something went wrong starting the download.' });
    } finally { setBusy(false); }
  }, [access, accessToken, slug]);

  const downloadDeck = useCallback(async () => {
    setBusy(true); setMessage(null);
    try {
      const headers: Record<string, string> = {};
      if (access === 'paid' && accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const res = await fetch(`/api/download?report=${encodeURIComponent(slug)}&asset=deck`, { headers });
      let data: any = null;
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.url) {
        setMessage({ kind: 'error', text: (data && data.message) || 'The deck is not available yet.' });
        return;
      }
      window.location.assign(data.url);
    } catch {
      setMessage({ kind: 'error', text: 'Something went wrong starting the download.' });
    } finally { setBusy(false); }
  }, [access, accessToken, slug]);

  const downloadData = useCallback(async () => {
    setBusy(true); setMessage(null);
    try {
      const headers: Record<string, string> = {};
      if (access === 'paid' && accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const res = await fetch(`/api/download?report=${encodeURIComponent(slug)}&asset=data`, { headers });
      let data: any = null;
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.url) {
        setMessage({ kind: 'error', text: (data && data.message) || 'The data pack is not available.' });
        return;
      }
      window.location.assign(data.url);
    } catch {
      setMessage({ kind: 'error', text: 'Something went wrong starting the download.' });
    } finally { setBusy(false); }
  }, [access, accessToken, slug]);

  const purchase = useCallback(async (tier: Tier = 'report') => {
    if (!user) { openSignIn('Sign in to purchase and unlock this report.'); return; }
    setBusy(true); setMessage(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ report: slug, tier }),
      });
      if (!res.ok) {
        let text = 'Checkout is unavailable right now.';
        try { const d = await res.json(); if (d?.message) text = d.message; } catch {}
        setMessage({ kind: 'error', text });
        setBusy(false);
        return;
      }
      const order = await res.json();
      const ready = await loadRazorpay();
      if (!ready || !window.Razorpay) {
        setMessage({ kind: 'error', text: 'Could not load the payment window. Please retry.' });
        setBusy(false);
        return;
      }
      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'Techadyant Labs',
        description: order.reportTitle || title,
        prefill: { email: user.email || '' },
        theme: { color: '#F5B544' },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (resp: any) => {
          setMessage({ kind: 'info', text: 'Confirming payment…' });
          const v = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'content-type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ ...resp, report: slug }),
          });
          if (v.ok) {
            setEntitled(true);
            if (tier === 'report_plus_data') setDataEntitled(true);
            setMessage({ kind: 'success', text: 'Payment confirmed — your report is unlocked.' });
            // GA4 ecommerce conversion. order.amount is in paise → rupees.
            try {
              const g = (window as any).gtag;
              if (typeof g === 'function') {
                const value = (Number(order.amount) || 0) / 100;
                g('event', 'purchase', {
                  transaction_id: resp.razorpay_payment_id || order.orderId,
                  value,
                  currency: order.currency || 'INR',
                  items: [{
                    item_id: slug,
                    item_name: order.reportTitle || title,
                    item_category: tier === 'report_plus_data' ? 'Report + Data' : 'Report',
                    price: value,
                    quantity: 1,
                  }],
                });
              }
            } catch {}
          } else {
            setMessage({ kind: 'error', text: 'Payment received but verification is pending. Refresh in a moment.' });
          }
          setBusy(false);
        },
      });
      try {
        const g = (window as any).gtag;
        if (typeof g === 'function') {
          const value = (Number(order.amount) || 0) / 100;
          g('event', 'begin_checkout', {
            value, currency: order.currency || 'INR',
            items: [{ item_id: slug, item_name: order.reportTitle || title, item_category: tier === 'report_plus_data' ? 'Report + Data' : 'Report', price: value, quantity: 1 }],
          });
        }
      } catch {}
      rzp.open();
    } catch {
      setMessage({ kind: 'error', text: 'Something went wrong opening checkout.' });
      setBusy(false);
    }
  }, [user, accessToken, slug, title, openSignIn]);

  const value: CommerceCtx = {
    slug, access, priceLabel, entitled, checking, busy, message, purchase, download, downloadDeck,
    hasData, dataPriceLabel, dataEntitled, downloadData,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useReportCommerce(): CommerceCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useReportCommerce must be used within ReportCommerceProvider');
  return ctx;
}
