'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type NavLink = { href: string; label: string };

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`burger ${open ? 'is-open' : ''}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <div
          className="mobile-nav-overlay"
          role="button"
          tabIndex={-1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <nav
        id="mobile-nav-panel"
        className={`mobile-nav-panel ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
      >
        <ul role="list">
          <li>
            <Link href="/search/" onClick={() => setOpen(false)}>Search</Link>
          </li>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
          <li className="mobile-nav-cta">
            <Link href="/#subscribe" onClick={() => setOpen(false)}>
              Subscribe
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
