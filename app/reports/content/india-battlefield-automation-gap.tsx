import type { TocItem } from '../../components/ReportReader';

/**
 * Full long-form online reading version of "India's Battlefield Automation Gap".
 * Free report, published in full. 13 inline SVG figures (each with <title>/<desc>
 * and aria-label for accessibility + SEO). The complete 130-page PDF is the free
 * download below.
 */
export const toc: TocItem[] = [
  { id: 'the-reframe', label: 'The reframe: an industrial race' },
  { id: 'bari', label: 'The Readiness Index (BARI)' },
  { id: 'the-stack', label: 'Where the gap lives' },
  { id: 'india-china', label: 'The quantified India–China gap' },
  { id: 'china-edge', label: "China's industrial edge" },
  { id: 'the-threat', label: 'The threat picture' },
  { id: 'conversion', label: 'The conversion problem' },
  { id: 'strengths', label: 'Where India is strong' },
  { id: 'scenarios', label: 'Three scenarios to 2035' },
  { id: 'the-roadmap', label: 'What India should do' },
  { id: 'full-report', label: 'The full report' },
];

const NAVYCARD = '#161629';
const BRASS = '#F5B544';
const TEAL = '#38e1c4';
const CRIMSON = '#e2725b';
const INK = '#9898A8';
const AMBER = '#E0A23B';
const PAPER = '#0B0B14';
const GRID = '#2A2A3E';

function ramp(v: number) {
  return ['#3FAE9E', '#7FCBBE', BRASS, AMBER, CRIMSON][Math.max(1, Math.min(5, v)) - 1];
}

/* ── Figure 1 — Evolution of warfare ── */
function EvolutionFigure() {
  const eras = [
    { t: 'Industrial', s: '1900s', items: ['Mass production', 'Firepower', 'Rail logistics'], c: INK },
    { t: 'Mechanized', s: '1940s', items: ['Mobility', 'Combined arms', 'Radio'], c: INK },
    { t: 'Information', s: '1990s', items: ['Sensors', 'Networks', 'Precision'], c: TEAL },
    { t: 'Autonomous', s: '2020s+', items: ['AI & robotics', 'Edge computing', 'Human-machine teaming'], c: BRASS },
  ];
  return (
    <figure className="report-figure" id="fig-evolution">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="From industrial warfare to autonomous warfare: four eras">
          <title>From industrial to autonomous warfare</title>
          {eras.map((e, i) => {
            const x = 24 + i * 185;
            return (
              <g key={e.t}>
                <rect x={x} y={20} width={168} height={210} rx={8} fill={NAVYCARD} stroke={GRID} />
                <rect x={x} y={20} width={168} height={42} rx={8} fill={e.c} fillOpacity={0.9} />
                <text x={x + 16} y={40} fontSize={14} fontWeight={700} fill={PAPER}>{e.t}</text>
                <text x={x + 16} y={56} fontSize={11} fill={PAPER}>{e.s}</text>
                {e.items.map((it, k) => (
                  <text key={it} x={x + 16} y={92 + k * 22} fontSize={12} fill="#E8E8F0">• {it}</text>
                ))}
              </g>
            );
          })}
          <line x1={24} y1={262} x2={716} y2={262} stroke={BRASS} strokeWidth="2" />
          <path d="M716 256 L730 262 L716 268 Z" fill={BRASS} />
          <text x={380} y={254} textAnchor="middle" fontSize={11} fill={INK}>Increasing decision speed &amp; system complexity</text>
        </svg>
      </div>
      <figcaption className="fig-cap">Each era is defined less by its weapons than by the industrial base behind them. Autonomy is the fourth such shift.</figcaption>
    </figure>
  );
}

