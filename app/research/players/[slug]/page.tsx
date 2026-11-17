import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AtlasNav } from '../../AtlasNav';
import {
  allPlayers, playerSlug, playerBySlug, relationshipsFor, meta, corridorByCode,
} from '../../atlas';
import { JsonLd, breadcrumb, SITE } from '../../seo';
import { MicroFeedback } from '../../../components/MicroFeedback';
import { RelatedReportsLinks, ENTITY_TO_REPORTS } from '../../report-links';
import { PlayerIndustrialLinks } from '../../industrial/Backlinks';

export function generateStaticParams() {
  const slugs = allPlayers.map((p) => ({ slug: playerSlug(p.id) }));
  const ids = allPlayers.filter((p) => p.id !== playerSlug(p.id)).map((p) => ({ slug: p.id }));
  return [...slugs, ...ids];
}

const clampDesc = (s: string, n = 158): string => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

// ── Data-derived summary ────────────────────────────────────────────────────
// Roughly 560 of the 803 player records carry only a stub description (often just
// the name of the source atlas), so their pages shipped a boilerplate meta
// description and ~130 words of body copy. Players are the site's largest
// section by search impressions and its weakest by click-through. Everything
// below is assembled from the mapped relationship graph — nothing is invented —
// so each page gets a unique, quotable statement of what the entity is and how
// it connects, for both the SERP snippet and AI answer engines.
const TYPE_NOUN: Record<string, string> = {
  company: 'private company', foreign_supplier: 'foreign supplier', technology: 'technology',
  research_institution: 'research institution', facility: 'facility', scheme: 'government scheme',
  psu: 'public-sector undertaking', govt_body: 'government body', product: 'product category',
  mineral_material: 'critical material', opportunity_surface: 'opportunity surface',
  uas_platform: 'unmanned aerial system', jv: 'joint venture', industry_body: 'industry body',
  process: 'industrial process', standard: 'standard', country: 'country', ministry: 'ministry',
  mine: 'mine', university: 'university', ecosystem: 'ecosystem', industrial_park: 'industrial park',
  district_cluster: 'district cluster', infrastructure_node: 'infrastructure node',
};
const ORG_TYPES = ['company', 'psu', 'jv', 'foreign_supplier', 'research_institution', 'industry_body', 'financial_institution', 'university', 'govt_body', 'ministry'];
const DEPENDENCY_TYPES = ['technology', 'product', 'mineral_material', 'process', 'opportunity_surface'];
const SUMMARY_VERB: Record<string, [string, string]> = {
  supplies_to: ['supplies', 'is supplied by'], depends_on: ['depends on', 'is depended on by'],
  controls: ['controls', 'is controlled by'], invests_in: ['invests in', 'has investment from'],
  operates: ['operates', 'is operated by'], regulates: ['regulates', 'is regulated by'],
  beneficiary_of: ['benefits from', 'benefits'], subsidiary_of: ['is a subsidiary of', 'is the parent of'],
  customer_of: ['is a customer of', 'counts as customers'], competes_with: ['competes with', 'competes with'],
  partners_with: ['partners with', 'partners with'], located_in: ['is located in', 'hosts'],
};
const withArticle = (noun: string): string => `${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}`;
const joinNames = (names: string[], max = 3): string => {
  const uniq = [...new Set(names)];
  const head = uniq.slice(0, max);
  const rest = uniq.length - head.length;
  if (rest > 0) return `${head.join(', ')} and ${rest} more`;
  return head.length > 1 ? `${head.slice(0, -1).join(', ')} and ${head[head.length - 1]}` : head[0] ?? '';
};
function countryName(code: string | null): string {
  if (!code) return '';
  if (code === 'IN') return 'India';
  try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code; } catch { return code; }
}
/** A stub is a description too short to say anything (e.g. "Drone Intelligence Atlas."). */
const isStubDescription = (d: string | undefined): boolean => !d || d.trim().length < 60;

