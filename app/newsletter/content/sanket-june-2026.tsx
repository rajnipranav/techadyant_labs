import Link from 'next/link';
import type { CSSProperties } from 'react';

/* ── palette ─────────────────────────────────────────────── */
const TEAL = '#2BC5B4';
const BRASS = '#C9A84C';
const CRIMSON = '#FB7185';
const GREEN = '#34D399';

const kicker: CSSProperties = {
  fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, letterSpacing: '.18em',
  textTransform: 'uppercase', color: TEAL, marginBottom: 10,
};
const fig: CSSProperties = {
  width: '100%', borderRadius: 14, border: '1px solid var(--border)', display: 'block',
  margin: '6px 0 8px', background: '#0B0F1A',
};
const cap: CSSProperties = {
  fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, color: 'var(--text-muted)',
  margin: '0 0 34px', textAlign: 'center',
};
const h2: CSSProperties = { fontSize: 'clamp(22px,2.6vw,30px)', margin: '0 0 16px', lineHeight: 1.2 };

function Kicker({ children }: { children: React.ReactNode }) {
  return <div style={kicker}>{children}</div>;
}
function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <figure style={{ margin: '0 0 8px' }}>
      <img src={src} alt={alt} style={fig} />
      {caption && <figcaption style={cap}>{caption}</figcaption>}
    </figure>
  );
}
function Callout({ label, tone, children }: { label: string; tone: string; children: React.ReactNode }) {
  return (
    <div style={{
      borderLeft: `3px solid ${tone}`, background: 'var(--surface)', borderRadius: '0 12px 12px 0',
      padding: '20px 24px', margin: '0 0 34px',
    }}>
      <div style={{ ...kicker, color: tone, marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  );
}
function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{
      borderTop: `2px solid ${BRASS}`, borderBottom: `2px solid ${BRASS}`, margin: '0 0 34px',
      padding: '26px 8px', textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic',
      fontSize: 'clamp(20px,2.4vw,27px)', lineHeight: 1.35, color: 'var(--text)',
    }}>
      {children}
    </blockquote>
  );
}
function Signal({ score, head, body, src }: { score: number; head: string; body: string; src: string }) {
  const band = score >= 75 ? ['HIGH CONVICTION', GREEN] : score >= 65 ? ['NOTABLE', BRASS] : ['EMERGING', 'var(--text-muted)'];
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', margin: '0 0 24px' }}>
      <div style={{
        flex: '0 0 92px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '12px 6px',
      }}>
        <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 30, fontWeight: 700, color: band[1] as string }}>{score}</div>
        <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 10, color: 'var(--text-muted)' }}>/ 100</div>
        <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 8.5, letterSpacing: '.08em', color: band[1] as string, marginTop: 6 }}>{band[0]}</div>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{head}</div>
        <p style={{ margin: '0 0 6px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{body}</p>
        <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, color: 'var(--text-dim, #8a8a99)' }}>SOURCE · {src}</div>
      </div>
    </div>
  );
}
function BoardRow({ name, score, tone, trend, basis }: { name: string; score: number; tone: string; trend: string; basis: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'baseline', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{name} <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, color: tone, marginLeft: 6 }}>{trend}</span></div>
        <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.55, marginTop: 3 }}>{basis}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 26, fontWeight: 700, color: tone, whiteSpace: 'nowrap' }}>{score}<span style={{ fontSize: 12, color: 'var(--text-muted)' }}> /100</span></div>
    </div>
  );
}
function LedgerRow({ move, why, corr, src }: { move: string; why: string; corr: string; src: string }) {
  return (
    <div style={{ padding: '14px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
        <strong style={{ fontSize: 15.5 }}>{move}</strong>
        <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 10.5, letterSpacing: '.06em', color: BRASS, border: '1px solid var(--border)', borderRadius: 5, padding: '2px 7px' }}>{corr}</span>
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.55 }}>{why} <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, color: 'var(--text-dim, #8a8a99)' }}>· {src}</span></div>
    </div>
  );
}
function ForecastCard({ prob, label, tone, children }: { prob: string; label: string; tone: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `4px solid ${tone}`, borderRadius: 10, padding: 20 }}>
      <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 28, fontWeight: 700, color: tone }}>{prob}</div>
      <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, letterSpacing: '.1em', margin: '4px 0 12px' }}>{label}</div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>{children}</p>
    </div>
  );
}