/* ── Figure 2 — BARI radar ── */
function BariRadar() {
  const dims = ['Robotics', 'Sensors', 'Embedded', 'Comms', 'Power', 'AI Software', 'Testing', 'Manufacturing'];
  const india = [2.5, 2.0, 2.5, 2.5, 2.0, 3.5, 2.0, 3.0];
  const china = [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 3.5, 4.5];
  const us = [4.5, 4.5, 4.5, 4.5, 4.0, 4.5, 4.5, 4.5];
  const cx = 380, cy = 215, R = 150, n = dims.length;
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return `${(cx + r * Math.cos(a)).toFixed(0)},${(cy + r * Math.sin(a)).toFixed(0)}`;
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, (R * v) / 5)).join(' ');
  return (
    <figure className="report-figure" id="fig-bari">
      <div className="fig-frame">
        <svg viewBox="0 0 760 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BARI readiness radar: India, China, United States across eight industrial dimensions">
          <title>Battlefield Automation Readiness Index</title>
          {[1, 2, 3, 4, 5].map((k) => (
            <polygon key={k} points={Array.from({ length: n }).map((_, i) => pt(i, (R * k) / 5)).join(' ')} fill="none" stroke={GRID} strokeWidth="1" />
          ))}
          {dims.map((d, i) => {
            const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
            const lx = cx + (R + 30) * Math.cos(a), ly = cy + (R + 30) * Math.sin(a);
            return (
              <g key={d}>
                <line x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)} stroke={GRID} />
                <text x={lx} y={ly} textAnchor="middle" fontSize={11} fill={INK} fontWeight={600}>{d}</text>
              </g>
            );
          })}
          <polygon points={poly(china)} fill="rgba(245,181,68,0.10)" stroke={BRASS} strokeWidth="2" />
          <polygon points={poly(us)} fill="rgba(152,152,168,0.08)" stroke={INK} strokeWidth="2" />
          <polygon points={poly(india)} fill="rgba(56,225,196,0.18)" stroke={TEAL} strokeWidth="2.5" />
          {[['India', TEAL], ['China', BRASS], ['United States', INK]].map(([lab, c], i) => (
            <g key={lab as string}>
              <rect x={620} y={150 + i * 26} width={14} height={14} rx={3} fill={c as string} />
              <text x={640} y={162 + i * 26} fontSize={12} fill="#E8E8F0">{lab}</text>
            </g>
          ))}
          <text x={620} y={250} fontSize={10.5} fill={INK}>1 = nascent · 5 = leading</text>
        </svg>
      </div>
      <figcaption className="fig-cap">The Battlefield Automation Readiness Index. India trails on every dimension, and the deficit is widest in the middle of the stack — sensors, power and testing.</figcaption>
    </figure>
  );
}

/* ── Figure 3 — The seven-layer stack ── */
function StackFigure() {
  const layers = [
    { name: 'Robotic Platforms & Mission Systems', c: TEAL, gap: 'Strength' },
    { name: 'Autonomy Software', c: TEAL, gap: 'Strength' },
    { name: 'Communications', c: AMBER, gap: 'Gap' },
    { name: 'Sensors (EO/IR, thermal cores)', c: CRIMSON, gap: 'High gap' },
    { name: 'Embedded Electronics', c: AMBER, gap: 'Gap' },
    { name: 'Power Systems (cells, packs)', c: CRIMSON, gap: 'High gap' },
    { name: 'Manufacturing Base', c: AMBER, gap: 'Gap' },
  ];
  return (
    <figure className="report-figure" id="fig-stack">
      <div className="fig-frame">
        <svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The seven-layer battlefield automation stack and where India's gaps concentrate">
          <title>The battlefield automation stack</title>
          {layers.map((l, i) => {
            const y = 20 + i * 47;
            const inset = i * 20;
            return (
              <g key={l.name}>
                <rect x={40 + inset} y={y} width={560 - 2 * inset} height={38} rx={6} fill={NAVYCARD} stroke={l.c} strokeWidth="1.5" />
                <rect x={40 + inset} y={y} width={6} height={38} fill={l.c} />
                <text x={60 + inset} y={y + 24} fontSize={13} fill="#E8E8F0" fontWeight={600}>{l.name}</text>
                <text x={620} y={y + 24} fontSize={11.5} fill={l.c} fontWeight={700}>{l.gap}</text>
              </g>
            );
          })}
          <text x={40} y={350} fontSize={11} fill={INK}>India is strong at the ends of the stack and hollow in the middle, where leverage concentrates.</text>
        </svg>
      </div>
      <figcaption className="fig-cap">The seven industrial layers of battlefield automation. India can build platforms and software; it imports the sensors, power and electronics beneath them.</figcaption>
    </figure>
  );
}