function playerSummary(p: { name: string; type_code: string; type: string; country: string | null; corridors: string[] | null }, edges: ReturnType<typeof relationshipsFor>): { intro: string; links: string } {
  const noun = TYPE_NOUN[p.type_code] ?? p.type.toLowerCase();
  const chains = (p.corridors ?? []).map((c) => corridorByCode(c)?.label).filter(Boolean) as string[];
  // The record's country is where the entity is registered/headquartered; for an
  // Indian arm of a foreign group that is the parent's country, so state it
  // neutrally in brackets rather than claiming the entity is "based" there.
  const indian = p.type_code !== 'country' && p.country === 'IN';
  const foreign = p.type_code !== 'country' && p.country && p.country !== 'IN' ? ` (${countryName(p.country)})` : '';
  const chainText = chains.length ? ` in India’s ${joinNames(chains, 4)} value chain${chains.length > 1 ? 's' : ''}` : ' in India’s industrial ecosystem';
  const intro = `${p.name} is ${withArticle(`${indian ? 'Indian ' : ''}${noun}`)}${foreign} tracked by Techadyant Labs${chainText}.`;
  const groups = new Map<string, string[]>();
  for (const e of edges) {
    const pair = SUMMARY_VERB[e.rel.type];
    if (!pair) continue;
    const verb = pair[e.dir === 'out' ? 0 : 1];
    groups.set(verb, [...(groups.get(verb) ?? []), e.other]);
  }
  const parts = [...groups.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 3).map(([verb, names]) => `${verb} ${joinNames(names)}`);
  const links = parts.length
    ? `Among its ${edges.length} mapped relationship${edges.length === 1 ? '' : 's'}, it ${parts.join('; ')}.`
    : '';
  return { intro, links };
}

