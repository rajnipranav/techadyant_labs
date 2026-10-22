// Techadyant Labs — per-product OG image generator (ten-index radar).
// Usage: node build-og.mjs [path/to/_cmd.json] [outDir] [sampleSlugsCSV]
// Renders a 1200x630 branded OG card per product → <outDir>/<product_id>.png
// Deps (devDependencies): playwright, @fontsource/source-serif-4, @fontsource/inter
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const DATA = process.argv[2] || './app/dependencies/_cmd.json';
const OUT  = process.argv[3] || './public/og/products';
const SAMPLE = (process.argv[4]||'').split(',').filter(Boolean);
const FORCE = process.argv.includes('--force') || process.env.FORCE==='1';
const CHROME = process.env.CHROME_PATH || undefined;
fs.mkdirSync(OUT, { recursive: true });

const b64 = p => fs.readFileSync(p).toString('base64');
const SS='node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-';
const IN='node_modules/@fontsource/inter/files/inter-latin-';
const face=(f,w,p)=>`@font-face{font-family:'${f}';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${b64(p)}) format('woff2')}`;
const FONTS=[face('Source Serif 4',500,SS+'500-normal.woff2'),face('Source Serif 4',600,SS+'600-normal.woff2'),
  face('Inter',400,IN+'400-normal.woff2'),face('Inter',500,IN+'500-normal.woff2'),face('Inter',600,IN+'600-normal.woff2'),face('Inter',700,IN+'700-normal.woff2')].join('\n');

const C={bg:'#08080C',surf:'#111119',text:'#F2F2F5',body:'#E8E8EC',muted:'#9A9AA5',faint:'#7D7D88',gold:'#C9A84C',crit:'#E5566C',high:'#D6A94E',build:'#5BB37F',teal:'#5AA9CC',grid:'rgba(255,255,255,.10)'};
const tier=s=>s>=80?C.crit:s>=70?C.high:'#9EA6B0';
const vcol=v=>v==='Build-now'?C.build:v==='Position-early'?C.high:'#F28EA0';
const INDICES=[['cmdi','CMDI'],['lpi','LPI'],['iai','IAI'],['sri','SRI'],['sci','SCI'],['tri','TRI'],['imi','IMI'],['nsri','NSRI'],['epi','EPI'],['icgi','ICGI']];

const d=JSON.parse(fs.readFileSync(DATA,'utf8'));
let products=d.products;
if(SAMPLE.length) products=products.filter(p=>SAMPLE.includes(p.product_id));

