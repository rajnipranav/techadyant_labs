import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Free long-form analysis from Techadyant Labs on India’s industrial systems — drone batteries, semiconductors, critical minerals, defence and enterprise sovereignty.',
  alternates: { canonical: 'https://labs.techadyant.com/insights/' },
};

const ARTICLES = [
  {
    href: '/insights/india-drone-battery-ecosystem',
    kicker: 'Defence & Dual-Use',
    title: "Who Powers India's Drones? The Battery Dependency — and the Opportunity to Fix It",
    blurb: 'India imports ~80% of its drone-battery cells from China and captures barely 5–15% of pack value. The dependency, the US$10.8bn opportunity, and the path to sovereignty.',
    date: 'June 2026',
  },
];

export default function InsightsIndex() {
  return (
    <section className="wrap-narrow insight-index">
      <div className="ed-kicker">Insights</div>
      <h1>Analysis &amp; explainers</h1>
      <p className="insight-sub">Free long-form analysis drawn from our strategic-intelligence reports. Read the explainer, then go deep with the full report.</p>
      <div className="insight-list">
        {ARTICLES.map((a) => (
          <Link key={a.href} href={a.href} className="insight-card">
            <span className="ed-kicker">{a.kicker} · {a.date}</span>
            <h2>{a.title}</h2>
            <p>{a.blurb}</p>
            <span className="insight-readmore">Read the analysis <span className="arr">→</span></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
