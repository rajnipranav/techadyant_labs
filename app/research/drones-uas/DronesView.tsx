'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Platform = { id: string; name: string; variant: string; category: string; origin: string; mfr: string; operator: string; mtow: number | null; payload: number | null; endurance: number | null; range: number | null; ceiling: number | null; speed: number | null; power: string; roles: string; sensors: string; payloads: string; ai: string; indig: number | null; status: string; inducted: string; inservice: number | null; unitcost: number | null; export: string; desc: string; conf: string };
type Company = { id: string; name: string; country: string; type: string; parent: string; hq: string; founded: string; products: string; indig: string; dgca: string; web: string };
type Procure = { id: string; platform: string; agency: string; qty: number | null; inr_cr: number | null; usd_m: number | null; date: string; delivery: string; method: string };
type Component = { id: string; name: string; type: string; mfr: string; supplier: string; specs: string; used_in: number };
type Sov = { rank: number; component: string; layer: string; india: number; china: number; importance: string; risk: number };
type Opp = { rank: number; opportunity: string; category: string; tam: string; capital: string; timeline: string; export: string; dosf: number; tier: string };
type Playbook = { venture: string; investment: string; talent: string; certification: string; regulation: string; margins: string; failure: string; edge: string };
type Row = Record<string, string>;
type Meta = { updated: string; platforms: number; companies: number; indianCompanies: number; procurementRows: number; procurementInrCr: number; components: number; sovereignty: number; criticalDeps: number; opportunities: number; buildNow: number; agencies: number; incidents: number; regulations: number; testingLabs: number; mro: number; training: number; corridors: number; parks: number; startups: number; byCategory: { c: string; n: number }[]; byRole: { r: string; n: number }[]; byTier: { t: string; n: number }[]; topOperators: { a: string; n: number }[]; procByYear: { year: string; inr_cr: number; n: number }[]; procByAgency: { agency: string; inr_cr: number; n: number }[] };
type Data = { meta: Meta; platforms: Platform[]; companies: Company[]; procurement: Procure[]; components: Component[]; sovereignty: Sov[]; opportunities: Opp[]; importDeps: Row[]; agencies: Row[]; incidents: Row[]; regulations: Row[]; standards: Row[]; testingLabs: Row[]; mro: Row[]; training: Row[]; corridors: Row[]; parks: Row[]; research: Row[]; universities: Row[]; startups: Row[]; investments: Row[]; payloads: Row[]; sensors: Row[]; software: Row[]; power: Row[]; comms: Row[]; playbooks: Playbook[]; certification: Row[] };

