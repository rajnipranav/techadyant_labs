'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type System = { id: string; slug: string; name: string; variant: string; mfr: string; country: string; indig: number | null; makeInIndia: string; classification: string; domain: string; mobility: string; kill: string[]; counters: string[]; detRange: number | null; neutRange: number | null; reaction: number | null; simTargets: number | null; ai: boolean; fusion: boolean; swarmDet: string; status: string; year: string };
type Mfr = { id: string; slug: string; name: string; hq: string; country: string; founded: string; portfolio: string; indigenous: string };
type Dep = { id: string; system: string; location: string; state: string; agency: string; purpose: string; since: string; status: string; lat: number | null; lng: number | null };
type Row = Record<string, string>;
type Intel = { topic: string; china: string; semi: string; ai: string; swarm: string; ew: string; gps: string; trl: string; indig: string };
type Meta = { updated: string; systems: number; indianSystems: number; manufacturers: number; indianManufacturers: number; agencies: number; deployments: number; procurementCr: number; procurementRows: number; components: number; criticalComponents: number; technologies: number; incidents: number; avgIndigenous: number; byClassification: { c: string; n: number }[]; byMobility: { c: string; n: number }[]; byState: { c: string; n: number }[]; killLayers: { layer: string; n: number }[]; topManufacturers: { m: string; n: number }[] };
type Data = { meta: Meta; systems: System[]; manufacturers: Mfr[]; deployments: Dep[]; procurement: Row[]; components: Row[]; technologies: Row[]; detection: Row[]; tracking: Row[]; identification: Row[]; softkill: Row[]; hardkill: Row[]; dew: Row[]; interceptors: Row[]; regulations: Row[]; trials: Row[]; incidents: Row[]; intel: Intel[] };

const TABS = ['Overview', 'Systems', 'Kill Chain', 'Deployments', 'Manufacturers', 'Procurement', 'Components', 'Technology', 'Regulation', 'Incidents'] as const;
type Tab = typeof TABS[number];
function chip(a: boolean): React.CSSProperties { return { cursor: 'pointer', border: '1px solid var(--border, rgba(255,255,255,.16))', background: a ? 'var(--text, #e9e7e0)' : 'transparent', color: a ? 'var(--bg, #0b0b14)' : 'var(--text-dim, #9aa3b2)', borderRadius: 999, padding: '5px 13px', fontSize: 13, fontWeight: a ? 700 : 500, whiteSpace: 'nowrap' }; }
function tabBtn(a: boolean): React.CSSProperties { return { cursor: 'pointer', border: 'none', background: 'transparent', color: a ? 'var(--text, #e9e7e0)' : 'var(--text-dim, #9aa3b2)', fontSize: 14, fontWeight: a ? 700 : 500, padding: '9px 2px', borderBottom: a ? '2px solid var(--brass, #C9A84C)' : '2px solid transparent', whiteSpace: 'nowrap' }; }
const card: React.CSSProperties = { border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-2, rgba(255,255,255,.02))' };
const kick: React.CSSProperties = { fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--brass, #C9A84C)' };
const REPORT = { slug: 'indias-unmanned-warfare-transformation', title: 'India’s Unmanned Warfare Transformation' };
function DeepDive() { return <Link href={`/reports/${REPORT.slug}/`} style={{ display: 'inline-block', fontSize: 12.5, color: 'var(--brass, #C9A84C)', textDecoration: 'none', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 999, padding: '4px 12px' }}>Deep dive: {REPORT.title} →</Link>; }

// India equirectangular projection (coarse mainland silhouette, self-contained)
const OUTLINE: [number, number][] = [[35.5,77],[34,78.8],[32.7,79.2],[30.4,81],[30,81.4],[28.2,84],[27.9,88.2],[27.2,88.9],[26.5,89.7],[25,89.9],[24,88.2],[22.2,88.9],[21.6,87.2],[19.8,85.8],[17.7,83.3],[15.9,80.3],[13.1,80.3],[10.3,79.9],[8,77.5],[8.4,76.9],[9.9,76.2],[12.8,74.8],[15,73.9],[19,72.8],[20.8,72.6],[22.4,69],[23.7,68.2],[24.7,71],[25.4,70.6],[27.9,70.9],[30.2,74.3],[32.3,75.1],[34.3,74],[35.5,77]];
const LAT0 = 37.5, LAT1 = 6, LNG0 = 67.5, LNG1 = 98, W = 300, H = 330;
const px = (lng: number) => ((lng - LNG0) / (LNG1 - LNG0)) * W;
const py = (lat: number) => ((LAT0 - lat) / (LAT0 - LAT1)) * H;
function DeployMap({ deps }: { deps: Dep[] }) {
  const path = 'M ' + OUTLINE.map(([la, ln]) => `${px(ln).toFixed(1)} ${py(la).toFixed(1)}`).join(' L ') + ' Z';
  const pts = deps.filter((d) => d.lat && d.lng);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 380, height: 'auto', display: 'block' }} role="img" aria-label="Counter-UAS deployment map of India">
      <path d={path} fill="rgba(255,255,255,.03)" stroke="var(--border, rgba(255,255,255,.22))" strokeWidth="1" />
      {pts.map((d, i) => (
        <circle key={i} cx={px(d.lng as number)} cy={py(d.lat as number)} r="3.4" fill={d.status.toLowerCase().includes('oper') ? '#2BC5B4' : '#C9A84C'} fillOpacity="0.85" stroke="var(--bg, #0b0b14)" strokeWidth="0.6">
          <title>{d.system} — {d.location}, {d.state} ({d.status})</title>
        </circle>
      ))}
    </svg>
  );
}
function Dir({ rows, title, name, meta }: { rows: Row[]; title: string; name: string; meta: (r: Row) => string }) {
  if (!rows.length) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ ...kick, marginBottom: 10 }}>{title} · {rows.length}</div>
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

