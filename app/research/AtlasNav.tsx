'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem { href: string; label: string }
interface NavGroup { label: string; href?: string; items?: NavItem[] }

const NAV: NavGroup[] = [
  { label: 'Overview', href: '/research' },
  {
    label: 'Pillars', href: '/research/pillars', items: [
      { href: '/research/pillars/semiconductors', label: 'Semiconductors' },
      { href: '/research/pillars/critical-minerals', label: 'Critical Minerals' },
      { href: '/research/pillars/ai-infrastructure', label: 'AI Infrastructure' },
      { href: '/research/pillars/defence', label: 'Defence' },
      { href: '/research/pillars/enterprise-software', label: 'Enterprise Software' },
      { href: '/research/drones-uas', label: 'Unmanned Systems' },
      { href: '/research/counter-uas', label: 'Counter-UAS' },
      { href: '/research/pillars', label: 'All pillar maps →' },
    ],
  },
  { label: 'Players', href: '/research/players' },
  { label: 'Dependencies', href: '/research/dependencies' },
  {
    label: 'Data', items: [
      { href: '/research/search', label: 'Search' },
      { href: '/research/explorer', label: 'Explorer' },
      { href: '/research/entities', label: 'Entities' },
      { href: '/research/supply-chains', label: 'Supply Chains' },
      { href: '/research/patents', label: 'Patent Monitor' },
      { href: '/research/suppliers', label: 'Supplier Directory' },
    ],
  },
  {
    label: 'Reference', items: [
      { href: '/research/corridors', label: 'Thematic profiles' },
      { href: '/research/sources', label: 'Sources' },
      { href: '/research/methodology', label: 'Methodology' },
      { href: '/resources', label: 'Cite & Embed' },
    ],
  },
];

export function AtlasNav() {
  const raw = usePathname();
  const path = (raw.replace(/\/+$/, '') || '/');
  const [open, setOpen] = useState<string | null>(null);

  const linkActive = (href: string) => (href === '/research' ? path === '/research' : path === href || path.startsWith(href + '/'));
  const groupActive = (g: NavGroup) => (g.href ? linkActive(g.href) : false) || (g.items ?? []).some((i) => linkActive(i.href));

  return (
    <nav className="atlas-nav" aria-label="Atlas sections">
      <div className="atlas-nav-inner">
        <span className="atlas-mark">THE ATLAS</span>
        <ul role="list">
          {NAV.map((g) => {
            const active = groupActive(g);
            if (!g.items) {
              return (
                <li key={g.label}>
                  <Link href={g.href!} className={active ? 'is-active' : ''} aria-current={active ? 'page' : undefined}>{g.label}</Link>
                </li>
              );
            }
            const isOpen = open === g.label;
            return (
              <li key={g.label} className={`has-menu${isOpen ? ' is-open' : ''}`} onMouseEnter={() => setOpen(g.label)} onMouseLeave={() => setOpen(null)}>
                {g.href ? (
                  <Link href={g.href} className={active ? 'is-active' : ''}>{g.label} <span className="caret" aria-hidden="true">▾</span></Link>
                ) : (
                  <button type="button" className={active ? 'is-active' : ''} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : g.label)}>{g.label} <span className="caret" aria-hidden="true">▾</span></button>
                )}
                <ul className="atlas-submenu" role="list">
                  {g.items.map((i) => (
                    <li key={i.href}><Link href={i.href} className={linkActive(i.href) ? 'is-active' : ''} onClick={() => setOpen(null)}>{i.label}</Link></li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
