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
      <Figure src="/newsletter/july-at-a-glance.png" alt="Sanket July 2026 — The Opportunity Economy: the Sanket Index, the five-corridor Board with deltas, the prize sized, and the bottom line in one page"
        caption="One-page intelligence summary — the Board, the Sanket Index, the prize sized, and the bottom line." />

      {/* THE BOARD */}
      <Kicker>The Executive Board</Kicker>
      <h2 id="board" style={h2}>Five Corridors, Now Moving</h2>
      <p style={{ marginBottom: 18 }}>India’s industrial sovereignty, read corridor by corridor on the Dependency Capture Framework™ — how much of the value India <strong>captures</strong>, not how much it hosts. June set the baseline; from this issue each reading carries its month-over-month move.</p>
      <div style={{ margin: '0 0 22px' }}>
        <BoardRow name="Enterprise Software" score={40} tone={BRASS} trend="→ HOLD" basis="Deep services and design — but India still runs on foreign ERP it does not control." />
        <BoardRow name="Defence & Dual-Use" score={39} tone={BRASS} trend="↑ +1" basis="Opportunity mapped end to end this month; motors, cells and controllers still imported." />
        <BoardRow name="Semiconductors" score={36} tone={BRASS} trend="↑ +2" basis="Semicon 2.0 widens state support beyond the fab into machines, materials and chemicals." />
        <BoardRow name="AI Infrastructure" score={31} tone={BRASS} trend="↑ +1" basis="Quantum and industrial-water maps put a number on the enabling layer beneath compute." />
        <BoardRow name="Critical Minerals" score={23} tone={CRIMSON} trend="↑ +1" basis="Processing roadmap and magnet scheme set the direction; domestic output still zero." />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-strong, var(--border))', marginTop: 6, paddingTop: 14 }}>
          <div><div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.12em', color: BRASS }}>THE SANKET INDEX</div><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>India Industrial Sovereignty — composite of the Board</div></div>
          <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 34, fontWeight: 700 }}>34<span style={{ fontSize: 14, color: 'var(--text-muted)' }}> /100</span> <span style={{ fontSize: 13, color: TEAL }}>BUILDING ↑ +1</span></div>
        </div>
      </div>
      <Figure src="/newsletter/july-hero-board.png" alt="Where India captures value and where it's moving — five corridors scored 0 to 100 with the change on June"
        caption="Four of five corridors ticked up in July as policy and opportunity maps landed. ( ) = change vs June." />

      {/* BOTTOM LINE */}
      <Callout label="The Bottom Line" tone={BRASS}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Eight July reports map one thing: <strong>where India can build and own</strong> — sized, ranked and mostly upstream.</li>
          <li>Four maps alone size <strong>~₹1.5 lakh crore</strong> of India-serviceable opportunity this decade — Semicon 2.0, quantum, industrial water and cargo drones.</li>
          <li>Semicon 2.0 confirmed the shift: <strong>₹1.27 lakh crore</strong> now reaches machines, materials, chemicals and gases — the 65% of chip value beyond the fab.</li>
          <li>The critical-minerals roadmap named <strong>processing</strong> as the missing layer — China holds 60–90% of it, and India’s magnet output is still zero.</li>
          <li>The maps are the easy part. The test is <strong>conversion</strong> — serviceable ₹ becoming captured ₹, on an 18–30 month capacity lag.</li>
        </ul>
      </Callout>

      {/* THESIS */}
      <Kicker>This Month’s Thesis</Kicker>
      <h2 id="thesis" style={h2}>The Opportunity Economy</h2>
      <p>June named the problem: India assembles, but the value lives upstream in the layers it does not own. July answers the obvious next question — so where, precisely, is the opportunity? Read together, this month’s eight Techadyant reports are one thing: a map of India’s opportunity economy — the specific, sized, mostly-upstream layers a founder, a fund or a ministry can actually build and own.</p>
      <p>The maps are large and they agree with each other. Semicon 2.0 sizes ₹45,500 crore of serviceable opportunity beyond the fab; the quantum ecosystem roughly ₹40,000 crore; industrial water about the same by 2030; civil cargo-drone demand ₹18,400 crore of fleet value by 2035. Four maps alone come to about ₹1.5 lakh crore — before counting the loitering-munition, SME-drone and critical-mineral-processing opportunities sized inside their own reports.</p>
      <p>They cluster in the same place. Plot the eight on the Dependency Capture Framework and six of eight target Layers 2 to 4 — processing, materials and components. The opportunity economy is upstream of the visible platform, precisely where India’s capture is thinnest and its import bill highest.</p>
      <p style={{ marginBottom: 30 }}>Policy moved to meet it. Semicon 2.0’s second pillar, the National Critical Mineral Mission’s processing focus, the rare-earth magnet scheme — July’s policy aimed at exactly the layers the maps did. The opportunity is now named and priced. The decade’s question is no longer identification; it is conversion.</p>

      {/* ONE CHART */}
      <Kicker>The Opportunity Economy, Sized</Kicker>
      <h2 id="one-chart" style={h2}>This Month’s Maps, in ₹ Crore</h2>
      <Figure src="/newsletter/july-one-chart.png" alt="The opportunity economy sized: Semicon 2.0 ₹45,500 cr, Quantum ₹43,000 cr, Industrial water ₹40,000 cr, Cargo drones ₹18,400 cr"
        caption="Four of July’s eight maps size a ~₹1.5 lakh crore serviceable opportunity — concentrated upstream." />
      <Callout label="The Takeaway" tone={BRASS}>
        <p style={{ margin: 0, fontWeight: 600 }}>The prize is real, and it points upstream — into the processing, materials and components layers India still imports. A market-size deck is not a plant; the test is conversion.</p>
      </Callout>

      {/* OPPORTUNITY SCOREBOARD */}
      <Kicker>Industrial Opportunity Scoreboard</Kicker>
      <h2 id="scoreboard" style={h2}>The Prize, on One Board</h2>
      <p style={{ marginBottom: 14 }}>This month’s maps as a dashboard, not a narrative — each opportunity sized, graded and tagged to the trigger that opened it. Every row is a candidate <strong>opportunity surface</strong> in the Atlas.</p>
      <div style={{ overflowX: 'auto', margin: '0 0 8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ textAlign: 'left' }}>
            {['Opportunity', 'Size', 'Confidence', 'Horizon', 'Trigger'].map((hd) => (
              <th key={hd} style={{ padding: '10px 12px', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.06em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{hd}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['Semiconductor materials & equipment', '₹45,500 cr', 'High', '3–5 yrs', 'Semicon 2.0'],
              ['Quantum ecosystem', '~₹40,000 cr', 'Medium', '5–10 yrs', 'National Quantum Mission'],
              ['Industrial water & ZLD', '~₹38,600 cr', 'High', '3–5 yrs', 'Reuse / ZLD mandates'],
              ['Cargo-drone fleet & services', '₹18,400 cr', 'Medium', '5–10 yrs', 'BVLOS corridors'],
              ['Rare-earth magnets', 'Import-sub', 'Medium', '2–5 yrs', 'REPM scheme'],
              ['Loitering-munition subsystems', 'Large (modelled)', 'Medium', '3–7 yrs', 'Op Sindoor demand'],
              ['Quantum hardware & cryogenics', 'Import-sub', 'Medium', '5–10 yrs', 'National Quantum Mission'],
              ['Drone SME / MRO layer', 'Fragmented', 'Medium', '0–5 yrs', 'Drone Rules / PLI'],
            ].map((r) => (
              <tr key={r[0]} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r[0]}</td>
                <td style={{ padding: '10px 12px', fontFamily: 'var(--font-jetbrains, monospace)', fontWeight: 700 }}>{r[1]}</td>
                <td style={{ padding: '10px 12px', fontFamily: 'var(--font-jetbrains, monospace)', color: r[2] === 'High' ? GREEN : BRASS }}>{r[2]}</td>
                <td style={{ padding: '10px 12px', fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-muted)' }}>{r[3]}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11.5, color: 'var(--text-dim, #8a8a99)', margin: '0 0 34px' }}>Size = each report’s own India-serviceable estimate; import-sub = import-substitution play. Confidence and horizon are Techadyant assessments.</p>

      {/* LEDGER */}
      <Kicker>The Ledger</Kicker>
      <h2 id="ledger" style={h2}>What Actually Moved in July</h2>
      <p style={{ marginBottom: 8 }}>The month’s hard moves — capital, policy and capacity — tagged by corridor and sourced.</p>
      <div style={{ margin: '0 0 34px' }}>
        <LedgerRow move="Semicon 2.0 cleared by Cabinet" corr="SEMICONDUCTORS" src="PIB" why="~₹1.27 lakh cr across six pillars — the second finally funds the machines, materials, chemicals and gases beneath the fab." />
        <LedgerRow move="Critical-minerals roadmap set" corr="CRITICAL MINERALS" src="PIB" why="NCMM (₹16,300 cr + ~₹18,000 cr PSU) and a ₹1,500 cr recycling scheme put processing, not just mining, at the centre." />
        <LedgerRow move="Rare-earth magnet scheme funds output" corr="CRITICAL MINERALS" src="PMIndia" why="REPM ₹7,280 cr / 6,000 MTPA moves toward first domestic sintered-magnet production — backing the chokepoint, not the ore." />
        <LedgerRow move="China sharpens the feedstock chokepoint" corr="CROSS-CORRIDOR" src="USGS · IEA" why="Licensing on gallium and germanium — where China refines 98% and 77% — tightens the materials layer beneath every fab." />
        <LedgerRow move="Quantum mission scaled up" corr="STRATEGIC TECH" src="PRS · Budget" why="NQM funding raised toward ₹900 cr; India’s quantum-industrial base — sensors, cryogenics, control — starts to form." />
        <LedgerRow move="Civil cargo-drone demand quantified" corr="LOGISTICS" src="Techadyant" why="Demand maps to ~50,200 drones and ₹18,400 cr of fleet value by 2035, led by healthcare, mining and industrial campuses." />
        <LedgerRow move="Industrial water turns non-discretionary" corr="INDUSTRIAL INFRA" src="Frost & Sullivan" why="Enforcement — ZLD and reuse mandates — converts water compliance into a ~US$4.65 bn market by 2030." />
      </div>

      {/* SIGNALS */}
      <Kicker>Signal of the Month · 78 / 100</Kicker>
      <h2 id="signals" style={h2}>Semicon 2.0 Confirms the Opportunity Is Beyond the Fab</h2>
      <p>In July the Cabinet cleared Semicon 2.0 — and for the first time state support reaches the machines, materials, chemicals and gases beneath the fab. That is the whole thesis in a policy document: the fab is about 35% of the value; the other 65% — and 78% of the margin — sits in the eight upstream streams India imports. The programme is, in effect, a demand signal for exactly the SME-shaped opportunity: precision machining, cleanroom systems, specialty chemicals, metrology and packaging.</p>
      <p style={{ marginBottom: 24 }}><strong>The tell to watch:</strong> whether pillar two — machines, materials, chemicals and gases — is notified with real allocations and eligibility, or stays a line in a press release.</p>

      <Kicker>Three Signals That Matter</Kicker>
      <div style={{ margin: '6px 0 30px' }}>
        <Signal score={76} head="India names the missing layer: processing." src="IEA · PIB"
          body="The critical-minerals roadmap reframes mineral security as a midstream problem — refining, separation and magnets — where China holds 60–90% and India holds almost none. The opportunity, and the vulnerability, is the processing node, not the ore." />
        <Signal score={74} head="Rare-earth magnets become a funded priority." src="PMIndia"
          body="The ₹7,280 cr REPM scheme backs 6,000 MTPA of sintered-magnet capacity, with first production targeted by end-2026. India is finally funding the chokepoint, not the mine. The risk: an output gap before any line runs." />
        <Signal score={72} head="Beijing tightens the semiconductor feedstock." src="USGS · IEA"
          body="China’s licensing on gallium and germanium — where it refines 98% and 77% of world supply — sharpens the materials dependency beneath every Indian fab, and strengthens the case for a domestic high-purity base." />
      </div>

      {/* KEY JUDGEMENT */}
      <Callout label="Key Judgement · Confidence: Moderate" tone={TEAL}>
        <p style={{ marginTop: 0 }}>We assess that India spent July converting diagnosis into a map: across eight reports the opportunity economy is now sized and located — overwhelmingly in the upstream layers (L2–L4) it imports. July’s policy — Semicon 2.0, the minerals roadmap, the magnet scheme — is aimed correctly at that layer.</p>
        <p style={{ marginBottom: 0 }}><strong style={{ color: CRIMSON }}>Principal risk:</strong> the maps outrun execution — serviceable opportunity that never becomes captured value, on the familiar 18–30 month capacity lag. A market-size deck is not a plant. Confidence is capped by India’s record on value-addition targets.</p>
      </Callout>

      {/* ECOSYSTEM MAP */}
      <Kicker>Emerging Ecosystem Map</Kicker>
      <h2 style={h2}>Where the Opportunity Sits</h2>
      <Figure src="/newsletter/july-value-flow.png" alt="Eight July reports mapped to the value-chain layer each opportunity targets — six of eight land in L2 to L4"
        caption="Six of eight maps target L2–L4 — processing, materials and components: the layers India imports." />

      {/* FRAMEWORK */}
      <Kicker>The Techadyant Framework</Kicker>
      <h2 id="framework" style={h2}>The Dependency Capture Framework™</h2>
      <Figure src="/newsletter/july-framework.png" alt="Dependency Capture Framework — India scores highest in services and design (L6) and lowest in processing and materials (L2)"
        caption="Every opportunity July sized targets the thin middle — L2–L4 — the layers that decide the hardware decade." />
      <Quote>“The opportunity isn’t hidden anymore. It’s upstream — and now it’s priced.”</Quote>

      {/* CAPABILITY GAP */}
      <Kicker>Capability Gap of the Month</Kicker>
      <h2 id="capability-gap" style={h2}>Rare-Earth Magnets</h2>
      <p style={{ marginBottom: 16 }}>Sanket’s signature teardown of one capability India does not yet own — from imports to the investment it would take to close. <strong>Deposits a capability score to the Atlas: India ~5 / 100.</strong></p>
      <div style={{ margin: '0 0 34px' }}>
        {[
          ['Current capability', 'Effectively zero commercial sintered NdFeB output. Only light rare-earth processing (monazite) exists, at DAE / IREL.', CRIMSON],
          ['Imports', '~100% of magnet-grade NdFeB, almost entirely from China — which controls ~90% of global rare-earth separation.', CRIMSON],
          ['Domestic players', 'IREL (monazite, light REs), Midwest Advanced Materials, HREPL; Vedanta and others exploring. None at commercial heavy-RE or sintered-magnet scale.', BRASS],
          ['Technology gaps', 'Heavy rare-earth separation (Dy, Tb), rare-earth metal-making, and sintering to defence-grade specs — the hard chemistry, all offshore.', BRASS],
          ['Investment opportunity', 'REPM scheme: ₹7,280 cr for 6,000 MTPA across up to five beneficiaries — a sales-linked incentive on the chokepoint, not the ore.', GREEN],
          ['Policy support', 'REPM scheme + National Critical Mineral Mission (₹16,300 cr) + ₹1,500 cr recycling scheme.', GREEN],
          ['Timeline', 'First domestic sintered magnet targeted end-2026; commercial heavy-RE separation and scale realistically 2028+.', 'var(--text-muted)'],
        ].map((r) => (
          <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: 14, padding: '12px 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, letterSpacing: '.04em', color: r[2], textTransform: 'uppercase' }}>{r[0]}</div>
            <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{r[1]}</div>
          </div>
        ))}
      </div>

      {/* FROM THE LAB */}
      <Kicker>From the Lab This Month</Kicker>
      <h2 id="from-the-lab" style={h2}>Eight Reports, One Lens</h2>
      <p style={{ marginBottom: 8 }}>July’s research, each in a line and a number — the map behind this month’s thesis.</p>
      <ul style={{ margin: '0 0 30px', paddingLeft: 20, lineHeight: 1.9 }}>
        <li><Link href="/reports/semicon-2-0-opportunity-map/" style={{ color: 'var(--primary, #818CF8)' }}>The Semicon 2.0 Opportunity Map</Link> — the eight streams beyond the fab; ₹45,500 cr serviceable by 2035.</li>
        <li><Link href="/reports/critical-minerals-strategic-roadmap/" style={{ color: 'var(--primary, #818CF8)' }}>Securing India’s Industrial Future</Link> — the critical-minerals processing roadmap to 2035; China holds 60–90% of processing (free).</li>
        <li><Link href="/reports/beyond-quantum-computing/" style={{ color: 'var(--primary, #818CF8)' }}>Beyond Quantum Computing</Link> — India’s quantum industrial ecosystem; ~₹40,000 cr TAM by 2035.</li>
        <li><Link href="/reports/india-industrial-water-opportunity-map/" style={{ color: 'var(--primary, #818CF8)' }}>India’s Industrial Water Opportunity Map</Link> — the market regulation is forcing into being; US$2.87bn → 4.65bn by 2030.</li>
        <li><Link href="/reports/india-cargo-drone-market/" style={{ color: 'var(--primary, #818CF8)' }}>India’s Cargo Drone Demand Intelligence</Link> — civil cargo-drone demand; 850 → 50,200 drones by 2035.</li>
        <li><Link href="/reports/india-loitering-munitions-market/" style={{ color: 'var(--primary, #818CF8)' }}>India’s Loitering Munitions Market Intelligence</Link> — the loitering-munition decade and the subsystem sovereignty gap.</li>
        <li><Link href="/reports/the-sme-playbook-for-indias-drone-economy/" style={{ color: 'var(--primary, #818CF8)' }}>The SME Playbook for India’s Drone Economy</Link> — the ₹50 lakh–5 cr opportunity layer, mapped and ranked.</li>
        <li><Link href="/reports/quantum-supply-chain/" style={{ color: 'var(--primary, #818CF8)' }}>The Hidden Supply Chain of Quantum Computing</Link> — where quantum value really sits (cryogenics, control, photonics); the qubit chip is under 8% of system cost.</li>
      </ul>

      {/* ATLAS INTELLIGENCE */}
      <Kicker>Atlas Intelligence</Kicker>
      <h2 id="atlas-intelligence" style={h2}>What’s New in the Graph</h2>
      <p style={{ marginBottom: 8 }}>The Atlas is alive: this is what the knowledge graph gained this cycle — the permanent record every report and signal deposits.</p>
      <ul style={{ margin: '0 0 34px', paddingLeft: 20, lineHeight: 1.85 }}>
        <li><strong>+269 entities, +301 relationships</strong> — the report→graph extraction pass grew the SID’s active graph by roughly two-thirds.</li>
        <li><strong>Public Atlas: 116 → 246 players</strong> — a curation pass promoted the strongest new nodes into <Link href="/research/" style={{ color: 'var(--primary, #818CF8)' }}>the public directory</Link>.</li>
        <li><strong>Five pillar maps went live</strong> — Semiconductors, Critical Minerals, AI Infrastructure, Defence and Enterprise Software.</li>
        <li><strong>Critical-minerals cluster added</strong> — NCMM, the REPM magnet scheme, IREL, Midwest and the rare-earth chain — the graph behind this month’s Capability Gap.</li>
        <li><strong>Six new signals (S-017–S-022)</strong> — the critical-minerals processing cluster entered the record, each sourced and scored.</li>
      </ul>

      {/* CONTRARIAN */}
      <Callout label="Contrarian View" tone={CRIMSON}>
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 22 }}>Sizing the Opportunity Is the Easy Part</h3>
        <p>Consensus will read eight opportunity maps and a ₹1.5 lakh crore number as momentum. We’d be careful. India has never lacked market-size decks; it has lacked conversion — the refineries, the magnet lines, the specialty-chemical plants that turn a serviceable number into a captured one.</p>
        <p style={{ marginBottom: 0 }}>A TAM is not a plant. The maps are necessary and now they exist — but the metric that matters is <strong>domestic value-add per unit</strong> and first output, not the size of the prize. Cheer the maps. Stay sceptical until the first line actually runs.</p>
      </Callout>

      {/* FORECAST */}
      <Kicker>Forecast · India’s Upstream Value Capture by 2030</Kicker>
      <h2 id="forecast" style={h2}>Three Ways This Plays Out</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '6px 0 36px' }}>
        <ForecastCard prob="55%" label="BASE CASE" tone="var(--text)">India converts one or two of these maps into real upstream capacity — a magnet line, a packaging cluster — but stays input-dependent elsewhere. Value up, ceiling visible.</ForecastCard>
        <ForecastCard prob="25%" label="BULL CASE" tone={GREEN}>The new schemes seed real supplier clusters; India crosses into chokepoint ownership in at least one corridor — magnets or advanced packaging.</ForecastCard>
        <ForecastCard prob="20%" label="BEAR CASE" tone={CRIMSON}>The maps stay maps; incentives pool in assembly again; another sized-but-uncaptured decade — the prize named, not owned.</ForecastCard>
      </div>

      {/* QUESTIONS + ATLAS NEEDS DATA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, margin: '0 0 34px' }}>
        <Callout label="Questions We Couldn’t Answer" tone={CRIMSON}>
          <p style={{ marginTop: 0, marginBottom: 10 }}>The open gaps in this month’s record. If you can close one, tell us.</p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>India’s true semiconductor-chemical (electronic-grade) capacity?</li>
            <li>Gallium and germanium refining capability, in tonnes?</li>
            <li>Rare-earth separation capacity by element?</li>
            <li>India’s drone fleet, by state?</li>
          </ul>
        </Callout>
        <Callout label="The Atlas Needs Data" tone={TEAL}>
          <p style={{ marginTop: 0, marginBottom: 10 }}>Help build India’s industrial knowledge graph. We’re seeking:</p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Drone MRO providers</li>
            <li>Accredited testing &amp; certification labs</li>
            <li>Industrial-park tenant lists</li>
            <li>Tier-2/3 supplier directories</li>
          </ul>
          <p style={{ margin: '12px 0 0' }}>Contribute → <a href="mailto:labs@techadyant.com" style={{ color: TEAL }}>labs@techadyant.com</a></p>
        </Callout>
      </div>

      {/* GO DEEPER */}
      <Callout label="Go Deeper" tone={TEAL}>
        <p style={{ marginTop: 0 }}>Own the layer, not the floor space. The full July catalogue:</p>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li><Link href="/reports/" style={{ color: TEAL }}>Browse all reports →</Link></li>
          <li>Forthcoming: <strong>India’s Critical-Minerals Processing Opportunity</strong> — where the refineries and magnet lines get built, and who captures the midstream.</li>
          <li>Commission bespoke research or a DPR → <Link href="/services/" style={{ color: 'var(--primary, #818CF8)' }}>labs.techadyant.com/services</Link></li>
        </ul>
      </Callout>

      {/* MISSION */}
      <Quote>Every report adds evidence. Every signal updates the record. Every Atlas page expands India’s Industrial Knowledge Graph.</Quote>
    </div>
  );
}
