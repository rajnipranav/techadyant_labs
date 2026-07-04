'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  label: string;
  level: number;
}

/** Adds a reading-progress bar and a compact in-page table of contents to
 *  signal pages (which, unlike reports, have no ReportReader). It derives the
 *  headings from the rendered article DOM at runtime, assigning ids where
 *  missing — so it needs no changes to the content itself. */
export function SignalReader({ targetSelector = '.report-body' }: { targetSelector?: string }) {
  const [items, setItems] = useState<Heading[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = document.querySelector(targetSelector);
    if (!root) return;

    const els = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    const collected: Heading[] = els.map((h, i) => {
      if (!h.id) {
        const base = (h.textContent || `section-${i}`)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 60);
        h.id = base || `section-${i}`;
      }
      return { id: h.id, label: h.textContent || '', level: h.tagName === 'H2' ? 2 : 3 };
    });
    setItems(collected);

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetSelector]);

  return (
    <>
      <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      {items.length >= 2 && (
        <nav
          aria-label="In this signal"
          style={{
            border: '1px solid var(--border, #2a2f3a)',
            borderRadius: 10,
            background: 'var(--bg-2, rgba(255,255,255,.02))',
            padding: '14px 18px',
            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: 'var(--accent, #C9A84C)',
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            In this signal
          </div>
          <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
            {items.map((it) => (
              <li key={it.id} style={{ marginLeft: it.level === 3 ? 14 : 0 }}>
                <a
                  href={`#${it.id}`}
                  style={{ color: 'var(--text-dim, #c7c7d2)', textDecoration: 'none', fontSize: 14, lineHeight: 1.5 }}
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}