/* ── Figure 4 — Capability gap heatmap ── */
function HeatmapFigure() {
  const rows = ['Sensors / Thermal', 'Rugged Electronics', 'Autonomous Mobility', 'Military Batteries', 'Edge Computing', 'Tactical Comms', 'Sim & Testing', 'Manufacturing Scale'];
  const cols = ['Importance', 'Domestic\nMaturity', 'Import\nExposure', 'Startup\nOpp.', 'SME\nOpp.'];
  const data = [[5, 1, 5, 4, 3], [4, 2, 4, 4, 4], [4, 2, 3, 3, 3], [5, 2, 4, 4, 4], [4, 3, 3, 5, 3], [4, 2, 4, 3, 3], [5, 1, 3, 4, 5], [3, 3, 3, 3, 4]];
  const x0 = 250, y0 = 70, cw = 92, ch = 34;
  return (
    <figure className="report-figure" id="fig-heatmap">
      <div className="fig-frame">
        <svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India's battlefield automation capability gap matrix scored one to five">
          <title>Capability gap matrix</title>
          {cols.map((c, j) => c.split('\n').map((ln, k) => (
            <text key={c + k} x={x0 + j * cw + cw / 2} y={y0 - 26 + k * 12} textAnchor="middle" fontSize={10.5} fill={INK} fontWeight={600}>{ln}</text>
          )))}
          {rows.map((r, i) => (
            <g key={r}>
              <text x={x0 - 12} y={y0 + i * ch + ch / 2 + 4} textAnchor="end" fontSize={12} fill="#E8E8F0" fontWeight={600}>{r}</text>
              {data[i].map((v, j) => (
                <g key={j}>
                  <rect x={x0 + j * cw + 3} y={y0 + i * ch + 3} width={cw - 6} height={ch - 6} rx={4} fill={ramp(v)} />
                  <text x={x0 + j * cw + cw / 2} y={y0 + i * ch + ch / 2 + 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={v >= 3 ? '#FFFFFF' : PAPER} fontFamily="monospace">{v}</text>
                </g>
              ))}
            </g>
          ))}
          <text x={x0} y={350} fontSize={10.5} fill={INK}>Higher = greater importance / exposure / opportunity; for Domestic Maturity, higher = stronger.</text>
        </svg>
      </div>
      <figcaption className="fig-cap">Eight critical inputs scored across five strategic axes. The crimson column is import exposure; the teal columns are where founders and SMEs can enter.</figcaption>
    </figure>
  );
}

/* ── Figure 5 — India–China hard indicators ── */
function GapBars() {
  const rows = [
    { label: 'Commercial-drone share', china: 70, chinaL: 'DJI ~70%', india: 5, indiaL: '~5%' },
    { label: 'Lithium-ion cell capacity', china: 85, chinaL: '~85%', india: 4, indiaL: '<5%' },
    { label: 'Rare-earth processing', china: 90, chinaL: '~90%', india: 2, indiaL: '~2%' },
  ];
  return (
    <figure className="report-figure" id="fig-gap">
      <div className="fig-frame">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="China versus India share of automation-critical industrial inputs">
          <title>The quantified India-China gap</title>
          <text x={300} y={28} fontSize={12} fill={BRASS} fontWeight={700}>CHINA</text>
          <text x={730} y={28} textAnchor="end" fontSize={12} fill={TEAL} fontWeight={700}>INDIA</text>
          {rows.map((r, i) => {
            const y = 56 + i * 70;
            return (
              <g key={r.label}>
                <text x={300} y={y - 10} fontSize={13} fill="#E8E8F0" fontWeight={600}>{r.label}</text>
                <rect x={300} y={y} width={300} height={24} rx={4} fill={NAVYCARD} />
                <rect x={300} y={y} width={(r.china / 100) * 300} height={24} rx={4} fill={BRASS} />
                <text x={290} y={y + 17} textAnchor="end" fontSize={12} fill={BRASS} fontWeight={700} fontFamily="monospace">{r.chinaL}</text>
                <rect x={620} y={y} width={110} height={24} rx={4} fill={NAVYCARD} />
                <rect x={620} y={y} width={(r.india / 100) * 110} height={24} rx={4} fill={TEAL} />
                <text x={734} y={y + 17} textAnchor="end" fontSize={12} fill={TEAL} fontWeight={700} fontFamily="monospace">{r.indiaL}</text>
              </g>
            );
          })}
          <text x={300} y={266} fontSize={10.5} fill={INK}>Sources: Berg Insight (drones), IEA (cells, rare earths). Analyst estimates; bars indexed for comparison.</text>
        </svg>
      </div>
      <figcaption className="fig-cap">The gap is industrial. China&apos;s edge is depth — cells, processing and components — not platforms or talent.</figcaption>
    </figure>
  );
}

/* ── Figure 6 — China ecosystem actors ── */
function ChinaEcosystemFigure() {
  const rows = [
    { cat: 'COMMERCIAL SCALE', actor: 'DJI', desc: '~70% of global commercial drones', c: TEAL },
    { cat: 'STATE ELECTRONICS', actor: 'CETC', desc: '200-drone swarm record (2018)', c: BRASS },
    { cat: 'GROUND ROBOTICS', actor: 'Norinco', desc: 'Sharp Claw / Mule-200 UGVs (reported)', c: AMBER },
    { cat: 'AVIATION / UAV', actor: 'AVIC', desc: 'Wing Loong-class UAV families', c: BRASS },
    { cat: 'COMMAND ENABLERS', actor: 'ISF · Aerospace · Cyberspace Force', desc: '2024 PLA reorganisation', c: INK },
  ];
  return (
    <figure className="report-figure" id="fig-china">
      <div className="fig-frame">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="China's battlefield automation ecosystem: the named institutions">
          <title>China's automation ecosystem</title>
          {rows.map((r, i) => {
            const y = 20 + i * 58;
            return (
              <g key={r.actor}>
                <rect x={30} y={y} width={700} height={48} rx={7} fill={NAVYCARD} stroke={GRID} />
                <rect x={30} y={y} width={7} height={48} fill={r.c} />
                <text x={50} y={y + 20} fontSize={10.5} fill={r.c} fontWeight={700}>{r.cat}</text>
                <text x={50} y={y + 39} fontSize={15} fill="#E8E8F0" fontWeight={700}>{r.actor}</text>
                <text x={714} y={y + 30} textAnchor="end" fontSize={12.5} fill={INK}>{r.desc}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="fig-cap">China&apos;s edge is institutionally distributed — commercial scale, state electronics, ground robotics and a command structure built to integrate them.</figcaption>
    </figure>
  );
}

/* ── Figure 7 — Threat dashboard ── */
function ThreatFigure() {
  const tiles = [
    { name: 'Border Surveillance', risk: 'High', hz: 'Now–2028', c: CRIMSON },
    { name: 'Autonomous Logistics', risk: 'Medium', hz: '2026–2030', c: AMBER },
    { name: 'Drone Swarms', risk: 'Med-High', hz: '2027–2032', c: AMBER },
    { name: 'Electronic Warfare', risk: 'High', hz: 'Now–2030', c: CRIMSON },
    { name: 'ISR Saturation', risk: 'High', hz: 'Now–2030', c: CRIMSON },
    { name: 'Supply-Chain Denial', risk: 'High', hz: 'Now–2035', c: CRIMSON },
  ];
  return (
    <figure className="report-figure" id="fig-threat">
      <div className="fig-frame">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Strategic threat dashboard: automation-relevant pressures on India">
          <title>Strategic threat dashboard</title>
          {tiles.map((t, i) => {
            const r = Math.floor(i / 3), c = i % 3;
            const x = 30 + c * 238, y = 24 + r * 120;
            return (
              <g key={t.name}>
                <rect x={x} y={y} width={222} height={104} rx={9} fill={NAVYCARD} stroke={GRID} />
                <rect x={x} y={y} width={222} height={34} rx={9} fill={t.c} fillOpacity={0.9} />
                <text x={x + 14} y={y + 22} fontSize={13} fontWeight={700} fill={PAPER}>{t.name}</text>
                <text x={x + 14} y={y + 58} fontSize={10} fill={INK}>RISK</text>
                <text x={x + 14} y={y + 76} fontSize={14} fontWeight={700} fill={t.c}>{t.risk}</text>
                <text x={x + 208} y={y + 58} textAnchor="end" fontSize={10} fill={INK}>HORIZON</text>
                <text x={x + 208} y={y + 76} textAnchor="end" fontSize={13} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{t.hz}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="fig-cap">Six automation-relevant pressures on India, by risk and time horizon. Most are near-term and most route back to the same industrial dependencies.</figcaption>
    </figure>
  );
}

/* ── Figure 8 — iDEX conversion funnel ── */
function FunnelFigure() {
  const steps = [
    { label: 'Problem statements: 549', w: 600 },
    { label: 'Startups / MSMEs engaged: 600+', w: 540 },
    { label: 'Contracts awarded: 430', w: 430 },
    { label: 'Cleared prototypes: 40', w: 220 },
    { label: 'Production orders: ~31', w: 130 },
  ];
  return (
    <figure className="report-figure" id="fig-funnel">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The iDEX innovation funnel from problem statements to production orders">
          <title>The conversion funnel</title>
          {steps.map((s, i) => {
            const y = 30 + i * 50;
            const x = 380 - s.w / 2;
            const c = i < 3 ? TEAL : i === 3 ? AMBER : CRIMSON;
            return (
              <g key={s.label}>
                <rect x={x} y={y} width={s.w} height={36} rx={5} fill={c} fillOpacity={0.85} />
                <text x={380} y={y + 23} textAnchor="middle" fontSize={13} fill={PAPER} fontWeight={700}>{s.label}</text>
              </g>
            );
          })}
          <text x={380} y={290} textAnchor="middle" fontSize={11} fill={INK}>Hundreds of contracts; dozens of production orders. The leak sits between prototype and scale.</text>
        </svg>
      </div>
      <figcaption className="fig-cap">India&apos;s innovation funnel. In battlefield automation, conversion risk — not technology risk — is the binding constraint.</figcaption>
    </figure>
  );
}

/* ── Figure 9 — Opportunity map ── */
function OpportunityFigure() {
  const pts = [
    { n: 'Edge AI perception', x: 1.8, y: 1.6, s: 40, c: TEAL },
    { n: 'Simulation tools', x: 2.4, y: 1.9, s: 34, c: TEAL },
    { n: 'Counter-UAS analytics', x: 3.4, y: 2.5, s: 40, c: TEAL },
    { n: 'Battery packs / BMS', x: 2.6, y: 2.3, s: 38, c: BRASS },
    { n: 'Thermal integration', x: 3.7, y: 2.8, s: 32, c: BRASS },
    { n: 'Tactical mesh', x: 4.0, y: 3.3, s: 34, c: INK },
    { n: 'UGV mobility', x: 4.4, y: 3.8, s: 30, c: INK },
    { n: 'Maintenance analytics', x: 1.5, y: 1.4, s: 30, c: TEAL },
  ];
  const px = 250, py = 40, pw = 460, ph = 200;
  return (
    <figure className="report-figure" id="fig-opportunity">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Startup and SME opportunity map by technical difficulty and time to revenue">
          <title>Opportunity map</title>
          <rect x={px} y={py} width={pw} height={ph} fill={NAVYCARD} stroke={GRID} />
          {[1, 2, 3, 4].map((g) => (
            <g key={g}>
              <line x1={px + (pw * g) / 5} y1={py} x2={px + (pw * g) / 5} y2={py + ph} stroke={GRID} />
              <line x1={px} y1={py + (ph * g) / 5} x2={px + pw} y2={py + (ph * g) / 5} stroke={GRID} />
            </g>
          ))}
          <text x={px + pw / 2} y={py + ph + 30} textAnchor="middle" fontSize={12} fill={INK}>Technical difficulty →</text>
          <text x={px - 20} y={py + ph / 2} textAnchor="middle" fontSize={12} fill={INK} transform={`rotate(-90 ${px - 20} ${py + ph / 2})`}>Time to revenue →</text>
          {pts.map((p) => {
            const x = px + (pw * (p.x - 0.5)) / 5, y = py + (ph * (p.y - 0.5)) / 5, r = 7 + p.s / 8;
            return (
              <g key={p.n}>
                <circle cx={x} cy={y} r={r} fill={p.c} fillOpacity={0.75} />
                <text x={x} y={y + r + 11} textAnchor="middle" fontSize={9.5} fill="#E8E8F0">{p.n}</text>
              </g>
            );
          })}
          {[['Startup', TEAL], ['SME', BRASS], ['Mid-sized', INK]].map(([l, c], i) => (
            <g key={l as string}>
              <circle cx={px + i * 130} cy={py + ph + 50} r={7} fill={c as string} />
              <text x={px + i * 130 + 14} y={py + ph + 54} fontSize={11} fill={INK}>{l}</text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="fig-cap">The investable entry points are subsystems, not full platforms — and many can earn dual-use revenue before defence scale arrives.</figcaption>
    </figure>
  );
}

/* ── Figure 10 — Dual-use wheel ── */
function DualUseFigure() {
  const sectors = ['Mining', 'Logistics', 'Agriculture', 'Inspection', 'Manufacturing', 'Smart Infra.', 'Disaster Response', 'Energy', 'Ports / Rail'];
  const cx = 380, cy = 170, R = 130, n = sectors.length;
  return (
    <figure className="report-figure" id="fig-dualuse">
      <div className="fig-frame">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dual-use technology wheel: nine civilian sectors served by the same automation stack">
          <title>Dual-use technology wheel</title>
          <circle cx={cx} cy={cy} r={70} fill={NAVYCARD} stroke={BRASS} strokeWidth="1.5" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize={12} fill="#E8E8F0" fontWeight={700}>Automation</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize={12} fill="#E8E8F0" fontWeight={700}>stack</text>
          {sectors.map((s, i) => {
            const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
            const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
            const c = [TEAL, BRASS, INK][i % 3];
            return (
              <g key={s}>
                <line x1={cx + 70 * Math.cos(a)} y1={cy + 70 * Math.sin(a)} x2={x} y2={y} stroke={c} strokeOpacity={0.5} />
                <circle cx={x} cy={y} r={6} fill={c} />
                <text x={cx + (R + 24) * Math.cos(a)} y={cy + (R + 24) * Math.sin(a) + 4} textAnchor="middle" fontSize={11} fill="#E8E8F0" fontWeight={600}>{s}</text>
              </g>
            );
          })}
          <text x={380} y={306} textAnchor="middle" fontSize={10.5} fill={INK}>Shared tech: edge AI · drones · UGVs · thermal imaging · tactical mesh · batteries · simulation</text>
        </svg>
      </div>
      <figcaption className="fig-cap">The same stack that serves defence serves nine civilian sectors. Dual-use demand is what makes an Indian autonomy business bankable.</figcaption>
    </figure>
  );
}

/* ── Figure 11 — Three scenarios ── */
function ScenarioFigure() {
  const stages = ['Prototype', 'Test', 'Limited prod.', 'Field', 'Export'];
  const lanes = [
    { name: 'Slow Adaptation', reach: 2, c: CRIMSON },
    { name: 'Managed Transition', reach: 4, c: BRASS },
    { name: 'Autonomous Leader', reach: 5, c: TEAL },
  ];
  return (
    <figure className="report-figure" id="fig-scenarios">
      <div className="fig-frame">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three scenarios for India to 2035: how far each carries a system from prototype to export">
          <title>Three scenarios to 2035</title>
          {stages.map((s, i) => (
            <text key={s} x={250 + i * 120} y={36} textAnchor="middle" fontSize={10.5} fill={INK}>{s}</text>
          ))}
          {lanes.map((l, li) => {
            const y = 70 + li * 75;
            return (
              <g key={l.name}>
                <rect x={30} y={y} width={170} height={48} rx={6} fill={l.c} />
                <text x={45} y={y + 29} fontSize={13} fill={PAPER} fontWeight={700}>{l.name}</text>
                <line x1={250} y1={y + 24} x2={250 + 4 * 120} y2={y + 24} stroke={GRID} strokeWidth="3" />
                {stages.map((_, si) => (
                  <circle key={si} cx={250 + si * 120} cy={y + 24} r={11} fill={si < l.reach ? l.c : NAVYCARD} stroke={l.c} strokeWidth="2.5" />
                ))}
              </g>
            );
          })}
          <text x={30} y={306} fontSize={11} fill={INK}>Probability-weighted outcome: a credible regional node, not a peer of China. The difference is execution.</text>
        </svg>
      </div>
      <figcaption className="fig-cap">How far each scenario carries a system from prototype to export. The gap between lanes is industrial execution, not ambition.</figcaption>
    </figure>
  );
}

/* ── Figure 12 — National priority roadmap ── */
function RoadmapFigure() {
  const tracks = [
    { name: 'Demand & Procurement', c: TEAL, inits: [['1', 'Demand signals'], ['2', 'Procurement reform'], ['3', 'Export pathways']] },
    { name: 'Industrial Stack', c: BRASS, inits: [['4', 'Component roadmap'], ['5', 'Qualify SMEs'], ['6', 'Trusted sourcing']] },
    { name: 'Testing & Data', c: INK, inits: [['7', 'Test infrastructure'], ['8', 'Defence data'], ['9', 'Workforce']] },
  ];
  return (
    <figure className="report-figure" id="fig-roadmap">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="National priority roadmap across three tracks, 2026 to 2035">
          <title>National priority roadmap</title>
          <text x={230} y={28} fontSize={11} fill={INK}>2026</text>
          <text x={720} y={28} textAnchor="end" fontSize={11} fill={INK}>2035</text>
          {tracks.map((t, i) => {
            const y = 50 + i * 78;
            return (
              <g key={t.name}>
                <rect x={30} y={y} width={180} height={56} rx={7} fill={t.c} />
                <text x={46} y={y + 32} fontSize={13} fill={PAPER} fontWeight={700}>{t.name}</text>
                <line x1={230} y1={y + 28} x2={730} y2={y + 28} stroke={GRID} strokeWidth="2" />
                {t.inits.map((it, j) => {
                  const x = 270 + j * 155;
                  return (
                    <g key={it[0]}>
                      <circle cx={x} cy={y + 28} r={14} fill={t.c} />
                      <text x={x} y={y + 33} textAnchor="middle" fontSize={12} fill={PAPER} fontWeight={700} fontFamily="monospace">{it[0]}</text>
                      <text x={x + 22} y={y + 32} fontSize={11} fill="#E8E8F0">{it[1]}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="fig-cap">Nine of the report&apos;s priority initiatives, sequenced across three national tracks to 2035.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p className="serif" style={{ fontSize: 17, color: 'var(--text-muted)' }}>
        Battlefield automation is usually told as a story about drones and robots. It is better understood as a story
        about the industrial base beneath them — sensors, batteries, rugged electronics, radios, autonomy software and
        the test infrastructure that turns a prototype into a fielded system. This is the free, full reading version of
        the report; the complete 130-page edition is available as a free download below.
      </p>

      <h2 id="the-reframe">The reframe: an industrial race, not a procurement race</h2>
      <p>
        India can buy drones, run innovation challenges and field prototypes. But battlefield automation at national
        scale requires something harder: the ability to integrate seven industrial layers repeatedly and affordably.
        The countries that win this transition will not be the ones that purchase the most unmanned systems — they will
        be the ones whose <strong>industrial ecosystems</strong> can produce, test, upgrade and sustain them under
        crisis conditions. The gap that matters is therefore not between India and China as militaries, but between two
        industrial systems of different depth.
      </p>
      <p>
        This is the fourth great shift in how wars are fought. Each previous era — industrial, mechanised,
        informational — was defined less by its signature weapons than by the manufacturing base that produced them at
        scale. Autonomy is no different.
      </p>
      <EvolutionFigure />

      <h2 id="bari">The Battlefield Automation Readiness Index</h2>
      <p>
        To make the gap measurable rather than rhetorical, the report introduces the <strong>Battlefield Automation
        Readiness Index (BARI)</strong>. Each of eight industrial dimensions is scored 1–5 as the weighted average of
        four sub-indicators — supplier depth, technology control, deployment maturity, and testing &amp; validation —
        and the same scorecard is applied to India, China and the United States, and to every sector.
      </p>
      <BariRadar />
      <p>
        The pattern is stable and it is the report&apos;s central finding: <strong>India is strong at the ends of its
        value chains and hollow in the middle.</strong> Its software score is well ahead of its hardware, sensor and
        test scores; its defence-production momentum is ahead of its autonomy-specific industrial depth.
      </p>

      <h2 id="the-stack">Where the gap lives — below the platform layer</h2>
      <p>
        Battlefield automation rests on seven layers. The visible top of the stack — platforms and autonomy software —
        is where India is relatively strong. The decisive weaknesses sit underneath, in the layers a prototype cannot
        do without: thermal sensors, rugged embedded electronics, military-grade batteries, contested-environment
        communications, and the test ranges that validate all of it.
      </p>
      <StackFigure />
      <p>
        Scored input by input, the same shape recurs: the highest strategic importance and import exposure cluster on
        exactly the layers where domestic maturity is lowest — and those are also where the startup and SME
        opportunities are richest.
      </p>
      <HeatmapFigure />
      <p>
        This is why visible prototypes can be misleading. A country can demonstrate impressive autonomous systems while
        importing the sensors, cells and electronics that make them work — a dependence that is invisible in peacetime
        and acute under crisis resupply.
      </p>

      <h2 id="india-china">The quantified India–China gap</h2>
      <p>
        The gap can be anchored in hard numbers. China controls roughly <strong>70% of the global commercial-drone
        market</strong> (through DJI), about <strong>85% of global lithium-ion cell manufacturing</strong>, and around
        <strong> 90% of rare-earth processing</strong> — the inputs that motors, magnets and power systems depend on.
        India&apos;s defence production reached a record ~₹1.51 lakh crore and exports ₹23,622 crore in FY 2024-25, but
        those aggregates do not translate into autonomy-critical component depth.
      </p>
      <GapBars />

      <h2 id="china-edge">China&apos;s industrial edge is institutional</h2>
      <p>
        China&apos;s advantage is carried by identifiable actors, not an abstraction. Its doctrine of
        &quot;intelligentized warfare&quot; is a stated national modernisation goal, documented in the US Department of
        Defense&apos;s China Military Power Report — a direction India must assess through industrial trajectory, not
        episodic platform sightings.
      </p>
      <ChinaEcosystemFigure />

      <h2 id="the-threat">The threat picture for India</h2>
      <p>
        Read against India&apos;s specific geography and posture, the automation transition shows up as a set of
        concrete pressures — persistent border surveillance, autonomous logistics, drone swarms, electronic warfare,
        ISR saturation and supply-chain denial. Most are near-term, and most route back to the same industrial
        dependencies the stack exposes.
      </p>
      <ThreatFigure />

      <h2 id="conversion">The conversion problem</h2>
      <p>
        India&apos;s real asset is its software talent and a maturing defence-startup base. But the binding constraint
        is not the supply of ideas — it is <strong>conversion</strong>. The iDEX programme has issued hundreds of
        problem statements and awarded over 400 contracts, yet only a few dozen products have reached production orders.
      </p>
      <FunnelFigure />
      <p>
        The leak sits between prototype and scale, where four frictions compound: long acceptance-to-contract cycles
        that run years against 18–36-month technology cycles; sequential certification through DGQA, CEMILAC and DGAQA;
        the absence of committed volume that would justify a production line; and unclear requirements at the point of
        award. For builders and investors, the implication is precise: <strong>conversion risk dominates technology
        risk.</strong>
      </p>

      <h2 id="strengths">Where India is strong</h2>
      <p>
        The opportunities are real and they are modular. India&apos;s software and AI talent, its iDEX-backed startup
        ecosystem, its MSME manufacturing base, and its large dual-use markets let firms earn commercial revenue before
        defence scale arrives. The investable entry points are not full platforms but <strong>subsystems</strong>:
        edge-AI perception, simulation and test services, rugged compute, battery packs and BMS, counter-UAS analytics,
        and maintenance analytics.
      </p>
      <OpportunityFigure />
      <p>
        Crucially, the same stack that serves defence serves a wide set of civilian sectors. That dual-use demand —
        mining, logistics, agriculture, infrastructure inspection, energy — is what lets an Indian autonomy business
        reach revenue and scale before defence procurement catches up.
      </p>
      <DualUseFigure />

      <h2 id="scenarios">Three scenarios to 2035</h2>
      <p>
        The report models three futures, distinguished by how far India moves up the middle of the stack. In
        <strong> Slow Adaptation</strong>, scattered pilots sit on imported components with weak validation. In
        <strong> Managed Transition</strong> (most likely), India builds strong selected layers — drones, edge AI, test
        services and dual-use robotics. In <strong>Autonomous Capability Leader</strong> (least likely), it achieves
        trusted-source control of key components and export-ready systems.
      </p>
      <ScenarioFigure />
      <p>
        The probability-weighted outcome is a <em>credible regional node, not a peer of China</em> — but, measured
        against where India sits today, a significant industrial transformation. The differentiator between the paths
        is execution: coordinated demand, test infrastructure and trusted components, not ambition or talent.
      </p>

      <h2 id="the-roadmap">What India should do</h2>
      <p>
        The report closes with a sequenced national roadmap built on three tracks: shift the weight of policy from
        platforms to the middle of the stack; aggregate fragmented demand into a bankable signal; and build the test
        infrastructure, trusted-source supply and materials-and-process workforce that the midstream cannot run
        without. The clock starts the moment the investment is committed, because skills and separation capacity take
        years to build.
      </p>
      <RoadmapFigure />

      <h2 id="full-report">The full report</h2>
      <p>
        This reading version carries the argument and the framework. The complete <strong>130-page edition</strong> —
        free to download below — carries the evidence the way a decision-maker needs it: all seventeen chapters with
        per-sector chokepoint scorecards, the full BARI 2.0 methodology with confidence ratings, the quantified
        India–China indicators, market sizing and procurement economics, the startup, SME and mid-sized-industry
        roadmaps, a ten-initiative national priority roadmap, and seven appendices — across thirty figures on the
        Techadyant brand system.
      </p>
    </>
  );
}