export function CuasView({ data }: { data: Data }) {
  const { meta } = data;
  const [tab, setTab] = useState<Tab>('Overview');
  const [sclass, setSclass] = useState(''); const [sindia, setSindia] = useState(false); const [q, setQ] = useState('');
  const [limit, setLimit] = useState(60);
  const reset = () => setLimit(60);

  const sys = useMemo(() => data.systems.filter((s) => {
    if (sclass && s.classification !== sclass) return false;
    if (sindia && s.country !== 'India') return false;
    if (q && !`${s.name} ${s.mfr} ${s.counters.join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [data.systems, sclass, sindia, q]);
  const proc = useMemo(() => [...data.procurement].sort((a, b) => (Number(b.inr_cr) || 0) - (Number(a.inr_cr) || 0)), [data.procurement]);

  return (
    <>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 18, color: 'var(--text-muted, #9aa3b2)', fontSize: 13 }}>
        <span><strong style={{ color: 'var(--text)', fontSize: 16 }}>{meta.systems}</strong> systems <span style={{ color: 'var(--brass)' }}>({meta.indianSystems} Indian)</span></span>
        <span><strong style={{ color: 'var(--text)' }}>{meta.manufacturers}</strong> makers</span>
        <span><strong style={{ color: 'var(--brass)', fontSize: 16 }}>₹{meta.procurementCr.toLocaleString('en-IN')} cr</strong> procured</span>
        <span><strong style={{ color: 'var(--text)' }}>{meta.deployments}</strong> deployments</span>
        <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12 }}>updated {meta.updated}</span>
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', borderBottom: '1px solid var(--border, rgba(255,255,255,.12))', marginBottom: 22 }}>
        {TABS.map((t) => <button key={t} style={tabBtn(tab === t)} onClick={() => { setTab(t); reset(); }}>{t}</button>)}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gap: 24 }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--text-dim, #c7c7d2)', maxWidth: 760 }}>India&apos;s counter-drone build-out — the systems, sensors and effectors defending against the drone threat that Op Sindoor made urgent. {meta.systems} systems from {meta.manufacturers} makers, {meta.avgIndigenous}% average indigenous content on Indian systems, deployed across {meta.byState.length}+ states. The companion to the <Link href="/research/drones-uas/" style={{ color: 'var(--brass)' }}>Drone Atlas</Link>.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[['Systems', meta.systems, 'Systems'], ['Procured', `₹${meta.procurementCr.toLocaleString('en-IN')} cr`, 'Procurement'], ['Deployments', meta.deployments, 'Deployments'], ['Critical import deps', meta.criticalComponents, 'Components']].map(([l, v, t]) => (
              <button key={l as string} onClick={() => { setTab(t as Tab); reset(); }} style={{ ...card, cursor: 'pointer', textAlign: 'left', minWidth: 150 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brass)' }}>{v}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{l}</div>
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <div>
              <div style={{ ...kick, marginBottom: 10 }}>The defeat layer</div>
              <div style={{ display: 'grid', gap: 6 }}>
                {meta.killLayers.map((k) => (
                  <div key={k.layer} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 28px', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{k.layer}</span>
                    <span style={{ height: 10, borderRadius: 3, background: 'var(--brass)', opacity: .55, width: `${Math.round((k.n / Math.max(...meta.killLayers.map((z) => z.n))) * 100)}%` }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{k.n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ ...kick, marginBottom: 10 }}>Deployment map</div>
              <DeployMap deps={data.deployments} />
            </div>
          </div>
          <div style={{ ...card, padding: '16px 18px' }}>
            <div style={{ ...kick, marginBottom: 8 }}>The research behind this map</div>
            <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Counter-UAS is one of the fastest-moving areas of Indian defence procurement. The deep-dive analysis sits in our unmanned-warfare research.</p>
            <DeepDive />
          </div>
        </div>
      )}

      {tab === 'Systems' && (
        <>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <button style={chip(sclass === '')} onClick={() => { setSclass(''); reset(); }}>All classes</button>
            {meta.byClassification.map((c) => <button key={c.c} style={chip(sclass === c.c)} onClick={() => { setSclass(c.c); reset(); }}>{c.c} {c.n}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            <button style={chip(sindia)} onClick={() => { setSindia((v) => !v); reset(); }}>{sindia ? '✓ ' : ''}Indian-made {meta.indianSystems}</button>
            <input placeholder="Search system, maker, drone class countered…" value={q} onChange={(e) => { setQ(e.target.value); reset(); }} style={{ flex: '1 1 260px', maxWidth: 400, background: 'var(--bg-2, rgba(255,255,255,.03))', color: 'var(--text)', border: '1px solid var(--border, rgba(255,255,255,.16))', borderRadius: 8, padding: '9px 12px', fontSize: 13.5 }} />
          </div>
          <div style={{ ...kick, marginBottom: 12 }}>{sys.length} systems</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {sys.slice(0, limit).map((s) => (
              <li key={s.id} style={card}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <Link href={`/research/counter-uas/system/${s.slug}/`} style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', textDecoration: 'none' }}>{s.name}</Link>
                  {s.variant && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.variant}</span>}
                  <span style={{ fontSize: 11, color: s.country === 'India' ? 'var(--brass)' : 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{s.country}</span>
                  {s.indig != null && <span style={{ fontSize: 11, color: 'var(--brass)' }}>· {s.indig}% indig</span>}
                  {s.status && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {s.status}</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>{s.mfr}{s.classification ? ` · ${s.classification}` : ''}{s.mobility ? ` · ${s.mobility}` : ''}</div>
                {s.kill.length > 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Kill chain: {s.kill.join(' › ')}</div>}
                {s.counters.length > 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Counters: {s.counters.join(', ')}</div>}
              </li>
            ))}
          </ul>
          {limit < sys.length && <div style={{ textAlign: 'center', marginTop: 20 }}><button onClick={() => setLimit((l) => l + 60)} style={{ ...chip(false), padding: '9px 20px', fontSize: 14 }}>Show more ({sys.length - limit})</button></div>}
        </>
      )}

      {tab === 'Kill Chain' && (
        <>
          <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 720 }}>The counter-UAS kill chain — detect, track and identify the threat, then defeat it by soft-kill (jamming/spoofing), hard-kill (kinetic), directed energy, or interceptor drone.</p>
          <Dir rows={data.detection} title="Detection sensors" name="name" meta={(r) => [r.mfr, r.country, r.principle, r.range && `${r.range} km`].filter(Boolean).join(' · ')} />
          <Dir rows={data.tracking} title="Tracking systems" name="name" meta={(r) => [r.mfr, r.country, r.accuracy].filter(Boolean).join(' · ')} />
          <Dir rows={data.identification} title="Identification" name="name" meta={(r) => [r.mfr, r.method, r.accuracy].filter(Boolean).join(' · ')} />
          <Dir rows={data.softkill} title="Soft-kill (RF / jamming / spoofing)" name="name" meta={(r) => [r.mfr, r.type, r.range && `${r.range} km`, r.bands].filter(Boolean).join(' · ')} />
          <Dir rows={data.hardkill} title="Hard-kill (kinetic)" name="name" meta={(r) => [r.mfr, r.type, r.range && `${r.range} km`, r.kp && `${r.kp}% Pk`].filter(Boolean).join(' · ')} />
          <Dir rows={data.dew} title="Directed-energy weapons" name="name" meta={(r) => [r.mfr, r.type, r.power && `${r.power} kW`, r.range && `${r.range} km`].filter(Boolean).join(' · ')} />
          <Dir rows={data.interceptors} title="Interceptor drones" name="name" meta={(r) => [r.mfr, r.speed && `${r.speed} km/h`, r.capture].filter(Boolean).join(' · ')} />
        </>
      )}

      {tab === 'Deployments' && (
        <div style={{ display: 'grid', gap: 22 }}>
          <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start' }}>
            <div><div style={{ ...kick, marginBottom: 10 }}>{data.deployments.length} deployments across India</div><DeployMap deps={data.deployments} /></div>
            <div>
              <div style={{ ...kick, marginBottom: 10 }}>By state</div>
              <div style={{ display: 'grid', gap: 5 }}>
                {meta.byState.map((s) => (
                  <div key={s.c} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 28px', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{s.c}</span>
                    <span style={{ height: 9, borderRadius: 3, background: 'var(--brass)', opacity: .55, width: `${Math.round((s.n / meta.byState[0].n) * 100)}%` }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{s.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {data.deployments.slice(0, limit).map((d) => (
              <li key={d.id} style={{ ...card, padding: '11px 14px' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{d.location}</span>
                  <span style={{ fontSize: 11, color: 'var(--brass)' }}>{d.state}</span>
                  <span style={{ fontSize: 11, color: d.status.toLowerCase().includes('oper') ? '#2BC5B4' : 'var(--text-muted)' }}>{d.status}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{d.system}{d.agency ? ` · ${d.agency}` : ''}{d.purpose ? ` — ${d.purpose}` : ''}</div>
              </li>
            ))}
          </ul>
          {limit < data.deployments.length && <div style={{ textAlign: 'center', marginTop: 4 }}><button onClick={() => setLimit((l) => l + 60)} style={{ ...chip(false), padding: '9px 20px', fontSize: 14 }}>Show more ({data.deployments.length - limit})</button></div>}
        </div>
      )}

      {tab === 'Manufacturers' && (
        <>
          <div style={{ ...kick, marginBottom: 12 }}>{data.manufacturers.length} makers · {meta.indianManufacturers} Indian</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {data.manufacturers.slice(0, limit).map((m) => (
              <li key={m.id} style={card}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <Link href={`/research/counter-uas/manufacturer/${m.slug}/`} style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)', textDecoration: 'none' }}>{m.name}</Link>
                  <span style={{ fontSize: 11, color: m.country === 'India' ? 'var(--brass)' : 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{m.country}</span>
                  {m.indigenous && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {m.indigenous}</span>}
                </div>
                {m.portfolio && <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>{m.portfolio}</div>}
                {m.hq && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{m.hq}{m.founded ? ` · est. ${m.founded}` : ''}</div>}
              </li>
            ))}
          </ul>
          {limit < data.manufacturers.length && <div style={{ textAlign: 'center', marginTop: 20 }}><button onClick={() => setLimit((l) => l + 60)} style={{ ...chip(false), padding: '9px 20px', fontSize: 14 }}>Show more ({data.manufacturers.length - limit})</button></div>}
        </>
      )}

      {tab === 'Procurement' && (
        <>
          <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 720 }}>{meta.procurementRows} disclosed contracts totalling <strong style={{ color: 'var(--brass)' }}>₹{meta.procurementCr.toLocaleString('en-IN')} cr</strong>.</p>
          <div style={{ marginBottom: 16 }}><DeepDive /></div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {proc.map((p, i) => (
              <li key={i} style={{ ...card, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div><div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{p.vendor}</div><div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{p.agency}{p.qty ? ` · ${p.qty} units` : ''}{p.date ? ` · ${String(p.date).slice(0, 4)}` : ''}{p.status ? ` · ${p.status}` : ''}</div></div>
                <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 13, color: 'var(--brass)' }}>{p.inr_cr ? `₹${Number(p.inr_cr).toLocaleString('en-IN')} cr` : '—'}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'Components' && (
        <>
          <div style={{ ...kick, marginBottom: 8 }}>Component supply & import-substitution</div>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-dim)', maxWidth: 700 }}>{meta.criticalComponents} components rated Critical import dependencies. Connects to <Link href="/research/dependencies/#semiconductors" style={{ color: 'var(--link, #6cb0ff)' }}>Semiconductors</Link> and <Link href="/research/dependencies/#critical-minerals" style={{ color: 'var(--link, #6cb0ff)' }}>Critical Minerals</Link>.</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {data.components.map((cp, i) => (
              <li key={i} style={{ ...card, padding: '11px 14px' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{cp.name}</span>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--brass)' }}>{cp.category}</span>
                  {cp.risk && <span style={{ fontSize: 11, color: cp.risk.toLowerCase().includes('critical') ? '#E24B4A' : 'var(--text-muted)' }}>{cp.risk}</span>}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>From {cp.country} · {cp.mfr}</div>
                {cp.indianAlt && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Indian alternative: {cp.indianAlt}</div>}
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'Technology' && (
        <>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 720 }}>The counter-UAS technology taxonomy — {data.technologies.length} technologies across detection, tracking, identification and defeat, with maturity and India&apos;s capability.</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {data.technologies.map((t, i) => (
              <li key={i} style={{ ...card, padding: '11px 14px' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{t.l3}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.l1} › {t.l2}</span>
                  {t.maturity && <span style={{ fontSize: 11, color: 'var(--brass)' }}>{t.maturity}</span>}
                </div>
                {t.indianCap && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>India: {t.indianCap}</div>}
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'Regulation' && (
        <>
          <Dir rows={data.regulations} title="Regulations & policy" name="name" meta={(r) => [r.auth, r.date, r.relevance].filter(Boolean).join(' · ')} />
          <Dir rows={data.trials} title="Trials & exercises" name="name" meta={(r) => [r.date, r.agency, r.location, r.outcome].filter(Boolean).join(' · ')} />
        </>
      )}

      {tab === 'Incidents' && (
        <>
          <div style={{ ...kick, marginBottom: 12 }}>Incident record · {data.incidents.length}</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {data.incidents.map((n, i) => (
              <li key={i} style={{ ...card, padding: '11px 14px' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{n.type || 'Incident'}</span>
                  {n.date && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{n.date}</span>}
                  {n.location && <span style={{ fontSize: 11, color: 'var(--brass)' }}>{n.location}{n.state ? `, ${n.state}` : ''}</span>}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{[n.drone && `Drone: ${n.drone}`, n.counter && `Countered by: ${n.counter}`, n.outcome].filter(Boolean).join(' · ')}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
