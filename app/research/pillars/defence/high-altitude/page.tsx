import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { JsonLd, breadcrumb, SITE, ORG_REF } from '../../../seo';
import { card, kick } from '../ui';
import { DefenceTrack } from '../DefenceTrack';
import { HighAltitudeExplorer, type HaEntity } from './HighAltitudeExplorer';
import ha from '../_high_altitude.json';

const BASE = '/research/pillars/defence';
const PATH = `${BASE}/high-altitude/`;

type Supplier = {
  id: string; company: string; parent_group: string; capability: string; product: string; relevance: string;
  grade: string; source_ref: string; atlas_path: string | null; linked_entities: string[]; note: string;
};
type Opp = { id: string; name: string; problem: string; category: string; priority: string; evidence: string; next: string };
type Src = { id: string; title: string; url: string; cls: string; coverage: string; checked: string };

const entities = ha.entities as HaEntity[];
const suppliers = ha.suppliers as Supplier[];
const opps = ha.opportunities as Opp[];
const sources = ha.sources as Src[];
const srcById = Object.fromEntries(sources.map((s) => [s.id, s]));
const entById = Object.fromEntries(entities.map((e) => [e.id, e]));
const categories = ha.categories.map((c) => c.category);
const count = (pred: (e: HaEntity) => boolean) => entities.filter(pred).length;
const orgs = new Set(entities.map((e) => e.organisation));
const updated = new Date(ha.last_updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const FAQ = [
  {
    q: 'Does India have a formal high-altitude defence corridor?',
    a: 'No such corridor is assumed here. This Atlas maps the documented high-altitude defence technology ecosystem — DRDO research needs, technologies available for transfer, Army demonstrations, programmes and suppliers — without implying a designated corridor or scheme exists.',
  },
  {
    q: 'Who leads high-altitude defence R&D in India?',
    a: `DRDO's high-altitude laboratories dominate the documented record — DIHAR/DIBER (cold-arid agriculture, shelter, sustainment), DIPAS (physiology and acclimatisation), DEBEL and R&DE(E) — alongside the DRDO industry-academia centres at IIT Roorkee and IIT Jodhpur. The Atlas maps ${entities.length} entities across ${orgs.size} organisations.`,
  },
  {
    q: 'Which Indian companies make high-altitude drones?',
    a: `The supplier layer lists ${suppliers.length} Indian companies with primary evidence of high-altitude UAV capability or demonstration, including ideaForge (YETI, 6,500 m max take-off altitude), EndureAir (SABAL), BonV Aero (Air Hans, 16,500 ft ceiling) and Raphe mPhibr (DRDO TDF-backed high-altitude stores-carriage drone). Procurement status is not inferred from product claims.`,
  },
  {
    q: 'What does evidence grade A mean here?',
    a: 'Grade A means a primary source directly documents the stated claim type. It does not mean the technology is mature, deployed, indigenous, procured or commercially successful — which is why every entity also carries a claim type such as "Research need" or "ToT available".',
  },
];

export const metadata: Metadata = {
  title: 'High-Altitude Defence Technology Atlas — India',
  description: `India's high-altitude defence technology ecosystem mapped: ${entities.length} evidence-graded entities across ${categories.length} categories, ${suppliers.length} suppliers and ${opps.length} industrial opportunity surfaces — DRDO research needs, ToT, Army demonstrations and high-altitude UAS. Every entry cites a primary source.`,
  alternates: { canonical: `${SITE}${PATH}` },
};

const linkStyle: React.CSSProperties = { color: 'var(--link, #6cb0ff)', textDecoration: 'none' };
const pill: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, borderRadius: 5, padding: '1px 7px', border: '1px solid var(--border, rgba(255,255,255,.18))', whiteSpace: 'nowrap' };

