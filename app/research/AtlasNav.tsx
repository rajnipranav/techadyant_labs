'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/research', label: 'Overview' },
  { href: '/research/explorer', label: 'Explorer' },
  { href: '/research/search', label: 'Search' },
  { href: '/research/entities', label: 'Entities' },
  { href: '/research/dependencies', label: 'Import Dependencies' },
  { href: '/research/players', label: 'Ecosystems & Players' },
  { href: '/research/suppliers', label: 'Supplier Directory' },
  { href: '/research/supply-chains', label: 'Supply Chains' },
  { href: '/research/corridors', label: 'Corridors' },
  { href: '/research/sources', label: 'Sources' },
  { href: '/research/methodology', label: 'Methodology' },
];

export function AtlasNav() {
  const path = usePathname();
  return (
    <nav className="atlas-nav" aria-label="Atlas sections">
      <div className="atlas-nav-inner">
        <span className="atlas-mark">THE ATLAS</span>
        <ul role="list">
          {TABS.map((t) => {
            const active = t.href === '/research' ? path === '/research' : path.startsWith(t.href);
            return (
              <li key={t.href}>
                <Link href={t.href} className={active ? 'is-active' : ''} aria-current={active ? 'page' : undefined}>
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
