import type { Metadata } from 'next';
import Link from 'next/link';
import { themes } from './data';
import { ThemeIcon } from '../components/ThemeIcon';

export const metadata: Metadata = {
  title: 'Research themes',
  description:
    'Four lines of inquiry: semiconductor ecosystems, industrial infrastructure, strategic technology and economic geography.',
};

const detail: Record<string, string[]> = {
  semiconductors: [
    'Fabrication, assembly/test and advanced packaging',
    'Materials, substrates and specialty supply chains',
    'Value capture, beneficiaries and localisation',
  ],
  infrastructure: [
    'Water economies of manufacturing corridors',
    'Firm power, land and Special Investment Regions',
    'Logistics, customs and corridor connectivity',
  ],
  'strategic-tech': [
    'AI infrastructure and compute',
    'Energy systems for industrial scale',
    'Dual-use and the technology–strategy frontier',
  ],
  'economic-geography': [
    'Clusters, corridors and spatial value concentration',
    'Second-order and redistribution effects',
    'Regional resource reallocation',
  ],
};

export default function ResearchPage() {
  return (
    <>
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span>Research</span>
          </div>
          <h1>Four lines of inquiry</h1>
          <p className="lede">
            Our work is organised around four interlocking themes. Each examines a different
            layer of India’s industrial system — and the dependencies that connect them.
          </p>
        </div>
      </header>

      <section className="wrap">
        {themes.map((th, idx) => (
          <div
            key={th.id}
            id={th.id}
            className="platform-band"
            style={{
              scrollMarginTop: 90,
              padding: '44px 0',
              borderTop: idx === 0 ? 'none' : '1px solid var(--rule)',
              ['--theme-accent' as string]: th.accent,
            }}
          >
            <div>
              <div style={{ color: th.accent, marginBottom: 18 }}><ThemeIcon icon={th.icon} /></div>
              <div className="theme-no" style={{ marginBottom: 10 }}>{th.no} / THEME</div>
              <h2 style={{ fontSize: 'clamp(24px,2.6vw,32px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {th.title}
              </h2>
              <span className="theme-count" style={{ marginTop: 14, display: 'inline-block', ['--theme-accent' as string]: th.accent }}>
                {th.count}
              </span>
            </div>
            <div className="pb-body">
              <p className="serif" style={{ fontSize: 18, lineHeight: 1.7 }}>{th.blurb}</p>
              <ul className="pb-principles" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
                {detail[th.id].map((d) => (
                  <li key={d} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                    <span style={{ color: th.accent, fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12 }}>→</span>
                    <span className="pv" style={{ fontSize: 15 }}>{d}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 22, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link href="/reports" className="see-all">Reports →</Link>
                <Link href="/signals" className="see-all">Signals →</Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
