'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  entitiesForServices, programmesForServices, dependenciesForServices, opportunitiesForServices,
  domainsForView, statsForView, isSystem, isIndustry,
  originOf, statusInfo, humanize, entitySlug, sourcesFor,
  ORIGIN_ORDER, originMeta,
  VIEW_SERVICES,
  type ViewCode, type ServiceCode, type Entity, type Programme, type Dependency,
} from './data';
import { card, kick, StatusBadge, OriginBadge, ServiceTag, EntityLink, SourceRefs, StatCard } from './ui';

const BASE = '/research/pillars/defence';

const TABS = ['Overview', 'Capabilities', 'Systems', 'Industry', 'Procurement', 'Indigenisation', 'Dependencies', 'Sources'] as const;
type Tab = typeof TABS[number];

const tabBtn = (a: boolean): React.CSSProperties => ({
  cursor: 'pointer', border: 'none', background: 'transparent',
  color: a ? 'var(--text, #e9e7e0)' : 'var(--text-dim, #9aa3b2)', fontSize: 14, fontWeight: a ? 700 : 500,
  padding: '9px 2px', borderBottom: a ? '2px solid var(--brass, #F5B544)' : '2px solid transparent', whiteSpace: 'nowrap',
});
const chip = (a: boolean): React.CSSProperties => ({
  cursor: 'pointer', border: '1px solid var(--border, rgba(255,255,255,.16))',
  background: a ? 'var(--text, #e9e7e0)' : 'transparent', color: a ? 'var(--bg, #0b0b14)' : 'var(--text-dim, #9aa3b2)',
  borderRadius: 999, padding: '5px 13px', fontSize: 13, fontWeight: a ? 700 : 500, whiteSpace: 'nowrap',
});

function entityUrl(e: Entity) { return `${BASE}/entity/${entitySlug(e.id)}/`; }

/* -------- system / entity card (shared) */
function SystemCard({ e }: { e: Entity }) {
  return (
    <li style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
        <Link href={entityUrl(e)} style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', textDecoration: 'none' }}>{e.name}</Link>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {e.status && <StatusBadge status={e.status} />}
          <OriginBadge entity={e} />
        </span>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 5, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ textTransform: 'capitalize' }}>{humanize(e.type)}</span>
        {e.domain.map((d) => <span key={d} style={{ color: 'var(--text-muted)' }}>· {humanize(d)}</span>)}
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>{e.service.map((s) => <ServiceTag key={s} code={s} />)}</span>
      </div>
    </li>
  );
}

