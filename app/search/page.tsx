'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { reports, getReport } from '../reports/data';
import { signals, getSignal } from '../signals/data';
import {
  atlas,
  allPlayers,
  playerBySlug,
  corridorsOrdered,
  meta,
  corridorByCode,
} from '../research/atlas';

type ResultGroup = {
  key: string;
  label: string;
  items: Array<{
    kind: 'report' | 'signal' | 'player';
    title: string;
    url: string;
    summary?: string;
    extra?: string;
  }>;
};

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s\-/]+/g, ' ').trim();
}

function matchScore(text: string, q: string) {
  const norm = normalize(text);
  const query = normalize(q);
  if (!query) return 0;
  if (norm === query) return 10;
  if (norm.startsWith(query)) return 7;
  if (norm.includes(query)) return 5;
  const tokens = query.split(' ');
  return tokens.filter((t) => norm.includes(t)).length;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const q = query.trim();

  const groups = useMemo<ResultGroup[]>(() => {
    if (!q) return [];

    const reportItems = reports
      .map((r) => {
        const titleScore = matchScore(r.title, q);
        const summaryScore = matchScore(r.summary, q);
        const domainScore = matchScore(r.domain, q);
        const s = Math.max(titleScore, summaryScore, domainScore);
        if (s <= 0) return null;
        return {
          kind: 'report' as const,
          title: r.title,
          url: `/reports/${r.slug}`,
          summary: r.summary,
          extra: `${r.domain} · ${r.publishedLabel} · ${r.readingTime}`,
          score: s,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    const signalItems = signals
      .map((s) => {
        const titleScore = matchScore(s.title, q);
        const excerptScore = matchScore(s.excerpt, q);
        const domainScore = matchScore(s.domain, q);
        const score = Math.max(titleScore, excerptScore, domainScore);
        if (score <= 0) return null;
        return {
          kind: 'signal' as const,
          title: s.title,
          url: `/signals/${s.slug}`,
          summary: s.excerpt,
          extra: `${s.domain} · ${s.dateLabel} · ${s.readingTime}`,
          score,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    const corridorNames = new Map(
      corridorsOrdered.map((c) => [normalize(c.label), c.code])
    );
    const corridorMatches = Array.from(corridorNames.entries())
      .map(([name, code]) => ({ name, code, score: matchScore(name, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const corridorItems = corridorMatches.map((m) => {
      const c = corridorByCode(m.code);
      const cm = c ? meta(c.code) : null;
      return {
        kind: 'report' as const,
        title: m.name,
        url: `/research/dependencies#${cm?.slug ?? m.code}`,
        summary: cm?.tagline ?? undefined,
        extra: 'Corridor · Industrial ecosystem',
        score: m.score,
      };
    });

    const playerItems = allPlayers
      .map((p) => {
        const nameScore = matchScore(p.name, q);
        const descScore = matchScore(p.description ?? '', q);
        const typeScore = matchScore(p.type, q);
        const score = Math.max(nameScore, descScore, typeScore);
        if (score <= 0) return null;
        const slug = p.id;
        return {
          kind: 'player' as const,
          title: p.name,
          url: `/research/players#${slug}`,
          summary: p.description ?? undefined,
          extra: `${p.type} · ${p.country}`,
          score,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    const items = [...reportItems, ...corridorItems, ...signalItems, ...playerItems].sort(
      (a, b) => b.score - a.score
    );

    const groups: ResultGroup[] = [];
    if (reportItems.length) {
      groups.push({ key: 'reports', label: 'Reports', items: items.filter((i) => i.kind === 'report') });
    }
    if (corridorItems.length) {
      groups.push({ key: 'corridors', label: 'Corridors', items: items.filter((i) => i.kind === 'report') });
    }
    if (signalItems.length) {
      groups.push({ key: 'signals', label: 'Signals', items: items.filter((i) => i.kind === 'signal') });
    }
    if (playerItems.length) {
      groups.push({ key: 'players', label: 'Players & suppliers', items: items.filter((i) => i.kind === 'player') });
    }

    // Remove groups that ended up empty after sorting.
    return groups.filter((g) => g.items.length > 0);
  }, [q]);

  useEffect(() => {
    const current = searchParams.get('q') ?? '';
    setQuery(current);
  }, [searchParams]);

  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Search</span>
          </div>
          <h1>Search Techadyant Labs</h1>
          <p className="lede">
            Search across reports, signals, corridors, ecosystem players and supply-chain sources.
          </p>
          <div style={{ marginTop: 22 }}>
            <form
              method="get"
              action="/search"
              style={{ display: 'flex', gap: 10, maxWidth: 720 }}
              onSubmit={(e) => {
                const form = e.currentTarget;
                const input = form.querySelector('input[name="q"]') as HTMLInputElement | null;
                const value = input?.value?.trim() ?? '';
                if (!value) {
                  e.preventDefault();
                  return;
                }
                router.push(`/search?q=${encodeURIComponent(value)}`);
                e.preventDefault();
              }}
            >
              <input
                name="q"
                defaultValue={query}
                placeholder="Search reports, signals, corridors, players, sources..."
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn-ed btn-ed-primary"
                style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid transparent' }}
                disabled={!q}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="wrap" style={{ paddingBottom: 80 }}>
        {q ? (
          <>
            {groups.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', marginTop: 28 }}>
                No results for “{query}”. Try simpler terms, or browse reports and signals directly.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginTop: 28 }}>
                {groups.map((group) => (
                  <div key={group.key}>
                    <div
                      style={{
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '.12em',
                        color: 'var(--text-dim)',
                        marginBottom: 12,
                      }}
                    >
                      {group.label}
                    </div>
                    <ul className="rule-top" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {group.items.slice(0, 8).map((item) => (
                        <li key={`${group.key}-${item.url}`}>
                          <Link
                            href={item.url}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              padding: '14px 0',
                              textDecoration: 'none',
                              color: 'inherit',
                            }}
                          >
                            <span style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</span>
                            {item.summary ? (
                              <span
                                style={{
                                  color: 'var(--text-muted)',
                                  fontSize: 14,
                                  lineHeight: 1.55,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {item.summary}
                              </span>
                            ) : null}
                            {item.extra ? (
                              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{item.extra}</span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ marginTop: 28, color: 'var(--text-muted)' }}>
            Enter a query to search reports, signals, corridors, players and sources.
          </div>
        )}
      </section>
    </>
  );
}
