// Techadyant Labs — Dependency share-card generator.
// Usage: node build-cards.mjs [path/to/_cmd.json] [outDir]
// Renders the standalone share-card set (1x + 2x PNG) from the live dataset.
// Deps (devDependencies): playwright, @fontsource/source-serif-4, @fontsource/inter.
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const DATA = process.argv[2] || './app/dependencies/_cmd.json';
const OUT  = process.argv[3] || './public/cards';
const CHROME = process.env.CHROME_PATH || undefined; // undefined => Playwright's own
fs.mkdirSync(OUT, { recursive: true });

// ---- fonts (embedded base64 so cards render identically offline) ----
const b64 = p => fs.readFileSync(p).toString('base64');
const SS = 'node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-';
const IN = 'node_modules/@fontsource/inter/files/inter-latin-';
const face = (fam,w,p) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${b64(p)}) format('woff2')}`;
const FONTS = [
  face('Source Serif 4',400,SS+'400-normal.woff2'), face('Source Serif 4',500,SS+'500-normal.woff2'),
  face('Source Serif 4',600,SS+'600-normal.woff2'),
  face('Inter',400,IN+'400-normal.woff2'), face('Inter',500,IN+'500-normal.woff2'),
  face('Inter',600,IN+'600-normal.woff2'), face('Inter',700,IN+'700-normal.woff2'),
].join('\n');

// ---- palette ----
const C = { bg:'#08080C', text:'#F2F2F5', body:'#E8E8EC', muted:'#9A9AA5', faint:'#7D7D88',
  gold:'#C9A84C', crit:'#E5566C', high:'#D6A94E', build:'#5BB37F', teal:'#5AA9CC' };
const AS_OF = 'Jun 2026';
const tier = s => s>=80?C.crit:s>=70?C.high:'#9EA6B0';
const badge = v => v==='Build-now'?['rgba(91,179,127,.16)','#7FD39F','rgba(91,179,127,.34)']
  : v==='Position-early'?['rgba(214,169,78,.16)','#E8C374','rgba(214,169,78,.34)']
  : ['rgba(229,86,108,.16)','#F28EA0','rgba(229,86,108,.34)'];

const d = JSON.parse(fs.readFileSync(DATA,'utf8'));
const top10 = [...d.products].sort((a,b)=>b.cmdi-a.cmdi).slice(0,10);
const secs = [...d.sectors].sort((a,b)=>b.total_import_usd_bn-a.total_import_usd_bn);
const totalImp = d.products.reduce((s,p)=>s+(p.import_usd_bn||0),0);
const bn = d.opportunities.filter(o=>o.tier==='Build-now').sort((a,b)=>b.opportunity_score-a.opportunity_score).slice(0,10);
const ih = d.index_history.map(p=>p.overall_index);
const inr = cr => cr==null?'—': cr>=100000?`₹${(cr/100000).toFixed(2)} lakh cr`:`₹${Math.round(cr).toLocaleString('en-IN')} cr`;
const semi = d.sectors.find(s=>s.sector_id==='semiconductors');
const semiTop = [...d.products].filter(p=>p.mega_sector==='semiconductors').sort((a,b)=>b.cmdi-a.cmdi).slice(0,6);
const verd = d.products.reduce((m,p)=>{m[p.localisation_verdict]=(m[p.localisation_verdict]||0)+1;return m;},{});
const critCount = d.products.filter(p=>p.dependency_tier==='Critical').length;
const overall = d.index_history[d.index_history.length-1].overall_index;
const first = d.index_history[0].overall_index;
const deltaIx = +(first-overall).toFixed(1);

// ---- shared chrome ----
const shell = (w,h,inner,pad=72) => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${w}px;height:${h}px;background:${C.bg};font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;color:${C.body}}
.card{position:relative;width:${w}px;height:${h}px;padding:${pad}px;display:flex;flex-direction:column;
 background:radial-gradient(900px 420px at 80% -6%,rgba(201,168,76,.10),transparent 70%),radial-gradient(760px 380px at 6% 2%,rgba(54,129,166,.08),transparent 72%),${C.bg}}
.kicker{font-weight:600;font-size:15px;letter-spacing:2.4px;text-transform:uppercase;color:${C.gold}}
h1{font-family:'Source Serif 4',serif;font-weight:500;line-height:1.04;letter-spacing:-.5px;color:${C.text}}
.sub{color:${C.muted};line-height:1.4}
.serif{font-family:'Source Serif 4',serif}
.tnum{font-variant-numeric:tabular-nums}
.rule{height:1px;background:linear-gradient(90deg,rgba(255,255,255,.14),rgba(255,255,255,.05))}
.foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:auto;padding-top:26px}
.src{font-size:14px;color:${C.faint};line-height:1.5}.src b{color:${C.muted};font-weight:500}
.brand{text-align:right}.wm{font-weight:700;font-size:17px;color:${C.gold};letter-spacing:.2px}
.url{font-size:13.5px;color:${C.faint};margin-top:3px}
.badge{font-size:13px;font-weight:600;padding:5px 13px;border-radius:999px;border:1px solid;white-space:nowrap}
</style></head><body><div class="card">${inner}
<div class="foot"><div class="src"><b>Source:</b> Techadyant Labs · CMDR Edition I<br>Modelled intelligence layer · as of ${AS_OF}</div>
<div class="brand"><div class="wm">Techadyant Labs</div><div class="url">labs.techadyant.com/dependencies</div></div></div>
</div></body></html>`;