/* -------- indigenisation ladder distribution bar */
function OriginLadder({ systems, title }: { systems: Entity[]; title: string }) {
  const counts = new Map<string, number>();
  for (const e of systems) { const t = originOf(e).tier; counts.set(t, (counts.get(t) ?? 0) + 1); }
  const total = systems.length || 1;
  const rows = ORIGIN_ORDER.map((t) => ({ t, n: counts.get(t) ?? 0 })).filter((r) => r.n > 0);
  return (
    <div style={card}>
      <div style={{ ...kick, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {rows.map((r) => {
          const m = originMeta(r.t);
          return (
            <div key={r.t} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 220px) 1fr 34px', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 12.5, color: m.color }}>{m.label}</span>
              <span style={{ background: 'var(--surface, rgba(255,255,255,.04))', borderRadius: 4, height: 12, overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: `${(r.n / total) * 100}%`, background: m.color, borderRadius: 4 }} />
              </span>
              <span style={{ fontSize: 12, textAlign: 'right', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{r.n}</span>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '10px 0 0', lineHeight: 1.5 }}>
        Classified from country of origin. A platform built in India from a foreign design is shown as licensed/assembled — not indigenous.
      </p>
    </div>
  );
}

/* -------- procurement pipeline distribution */
function ProcurementPipeline({ systems, programmes }: { systems: Entity[]; programmes: Programme[] }) {
  const counts = new Map<string, { label: string; color: string; n: number }>();
  const add = (status?: string) => { const s = statusInfo(status); const cur = counts.get(s.stage); if (cur) cur.n++; else counts.set(s.stage, { label: s.label, color: s.color, n: 1 }); };
  systems.forEach((e) => add(e.status));
  programmes.forEach((p) => add(p.status));
  const rows = [...counts.values()].sort((a, b) => b.n - a.n);
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div style={card}>
      <div style={{ ...kick, marginBottom: 10 }}>Procurement &amp; lifecycle pipeline</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
        {rows.map((r) => (
          <li key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
            <span style={{ color: r.color, minWidth: 170 }}>{r.label}</span>
            <span style={{ flex: 1, background: 'var(--surface, rgba(255,255,255,.04))', borderRadius: 4, height: 10, overflow: 'hidden' }}>
              <span style={{ display: 'block', height: '100%', width: `${(r.n / max) * 100}%`, background: r.color, borderRadius: 4 }} />
            </span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11 }}>{r.n}</span>
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '10px 0 0', lineHeight: 1.5 }}>
        Acceptance of Necessity (AoN) is kept distinct from a signed contract — an AoN is a demand approval, not an order.
      </p>
    </div>
  );
}

const IMP_COLOR: Record<string, string> = { critical: '#E24B4A', high: '#F5B544', medium: '#6CB0FF', low: '#34D399' };

export function DefenceAtlasView({ view }: { view: ViewCode }) {
  const isMaritime = view === 'maritime';
  const isAir = view === 'air_force';
  const [tab, setTab] = useState<Tab>('Overview');
  const [sub, setSub] = useState<'all' | 'navy' | 'coast_guard'>('all');
  const [domain, setDomain] = useState('');
  const [ctype, setCtype] = useState('');
  const [q, setQ] = useState('');

  const svc: ServiceCode[] = useMemo(() => {
    if (!isMaritime) return VIEW_SERVICES[view];
    return sub === 'all' ? ['navy', 'coast_guard'] : [sub];
  }, [view, isMaritime, sub]);

  const ents = useMemo(() => entitiesForServices(svc), [svc]);
  const systems = useMemo(() => ents.filter(isSystem), [ents]);
  const industry = useMemo(() => ents.filter(isIndustry), [ents]);
  const domains = useMemo(() => domainsForView(svc), [svc]);
  const progs = useMemo(() => programmesForServices(svc), [svc]);
  const deps = useMemo(() => dependenciesForServices(svc), [svc]);
  const opps = useMemo(() => opportunitiesForServices(svc), [svc]);
  const stats = useMemo(() => statsForView(svc), [svc]);

  const ql = q.trim().toLowerCase();
  const match = (s: string) => !ql || s.toLowerCase().includes(ql);

  const sysFiltered = useMemo(
    () => systems.filter((e) => (!domain || e.domain.includes(domain)) && match(`${e.name} ${e.type} ${e.domain.join(' ')}`)),
    [systems, domain, ql],
  );
  const ctypes = useMemo(() => [...new Set(industry.map((c) => c.type))].sort(), [industry]);
  const compFiltered = useMemo(
    () => industry.filter((c) => (!ctype || c.type === ctype) && match(`${c.name} ${c.type} ${c.domain.join(' ')}`)),
    [industry, ctype, ql],
  );

  const propulsion = useMemo(
    () => ents.filter((e) => e.domain.some((d) => /propuls|engine/i.test(d)) || /engine|propuls/i.test(e.name)),
    [ents],
  );
  const propulsionDeps = useMemo(() => deps.filter((d) => /propuls|engine/i.test(d.category) || /propuls|engine/i.test(d.dependency)), [deps]);

  const go = (t: Tab) => { setTab(t); setQ(''); };

  return (
    <div>
      {/* Service sub-filter (maritime only) — Navy / Coast Guard without duplicating records */}
      {isMaritime && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <span style={{ ...kick, marginRight: 4 }}>Service</span>
          <button type="button" style={chip(sub === 'all')} onClick={() => setSub('all')}>All maritime</button>
          <button type="button" style={chip(sub === 'navy')} onClick={() => setSub('navy')}>Navy</button>
          <button type="button" style={chip(sub === 'coast_guard')} onClick={() => setSub('coast_guard')}>Coast Guard</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', borderBottom: '1px solid var(--border, rgba(255,255,255,.1))', marginBottom: 22, overflowX: 'auto' }}>
        {TABS.map((t) => <button key={t} type="button" onClick={() => go(t)} style={tabBtn(tab === t)}>{t}</button>)}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <StatCard label="Systems & platforms" value={stats.systems} note="mapped with lifecycle & origin" />
            <StatCard label="Industry entities" value={stats.companies} note="PSUs, JVs, private & foreign OEMs" />
            <StatCard label="Programmes" value={stats.programmes} note="procurement, policy & indigenisation" />
            <StatCard label="Dependencies" value={stats.dependencies} note="scored industrial/technology gaps" />
            <StatCard label="Indigenous share" value={`${stats.indigenousPct}%`} note="of systems, by design origin" />
          </div>

          {isAir && (propulsion.length > 0 || propulsionDeps.length > 0) && (
            <div style={{ ...card, borderColor: 'rgba(226,75,74,.4)', background: 'rgba(226,75,74,.05)' }}>
              <div style={{ ...kick, color: '#E24B4A', marginBottom: 8 }}>The decisive gap · Propulsion</div>
              <p style={{ margin: '0 0 12px', fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.65 }}>
                Aircraft engines remain India&apos;s highest-value strategic industrial gap. A platform assembled in India is not sovereign while its engine is imported — this Atlas keeps the two separate.
              </p>
              <div style={{ display: 'grid', gap: 8 }}>
                {propulsion.map((e) => (
                  <div key={e.id} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'baseline' }}>
                    <Link href={entityUrl(e)} style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)', textDecoration: 'none' }}>{e.name}</Link>
                    <OriginBadge entity={e} />
                    {e.status && <StatusBadge status={e.status} />}
                  </div>
                ))}
                {propulsionDeps.map((d) => (
                  <div key={d.id} style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>
                    <span style={{ color: IMP_COLOR[d.importance] || 'var(--text)', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>{d.importance}</span>{' '}
                    <EntityLink id={d.dependent} /> depends on <EntityLink id={d.dependency} /> <SourceRefs refs={d.source_refs} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
            <OriginLadder systems={systems} title="Indigenisation ladder" />
            <ProcurementPipeline systems={systems} programmes={progs} />
          </div>

          <div style={card}>
            <div style={{ ...kick, marginBottom: 10 }}>Capability domains · {domains.length}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {domains.map((d) => (
                <button key={d.domain} type="button" style={chip(false)} onClick={() => { setDomain(d.domain); setTab('Systems'); }}>
                  {d.label} <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>{d.entities.length}</span>
                </button>
              ))}
            </div>
          </div>

          {opps.length > 0 && (
            <div style={card}>
              <div style={{ ...kick, marginBottom: 10 }}>Emerging industrial opportunities · {opps.length}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                {opps.map((o) => (
                  <li key={o.id} style={{ borderLeft: '2px solid var(--brass, #F5B544)', paddingLeft: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{humanize(o.domain)} <SourceRefs refs={o.evidence_refs} /></div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.55, marginTop: 2 }}>{o.thesis}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ ...card, fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.7 }}>
            <b style={{ color: 'var(--text)' }}>One graph, not three directories.</b> Every system, company and programme is a node in a single relationship-driven database — a supplier that serves the Army, Navy and Air Force appears once and is reached from each. Facts carry their primary source; draft policy (e.g. DAP&nbsp;2026) is labelled as draft, not law. <Link href="/research/methodology/" style={{ color: 'var(--link, #6cb0ff)' }}>Methodology</Link>
          </div>
        </div>
      )}

      {tab === 'Capabilities' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: 0 }}>{domains.length} capability domains, each a cluster of systems and technologies. Click any entity to open its relationships.</p>
          {domains.map((d) => (
            <div key={d.domain} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ ...kick }}>{d.label}</div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.entities.length} entities</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {d.entities.map((e) => (
                  <Link key={e.id} href={entityUrl(e)} style={{ fontSize: 13, color: 'var(--text)', textDecoration: 'none', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 7, padding: '5px 10px', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                    {e.name}
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: originOf(e).color }} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Systems' && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <button type="button" style={chip(!domain)} onClick={() => setDomain('')}>All domains ({systems.length})</button>
            {domains.map((d) => <button key={d.domain} type="button" style={chip(domain === d.domain)} onClick={() => setDomain(d.domain)}>{d.label} ({d.entities.length})</button>)}
          </div>
          <input type="search" placeholder="Search systems, platforms, weapons, technologies…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '100%', maxWidth: 420, marginBottom: 14, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '8px 12px', fontSize: 13.5 }} />
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {sysFiltered.map((e) => <SystemCard key={e.id} e={e} />)}
          </ul>
          {sysFiltered.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No systems match this filter.</p>}
        </div>
      )}

      {tab === 'Industry' && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <button type="button" style={chip(!ctype)} onClick={() => setCtype('')}>All ({industry.length})</button>
            {ctypes.map((t) => <button key={t} type="button" style={chip(ctype === t)} onClick={() => setCtype(t)}>{humanize(t)} ({industry.filter((c) => c.type === t).length})</button>)}
          </div>
          <input type="search" placeholder="Search companies, PSUs, shipyards, OEMs…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '100%', maxWidth: 420, marginBottom: 14, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '8px 12px', fontSize: 13.5 }} />
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {compFiltered.map((c) => (
              <li key={c.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <Link href={entityUrl(c)} style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)', textDecoration: 'none' }}>{c.name}</Link>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--brass-cream, #E6D1A0)' }}>{humanize(c.type)}</span>
                    {c.service.map((s) => <ServiceTag key={s} code={s} />)}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4 }}>{c.domain.map(humanize).join(' · ')} · {c.country}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'Procurement' && (
        <div style={{ display: 'grid', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: 0 }}>
            {progs.length} programmes and policy instruments. Status uses the explicit acquisition ladder — AoN, contract, production, delivery and commissioning are never collapsed into one word.
          </p>
          {progs.map((p) => (
            <div key={p.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{p.name}</span>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <StatusBadge status={p.status} />
                  <span style={{ fontSize: 10.5, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{humanize(p.type)}</span>
                  <SourceRefs refs={p.source_refs} />
                </span>
              </div>
              {p.key_data && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {Object.entries(p.key_data).map(([k, v]) => (
                    <span key={k} style={{ fontSize: 11.5, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-dim)', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 6, padding: '3px 8px' }}>
                      {humanize(k)}: {Array.isArray(v) ? v.join(', ') : String(v)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div style={card}>
            <div style={{ ...kick, marginBottom: 10 }}>Systems by acquisition / lifecycle stage</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {systems.filter((e) => e.status).sort((a, b) => (a.status! < b.status! ? -1 : 1)).map((e) => (
                <li key={e.id} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <Link href={entityUrl(e)} style={{ fontSize: 13.5, color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>{e.name}</Link>
                  <StatusBadge status={e.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'Indigenisation' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: 0 }}>
            Where each system sits between imported and indigenous. Manufacturing in India is not the same as owning the design — the ladder below separates them.
          </p>
          <OriginLadder systems={systems} title="Systems by indigenisation tier" />
          {progs.filter((p) => p.type === 'indigenisation' || /indigenis/i.test(p.name)).map((p) => (
            <div key={p.id} style={{ ...card, borderColor: 'rgba(52,211,153,.35)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{p.name}</span>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><StatusBadge status={p.status} /><SourceRefs refs={p.source_refs} /></span>
              </div>
              {p.key_data && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {Object.entries(p.key_data).map(([k, v]) => (
                    <span key={k} style={{ fontSize: 11.5, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-dim)', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 6, padding: '3px 8px' }}>{humanize(k)}: {Array.isArray(v) ? v.join(', ') : String(v)}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {ORIGIN_ORDER.map((t) => {
            const rows = systems.filter((e) => originOf(e).tier === t);
            if (!rows.length) return null;
            const m = originMeta(t);
            return (
              <div key={t} style={card}>
                <div style={{ ...kick, color: m.color, marginBottom: 10 }}>{m.label} · {rows.length}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {rows.map((e) => <Link key={e.id} href={entityUrl(e)} style={{ fontSize: 13, color: 'var(--text)', textDecoration: 'none', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 7, padding: '5px 10px' }}>{e.name}</Link>)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'Dependencies' && (
        <div style={{ display: 'grid', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: 0 }}>
            {deps.length} industrial / technology dependencies, scored by importance and status. A foreign-origin input is only marked a critical dependency where the data says so.
          </p>
          {[...deps].sort((a, b) => (a.importance === 'critical' ? -1 : 1) - (b.importance === 'critical' ? -1 : 1)).map((d) => (
            <DepCard key={d.id} d={d} />
          ))}
        </div>
      )}

      {tab === 'Sources' && (
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: '0 0 12px' }}>Primary sources cited across this Atlas view. Every dated claim traces back to one of these documents.</p>
          <SourcesForView svc={svc} />
        </div>
      )}
    </div>
  );
}

function DepCard({ d }: { d: Dependency }) {
  const color = IMP_COLOR[d.importance] || 'var(--text-dim)';
  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
          <EntityLink id={d.dependent} /> <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>depends on</span> <EntityLink id={d.dependency} />
        </span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color, border: `1px solid ${color}55`, borderRadius: 5, padding: '1px 7px' }}>{d.importance}</span>
          <SourceRefs refs={d.source_refs} />
        </span>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4 }}>{humanize(d.category)} · {humanize(d.status)}</div>
    </div>
  );
}

function SourcesForView({ svc }: { svc: ServiceCode[] }) {
  // Collect every source referenced by programmes/dependencies/opportunities in this view.
  const refs = new Set<string>();
  programmesForServices(svc).forEach((p) => (p.source_refs ?? []).forEach((r) => refs.add(r)));
  dependenciesForServices(svc).forEach((d) => (d.source_refs ?? []).forEach((r) => refs.add(r)));
  opportunitiesForServices(svc).forEach((o) => (o.evidence_refs ?? []).forEach((r) => refs.add(r)));
  const list = sourcesFor([...refs].sort());
  if (!list.length) return <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No sources for this view.</p>;
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
      {list.map((s) => (
        <li key={s.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, lineHeight: 1.55 }}>
          <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--link, #6cb0ff)', fontWeight: 600 }}>{s.title}</a>
          <span style={{ marginLeft: 8, fontSize: 10.5, color: 'var(--text-muted)' }}>{s.date} · {humanize(s.scope)}</span>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-jetbrains, monospace)' }}>{s.id}</div>
        </li>
      ))}
    </ul>
  );
}
