'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
      { href: '/research/pillars/defence/army', label: '— Army Atlas' },
      { href: '/research/pillars/defence/navy-coast-guard', label: '— Navy + Coast Guard Atlas' },
      { href: '/research/pillars/defence/air-force', label: '— Air Force Atlas' },
      { href: '/research/pillars/defence/high-altitude', label: '— High-Altitude Atlas' },
      { href: '/research/pillars/enterprise-software', label: 'Enterprise Software' },
      { href: '/research/critical-manufacturing-dependencies', label: 'Critical Manufacturing Dependencies' },
      { href: '/research/drones-uas', label: 'Unmanned Systems' },
      { href: '/research/counter-uas', label: 'Counter-UAS' },
      { href: '/research/military-aerospace', label: 'Military Aerospace' },
      { href: '/research/space', label: 'Space' },
      { href: '/research/pillars', label: 'All pillar maps →' },
    ],
  },
  { label: 'Players', href: '/research/players' },
  { label: 'Dependencies', href: '/research/dependencies' },
  {
    label: 'Infrastructure', href: '/research/logistics', items: [
      { href: '/research/logistics', label: 'Logistics & Mobility' },
      { href: '/research/programmes', label: 'Programme Intelligence' },
      { href: '/research/programmes/gati-shakti', label: '— PM GatiShakti' },
      { href: '/research/programmes/bharatmala', label: '— Bharatmala' },
      { href: '/research/programmes/sagarmala', label: '— Sagarmala' },
      { href: '/research/industrial-nodes', label: 'Industrial Nodes' },
      { href: '/research/infrastructure-projects', label: 'Infrastructure Projects' },
    ],
  },
  {
    label: 'Data', items: [
      { href: '/research/datasets', label: 'Datasets' },
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
  const navRef = useRef<HTMLElement | null>(null);

  // Close the open submenu on route change, outside tap, or Escape.
  useEffect(() => { setOpen(null); }, [path]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: Event) => {
      const el = navRef.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const linkActive = (href: string) => (href === '/research' ? path === '/research' : path === href || path.startsWith(href + '/'));
  const groupActive = (g: NavGroup) => (g.href ? linkActive(g.href) : false) || (g.items ?? []).some((i) => linkActive(i.href));

  // Pointer-based open/close only on real hover devices; touch uses the caret button.
  const hoverProps = (label: string) =>
    (typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches)
      ? { onMouseEnter: () => setOpen(label), onMouseLeave: () => setOpen(null) }
      : {};

  return (
    <nav className="atlas-nav" aria-label="Atlas sections" ref={navRef}>
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
            const menuId = `atlas-menu-${g.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            return (
              <li
                key={g.label}
                className={`has-menu${isOpen ? ' is-open' : ''}`}
                {...hoverProps(g.label)}
              >
                {g.href ? (
                  /* Hrefed group: the label navigates, a separate caret button opens the
                     submenu. Without this, a tap on touch devices navigates away and the
                     sub-items are unreachable (no hover on touch). */
                  <span className="atlas-grp">
                    <Link href={g.href} className={active ? 'is-active' : ''}>{g.label}</Link>
                    <button
                      type="button"
                      className="atlas-caret-btn"
                      aria-expanded={isOpen}
                      aria-controls={menuId}
                      aria-label={`${isOpen ? 'Hide' : 'Show'} ${g.label} sections`}
                      onClick={() => setOpen(isOpen ? null : g.label)}
                    >
                      <span className="caret" aria-hidden="true">▾</span>
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    className={active ? 'is-active' : ''}
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                    onClick={() => setOpen(isOpen ? null : g.label)}
                  >
                    {g.label} <span className="caret" aria-hidden="true">▾</span>
                  </button>
                )}
                <ul className="atlas-submenu" id={menuId} role="list">
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