// ---- card 1: Top 10 deepest ----
const cardTop10 = () => { const rows = top10.map((p,i)=>{const[bg,fg,bd]=badge(p.localisation_verdict);return `<div style="display:flex;align-items:center;gap:22px;padding:17px 0;border-bottom:1px solid rgba(255,255,255,.06)">
 <div class="tnum" style="font-weight:500;font-size:17px;color:#5E5E6B;width:34px">${String(i+1).padStart(2,'0')}</div>
 <div class="serif tnum" style="font-weight:600;font-size:36px;width:92px;letter-spacing:-.5px;color:${tier(p.cmdi)}">${p.cmdi.toFixed(1)}</div>
 <div style="flex:1;min-width:0"><div style="font-weight:600;font-size:23px;color:#ECECEF;letter-spacing:-.2px">${p.name}</div>
 <div style="font-size:14.5px;color:#8C8C98;margin-top:4px">${p.top_source_country} · $${(p.import_usd_bn).toFixed(2).replace(/\.?0+$/,'')}bn imports · ${Math.round(p.india_capability_pct)}% made in India</div></div>
 <div class="badge" style="background:${bg};color:${fg};border-color:${bd}">${p.localisation_verdict}</div></div>`}).join('');
 return shell(1080,1350,`<div class="kicker" style="margin-bottom:20px">Critical Manufacturing Dependency Index</div>
 <h1 style="font-size:58px;margin-bottom:16px">India’s 10 deepest<br>manufacturing dependencies</h1>
 <div class="sub" style="font-size:20px">Products where import reliance is near-total — scored on the CMDI, 0 (self-reliant) to 100 (import-bound).</div>
 <div class="rule" style="margin:30px 0 8px"></div><div style="flex:1">${rows}</div>`); };

