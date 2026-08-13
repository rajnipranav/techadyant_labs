import type { Metadata } from 'next';
import Link from 'next/link';
import ShapeBoard from './ShapeBoard';

export const metadata: Metadata = {
  title: 'Shape Techadyant — help decide what we research next',
  description:
    'Tell us what to research, map and build next. Techadyant researches the questions that matter to its readers — suggest a topic, ask a research question, improve the Atlas, or give feedback.',
  alternates: { canonical: 'https://labs.techadyant.com/shape/' },
};

export default function ShapePage() {
  return (
    <>
      <header className="ed-page-head"><div className="wrap inner">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Shape Techadyant</span></div>
        <h1>Shape Techadyant</h1>
        <p className="lede">
          Help us decide what to research, map and build next. Techadyant is built around questions that matter —
          tell us what you are trying to understand, what information is missing, or what capability you would like us to
          build. Your input helps shape future research, datasets, Atlas coverage and platform features.
        </p>
      </div></header>

      <section className="wrap-narrow" style={{ paddingTop: 30, paddingBottom: 20 }}>
        <div className="ed-kicker" style={{ marginBottom: 16 }}>What would you like to do?</div>
        <ShapeBoard />

        <div style={{ marginTop: 40, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 0 }}>
            Looking for something specific right now? You may already find it:
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, fontSize: 14.5 }}>
            <li>A company, technology or supplier → <Link href="/research/">explore the Atlas</Link></li>
            <li>Recent developments → <Link href="/signals/">browse Signals</Link></li>
            <li>Decision-grade analysis → <Link href="/reports/">browse Reports</Link></li>
            <li>How we work → <Link href="/methodology/">our methodology</Link></li>
          </ul>
          <p className="note-fine" style={{ marginTop: 20 }}>
            Your suggestions are private and reviewed editorially. Email is optional — we only use it to tell you if we take
            a topic up. See our <Link href="/privacy/">privacy policy</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
