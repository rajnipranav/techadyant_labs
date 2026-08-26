// Shared, parameterised presentational components for the Defence Atlas.
// Pure (no hooks) so they render in both server and client components. Inline-styled
// to match the house style used across the other Atlas micro-sites.
import Link from 'next/link';
import {
  entityById, entitySlug, statusInfo, originOf, sourcesFor, humanize,
  type Entity, type Source, type ServiceCode,
} from './data';

export const DEFENCE_BASE = '/research/pillars/defence';

export const card: React.CSSProperties = {
  border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10,
  padding: '14px 16px', background: 'var(--bg-2, rgba(255,255,255,.02))',
};
export const kick: React.CSSProperties = {
  fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase',
  color: 'var(--brass-cream, #E6D1A0)', fontWeight: 600,
};

const SERVICE_LABEL: Record<ServiceCode, string> = {
  army: 'Army', navy: 'Navy', coast_guard: 'Coast Guard', air_force: 'Air Force', joint: 'Joint',
};
const SERVICE_COLOR: Record<ServiceCode, string> = {
  army: '#C77D4A', navy: '#38BDF8', coast_guard: '#2BC5B4', air_force: '#818CF8', joint: '#C99A3A',
};

export function ServiceTag({ code }: { code: ServiceCode }) {
  return (
    <span style={{
      fontSize: 10.5, letterSpacing: '.05em', textTransform: 'uppercase', fontWeight: 700,
      color: SERVICE_COLOR[code], border: `1px solid ${SERVICE_COLOR[code]}55`, borderRadius: 4, padding: '1px 6px',
    }}>{SERVICE_LABEL[code]}</span>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const s = statusInfo(status);
  return (
    <span title={`Procurement / lifecycle stage: ${s.label}`} style={{
      fontSize: 10.5, fontWeight: 700, letterSpacing: '.03em', color: s.color,
      border: `1px solid ${s.color}55`, borderRadius: 5, padding: '1px 7px', whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
}

export function OriginBadge({ entity }: { entity: Entity }) {
  const o = originOf(entity);
  return (
    <span title={`Indigenisation: ${o.label} (from country of origin ${entity.country})`} style={{
      fontSize: 10.5, fontWeight: 700, letterSpacing: '.03em', color: o.color,
      border: `1px solid ${o.color}55`, borderRadius: 5, padding: '1px 7px', whiteSpace: 'nowrap',
    }}>{o.label}</span>
  );
}

/** Clickable entity reference. Falls back to humanised text when the id is a free-form
 *  dependency string that is not a canonical entity (never a broken link). */
export function EntityLink({ id, style }: { id: string; style?: React.CSSProperties }) {
  const e = entityById(id);
  if (!e) return <span style={{ color: 'var(--text)', ...style }}>{humanize(id)}</span>;
  return (
    <Link href={`${DEFENCE_BASE}/entity/${entitySlug(e.id)}/`} style={{ color: 'var(--link, #6cb0ff)', textDecoration: 'none', ...style }}>
      {e.name}
    </Link>
  );
}

/** Compact source badges. Each links to its primary document; hovering shows the title. */
export function SourceRefs({ refs, sourcesList }: { refs?: string[]; sourcesList?: Source[] }) {
  const list = sourcesList ?? sourcesFor(refs);
  if (!list.length) return null;
  return (
    <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      {list.map((s) => (
        <a key={s.id} href={s.url} target="_blank" rel="noreferrer" title={`${s.title} (${s.date})`} style={{
          fontSize: 10, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--brass-cream, #E6D1A0)',
          border: '1px solid var(--border, rgba(255,255,255,.18))', borderRadius: 4, padding: '0 5px', textDecoration: 'none',
        }}>{s.id}</a>
      ))}
    </span>
  );
}

export function StatCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-dim)' }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--brass-cream, #E6D1A0)', fontFamily: 'var(--font-jetbrains, monospace)', margin: '4px 0 2px' }}>{value}</div>
      {note && <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.45 }}>{note}</div>}
    </div>
  );
}

/** Landing-page gateway card for one of the three service Atlases. */
export function ServiceAtlasCard({
  href, title, kicker, blurb, accent, stats,
}: {
  href: string; title: string; kicker: string; blurb: string; accent: string;
  stats: { label: string; value: string | number }[];
}) {
  return (
    <Link href={href} className="atlas-card" style={{ ['--accent' as string]: accent, textDecoration: 'none' }}>
      <div className="atlas-card-head"><h3 style={{ color: 'var(--text)' }}>{title}</h3></div>
      <div style={{ ...kick, color: accent, marginTop: -6, marginBottom: 8 }}>{kicker}</div>
      <p className="atlas-card-tag">{blurb}</p>
      <div className="atlas-card-stats">
        {stats.map((s) => <span key={s.label}><b>{s.value}</b> {s.label}</span>)}
      </div>
      <span className="atlas-card-go">Open the Atlas →</span>
    </Link>
  );
}
