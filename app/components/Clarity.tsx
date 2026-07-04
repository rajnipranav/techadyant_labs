'use client';

import { useEffect } from 'react';

/**
 * Microsoft Clarity — free heatmaps and session recordings (complements the
 * existing GA4 + Ahrefs analytics; no paid tier needed).
 *
 * SETUP (one-time, free): create a project at https://clarity.microsoft.com,
 * copy the Project ID, paste it below, and redeploy. Until then this renders
 * nothing, so it is safe to ship unconfigured.
 */
const CLARITY_ID = 'YOUR_CLARITY_ID';

export function Clarity() {
  useEffect(() => {
    if (!CLARITY_ID || CLARITY_ID.includes('YOUR_')) return;
    const w = window as unknown as Record<string, unknown>;
    if (w['clarity']) return;
    (function (c: Record<string, unknown>, l: Document, a: string, r: string, i: string) {
      c[a] =
        c[a] ||
        function (...args: unknown[]) {
          ((c[a] as { q?: unknown[] }).q = (c[a] as { q?: unknown[] }).q || []).push(args);
        };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = 'https://www.clarity.ms/tag/' + i;
      const y = l.getElementsByTagName(r)[0];
      y.parentNode?.insertBefore(t, y);
    })(w, document, 'clarity', 'script', CLARITY_ID);
  }, []);

  return null;
}