function SrcBadge({ id }: { id: string }) {
  const s = srcById[id];
  if (!s) return null;
  return (
    <a href={s.url} target="_blank" rel="noreferrer" title={s.title} style={{ fontSize: 10, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--brass-cream, #E6D1A0)', border: '1px solid var(--border, rgba(255,255,255,.18))', borderRadius: 4, padding: '0 5px', textDecoration: 'none' }}>{s.id}</a>
  );
}

export default function HighAltitudeAtlasPage() {
  const ld = [
    breadcrumb([
      { name: 'Home', path: '/' },
      { name: 'The Atlas', path: '/research/' },
      { name: 'Defence', path: `${BASE}/` },
      { name: 'High-Altitude Defence', path: PATH },
    ]),
    {
      '@context': 'https://schema.org', '@type': 'Dataset',
      name: ha.title, description: `${ha.subtitle}. ${ha.scope_note}`,
      url: `${SITE}${PATH}`, creator: ORG_REF, publisher: ORG_REF, version: ha.version,
      license: 'https://creativecommons.org/licenses/by/4.0/', isAccessibleForFree: true,
      dateModified: ha.last_updated, spatialCoverage: { '@type': 'Place', name: 'India — Himalayan and high-altitude areas' },
      variableMeasured: ['technology category', 'claim type', 'evidence grade', 'organisation', 'supplier capability'],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <Link href={`${BASE}/`}>Defence</Link><span className="sep">/</span><span>High-Altitude Defence</span>
          </div>
          <div className="ed-kicker" style={{ color: '#7DD3FC' }}>Defence &amp; Dual-Use · Thematic Atlas · v{ha.version}</div>
          <h1>India&apos;s high-altitude defence technology ecosystem</h1>
          <p className="lede">
            The R&amp;D, testing and industrial base behind operating at altitude — energy in the cold, drones in thin air,
            shelter, soldier physiology, sustainment and qualification — mapped from primary sources, with every claim
            typed so a DRDO research need never reads as a fielded capability.
          </p>
          <div className="atlas-meta-row">
            <span><b>{entities.length}</b> entities</span>
            <span><b>{categories.length}</b> categories</span>
            <span><b>{orgs.size}</b> organisations</span>
            <span><b>{suppliers.length}</b> suppliers</span>
            <span><b>{opps.length}</b> opportunity surfaces</span>
            <span><b>{sources.length}</b> sources</span>
            <span className="atlas-updated">Updated {updated}</span>
          </div>
        </div>
      </header>

      {/* Scope + how to read */}
      <section className="wrap">
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div style={{ ...card, borderLeft: '3px solid #7DD3FC' }}>
            <div style={{ ...kick, marginBottom: 8 }}>Scope</div>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.6 }}>{ha.scope_note}</p>
          </div>
          <div style={card}>
            <div style={{ ...kick, marginBottom: 8 }}>How to read the evidence</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>
              {ha.evidence_policy.map((p) => (
                <li key={p.grade}><b style={{ color: 'var(--text)' }}>{p.grade}</b> — {p.meaning}. {p.rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Category overview */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Ten technology categories</div><h2>What operating at altitude demands</h2></div>
          <p className="section-note">Counts show documented entities per category, and how many are only research needs versus technologies available for transfer or demonstrated.</p>
        </div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          {ha.categories.map((c) => {
            const n = count((e) => e.category === c.category);
            const need = count((e) => e.category === c.category && e.claim_type === 'research_need');
            const tot = count((e) => e.category === c.category && e.claim_type === 'technology_transfer_available');
            return (
              <div key={c.category_id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{c.category}</div>
                  <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 20, fontWeight: 800, color: 'var(--brass-cream, #E6D1A0)' }}>{n}</div>
                </div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', margin: '2px 0 6px' }}>{c.type}</div>
                <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.5 }}>{c.definition}</p>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 8 }}>{need} research needs · {tot} ToT available</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Entity register */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Entity register</div><h2>All {entities.length} documented entities</h2></div>
          <p className="section-note">Filter by category or claim type. Every row links to its primary source; the letter after the source ID is the evidence grade.</p>
        </div>
        <HighAltitudeExplorer
          entities={entities} categories={categories} sources={sources}
          claimLabels={ha.claim_labels as Record<string, string>} claimNotes={ha.claim_notes as Record<string, string>}
        />
      </section>

      {/* Suppliers */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Industrial layer</div><h2>High-altitude suppliers</h2></div>
          <p className="section-note">Indian companies with primary evidence of high-altitude capability, trials or programmes. Procurement status, localisation and component origin are not inferred from product claims.</p>
        </div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {suppliers.map((s) => (
            <div key={s.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>
                  {s.atlas_path ? <Link href={s.atlas_path} style={{ ...linkStyle, color: 'var(--text)' }}>{s.company} →</Link> : s.company}
                </div>
                <span style={{ display: 'inline-flex', gap: 4 }}><SrcBadge id={s.source_ref} /><span style={{ ...pill, color: 'var(--brass-cream, #E6D1A0)' }}>{s.grade}</span></span>
              </div>
              {s.parent_group && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Group: {s.parent_group}</div>}
              <div style={{ ...kick, fontSize: 10, margin: '6px 0 4px' }}>{s.capability}</div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}><b style={{ color: 'var(--text)' }}>{s.product}</b> — {s.relevance}</p>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>
                Linked to: {s.linked_entities.map((id, i) => (
                  <span key={id}>{i > 0 && ', '}<a href={`#${id.toLowerCase()}`} style={linkStyle}>{entById[id]?.name ?? id}</a></span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {ha.excluded_suppliers.length > 0 && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.6 }}>
            Held back pending primary corroboration: {ha.excluded_suppliers.map((x) => `${x.company} (grade ${x.evidence_grade})`).join(', ')}.
          </p>
        )}
      </section>

      {/* Opportunity surfaces */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Industrial opportunity surfaces</div><h2>Where the ecosystem is thin</h2></div>
          <p className="section-note">Techadyant research hypotheses built on the documented record — where to look next, not investment recommendations.</p>
        </div>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {opps.map((o) => (
            <div key={o.id} style={{ ...card, borderLeft: `3px solid ${o.priority === 'High' ? '#F5B544' : 'var(--border, rgba(255,255,255,.2))'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{o.name}</div>
                <span style={{ ...pill, color: o.priority === 'High' ? '#F5B544' : 'var(--text-dim)' }}>{o.priority}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 6px' }}>{o.id} · {o.category}</div>
              <p style={{ margin: '0 0 6px', fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.5 }}><b style={{ color: 'var(--text)' }}>Problem:</b> {o.problem}</p>
              <p style={{ margin: '0 0 6px', fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.5 }}><b style={{ color: 'var(--text)' }}>Evidence:</b> {o.evidence}</p>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.5 }}><b style={{ color: 'var(--text)' }}>Next research:</b> {o.next}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-links to the component layer */}
      <section className="wrap">
        <div style={{ ...card, borderLeft: '3px solid var(--brass, #F5B544)' }}>
          <div style={{ ...kick, marginBottom: 8 }}>The component question</div>
          <p style={{ margin: '0 0 10px', fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.6 }}>
            Altitude is where drone dependencies bite hardest — cells lose capacity in the cold, motors and propellers lose thrust in thin air,
            and electronics must be qualified for both. The UAS Atlas maps that component layer, including suppliers surfaced at Drone Expo 2026.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 13.5 }}>
            <Link href="/research/drones-uas/" style={linkStyle}>UAS Atlas — newly mapped subsystem suppliers</Link>
            <Link href="/research/drones-uas/company/ascend-powerpacks/" style={linkStyle}>Ascend Powerpacks (packs / BMS)</Link>
            <Link href="/research/drones-uas/company/arkin-labs/" style={linkStyle}>Arkin Labs (flight control / GNSS)</Link>
            <Link href="/research/drones-uas/company/yari-robotics/" style={linkStyle}>YARI Robotics (flight control / ESC)</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="section-head-ed"><div><div className="ed-kicker">Questions</div><h2>Frequently asked</h2></div></div>
        <div style={{ display: 'grid', gap: 16, maxWidth: 820 }}>
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 style={{ fontSize: 16, margin: '0 0 5px' }}>{f.q}</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources + corrections */}
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker">Evidence base</div><h2>Sources ({sources.length})</h2></div></div>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, fontSize: 13 }}>
          {sources.map((s) => (
            <li key={s.id} id={s.id.toLowerCase()} style={{ color: 'var(--text-dim)' }}>
              <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, color: 'var(--brass-cream, #E6D1A0)' }}>{s.id}</span>{' '}
              <a href={s.url} target="_blank" rel="noreferrer" style={linkStyle}>{s.title}</a>{' '}
              <span style={{ color: 'var(--text-muted)' }}>· {s.cls} · {s.coverage} · checked {s.checked}</span>
            </li>
          ))}
        </ol>
        <details style={{ marginTop: 16, fontSize: 12.5, color: 'var(--text-dim)' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--text)' }}>Editorial corrections and open items ({ha.corrections.length + ha.open_items.length})</summary>
          <ul style={{ lineHeight: 1.6 }}>
            {ha.corrections.map((c) => <li key={c.id}><b>{c.id}</b> ({c.target}): {c.change} {c.reason}</li>)}
            {ha.open_items.map((o) => <li key={o.id}><b>{o.id}</b> ({o.target}): {o.note}</li>)}
          </ul>
        </details>
      </section>

      <section className="wrap">
        <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={card}>
            <div style={{ ...kick, marginBottom: 8 }}>Track this ecosystem</div>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>Get an email when the High-Altitude Defence Atlas is updated.</p>
            <DefenceTrack source="defence-high-altitude-watch" />
          </div>
          <div style={card}>
            <div style={{ ...kick, marginBottom: 8 }}>The rest of Defence</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5 }}>
              <Link href={`${BASE}/`} style={linkStyle}>Defence &amp; Dual-Use — overview</Link>
              <Link href={`${BASE}/army/`} style={linkStyle}>Army Atlas</Link>
              <Link href={`${BASE}/air-force/`} style={linkStyle}>Air Force Atlas</Link>
              <Link href="/research/drones-uas/" style={linkStyle}>Unmanned Systems Atlas</Link>
              <Link href="/research/counter-uas/" style={linkStyle}>Counter-UAS Atlas</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
