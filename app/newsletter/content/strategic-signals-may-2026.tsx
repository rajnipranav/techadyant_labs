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
function ForecastCard({ prob, label, tone, children }: { prob: string; label: string; tone: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `4px solid ${tone}`, borderRadius: 10, padding: 20 }}>
      <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 28, fontWeight: 700, color: tone }}>{prob}</div>
      <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, letterSpacing: '.1em', margin: '4px 0 12px' }}>{label}</div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>{children}</p>
    </div>
  );
}

export const toc = [
  { id: 'at-a-glance', label: 'Issue at a Glance' },
  { id: 'bottom-line', label: 'The Bottom Line' },
  { id: 'thesis', label: 'This Month’s Thesis' },
  { id: 'one-chart', label: 'One Chart' },
  { id: 'signals', label: 'Signals' },
  { id: 'framework', label: 'Dependency Capture Framework™' },
  { id: 'forecast', label: 'Forecast' },
];

export function IssueContent() {
  return (
    <div className="report-body" style={{ padding: 0 }}>
      {/* AT A GLANCE */}
      <h2 id="at-a-glance" style={h2}>The issue at a glance</h2>
      <Figure src="/newsletter/strategic-intelligence.svg" alt="India buys into the middle of the stack — strategic intelligence briefing: AI hardware stack, May 2026 signals, Dependency Capture Framework, strategic judgement and scenario forecast"
        caption="One-page intelligence summary — stack, signals, framework, judgement and forecast." />

      {/* BOTTOM LINE */}
      <Callout label="The Bottom Line" tone={BRASS}>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>The AI build-out stopped being a chip race in May — it became a capital, geography and defence story at once.</li>
          <li>India’s real opening is not the leading-edge fab. It is <strong>substrates, advanced packaging and components</strong> — and policy and capital both moved there this month.</li>
          <li>Three reinforcing moves: a <strong>$3.3bn Odisha substrate plant</strong>, NITI’s <strong>$120–150bn</strong> 2035 target, and PLI 2.0’s <strong>55% domestic-value</strong> rule.</li>
          <li>Compute is being financialised — Apollo/Blackstone’s <strong>$36bn TPU lease-back</strong> turns a demand wobble into a credit risk.</li>
          <li>Defence supply chains are cracking open (US munitions gap to 2031) — an opening India can supply into, if it is ready.</li>
        </ul>
      </Callout>

      {/* THESIS */}
      <Kicker>This Month’s Thesis</Kicker>
      <h2 id="thesis" style={h2}>Win the Middle, Not the Edge</h2>
      <p>For two years, the AI story was a GPU story. In May it became something larger. Capital reorganised around it — Apollo and Blackstone’s $36bn. Geography reorganised — France, Brazil, a post-fab Europe. Defence reorganised — a US munitions gap that now runs to 2031.</p>
      <p>India cannot win the leading edge. That race belongs to Taiwan and Nvidia, and the entry ticket is an EUV fab India will not build this decade. But the stack has a soft middle: substrates, advanced packaging, components. Lower-glamour, lower-headline — and ownable.</p>
      <p style={{ marginBottom: 30 }}>This month, the Indian state and India-bound capital moved into that middle at once: Odisha, the NITI target, PLI 2.0. The window to claim it is measured in quarters, not years.</p>
      <Figure src="/newsletter/hero_stack.png" alt="The AI infrastructure stack and India's way in"
        caption="The AI infrastructure stack — India’s opening is advanced packaging and substrates." />

      {/* ONE CHART */}
      <Kicker>One Chart</Kicker>
      <h2 id="one-chart" style={h2}>Semiconductor Value Capture</h2>
      <Figure src="/newsletter/one_chart_value.png" alt="Semiconductor value capture by layer"
        caption="Where the margin pools — and the highest rung India can realistically reach." />
      <Callout label="The Takeaway" tone={BRASS}>
        <p style={{ margin: 0, fontWeight: 600 }}>The top three rungs are closed to India this decade. Advanced packaging and substrates are the highest it can own — and the layers every fab depends on. That is the whole bet.</p>
      </Callout>

      {/* SIGNALS */}
      <Kicker>Signal of the Month · 78 / 100</Kicker>
      <h2 id="signals" style={h2}>$3.3 Billion Lands in Odisha — and It’s Substrates, Not Silicon</h2>
      <p>Intel and 3DGS will build an advanced-packaging substrate plant in Odisha. Substrates are the quiet chokepoint of the chip world — the layer you can own without an EUV fab, and the one Western and Chinese supply chains are now scrambling to secure. The first time India’s “package, don’t fabricate” logic shows up as poured concrete, not commentary.</p>
      <p style={{ marginBottom: 24 }}><strong>The tell to watch:</strong> whether a domestic substrate supply base forms around the plant — or whether it becomes an import-fed enclave that books its value offshore.</p>

      <Kicker>Three Signals That Matter</Kicker>
      <div style={{ margin: '6px 0 30px' }}>
        <Signal score={78} head="India underwrites the chip stack." src="Economic Times Tech"
          body="NITI Aayog sets a $120–150bn semiconductor value-chain target to 2035, with the state funding a third to de-risk it. A co-investment model is how Taiwan and Korea were built. The signal: India will underwrite, not wait." />
        <Signal score={79} head="PLI 2.0 aims below the surface." src="Economic Times Tech"
          body="The new mobile-phone PLI mandates over 55% domestic value addition. PLI 1 made India an assembler; PLI 2 targets the component base beneath it. The risk to watch is paper compliance over real localisation." />
        <Signal score={69} head="Compute becomes a credit asset." src="Economic Times Tech"
          body="Apollo and Blackstone structure a $36bn lease-back so Anthropic can buy Google TPUs. Compute is now financed like real estate — which means the next demand wobble is a credit event, not just a tech story." />
      </div>

      {/* KEY JUDGEMENT */}
      <Callout label="Key Judgement · Confidence: Moderate–High" tone={TEAL}>
        <p style={{ marginTop: 0 }}>We assess that India’s most defensible semiconductor position through 2030 is advanced packaging and substrates — not fabrication. May’s three commitments are mutually reinforcing, not coincidental: target, capital and incentive now point at the same layer.</p>
        <p style={{ marginBottom: 0 }}><strong style={{ color: CRIMSON }}>Principal risk:</strong> enclave economics — incentives concentrating in assembly that imports the hard inputs, leaving the value and the dependency offshore. Confidence is capped by India’s execution record on PLI value-addition targets.</p>
      </Callout>

      {/* SYSTEMS MAP */}
      <Kicker>Emerging Ecosystem Map</Kicker>
      <h2 style={h2}>How the AI Build-out Reaches Odisha</h2>
      <Figure src="/newsletter/systems_map.png" alt="Causal map: AI build-out to Odisha substrate plant"
        caption="Global AI demand → compute → packaging demand → Odisha — then bull or bear." />

      {/* FRAMEWORK */}
      <Kicker>The Techadyant Framework</Kicker>
      <h2 id="framework" style={h2}>The Dependency Capture Framework™</h2>
      <Figure src="/newsletter/framework.png" alt="Dependency Capture Framework — India's value capture by layer"
        caption="Where India captures value — not just hosts it. The battle is Layers 1–3." />
      <Quote>“India doesn’t need an EUV fab to win. It needs to own the layers every EUV fab depends on.”</Quote>

      {/* CONTRARIAN */}
      <Callout label="Contrarian View" tone={CRIMSON}>
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', fontSize: 22 }}>The $150 Billion Number Is the Wrong Target</h3>
        <p>Consensus cheered NITI’s $120–150bn goal. We’d be careful. Headline value-chain size is a vanity metric: a country can host $150bn of assembly and capture almost none of the margin — which is precisely what the first PLI delivered.</p>
        <p style={{ marginBottom: 0 }}>The number that decides India’s hardware decade isn’t chain size; it’s <strong>domestic value-add per dollar</strong>, and whether India owns the chokepoints — substrates, materials, equipment subcomponents — or merely the floor space they sit on.</p>
      </Callout>

      {/* FORECAST */}
      <Kicker>Forecast · India in Advanced Packaging, 2030</Kicker>
      <h2 id="forecast" style={h2}>Three Ways This Plays Out</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '6px 0 36px' }}>
        <ForecastCard prob="60%" label="BASE CASE" tone="var(--text)">India secures meaningful share in advanced packaging and substrates, but stays dependent on imported materials and equipment. Value captured, ceiling visible.</ForecastCard>
        <ForecastCard prob="25%" label="BULL CASE" tone={GREEN}>A domestic supplier ecosystem forms around Odisha — India’s first globally competitive semiconductor cluster, capturing value up the chain.</ForecastCard>
        <ForecastCard prob="15%" label="BEAR CASE" tone={CRIMSON}>Packaging scales but stays import-dependent — a repeat of PLI 1.0’s assembly-heavy, value-light outcome. Floor space, not chokepoints.</ForecastCard>
      </div>

      {/* GLOBAL STACK + LINKS */}
      <Figure src="/newsletter/global-ai-infra.svg" alt="Global AI hardware stack — India's opportunity zone in the AI infrastructure ecosystem, value capture by layer"
        caption="The global AI hardware stack — India’s opportunity zone in the ecosystem." />

      <Callout label="Go Deeper" tone={TEAL}>
        <p style={{ marginTop: 0 }}>The full report behind this month’s thesis publishes 15 June: <Link href="/reports/" style={{ color: TEAL }}>The Packaging Frontier</Link>. Related reading from the Labs:</p>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li><Link href="/reports/india-fab-ecosystem/" style={{ color: 'var(--primary, #818CF8)' }}>Who Really Benefits from India’s Fab Ecosystem?</Link></li>
          <li><Link href="/reports/india-ai-industrial-transition-2026-2035/" style={{ color: 'var(--primary, #818CF8)' }}>India’s AI Industrial Transition (2026–2035)</Link> — free</li>
          <li>Commission bespoke research or a DPR → <Link href="/services/" style={{ color: 'var(--primary, #818CF8)' }}>labs.techadyant.com/services</Link></li>
        </ul>
      </Callout>
    </div>
  );
}
