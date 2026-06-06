import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { STATUS_COLORS, STATUS_SHORT, atlas } from '../atlas';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../seo';

export const metadata: Metadata = {
  title: 'Methodology — how the Atlas is built',
  description:
    'How Techadyant Labs scores value-chain capture, what the layers mean, how we verify, and how often the Atlas is updated.',
  alternates: { canonical: `${SITE}/research/methodology/` },
};

const LAYERS = [
  ['Raw Materials', 'The minerals, chemicals and feedstock at the base of the chain.'],
  ['Refining & Processing', 'Turning raw inputs into usable, grade-specified materials.'],
  ['Components & Inputs', 'The discrete parts and sub-assemblies built from those materials.'],
  ['Equipment & Capital Goods', 'The machines and tools that make the components.'],
  ['Manufacturing & Integration', 'Assembling and integrating into finished systems.'],
  ['Services & IP', 'The design, software and intellectual property layer on top.'],
];

export default function MethodologyPage() {
  return (
    <>
      <AtlasNav />
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Methodology', path: '/research/methodology/' }]),
        {
          '@context': 'https://schema.org', '@type': 'DefinedTermSet',
          name: 'Techadyant value-chain capture scale', url: `${SITE}/research/methodology/`, publisher: ORG_REF,
          hasDefinedTerm: STATUS_SHORT.map((label, i) => ({ '@type': 'DefinedTerm', name: `${i} — ${label}`, termCode: String(i),
            description: i === 0 ? 'Total import dependence' : i === 5 ? 'Sovereign / captured capability' : `${label} domestic capability` })),
        },
      ]} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research">Atlas</Link><span className="sep">/</span><span>Methodology</span>
          </div>
          <h1>How the Atlas is built</h1>
          <p className="lede">
            The Atlas is the public face of our research database. Every figure here is an analyst
            assessment traceable to a primary source, scored on a consistent scale and dated so you
            can see how fresh it is.
          </p>
        </div>
      </header>

      <section className="wrap-narrow atlas-prose">
        <h2>The capture scale</h2>
        <p>
          Each layer of an ecosystem’s value chain is scored 0–5 for how much of it India can do for
          itself — from total import-dependence to sovereign capability.
        </p>
        <div className="atlas-scale">
          {STATUS_SHORT.map((s, i) => (
            <div key={s} className="atlas-scale-row">
              <span className="atlas-scale-dot" style={{ background: STATUS_COLORS[i] }}>{i}</span>
              <strong>{s}</strong>
            </div>
          ))}
        </div>

        <h2>The value-chain layers</h2>
        <p>
          The four industrial ecosystems are assessed across a common six-layer chain. Enterprise
          Software, being a software stack, is assessed across its own layers (public cloud, ERP,
          databases, identity, payment rails and so on).
        </p>
        <dl className="atlas-defs">
          {LAYERS.map(([t, d]) => (
            <div key={t}><dt>{t}</dt><dd>{d}</dd></div>
          ))}
        </dl>

        <h2>Verification &amp; updates</h2>
        <p>
          Every assessment carries a verification label — <em>verified</em>, <em>single-source</em>
          or <em>unverified</em> — and an assessment date. The Atlas currently holds{' '}
          {atlas.grid.length} assessments across {atlas.corridors.length} ecosystems and{' '}
          {atlas.players.length} tracked players, refreshed as our signal engine surfaces material
          change. It is a reference, not a verdict: where the evidence is thin we say so.
        </p>
        <p>
          The Atlas is free. The full reasoning behind each ecosystem lives in our{' '}
          <Link href="/reports">long-form reports</Link>.
        </p>
      </section>
    </>
  );
}
