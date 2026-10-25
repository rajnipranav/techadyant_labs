export function IssueContent() {
  return (
    <div className="report-body" style={{ padding: 0 }}>
      {/* AT A GLANCE */}
      <h2 id="at-a-glance" style={h2}>The issue at a glance</h2>
      <Figure src="/newsletter/october-at-a-glance.png" alt="Sanket October 2026 - The First Line: the Sanket Index at 36 (+1), the forecast and the five-corridor Board on one page"
        caption="One-page intelligence summary - the Sanket Index at 36 (33 → 34 → 35 → 35 → 36), the forecast and the Board." />

      {/* FOUR NUMBERS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, margin: '0 0 34px' }}>
        {[
          ['36', 'The Sanket Index - up one point, the first move since August'],
          ['₹1,250 cr', 'Nexon Geochem’s NdFeB magnet line, Kakinada - 600 t a year'],
          ['3 of 6', 'Dholera fab customers with binding offtake commitments'],
          ['0 → open', 'Private missile-test ranges: none. MoD now opens its own to industry'],
        ].map(([n, c]) => (
          <div key={n} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${BRASS}`, borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 26, fontWeight: 700 }}>{n}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.5, marginTop: 6 }}>{c}</div>
          </div>
        ))}
      </div>

      {/* LAST MONTH GRADED */}
      <Kicker>Last Month, Graded</Kicker>
      <h2 id="graded" style={h2}>September&rsquo;s Call: On Track &mdash; Partial</h2>
      <Callout label="What September said October would track" tone={BRASS}>
        <p style={{ marginTop: 0, fontStyle: 'italic' }}>&ldquo;Whether the equipment capital that arrived turns into a domestic line, whether the technology-transfer agenda publishes its own rate, and where the first owned subsystem actually ships.&rdquo;</p>
        <p style={{ marginBottom: 0 }}>One of three tests moved. No domestic line came out of September&rsquo;s equipment capital, and no public R&amp;D system published its own conversion rate &mdash; though the Defence Secretary set November 2027 as the target for handing missile technology to industry. The third test moved furthest: HAL Koraput marked its 2,000th aero-engine and laid the foundation of a ₹218 crore second line for the licence-built Shakti, and MoD opened its test ranges to private developers. The Index moved one point (35 → 36), inside September&rsquo;s single-digit base case. <strong>Track record: two forecasts graded; both On Track.</strong></p>
      </Callout>

      {/* THE BOARD */}
      <Kicker>The Executive Board</Kicker>
      <h2 id="board" style={h2}>Five Corridors, Moving to 36</h2>
      <p style={{ marginBottom: 18 }}>India&rsquo;s industrial sovereignty, corridor by corridor, on the Dependency Capture Framework&trade; &mdash; how much of the value India <strong>captures</strong>, not how much it hosts. October&rsquo;s gains are still pre-output, but they are the first moves at the test, materials and demand layers since the Index stalled.</p>
      <div style={{ margin: '0 0 22px' }}>
        <BoardRow name="Defence &amp; Dual-Use" score={41} tone={GREEN} trend=" +1" basis="MoD's revised SOP opens its test ranges and labs to industry; INS Samarthak, L&amp;T's trials and evaluation vessel, commissioned 16 Oct. The test layer opens." />
        <BoardRow name="Enterprise Software" score={40} tone={BRASS} trend=" HOLD" basis="MeitY's sovereign-cloud framework is still in consultation; no award, no migration." />
        <BoardRow name="Semiconductors" score={39} tone={GREEN} trend=" +1" basis="Tata's Dholera fab reports six customers in engagement, three with binding offtake commitments - demand forming ahead of output." />
        <BoardRow name="AI Infrastructure" score={33} tone={BRASS} trend=" HOLD" basis="C-DAC opens a 10,000-unit compute empanelment - capacity rented, not owned." />
        <BoardRow name="Critical Minerals" score={25} tone={CRIMSON} trend=" +2 · PROBATION" basis="Nexon Geochem's ₹1,250 cr, 600 tpa NdFeB magnet MoU at Thondangi, Kakinada - a magnet line with a site and a date. Pre-production; returned if no land, site work or scheme award by April 2027." />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border)', marginTop: 8, paddingTop: 14 }}>
          <div><div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.12em', color: BRASS }}>THE SANKET INDEX</div><div style={{ color: 'var(--text-muted)', fontSize: 13 }}>India Industrial Sovereignty - composite of the Board</div></div>
          <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 30, fontWeight: 700 }}>36<span style={{ fontSize: 13, color: 'var(--text-muted)' }}> /100 · +1 BUILDING</span></div>
        </div>
      </div>
      <Figure src="/newsletter/october-hero-board.png" alt="The five corridors, October 2026: Defence 41 (+1), Enterprise Software 40, Semiconductors 39 (+1), AI Infrastructure 33, Critical Minerals 25 (+2); Index 36"
        caption="The five corridors, October 2026 - defence and semiconductors +1, critical minerals +2; the rest hold." />
      <Figure src="/newsletter/october-index-trend.png" alt="The Sanket Index from June to October: 33, 34, 35, 35, 36"
        caption="The Sanket Index, June → October: 33 → 34 → 35 → 35 → 36. The first move since August." />

      {/* SIGNAL OF THE MONTH */}
      <Callout label="Signal of the Month · S-147 · Score 87" tone={CRIMSON}>
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 22 }}>MoD Opens Its Test Ranges to Industry</h3>
        <p style={{ marginBottom: 0 }}>A revised procedure approved by the Defence Minister gives private developers three-day quarterly proof-firing slots at MoD ranges and labs, with charges waived for developmental projects. Our strategic-weapons report this month counts zero operational private missile ranges and a six-to-eighteen-month backlog at DRDO facilities. Qualification is where Indian prototypes stall; this is the first policy in the series aimed squarely at that step. <Link href="/signals/">See the signal feed</Link>.</p>
      </Callout>

      {/* BOTTOM LINE */}
      <Callout label="The Bottom Line" tone={BRASS}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>The month&rsquo;s most important number is not a score. It is the appearance of <strong>named projects</strong> at the test, materials and demand layers that September said were missing.</li>
          <li><strong>The test layer opened.</strong> MoD&rsquo;s revised procedure lets industry use its ranges and labs, and INS Samarthak gives the Navy a floating trials platform built by a private yard.</li>
          <li><strong>The materials layer has an address.</strong> Nexon Geochem&rsquo;s ₹1,250 crore MoU puts a 600-tonne NdFeB line on 30 acres at Kakinada &mdash; still an MoU, first output due April 2029.</li>
          <li><strong>The fab has an order book.</strong> Tata reports three binding offtake commitments for Dholera before its first wafer.</li>
          <li>The Board ticks up one point, to <strong>36</strong> &mdash; and one of those moves is on probation.</li>
        </ul>
      </Callout>

      {/* THESIS */}
      <Kicker>This Month&rsquo;s Thesis</Kicker>
      <h2 id="thesis" style={h2}>The First Line</h2>
      <p>September diagnosed the conversion problem with a number that is hard to forget: roughly 1.1% of India&rsquo;s public R&amp;D projects become products. The month&rsquo;s capital arrived at the correct layer and still left the Board almost unchanged. Inputs are not output. October asks the next, sharper question: if conversion is the binding constraint, where does the first owned output actually run? Not the next MoU or scheme guideline &mdash; the first line that ships something India previously imported, under Indian process control, at a quality the customer will accept.</p>
      <p>Three developments move that question from abstract to trackable. <strong>The test layer:</strong> our strategic-weapons report counts zero operational private missile-testing ranges; in the same month MoD opened its own ranges and labs to industry, and the Navy commissioned INS Samarthak, a trials and evaluation vessel built by L&amp;T with around 75% indigenous equipment. <strong>The materials layer:</strong> Nexon Geochem signed a ₹1,250 crore MoU for a 600-tonne-a-year sintered NdFeB plant at Thondangi, Kakinada &mdash; and our electronic-grade chemicals report finds Tanfac&rsquo;s solar-grade HF contracts (about 10,000 tonnes a year, ₹1,068 crore to FY2028-29) already exceed the modelled Indian solar HF pool 1.6 times. <strong>The demand layer:</strong> Tata reports three binding offtake commitments for Dholera. A fab with signed customers is a different object from a fab with a groundbreaking date.</p>
      <p style={{ marginBottom: 30 }}>None of these is yet a running line. Each sits one step closer to the mechanism September said was missing &mdash; the range that qualifies the system, the plant that makes the input, the customer who commits to the output. The month&rsquo;s other reports explain why that matters: electronic-warfare procurement takes about 9.5 years from approval to first delivery, and over 75% of GaN MMICs are still imported. Shorten the qualification loop and the first line arrives years earlier. Everything else is still pre-line.</p>

      {/* ONE CHART */}
      <Kicker>One Chart</Kicker>
      <h2 id="one-chart" style={h2}>The First Line May Not Feed a Fab</h2>
      <Figure src="/newsletter/october-one-chart.png" alt="India electronic-grade process chemicals, 2035 base-case demand of USD 264 million: solar cell lines 63%, packaging plants 19%, wafer fabs 18%"
        caption="2035 base case, USD 264 M - Techadyant Labs, India’s Electronic-Grade Chemicals and Process Materials, 2026–2035." />
      <Callout label="The Takeaway" tone={BRASS}>
        <p style={{ margin: 0, fontWeight: 600 }}>Wafer fabs will buy fewer than one dollar in five of India&rsquo;s electronic-grade process chemicals in 2035. Solar cell lines buy 63%, packaging plants 19%. The binding constraint is customer qualification, not plant capital &mdash; so the first owned line in the semiconductor corridor is likelier to ship into a solar or packaging plant than into Dholera.</p>
      </Callout>

      {/* CONTRARIAN */}
      <Callout label="Contrarian View" tone={CRIMSON}>
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 22 }}>An MoU Is Not a Line</h3>
        <p>We moved Critical Minerals two points on a twelve-month MoU for a plant whose first phase is due in April 2029, which has not disclosed whether it has any support under the magnet scheme. By our own September rule &mdash; inputs are not output &mdash; that is generous. MoUs are cheap, and a score that rewards signatures will drift upward without a tonne being made.</p>
        <p style={{ marginBottom: 0 }}>We keep the +2 on probation. If Nexon shows no land allotment, site work or scheme award by April 2027, the points are returned and the correction is logged.</p>
      </Callout>

      {/* LEDGER */}
      <Kicker>The Ledger</Kicker>
      <h2 id="ledger" style={h2}>What Actually Moved in October</h2>
      <div style={{ margin: '0 0 34px' }}>
        <LedgerRow move="MoD test ranges and labs opened to industry" corr="DEFENCE" src="MoD (Oct)" why="Revised SOP: three-day quarterly proof-firing slots; charges waived for developmental projects." />
        <LedgerRow move="INS Samarthak commissioned at Karwar" corr="DEFENCE" src="Indian Navy (16 Oct)" why="First of four multi-purpose vessels; L&amp;T Shipyard; ~75% indigenous equipment; built for trials of Indian sensors and weapons." />
        <LedgerRow move="₹4,106 cr: GSAT-7C and Varunastra" corr="DEFENCE" src="MoD (15 Oct)" why="NSIL ₹2,563 cr for the IAF's GSAT-7C satellite; BDL ~₹1,543 cr for Varunastra heavyweight torpedoes." />
        <LedgerRow move="BrahMos fire-control and launchers" corr="DEFENCE" src="MoD (6 Oct)" why="₹661.50 cr contract for Navy systems, at least 68% indigenous content." />
        <LedgerRow move="HAL Koraput: 2,000th aero-engine" corr="DEFENCE" src="HAL (6 Oct)" why="Foundation of a ₹218 cr second production line for the licence-built Shakti engine." />
        <LedgerRow move="Nexon Geochem NdFeB magnet MoU" corr="CRIT. MINERALS" src="APEDB / Autocar Pro (14 Oct)" why="₹1,250 cr in two phases (₹750 + ₹500 cr); 600 tpa at Thondangi, Kakinada; Phase 1 targeted by April 2029." />
        <LedgerRow move="Critical-mineral recycling incentive" corr="CRIT. MINERALS" src="Mines Ministry (9-14 Oct)" why="58 companies eligible under the ₹1,500 cr recycling scheme; stockpiling policy expected within a month." />
        <LedgerRow move="Tata Dholera fab books customers" corr="SEMICONDUCTORS" src="Digitimes (12 Oct)" why="Six customers in engagement, three with binding offtake commitments, ahead of production." />
        <LedgerRow move="C-DAC 10,000-unit compute empanelment" corr="AI INFRA" src="C-DAC / MediaNama (13 Oct)" why="Up to 10,000 AI compute units in clusters of 512 or more; first tender for 5,000." />
        <LedgerRow move="₹10,000 cr SME Growth Fund" corr="CORRIDORS" src="Union Cabinet (6 Oct)" why="Approved alongside a new logistics authority." />
      </div>

      {/* PLATFORM */}
      <Kicker>What Shipped on the Platform</Kicker>
      <h2 id="platform" style={h2}>The October Changelog</h2>
      <div style={{ margin: '0 0 22px' }}>
        <LedgerRow move="33 signals logged" corr="/signals" src="Signal engine" why="S-135 to S-167 - every contract, MoU and policy move behind this issue, each dated and sourced." />
        <LedgerRow move="Report + Data on all three paid flagships" corr="/reports" src="CMS" why="Electronic warfare and strategic weapons ship Excel workbooks; electronic-grade chemicals ships model v2.6 with 53 validation tests." />
        <LedgerRow move="Free condensed editions" corr="/reports" src="CMS" why="28 pp (electronic warfare), 13 pp (strategic weapons) and 10 pp (chemicals) - read the thesis before you buy." />
        <LedgerRow move="Corridor tracker “Now” panel" corr="/corridors" src="Corridors" why="Live notes on each corridor - this month, NICDC's early talks with West Bengal on a Durgapur node." />
        <LedgerRow move="Guest Research Papers" corr="/reports" src="CMS" why="Outside authors on the same platform; first up, the S³-LOGIC framework for freight-corridor governance." />
      </div>
      <Callout label="Use Them Live" tone={TEAL}>
        <p style={{ margin: 0 }}>Atlas <Link href="/research/">/research</Link> · Signals <Link href="/signals/">/signals</Link> · Dependencies <Link href="/dependencies/">/dependencies</Link> · Corridors <Link href="/corridors/">/corridors</Link> · Shape <Link href="/shape/">/shape</Link></p>
      </Callout>

      {/* FROM THE LAB */}
      <Kicker>From the Lab This Month</Kicker>
      <h2 id="from-the-lab" style={h2}>Four Published This Month</h2>
      <ul style={{ margin: '0 0 30px', paddingLeft: 20, lineHeight: 1.9 }}>
        <li><Link href="/reports/india-electronic-grade-chemicals-2026-2035/">India&rsquo;s Electronic-Grade Chemicals and Process Materials, 2026-2035</Link> - a smaller, later, solar-led market: USD 86 M (2026) to USD 264 M (2035); import dependence 57% today. 55 pp · ₹10,000 / ₹15,000.</li>
        <li><Link href="/reports/india-electronic-warfare-market-2026-2035/">India Electronic Warfare Market 2026-2035</Link> - a ₹3,200 cr FY24 baseline; a 9.5-year procurement cycle; GaN MMICs over 75% imported; a ₹45,500 cr RF prize. 98 pp · ₹6,999 / ₹11,999.</li>
        <li><Link href="/reports/india-private-strategic-weapons-industrial-base/">India&rsquo;s Private Strategic Weapons Industrial Base</Link> - private firms make 24% of defence production; seekers 85-90% imported; zero private test ranges. 78 pp · ₹6,999 / ₹11,999.</li>
        <li><Link href="/reports/governing-logistics-s3-logic/">Governing Logistics Under Systemic Disruption</Link> - guest paper by B. Rama Rao and K. V. Ramakrishna; the S³-LOGIC framework for freight-corridor governance. 53 pp · free.</li>
      </ul>

      {/* DEPENDENCY WATCH */}
      <Kicker>Dependency Watch</Kicker>
      <h2 id="dependency-watch" style={h2}>October&rsquo;s Chokepoints, Numbered</h2>
      <Figure src="/newsletter/october-dependency-watch.png" alt="Import share of layers beneath India's platforms: MOCVD reactors 100%, SiC substrates 95%, RF specialty gases 95%, BAW/SAW filters 90%, terminal missile seekers 85-90%, GaN MMICs 75%+, electronic-grade process chemicals 57%"
        caption="Import share - Techadyant Labs Electronic Warfare, Strategic Weapons and Electronic-Grade Chemicals reports (Oct 2026)." />
      <Callout label="Read It This Way" tone={CRIMSON}>
        <p style={{ margin: 0 }}>The radar, the jammer and the missile are assembled in India; the wafer they are built on, the reactor that grows it and the seeker that guides it are not. The only layer below 60% is the one where a contract &mdash; Tanfac&rsquo;s solar-grade HF &mdash; already exists. Contracts move import shares; announcements do not.</p>
      </Callout>

      {/* EXCLUSIVE SIGNAL */}
      <Kicker>Exclusive Signal - Follow-Up</Kicker>
      <h2 id="exclusive" style={h2}>The Twelfth Corridor&rsquo;s Rail Spine Moves to Alignment</h2>
      <p>In September we filed NICDC procurement 187 &mdash; a consultant brief for the Perspective Plan of a <strong>Dankuni-Surat Industrial Corridor (DSIC)</strong> &mdash; as the first documentary sign of a twelfth national industrial corridor. October added two pieces. The Railway Board is examining the alignment of the proposed 2,052-km Dankuni-Surat dedicated freight corridor and consulting stakeholders; and our corridor tracker logs NICDC in early talks with West Bengal on a proposed Durgapur node, not yet approved.</p>
      <p style={{ marginBottom: 30 }}>The pattern is the one that built the Delhi-Mumbai Industrial Corridor: the freight line first, the industrial corridor laid on its spine. <strong>The tell is unchanged:</strong> whether DPIIT names DSIC in the official NICDP list. Status: strengthening &mdash; still a signal, not a fact. <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, color: 'var(--text-dim, #8a8a99)' }}>SOURCE · NICDC tenders (procurement 187) · Business Today (15 Oct 2026) · Techadyant corridor tracker</span></p>

      {/* FORECAST */}
      <Kicker>Forecast · Conversion by 2035</Kicker>
      <h2 id="forecast" style={h2}>Three Ways This Plays Out &mdash; Unchanged</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '6px 0 36px' }}>
        <ForecastCard prob="45%" label="BASE CASE" tone="var(--text)">One or two corridors convert capability into owned output by 2035, but India stays import-dependent elsewhere. One month of named projects does not move the odds; a first shipment would.</ForecastCard>
        <ForecastCard prob="30%" label="BULL CASE" tone={GREEN}>The opened ranges, the magnet line and the fab&rsquo;s order book compound into a genuine chokepoint owned in at least one corridor.</ForecastCard>
        <ForecastCard prob="25%" label="BEAR CASE" tone={CRIMSON}>MoUs and indices become the deliverable; signatures multiply while orders keep flowing to imports.</ForecastCard>
      </div>

      {/* WATCHLIST */}
      <Kicker>What November Is Tracking</Kicker>
      <h2 id="watchlist" style={h2}>The Watchlist &mdash; Dated Tests</h2>
      <p style={{ marginBottom: 8 }}>Every date below is a promise someone made in public. Sanket will grade each one when it falls due.</p>
      <div style={{ margin: '0 0 34px' }}>
        <LedgerRow move="29 Oct 2026 - C-DAC compute empanelment bids close" corr="AI INFRA" src="C-DAC RFE" why="Who is empanelled for the 10,000-unit pool." />
        <LedgerRow move="Nov 2026 - Critical-minerals stockpiling policy" corr="CRIT. MINERALS" src="Mines Secretary, 9 Oct" why="Promised “within a month”." />
        <LedgerRow move="Apr 2027 - Probation review of the Nexon +2" corr="CRIT. MINERALS" src="Sanket" why="Land, site work or a magnet-scheme award - or the points come back." />
        <LedgerRow move="Nov 2027 - Missile technology handed to industry" corr="DEFENCE" src="Defence Secretary, 9 Oct" why="The first test of whether R&amp;D converts at the strategic end." />
        <LedgerRow move="Mid-2028 - Dholera first wafer (55/90 nm)" corr="SEMICONDUCTORS" src="E-grade Chemicals report" why="When the offtakes have to become wafers." />
        <LedgerRow move="Apr 2029 - Nexon Phase 1 magnet production" corr="CRIT. MINERALS" src="APEDB MoU" why="The first tonne." />
      </div>

      {/* MAILBAG */}
      <Callout label="The Mailbag" tone={BRASS}>
        <p style={{ marginTop: 0, fontStyle: 'italic' }}>The question we hear most: you move corridor scores on MoUs, tenders and contracts. Why should anyone trust a monthly number built on announcements?</p>
        <p style={{ marginBottom: 0 }}>Because the alternative &mdash; waiting for output &mdash; would leave the Board blank for years and tell you nothing about direction. A corridor moves only when a named project appears at a layer the framework scores, and the move is logged with its source. A score earned on a promise can be lost on a missed milestone, and we will say so in print &mdash; this month&rsquo;s critical-minerals +2 is explicitly on probation. <Link href="/shape/">Send yours via Shape</Link> for next month&rsquo;s Mailbag.</p>
      </Callout>

      {/* SOURCES */}
      <Kicker>Sources &amp; Methodology</Kicker>
      <h2 id="sources" style={h2}>Citable, Every Number</h2>
      <p style={{ marginBottom: 8 }}>The Board is an analyst-set reading on the Dependency Capture Framework&trade; (0-100 = value captured, not hosted); the Sanket Index is the rounded mean of the five corridors (41+40+39+33+25 = 35.6 → 36), persisted in board-history.json. Moves made on pre-production projects are held on probation.</p>
      <ul style={{ margin: '0 0 24px', paddingLeft: 20, lineHeight: 1.8, color: 'var(--text-muted)', fontSize: 14.5 }}>
        <li>Revised SOP opening MoD ranges and labs to industry - <em>Ministry of Defence (Oct 2026); Techadyant Signals S-147</em>.</li>
        <li>INS Samarthak: commissioned 16 Oct at Karwar; L&amp;T Shipyard; ~75% indigenous equipment - <em>Indian Navy; NewKerala / IANS (16 Oct 2026)</em>.</li>
        <li>₹4,106 cr contracts: GSAT-7C ₹2,563 cr (NSIL), Varunastra ~₹1,543 cr (BDL) - <em>Ministry of Defence; Business Standard (15 Oct 2026)</em>.</li>
        <li>Nexon Geochem ₹1,250 cr, 600 tpa NdFeB, Phase 1 by April 2029 - <em>APEDB MoU; Autocar Professional (14 Oct 2026)</em>.</li>
        <li>Recycling scheme ₹1,500 cr; 58 companies eligible - <em>Mines Ministry; Construction World (14 Oct 2026)</em>.</li>
        <li>Tata Dholera: six customers, three binding offtakes - <em>Digitimes (12 Oct 2026)</em>.</li>
        <li>C-DAC RFE for up to 10,000 AI compute units - <em>C-DAC; MediaNama (13 Oct 2026)</em>.</li>
        <li>Electronic-grade chemicals, electronic warfare and strategic weapons figures - <em>Techadyant Labs reports (Oct 2026)</em>.</li>
        <li>Dankuni-Surat DFC, 2,052 km, alignment under examination - <em>Business Today (15 Oct 2026)</em>.</li>
      </ul>
      <Callout label="Independence" tone={TEAL}>
        <p style={{ margin: 0 }}>No sponsored coverage; no positions in what we analyse. Corrections to <Link href="/corrections/">labs.techadyant.com/corrections</Link>.</p>
      </Callout>
    </div>
  );
}
