'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        theme?: string;
        callback?: (token: string) => void;
      }) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const SITEKEY = '0x4AAAAAADFUxuYjCdOosg6z';

export function ContactModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Event delegation: catch any [data-open-modal="contact"] clicks
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as Element).closest('[data-open-modal="contact"]');
      if (target) {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Render Turnstile when modal opens
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';

    const renderTurnstile = () => {
      if (
        window.turnstile &&
        turnstileRef.current &&
        !widgetIdRef.current
      ) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: SITEKEY,
          theme: 'dark',
        });
      }
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      // Load Turnstile script once
      if (!document.getElementById('cf-turnstile-script')) {
        const s = document.createElement('script');
        s.id = 'cf-turnstile-script';
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        s.async = true;
        s.defer = true;
        s.onload = renderTurnstile;
        document.head.appendChild(s);
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            renderTurnstile();
          }
        }, 200);
        return () => clearInterval(interval);
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function close() {
    setOpen(false);
    setStatus('idle');
    setErrorMsg('');
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
      widgetIdRef.current = null;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = e.currentTarget;
    const raw: Record<string, string> = {};
    new FormData(form).forEach((v, k) => { raw[k] = v.toString(); });

    // Combine split name fields and remap Turnstile token to expected key
    const data = {
      name: `${raw.firstName || ''} ${raw.lastName || ''}`.trim(),
      email: raw.email || '',
      company: raw.company || '',
      message: raw.message || '',
      practice: raw.practice || 'general',
      turnstileToken: raw['cf-turnstile-response'] || '',
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  }

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(11,11,20,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="modal-card"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
        }}
      >
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '22px',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '4px',
          }}
        >
          ×
        </button>

        <h2 style={{ marginTop: 0, marginBottom: '6px', fontSize: '1.5rem', fontWeight: 700 }}>
          Start a Project
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.95rem' }}>
          Tell us what you're building and we'll respond within one business day.
        </p>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <h3 style={{ margin: '0 0 8px', color: 'var(--success)' }}>Message sent!</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              We'll be in touch within one business day.
            </p>
            <button
              onClick={close}
              className="btn btn-primary"
              style={{ marginTop: '24px' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label className="field-label">
                  <span>First name</span>
                  <input
                    name="firstName"
                    type="text"
                    required
                    placeholder="Ada"
                    className="field-input"
                  />
                </label>
                <label className="field-label">
                  <span>Last name</span>
                  <input
                    name="lastName"
                    type="text"
                    required
                    placeholder="Lovelace"
                    className="field-input"
                  />
                </label>
              </div>

              <label className="field-label">
                <span>Work email</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="ada@company.com"
                  className="field-input"
                />
              </label>

              <label className="field-label">
                <span>Company / project</span>
                <input
                  name="company"
                  type="text"
                  placeholder="Acme Inc."
                  className="field-input"
                />
              </label>

              <label className="field-label">
                <span>What are you building?</span>
                <select name="practice" required className="field-input">
                  <option value="">Select a practice…</option>
                  <option value="fullstack">Full-stack Product</option>
                  <option value="ai">AI Integration</option>
                  <option value="design">Design System</option>
                  <option value="audit">UX Audit</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="field-label">
                <span>Brief description</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Describe your project, timeline, and any constraints…"
                  className="field-input"
                  style={{ resize: 'vertical' }}
                />
              </label>

              <div ref={turnstileRef} style={{ minHeight: '65px' }} />

              {status === 'error' && (
                <p style={{ color: '#f87171', margin: 0, fontSize: '0.875rem' }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'sending'}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