const REPORT: Record<string, { slug: string; title: string }> = {
  flagship: { slug: 'who-builds-indias-drones', title: 'Who Builds India’s Drones?' },
  propulsion: { slug: 'india-drone-propulsion-opportunity', title: 'India’s Drone Propulsion Opportunity' },
  battery: { slug: 'indias-drone-battery-ecosystem', title: 'India’s Drone Battery Ecosystem' },
  loiter: { slug: 'india-loitering-munitions-market', title: 'India’s Loitering Munitions Market' },
  cargo: { slug: 'india-cargo-drone-market', title: 'India’s Cargo Drone Market' },
  warfare: { slug: 'indias-unmanned-warfare-transformation', title: 'India’s Unmanned Warfare Transformation' },
  electronics: { slug: 'drone-electronics-flight-controllers', title: 'Who Controls India’s Drones?' },
  sensors: { slug: 'india-drone-sensors-payloads-imaging-market', title: 'India Drone Sensors & Payloads Market' },
  sme: { slug: 'the-sme-playbook-for-indias-drone-economy', title: 'The SME Playbook for India’s Drone Economy' },
};
function DeepDive({ k }: { k: keyof typeof REPORT }) {
  const r = REPORT[k];
  return <Link href={`/reports/${r.slug}/`} style={{ display: 'inline-block', fontSize: 12.5, color: 'var(--brass, #C9A84C)', textDecoration: 'none', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 999, padding: '4px 12px' }}>Deep dive: {r.title} →</Link>;
}
function catReport(cat: string): (keyof typeof REPORT) | null { const c = cat.toLowerCase(); if (c.includes('loiter')) return 'loiter'; if (c.includes('cargo')) return 'cargo'; return null; }
function subsystemReport(t: string): (keyof typeof REPORT) | null { const s = t.toLowerCase(); if (/engine|propuls|motor|propeller/.test(s)) return 'propulsion'; if (/batter|cell|power/.test(s)) return 'battery'; if (/flight controller|autopilot|avionic|fpga|processor|mcu|electronic/.test(s)) return 'electronics'; if (/camera|eo|ir|thermal|lidar|sensor|radar|payload|imag|sar/.test(s)) return 'sensors'; return null; }
function oppReport(o: Opp): (keyof typeof REPORT) | null { const s = `${o.opportunity} ${o.category}`.toLowerCase(); if (/engine|propuls/.test(s)) return 'propulsion'; if (/batter|cell|power|energy/.test(s)) return 'battery'; if (/sensor|payload|camera|eo|ir|imag|sar|lidar/.test(s)) return 'sensors'; if (/flight controller|autopilot|avionic|electronic|semiconductor|autonomy|software|vision/.test(s)) return 'electronics'; if (/loiter|munition/.test(s)) return 'loiter'; if (/cargo|logistic|delivery/.test(s)) return 'cargo'; return null; }

