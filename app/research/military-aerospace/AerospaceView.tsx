'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { INDIA_OUTLINE } from '../../corridors/data';
import type { Platform, Company, Dependency, Supplier, System, Localization, Opportunity, GeoRec, GeoCluster, Mro, Programme, Meta, Source } from './data';
import { DEPTH_ORDER, DEPTH_LABEL, CRIT_COLOR, TIER_LABEL } from './data';
import { LayerScores, SignalsTimeline, type PackLayer, type PackSignal } from '../AtlasLayers';

type Data = {
  layers?: PackLayer[];
  signals?: PackSignal[];
  meta: Meta; platforms: Platform[]; companies: Company[]; suppliers: Supplier[]; systems: System[];
  localization: Localization[]; dependencies: Dependency[]; opportunities: Opportunity[];
  geography: { records: GeoRec[]; clusters: GeoCluster[] }; mro: Mro[]; programmes: Programme[];
};

const TABS = ['Overview', 'Platforms', 'Companies', 'Dependencies', 'Geography', 'Opportunities', 'Programmes', 'MRO'] as const;
type Tab = typeof TABS[number];

const card: React.CSSProperties = { border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-2, rgba(255,255,255,.02))' };
const kick: React.CSSProperties = { fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--brass-cream, #E6D1A0)', fontWeight: 600 };
const tabBtn = (a: boolean): React.CSSProperties => ({ cursor: 'pointer', border: 'none', background: 'transparent', color: a ? 'var(--text, #e9e7e0)' : 'var(--text-dim, #9aa3b2)', fontSize: 14, fontWeight: a ? 700 : 500, padding: '9px 2px', borderBottom: a ? '2px solid var(--brass, #F5B544)' : '2px solid transparent', whiteSpace: 'nowrap' });
const chip = (a: boolean): React.CSSProperties => ({ cursor: 'pointer', border: '1px solid var(--border, rgba(255,255,255,.16))', background: a ? 'var(--text, #e9e7e0)' : 'transparent', color: a ? 'var(--bg, #0b0b14)' : 'var(--text-dim, #9aa3b2)', borderRadius: 999, padding: '5px 13px', fontSize: 13, fontWeight: a ? 700 : 500, whiteSpace: 'nowrap' });

// Indicative badge - every record whose supporting sources could not be fully verified is visibly labelled.
function Ind({ n = 'Indicative' }: { n?: string }) {
  return <span className="ma-ind" title="Supporting sources could not be fully verified - treat as indicative, not confirmed">{n}</span>;
}
function Crit({ c }: { c: string }) {
  return <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.04em', color: CRIT_COLOR[c] || 'var(--text-dim)', border: `1px solid ${CRIT_COLOR[c] || 'var(--border)'}55`, borderRadius: 5, padding: '1px 7px' }}>{c}</span>;
}
function Depth({ d }: { d: string }) {
  const i = DEPTH_ORDER.indexOf(d);
  return <span style={{ fontSize: 11.5, fontFamily: 'var(--font-jetbrains, monospace)', color: i >= 3 ? '#2BC5B4' : i >= 2 ? 'var(--brass-cream, #E6D1A0)' : 'var(--text-muted)', border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 5, padding: '1px 7px' }} title={DEPTH_LABEL[d] || d}>{d} · {DEPTH_LABEL[d]?.split(' ')[0] || ''}</span>;
}

/* ------------------------------------------------ 1. Localization depth by platform (CSS bars) */
function LocalizationChart({ platforms }: { platforms: Platform[] }) {
  const rows = [...platforms].sort((a, b) => DEPTH_ORDER.indexOf(a.localization_depth_max) - DEPTH_ORDER.indexOf(b.localization_depth_max) || a.name.localeCompare(b.name));
  const max = DEPTH_ORDER.length - 1;
  return (
    <div className="ma-chart">
      <div className="ma-chart-title">Localization depth by platform <span className="ma-chart-sub">L0 imported → L5 full design &amp; manufacture</span></div>
      <div style={{ display: 'grid', gap: 8 }}>
        {rows.map((p) => {
          const i = Math.max(0, DEPTH_ORDER.indexOf(p.localization_depth_max));
          const w = (i / max) * 100;
          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 190px) 1fr 60px', gap: 10, alignItems: 'center' }}>
              <Link href={`/research/military-aerospace/platform/${p.slug}/`} style={{ fontSize: 12.5, color: 'var(--text)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</Link>
              <div style={{ background: 'var(--surface, rgba(255,255,255,.04))', borderRadius: 4, height: 14, overflow: 'hidden' }}>
                <div style={{ width: `${w}%`, height: '100%', background: i >= 3 ? 'linear-gradient(90deg,#2BC5B4,#34D399)' : i >= 2 ? 'linear-gradient(90deg,#F5B544,#E6D1A0)' : 'linear-gradient(90deg,#6F6F85,#9898A8)', borderRadius: 4 }} title={DEPTH_LABEL[p.localization_depth_max]} />
              </div>
              <Depth d={p.localization_depth_max} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------ 2. Dependency criticality matrix */
function DependencyMatrix({ deps }: { deps: Dependency[] }) {
  const aircraft = useMemo(() => {
    const seen: string[] = [];
    for (const d of deps) {
      const a = (d.aircraft || '').split('(')[0].trim();
      if (!seen.includes(a)) seen.push(a);
    }
    return seen;
  }, [deps]);
  const rank: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const rows = [...deps].sort((a, b) => (rank[a.criticality] ?? 9) - (rank[b.criticality] ?? 9));
  return (
    <div className="ma-chart">
      <div className="ma-chart-title">Dependency criticality matrix <span className="ma-chart-sub">21 dependencies across the fleet · {deps.filter((d) => d.criticality === 'CRITICAL').length} critical</span></div>
      <div className="ma-matrix" style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 720, display: 'grid', gap: 4 }}>
          <div className="ma-mrow ma-mhead" style={{ gridTemplateColumns: `minmax(190px, 1.6fr) repeat(${aircraft.length}, 1fr) 90px` }}>
            <span>Dependency</span>
            {aircraft.map((a) => <span key={a} style={{ fontSize: 10.5, textAlign: 'center' }}>{a}</span>)}
            <span style={{ textAlign: 'right' }}>Concentration</span>
          </div>
          {rows.map((d) => (
            <div key={d.id} className="ma-mrow" style={{ gridTemplateColumns: `minmax(190px, 1.6fr) repeat(${aircraft.length}, 1fr) 90px` }}>
              <Link href={`/research/military-aerospace/dependency/${d.slug}/`} style={{ fontSize: 12, color: 'var(--text)', textDecoration: 'none' }}>
                {d.dependency}{d.indicative && <Ind n="" />}
              </Link>
              {aircraft.map((a) => {
                const hit = (d.aircraft || '').split('(')[0].trim() === a;
                return <span key={a} style={{ display: 'flex', justifyContent: 'center' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: hit ? (CRIT_COLOR[d.criticality] || '#666') : 'transparent', border: hit ? 'none' : '1px dashed var(--border, rgba(255,255,255,.1))' }} title={hit ? `${d.component || d.dependency} - ${d.criticality}` : ''} /></span>;
              })}
              <span style={{ fontSize: 10.5, textAlign: 'right', color: 'var(--text-muted)' }}>{d.supply_concentration === 'single-source' ? 'single-source' : 'oligopoly'}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
        {Object.entries(CRIT_COLOR).filter(([k]) => ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(k)).map(([k, v]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-dim)' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: v }} />{k}</span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------ 3. Supplier tier distribution (SVG donut) */
function SupplierTierDonut({ tiers, total }: { tiers: { k: string; n: number }[]; total: number }) {
  const order = ['tier-1', 'tier-2', 'tier-3'];
  const sorted = [...tiers].sort((a, b) => order.indexOf(a.k) - order.indexOf(b.k));
  const colors = ['#F5B544', '#6CB0FF', '#34D399'];
  const R = 54, CX = 70, CY = 70;
  let acc = 0;
  const arcs = sorted.map((t, i) => {
    const frac = total ? t.n / total : 0;
    const a0 = (acc / total) * 2 * Math.PI - Math.PI / 2;
    acc += t.n;
    const a1 = (acc / total) * 2 * Math.PI - Math.PI / 2;
    const x0 = CX + R * Math.cos(a0), y0 = CY + R * Math.sin(a0);
    const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return { key: t.k, d: `M ${CX} ${CY} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`, fill: colors[i % colors.length], n: t.n, label: TIER_LABEL[t.k] || t.k };
  });
  return (
    <div className="ma-chart">
      <div className="ma-chart-title">Supplier tier distribution <span className="ma-chart-sub">{total} documented relationships</span></div>
      <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="Supplier tier distribution donut">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--border, rgba(255,255,255,.08))" strokeWidth="1" />
          {arcs.map((a) => <path key={a.key} d={a.d} fill={a.fill} fillOpacity="0.85" stroke="var(--bg, #0b0b14)" strokeWidth="1"><title>{a.label}: {a.n} relationships</title></path>)}
          <text x={CX} y={CY - 2} textAnchor="middle" fill="var(--text, #e9e7e0)" fontSize="16" fontWeight="700">{total}</text>
          <text x={CX} y={CY + 14} textAnchor="middle" fill="var(--text-dim)" fontSize="8.5">relationships</text>
        </svg>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
          {arcs.map((a) => (
            <li key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-dim)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: a.fill }} />
              <span style={{ color: 'var(--text)' }}>{a.label}</span> {a.n}
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>({Math.round((a.n / total) * 100)}%)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------ 4. Geography cluster map (India outline) */
const LNG_A = 13.06538, LNG_B = -0.15374, LNG_C = -830.5, LAT_A = -0.47098, LAT_B = -15.09358, LAT_C = 679.0;
function ClusterMap({ sites, clusters }: { sites: GeoRec[]; clusters: GeoCluster[] }) {
  const coords = useMemo(() => {
    const m = (INDIA_OUTLINE || '').match(/-?\d+(?:\.\d+)?/g);
    const out: string[] = [];
    if (m && m.length >= 2) for (let i = 0; i + 1 < m.length; i += 2) out.push(`${m[i]} ${m[i + 1]}`);
    return out.length ? `M ${out.join(' L ')} Z` : '';
  }, []);
  const pts = sites.filter((s) => s.lat && s.lng);
  const byCluster = (c: GeoCluster) => sites.filter((s) => c.company_ids.includes(s.company_id)).length;
  return (
    <div className="ma-chart">
      <div className="ma-chart-title">Geography of the ecosystem <span className="ma-chart-sub">{sites.length} sites · {clusters.length} evidence-backed clusters</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, alignItems: 'start' }}>
        <svg viewBox="0 0 550 563.58" style={{ width: '100%', maxWidth: 400, height: 'auto', display: 'block' }} role="img" aria-label="Map of India showing aerospace manufacturing sites">
          <path d={coords} fill="rgba(255,255,255,.03)" stroke="var(--border, rgba(255,255,255,.22))" strokeWidth="1" />
          {pts.map((d, i) => {
            const cx = LNG_A * (d.lng as number) + LNG_B * (d.lat as number) + LNG_C;
            const cy = LAT_A * (d.lng as number) + LAT_B * (d.lat as number) + LAT_C;
            return (
              <circle key={i} cx={cx.toFixed(1)} cy={cy.toFixed(1)} r="3" fill="#F5B544" fillOpacity="0.85" stroke="var(--bg, #0b0b14)" strokeWidth="0.5">
                <title>{d.company_name} - {d.city}, {d.state} ({d.capability || 'site'})</title>
              </circle>
            );
          })}
        </svg>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
          {clusters.map((c) => (
            <li key={c.id} style={{ ...card, padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{c.name}</span>
                <span style={{ fontSize: 11, color: 'var(--brass-cream, #E6D1A0)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{byCluster(c)} sites · {c.company_ids.length} companies</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 3 }}>{c.state} · {c.evidence_strength}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------ 5. Programme timeline (SVG) */
function ProgrammeTimeline({ programmes }: { programmes: Programme[] }) {
  const progs = useMemo(() => {
    const m = new Map<string, Programme[]>();
    for (const p of programmes) {
      if (!m.has(p.programme_id)) m.set(p.programme_id, []);
      m.get(p.programme_id)!.push(p);
    }
    return [...m.entries()].map(([id, ms]) => ({ id, name: ms[0]?.programme || id, ms: ms.sort((a, b) => (a.date || '').localeCompare(b.date || '')) }));
  }, [programmes]);
  const Y0 = 2006, Y1 = 2032;
  const W = 860, LH = 34, PAD = 26, TOP = 20;
  const x = (y: string) => PAD + ((parseInt(y, 10) - Y0) / (Y1 - Y0)) * (W - PAD * 2);
  const yFor = (i: number) => TOP + i * LH;
  return (
    <div className="ma-chart">
      <div className="ma-chart-title">Programme timeline <span className="ma-chart-sub">{programmes.length} milestones · {progs.length} programmes · 2006–2032</span></div>
      <svg viewBox={`0 0 ${W} ${TOP + progs.length * LH + 8}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Programme timeline of India's military transport aircraft programmes">
        {Array.from({ length: Math.floor((Y1 - Y0) / 2) + 1 }, (_, i) => Y0 + i * 2).map((yr) => (
          <g key={yr}>
            <line x1={x(String(yr))} y1={TOP - 8} x2={x(String(yr))} y2={TOP + progs.length * LH} stroke="var(--border, rgba(255,255,255,.06))" strokeWidth="1" />
            <text x={x(String(yr))} y={TOP - 12} textAnchor="middle" fill="var(--text-dim)" fontSize="9">{yr}</text>
          </g>
        ))}
        {progs.map((p, i) => {
          const y = yFor(i);
          return (
            <g key={p.id}>
              <text x={PAD} y={y + 3} fill="var(--text-muted)" fontSize="10" fontWeight="600">{p.name}</text>
              {p.ms.map((ms, j) => (
                <g key={j}>
                  <circle cx={x(ms.date)} cy={y} r="3.6" fill={ms.status === 'delivered' || ms.status === 'ongoing' ? '#F5B544' : '#818CF8'} fillOpacity="0.9" stroke="var(--bg, #0b0b14)" strokeWidth="0.6">
                    <title>{ms.milestone} - {ms.date} ({ms.status})</title>
                  </circle>
                  {j > 0 && <line x1={x(p.ms[j - 1].date)} y1={y} x2={x(ms.date)} y2={y} stroke="var(--border, rgba(255,255,255,.25))" strokeWidth="1" />}
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-dim)' }}><span style={{ width: 8, height: 8, borderRadius: 99, background: '#F5B544' }} /> delivered / ongoing</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-dim)' }}><span style={{ width: 8, height: 8, borderRadius: 99, background: '#818CF8' }} /> planned / prospective</span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Hover a dot for the milestone. Dates are exact where verified, month-precision otherwise.</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- directory rows */
function Dir({ title, rows, href, name, sub }: { title: string; rows: { slug: string; name: string; sub?: string; ind?: boolean }[]; href?: (s: string) => string; name: string; sub?: (r: { slug: string; name: string; sub?: string; ind?: boolean }) => string }) {
  if (!rows.length) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ ...kick, marginBottom: 10 }}>{title} · {rows.length}</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
        {rows.map((r) => (
          <li key={r.slug} style={{ ...card, padding: '11px 14px' }}>
            {href ? <Link href={href(r.slug)} style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>{r.name}</Link> : <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{r.name}</span>}
            {r.ind && <Ind n="" />}
            {sub && <span style={{ fontSize: 12.5, color: 'var(--text-dim)' }}> · {sub(r)}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AerospaceView({ data }: { data: Data }) {
  const d = data;
  const { meta: m } = d;
  const [tab, setTab] = useState<Tab>('Overview');
  const [ctype, setCtype] = useState('');
  const [pcat, setPcat] = useState('');
  const [q, setQ] = useState('');
  const go = (t: Tab) => { setTab(t); setQ(''); };

  const plats = useMemo(() => d.platforms.filter((p) => (!pcat || p.category === pcat) && (!q || `${p.name} ${p.role} ${p.manufacturer_name}`.toLowerCase().includes(q.toLowerCase()))), [pcat, q, d.platforms]);
  const comps = useMemo(() => d.companies.filter((c) => (!ctype || c.type === ctype) && (!q || `${c.name} ${c.capability} ${c.programmes}`.toLowerCase().includes(q.toLowerCase()))), [ctype, q, d.companies]);
  const types = useMemo(() => [...new Set(d.companies.map((c) => c.type).filter(Boolean))].sort(), [d.companies]);
  const cats = useMemo(() => [...new Set(d.platforms.map((p) => p.category).filter(Boolean))].sort(), [d.platforms]);
  const critRank: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', borderBottom: '1px solid var(--border, rgba(255,255,255,.1))', marginBottom: 22, overflowX: 'auto' }}>
        {TABS.map((t) => <button key={t} type="button" onClick={() => go(t)} style={tabBtn(tab === t)}>{t}</button>)}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[
              ['Platforms', `${m.platforms}`, 'C-295 to Il-76MD, mapped with Indian production status'],
              ['Companies', `${m.companies}`, 'HAL and Tata-Airbus led; Tier-1 to Tier-3 tracked'],
              ['Import dependencies', `${m.dependencies}`, `${m.dependencyByCriticality.find((x) => x.k === 'CRITICAL')?.n ?? 0} critical · ${m.dependencyByConcentration.find((x) => x.k === 'single-source')?.n ?? 0} single-source`],
              ['Sources verified', `${m.sourcesResolved}/${m.sources}`, `${m.sourcesUnresolved} still indicative - labelled in the UI`],
              ['Indicative records', `${m.indicativeRecords}`, `of ${m.records} records - visibly labelled, not rendered as fact`],
            ].map(([k, v, s]) => (
              <div key={k} style={{ ...card }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-dim)' }}>{k}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--brass-cream, #E6D1A0)', fontFamily: 'var(--font-jetbrains, monospace)', margin: '4px 0 2px' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.45 }}>{s}</div>
              </div>
            ))}
          </div>

          <LocalizationChart platforms={d.platforms} />
          <DependencyMatrix deps={d.dependencies} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            <SupplierTierDonut tiers={m.supplierByTier} total={d.suppliers.length} />
            <div className="ma-chart">
              <div className="ma-chart-title">System-level dependencies <span className="ma-chart-sub">{d.systems.length} system records scored</span></div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
                {m.systemByDependency.map((x) => (
                  <li key={x.k} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                    <span style={{ color: 'var(--text-dim)', minWidth: 74 }}>{x.k || 'unrated'}</span>
                    <span style={{ flex: 1, background: 'var(--surface, rgba(255,255,255,.04))', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${(x.n / m.systemByDependency[0].n) * 100}%`, background: CRIT_COLOR[x.k] || '#666', borderRadius: 4 }} />
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11 }}>{x.n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ClusterMap sites={d.geography.records} clusters={d.geography.clusters} />
          <ProgrammeTimeline programmes={d.programmes} />
          <LayerScores layers={d.layers || []} heading="Military aerospace value chain, scored" note="0 import-dependent to 5 sovereign. Aug 2026 research pack; each layer traces to a sourced record." />
          <SignalsTimeline signals={d.signals || []} />
          <div style={{ ...card, fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7 }}>
            <b style={{ color: 'var(--text)' }}>Provenance, honestly labelled.</b> {m.sourcesResolved} of {m.sources} sources were resolved to specific primary documents in the August 2026 audit; the remaining {m.sourcesUnresolved} are marked indicative and every record that rests on them carries an <Ind n="" /> badge. Notably, no evidence was found of an IAF selection of the C-390 or of an Embraer-HAL MoU - Embraer&apos;s documented C-390 India partner is Mahindra Defence, and the IAF Medium Transport Aircraft competition remains open. <Link href="/research/methodology/" style={{ color: 'var(--link, #6cb0ff)' }}>Methodology</Link>
          </div>
        </div>
      )}

      {tab === 'Platforms' && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <button type="button" style={chip(!pcat)} onClick={() => setPcat('')}>All platforms ({d.platforms.length})</button>
            {cats.map((c) => <button key={c} type="button" style={chip(pcat === c)} onClick={() => setPcat(c)}>{c.replace(/-/g, ' ')} ({d.platforms.filter((p) => p.category === c).length})</button>)}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {plats.map((p) => (
              <li key={p.id} style={{ ...card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <Link href={`/research/military-aerospace/platform/${p.slug}/`} style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', textDecoration: 'none' }}>{p.name}</Link>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Depth d={p.localization_depth_max} />
                    {p.indicative && <Ind />}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4 }}>
                  {[p.payload_tonnes ? `${p.payload_tonnes} t payload` : null, p.range_km ? `${p.range_km.toLocaleString('en-IN')} km range` : null, p.engine, p.production_status].filter(Boolean).join(' · ')}
                </div>
                {p.indian_partner_name && <div style={{ fontSize: 12, color: 'var(--brass-cream, #E6D1A0)', marginTop: 4 }}>Indian partner: {p.indian_partner_name} ({p.indian_partner_role})</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'Companies' && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <button type="button" style={chip(!ctype)} onClick={() => setCtype('')}>All ({d.companies.length})</button>
            {types.map((t) => <button key={t} type="button" style={chip(ctype === t)} onClick={() => setCtype(t)}>{t} ({d.companies.filter((c) => c.type === t).length})</button>)}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {comps.map((c) => (
              <li key={c.id} style={{ ...card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <Link href={`/research/military-aerospace/company/${c.slug}/`} style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)', textDecoration: 'none' }}>{c.name}</Link>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--brass-cream, #E6D1A0)' }}>{c.type}</span>
                    {c.indicative && <Ind />}
                  </span>
                </div>
                {c.capability && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.55 }}>{c.capability.slice(0, 220)}{c.capability.length > 220 ? '…' : ''}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'Dependencies' && (
        <div>
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-dim)' }}>
            {d.dependencies.length} dependencies scored by criticality, supply concentration and substitution difficulty. Every one links to a detail page with its resolved sources.
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {[...d.dependencies].sort((a, b) => (critRank[a.criticality] ?? 9) - (critRank[b.criticality] ?? 9)).map((x) => (
              <li key={x.id} style={{ ...card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <Link href={`/research/military-aerospace/dependency/${x.slug}/`} style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>{x.dependency}</Link>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Crit c={x.criticality} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{x.supply_concentration}</span>
                    {x.indicative && <Ind />}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4 }}>
                  {[x.aircraft, x.foreign_oem, x.foreign_country, x.substitution_difficulty === 'severe' ? 'substitution: severe' : x.substitution_difficulty].filter(Boolean).join(' · ')}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'Geography' && (
        <div>
          <ClusterMap sites={d.geography.records} clusters={d.geography.clusters} />
          <div style={{ marginTop: 18 }}>
            <Dir title="Sites" name="site" rows={d.geography.records.map((g) => ({ slug: g.id, name: `${g.company_name} - ${g.location}`, sub: `${g.city}, ${g.state}`, ind: g.indicative }))} sub={(r) => r.sub || ''} />
          </div>
        </div>
      )}

      {tab === 'Opportunities' && (
        <div>
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-dim)' }}>
            {d.opportunities.length} industrial opportunities scored on the Atlas framework - from C-390 composites and transport fly-by-wire actuators to V2500 engine-component manufacturing.
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {[...d.opportunities].sort((a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0)).map((o) => (
              <li key={o.id} style={{ ...card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{o.title}</span>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11.5, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--brass-cream, #E6D1A0)' }}>score {o.opportunity_score ?? 'n/a'}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.category}</span>
                    {o.indicative && <Ind />}
                  </span>
                </div>
                {o.current_gap && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.55 }}>{o.current_gap.slice(0, 200)}{o.current_gap.length > 200 ? '…' : ''}</div>}
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{[o.aircraft, o.time_horizon, o.capital_intensity].filter(Boolean).join(' · ')}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'Programmes' && (
        <div>
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-dim)' }}>{d.programmes.length} milestones across {new Set(d.programmes.map((p) => p.programme_id)).size} programmes - exact dates only where verified.</div>
          <div style={{ display: 'grid', gap: 14 }}>
            {[...new Set(d.programmes.map((p) => p.programme_id))].map((pid) => {
              const ms = d.programmes.filter((p) => p.programme_id === pid).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
              return (
                <div key={pid} style={{ ...card }}>
                  <div style={{ ...kick, marginBottom: 8 }}>{ms[0]?.programme || pid} · {ms.length} milestones</div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
                    {ms.map((x) => (
                      <li key={x.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 10, alignItems: 'baseline', fontSize: 12.5 }}>
                        <span style={{ color: 'var(--brass-cream, #E6D1A0)', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11.5 }}>{x.date}</span>
                        <span style={{ color: 'var(--text)' }}>{x.milestone}{x.indicative && <Ind n="" />}</span>
                        <span style={{ fontSize: 10.5, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{x.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'MRO' && (
        <div>
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-dim)' }}>{d.mro.length} MRO capabilities mapped - depot-level, engine and component repair across the fleet.</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {d.mro.map((x) => (
              <li key={x.id} style={{ ...card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{x.aircraft} · {x.organisation}</span>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{x.current_status}</span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--brass-cream, #E6D1A0)' }}>{x.mro_readiness_level}</span>
                    {x.indicative && <Ind />}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.55 }}>{[x.location, x.capability, x.engine_mro || ''].filter(Boolean).join(' · ')}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
