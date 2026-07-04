'use client';

import { useState } from 'react';

/** Small reusable "copy to clipboard" field used on the /resources hub and the
 *  Atlas cite/embed block. Self-contained inline styles so it needs no extra
 *  global CSS. */
export function CopyField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — user can select manually */
    }
  };

  return (
    <div
      style={{
        border: '1px solid var(--border, #2a2f3a)',
        borderRadius: 10,
        background: 'var(--bg-2, #12151c)',
        padding: '12px 14px',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted, #9aa3b2)',
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          style={{
            cursor: 'pointer',
            border: '1px solid var(--brass, #C9A84C)',
            background: copied ? 'var(--brass, #C9A84C)' : 'transparent',
            color: copied ? '#12151c' : 'var(--brass, #C9A84C)',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      {multiline ? (
        <pre
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontFamily: 'var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
            fontSize: 13,
            lineHeight: 1.5,
            color: 'var(--text, #e9e7e0)',
          }}
        >
          {value}
        </pre>
      ) : (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.55,
            color: 'var(--text, #e9e7e0)',
          }}
        >
          {value}
        </p>
      )}
    </div>
  );
}
