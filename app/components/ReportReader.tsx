'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface TocItem {
  id: string;
  label: string;
}

export function ReportReader({
  toc,
  children,
  title,
}: {
  toc: TocItem[];
  children: ReactNode;
  title: string;
}) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(toc[0]?.id ?? '');
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Reading progress relative to the article body
  useEffect(() => {
    function onScroll() {
      const el = bodyRef.current;
      if (!el) return;
      const start = el.offsetTop;
      const total = el.offsetHeight - window.innerHeight * 0.5;
      const scrolled = window.scrollY - start;
      const pct = Math.max(0, Math.min(1, scrolled / Math.max(total, 1)));
      setProgress(pct * 100);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Scroll-spy on section headings
  useEffect(() => {
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-90px 0px -65% 0px', threshold: 0 }
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [toc]);

  function copyLink() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
  }

  return (
    <>
      <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <div className="report-shell">
        {/* TOC */}
        <nav className="report-toc" aria-label="Table of contents">
          <div className="toc-title">Contents</div>
          <ol>
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className={active === t.id ? 'active' : ''}>
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Body */}
        <article className="report-body" ref={bodyRef}>
          {children}
        </article>

        {/* Aside */}
        <aside className="report-aside" aria-label="Reader tools">
          <div className="ra-card">
            <div className="ra-label">Share & save</div>
            <div className="ra-share">
              <button type="button" onClick={copyLink}>
                {copied ? '✓ Link copied' : '⧉ Copy link'}
              </button>
              <button type="button" onClick={() => window.print()}>
                ⤓ Download as PDF
              </button>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=`}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                    '_blank',
                    'noopener'
                  );
                }}
              >
                ↗ Share on LinkedIn
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