function ventureReport(v: string): (keyof typeof REPORT) { const x = v.toLowerCase(); if (/motor|propuls/.test(x)) return 'propulsion'; if (/batter/.test(x)) return 'battery'; if (/sensor|eo|ir/.test(x)) return 'sensors'; if (/counter/.test(x)) return 'warfare'; if (/\brf\b|communication/.test(x)) return 'electronics'; return 'flagship'; }
const TABS = ['Overview', 'Platforms', 'Procurement', 'Companies', 'Components', 'Opportunities', 'Playbook', 'Regulation', 'Ecosystem'] as const;
type Tab = typeof TABS[number];
function chip(a: boolean): React.CSSProperties { return { cursor: 'pointer', border: '1px solid var(--border, rgba(255,255,255,.16))', background: a ? 'var(--text, #e9e7e0)' : 'transparent', color: a ? 'var(--bg, #0b0b14)' : 'var(--text-dim, #9aa3b2)', borderRadius: 999, padding: '5px 13px', fontSize: 13, fontWeight: a ? 700 : 500, whiteSpace: 'nowrap' }; }
function tabBtn(a: boolean): React.CSSProperties { return { cursor: 'pointer', border: 'none', background: 'transparent', color: a ? 'var(--text, #e9e7e0)' : 'var(--text-dim, #9aa3b2)', fontSize: 14, fontWeight: a ? 700 : 500, padding: '9px 2px', borderBottom: a ? '2px solid var(--brass, #C9A84C)' : '2px solid transparent', whiteSpace: 'nowrap' }; }
const card: React.CSSProperties = { border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-2, rgba(255,255,255,.02))' };
const kick: React.CSSProperties = { fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--brass, #C9A84C)' };
const inr = (n: number | null) => (n == null ? '—' : `₹${Math.round(n).toLocaleString('en-IN')} cr`);
const spec = (v: number | null, u: string) => (v == null ? null : `${v.toLocaleString('en-IN')}${u}`);
function Spec({ v }: { v: string | null }) { if (!v) return null; return <span style={{ fontSize: 11.5, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-muted, #8a8a98)', border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 5, padding: '1px 7px' }}>{v}</span>; }
const tierColor = (t: string) => (t === 'Build-now' ? '#2BC5B4' : t === 'Position-early' ? '#C9A84C' : '#8C9AAE');

// Generic directory list
function Dir({ rows, title, name, meta, report }: { rows: Row[]; title: string; name: string; meta: (r: Row) => string; report?: keyof typeof REPORT }) {
  if (!rows.length) return null;
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ ...kick, marginBottom: 10 }}>{title} · {rows.length}{report ? '' : ''}</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
        {rows.map((r, i) => (
          <li key={i} style={{ ...card, padding: '11px 14px' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{r[name]}</span>
            <span style={{ fontSize: 12.5, color: 'var(--text-dim, #c7c7d2)' }}>{meta(r) ? `  —  ${meta(r)}` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DronesView({ data }: { data: Data }) {
  const { meta } = data;
  const [tab, setTab] = useState<Tab>('Overview');
  const [pcat, setPcat] = useState(''); const [prole, setProle] = useState(''); const [porigin, setPorigin] = useState('');
  const [corigin, setCorigin] = useState(''); const [ctype, setCtype] = useState(''); const [otier, setOtier] = useState('');
  const [sImp, setSImp] = useState(''); const [pagency, setPagency] = useState(''); const [q, setQ] = useState(''); const [limit, setLimit] = useState(60);
  const reset = () => setLimit(60);
  const go = (t: Tab) => { setTab(t); setQ(''); reset(); };

  const plats = useMemo(() => data.platforms.filter((p) => {
    if (pcat && p.category !== pcat) return false;
    if (prole && !p.roles.toLowerCase().includes(prole.toLowerCase())) return false;
    if (porigin === 'India' && p.origin !== 'India') return false;
    if (porigin === 'Foreign' && p.origin === 'India') return false;
    if (q && !`${p.name} ${p.variant} ${p.mfr} ${p.operator} ${p.roles}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [data.platforms, pcat, prole, porigin, q]);
  const cos = useMemo(() => data.companies.filter((x) => (corigin === 'India' ? x.country === 'India' : corigin === 'Foreign' ? x.country !== 'India' : true) && (!q || `${x.name} ${x.hq} ${x.products}`.toLowerCase().includes(q.toLowerCase()))), [data.companies, corigin, q]);
  const comps = useMemo(() => data.components.filter((x) => (!ctype || x.type === ctype) && (!q || `${x.name} ${x.supplier} ${x.specs}`.toLowerCase().includes(q.toLowerCase()))), [data.components, ctype, q]);
  const opps = useMemo(() => data.opportunities.filter((o) => (!otier || o.tier === otier) && (!q || o.opportunity.toLowerCase().includes(q.toLowerCase()))), [data.opportunities, otier, q]);
  const sov = useMemo(() => data.sovereignty.filter((s) => !sImp || s.importance === sImp), [data.sovereignty, sImp]);
  const proc = useMemo(() => data.procurement.filter((p) => !pagency || p.agency === pagency).sort((a, b) => (b.inr_cr || 0) - (a.inr_cr || 0)), [data.procurement, pagency]);
  const compTypes = useMemo(() => Array.from(new Set(data.components.map((c) => c.type).filter(Boolean))), [data.components]);
  const search = (ph: string) => <input placeholder={ph} value={q} onChange={(e) => { setQ(e.target.value); reset(); }} style={{ flex: '1 1 240px', maxWidth: 380, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '9px 12px', fontSize: 13.5 }} />;
  const more = (n: number, tot: number) => n < tot && <div style={{ textAlign: 'center', marginTop: 20 }}><button onClick={() => setLimit((l) => l + 60)} style={{ ...chip(false), padding: '9px 20px', fontSize: 14 }}>Show more ({tot - n})</button></div>;

  return (
    <>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 18, color: 'var(--text-muted, #9aa3b2)', fontSize: 13 }}>
        <span><strong style={{ color: 'var(--text)', fontSize: 16 }}>{meta.platforms}</strong> platforms</span>
        <span><strong style={{ color: 'var(--text)', fontSize: 16 }}>{meta.companies}</strong> companies <span style={{ color: 'var(--brass)' }}>({meta.indianCompanies} Indian)</span></span>
        <span><strong style={{ color: 'var(--brass)', fontSize: 16 }}>{inr(meta.procurementInrCr)}</strong> procured · {meta.procurementRows} contracts</span>
        <span><strong style={{ color: 'var(--text)' }}>{meta.opportunities}</strong> opportunities</span>
        <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12 }}>updated {meta.updated}</span>
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', borderBottom: '1px solid var(--border, rgba(255,255,255,.12))', marginBottom: 22 }}>
        {TABS.map((t) => <button key={t} style={tabBtn(tab === t)} onClick={() => go(t)}>{t}</button>)}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gap: 24 }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--text-dim, #c7c7d2)', maxWidth: 760 }}>India flies and assembles more drones than it builds. Across {meta.platforms} platforms and {meta.companies} companies, integration and operations are increasingly Indian — but propulsion, sensors, flight electronics and cells still come from abroad. This is the free, living map of that ecosystem, drawn from our drone research programme.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[['Platforms', meta.platforms, 'Platforms'], ['Procured', inr(meta.procurementInrCr), 'Procurement'], ['Build-now openings', meta.buildNow, 'Opportunities'], ['Critical import deps', meta.criticalDeps, 'Components']].map(([l, v, t]) => (
              <button key={l as string} onClick={() => go(t as Tab)} style={{ ...card, cursor: 'pointer', textAlign: 'left', minWidth: 150 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brass)' }}>{v}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{l}</div>
              </button>
            ))}
          </div>
          <div>
            <div style={{ ...kick, marginBottom: 10 }}>Platforms by class</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {meta.byCategory.slice(0, 9).map((c) => (
                <button key={c.c} onClick={() => { setPcat(c.c); go('Platforms'); }} style={{ display: 'grid', gridTemplateColumns: '170px 1fr 34px', gap: 10, alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{c.c}</span>
                  <span style={{ height: 10, borderRadius: 3, background: 'var(--brass)', opacity: 0.55, width: `${Math.round((c.n / meta.byCategory[0].n) * 100)}%` }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{c.n}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ ...kick, marginBottom: 10 }}>Who operates India&apos;s drones</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{meta.topOperators.map((o) => <span key={o.a} style={{ ...card, padding: '8px 12px', fontSize: 13 }}>{o.a} <span style={{ color: 'var(--brass)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{o.n}</span></span>)}</div>
          </div>
          <div style={{ ...card, padding: '16px 18px' }}>
            <div style={{ ...kick, marginBottom: 8 }}>The research behind this map</div>
            <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>The free surface of Techadyant&apos;s drone research programme — nine deep-dive reports on the industrial base beneath India&apos;s drone ambitions.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><DeepDive k="flagship" /><DeepDive k="warfare" /><DeepDive k="sme" /></div>
          </div>
        </div>
      )}

      {tab === 'Platforms' && (
        <>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <button style={chip(pcat === '')} onClick={() => { setPcat(''); reset(); }}>All classes</button>
            {meta.byCategory.map((c) => <button key={c.c} style={chip(pcat === c.c)} onClick={() => { setPcat(c.c); reset(); }}>{c.c} {c.n}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>Mission:</span>
            <button style={chip(prole === '')} onClick={() => { setProle(''); reset(); }}>Any</button>
            {meta.byRole.slice(0, 8).map((r) => <button key={r.r} style={chip(prole === r.r)} onClick={() => { setProle(r.r); reset(); }}>{r.r} {r.n}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            {['', 'India', 'Foreign'].map((o) => <button key={o || 'a'} style={chip(porigin === o)} onClick={() => { setPorigin(o); reset(); }}>{o === '' ? 'All origins' : o === 'India' ? 'Indian-origin' : 'Foreign-origin'}</button>)}
            {search('Search platform, maker, operator, mission…')}
          </div>
          {pcat && catReport(pcat) && <div style={{ marginBottom: 14 }}><DeepDive k={catReport(pcat)!} /></div>}
          <div style={{ ...kick, marginBottom: 12 }}>{plats.length} platforms</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {plats.slice(0, limit).map((p) => (
              <li key={p.id} style={card}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{p.name}</span>
                  {p.variant && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.variant}</span>}
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--brass)' }}>{p.category}</span>
                  <span style={{ fontSize: 11, color: p.origin === 'India' ? 'var(--brass)' : 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{p.origin}</span>
                  {p.status && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {p.status}</span>}
                  {p.indig != null && <span style={{ fontSize: 11, color: 'var(--brass)' }}>· {p.indig}% indigenous</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>{p.mfr}{p.operator ? ` · operated by ${p.operator}` : ''}{p.inservice ? ` · ${p.inservice} in service` : ''}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  <Spec v={spec(p.mtow, ' kg MTOW')} /><Spec v={spec(p.payload, ' kg payload')} /><Spec v={spec(p.endurance, ' hr')} />
                  <Spec v={spec(p.range, ' km')} /><Spec v={spec(p.ceiling, ' m ceiling')} /><Spec v={spec(p.speed, ' km/h')} />
                  <Spec v={p.power || null} />
                </div>
                {p.roles && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Roles: {p.roles}</div>}
              </li>
            ))}
          </ul>
          {more(Math.min(limit, plats.length), plats.length)}
        </>
      )}

      {tab === 'Procurement' && (
        <>
          <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 720 }}>{meta.procurementRows} disclosed contracts totalling <strong style={{ color: 'var(--brass)' }}>{inr(meta.procurementInrCr)}</strong>, ranked by value. India&apos;s drone build-out is demand-led and institutional.</p>
          <div style={{ marginBottom: 16 }}><DeepDive k="warfare" /></div>
          <div style={{ ...kick, marginBottom: 10 }}>Spend by year</div>
          <div style={{ display: 'grid', gap: 5, marginBottom: 22 }}>
            {meta.procByYear.map((y) => { const mx = Math.max(...meta.procByYear.map((z) => z.inr_cr)); return (
              <div key={y.year} style={{ display: 'grid', gridTemplateColumns: '46px 1fr 96px', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{y.year}</span>
                <span style={{ height: 10, borderRadius: 3, background: 'var(--brass)', opacity: .55, width: `${Math.round((y.inr_cr / mx) * 100)}%` }} />
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{inr(y.inr_cr)}</span>
              </div>); })}
          </div>
          <div style={{ ...kick, marginBottom: 10 }}>Top buyers by value</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            <button style={chip(pagency === '')} onClick={() => { setPagency(''); reset(); }}>All agencies</button>
            {meta.procByAgency.map((a) => <button key={a.agency} style={chip(pagency === a.agency)} onClick={() => { setPagency(a.agency); reset(); }}>{a.agency.length > 26 ? a.agency.slice(0, 26) + '…' : a.agency} · {inr(a.inr_cr)}</button>)}
          </div>
          <div style={{ ...kick, marginBottom: 12 }}>{pagency ? pagency : 'Largest'} contracts</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {proc.slice(0, limit).map((p) => (
              <li key={p.id} style={{ ...card, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div><div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{p.platform}</div><div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{p.agency}{p.qty ? ` · ${p.qty} units` : ''}{p.date ? ` · ${p.date.slice(0, 4)}` : ''}{p.delivery ? ` · ${p.delivery}` : ''}</div></div>
                <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 13.5, color: 'var(--brass)' }}>{inr(p.inr_cr)}</span>
              </li>
            ))}
          </ul>
          {more(Math.min(limit, proc.length), proc.length)}
        </>
      )}

      {tab === 'Companies' && (
        <>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            {['', 'India', 'Foreign'].map((o) => <button key={o || 'a'} style={chip(corigin === o)} onClick={() => setCorigin(o)}>{o === '' ? `All ${meta.companies}` : o === 'India' ? `Indian ${meta.indianCompanies}` : 'Foreign'}</button>)}
            {search('Search company, HQ, product…')}
          </div>
          <div style={{ ...kick, marginBottom: 12 }}>{cos.length} companies</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {cos.slice(0, limit).map((x) => (
              <li key={x.id} style={card}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{x.name}</span>
                  <span style={{ fontSize: 11, color: x.country === 'India' ? 'var(--brass)' : 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{x.country}</span>
                  {x.type && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {x.type}</span>}
                  {x.dgca && x.dgca.toLowerCase().startsWith('y') && <span style={{ fontSize: 11, color: 'var(--brass)' }}>· DGCA-certified</span>}
                </div>
                {x.products && <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>{x.products}</div>}
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{[x.hq, x.founded && `est. ${x.founded}`, x.indig && `${x.indig} indigenous`].filter(Boolean).join(' · ')}{x.web && <> · <a href={x.web.startsWith('http') ? x.web : `https://${x.web}`} target="_blank" rel="noreferrer" style={{ color: 'var(--link, #6cb0ff)' }}>site ↗</a></>}</div>
              </li>
            ))}
          </ul>
          {more(Math.min(limit, cos.length), cos.length)}
        </>
      )}

      {tab === 'Components' && (
        <>
          <div style={{ ...kick, marginBottom: 8 }}>Component Sovereignty Index — India vs China</div>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-dim)', maxWidth: 700 }}>{meta.criticalDeps} components are rated Critical dependencies. Each scored 0–100 on Indian vs Chinese capability.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {['', 'Critical', 'High', 'Medium'].map((im) => <button key={im || 'a'} style={chip(sImp === im)} onClick={() => setSImp(im)}>{im || 'All'}{im ? ` ${data.sovereignty.filter((s) => s.importance === im).length}` : ''}</button>)}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, marginBottom: 28 }}>
            {sov.map((s) => (
              <li key={s.rank} style={{ ...card, padding: '11px 14px' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{s.component}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.layer}</span>
                  <span style={{ fontSize: 11, color: s.importance === 'Critical' ? '#E24B4A' : 'var(--brass)' }}>{s.importance}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 60px 1fr', gap: 8, alignItems: 'center', marginTop: 8, fontSize: 11, fontFamily: 'var(--font-jetbrains, monospace)' }}>
                  <span style={{ color: 'var(--brass)' }}>India {s.india}</span>
                  <span style={{ height: 7, background: 'var(--brass)', borderRadius: 3, width: `${s.india}%`, opacity: .7 }} />
                  <span style={{ color: '#E24B4A' }}>China {s.china}</span>
                  <span style={{ height: 7, background: '#E24B4A', borderRadius: 3, width: `${s.china}%`, opacity: .55 }} />
                </div>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <button style={chip(ctype === '')} onClick={() => setCtype('')}>All component types</button>
            {compTypes.map((t) => <button key={t} style={chip(ctype === t)} onClick={() => setCtype(t)}>{t}</button>)}
          </div>
          {ctype && subsystemReport(ctype) && <div style={{ marginBottom: 12 }}><DeepDive k={subsystemReport(ctype)!} /></div>}
          <div style={{ ...kick, marginBottom: 12 }}>{comps.length} catalogued components</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, marginBottom: 26 }}>
            {comps.slice(0, limit).map((x) => (
              <li key={x.id} style={{ ...card, padding: '11px 14px' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{x.name}</span>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--brass)', marginLeft: 8 }}>{x.type}</span>
                {x.used_in > 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}> · in {x.used_in} platform{x.used_in > 1 ? 's' : ''}</span>}
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{x.supplier || x.mfr}{x.specs ? ` — ${x.specs}` : ''}</div>
              </li>
            ))}
          </ul>
          {more(Math.min(limit, comps.length), comps.length)}
          <Dir rows={data.payloads} title="Payloads" name="name" meta={(r) => [r.type, r.mfr, r.app].filter(Boolean).join(' · ')} />
          <Dir rows={data.sensors} title="Sensors" name="name" meta={(r) => [r.type, r.mfr, r.app].filter(Boolean).join(' · ')} />
          <Dir rows={data.software} title="Software & autonomy" name="name" meta={(r) => [r.cat, r.dev, r.lic].filter(Boolean).join(' · ')} />
          <Dir rows={data.power} title="Power systems" name="name" meta={(r) => [r.chem, r.mfr, r.cap].filter(Boolean).join(' · ')} />
          <Dir rows={data.comms} title="Communications" name="name" meta={(r) => [r.freq, r.enc, r.range].filter(Boolean).join(' · ')} />
          <div style={{ ...kick, marginBottom: 12 }}>Import dependencies</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {data.importDeps.map((d, i) => (
              <li key={i} style={{ ...card, padding: '11px 14px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)', minWidth: 160 }}>{d.item}</span>
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
          <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 720 }}>The 100 buildable openings in India&apos;s drone stack, scored on the DOSF framework and tiered <strong style={{ color: '#2BC5B4' }}>Build-now</strong> ({meta.buildNow}) / Position-early / Watch.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <button style={chip(otier === '')} onClick={() => { setOtier(''); reset(); }}>All {meta.opportunities}</button>
            {meta.byTier.map((t) => <button key={t.t} style={chip(otier === t.t)} onClick={() => { setOtier(t.t); reset(); }}>{t.t} {t.n}</button>)}
            {search('Search opportunity…')}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {opps.slice(0, limit).map((o) => {
              const rk = oppReport(o);
              return (
                <li key={o.rank} style={{ ...card, borderLeft: `3px solid ${tierColor(o.tier)}` }}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>#{o.rank}</span>
                    <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{o.opportunity}</span>
                    <span style={{ fontSize: 11, color: tierColor(o.tier), fontWeight: 700 }}>{o.tier}</span>
                    <span style={{ fontSize: 11, color: 'var(--brass)', fontFamily: 'var(--font-jetbrains, monospace)' }}>DOSF {o.dosf}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, alignItems: 'center' }}>
                    <Spec v={`${o.category}`} /><Spec v={`TAM ${o.tam}`} /><Spec v={`${o.capital} capital`} /><Spec v={`${o.timeline} yr`} /><Spec v={`${o.export} export`} />
                    {rk && <DeepDive k={rk} />}
                  </div>
                </li>
              );
            })}
          </ul>
          {more(Math.min(limit, opps.length), opps.length)}
          <div style={{ marginTop: 18 }}><DeepDive k="sme" /></div>
        </>
      )}

      {tab === 'Playbook' && (
        <>
          <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 720 }}>How to build each kind of drone venture in India — investment, talent, certification, margins, failure modes and the durable edge. A founder&apos;s and investor&apos;s operating manual from our drone research; figures are indicative bands.</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
            {data.playbooks.map((pb) => (
              <li key={pb.venture} style={card}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--text)' }}>{pb.venture}</span>
                  <DeepDive k={ventureReport(pb.venture)} />
                </div>
                <div style={{ display: 'grid', gap: 5, fontSize: 13, lineHeight: 1.5 }}>
                  {([['Investment', pb.investment], ['Talent', pb.talent], ['Certification', pb.certification], ['Regulation', pb.regulation], ['Margins', pb.margins], ['Failure modes', pb.failure], ['Edge that lasts', pb.edge]] as [string, string][]).filter(([, v]) => v).map(([l, v]) => (
                    <div key={l}><span style={{ color: 'var(--brass)', fontWeight: 600 }}>{l}:</span> <span style={{ color: 'var(--text-dim)' }}>{v}</span></div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 18 }}><DeepDive k="sme" /></div>
        </>
      )}

      {tab === 'Regulation' && (
        <>
          <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 720 }}>The rules, certifications and safety record governing India&apos;s drones — DGCA, QCI, and the incident record.</p>
          <div style={{ ...card, padding: '16px 18px', marginBottom: 26 }}>
            <div style={{ ...kick, marginBottom: 12 }}>Certification &amp; regulatory pathway</div>
            <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10 }}>
              {data.certification.map((st, i) => (
                <li key={i} style={{ fontSize: 13, lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{st.step}</span>
                  {st.body && <span style={{ color: 'var(--brass)' }}> · {st.body}</span>}
                  {st.detail && <div style={{ color: 'var(--text-dim)', marginTop: 2 }}>{st.detail}</div>}
                </li>
              ))}
            </ol>
          </div>
          <div style={{ ...kick, marginBottom: 12 }}>Regulations & policy · {data.regulations.length}</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10, marginBottom: 28 }}>
            {data.regulations.map((r, i) => (
              <li key={i} style={card}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{r.name}</span>
                  {r.auth && <span style={{ fontSize: 11, color: 'var(--brass)' }}>{r.auth}</span>}
                  {r.date && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{r.date}</span>}
                </div>
                {r.summary && <p style={{ margin: '5px 0 0', fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.5 }}>{r.summary}</p>}
                {r.url && <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, color: 'var(--link, #6cb0ff)' }}>document ↗</a>}
              </li>
            ))}
          </ul>
          <Dir rows={data.standards} title="Standards & certifications" name="name" meta={(r) => [r.auth, r.scope].filter(Boolean).join(' · ')} />
          <Dir rows={data.testingLabs} title="Testing & certification labs" name="name" meta={(r) => [r.loc, r.cap].filter(Boolean).join(' · ')} />
          <div style={{ ...kick, marginBottom: 12 }}>Incident record · {data.incidents.length}</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {data.incidents.slice(0, limit).map((n, i) => (
              <li key={i} style={{ ...card, padding: '11px 14px' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{n.type || 'Incident'}</span>
                  {n.date && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{n.date}</span>}
                  {n.loc && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {n.loc}</span>}
                </div>
                {n.desc && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{n.desc}</div>}
              </li>
            ))}
          </ul>
          {more(Math.min(limit, data.incidents.length), data.incidents.length)}
        </>
      )}

      {tab === 'Ecosystem' && (
        <>
          <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 720 }}>The supporting ecosystem — where drones are serviced, tested, funded, taught and clustered.</p>
          <Dir rows={data.mro} title="MRO & servicing" name="name" meta={(r) => [r.loc, r.cap].filter(Boolean).join(' · ')} />
          <Dir rows={data.training} title="Training centres & RPTOs" name="name" meta={(r) => [r.loc, r.courses].filter(Boolean).join(' · ')} />
          <Dir rows={data.corridors} title="Drone corridors" name="name" meta={(r) => [r.state, r.purpose].filter(Boolean).join(' · ')} />
          <Dir rows={data.parks} title="Industrial parks & clusters" name="name" meta={(r) => [r.state, r.focus].filter(Boolean).join(' · ')} />
          <Dir rows={data.research} title="Research institutes" name="name" meta={(r) => [r.focus, r.loc].filter(Boolean).join(' · ')} />
          <Dir rows={data.universities} title="Universities & programmes" name="name" meta={(r) => [r.programs, r.loc].filter(Boolean).join(' · ')} />
          <Dir rows={data.startups} title="Startups" name="name" meta={(r) => [r.focus, r.hq, r.stage].filter(Boolean).join(' · ')} />
          <Dir rows={data.investments} title="Investments" name="investor" meta={(r) => [r.company, r.amount, r.year].filter(Boolean).join(' · ')} />
        </>
      )}
    </>
  );
}