// ---- card 2: Import bill at a glance (square) ----
const cardImport = () => { const max=secs[0].total_import_usd_bn; const bars=secs.slice(0,8).map(s=>{const c=s.sector_dependency_index>=72?C.crit:s.sector_dependency_index>=67?C.high:'#8C93A0';return `<div style="display:flex;align-items:center;gap:16px;padding:9px 0">
 <div style="width:260px;font-size:15.5px;color:#C7C7CF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>
 <div style="flex:1;height:14px;background:#15151F;border-radius:7px;overflow:hidden"><div style="height:100%;width:${(s.total_import_usd_bn/max*100).toFixed(1)}%;background:${c};border-radius:7px"></div></div>
 <div class="tnum" style="width:70px;text-align:right;font-size:15.5px;color:#D7D7DD">$${s.total_import_usd_bn.toFixed(1)}</div></div>`}).join('');
 return shell(1080,1080,`<div class="kicker" style="margin-bottom:22px">India · Strategic Import Bill</div>
 <div style="display:flex;align-items:baseline;gap:18px;margin-bottom:6px"><div class="serif tnum" style="font-size:118px;font-weight:600;color:${C.text};letter-spacing:-2px">$116.8<span style="font-size:52px;color:${C.muted}"> bn</span></div></div>
 <div class="sub" style="font-size:19px;margin-bottom:4px">Annual imports across 280 strategic products in 12 mega-sectors — the dependence, in dollars.</div>
 <div class="rule" style="margin:26px 0 12px"></div>
 <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:${C.faint};margin-bottom:6px">Top sectors by import value ($ bn)</div>
 <div>${bars}</div>`); };

// ---- card 3: Build-now top 10 (portrait) ----
const cardBuildNow = () => { const rows=bn.map((o,i)=>`<div style="display:flex;align-items:center;gap:20px;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.06)">
 <div class="tnum" style="font-weight:500;font-size:17px;color:#5E5E6B;width:30px">${String(i+1).padStart(2,'0')}</div>
 <div class="serif tnum" style="font-weight:600;font-size:30px;width:58px;color:${C.gold}">${Math.round(o.opportunity_score)}</div>
 <div style="flex:1;min-width:0"><div style="font-weight:600;font-size:20.5px;color:#ECECEF;letter-spacing:-.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.name.replace('Localise: ','')}</div>
 <div style="font-size:14px;color:#8C8C98;margin-top:3px">${inr(o.investment_required_inr_cr)} entry · ${o.tam_usd_bn?('$'+o.tam_usd_bn.toFixed(1)+'bn market'):'—'} · gov support ${o.govt_support}</div></div></div>`).join('');
 return shell(1080,1350,`<div class="kicker" style="margin-bottom:20px;color:#7FD39F">Opportunity Radar · Build-now</div>
 <h1 style="font-size:56px;margin-bottom:16px">Where India can<br>build now — top 10</h1>
 <div class="sub" style="font-size:20px">Localisation plays that pair high dependence with real feasibility, market size and government support.</div>
 <div class="rule" style="margin:30px 0 4px"></div><div style="flex:1">${rows}</div>`); };

