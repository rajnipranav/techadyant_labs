'use client';

import { useState } from 'react';

/** End-of-content share row: copy link, LinkedIn, X/Twitter, and the native
 *  share sheet on devices that support it. Pure URL intents — no third-party
 *  scripts or tracking. */
export function ShareBar({ title, label = 'Share this' }: { title?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const url = () => (typeof window !== 'undefined' ? window.location.href : '');
  const text = () => title || (typeof document !== 'undefined' ? document.title : '');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const openIntent = (href: string) => window.open(href, '_blank', 'noopener,noreferrer');

  const linkedIn = () =>
    openIntent(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`);
  const twitter = () =>
    openIntent(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url())}&text=${encodeURIComponent(text())}`);

  const nativeShare = async () => {
    const nav = navigator as Navigator & { share?: (d: { title?: string; url?: string }) => Promise<void> };
    if (typeof nav.share === 'function') {
      try {
        await nav.share({ title: text(), url: url() });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  };

  const btn: React.CSSProperties = {
    cursor: 'pointer',
    border: '1px solid var(--border, rgba(255,255,255,.16))',
    background: 'transparent',
    color: 'var(--text-dim, #c7c7d2)',
    borderRadius: 8,
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, margin: '8px 0 4px' }}>
      <span
        style={{
          fontSize: 11,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--accent, #C9A84C)',
          fontWeight: 700,
          marginRight: 4,
        }}
      >
        {label}
      </span>
      <button type="button" style={btn} onClick={linkedIn}>↗ LinkedIn</button>
      <button type="button" style={btn} onClick={twitter}>↗ X</button>
      <button type="button" style={btn} onClick={copy}>{copied ? '✓ Copied' : '⧉ Copy link'}</button>
      <button type="button" style={btn} onClick={nativeShare}>⇪ Share</button>
    </div>
  );
}
