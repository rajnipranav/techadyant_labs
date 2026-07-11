'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Supplier, SupplierMeta } from '../suppliers';

const CATCOLOR: Record<string, string> = {
  'CNC Suppliers': '#2BC5B4', 'PCB Manufacturers': '#818CF8',
  'Composite Fabricators': '#C9A84C', 'Precision Machining': '#E0A458', 'Toolmakers': '#E5674B',
};
const PAL = ['#2BC5B4', '#818CF8', '#C9A84C', '#E0A458', '#E5674B', '#5FB0E8', '#B98CF8'];
const short = (c: string) =>
  c.replace(' Suppliers', '').replace(' Manufacturers', '').replace(' Fabricators', '').replace(' Machining', '');
const esc = (s: unknown) =>
  (s == null ? '' : '' + s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
const stars = (n: unknown) => { const k = +(n as number) || 0; return '★'.repeat(k) + '☆'.repeat(5 - k); };

type Row = [string, number];

/* ---- inline SVG / CSS chart builders (no external libs) ---- */
function donutSVG(rows: Row[], colors: string[], opts: { center?: number | string; label?: string; clickable?: boolean } = {}) {
  const r = 58, sw = 22, cx = 90, cy = 90;
  const total = rows.reduce((a, b) => a + b[1], 0) || 1;
  const circ = 2 * Math.PI * r; let acc = 0, seg = '';
  rows.forEach((row, i) => {
    const len = row[1] / total * circ;
    seg += `<circle class="sa-arc" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="${sw}" stroke-dasharray="${len.toFixed(2)} ${(circ - len).toFixed(2)}" stroke-dashoffset="${(-acc).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})" data-cat="${opts.clickable ? esc(row[0]) : ''}" style="${opts.clickable ? 'cursor:pointer' : ''}"><title>${esc(row[0])}: ${row[1]}</title></circle>`;
    acc += len;
  });
  const center = opts.center != null
    ? `<text x="90" y="86" text-anchor="middle" class="sa-dn">${opts.center}</text><text x="90" y="103" text-anchor="middle" class="sa-dl">${(opts.label || '').toUpperCase()}</text>` : '';
  const legend = `<div class="sa-legend">` + rows.map((row, i) =>
    `<span class="sa-lg"><i style="background:${colors[i % colors.length]}"></i>${esc(short(row[0]))} <b>${row[1]}</b></span>`).join('') + `</div>`;
  return `<svg viewBox="0 0 180 180" width="100%" height="150" style="display:block">${seg}${center}</svg>${legend}`;
}
function radarSVG(rows: Row[]) {
  const cx = 110, cy = 102, R = 70, n = rows.length;
  const ang = (i: number) => (-90 + i * 360 / n) * Math.PI / 180;
  const pt = (i: number, rr: number) => [cx + rr * Math.cos(ang(i)), cy + rr * Math.sin(ang(i))];
  let grid = ''; [0.25, 0.5, 0.75, 1].forEach((f) => {
    const p = rows.map((_, i) => pt(i, R * f).map((x) => x.toFixed(1)).join(',')).join(' ');
    grid += `<polygon points="${p}" fill="none" stroke="#1c2a44" />`;
  });
  let axes = '', labels = '';
  rows.forEach((row, i) => {
    const [x, y] = pt(i, R); axes += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#1c2a44" />`;
    const [lx, ly] = pt(i, R + 13); const a = Math.abs(lx - cx) < 6 ? 'middle' : (lx > cx ? 'start' : 'end');
    labels += `<text x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" text-anchor="${a}" class="sa-rlbl">${esc(row[0])}</text>`;
  });
  const poly = rows.map((row, i) => pt(i, R * row[1] / 100).map((x) => x.toFixed(1)).join(',')).join(' ');
  const dots = rows.map((row, i) => { const [x, y] = pt(i, R * row[1] / 100); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#C9A84C"><title>${esc(row[0])}: ${row[1]}%</title></circle>`; }).join('');
  return `<svg viewBox="0 0 220 205" width="100%" height="212">${grid}${axes}<polygon points="${poly}" fill="rgba(201,168,76,.18)" stroke="#C9A84C" stroke-width="2" />${dots}${labels}</svg>`;
}
function vbarsHTML(rows: Row[], colors: string | string[]) {
  const max = Math.max(...rows.map((r) => r[1])) || 1;
  return `<div class="sa-vbars">` + rows.map((row, i) => {
    const pct = Math.round(row[1] / max * 100);
    const col = Array.isArray(colors) ? colors[i % colors.length] : colors;
    return `<div class="sa-vb"><div class="sa-vt"><div class="sa-vf" style="height:${pct}%;background:${col}"><span class="sa-vv">${row[1]}</span></div></div><div class="sa-vl">${esc(row[0])}</div></div>`;
  }).join('') + `</div>`;
}
function hbarsHTML(rows: Row[], color: string, clickable = false) {
  const max = Math.max(...rows.map((r) => r[1])) || 1;
  return `<div class="sa-hbars">` + rows.map((row) => {
    const pct = Math.round(row[1] / max * 100);
    return `<div class="sa-hb ${clickable ? 'clk' : ''}" data-state="${clickable ? esc(row[0]) : ''}"><span class="sa-hl" title="${esc(row[0])}">${esc(row[0])}</span><span class="sa-ht"><span class="sa-hf" style="width:${pct}%;background:${color}"></span></span><span class="sa-hv">${row[1]}</span></div>`;
  }).join('') + `</div>`;
}
function stackHTML(items: { label: string; parts: { name: string; v: number; color: string }[] }[]) {
  return `<div style="padding-top:6px">` + items.map((it) => {
    const tot = it.parts.reduce((a, p) => a + p.v, 0) || 1;
    const segs = it.parts.map((p) => `<span style="width:${(p.v / tot * 100).toFixed(1)}%;background:${p.color}" title="${esc(p.name)}: ${p.v}"></span>`).join('');
    const cap = it.parts.map((p) => `<span><i style="background:${p.color}"></i>${esc(p.name)} ${p.v}</span>`).join('');
    return `<div class="sa-sb"><div class="sa-sl">${esc(it.label)}</div><div class="sa-sbar">${segs}</div><div class="sa-scap">${cap}</div></div>`;
  }).join('') + `</div>`;
}
function heatHTML(agg: SupplierMeta['agg']) {
  const maxv = Math.max(...agg.matrix.flat()) || 1;
  let h = '<table class="sa-heat"><tr><th></th>' + agg.regs.map((r) => `<th>${esc(r)}</th>`).join('') + '</tr>';
  agg.cats.forEach((c, i) => {
    h += `<tr><td class="sa-rl">${esc(short(c))}</td>`;
    agg.regs.forEach((r, j) => {
      const v = agg.matrix[i][j]; const t = v / maxv;
      const bg = v === 0 ? '' : `background:rgba(43,197,180,${(0.15 + t * 0.85).toFixed(2)})`;
      h += `<td class="sa-cell ${v === 0 ? 'z' : ''}" style="${bg}" data-cat="${v === 0 ? '' : esc(c)}" title="${esc(short(c))} · ${esc(r)}: ${v}">${v}</td>`;
    });
    h += '</tr>';
  });
  return h + '</table>';
}

interface Contact { contact?: string; designation?: string; phone?: string; email?: string; gstin?: string; udyam?: string; moq?: number | string }

export function SupplierDirectory({ suppliers, meta, facets }: {
  suppliers: Supplier[]; meta: SupplierMeta;
  facets: { category: string[]; state: string[]; certs: string[]; revenue: string[] };
}) {
  const agg = meta.agg;
  const [q, setQ] = useState('');
  const [fcat, setFcat] = useState('');
  const [fstate, setFstate] = useState('');
  const [fcert, setFcert] = useState('');
  const [frev, setFrev] = useState('');
  const [fver, setFver] = useState('');
  const [fexp, setFexp] = useState('');
  const [sort, setSort] = useState('rating');
  const [sel, setSel] = useState<Supplier | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [contacts, setContacts] = useState<Record<string, Contact>>({});
  const [email, setEmail] = useState('');
  const [gstatus, setGstatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [gerr, setGerr] = useState('');

  useEffect(() => { try { if (localStorage.getItem('atlas_unlocked') === '1') setUnlocked(true); } catch {} }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const out = suppliers.filter((d) => {
      if (query) {
        const hay = [d.name, d.city, d.state, d.subSpecialty, d.materials, d.machineBrands, d.category].join(' ').toLowerCase();
        if (!hay.includes(query)) return false;
      }
      if (fcat && d.category !== fcat) return false;
      if (fstate && d.state !== fstate) return false;
      if (frev && d.revenueBand !== frev) return false;
      if (fver && d.verified !== fver) return false;
      if (fexp && d.exportExp !== fexp) return false;
      if (fcert && !String(d.certifications || '').includes(fcert)) return false;
      return true;
    });
    const cmp: Record<string, (a: Supplier, b: Supplier) => number> = {
      rating: (a, b) => (b.rating || 0) - (a.rating || 0),
      name: (a, b) => a.name.localeCompare(b.name),
      year: (a, b) => (a.year || 9999) - (b.year || 9999),
      cap: (a, b) => (b.machineCount || 0) - (a.machineCount || 0),
    };
    return [...out].sort(cmp[sort]);
  }, [q, fcat, fstate, fcert, frev, fver, fexp, sort, suppliers]);

  const dash = useMemo(() => ({
    cat: donutSVG(agg.category as Row[], (agg.category as Row[]).map((x) => CATCOLOR[x[0]] || '#2BC5B4'), { center: meta.total, label: 'suppliers', clickable: true }),
    own: donutSVG(agg.ownership as Row[], PAL),
    ver: stackHTML([
      { label: 'Verification', parts: [{ name: 'Verified', v: agg.verifmix[0], color: '#2BC5B4' }, { name: 'Partial', v: agg.verifmix[1], color: '#3a4a6a' }] },
      { label: 'Export readiness', parts: [{ name: 'Export-ready', v: agg.exportmix[0], color: '#818CF8' }, { name: 'Limited', v: agg.exportmix[1], color: '#3a4a6a' }] },
    ]),
    state: hbarsHTML(agg.states_top as Row[], '#818CF8', true),
    cert: radarSVG((agg.certs as Row[]).map((x) => [x[0], Math.round(x[1] / meta.total * 100)] as Row)),
    rev: vbarsHTML(agg.revenue as Row[], ['#173a4d', '#1c5566', '#217a6f', '#2BC5B4', '#7fd9cd', '#c9f0ea']),
    prec: vbarsHTML(agg.precision as Row[], ['#2BC5B4', '#5FB0E8', '#818CF8', '#3a4a6a']),
    dec: vbarsHTML(agg.decade as Row[], '#C9A84C'),
    heat: heatHTML(agg),
  }), [agg, meta.total]);

  function scrollToDir() { document.getElementById('sa-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function onDashClick(e: React.MouseEvent) {
    const t = (e.target as HTMLElement).closest('[data-cat],[data-state]') as HTMLElement | null;
    if (!t) return;
    const cc = t.getAttribute('data-cat'); const ss = t.getAttribute('data-state');
    if (cc) { setFcat(cc); setFstate(''); scrollToDir(); }
    else if (ss) { setFstate(ss); scrollToDir(); }
  }

  async function ensureContact(id: string) {
    if (contacts[id]) return;
    try {
      const res = await fetch('/api/supplier-contacts', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data && data.contact) setContacts((prev) => ({ ...prev, [id]: data.contact as Contact }));
    } catch {}
  }
  function openModal(s: Supplier) { setSel(s); if (unlocked) ensureContact(s.id); }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || gstatus === 'sending') return;
    setGstatus('sending'); setGerr('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'atlas-supplier-unlock' }),
      });
      let data: { ok?: boolean; message?: string } | null = null;
      try { data = await res.json(); } catch {}
      if (!res.ok || !data?.ok) { setGstatus('error'); setGerr(data?.message || 'Something went wrong.'); return; }
      try { localStorage.setItem('atlas_unlocked', '1'); } catch {}
      setUnlocked(true); setGstatus('idle');
      if (sel) ensureContact(sel.id);
    } catch { setGstatus('error'); setGerr('Could not reach the server.'); }
  }

  const activeChips = ([
    fcat ? ['Category', fcat, setFcat] : null, fstate ? ['State', fstate, setFstate] : null,
    fcert ? ['Cert', fcert, setFcert] : null, frev ? ['Revenue', frev, setFrev] : null,
    fver ? ['Status', fver, setFver] : null, fexp ? ['Export', fexp, setFexp] : null,
  ].filter(Boolean)) as [string, string, (v: string) => void][];

  function reset() { setQ(''); setFcat(''); setFstate(''); setFcert(''); setFrev(''); setFver(''); setFexp(''); setSort('rating'); }

  const chipStyle = (cat: string): React.CSSProperties => {
    const m: Record<string, [string, string]> = {
      'CNC Suppliers': ['#2BC5B4', 'rgba(43,197,180,.14)'], 'PCB Manufacturers': ['#818CF8', 'rgba(129,140,248,.14)'],
      'Composite Fabricators': ['#C9A84C', 'rgba(201,168,76,.16)'], 'Precision Machining': ['#E0A458', 'rgba(224,164,88,.14)'],
      'Toolmakers': ['#E5674B', 'rgba(229,103,75,.14)'],
    };
    const v = m[cat] || ['#9FB2D0', 'rgba(159,178,208,.12)'];
    return { color: v[0], background: v[1] };
  };
  const con = sel ? contacts[sel.id] : undefined;

  return (
    <div className="sa">
      <div className="sa-kpis">
        <div className="sa-kpi k1"><div className="n">{meta.total}</div><div className="l">Suppliers mapped</div><div className="s">Across 5 capability categories</div></div>
        <div className="sa-kpi k2"><div className="n teal">{meta.verified}</div><div className="l">Verified suppliers</div><div className="s">{Math.round(meta.verified / meta.total * 100)}% independently confirmed</div></div>
        <div className="sa-kpi k3"><div className="n brass">{meta.avg.toFixed(1)}</div><div className="l">Avg capability rating</div><div className="s">Internal score / 5</div></div>
        <div className="sa-kpi k4"><div className="n indigo">{meta.states}</div><div className="l">States covered</div><div className="s">Pan-India spread</div></div>
        <div className="sa-kpi k5"><div className="n">{meta.export}</div><div className="l">Export-ready</div><div className="s">{Math.round(meta.export / meta.total * 100)}% with export experience</div></div>
      </div>

      <div className="sa-sech"><h2>Ecosystem dashboard</h2><span className="sub">Aggregate view of the supplier base</span><span className="hint">▸ click a category, state or heatmap cell to filter</span></div>
      <div className="sa-dash" onClick={onDashClick}>
        <div className="sa-card c2"><h3>By category <span className="tag">click to filter</span></h3><div className="sa-chart" dangerouslySetInnerHTML={{ __html: dash.cat }} /></div>
        <div className="sa-card c2"><h3>Ownership mix</h3><div className="sa-chart" dangerouslySetInnerHTML={{ __html: dash.own }} /></div>
        <div className="sa-card c2"><h3>Verification &amp; export</h3><div className="sa-chart" dangerouslySetInnerHTML={{ __html: dash.ver }} /></div>
        <div className="sa-card c3"><h3>Top states <span className="tag">click to filter</span></h3><div className="sa-chart" dangerouslySetInnerHTML={{ __html: dash.state }} /></div>
        <div className="sa-card c3"><h3>Certification coverage</h3><div className="sa-chart" dangerouslySetInnerHTML={{ __html: dash.cert }} /></div>
        <div className="sa-card c3"><h3>Capability map · category × region <span className="tag">click a cell</span></h3><div style={{ marginTop: 4 }} dangerouslySetInnerHTML={{ __html: dash.heat }} /></div>
        <div className="sa-card c3"><h3>Annual revenue band</h3><div className="sa-chart" dangerouslySetInnerHTML={{ __html: dash.rev }} /></div>
        <div className="sa-card c3"><h3>Precision · tightest tolerance</h3><div className="sa-chart" dangerouslySetInnerHTML={{ __html: dash.prec }} /></div>
        <div className="sa-card c3"><h3>Supplier base by founding decade</h3><div className="sa-chart" dangerouslySetInnerHTML={{ __html: dash.dec }} /></div>
      </div>

      <div className="sa-toolbar" id="sa-toolbar">
        <div className="sa-tb">
          <div className="sa-search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company, city, specialty, material, machine brand…" aria-label="Search suppliers" />
          </div>
          <select value={fcat} onChange={(e) => setFcat(e.target.value)}><option value="">All categories</option>{facets.category.map((v) => <option key={v} value={v}>{v}</option>)}</select>
          <select value={fstate} onChange={(e) => setFstate(e.target.value)}><option value="">All states</option>{facets.state.map((v) => <option key={v} value={v}>{v}</option>)}</select>
          <select value={fcert} onChange={(e) => setFcert(e.target.value)}><option value="">Any certification</option>{facets.certs.map((v) => <option key={v} value={v}>{v}</option>)}</select>
          <select value={frev} onChange={(e) => setFrev(e.target.value)}><option value="">Any revenue band</option>{facets.revenue.map((v) => <option key={v} value={v}>{v}</option>)}</select>
          <select value={fver} onChange={(e) => setFver(e.target.value)}><option value="">Any status</option><option value="Yes">Verified only</option><option value="Partial">Partial</option></select>
          <select value={fexp} onChange={(e) => setFexp(e.target.value)}><option value="">Export: any</option><option value="Yes">Export-ready</option><option value="Limited">Limited</option></select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="rating">Sort: Rating ↓</option><option value="name">Name A–Z</option><option value="year">Oldest first</option><option value="cap">Machine count ↓</option></select>
          <button className="sa-reset" onClick={reset}>Reset</button>
        </div>
        <div className="sa-count">
          <b>{filtered.length}</b> suppliers{filtered.length > 300 ? ' (showing first 300)' : ''}
          {activeChips.map(([lbl, val, clr]) => (
            <span key={lbl} className="sa-pill" onClick={() => clr('')}>{lbl}: {val} <span>×</span></span>
          ))}
        </div>
      </div>

      <div className="sa-grid">
        {filtered.slice(0, 300).map((d) => {
          const cs = String(d.certifications || '').split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
          return (
            <div key={d.id} className="sa-sup" onClick={() => openModal(d)}>
              <div className="sa-suptop">
                <div><div className="sa-name">{d.name}</div><div className="sa-id">{d.id}</div></div>
                <span className="sa-chip" style={chipStyle(d.category)}>{short(d.category)}</span>
              </div>
              <div className="sa-loc">📍 {d.city}, {d.state} · <span style={{ color: 'var(--muted, #6C7E9E)' }}>{d.subSpecialty}</span></div>
              <div className="sa-specs">
                <div><b>Tolerance</b> {d.tolerance}</div><div><b>Lead time</b> {d.leadWeeks} wks</div>
                <div><b>Revenue</b> {d.revenueBand}</div><div><b>Machines</b> {d.machineCount}</div>
              </div>
              <div className="sa-certs">{cs.map((x) => <span key={x} className="sa-cchip">{x}</span>)}</div>
              <div className="sa-meta"><span className="sa-stars" title={`${d.rating}/5`}>{stars(d.rating)}</span>
                {d.verified === 'Yes' ? <span className="sa-bv">✓ Verified</span> : <span className="sa-bp">◐ Partial</span>}</div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ color: 'var(--muted, #6C7E9E)', padding: 40 }}>No suppliers match these filters.</div>}
      </div>

      {sel && (
        <div className="sa-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSel(null); }}>
          <div className="sa-modal">
            <div className="sa-mh">
              <div><div className="sa-name" style={{ fontSize: 21 }}>{sel.name}</div>
                <div className="sa-sub">{sel.id} · {sel.category} · {sel.city}, {sel.state}</div></div>
              <button className="sa-close" onClick={() => setSel(null)} aria-label="Close">×</button>
            </div>
            <div className="sa-mgrid">
              <MRow k="Sub-specialty" v={sel.subSpecialty} /><MRow k="Established" v={sel.year} /><MRow k="Ownership" v={sel.ownership} />
              <MRow k="Plant size" v={sel.plantSize ? `${sel.plantSize} sqft` : null} /><MRow k="Headcount" v={sel.headcount} />
              <MRow k="Machines" v={`${sel.machineCount ?? '—'} · ${sel.machineBrands ?? ''}`} />
              <MRow k="Max part size" v={sel.maxPartSize ? `${sel.maxPartSize} mm` : null} /><MRow k="Tolerance" v={sel.tolerance} />
              <MRow k="Materials" v={sel.materials} /><MRow k="Monthly capacity" v={sel.monthlyCapacity} />
              <MRow k="Lead time" v={sel.leadWeeks ? `${sel.leadWeeks} weeks` : null} /><MRow k="Certifications" v={sel.certifications} />
              <MRow k="Customer tiers" v={sel.customerTiers} /><MRow k="Export / port" v={`${sel.exportExp ?? ''} · ${sel.nearestPort ?? ''}`} />
              <MRow k="Revenue band" v={sel.revenueBand} /><MRow k="Website" v={sel.website} />
              <MRow k="Capability rating" v={`${stars(sel.rating)} ${sel.rating}/5`} />
            </div>
            <div className={`sa-contact ${unlocked ? '' : 'locked'}`}>
              <h4>Direct contact &amp; registration</h4>
              <div className="sa-cgrid">
                <MRow k="Contact" v={con ? `${con.contact ?? ''} · ${con.designation ?? ''}` : '••••••••'} />
                <MRow k="Phone" v={con ? con.phone : '••••••••'} /><MRow k="Email" v={con ? con.email : '••••••••'} />
                <MRow k="LinkedIn" v={sel.linkedin} /><MRow k="GSTIN" v={con ? con.gstin : '••••••••'} />
                <MRow k="Udyam Reg" v={con ? con.udyam : '••••••••'} /><MRow k="Min order qty" v={con ? con.moq : '••••••••'} />
              </div>
              {!unlocked && (
                <div className="sa-gate">
                  <div className="sa-lock">🔒</div>
                  <p>Contact details, GSTIN &amp; Udyam registration unlock free with your work email — once, for the whole directory.</p>
                  <form onSubmit={unlock}>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" aria-label="Work email" />
                    <button type="submit" disabled={gstatus === 'sending'}>{gstatus === 'sending' ? 'Unlocking…' : 'Unlock directory'}</button>
                  </form>
                  {gstatus === 'error' && <small style={{ color: '#E5674B' }}>{gerr}</small>}
                  <small>No spam · one-time · verified suppliers only</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MRow({ k, v }: { k: string; v: unknown }) {
  const s = v == null || v === '' ? '—' : String(v);
  return <div><div className="k">{k}</div><div className="v">{s}</div></div>;
}