const CX=905,CY=315,R=188;
const radar=p=>{
  const pts=INDICES.map(([k],i)=>{const ang=-Math.PI/2+i*(2*Math.PI/10);const v=Math.max(0,Math.min(100,(p[k]??0)));const r=v/100*R;return [CX+r*Math.cos(ang),CY+r*Math.sin(ang)];});
  const poly=pts.map(q=>`${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ');
  const rings=[25,50,75,100].map(pct=>{const rr=pct/100*R;const rp=INDICES.map((_,i)=>{const a=-Math.PI/2+i*(2*Math.PI/10);return `${(CX+rr*Math.cos(a)).toFixed(1)},${(CY+rr*Math.sin(a)).toFixed(1)}`}).join(' ');return `<polygon points="${rp}" fill="none" stroke="${C.grid}" stroke-width="1"/>`}).join('');
  const spokes=INDICES.map((_,i)=>{const a=-Math.PI/2+i*(2*Math.PI/10);return `<line x1="${CX}" y1="${CY}" x2="${(CX+R*Math.cos(a)).toFixed(1)}" y2="${(CY+R*Math.sin(a)).toFixed(1)}" stroke="${C.grid}" stroke-width="1"/>`}).join('');
  const labels=INDICES.map(([k,ab],i)=>{const a=-Math.PI/2+i*(2*Math.PI/10);const lx=CX+(R+26)*Math.cos(a);const ly=CY+(R+26)*Math.sin(a);const anc=Math.abs(Math.cos(a))<0.3?'middle':Math.cos(a)>0?'start':'end';return `<text x="${lx.toFixed(1)}" y="${(ly+4).toFixed(1)}" text-anchor="${anc}" font-family="Inter" font-size="14" font-weight="600" fill="${k==='cmdi'?C.gold:C.muted}">${ab}</text>`}).join('');
  const dots=pts.map((q,i)=>`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.5" fill="${INDICES[i][0]==='cmdi'?C.gold:'#D8C57E'}"/>`).join('');
  return `<svg viewBox="0 0 1200 630" width="1200" height="630" style="position:absolute;inset:0">${rings}${spokes}
    <polygon points="${poly}" fill="rgba(201,168,76,.16)" stroke="${C.gold}" stroke-width="2.5" stroke-linejoin="round"/>${dots}${labels}</svg>`;
};

const card=p=>{const sector=(d.sectors.find(s=>s.sector_id===p.mega_sector)||{}).name||p.mega_sector;
 return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
 *{margin:0;padding:0;box-sizing:border-box}html,body{width:1200px;height:630px}
 body{background:radial-gradient(760px 420px at 78% 12%,rgba(201,168,76,.10),transparent 68%),radial-gradient(620px 360px at 6% 0%,rgba(54,129,166,.07),transparent 70%),${C.bg};font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;color:${C.body};position:relative;overflow:hidden}
 .pad{position:absolute;inset:0;padding:64px 72px;display:flex;flex-direction:column}
 .kick{font-weight:600;font-size:14px;letter-spacing:2.2px;text-transform:uppercase;color:${C.gold};margin-bottom:16px}
 h1{font-family:'Source Serif 4',serif;font-weight:600;font-size:46px;line-height:1.04;letter-spacing:-.5px;color:${C.text};max-width:560px}
 .badges{display:flex;gap:8px;margin-top:18px;flex-wrap:wrap}
 .b{font-size:13px;font-weight:600;padding:5px 12px;border-radius:999px;border:1px solid;white-space:nowrap}
 .kpis{display:flex;gap:30px;margin-top:auto}
 .kpi b{font-family:'Source Serif 4',serif;display:block;font-size:34px;font-weight:600;line-height:1}
 .kpi span{font-size:13px;color:${C.muted};margin-top:4px;display:block}
 .src{position:absolute;left:72px;bottom:30px;font-size:13px;color:${C.faint}}
 .wm{position:absolute;right:72px;bottom:30px;text-align:right}
 .wm .n{font-weight:700;font-size:15px;color:${C.gold}}.wm .u{font-size:12.5px;color:${C.faint};margin-top:1px}
 </style></head><body>
 ${radar(p)}
 <div class="pad">
   <div class="kick">Critical Manufacturing Dependency · Scorecard</div>
   <h1>${p.name}</h1>
   <div class="badges">
     <span class="b" style="background:${tier(p.cmdi)}22;color:${tier(p.cmdi)};border-color:${tier(p.cmdi)}55">${p.dependency_tier} dependency</span>
     <span class="b" style="background:${vcol(p.localisation_verdict)}22;color:${vcol(p.localisation_verdict)};border-color:${vcol(p.localisation_verdict)}55">${p.localisation_verdict}</span>
     <span class="b" style="background:rgba(255,255,255,.05);color:${C.muted};border-color:rgba(255,255,255,.12)">${sector}</span>
   </div>
   <div class="kpis">
     <div class="kpi"><b style="color:${tier(p.cmdi)}">${p.cmdi.toFixed(1)}</b><span>CMDI / 100</span></div>
     <div class="kpi"><b style="color:${C.text}">$${(p.import_usd_bn).toFixed(2).replace(/\.?0+$/,'')}<span style="font-size:18px;color:${C.muted}">bn</span></b><span>Annual import</span></div>
     <div class="kpi"><b style="color:${C.text}">${Math.round(p.india_capability_pct)}%</b><span>Made in India</span></div>
   </div>
 </div>
 <div class="src"><b style="color:${C.muted};font-weight:500">Source:</b> Techadyant Labs · CMDR Edition I · as of Jun 2026</div>
 <div class="wm"><div class="n">Techadyant Labs</div><div class="u">labs.techadyant.com/dependencies</div></div>
 </body></html>`;
};

let sharp=null; try{ sharp=(await import('sharp')).default; }catch{ console.log('(sharp not installed — writing full-size PNGs)'); }
let browser;
try{ browser=await chromium.launch({executablePath:CHROME}); }catch(e){ console.warn('build-og: Chromium unavailable ('+e.message.split('\n')[0]+') — skipping OG regeneration; committed images are used.'); process.exit(0); }
const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
let n=0;
for(const p of products){const outp=path.join(OUT,p.product_id+'.png');if(!FORCE && fs.existsSync(outp)){n++;continue;}const f=path.join(OUT,p.product_id+'.html');fs.writeFileSync(f,card(p));
  await page.goto('file://'+path.resolve(f),{waitUntil:'load'});await page.waitForTimeout(60);
  await page.screenshot({path:outp});fs.unlinkSync(f);if(sharp){try{const buf=await sharp(outp).png({palette:true,colours:128,effort:7}).toBuffer();fs.writeFileSync(outp,buf);}catch{}}n++;
  if(n%40===0)console.log('  ...',n);}
await page.close();await browser.close();
console.log('rendered',n,'OG cards →',OUT);
