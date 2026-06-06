import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CorridorMap } from '../CorridorMap';
import { CorridorTrack } from '../CorridorTrack';
import { corridors, corridorBySlug, CLASS_COLOR, CLASS_LABEL } from '../data';
import { getReport } from '../../reports/data';
import { JsonLd, breadcrumb, faqLd, datasetLd, SITE } from '../../research/seo';

export function generateStaticParams() {
  return corridors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = corridorBySlug(slug);
  if (!c) return { title: 'Corridor' };
  return {
    title: `${c.name} (${c.abbr}) — status, nodes & investor dossier`,
    description: `${c.blurb} ${c.length}. Status, anchor nodes, programme, official sources and related research for India’s ${c.name}.`,
    alternates: { canonical: `${SITE}/corridors/${c.slug}/` },
  };
}

export default async function CorridorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = corridorBySlug(slug);
  if (!c) notFound();
  const accent = CLASS_COLOR[c.cls];
  const statesCount = c.states.split(',').length;
  const idx = corridors.findIndex((x) => x.slug === c.slug);
  const prev = corridors[(idx - 1 + corridors.length) % corridors.length];
  const next = corridors[(idx + 1) % corridors.length];
  const rel = c.reports.map((s) => getReport(s)).filter(Boolean) as NonNullable<ReturnType<typeof getReport>>[];
  const label = c.name.replace(' Industrial Corridor', '').replace(' Economic Corridor', '');

  return (
    <>
      <JsonLd data={[
        breadcrumb([
          { name: 'Home', path: '/' },
          { name: 'Corridors', path: '/corridors/' },
          { name: c.name, path: `/corridors/${c.slug}/` },
        ]),
        datasetLd({
          name: `${c.name} (${c.abbr}) — corridor profile`,
          description: `Status, anchor nodes, programme and related research for India’s ${c.name}.`,
          path: `/corridors/${c.slug}/`,
          keywords: [c.name, c.abbr, 'India', 'industrial corridor', 'NICDP', ...c.states.split(',').map((s) => s.trim())],
        }),
        faqLd(c.faq),
      ]} />

      {/* 1 · Header */}
      <header className="ed-page-head" style={{ ['--accent' as string]: accent }}>
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/corridors">Corridors</Link><span className="sep">/</span><span>{label}</span>
          </div>
          <span className="corr-chip" style={{ color: accent }}>
            {(c.tag ? c.tag + ' · ' : '') + 'Corridor ' + String(c.num).padStart(2, '0')}
          </span>
          <h1 style={{ marginTop: 12 }}>{c.name}</h1>
          <p className="lede">{c.blurb}</p>
          <div className="corr-stats">
            <div><span className="cs-n" style={{ color: accent }}>{c.length.split(' · ')[0]}</span><span className="cs-l">Length</span></div>
            <div><span className="cs-n">{statesCount}</span><span className="cs-l">States</span></div>
            <div><span className="cs-n">{c.nodes.length}</span><span className="cs-l">Anchor nodes</span></div>
            <div><span className="cs-n" style={{ color: accent, fontSize: '1rem' }}>{CLASS_LABEL[c.cls]}</span><span className="cs-l">Status</span></div>
          </div>
        </div>
      </header>

      {/* 2 · Map */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>Where it runs</div><h2>On the map</h2></div>
          <Link href="/corridors" className="see-all">All 11 corridors →</Link></div>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <CorridorMap focus={c.slug} navigate />
        </div>
      </section>

      {/* 3 · At a glance */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>The basics</div><h2>At a glance</h2></div></div>
        <ul className="corr-facts">
          <li><div className="k">Route &amp; length</div><div className="v">{c.length}</div></li>
          <li><div className="k">States</div><div className="v">{c.states}</div></li>
          <li><div className="k">Programme</div><div className="v">{c.programme}</div></li>
          <li><div className="k">Status</div><div className="v">{c.status}</div></li>
        </ul>
      </section>

      {/* 4 · Anchor nodes */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>Industrial cities</div><h2>Anchor nodes</h2></div></div>
        <div className="node-cards">
          {c.nodes.map((n) => (
            <div key={n.name} className="node-card">
              <h3>{n.name}</h3>
              <div className="st">{n.state}</div>
              <p>{n.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5 · Why it matters — the Techadyant view */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>The Techadyant view</div><h2>Why it matters</h2></div></div>
        <p className="lede" style={{ maxWidth: '52ch' }}>
          Beyond the freight line, the {c.abbr} is where several of the systems we track physically
          converge. Our corridor-level analysis — the sector clusters forming here, the opportunity
          surfaces for industry and MSMEs, and who actually captures the value — is being built out
          corridor by corridor.
        </p>
        <p className="corr-soon">Deep-dive analysis in progress. The related research below covers the themes that land along this corridor.</p>
      </section>

      {/* 6 · Related research */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>From the desk</div><h2>Related research</h2></div>
          <Link href="/reports" className="see-all">All reports →</Link></div>
        {rel.length > 0 ? (
          <div className="corr-rel">
            {rel.map((r) => (
              <Link key={r.slug} href={`/reports/${r.slug}`}>
                <span className="rk">{r.access === 'free' ? 'Free report' : 'Paid report'}</span>
                <span className="rt">{r.title}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="corr-soon">Corridor-specific research is expanding. Meanwhile, browse the full library.</p>
        )}
      </section>

      {/* 7 · Official sources */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>Primary links</div><h2>Official sources</h2></div></div>
        <ul className="corr-official">
          {c.official.map((o) => (
            <li key={o.url}><a href={o.url} target="_blank" rel="noopener noreferrer">↗ {o.label}</a></li>
          ))}
        </ul>
      </section>

      {/* 8 · Track this corridor */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: accent }}>Stay current</div><h2>Track this corridor</h2></div></div>
        <p className="lede" style={{ maxWidth: '50ch' }}>Get an email when this corridor’s status, nodes or our analysis changes.</p>
        <CorridorTrack slug={c.slug} label={`${label} corridor`} />

        <nav className="corr-prevnext" style={{ marginTop: 40 }}>
          <Link href={`/corridors/${prev.slug}`}><span className="pn-k">← Previous</span>{prev.name}</Link>
          <Link href={`/corridors/${next.slug}`} style={{ textAlign: 'right' }}><span className="pn-k">Next →</span>{next.name}</Link>
        </nav>
      </section>
    </>
  );
}
