// Back-links from existing Atlas surfaces (players, signals, corridor nodes) into the
// Industrial Intelligence layer. Each renders nothing when there is no link, so the host
// pages are unchanged for every entity outside the pilot.
import Link from 'next/link';
import { opportunityHref, programmeRef } from '../programmes/data';
import {
  getIndustrialNode, getOpportunity, linkForSignal, nodesForCorridorNode, nodesForPlayer, opportunitiesForPlayer,
} from './data';

const box: React.CSSProperties = { marginTop: 28, border: '1px solid var(--rule, rgba(255,255,255,.1))', borderRadius: 12, padding: '16px 18px', background: 'var(--bg-2, rgba(255,255,255,.02))' };
const kicker: React.CSSProperties = { fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--brass, #F5B544)', marginBottom: 10 };

export function PlayerIndustrialLinks({ playerId }: { playerId: string }) {
  const nodes = nodesForPlayer(playerId);
  const opps = opportunitiesForPlayer(playerId);
  if (!nodes.length && !opps.length) return null;
  return (
    <div style={box}>
      <div style={kicker}>Industrial node &amp; connectivity</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
        {nodes.map((n) => {
          const c = n.companies.find((x) => x.player_ids.includes(playerId));
          return (
            <li key={n.id} style={{ fontSize: 14.5 }}>
              <Link href={`/research/industrial-nodes/${n.slug}/`}>{n.name}</Link>
              {c && <span style={{ color: 'var(--text-muted)' }}> — {c.role}; {c.status}</span>}
            </li>
          );
        })}
        {opps.map((o) => (
          <li key={o.id} style={{ fontSize: 14 }}>
            <span style={{ color: 'var(--text-muted)' }}>Opportunity surface (Techadyant analysis): </span>
            <Link href={opportunityHref(o)}>{o.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SignalAtlasLinks({ slug }: { slug: string }) {
  const link = linkForSignal(slug);
  if (!link) return null;
  const nodes = link.related_industrial_nodes.map(getIndustrialNode).filter((n): n is NonNullable<typeof n> => Boolean(n));
  const opps = link.opportunity_surfaces.map(getOpportunity).filter((o): o is NonNullable<typeof o> => Boolean(o));
  const progs = (link.related_programmes ?? []).map(programmeRef);
  if (!nodes.length && !progs.length && !opps.length) return null;
  return (
    <div style={box}>
      <div style={kicker}>In the Atlas</div>
      <p style={{ fontSize: 14.5, margin: '0 0 8px', color: 'var(--text-muted)' }}>
        {nodes.length ? <>Connectivity, dependencies and opportunity surfaces for the industrial node{nodes.length > 1 ? 's' : ''} this signal touches:</> : <>Where this signal sits in the Atlas:</>}
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
        {nodes.map((n) => <li key={n.id}><Link href={`/research/industrial-nodes/${n.slug}/`}>{n.name} →</Link></li>)}
        {progs.map((r) => <li key={r.id}><span style={{ color: 'var(--text-muted)' }}>Programme: </span>{r.href ? <Link href={r.href}>{r.name} →</Link> : r.name}</li>)}
        {opps.map((o) => <li key={o.id} style={{ fontSize: 14 }}><span style={{ color: 'var(--text-muted)' }}>Opportunity surface: </span><Link href={opportunityHref(o)}>{o.title}</Link></li>)}
      </ul>
    </div>
  );
}

export function CorridorNodeDossierLink({ corridor, node }: { corridor: string; node: string }) {
  const nodes = nodesForCorridorNode(corridor, node);
  if (!nodes.length) return null;
  return (
    <div style={box}>
      <div style={kicker}>Connectivity intelligence</div>
      {nodes.map((n) => (
        <p key={n.id} style={{ margin: 0, fontSize: 15 }}>
          {n.headline}{' '}
          <Link href={`/research/industrial-nodes/${n.slug}/`} className="see-all">Open the {n.short_name} industrial-node dossier →</Link>
        </p>
      ))}
    </div>
  );
}
