'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Platform = { id: string; name: string; variant: string; category: string; origin: string; mfr: string; operator: string; status: string; indigenous: string; role: string };
type Company = { id: string; name: string; country: string; type: string; parent: string; hq: string; founded: string };
type Procure = { id: string; platform: string; agency: string; qty: number | null; inr_cr: number | null; usd_m: number | null; date: string };
type Component = { id: string; name: string; type: string; mfr: string; supplier: string; specs: string; used_in: number };
type Opportunity = { opportunity: string; gap: string; market: string; priority: string };
type ImportDep = { item: string; from: string; alt: string; risk: string };
type Meta = {
  updated: string; platforms: number; companies: number; indianCompanies: number;
  procurementRows: number; procurementInrCr: number; components: number; agencies: number;
  opportunities: number; importDeps: number; relationships: number;
  byCategory: { c: string; n: number }[]; topOperators: { a: string; n: number }[];
};
type Data = { meta: Meta; platforms: Platform[]; companies: Company[]; procurement: Procure[]; components: Component[]; opportunities: Opportunity[]; importDeps: ImportDep[] };

// Published reports — the paid deep-dives this free surface draws from.
const REPORT: Record<string, { slug: string; title: string }> = {
  flagship:    { slug: 'who-builds-indias-drones',                 title: 'Who Builds India’s Drones?' },
  propulsion:  { slug: 'india-drone-propulsion-opportunity',       title: 'India’s Drone Propulsion Opportunity' },
  battery:     { slug: 'indias-drone-battery-ecosystem',           title: 'India’s Drone Battery Ecosystem' },
  loiter:      { slug: 'india-loitering-munitions-market',         title: 'India’s Loitering Munitions Market' },
  cargo:       { slug: 'india-cargo-drone-market',                 title: 'India’s Cargo Drone Market' },
  warfare:     { slug: 'indias-unmanned-warfare-transformation',   title: 'India’s Unmanned Warfare Transformation' },
  electronics: { slug: 'drone-electronics-flight-controllers',     title: 'Who Controls India’s Drones?' },
  sensors:     { slug: 'india-drone-sensors-payloads-imaging-market', title: 'India Drone Sensors & Payloads Market' },
  sme:         { slug: 'the-sme-playbook-for-indias-drone-economy', title: 'The SME Playbook for India’s Drone Economy' },
};
function DeepDive({ k }: { k: keyof typeof REPORT }) {
  const r = REPORT[k];
  return (
    <Link href={`/reports/${r.slug}/`} style={{ display: 'inline-block', fontSize: 12.5, color: 'var(--brass, #C9A84C)', textDecoration: 'none', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 999, padding: '4px 12px' }}>
      Deep dive: {r.title} →
    </Link>
  );
}
// natural mappings — only surfaced when a filter genuinely matches a report
function categoryReport(cat: string): (keyof typeof REPORT) | null {
  const c = cat.toLowerCase();
  if (c.includes('loiter')) return 'loiter';
  if (c.includes('cargo')) return 'cargo';
  return null;
}
function componentReport(type: string): (keyof typeof REPORT) | null {
  const t = type.toLowerCase();
  if (/engine|propuls|motor|propeller/.test(t)) return 'propulsion';
  if (/batter|cell|power/.test(t)) return 'battery';
  if (/flight controller|autopilot|avionic|fpga|processor|mcu|electronic/.test(t)) return 'electronics';
  if (/camera|eo|ir|thermal|lidar|sensor|radar|payload|imag|sar/.test(t)) return 'sensors';
  return null;
}
function opportunityReport(o: Opportunity): (keyof typeof REPORT) | null {
  const s = `${o.opportunity} ${o.gap}`.toLowerCase();
  if (/engine|propuls/.test(s)) return 'propulsion';
  if (/batter|cell|energy/.test(s)) return 'battery';
  if (/sensor|payload|camera|eo\/ir|imag|sar|lidar/.test(s)) return 'sensors';
  if (/flight controller|autopilot|avionic|electronic|semiconductor/.test(s)) return 'electronics';
  if (/loiter|munition/.test(s)) return 'loiter';
  if (/cargo|logistic|delivery/.test(s)) return 'cargo';
  return null;
}

const TABS = ['Overview', 'Platforms', 'Procurement', 'Companies', 'Components', 'Opportunities'] as const;
type Tab = typeof TABS[number];

