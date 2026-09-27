import Link from 'next/link';
import type { CSSProperties } from 'react';

/* palette */
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
      <Figure src="/newsletter/september-at-a-glance.png" alt="Sanket September 2026 - The Conversion Problem: the Sanket Index holding at 35, the five-corridor Board, the forecast and the bottom line in one page"
        caption="One-page intelligence summary - the Board, the Sanket Index at 35 (33 → 34 → 35 → 35), the forecast, and the bottom line." />

      {/* THE BOARD */}
      <Kicker>The Executive Board</Kicker>
      <h2 id="board" style={h2}>Five Corridors, Standing at 35</h2>
      <p style={{ marginBottom: 18 }}>India&rsquo;s industrial sovereignty, corridor by corridor, on the Dependency Capture Framework&trade; &mdash; how much of the value India <strong>captures</strong>, not how much it hosts. September&rsquo;s capital was inbound, not converted, so only semiconductors move; the Index holds at 35.</p>
      <div style={{ margin: '0 0 22px' }}>
        <BoardRow name="Defence &amp; Dual-Use" score={40} tone={BRASS} trend=" HOLD" basis="Aerospace priced propulsion, subsystems and IP; assembly still runs ahead of the owned layers. Diagnostic, not capacity." />
        <BoardRow name="Enterprise Software" score={40} tone={BRASS} trend=" HOLD" basis="The Cloud Question framed hyperscaler dependence as a strategic choice, not a procurement one - a call, not new capacity." />
        <BoardRow name="Semiconductors" score={38} tone={BRASS} trend=" +1" basis="SEMICON India drew real equipment capital - Applied Materials ₹3,600 cr, Lam ₹10,000 cr, Karnataka over ₹15,000 cr. Inputs, not output: +1." />
        <BoardRow name="AI Infrastructure" score={33} tone={BRASS} trend=" HOLD" basis="The Cooling report mapped the physical layer under compute; the build-out is still imported inputs." />
        <BoardRow name="Critical Minerals" score={23} tone={CRIMSON} trend=" HOLD" basis="No processing output reported in September; the standing zero holds." />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border)', marginTop: 8, paddingTop: 14 }}>
          <div><div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.12em', color: BRASS }}>THE SANKET INDEX</div><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>India Industrial Sovereignty - composite of the Board</div></div>
          <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 30, fontWeight: 700 }}>35<span style={{ fontSize: 13, color: 'var(--text-muted)' }}> /100 · HOLDS</span></div>
        </div>
      </div>
      <Figure src="/newsletter/september-index-trend.png" alt="The Sanket Index from June to September: 33, 34, 35, 35 - the series compounds; September holds"
        caption="The Sanket Index, June → September: 33 → 34 → 35 → 35. September&rsquo;s money was inbound, not converted, so the composite holds." />
      <Figure src="/newsletter/september-hero-board.png" alt="The five corridors, September 2026 - semiconductors +1 on equipment capital, the rest hold, Index 35"
        caption="The five corridors, September 2026 - semiconductors +1 on equipment capital; the rest hold." />

      {/* BOTTOM LINE */}
      <Callout label="The Bottom Line" tone={BRASS}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Five reports this month - aerospace, cloud, technology transfer, lunar and cooling - name one gap: not where the dependency is, but what <strong>converts</strong> inputs into owned output.</li>
          <li>The sharpest number is <strong>1.1%</strong> - the share of India&rsquo;s public R&amp;D projects that become products. It is the most falsifiable sovereignty statistic of the year.</li>
          <li>September&rsquo;s capital was inbound, not converted: Applied Materials, Lam and Karnataka committed over ₹15,000 cr to semiconductor <em>equipment</em> - the input layer, not output.</li>
          <li>Policy aimed at the same layer: Semicon 2.0&rsquo;s Machines &amp; Materials, Fabs and ATMP guidelines went live (16 Sep), funding the ₹1,27,500 cr scheme where India must own capability.</li>
          <li>The Board holds at 35; only semiconductors tick up (+1). The test now is whether the money converts.</li>
        </ul>
      </Callout>

      {/* THESIS */}
      <Kicker>This Month&rsquo;s Thesis</Kicker>
      <h2 id="thesis" style={h2}>The Conversion Problem</h2>
      <p>June named the problem - India assembles, but the value lives upstream. July priced the opportunity; August priced the gap, and put a number on what India does not make. September answers the question the scores left open, and it is a harder one: what actually converts inputs into owned output? Five reports this month - aerospace, cloud, technology transfer, the lunar economy, and the cooling layer beneath AI infrastructure - keep circling the same finding. India&rsquo;s inputs are strong. The mechanism that converts them is not.</p>
      <p>The technology-transfer report gives the mechanism a name. Across 52 DRDO labs, 37 CSIR labs, 23 IITs, IISc and nine defence PSUs, India converts only about <strong>1.1%</strong> of public R&amp;D projects into products. Its five-pillar reform agenda is an attempt to move India from roughly 5% to 12% of global deep-tech output - a conversion-rate target, not a spending target. Aerospace finds the same asymmetry in hardware (the platform is built at home, the enabling layers are not); the Cloud Question finds its mirror in software; the lunar report is explicit that the dominant prize is terrestrial industrial spillover, not lunar commerce.</p>
      <p style={{ marginBottom: 30 }}>So the month&rsquo;s through-line is not another gap. It is the set of mechanisms that close one - the lab-to-line transfer, the sovereign-cloud migration, the subsystem base beneath the platform, the cooling and power layer beneath the AI build-out, the spillover from a space programme. The decade&rsquo;s question is no longer where the gap is. It is what turns a scored import surface into a made one.</p>

      {/* ONE CHART */}
      <Kicker>One Chart</Kicker>
      <h2 id="one-chart" style={h2}>1.1% - India&rsquo;s R&amp;D Conversion Rate</h2>
      <Figure src="/newsletter/september-one-chart.png" alt="Of every hundred public R&D projects across 52 DRDO labs, 37 CSIR labs, 23 IITs, IISc and 9 defence PSUs, roughly 1.1 percent become products; the reform target is to lift India from 5 to 12 percent of global deep-tech output"
        caption="Of every hundred projects across India&rsquo;s public research base, roughly one becomes a product." />
      <Callout label="The Takeaway" tone={BRASS}>
        <p style={{ margin: 0, fontWeight: 600 }}>It is the most falsifiable sovereignty number of the year - and the sharpest measure of the conversion problem. A conversion rate is an output, and outputs are countable. The reform target is to lift India&rsquo;s share of global deep-tech output from ~5% to ~12%.</p>
      </Callout>

      {/* LEDGER */}
      <Kicker>The Ledger</Kicker>
      <h2 id="ledger" style={h2}>What Actually Moved in September</h2>
      <div style={{ margin: '0 0 34px' }}>
        <LedgerRow move="The Cloud Question published" corr="ENTERPRISE SW" src="Techadyant Labs (12 Sep)" why="India&rsquo;s dependence on foreign hyperscalers and the sovereign-cloud challenge; 119 pp, Report + Data tier." />
        <LedgerRow move="Military Aerospace Manufacturing Ecosystem published" corr="DEFENCE" src="Techadyant Labs (16 Sep)" why="Propulsion, subsystems, IP and exports - from aircraft assembly to industrial sovereignty; 158 pp." />
        <LedgerRow move="Industrial Technology Transfer Ecosystem published" corr="R&amp;D TRANSFER" src="Techadyant Labs (7 Sep)" why="52 DRDO labs, 37 CSIR labs, 23 IITs and nine defence PSUs; ~1.1% project-to-product conversion; the 5%→12% agenda." />
        <LedgerRow move="India and the Emerging Lunar Economy published" corr="SPACE" src="Techadyant Labs (2 Sep)" why="A narrow 2026-2032 window; the dominant prize is terrestrial industrial spillover, not lunar commerce." />
        <LedgerRow move="India AI Data Centre Cooling published" corr="AI INFRA" src="Techadyant Labs (27 Sep)" why="The physical layer beneath the AI build-out - liquid cooling, chillers and the rack-density transition; 59 pp." />
        <LedgerRow move="SEMICON India draws real equipment capital" corr="SEMICONDUCTORS" src="SEMICON India / Digitimes (Sep)" why="Applied Materials commits ₹3,600 cr (Karnataka, ~1,000 jobs); Lam Research ₹10,000 cr for India&rsquo;s first silicon-component plant (Adinarayanahosahalli, 73 acres). Inputs to the fabs, not fabs." />
        <LedgerRow move="Semicon 2.0 Machines &amp; Materials pillar goes live" corr="SEMICONDUCTORS" src="PIB / ISM (16-18 Sep)" why="Implementation guidelines for the Machines &amp; Materials, Fabs and ATMP/OSAT pillars issued 16 Sep; the ₹1,27,500 cr scheme now funds the equipment and materials layer directly." />
        <LedgerRow move="Karnataka lines up over ₹15,000 cr of chip investment" corr="SEMICONDUCTORS" src="Karnataka Govt / gasworld (Sep)" why="Over 20 firms in talks at SEMICON India, ~2,000 jobs; alongside INOX Air Products&rsquo; ₹500 cr specialty-gas plant at Dholera to feed the Tata fab." />
      </div>

      {/* PLATFORM */}
      <Kicker>What Shipped on the Platform</Kicker>
      <h2 id="platform" style={h2}>The September Changelog</h2>
      <div style={{ margin: '0 0 22px' }}>
        <LedgerRow move="Defence Entity Dossiers" corr="/research/pillars/defence" src="Atlas" why="Deep, individually sourced dossiers added to the defence vertical - the Matangi USV and Sagar Defence Engineering - each with evidence, open questions and machine-readable markup." />
        <LedgerRow move="Semiconductor Equipment layer, mapped" corr="/research" src="Atlas" why="39 equipment and materials suppliers added to the Atlas (Applied Materials, Lam, MTAR, Forbes Marshall and more); the Atlas now tracks 805 players." />
        <LedgerRow move="Report + Data on every September flagship" corr="/reports" src="CMS" why="Aerospace, Cloud, Technology Transfer and Lunar each ship a Report + Data tier - the PDF plus the underlying Excel model." />
        <LedgerRow move="Corridor data reconciled to primaries" corr="/corridors" src="DPIIT / NICDC" why="The 11-corridor map re-checked against DPIIT and NICDC: Hisar moves to construction, Nangal Chaudhary IMLH to operational, and the AKIC Jharkhand node is confirmed as Bokaro." />
      </div>
      <Callout label="Use Them Live" tone={TEAL}>
        <p style={{ margin: 0 }}>Atlas <Link href="/research/">/research</Link> · Dependencies <Link href="/dependencies/">/dependencies</Link> · Corridors <Link href="/corridors/">/corridors</Link> · Shape <Link href="/shape/">/shape</Link></p>
      </Callout>

      {/* EXCLUSIVE SIGNAL */}
      <Kicker>Exclusive Signal - First Here, Nowhere Else</Kicker>
      <h2 id="exclusive" style={h2}>A Twelfth National Industrial Corridor Is Quietly Being Planned</h2>
      <p>India&rsquo;s National Industrial Corridor programme has run on eleven corridors for years. A NICDC procurement this half - tender 187, for a consultant to prepare the Perspective Plan for a <strong>Dankuni-Surat Industrial Corridor (DSIC)</strong> - is the first documentary sign of a twelfth. It has not been announced, named in the official NICDP list, or reported anywhere. If it holds, DSIC would run east-west from West Bengal to Gujarat, stitching the two ends of India&rsquo;s manufacturing base into one corridor.</p>
      <p style={{ marginBottom: 30 }}><strong>The tell to watch:</strong> whether DPIIT names DSIC in the official NICDP corridor list, and whether a state SPV or a funding line follows the Perspective Plan tender. Until then we file it as an early signal, not a fact. <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, color: 'var(--text-dim, #8a8a99)' }}>SOURCE · NICDC tenders (procurement 187, 2026)</span></p>

      {/* KEY JUDGEMENT */}
      <Callout label="Key Judgement · Confidence: Moderate" tone={TEAL}>
        <p style={{ marginTop: 0 }}>We assess that India&rsquo;s binding constraint across all five corridors in 2026 is no longer demand, ambition or even capital, but conversion - the mechanism that turns a funded project, a hosted workload or an assembled platform into owned output. September&rsquo;s money confirms it: capital arrived at exactly the layer August scored, yet the Board barely moved, because inputs are not output.</p>
        <p style={{ marginBottom: 0 }}><strong style={{ color: CRIMSON }}>Principal risk:</strong> that measurement substitutes for making - the indices, roadmaps and schemes become the deliverable while orders keep flowing to imports. Confidence is capped by the 18-30 month lag before any new upstream capacity can produce.</p>
      </Callout>

      {/* ECOSYSTEM MAP */}
      <Kicker>Emerging Ecosystem Map</Kicker>
      <h2 style={h2}>The Dependency Stack, Priced</h2>
      <Figure src="/newsletter/september-value-flow.png" alt="The dependency stack: air, sea and land platforms above the shared subsystem base - AI silicon 15% indigenous, cells 35%, substrates 0 producers, magnets 0 output, engines TRL-5 - all imported"
        caption="Below the platforms sits the shared subsystem base - the layer where conversion has to happen." />

      {/* FRAMEWORK */}
      <Kicker>The Techadyant Framework</Kicker>
      <h2 id="framework" style={h2}>The Dependency Capture Framework&trade;</h2>
      <Figure src="/newsletter/september-framework.png" alt="Dependency Capture Framework, September: L6 services 78, L5 integration 62, L4 assembly 54, L3 components 30, L2 processing 22, L1 raw materials 26"
        caption="Where India captures value, layer by layer. Design and integration hold; the atoms still leak." />

      {/* FROM THE LAB */}
      <Kicker>From the Lab This Month</Kicker>
      <h2 id="from-the-lab" style={h2}>Five Published This Month</h2>
      <p style={{ marginBottom: 8 }}>September&rsquo;s research, each in a line and a number - the conversion lens behind this month&rsquo;s thesis.</p>
      <ul style={{ margin: '0 0 30px', paddingLeft: 20, lineHeight: 1.9 }}>
        <li><Link href="/reports/india-military-aerospace-manufacturing-ecosystem/">India&rsquo;s Military Aerospace Manufacturing Ecosystem</Link> - from aircraft assembly to industrial sovereignty; propulsion, subsystems, IP and exports. 158 pp · ₹6,999 / ₹11,999.</li>
        <li><Link href="/reports/india-cloud-question/">The Cloud Question</Link> - India&rsquo;s dependence on foreign hyperscalers and the sovereign-cloud challenge. 119 pp · ₹6,999 / ₹11,999.</li>
        <li><Link href="/reports/india-tech-transfer-ecosystem/">India&rsquo;s Industrial Technology Transfer Ecosystem</Link> - why public R&amp;D converts ~1.1% of projects, and the 5%→12% agenda. 129 pp · ₹6,999 / ₹10,999.</li>
        <li><Link href="/reports/india-lunar-economy/">India and the Emerging Lunar Economy</Link> - a narrow 2026-2032 window; the dominant prize is terrestrial spillover. 127 pp · ₹11,900 / ₹16,900.</li>
        <li><Link href="/reports/india-ai-data-centre-cooling-2026-2035/">India AI Data Centre Cooling 2026-2035</Link> - the physical layer beneath the AI build-out; liquid cooling, chillers and the rack-density transition. 59 pp · ₹4,900.</li>
      </ul>

      {/* CONTRARIAN */}
      <Callout label="Contrarian View" tone={CRIMSON}>
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 22 }}>Conversion Is a Slogan Too</h3>
        <p>&ldquo;Conversion&rdquo; risks becoming the new comfort word - invoked precisely so nothing has to be measured. The disciplined reading is narrower: a conversion rate is an output, and outputs are countable. The 1.1% figure is powerful because it is falsifiable.</p>
        <p style={{ marginBottom: 0 }}>Any conversion agenda that does not publish its own rate should be read with the same scepticism we applied to the indices last month.</p>
      </Callout>

      {/* FORECAST */}
      <Kicker>Forecast · Conversion by 2035</Kicker>
      <h2 id="forecast" style={h2}>Three Ways This Plays Out</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '6px 0 36px' }}>
        <ForecastCard prob="45%" label="BASE CASE" tone="var(--text)">One or two corridors convert capability into owned output by 2035 - packaging, cells or an aerospace subsystem line - but India stays import-dependent elsewhere. The Index moves in single digits.</ForecastCard>
        <ForecastCard prob="30%" label="BULL CASE" tone={GREEN}>Conversion holds: the equipment capital that arrived seeds real supplier clusters, and India owns a genuine chokepoint in at least one corridor. The 1.1% rate begins to climb.</ForecastCard>
        <ForecastCard prob="25%" label="BEAR CASE" tone={CRIMSON}>Measurement becomes the deliverable; the indices, roadmaps and schemes multiply while orders keep flowing to imports - the gap priced, never closed.</ForecastCard>
      </div>

      {/* WATCHING */}
      <Kicker>What October Is Tracking</Kicker>
      <p style={{ marginBottom: 30 }}>Whether September&rsquo;s conversion mechanisms start to move - whether the equipment capital that arrived turns into a domestic line, whether the technology-transfer agenda publishes its own rate, and where the first owned subsystem actually ships. No number yet; a genuine hook.</p>

      {/* MAILBAG */}
      <Callout label="The Mailbag" tone={BRASS}>
        <p style={{ marginTop: 0, fontStyle: 'italic' }}>The question we hear most: if India already assembles at scale - phones, solar, drones, soon chips - why does &ldquo;capture&rdquo; matter? Isn&rsquo;t assembly how every industrial power began?</p>
        <p style={{ marginBottom: 0 }}>Because assembly that never moves upstream is a destination, not a stage. Korea and Taiwan assembled first too - and used the assembly decade to buy, build and own the layers beneath. The test is not whether you assemble; it is whether value-add per unit rises. When it stalls, &ldquo;Make in India&rdquo; books the revenue while the margin and the dependency stay offshore - which is exactly what this month&rsquo;s 1.1% figure measures. <Link href="/shape/">Send yours via Shape</Link> for next month&rsquo;s Mailbag.</p>
      </Callout>

      {/* SOURCES */}
      <Kicker>Sources &amp; Methodology</Kicker>
      <h2 id="sources" style={h2}>Citable, Every Number</h2>
      <p style={{ marginBottom: 8 }}>Every load-bearing figure traces to a source. The Board is an analyst-set reading on the Dependency Capture Framework&trade; (0-100 = value captured, not hosted); the Sanket Index is the rounded mean of the five corridors, persisted in board-history.json.</p>
      <ul style={{ margin: '0 0 24px', paddingLeft: 20, lineHeight: 1.8, color: 'var(--text-muted)', fontSize: 14.5 }}>
        <li>~1.1% project-to-product conversion; 52 DRDO / 37 CSIR labs, 23 IITs, IISc, 9 PSUs; 5%→12% agenda - <em>Techadyant Labs, India&rsquo;s Industrial Technology Transfer Ecosystem (7 Sep 2026)</em>.</li>
        <li>Cooling as the physical layer beneath AI compute; 59 pp - <em>Techadyant Labs, India AI Data Centre Cooling 2026-2035 (27 Sep 2026)</em>.</li>
        <li>Semicon 2.0 outlay ₹1,27,500 cr; Machines &amp; Materials / Fabs / ATMP guidelines issued 16 Sep 2026 - <em>PIB / India Semiconductor Mission</em>.</li>
        <li>Board move (Semiconductors +1): SEMICON India equipment capital - AMAT ₹3,600 cr, Lam ₹10,000 cr, Karnataka over ₹15,000 cr - <em>SEMICON India 2026; Digitimes; Karnataka Govt</em>.</li>
      </ul>
      <Callout label="Independence" tone={TEAL}>
        <p style={{ margin: 0 }}>No sponsored coverage; no positions in what we analyse. Corrections to <Link href="/corrections/">labs.techadyant.com/corrections</Link>.</p>
      </Callout>
    </div>
  );
}
