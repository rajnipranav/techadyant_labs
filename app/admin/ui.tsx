'use client';

import { ReactNode } from 'react';

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div style={{ padding: '2rem 0', color: 'var(--admin-muted)', fontSize: 14 }}>{label}</div>;
}

export function ErrorBox({ error }: { error: string }) {
  return (
    <div style={{ padding: '12px 14px', border: '1px solid #B23B33', background: '#fbeaea', color: '#7a1f1a', borderRadius: 8, fontSize: 14 }}>
      {error}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--admin-border)', borderRadius: 10, padding: '12px 14px' }}>
      <div style={{ fontSize: 12, color: 'var(--admin-muted)' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--admin-navy)', fontFamily: 'var(--admin-mono)' }}>{value}</div>
    </div>
  );
}

export function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section style={{ background: '#fff', border: '1px solid var(--admin-border)', borderRadius: 12, padding: '16px 18px', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--admin-navy)' }}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'teal' | 'brass' | 'crimson' }) {
  const map = {
    neutral: { bg: '#EFECE3', fg: '#4a4a44' },
    teal: { bg: '#d7f3ec', fg: '#0f6e56' },
    brass: { bg: '#f4ecd2', fg: '#7a5e16' },
    crimson: { bg: '#fbe3e1', fg: '#8a241d' },
  }[tone];
  return <span style={{ background: map.bg, color: map.fg, fontSize: 11, padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>{children}</span>;
}
