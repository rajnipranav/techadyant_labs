'use client';

import './admin.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const NAV = [
  { group: '', items: [{ href: '/admin', label: 'Overview', icon: 'M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z' }] },
  {
    group: 'Intelligence (SID)',
    items: [
      { href: '/admin/sid/capture', label: 'Capture map' },
      { href: '/admin/sid/entities', label: 'Entities' },
      { href: '/admin/sid/chokepoints', label: 'Chokepoints' },
      { href: '/admin/sid/sovereignty', label: 'Sovereignty' },
      { href: '/admin/sid/momentum', label: 'Momentum' },
      { href: '/admin/sid/candidacy', label: 'Candidacy queue' },
      { href: '/admin/sid/figures', label: 'Figure library' },
    ],
  },
  { group: 'Publishing', items: [{ href: '/admin/pipeline', label: 'Research pipeline' }, { href: '/admin/promotion', label: 'Promotion tracker' }] },
  { group: 'Audience', items: [{ href: '/admin/subscribers', label: 'Subscribers' }, { href: '/admin/announcements', label: 'Announcements' }] },
  { group: 'Feeds & ops', items: [{ href: '/admin/signals', label: 'Signals' }, { href: '/admin/ops', label: 'Workflow runs' }, { href: '/admin/site', label: 'Site management' }] },
  { group: 'CMS', items: [{ href: '/admin/cms', label: 'Reports' }, { href: '/admin/cms?type=signals', label: 'Signals' }, { href: '/admin/cms?type=briefings', label: 'Briefings' }, { href: '/admin/cms?type=newsletters', label: 'Newsletters' }, { href: '/admin/cms?type=pages', label: 'Pages' }] },
];

function norm(p: string) { return p.replace(/\/+$/, '') || '/'; }

export default function AdminLayout({ children }: { children: ReactNode }) {
  const path = norm(usePathname() || '/admin');
  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => document.body.classList.remove('admin-mode');
  }, []);
  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand"><b>Techadyant</b> · Admin</div>
        {NAV.map((g) => (
          <div key={g.group || 'top'}>
            {g.group && <div className="admin-navgroup">{g.group}</div>}
            {g.items.map((it) => {
              const active = path === norm(it.href);
              return (
                <Link key={it.href} href={it.href} className={`admin-navlink${active ? ' active' : ''}`}>
                  {it.label}
                </Link>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: 18, padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,.1)', fontSize: 11, color: '#6f7a8c' }}>
          Admin only · Cloudflare Access
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