const PLAYER_SEO: Record<string, { title: string; description: string }> = {
  'irel-odisha-sand-complex-oscom-chhatrapur': {
    title: 'IREL OSCOM Odisha: Chhatrapur Plant & Mineral Products',
    description: 'Explore IREL’s Odisha Sands Complex at Chhatrapur: mineral products, processing capabilities and links across India’s rare-earth supply chain.',
  },
  'irel-india-limited': {
    title: 'IREL India Limited: Rare Earth Mining, Processing & Strategy',
    description: 'Indian Rare Earths Limited (IREL): beach sand mining, monazite processing and rare earth separation — capacity, import dependencies and technology gaps.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = playerBySlug(slug);
  if (!p) return { title: 'Industrial Player Profile' };

  // Front-load the entity name (the thing people actually search) with a short,
  // natural qualifier — the old boilerplate suffix pushed the matched name behind
  // generic words and truncated in the SERP, throttling CTR on page-1 entity queries.
  const ov = PLAYER_SEO[slug];
  const canonicalSlug = playerSlug(p.id);
  // Type-aware and short: the old "— profile, capabilities & India supply chain"
  // tail added 44 characters to every title and described technologies, schemes
  // and standards as if they were companies.
  const tail = ORG_TYPES.includes(p.type_code) ? 'India Supply Chain Profile'
    : DEPENDENCY_TYPES.includes(p.type_code) ? 'India Import Dependency & Suppliers'
    : p.type;
  const longTitle = `${p.name} — ${tail}`;
  const title = ov?.title || (longTitle.length <= 62 ? longTitle : p.name);
  const summary = playerSummary(p, relationshipsFor(p.id));
  const descRaw = ov?.description || ((p.description && p.description.length >= 110)
    ? p.description
    : [isStubDescription(p.description) ? '' : p.description, summary.intro, summary.links].filter(Boolean).join(' '));
  const description = clampDesc(descRaw);

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/research/players/${canonicalSlug}/` },
    openGraph: {
      title,
      description,
      url: `${SITE}/research/players/${canonicalSlug}/`,
      type: 'article',
      siteName: 'Techadyant Labs',
      images: [{ url: '/og/default.png', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og/default.png'],
    },
  };
}

const DIR_LABEL: Record<string, string> = {
  supplies_to: 'Supplies', depends_on: 'Depends on', controls: 'Controls',
  invests_in: 'Invests in', operates: 'Operates', located_in: 'Located in',
  regulates: 'Regulates', beneficiary_of: 'Beneficiary of', subsidiary_of: 'Subsidiary of',
  customer_of: 'Customer of', competes_with: 'Competes with', partners_with: 'Partners with',
};
const IN_LABEL: Record<string, string> = {
  supplies_to: 'Supplied by', depends_on: 'Depended on by', controls: 'Controlled by',
  invests_in: 'Invested in by', operates: 'Operated by', regulates: 'Regulated by',
  beneficiary_of: 'Benefits', subsidiary_of: 'Parent of', customer_of: 'Customer',
  competes_with: 'Competes with', partners_with: 'Partners with',
};

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = playerBySlug(slug);
  if (!p) notFound();

  const edges = relationshipsFor(p.id);
  const corridors = (p.corridors ?? []);
  const isOrg = ['company', 'psu', 'jv', 'foreign_supplier', 'research_institution', 'industry_body', 'financial_institution'].includes(p.type_code);
  const summary = playerSummary(p, edges);
  const stub = isStubDescription(p.description);

  const orgLd = isOrg ? {
    '@context': 'https://schema.org', '@type': 'Organization',
    '@id': `${SITE}/research/players/${playerSlug(p.id)}/#org`,
    name: p.name, description: (stub ? [summary.intro, summary.links].filter(Boolean).join(' ') : p.description) || undefined,
    url: `${SITE}/research/players/${playerSlug(p.id)}/`,
    address: p.country ? { '@type': 'PostalAddress', addressCountry: p.country } : undefined,
    knowsAbout: corridors.map((code) => corridorByCode(code)?.label).filter(Boolean),
  } : null;
  const crumb = breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Players', path: '/research/players/' }, { name: p.name, path: `/research/players/${playerSlug(p.id)}/` }]);

  return (
    <>
      <AtlasNav />
      <JsonLd data={orgLd ? [crumb, orgLd] : [crumb]} />

      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">Atlas</Link><span className="sep">/</span>
            <Link href="/research/players/">Players</Link><span className="sep">/</span><span>{p.name}</span>
          </div>
          <h1>{p.name}</h1>
          <div className="player-meta">
            <span className="ply-type">{p.type}</span>
            <span className={`ply-flag ${p.country === 'IN' ? 'dom' : 'frn'}`}>{p.country}</span>
          </div>
          {!stub && <p className="lede" style={{ marginTop: 14 }}>{p.description}</p>}
          <p className={stub ? 'lede' : undefined} style={{ marginTop: 14 }}>{summary.intro}{summary.links ? ` ${summary.links}` : ''}</p>
          {playerSlug(p.id) === 'irel-odisha-sand-complex-oscom-chhatrapur' && (
            <p><Link href="/research/explainers/oscom-odisha/">What is OSCOM? Read its full form, location and mineral products.</Link></p>
          )}
          <div className="player-corr">
            {corridors.map((code) => {
              const m = meta(code);
              return (
                <Link key={code} href={`/research/dependencies/#${m.slug}`} className="player-corr-chip" style={{ ['--accent' as string]: m.accent }}>
                  {corridorByCode(code)?.label ?? code}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <section className="wrap-narrow">
        {edges.length > 0 ? (
          <>
            <h2 className="player-h2">Relationships</h2>
            <ul className="player-edges" role="list">
              {edges.map((e, i) => {
                const verb = e.dir === 'out' ? (DIR_LABEL[e.rel.type] ?? e.rel.type_label) : (IN_LABEL[e.rel.type] ?? e.rel.type_label);
                const otherP = allPlayers.find((x) => x.id === e.otherId);
                return (
                  <li key={i} className="player-edge">
                    <span className="pe-verb">{verb}</span>
                    {otherP ? (
                      <Link href={`/research/players/${playerSlug(e.otherId)}/`} className="pe-other">{e.other}</Link>
                    ) : <span className="pe-other">{e.other}</span>}
                    {e.rel.description && <span className="pe-desc">— {e.rel.description}</span>}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="player-empty">No mapped relationships yet for this entity.</p>
        )}

        <PlayerIndustrialLinks playerId={p.id} />

        <div style={{ marginTop: 24 }}>
          <MicroFeedback contentType="atlas" contentId={slug} prompt="Is anything missing on this entity?" />
        </div>

        <div className="player-foot">
          <Link href="/research/players/" className="see-all">← All players</Link>
          {ENTITY_TO_REPORTS[slug]?.length ? <RelatedReportsLinks slugs={ENTITY_TO_REPORTS[slug]} /> : <Link href="/reports/" className="see-all">Related reports →</Link>}
        </div>
      </section>
    </>
  );
}
