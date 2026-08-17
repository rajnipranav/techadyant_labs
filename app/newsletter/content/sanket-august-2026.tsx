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
function AugSignal({ no, head, body, src }: { no: string; head: string; body: string; src: string }) {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', margin: '0 0 24px' }}>
      <div style={{
        flex: '0 0 92px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '12px 6px',
      }}>
        <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{no}</div>
        <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 9, letterSpacing: '.08em', color: TEAL, marginTop: 6 }}>LIVE</div>
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
      <Figure src="/newsletter/august-at-a-glance.png" alt="Sanket August 2026 - Pricing the Gap: the Sanket Index at 35, the five-corridor Board with deltas vs July, the forecast, and the bottom line in one page"
        caption="One-page intelligence summary - the Board, the Sanket Index at 35 (33 → 34 → 35), the forecast, and the bottom line." />

      {/* THE BOARD */}
      <Kicker>The Executive Board</Kicker>
      <h2 id="board" style={h2}>Five Corridors, Now Moving</h2>
      <p style={{ marginBottom: 18 }}>India’s industrial sovereignty, read corridor by corridor on the Dependency Capture FrameworkT - how much of the value India <strong>captures</strong>, not how much it hosts. Every reading carries its move on July, and the series is persisted in <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 13 }}>board-history.json</span> so the trend compounds rather than resets.</p>
      <div style={{ margin: '0 0 22px' }}>
        <BoardRow name="Defence & Dual-Use" score={40} tone={BRASS} trend=" +1" basis="Three services' roadmaps priced the gap; BEL’s ₹600 cr unit, the 840-drone order and the OSAT shift put capital behind it." />
        <BoardRow name="Enterprise Software" score={40} tone={BRASS} trend=" HOLD" basis="No structural change in August; the Edge AI economy report (forthcoming) is the next test of the layer." />
        <BoardRow name="Semiconductors" score={37} tone={BRASS} trend=" +1" basis="India enters IC substrates at the frontier (Intel + 3DGS, Odisha); LTSCT moves packaging home; UP commits ₹45,000 cr." />
        <BoardRow name="AI Infrastructure" score={33} tone={BRASS} trend=" +2" basis="15,916 IndiaAI GPUs, 1,575 MW of data-centre capacity and L&T’s ₹15,000 cr AI-factory order - capacity, not maps." />
        <BoardRow name="Critical Minerals" score={23} tone={CRIMSON} trend=" HOLD" basis="Vedanta wins a manganese block and Hindustan Copper explores partnerships - but no processing output yet." />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-strong, var(--border))', marginTop: 6, paddingTop: 14 }}>
          <div><div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.12em', color: BRASS }}>THE SANKET INDEX</div><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>India Industrial Sovereignty - composite of the Board</div></div>
          <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 34, fontWeight: 700 }}>35<span style={{ fontSize: 14, color: 'var(--text-muted)' }}> /100</span> <span style={{ fontSize: 13, color: TEAL }}>BUILDING  +1</span></div>
        </div>
      </div>
      <Figure src="/newsletter/august-index-trend.png" alt="The Sanket Index from June to August: 33, 34, 35 - the series now compounds"
        caption="The Sanket Index, June → August: the series now visibly compounds - 33 → 34 → 35." />
      <Figure src="/newsletter/august-hero-board.png" alt="Where India captures value and where it moved in August - five corridors scored 0 to 100 with the change on July"
        caption="Three of five corridors ticked up in August as the month priced gaps and moved capital. ( ) = change vs July." />

      {/* BOTTOM LINE */}
      <Callout label="The Bottom Line" tone={BRASS}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>August priced the gap: <strong>IAF 34/100 vs USAF 88</strong>, a Navy ~₹1.2 lakh crore subsystem market, maritime readiness 9/12, and 312 import surfaces scored.</li>
          <li>The month’s biggest order - <strong>840 one-way attack drones for ₹1,577 crore</strong> (Tata 64%, Nibe 36%) - puts a price on the drone gap.</li>
          <li>Capital moved behind the scores: <strong>L&T’s ₹15,000 crore AI-factory order, 15,916 IndiaAI GPUs, 1,575 MW</strong> of data-centre capacity, BEL’s ₹600 crore Chitrakoot unit.</li>
          <li>Every score points the same way: the gap is <strong>upstream</strong> - subsystems, silicon, cells, substrates - not platforms.</li>
          <li>Measurement is now real. <strong>Output is not yet.</strong> Watch the first line that runs, not the index.</li>
        </ul>
      </Callout>

      {/* THESIS */}
      <Kicker>This Month’s Thesis</Kicker>
      <h2 id="thesis" style={h2}>Pricing the Gap</h2>
      <p>June named the problem - India assembles, but the value lives upstream. July priced the opportunity: ~₹1.5 lakh crore of it, mostly in the layers India imports. August answers the next question, and it is the most uncomfortable one yet: precisely how much does India not make? Three service roadmaps, one composite index and 312 import surfaces later, the gap is no longer a claim. It is a number.</p>
      <p>Start with the services, because that is where August is loudest. The IAF roadmap scores India’s autonomous air power at 34/100 against the USAF’s 88. The Navy’s transformation report sizes a ~₹1.2 lakh crore cumulative subsystem market to 2035 and ranks 58 surfaces - with AI silicon at roughly 15% indigenous and battery cells at 35%. The Maritime Autonomy Readiness Index places India 9th of 12 at 4.5/10. Three services, three scored gaps, one shared finding: the platform is not the problem; the subsystem base beneath it is.</p>
      <p>The month’s orders agree. The Army’s 840 one-way attack drones for ₹1,577 crore - Tata Advanced Systems and Nibe - price the drone dependency at roughly ₹1.9 crore per platform, most of it in subsystems still imported. BEL’s ₹600 crore Chitrakoot unit, L&T Semiconductor’s OSAT shift home, UP’s ₹45,000 crore of chip-and-electronics commitments, L&T’s ₹15,000 crore AI-factory order and 15,916 new IndiaAI GPUs: the capital is arriving at the layers the scores flagged.</p>
      <p style={{ marginBottom: 30 }}>This is the measured dependency - India moving from slogans to indices, from "make in India" to "score what we do not make". The index is a necessary instrument of policy, and it is now in place. The risk is that it becomes an end in itself. Pricing the gap is not closing it. The decade’s question has changed shape: not where the gap is, but whether the numbers build anything.</p>

      {/* ONE CHART */}
      <Kicker>The Gap, Priced</Kicker>
      <h2 id="one-chart" style={h2}>India 34, USAF 88</h2>
      <Figure src="/newsletter/august-one-chart.png" alt="Autonomous air-power readiness: India 34, Australia 66, UK 71, China 72, USA 88"
        caption="August’s IAF roadmap scored India’s autonomous air power at 34/100 - less than half the US Air Force’s 88." />
      <Callout label="The Takeaway" tone={BRASS}>
        <p style={{ margin: 0, fontWeight: 600 }}>India published its own number this month - 34/100 against the USAF’s 88 - and ran the same exercise for sea and land. Nobody scored India’s dependencies for us; we scored them ourselves, and the score is the starting point for the build.</p>
      </Callout>

      {/* LEDGER */}
      <Kicker>The Ledger</Kicker>
      <h2 id="ledger" style={h2}>What Actually Moved in August</h2>
      <p style={{ marginBottom: 8 }}>The month’s hard moves - capital, policy and capacity - tagged by corridor and sourced.</p>
      <div style={{ margin: '0 0 34px' }}>
        <LedgerRow move="Army orders 840 one-way attack drones" corr="DEFENCE" src="ET · HT (14 Aug)" why="₹1,577 cr across two contracts with Tata Advanced Systems (64%) and Nibe (36%); strike beyond 100 km in jammed and spoofed environments; delivery in 12 months under Buy (Indian) IDDM." />
        <LedgerRow move="L&T wins India’s largest AI-factory order" corr="AI INFRA" src="Reuters (13 Aug)" why="₹10,000–15,000 cr from Together AI for 10,000 NVIDIA B300 GPUs at Chennai - Phase 1 at 250 MW compute with 150 MVA power ready." />
        <LedgerRow move="BEL proposes ₹600 cr defence-electronics unit" corr="DEFENCE" src="Drishti IAS · Jagran (12–13 Aug)" why="Initial outlay ₹562.5 cr at the Chitrakoot node of the UP Defence Industrial Corridor; QRSM, air-defence and next-gen radar lines plus MRO; HLEC Letter of Comfort on 11 Aug." />
        <LedgerRow move="UP lands ₹45,000 cr of chip commitments" corr="SEMICONDUCTORS" src="Financial Express (8 Aug)" why="Eight companies in Gautam Buddha Nagar; HCL-Foxconn ₹3,706 cr, Ascent Circuits ₹3,250 cr for PCBs and substrates, SAEL 5 GW cell + 5 GW module." />
        <LedgerRow move="L&T Semiconductor moves OSAT home" corr="SEMICONDUCTORS" src="Business Standard (4 Aug)" why="Assembly and testing shift to domestic partners incl. Tata Electronics; Indian OSATs cover ~50 of 500 package types - the backend gap now being closed." />
        <LedgerRow move="India’s first rotating detonation engine validated" corr="DEFENCE" src="ET Manufacturing · Bharat Shakti" why="D-Propulse’s 5 kN air-breathing RDE (aerospike nozzle) reaches TRL-5 at DRDL; 15–25% higher thermodynamic efficiency; flight-ready target Dec 2027." />
        <LedgerRow move="Vedanta wins the Punnam manganese block" corr="CRITICAL MINERALS" src="ET Manufacturing (14 Aug)" why="152-hectare block at G4 exploration stage in Andhra Pradesh (BSE filing, 13 Aug) - ferro- and silico-manganese feed for steel." />
        <LedgerRow move="MSC’s first import rake at Adani ICD Malur" corr="LOGISTICS" src="India Shipping News (10 Aug)" why="The world’s largest container carrier moves a full train rake through the Bengaluru inland terminal - rail-led logistics for South India’s factories." />
      </div>

      {/* WHAT SHIPPED */}
      <Kicker>What Shipped on the Platform</Kicker>
      <h2 id="platform" style={h2}>The August Changelog</h2>
      <p style={{ marginBottom: 8 }}>The intelligence platform compounds, and this is where subscribers see it. Every item below shipped in August - verified against the deployment log - with what it does for you and where to use it.</p>
      <div style={{ margin: '0 0 12px' }}>
        {([
          ['Report + Data, two tiers', 'Every paid report now sells as the PDF or Report + Data (PDF + an Excel data pack) - a licence tier, not a second file. Five August reports carry it: CMDD ₹6,999/₹11,999 · Navy ₹5,900/₹10,900 · Solar ₹6,999/₹9,999 · Hydrogen ₹4,900/₹7,900 · IAF ₹5,900/₹8,900.', '/reports/'],
          ['Every August report shipped on R2', 'Paid PDFs download via signed URLs; covers and free editions serve from the public library bucket; data packs from the private bucket.', '/reports/'],
          ['Evidence-credibility layer', 'Every report shows a Last reviewed date, a lifecycle badge (current / updated / corrected / superseded) and an Updates & corrections log.', '/reports/'],
          ['A public corrections ledger', '/corrections aggregates every update across published reports - the record, in the open.', '/corrections/'],
          ['Policy & support pages', 'Refund, terms, privacy and support pages now sit under the buy button.', '/refund/'],
          ['Shape Techadyant', 'Request a report, ask a research question, suggest an Atlas entity, flag a gap - plus "Did this answer your question?" micro-feedback on every report.', '/shape/'],
          ['Engage hub', 'Subscribe, Shape and Contact in one place; now the masthead CTA on every page.', '/engage/'],
          ['Institutional licensing', 'Team, enterprise and data-licence models, with engagement types published on /services.', '/licensing/'],
          ['AI-MedTech Atlas pillar', '86 tracked players on a 10-layer capture grid - the hardware-software paradox made legible: world-class AI SaMD on a ~100% imported imaging-hardware base.', '/research/pillars/ai-medtech/'],
          ['Semiconductor Ecosystem Atlas', 'The fact-checked pass-2 dataset (661 entities / 828 edges, zero fabrications) cleared audit for load; the glass-substrate frontier signal (S-034) is live; the Atlas shows 392 players / 995 relationships.', '/research/'],
          ['Dholera SIR interactive map', 'MapLibre GIS with real WGS84 geometry and the DSIRDA 2010–2040 master-plan overlay; sites graded verified / indicative / undisclosed.', '/corridors/delhi-mumbai/dholera-sir/'],
        ] as [string, string, string][]).map(([item, does, href]) => (
          <div key={item} style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: 14, padding: '12px 0', borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, letterSpacing: '.04em', color: BRASS, textTransform: 'uppercase' }}>{item}</div>
              <Link href={href} style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, color: TEAL }}>use it →</Link>
            </div>
            <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{does}</div>
          </div>
        ))}
      </div>
      <Callout label="Use Them Live" tone={TEAL}>
        <p style={{ margin: 0, fontWeight: 600, fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 13 }}>
          Atlas → <Link href="/research/" style={{ color: TEAL }}>labs.techadyant.com/research</Link> · Dependencies → <Link href="/dependencies/" style={{ color: TEAL }}>/dependencies</Link> · Corridors → <Link href="/corridors/" style={{ color: TEAL }}>/corridors</Link> · Shape → <Link href="/shape/" style={{ color: TEAL }}>/shape</Link>
        </p>
      </Callout>

      {/* SIGNALS */}
      <Kicker>Signal of the Month · S-053 · 15 Aug 2026</Kicker>
      <h2 id="signals" style={h2}>The Army Puts a Price on the Drone Gap: ₹1,577 Crore for 840 One-Way Attack Drones</h2>
      <p>The Ministry of Defence signed two contracts worth ₹1,577 crore with Tata Advanced Systems and Nibe on 14 August for 840 loitering munitions that strike beyond 100 km in jammed and spoofed environments - delivery within 12 months under the Buy (Indian) IDDM fast-track. It is the first large order of its kind, and it is this month’s thesis in a number: roughly ₹1.9 crore per platform, most of it in subsystems - motors, controllers, seekers, cells - that India is only beginning to make.</p>
      <p style={{ marginBottom: 24 }}><strong>The tell to watch:</strong> how much of the ₹1,577 crore lands with Indian subsystem makers - and whether the follow-on orders the Army has signalled (tens of thousands of UAS over five years) price the industrial base, not just the platform.</p>

      <Kicker>Three Signals That Matter</Kicker>
      <div style={{ margin: '6px 0 30px' }}>
        <AugSignal no="S-040" head="IndiaAI Mission adds 15,916 GPUs." src="PIB (6 Aug)"
          body="The empanelled national compute pool reaches 34,333 (target 100,000 by end-2026) and a ~1.1 EFLOPS HPC system is ordered at the NIC data centre, Delhi - sovereign compute, priced and ordered, not just promised." />
        <AugSignal no="S-034" head="India enters IC substrates at the frontier." src="Reuters · TrendForce"
          body="Intel and 3DGS’s US$3.3bn Odisha plant will build glass-core substrates - pre-commercial worldwide - at a layer where India has zero producers and three firms hold ~70%. India enters as host, not yet owner." />
        <AugSignal no="S-055" head="Vedanta wins the Punnam manganese block." src="ET Manufacturing · BSE"
          body="A 152-hectare G4-stage block in Andhra Pradesh (BSE filing, 13 Aug) - manganese for ferro- and silico-manganese alloys. A supply-side step while processing output stays at zero." />
      </div>

      {/* KEY JUDGEMENT */}
      <Callout label="Key Judgement · Confidence: Moderate" tone={TEAL}>
        <p style={{ marginTop: 0 }}>We assess that August moved India’s industrial debate from claims to measurements: three services, one composite index and 312 import surfaces now carry numbers, and the month’s capital - the ₹1,577 crore drone order, the ₹15,000 crore AI factory, the OSAT shift, 15,916 GPUs - is landing at the layers the scores flagged. That alignment between measurement and capital is the month’s real signal.</p>
        <p style={{ marginBottom: 0 }}><strong style={{ color: CRIMSON }}>Principal risk:</strong> the indices become the deliverable. Scores are instruments of policy, not outcomes; import surfaces shrink only when lines run. Confidence is capped by India’s record of converting scores into output - and by the certification, power and component-capital bottlenecks the reports themselves document.</p>
      </Callout>

      {/* ECOSYSTEM MAP */}
      <Kicker>Emerging Ecosystem Map</Kicker>
      <h2 style={h2}>The Dependency Stack, Priced</h2>
      <Figure src="/newsletter/august-value-flow.png" alt="The dependency stack, priced: air (34/100), sea (9/12) and land (₹1,577 cr) platforms above the shared subsystem base - AI silicon 15% indigenous, cells 35%, substrates 0 producers, magnets 0 output, engines TRL-5"
        caption="Platforms are downstream of ecosystems: August scored the three platforms and priced the shared subsystem base beneath them." />

      {/* FRAMEWORK */}
      <Kicker>The Techadyant Framework</Kicker>
      <h2 id="framework" style={h2}>The Dependency Capture FrameworkT</h2>
      <Figure src="/newsletter/august-framework.png" alt="Dependency Capture Framework, August: L6 services 78, L5 integration 62, L4 assembly 54, L3 components 30, L2 processing 22, L1 raw materials 26"
        caption="Scores move only on real capacity. The thin middle - L2-L4 - is where the month’s capital is headed." />
      <Quote>"The month put a number on what India doesn’t make. Now the numbers have to build something."</Quote>

      {/* FROM THE LAB */}
      <Kicker>From the Lab This Month</Kicker>
      <h2 id="from-the-lab" style={h2}>Eight Reports, One Lens</h2>
      <p style={{ marginBottom: 8 }}>August’s research, each in a line and a number - the measurement behind this month’s thesis.</p>
      <ul style={{ margin: '0 0 30px', paddingLeft: 20, lineHeight: 1.9 }}>
        <li><Link href="/reports/india-critical-manufacturing-dependencies/" style={{ color: 'var(--primary, #818CF8)' }}>India’s Critical Manufacturing Dependencies</Link> - the CMDI, first edition: 312 import surfaces · 12 sectors.</li>
        <li><Link href="/reports/indian-navy-autonomous-maritime/" style={{ color: 'var(--primary, #818CF8)' }}>The Indian Navy’s Autonomous Maritime Transformation 2026–2035</Link> - platforms are downstream of ecosystems: ~₹1.2 lakh cr · 58 surfaces.</li>
        <li><Link href="/reports/iaf-autonomous-air-power/" style={{ color: 'var(--primary, #818CF8)' }}>IAF Autonomous Air Power Roadmap 2026–2035</Link> - 34/100 vs USAF 88, 25 dependencies scored.</li>
        <li><Link href="/reports/beyond-sea-drones-india-autonomous-maritime-systems/" style={{ color: 'var(--primary, #818CF8)' }}>Beyond Sea Drones: India’s Autonomous Maritime Systems Ecosystem</Link> - 9/12 on the Maritime Autonomy Readiness Index; ₹35,000 cr base case by 2035.</li>
        <li><Link href="/reports/beyond-solar-panels/" style={{ color: 'var(--primary, #818CF8)' }}>Beyond Solar Panels</Link> - capability inverts value up the stack: ~172 GW of ALMM-listed module capacity on an imported upstream base.</li>
        <li><Link href="/reports/india-green-hydrogen/" style={{ color: 'var(--primary, #818CF8)' }}>The Hydrogen Mirage or Machine?</Link> - policy around the molecule, not the machine: ~3 GW operational electrolyser capacity.</li>
        <li><Link href="/reports/q-day-india/" style={{ color: 'var(--primary, #818CF8)' }}>Q-Day India</Link> - post-quantum-cryptography readiness and migration; free, 152 pages.</li>
        <li><Link href="/reports/kalpasar-economic-impact/" style={{ color: 'var(--primary, #818CF8)' }}>Kalpasar Economic Impact Assessment</Link> - the bay project on the superseded design: ~₹1,33,246 cr capex, tidal dropped for a ~2,470 MW solar-wind hybrid.</li>
      </ul>

      {/* CONTRARIAN */}
      <Callout label="Contrarian View" tone={CRIMSON}>
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 22 }}>Indices Are Not Output</h3>
        <p>Consensus will read the month as momentum: three roadmaps, a ₹1.2 lakh crore market, 312 surfaces scored. We would be careful. India has never lacked analysis; it has lacked output - and an index is the most comfortable deliverable a dependency programme can produce, because it costs nothing to publish and changes nothing by itself.</p>
        <p style={{ marginBottom: 0 }}>The scores are necessary. <strong style={{ color: CRIMSON }}>They are not the win.</strong> The win is the first line that runs: the first sintered-magnet batch, the first substrate die, the first factory floor that turns a scored import surface into a made one. Cheer the measurement. Stay sceptical until the number shrinks.</p>
      </Callout>

      {/* FORECAST */}
      <Kicker>Forecast · India’s Priced Gaps, Converted into Build by 2035</Kicker>
      <h2 id="forecast" style={h2}>Three Ways This Plays Out</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '6px 0 36px' }}>
        <ForecastCard prob="50%" label="BASE CASE" tone="var(--text)">India converts two or three of August’s scored gaps into real capacity - OSAT and packaging, the AI-factory build-out, an OWA subsystem line - but stays import-dependent in silicon, cells and magnets. The index moves in single digits.</ForecastCard>
        <ForecastCard prob="30%" label="BULL CASE" tone={GREEN}>Measurement converts into chokepoint ownership in at least one corridor - advanced packaging or rare-earth processing - and the Navy’s ₹1.2 lakh crore subsystem market starts to be captured domestically.</ForecastCard>
        <ForecastCard prob="20%" label="BEAR CASE" tone={CRIMSON}>The indices become the deliverable; orders keep flowing to imports; another decade of scored-but-uncaptured dependencies - the gap priced, never closed.</ForecastCard>
      </div>

      {/* WATCHING */}
      <Kicker>What We’re Watching</Kicker>
      <h2 style={h2}>On the Radar, Not Yet on the Board</h2>
      <ul style={{ margin: '0 0 30px', paddingLeft: 20, lineHeight: 1.85 }}>
        <li><strong>Semicon 2.0 pillar two:</strong> whether machines, materials, chemicals and gases is notified with real allocations and eligibility - a demand signal or a line in a release.</li>
        <li><strong>The 100,000-GPU target:</strong> whether the IndiaAI pool closes 2026 at 100,000 empanelled GPUs - and where the power comes from.</li>
        <li><strong>First output, not first order:</strong> the first sintered magnet, the first substrate die, the first OSAT line - the import surfaces that actually shrink.</li>
        <li><strong>AI-factory power:</strong> whether the transmission build-out keeps pace with 1,575 MW of data-centre capacity and the L&T Chennai campus.</li>
        <li><strong>The subsystem bill on 840 drones:</strong> how much of the ₹1,577 crore stays in India - the ledger for the follow-on order.</li>
      </ul>

      {/* GO DEEPER */}
      <Callout label="Go Deeper" tone={TEAL}>
        <p style={{ marginTop: 0 }}>Own the layer, not the floor space. The full August catalogue:</p>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li><Link href="/reports/" style={{ color: TEAL }}>Browse all reports </Link></li>
          <li>Forthcoming: <strong>India’s Edge AI Economy</strong> and <strong>India’s AI Power Infrastructure Gap</strong> - due this month.</li>
          <li>Then: The Cooling Economy of India · The Sensor Economy of India (Sep) · Industrial Logistics (Oct) · Water Behind India’s Semiconductor Ambitions · Industrial Machine Vision (Nov) · Semiconductor Supply-Chain Missing Links (Dec).</li>
          <li>Commission bespoke research or a DPR · <Link href="/services/" style={{ color: 'var(--primary, #818CF8)' }}>labs.techadyant.com/services</Link></li>
        </ul>
      </Callout>

      {/* SOURCES & METHODOLOGY */}
      <Kicker>Sources &amp; Methodology</Kicker>
      <h2 id="sources" style={h2}>Citable, Every Number</h2>
      <p style={{ marginBottom: 8, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Every load-bearing figure in this issue traces to a source. The Board is an analyst-set reading on the Dependency Capture FrameworkT (0–100 = value captured, not hosted); the Sanket Index is the rounded mean of the five corridors. Signals are scored 0–100 on Strategic Impact 40 / India Relevance 30 / Time Horizon 15 / Confidence 15 where the engine score exists; August signals are presented by corridor and date because the engine’s score layer was unreachable this cycle.
      </p>
      <div style={{ margin: '0 0 12px' }}>
        {([
          ['IAF readiness 34/100 vs USAF 88 / PLAAF 72 / RAF 71 / RAAF 66', 'Techadyant Labs, IAF Autonomous Air Power Roadmap 2026–2035 (Aug 2026) - AARI method'],
          ['Navy: ~₹1.2 lakh cr cumulative subsystem market 2026–35; 58 ranked surfaces; AI silicon ~15% indigenous', 'Techadyant Labs, Indian Navy’s Autonomous Maritime Transformation 2026–2035 (Aug 2026)'],
          ['Maritime Autonomy Readiness Index: India 9/12, 4.5/10; USV/UUV market ₹2,200 cr (2026) → ₹11,500 / ₹35,000 / ₹55,000 cr (2035)', 'Techadyant Labs, Beyond Sea Drones (Aug 2026); MARI'],
          ['CMDI: 312 import surfaces scored across 12 mega-sectors; 12 opportunity zones', 'Techadyant Labs, India’s Critical Manufacturing Dependencies (Aug 2026)'],
          ['840 one-way attack drones, ₹1,577 cr; Tata 64% / Nibe 36%; strike >100 km; 12-month delivery', 'Economic Times; Hindustan Times; India Sentinels (14 Aug 2026)'],
          ['L&T AI factory: ₹10,000–15,000 cr; 10,000 NVIDIA B300 GPUs; Chennai; Phase 1 250 MW', 'Reuters (13 Aug 2026); L&T press release'],
          ['IndiaAI Mission: +15,916 GPUs → pool 34,333; ~1.1 EFLOPS HPC order at NIC Delhi', 'PIB PRID 2295477 / 2295483 (6 Aug 2026)'],
          ['Data-centre capacity ~375 MW (2020) → ~1,575 MW', 'Lok Sabha written reply via ANI / The Tribune (5 Aug 2026)'],
          ['BEL Chitrakoot: ₹600+ cr (initial ₹562.5 cr); HLEC Letter of Comfort 11 Aug', 'Drishti IAS (13 Aug); Dainik Jagran (12 Aug 2026)'],
          ['UP: ₹45,000 cr commitments; HCL-Foxconn ₹3,706 cr; Ascent Circuits ₹3,250 cr; SAEL 5+5 GW', 'Financial Express (8 Aug 2026)'],
          ['LTSCT OSAT shift home; Indian OSATs ~50 of 500 package types', 'Business Standard (4 Aug 2026)'],
          ['D-Propulse 5 kN RDE at TRL-5 (aerospike); flight-ready target Dec 2027', 'ET Manufacturing; Bharat Shakti (Jul–Aug 2026)'],
          ['Vedanta wins Punnam manganese block (152 ha, G4, Andhra Pradesh)', 'Vedanta BSE filing (13 Aug); ET Manufacturing (14 Aug 2026)'],
          ['MSC first import rake at Adani ICD Malur (Bengaluru)', 'India Shipping News (10 Aug 2026)'],
        ] as [string, string][]).map(([f, s]) => (
          <div key={f} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '11px 0', borderTop: '1px solid var(--border)', fontSize: 13.5 }}>
            <div style={{ fontWeight: 600 }}>{f}</div>
            <div style={{ color: 'var(--text-muted)' }}>{s}</div>
          </div>
        ))}
      </div>
      <Callout label="Board Method · Two Lines" tone={TEAL}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
          Each corridor is scored 0–100 for how much of the value India captures - not hosts - on the six-layer Dependency Capture FrameworkT, judged monthly against capital, policy, capacity and import data. The Sanket Index is the rounded mean of the five corridor readings; movements require real events, and the series is persisted in board-history.json.
        </p>
      </Callout>
      <p style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, color: 'var(--text-dim, #8a8a99)' }}>
        Independence: no sponsored coverage; no positions in what we analyse. Corrections at <Link href="/corrections/" style={{ color: TEAL }}>labs.techadyant.com/corrections</Link>.
      </p>

      {/* MISSION */}
      <Quote>Every report adds evidence. Every signal updates the record. Every Atlas page expands India’s Industrial Knowledge Graph.</Quote>
    </div>
  );
}