// ---- card 4: Index movement (landscape) ----
const cardIndex = () => { const W=1016,H=300; const min=Math.min(...ih)-0.6,max=Math.max(...ih)+0.6;
 const pts=ih.map((v,i)=>[(i/(ih.length-1))*W, H-((v-min)/(max-min))*H]);
 const line=pts.map(p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
 const area=`0,${H} ${line} ${W},${H}`;
 const dots=`<circle cx="${pts[0][0].toFixed(1)}" cy="${pts[0][1].toFixed(1)}" r="6" fill="${C.muted}"/><circle cx="${pts[pts.length-1][0].toFixed(1)}" cy="${pts[pts.length-1][1].toFixed(1)}" r="7" fill="${C.build}"/>`;
 return shell(1200,675,`<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div class="kicker" style="margin-bottom:16px">Dependency Index · 12-month movement</div>
 <h1 style="font-size:46px;margin-bottom:10px">India’s manufacturing<br>dependence is easing</h1></div>
 <div style="text-align:right"><div class="serif tnum" style="font-size:72px;font-weight:600;color:${C.text};line-height:1">68.1</div>
 <div style="color:${C.build};font-size:18px;font-weight:600;margin-top:4px">▼ 3.1 pts / 12 mo</div></div></div>
 <div style="flex:1;margin-top:18px;position:relative"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:100%"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(91,179,127,.22)"/><stop offset="100%" stop-color="rgba(91,179,127,0)"/></linearGradient></defs>
 <polygon points="${area}" fill="url(#g)"/><polyline points="${line}" fill="none" stroke="${C.build}" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>${dots}</svg></div>
 <div style="display:flex;justify-content:space-between;font-size:15px;color:${C.muted};margin-top:6px"><span>71.2 · Jul 2025</span><span style="color:${C.faint}">0 = self-reliant · 100 = import-bound</span><span>68.1 · Jun 2026</span></div>`); };

// ---- card 5: Semiconductor snapshot (square) ----
const cardSemicon = () => { const rows=semiTop.map(p=>`<div style="display:flex;align-items:center;gap:16px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)">
 <div class="serif tnum" style="font-weight:600;font-size:26px;width:64px;color:${tier(p.cmdi)}">${p.cmdi.toFixed(1)}</div>
 <div style="flex:1;font-weight:600;font-size:18.5px;color:#ECECEF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
 <div style="font-size:14px;color:#8C8C98">${p.top_source_country}</div></div>`).join('');
 const tiles=[['$'+semi.total_import_usd_bn.toFixed(1)+' bn','annual imports'],[String(semi.critical_product_count),'critical products'],['▲ '+semi.index_trend.delta,'12-mo trend']];
 return shell(1080,1080,`<div class="kicker" style="margin-bottom:18px">Sector Snapshot · Semiconductors</div>
 <div style="display:flex;align-items:flex-end;gap:24px;margin-bottom:4px">
  <div class="serif tnum" style="font-size:104px;font-weight:600;line-height:.85;color:${C.crit}">${semi.sector_dependency_index.toFixed(1)}</div>
  <div style="padding-bottom:14px"><div style="font-size:18px;color:${C.body}">Sector Dependency Index</div><div style="font-size:14px;color:${C.muted}">0 self-reliant · 100 import-bound</div></div></div>
 <div class="sub" style="font-size:18px;margin:8px 0 2px">India's single largest localisation bet — and still ~100% import-dependent on logic and memory.</div>
 <div style="display:flex;gap:12px;margin:22px 0 4px">${tiles.map(t=>`<div style="flex:1;background:#111119;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px 18px"><div class="serif tnum" style="font-size:28px;font-weight:600;color:${C.text}">${t[0]}</div><div style="font-size:13px;color:${C.muted};margin-top:2px">${t[1]}</div></div>`).join('')}</div>
 <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:${C.faint};margin:22px 0 2px">Deepest chokepoints in the sector</div>
 <div>${rows}</div>
 <div style="margin-top:24px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.22);border-radius:12px;padding:17px 20px;font-size:15.5px;color:#DBD3B8;line-height:1.5"><b style="color:${C.gold}">Policy:</b> India Semiconductor Mission 2.0 — ₹1.27 lakh cr approved in 2026 to localise the stack, from wafers to packaging.</div>`); };

// ---- card 6: One-page pillar summary (portrait) ----
const cardSummary = () => {
 const sbars=secs.slice(0,6).map(s=>{const c=s.sector_dependency_index>=72?C.crit:s.sector_dependency_index>=67?C.high:'#8C93A0';return `<div style="display:flex;align-items:center;gap:12px;padding:9px 0"><div style="width:230px;font-size:14px;color:#C7C7CF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div><div style="flex:1;height:11px;background:#15151F;border-radius:6px;overflow:hidden"><div style="height:100%;width:${((s.sector_dependency_index-55)/(80-55)*100).toFixed(1)}%;background:${c};border-radius:6px"></div></div><div class="tnum" style="width:44px;text-align:right;font-size:14px;color:#D7D7DD">${s.sector_dependency_index.toFixed(1)}</div></div>`}).join('');
 const total=verd['Build-now']+verd['Position-early']+verd['Watch'];
 const posture=`<div style="display:flex;height:14px;border-radius:7px;overflow:hidden"><div style="width:${(verd['Build-now']/total*100).toFixed(1)}%;background:${C.build}"></div><div style="width:${(verd['Position-early']/total*100).toFixed(1)}%;background:${C.high}"></div><div style="width:${(verd['Watch']/total*100).toFixed(1)}%;background:${C.crit}"></div></div>`;
 const chokes=top10.slice(0,5).map(p=>`<div style="display:flex;align-items:center;gap:12px;padding:9px 0"><div class="serif tnum" style="font-weight:600;font-size:18px;width:44px;color:${tier(p.cmdi)}">${p.cmdi.toFixed(1)}</div><div style="flex:1;font-size:15px;color:#DADAE0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div><div style="font-size:13px;color:#8C8C98">${p.top_source_country}</div></div>`).join('');
 const stats=[['280','products tracked'],['$116.8 bn','strategic imports'],[String(critCount),'critical-tier (80+)'],['80','opportunity surfaces']];
 return shell(1080,1350,`<div class="kicker" style="margin-bottom:16px">India's Manufacturing Dependency Monitor</div>
 <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:6px">
  <h1 style="font-size:43px;max-width:600px;line-height:1.06">Where India depends on the world to make things</h1>
  <div style="text-align:right;flex-shrink:0"><div class="serif tnum" style="font-size:74px;font-weight:600;line-height:.9;color:${C.text}">${overall.toFixed(1)}</div><div style="color:${C.build};font-size:16px;font-weight:600;margin-top:4px">▼ ${deltaIx} / 12 mo</div><div style="font-size:12.5px;color:${C.muted};margin-top:1px">Dependency Index</div></div></div>
 <div style="display:flex;gap:10px;margin:26px 0 10px">${stats.map(s=>`<div style="flex:1;background:#111119;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:20px 16px"><div class="serif tnum" style="font-size:27px;font-weight:600;color:${C.text}">${s[0]}</div><div style="font-size:12.5px;color:${C.muted};margin-top:3px">${s[1]}</div></div>`).join('')}</div>
 <div class="rule" style="margin:34px 0 20px"></div>
 <div style="font-size:12.5px;letter-spacing:1.4px;text-transform:uppercase;color:${C.faint};margin-bottom:8px">Dependency by sector · top 6</div>${sbars}
 <div style="margin-top:20px"><div style="font-size:12.5px;letter-spacing:1.4px;text-transform:uppercase;color:${C.faint};margin-bottom:10px">Recommended posture · 280 products</div>${posture}
 <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-top:8px"><span style="color:#7FD39F">Build-now ${verd['Build-now']}</span><span style="color:#E8C374">Position-early ${verd['Position-early']}</span><span style="color:#F28EA0">Watch ${verd['Watch']}</span></div></div>
 <div class="rule" style="margin:34px 0 20px"></div>
 <div style="font-size:12.5px;letter-spacing:1.4px;text-transform:uppercase;color:${C.faint};margin-bottom:6px">Deepest dependencies</div>${chokes}
 <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06);font-size:14.5px;color:${C.muted};line-height:1.5">Fully open: the living index, all 280 product scorecards, 12 sector pages and the methodology — free to read. The full dataset and sector packs are a click away.</div>`); };

const CARDS = [
  ['top-10-chokepoints', 1080,1350, cardTop10()],
  ['strategic-import-bill', 1080,1080, cardImport()],
  ['build-now-top-10', 1080,1350, cardBuildNow()],
  ['dependency-index-movement', 1200,675, cardIndex()],
  ['semiconductor-snapshot', 1080,1080, cardSemicon()],
  ['pillar-summary', 1080,1350, cardSummary()],
];

const browser = await chromium.launch({ executablePath: CHROME });
for (const [name,w,h,html] of CARDS) {
  const f = path.join(OUT, name+'.html'); fs.writeFileSync(f, html);
  for (const [scale,suf] of [[1,''],[2,'@2x']]) {
    const page = await browser.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:scale });
    await page.goto('file://'+path.resolve(f), { waitUntil:'networkidle' });
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(OUT, `${name}${suf}.png`) });
    await page.close();
  }
  fs.unlinkSync(f);
  console.log('rendered', name);
}
await browser.close();
console.log('done →', OUT);
