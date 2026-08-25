'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  meta,
  companies,
  platforms,
  dependencies,
  layers,
  opportunities,
  STATUS_LABEL,
  STATUS_COLORS,
  type Company,
  type Platform,
} from './data';

type Tab = 'overview' | 'companies' | 'platforms' | 'dependencies' | 'opportunities';

export function SpaceView({ data }: { data: unknown }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [q, setQ] = useState('');

  const filteredCompanies = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.type.toLowerCase().includes(term) ||
        c.hq.toLowerCase().includes(term) ||
        c.products.toLowerCase().includes(term)
    );
  }, [q]);

  const filteredPlatforms = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return platforms;
    return platforms.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.mfr.toLowerCase().includes(term)
    );
  }, [q]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'companies', label: `Companies (${companies.length})` },
    { id: 'platforms', label: `Platforms (${platforms.length})` },
    { id: 'dependencies', label: 'Dependencies' },
    { id: 'opportunities', label: 'Opportunities' },
  ];

  return (
    <div className="space-atlas">
      {/* Stat strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 28,
        }}
      >
        <Stat label="Platforms" value={String(meta.platforms)} />
        <Stat label="Companies" value={`${meta.companies} (${meta.indianCompanies} IN)`} />
        <Stat label="Private funding" value={`$${meta.fundingUsdMn} Mn`} />
        <Stat label="IN-SPACe auths" value={String(meta.authorisations)} />
        <Stat label="Space economy" value={`~$${meta.spaceEconomyUsdBn} Bn`} />
        <Stat label="2033 target" value={`$${meta.targetEconomyUsdBn} Bn`} />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 20,
          borderBottom: '1px solid var(--border, #333)',
          paddingBottom: 12,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? 'var(--brass, #C9A84C)' : 'transparent',
              color: tab === t.id ? '#111' : 'var(--text-dim)',
              border: '1px solid var(--border, #444)',
              borderRadius: 6,
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <Overview />}
      {tab === 'companies' && (
        <CompaniesTab companies={filteredCompanies} q={q} setQ={setQ} />
      )}
      {tab === 'platforms' && (
        <PlatformsTab platforms={filteredPlatforms} q={q} setQ={setQ} />
      )}
      {tab === 'dependencies' && <DependenciesTab />}
      {tab === 'opportunities' && <OpportunitiesTab />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-2, #1a1a1a)',
        border: '1px solid var(--border, #333)',
        borderRadius: 8,
        padding: '12px 14px',
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Overview() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>The stack — value-chain readiness</h3>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--text-dim)' }}>
          Eight layers scored 0–5 from import-dependent to sovereign. Weakest links today:
          space-grade electronics and sustained domestic launch cadence.
        </p>
        <div style={{ display: 'grid', gap: 8 }}>
          {layers.map((l) => (
            <div
              key={l.code}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 100px',
                gap: 12,
                alignItems: 'center',
                padding: '10px 12px',
                background: 'var(--bg-2, #1a1a1a)',
                borderRadius: 6,
                border: '1px solid var(--border, #333)',
              }}
            >
              <strong style={{ fontSize: 13 }}>{l.label}</strong>
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{l.rationale}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: STATUS_COLORS[l.status] ?? '#888',
                  textAlign: 'right',
                }}
              >
                {STATUS_LABEL[l.status] ?? '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>Key signals (2026)</h3>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7, color: 'var(--text-dim)' }}>
          <li>Skyroot Vikram-1 — first private Indian orbital launch (Jul 2026)</li>
          <li>~400–440 registered space startups; top 10 hold &gt;60% of private capital</li>
          <li>IN-SPACe: 113 authorisations to 52 non-government entities</li>
          <li>2 commercial private launches planned FY26–27; 6+ FY27–28</li>
          <li>National target: ~$44 Bn space economy by 2033</li>
        </ul>
      </div>
    </div>
  );
}

function CompaniesTab({
  companies: list,
  q,
  setQ,
}: {
  companies: Company[];
  q: string;
  setQ: (v: string) => void;
}) {
  return (
    <div>
      <input
        type="search"
        placeholder="Filter companies…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          width: '100%',
          maxWidth: 360,
          marginBottom: 16,
          padding: '8px 12px',
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          color: 'inherit',
        }}
      />
      <div style={{ display: 'grid', gap: 10 }}>
        {list.map((c) => (
          <Link
            key={c.id}
            href={`/research/space/company/${c.slug}/`}
            style={{
              display: 'block',
              padding: '12px 14px',
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <strong>{c.name}</strong>
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                {c.country === 'IN' ? '🇮🇳' : c.country} · {c.type}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>
              {c.hq} · {c.products}
            </div>
            {c.funding_usd_mn != null && (
              <div style={{ fontSize: 12, marginTop: 4, color: 'var(--brass, #C9A84C)' }}>
                ~${c.funding_usd_mn} Mn raised
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

function PlatformsTab({
  platforms: list,
  q,
  setQ,
}: {
  platforms: Platform[];
  q: string;
  setQ: (v: string) => void;
}) {
  return (
    <div>
      <input
        type="search"
        placeholder="Filter platforms…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          width: '100%',
          maxWidth: 360,
          marginBottom: 16,
          padding: '8px 12px',
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          color: 'inherit',
        }}
      />
      <div style={{ display: 'grid', gap: 10 }}>
        {list.map((p) => (
          <Link
            key={p.id}
            href={`/research/space/platform/${p.slug}/`}
            style={{
              display: 'block',
              padding: '12px 14px',
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <strong>{p.name}</strong>
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{p.category}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>
              {p.mfr} · {p.status}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function DependenciesTab() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {dependencies.map((d) => (
        <div
          key={d.id}
          style={{
            padding: '14px 16px',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <strong>{d.name}</strong>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: STATUS_COLORS[d.status_score] ?? '#888',
              }}
            >
              {STATUS_LABEL[d.status_score]}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>
            Layer: {d.layer} · Criticality: {d.criticality} · Indian capability:{' '}
            {d.indian_capability}
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.5 }}>{d.explanation}</p>
        </div>
      ))}
    </div>
  );
}

function OpportunitiesTab() {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {opportunities.map((o) => (
        <div
          key={o.id}
          style={{
            padding: '12px 14px',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div>
            <strong style={{ fontSize: 14 }}>{o.title}</strong>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{o.layer}</div>
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: 4,
              background: o.score === 'Build-now' ? 'rgba(47,143,127,0.2)' : 'rgba(201,154,58,0.15)',
              color: o.score === 'Build-now' ? '#4FA88B' : '#C99A3A',
            }}
          >
            {o.score}
          </span>
        </div>
      ))}
    </div>
  );
}