function chip(active: boolean): React.CSSProperties {
  return { cursor: 'pointer', border: '1px solid var(--border, rgba(255,255,255,.16))', background: active ? 'var(--text, #e9e7e0)' : 'transparent', color: active ? 'var(--bg, #0b0b14)' : 'var(--text-dim, #9aa3b2)', borderRadius: 999, padding: '5px 13px', fontSize: 13, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap' };
}
function tabBtn(active: boolean): React.CSSProperties {
  return { cursor: 'pointer', border: 'none', background: 'transparent', color: active ? 'var(--text, #e9e7e0)' : 'var(--text-dim, #9aa3b2)', fontSize: 14.5, fontWeight: active ? 700 : 500, padding: '9px 2px', borderBottom: active ? '2px solid var(--brass, #C9A84C)' : '2px solid transparent', whiteSpace: 'nowrap' };
}
const inr = (n: number | null) => (n == null ? '—' : `₹${Math.round(n).toLocaleString('en-IN')} cr`);
const card: React.CSSProperties = { border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-2, rgba(255,255,255,.02))' };

export function DronesView({ data }: { data: Data }) {
  const { meta, platforms, companies, procurement, components, opportunities, importDeps } = data;
  const [tab, setTab] = useState<Tab>('Overview');
  const [pcat, setPcat] = useState('');
  const [porigin, setPorigin] = useState('');
  const [ctype, setCtype] = useState('');
  const [corigin, setCorigin] = useState('');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(60);

  const goPlatforms = (cat: string) => { setPcat(cat); setPorigin(''); setQ(''); setLimit(60); setTab('Platforms'); };

  const plats = useMemo(() => platforms.filter((p) => {
    if (pcat && p.category !== pcat) return false;
    if (porigin === 'India' && p.origin !== 'India') return false;
    if (porigin === 'Foreign' && p.origin === 'India') return false;
    if (q && !`${p.name} ${p.variant} ${p.mfr} ${p.operator}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [platforms, pcat, porigin, q]);

  const comps = useMemo(() => components.filter((c) => {
    if (ctype && c.type !== ctype) return false;
    if (q && !`${c.name} ${c.mfr} ${c.supplier} ${c.specs}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [components, ctype, q]);

  const cos = useMemo(() => companies.filter((c) => {
    if (corigin === 'India' && c.country !== 'India') return false;
    if (corigin === 'Foreign' && c.country === 'India') return false;
    if (q && !`${c.name} ${c.country} ${c.type} ${c.hq}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [companies, corigin, q]);

  const procSorted = useMemo(() => [...procurement].sort((a, b) => (b.inr_cr || 0) - (a.inr_cr || 0)), [procurement]);
  const compTypes = useMemo(() => Array.from(new Set(components.map((c) => c.type).filter(Boolean))), [components]);

  return (
    <>
      {/* stat strip */}
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 18, color: 'var(--text-muted, #9aa3b2)', fontSize: 13 }}>
        <span><strong style={{ color: 'var(--text)', fontSize: 16 }}>{meta.platforms}</strong> platforms</span>
        <span><strong style={{ color: 'var(--text)', fontSize: 16 }}>{meta.companies}</strong> companies <span style={{ color: 'var(--brass)' }}>({meta.indianCompanies} Indian)</span></span>
        <span><strong style={{ color: 'var(--brass)', fontSize: 16 }}>{inr(meta.procurementInrCr)}</strong> procured · {meta.procurementRows} contracts</span>
        <span><strong style={{ color: 'var(--text)' }}>{meta.agencies}</strong> operators</span>
        <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12 }}>updated {meta.updated}</span>
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', borderBottom: '1px solid var(--border, rgba(255,255,255,.12))', marginBottom: 20 }}>
        {TABS.map((t) => <button key={t} style={tabBtn(tab === t)} onClick={() => { setTab(t); setLimit(60); }}>{t}</button>)}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gap: 22 }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--text-dim, #c7c7d2)', maxWidth: 760 }}>
            India flies and assembles more drones than it builds. Across {meta.platforms} platforms and {meta.companies} companies,
            the integration and operations layers are increasingly Indian — but propulsion, sensors, flight electronics and cells
            still come from abroad. This is the free map of that ecosystem, drawn from our drone research programme.
          </p>
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Platforms by class</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {meta.byCategory.slice(0, 9).map((c) => {
                const w = Math.round((c.n / meta.byCategory[0].n) * 100);
                return (
                  <button key={c.c} onClick={() => goPlatforms(c.c)} style={{ display: 'grid', gridTemplateColumns: '170px 1fr 34px', gap: 10, alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-dim, #c7c7d2)' }}>{c.c}</span>
                    <span style={{ height: 10, borderRadius: 3, background: 'var(--brass, #C9A84C)', opacity: 0.55, width: `${w}%` }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{c.n}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Who operates India&apos;s drones</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {meta.topOperators.map((o) => (
                <span key={o.a} style={{ ...card, padding: '8px 12px', fontSize: 13 }}>{o.a} <span style={{ color: 'var(--brass)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{o.n}</span></span>
              ))}
            </div>
          </div>
          <div style={{ ...card, padding: '16px 18px' }}>
            <div className="ed-kicker" style={{ marginBottom: 8 }}>The research behind this map</div>
            <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--text-dim, #c7c7d2)', lineHeight: 1.6 }}>
              This section is the free, living surface of Techadyant&apos;s drone research programme — nine deep-dive reports on the
              industrial base beneath India&apos;s drone ambitions.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <DeepDive k="flagship" />
              <DeepDive k="warfare" />
              <DeepDive k="sme" />
            </div>
          </div>
        </div>
      )}

      {tab === 'Platforms' && (
        <>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <button style={chip(pcat === '')} onClick={() => { setPcat(''); setLimit(60); }}>All classes</button>
            {meta.byCategory.map((c) => <button key={c.c} style={chip(pcat === c.c)} onClick={() => { setPcat(c.c); setLimit(60); }}>{c.c} {c.n}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            {['', 'India', 'Foreign'].map((o) => <button key={o || 'all'} style={chip(porigin === o)} onClick={() => { setPorigin(o); setLimit(60); }}>{o === '' ? 'All origins' : o === 'India' ? 'Indian-origin' : 'Foreign-origin'}</button>)}
            <input placeholder="Search platform, maker, operator…" value={q} onChange={(e) => { setQ(e.target.value); setLimit(60); }} style={{ flex: '1 1 240px', maxWidth: 360, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '8px 11px', fontSize: 13 }} />
          </div>
          {pcat && categoryReport(pcat) && <div style={{ marginBottom: 14 }}><DeepDive k={categoryReport(pcat)!} /></div>}
          <div className="ed-kicker" style={{ marginBottom: 12 }}>{plats.length} platforms</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {plats.slice(0, limit).map((p) => (
              <li key={p.id} style={card}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{p.name}</span>
                  {p.variant && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.variant}</span>}
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--brass, #C9A84C)' }}>{p.category}</span>
                  <span style={{ fontSize: 11, color: p.origin === 'India' ? 'var(--brass)' : 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{p.origin}</span>
                  {p.status && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {p.status}</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-dim, #c7c7d2)', marginTop: 3 }}>{p.mfr}{p.operator ? ` · operated by ${p.operator}` : ''}</div>
              </li>
            ))}
          </ul>
          {limit < plats.length && <div style={{ textAlign: 'center', marginTop: 20 }}><button onClick={() => setLimit((l) => l + 60)} style={{ ...chip(false), padding: '9px 20px', fontSize: 14 }}>Show more ({plats.length - limit})</button></div>}
        </>
      )}

      {tab === 'Procurement' && (
        <>
          <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--text-dim, #c7c7d2)', lineHeight: 1.6, maxWidth: 720 }}>
            {meta.procurementRows} disclosed contracts totalling <strong style={{ color: 'var(--brass)' }}>{inr(meta.procurementInrCr)}</strong>, ranked by value.
            The demand engine for India&apos;s drone build-out is institutional.
          </p>
          <div style={{ marginBottom: 16 }}><DeepDive k="warfare" /></div>
          <div className="ed-kicker" style={{ marginBottom: 12 }}>Largest contracts</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {procSorted.slice(0, limit).map((p) => (
              <li key={p.id} style={{ ...card, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{p.platform}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{p.agency}{p.qty ? ` · ${p.qty} units` : ''}{p.date ? ` · ${p.date.slice(0, 4)}` : ''}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 13.5, color: 'var(--brass)' }}>{inr(p.inr_cr)}</span>
              </li>
            ))}
          </ul>
          {limit < procSorted.length && <div style={{ textAlign: 'center', marginTop: 20 }}><button onClick={() => setLimit((l) => l + 60)} style={{ ...chip(false), padding: '9px 20px', fontSize: 14 }}>Show more ({procSorted.length - limit})</button></div>}
        </>
      )}

      {tab === 'Companies' && (
        <>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            {['', 'India', 'Foreign'].map((o) => <button key={o || 'all'} style={chip(corigin === o)} onClick={() => setCorigin(o)}>{o === '' ? `All ${meta.companies}` : o === 'India' ? `Indian ${meta.indianCompanies}` : 'Foreign'}</button>)}
            <input placeholder="Search company or HQ…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 240px', maxWidth: 360, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '8px 11px', fontSize: 13 }} />
          </div>
          <div className="ed-kicker" style={{ marginBottom: 12 }}>{cos.length} companies</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {cos.slice(0, limit).map((c) => (
              <li key={c.id} style={card}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: c.country === 'India' ? 'var(--brass)' : 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{c.country}</span>
                  {c.type && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {c.type}</span>}
                </div>
                {(c.hq || c.founded) && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{c.hq}{c.founded ? ` · est. ${c.founded}` : ''}</div>}
              </li>
            ))}
          </ul>
          {limit < cos.length && <div style={{ textAlign: 'center', marginTop: 20 }}><button onClick={() => setLimit((l) => l + 60)} style={{ ...chip(false), padding: '9px 20px', fontSize: 14 }}>Show more ({cos.length - limit})</button></div>}
        </>
      )}

      {tab === 'Components' && (
        <>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <button style={chip(ctype === '')} onClick={() => setCtype('')}>All types</button>
            {compTypes.map((t) => <button key={t} style={chip(ctype === t)} onClick={() => setCtype(t)}>{t}</button>)}
          </div>
          {ctype && componentReport(ctype) && <div style={{ marginBottom: 14 }}><DeepDive k={componentReport(ctype)!} /></div>}
          <input placeholder="Search component, maker, spec…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '100%', maxWidth: 420, marginBottom: 16, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '9px 12px', fontSize: 13 }} />
          <div className="ed-kicker" style={{ marginBottom: 12 }}>{comps.length} components</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10, marginBottom: 26 }}>
            {comps.slice(0, limit).map((c) => (
              <li key={c.id} style={card}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{c.name}</span>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--brass, #C9A84C)' }}>{c.type}</span>
                  {c.used_in > 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· used in {c.used_in} platform{c.used_in > 1 ? 's' : ''}</span>}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{c.supplier || c.mfr}{c.specs ? ` — ${c.specs}` : ''}</div>
              </li>
            ))}
          </ul>
          {limit < comps.length && <div style={{ textAlign: 'center', margin: '0 0 26px' }}><button onClick={() => setLimit((l) => l + 60)} style={{ ...chip(false), padding: '9px 20px', fontSize: 14 }}>Show more ({comps.length - limit})</button></div>}
          <div className="ed-kicker" style={{ marginBottom: 12 }}>Import dependencies</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {importDeps.map((d) => (
              <li key={d.item} style={{ ...card, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', minWidth: 160 }}>{d.item}</span>
                <span style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>from {d.from}</span>
                {d.alt && <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>· alt: {d.alt}</span>}
                {d.risk && <span style={{ fontSize: 11, color: 'var(--brass)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{d.risk} risk</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'Opportunities' && (
        <>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--text-dim, #c7c7d2)', lineHeight: 1.6, maxWidth: 720 }}>
            Where the gaps in the drone stack become buildable opportunities — the layers India imports today and could own tomorrow.
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
            {opportunities.map((o) => {
              const rk = opportunityReport(o);
              return (
                <li key={o.opportunity} style={card}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{o.opportunity}</span>
                    {o.priority && <span style={{ fontSize: 11, color: 'var(--brass)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{o.priority} priority</span>}
                    {o.market && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {o.market}</span>}
                  </div>
                  {o.gap && <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.55 }}>{o.gap}</p>}
                  {rk && <DeepDive k={rk} />}
                </li>
              );
            })}
          </ul>
          <div style={{ marginTop: 18 }}><DeepDive k="sme" /></div>
        </>
      )}
    </>
  );
}
