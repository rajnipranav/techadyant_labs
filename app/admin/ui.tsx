'use client';

import { ReactNode } from 'react';

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div style={{ padding: '2rem 0', color: 'var(--admin-muted)', fontSize: 14 }}>{label}</div>;
}

export function ErrorBox({ error }: { error: string }) {
  return (
    <div style={{ padding: '12px 14px', border: '1px solid rgba(226,114,91,0.4)', background: 'rgba(226,114,91,0.10)', color: 'var(--admin-crimson)', borderRadius: 10, fontSize: 14 }}>
      {error}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: 'var(--admin-muted)', letterSpacing: '.02em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--admin-brassb)', fontFamily: 'var(--admin-mono)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

export function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 14, padding: '18px 20px', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', margin: 0, color: 'var(--admin-brass)' }}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'teal' | 'brass' | 'crimson' }) {
  const map = {
    neutral: { bg: 'var(--admin-surface2)', fg: '#b8b8c8' },
    teal: { bg: 'rgba(56,225,196,0.12)', fg: '#38e1c4' },
    brass: { bg: 'rgba(201,168,76,0.16)', fg: '#e0c061' },
    crimson: { bg: 'rgba(226,114,91,0.16)', fg: '#e2725b' },
  }[tone];
  return <span style={{ background: map.bg, color: map.fg, fontSize: 11, padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>{children}</span>;
}