export function IssueContent() {
  return (
    <div className="report-body" style={{ padding: 0 }}>
      {/* AT A GLANCE */}
      <h2 id="at-a-glance" style={h2}>The issue at a glance</h2>
      <Figure src="/newsletter/june-at-a-glance.png" alt="Sanket June 2026 — Assembly is not sovereignty: the Sanket Index, the five-corridor Board, forecast and bottom line in one page"
        caption="One-page intelligence summary — the Board, the Sanket Index, forecast and bottom line." />

      {/* THE BOARD */}
      <Kicker>The Executive Board</Kicker>
      <h2 id="board" style={h2}>Five Corridors, Scored</h2>
      <p style={{ marginBottom: 18 }}>India’s industrial sovereignty, read corridor by corridor on the Dependency Capture Framework™ — how much of the value India <strong>captures</strong>, not how much it hosts. June sets the baseline; from Issue 03 each reading carries its month-over-month move.</p>
      <div style={{ margin: '0 0 22px' }}>
        <BoardRow name="Enterprise Software" score={40} tone={BRASS} trend="→ HOLD" basis="Deep services and design — but India runs on foreign ERP it does not control." />
        <BoardRow name="Defence & Dual-Use" score={38} tone={BRASS} trend="↑ RISING" basis="Strong integration and sovereign demand; motors, cells and controllers imported." />
        <BoardRow name="Semiconductors" score={34} tone={BRASS} trend="↑ RISING" basis="ATMP and substrate momentum (ISM); no leading-edge fab, tools and materials imported." />
        <BoardRow name="AI Infrastructure" score={30} tone={CRIMSON} trend="↑ RISING" basis="Data-centre build-out accelerating on silicon, HBM and accelerators it does not make." />
        <BoardRow name="Critical Minerals" score={22} tone={CRIMSON} trend="→ HOLD" basis="Weakest layer: ~100% rare-earth magnet import; schemes announced, zero output yet." />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-strong, var(--border))', marginTop: 6, paddingTop: 14 }}>
          <div><div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.12em', color: BRASS }}>THE SANKET INDEX</div><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>India Industrial Sovereignty — composite of the Board</div></div>
          <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 34, fontWeight: 700 }}>33<span style={{ fontSize: 14, color: 'var(--text-muted)' }}> /100</span> <span style={{ fontSize: 13, color: TEAL }}>BUILDING</span></div>
        </div>
      </div>
      <Figure src="/newsletter/june-hero-board.png" alt="Where India captures value and where it doesn't — the five corridors scored 0 to 100"
        caption="Strongest where India integrates and designs, weakest where it must own the atoms." />

      {/* BOTTOM LINE */}
      <Callout label="The Bottom Line" tone={BRASS}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>One finding ran through all nine of this month’s reports: India <strong>assembles</strong> — the value lives offshore, in the components it imports.</li>
          <li>Drones make it literal: India imported <strong>$8M of finished drones</strong> last year — and <strong>$767M of the parts</strong> inside them, plus $4.7bn of cells.</li>
          <li>The same pattern runs through software (foreign ERP), AI infrastructure (imported silicon) and minerals (imported magnets).</li>
          <li>The opening is upstream and ownable — components, packaging, cells, magnets, flight-control silicon — where <strong>~₹23 of every ₹100</strong> currently leaks abroad.</li>
          <li>Policy finally aimed there in June — <strong>ISM 2.0, the rare-earth magnet scheme, mineral corridors</strong> — but output, not announcements, is the test.</li>
        </ul>
      </Callout>

      {/* THESIS */}
      <Kicker>This Month’s Thesis</Kicker>
      <h2 id="thesis" style={h2}>Assembly Is Not Sovereignty</h2>
      <p>For a decade India’s industrial story was told in headline numbers — plants opened, PLI disbursed, assembly lines lit. This month, across nine Techadyant reports spanning drones, semiconductors, enterprise software and AI infrastructure, the same structural fact kept surfacing: hosting a value chain is not the same as capturing it.</p>
      <p>Drones are the clearest proof. India has built a credible integration and operations layer — it assembles, flies and fields drones at scale. But the motors, cells, flight controllers and sensors are imported. Customs settles the argument: $8M of finished drones came in last year against $767M of parts. India buys the parts, not the planes.</p>
      <p>The pattern repeats by corridor. In enterprise software the country runs on foreign ERP it does not control; in AI infrastructure it is racing to host data centres on silicon it does not make; in critical minerals it mines what it cannot yet refine. Each is a different layer of the same dependency.</p>
      <p style={{ marginBottom: 30 }}>The opening is upstream, and it is real. The value India fails to capture — components, processing, cells, magnets, design-to-silicon — is exactly where June’s policy moved: ISM 2.0, the rare-earth magnet scheme, dedicated mineral corridors. The window is measured in quarters. The test is whether the value-add line moves — not whether more ribbons are cut.</p>

      {/* ONE CHART */}
      <Kicker>One Chart</Kicker>
      <h2 id="one-chart" style={h2}>Parts, Not Planes</h2>
      <Figure src="/newsletter/june-one-chart.png" alt="India's imports FY2025-26: finished drones $8M vs parts $767M vs magnets $222M vs lithium-ion cells $4,697M"
        caption="India imports almost no finished drones — and billions in the parts that go inside them." />
      <Callout label="The Takeaway" tone={BRASS}>
        <p style={{ margin: 0, fontWeight: 600 }}>The trade data is the thesis: the value India is missing sits one layer up — in the components, cells and silicon it buys instead of builds.</p>
      </Callout>

      {/* LEDGER */}
      <Kicker>The Ledger</Kicker>
      <h2 id="ledger" style={h2}>What Actually Moved in June</h2>
      <p style={{ marginBottom: 8 }}>The month’s hard moves — capital, policy and capacity — tagged by corridor and sourced.</p>
      <div style={{ margin: '0 0 34px' }}>
        <LedgerRow move="ISM 2.0 funded in Budget 2026–27" corr="SEMICONDUCTORS" src="PIB · ISM" why="₹1,000 cr for FY26–27, weighted to ATMP/OSAT — the demand-and-packaging pivot, not another fab chase." />
        <LedgerRow move="Two more chip projects cleared" corr="SEMICONDUCTORS" src="PIB" why="Cabinet approves Crystal Matrix (Dholera) and Suchi Semicon (Surat OSAT) — 12 facilities, ~₹1.64 lakh cr." />
        <LedgerRow move="Dedicated Rare-Earth Corridors announced" corr="CRITICAL MINERALS" src="PIB · DD News" why="Odisha, Kerala, AP and TN — linking mining to processing and magnet output in one chain." />
        <LedgerRow move="Magnet scheme moves toward output" corr="CRITICAL MINERALS" src="Outlook Business" why="REPM scheme ₹7,280 cr / 6,000 MTPA; minister targets first domestic magnet production by end-2026." />
        <LedgerRow move="ONDC raises ₹220 cr" corr="ENTERPRISE SW" src="Inc42 · ET" why="Zoho, Uber, Paytm and BSE back India’s open digital-commerce rails — a sovereign alternative to gatekeepers." />
        <LedgerRow move="China tightens outbound controls" corr="CROSS-CORRIDOR" src="ET Tech" why="Authorisation now required to export restricted goods, technology and data — sharpening every dependency through China." />
        <LedgerRow move="Global AI capex still climbing" corr="AI INFRA" src="Data Center Dynamics" why="Alphabet’s ~$80bn build-out (Berkshire-funded) keeps the compute supply chain tight — and the import bill rising." />
      </div>

      {/* SIGNALS */}
      <Kicker>Signal of the Month · 78 / 100</Kicker>
      <h2 id="signals" style={h2}>India’s Chip Startups Cross Into Production — on a Supply Chain They Don’t Control</h2>
      <p>Indian semiconductor startups are moving from prototype to commercial production on government incentives — a genuine step up the stack. But the wafers, tools and packaging they depend on remain China- and Taiwan-controlled. It is the thesis in miniature: India can design and build, while the atoms underneath stay foreign.</p>
      <p style={{ marginBottom: 24 }}><strong>The tell to watch:</strong> whether a domestic supplier base forms around these firms — or whether India’s chip startups become design houses dependent on imported inputs and offshore capacity.</p>

      <Kicker>Three Signals That Matter</Kicker>
      <div style={{ margin: '6px 0 30px' }}>
        <Signal score={75} head="India bets on magnets, not just mines." src="PIB · Outlook Business"
          body="The ₹7,280 cr rare-earth magnet scheme funds 6,000 MTPA of capacity, with first production targeted by end-2026. India is finally backing the processing chokepoint, not the ore. The risk: a capacity gap before any line produces." />
        <Signal score={74} head="Strategic capital backs sovereign rails." src="Inc42 · Economic Times"
          body="ONDC raises ₹220 cr from Zoho, Uber, Paytm and BSE — strategic, not financial, investors backing an open-network alternative to platform gatekeepers. The signal: India is building digital-commerce infrastructure it can govern." />
        <Signal score={75} head="Beijing sharpens the dependency." src="Economic Times Tech"
          body="China tightens outbound investment and tech-export rules, requiring authorisation to ship restricted goods, technology and data. Every Indian supply chain that routes through China just got riskier — and the case for upstream localisation stronger." />
      </div>

      {/* KEY JUDGEMENT */}
      <Callout label="Key Judgement · Confidence: Moderate" tone={TEAL}>
        <p style={{ marginTop: 0 }}>We assess that India’s binding constraint across all five corridors in 2026 is not demand or assembly capacity but upstream capture — components, processing and materials. June’s policy moves (ISM 2.0, the magnet scheme, mineral corridors) are correctly aimed at that layer.</p>
        <p style={{ marginBottom: 0 }}><strong style={{ color: CRIMSON }}>Principal risk:</strong> the familiar one — incentives pooling in assembly while the hard inputs stay imported. Confidence is capped by India’s execution record on value-addition targets and by an 18–30 month lag before any new upstream capacity produces.</p>
      </Callout>

      {/* ECOSYSTEM MAP */}
      <Kicker>Emerging Ecosystem Map</Kicker>
      <h2 style={h2}>Where the Value Goes</h2>
      <Figure src="/newsletter/june-value-flow.png" alt="Where the value goes in a drone India builds: ~43% captured, ~57% leaks to imported parts, ~66% potential"
        caption="India captures ~43% of a drone’s value today; close the upstream gaps and capture rises toward ~66%." />

      {/* FRAMEWORK */}
      <Kicker>The Techadyant Framework</Kicker>
      <h2 id="framework" style={h2}>The Dependency Capture Framework™</h2>
      <Figure src="/newsletter/june-framework.png" alt="Dependency Capture Framework — India scores highest in services and design (L6) and lowest in processing and materials (L2)"
        caption="Where India captures value, layer by layer. The hardware decade is decided in L1–L3." />
      <Quote>“India doesn’t lack factories. It lacks the layer underneath them.”</Quote>

      {/* FROM THE LAB */}
      <Kicker>From the Lab This Month</Kicker>
      <h2 id="from-the-lab" style={h2}>Nine Reports, One Lens</h2>
      <p style={{ marginBottom: 8 }}>June’s research, each in a line and a number — the evidence behind this month’s thesis.</p>
      <ul style={{ margin: '0 0 30px', paddingLeft: 20, lineHeight: 1.9 }}>
        <li><Link href="/reports/indias-unmanned-warfare-transformation/" style={{ color: 'var(--primary, #818CF8)' }}>India’s Unmanned Warfare Transformation</Link> — the Army’s UAS and loitering-munition roadmap to 2035, and the ~₹40,000 cr subsystem prize beneath the airframe.</li>
        <li><Link href="/reports/who-builds-indias-drones/" style={{ color: 'var(--primary, #818CF8)' }}>Who Builds India’s Drones?</Link> — $767M of parts vs $8M of finished drones.</li>
        <li><Link href="/reports/india-drone-propulsion-opportunity/" style={{ color: 'var(--primary, #818CF8)' }}>India’s Drone Propulsion Opportunity</Link> — a ~$1bn motor, ESC and jet-propulsion market by 2036.</li>
        <li><Link href="/reports/indias-drone-battery-ecosystem/" style={{ color: 'var(--primary, #818CF8)' }}>India’s Drone Battery Ecosystem</Link> — the cell-not-pack gap: ~60GWh pack vs ~1GWh cell.</li>
        <li><Link href="/reports/drone-electronics-flight-controllers/" style={{ color: 'var(--primary, #818CF8)' }}>Who Controls India’s Drones?</Link> — ~90% of small-drone flight controllers imported.</li>
        <li><Link href="/reports/india-drone-sensors-payloads-imaging-market/" style={{ color: 'var(--primary, #818CF8)' }}>India Drone Sensors, Payloads & Imaging</Link> — the most import-bound layer of all, sized to 2035.</li>
        <li><Link href="/reports/the-opportunity-beyond-the-fab/" style={{ color: 'var(--primary, #818CF8)' }}>The Opportunity Beyond the Fab</Link> — 100 startup and MSME opportunities, scored and ranked.</li>
        <li><Link href="/reports/the-sap-question/" style={{ color: 'var(--primary, #818CF8)' }}>The SAP Question</Link> — who really controls the enterprise software India runs on (free).</li>
        <li><Link href="/reports/the-end-of-the-application-era/" style={{ color: 'var(--primary, #818CF8)' }}>The End of the Application Era</Link> — who captures computing when the application disappears (free).</li>
      </ul>

      {/* CONTRARIAN */}
      <Callout label="Contrarian View" tone={CRIMSON}>
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 22 }}>“Make in India” Is Working — That’s the Problem</h3>
        <p>Consensus reads record assembly and PLI disbursal as success. We’d be careful. Assembly that imports its hard inputs is activity, not capability: it books revenue while the margin and the dependency stay offshore — which is precisely what the drone trade data shows.</p>
        <p style={{ marginBottom: 0 }}>The metric that matters isn’t units made or plants opened; it’s <strong>domestic value-add per unit</strong> and whether India owns the chokepoints. Cheer the factories. Stay sceptical until the value-add line actually moves.</p>
      </Callout>

      {/* FORECAST */}
      <Kicker>Forecast · India’s Upstream Value Capture by 2030</Kicker>
      <h2 id="forecast" style={h2}>Three Ways This Plays Out</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '6px 0 36px' }}>
        <ForecastCard prob="55%" label="BASE CASE" tone="var(--text)">India captures meaningful upstream share in packaging, cells or magnets, but stays dependent on imported tools and materials. Value up, ceiling visible.</ForecastCard>
        <ForecastCard prob="25%" label="BULL CASE" tone={GREEN}>The new schemes seed real supplier clusters; India crosses into chokepoint ownership in at least one corridor — magnets or advanced packaging.</ForecastCard>
        <ForecastCard prob="20%" label="BEAR CASE" tone={CRIMSON}>Incentives fund assembly again; capacity scales but value leaks — Make-in-India 1.0 repeated one layer up. Floor space, not chokepoints.</ForecastCard>
      </div>

      {/* GO DEEPER */}
      <Callout label="Go Deeper" tone={TEAL}>
        <p style={{ marginTop: 0 }}>Own the layer, not the floor space. The full June catalogue:</p>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li><Link href="/reports/" style={{ color: TEAL }}>Browse all reports →</Link></li>
          <li>Forthcoming: <strong>The Packaging Frontier</strong> — OSAT and advanced packaging, the deep-dive behind this month’s framework.</li>
          <li>Commission bespoke research or a DPR → <Link href="/services/" style={{ color: 'var(--primary, #818CF8)' }}>labs.techadyant.com/services</Link></li>
        </ul>
      </Callout>
    </div>
  );
}
