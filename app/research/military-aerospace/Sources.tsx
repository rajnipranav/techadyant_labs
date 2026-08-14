// Server-rendered source list with trust tiers and indicative labels.
import type { Source } from './data';

export function Sources({ sources }: { sources: Source[] }) {
  if (!sources || !sources.length) return null;
  const tierColor: Record<string, string> = { official: '#34D399', audited: '#2BC5B4', credible: '#6CB0FF', indicative: '#F5B544' };
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--brass-cream, #E6D1A0)', fontWeight: 600, marginBottom: 10 }}>
        Sources · {sources.length}
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
        {sources.map((s) => (
          <li key={s.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, lineHeight: 1.55 }}>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--link, #6cb0ff)', fontWeight: 600, wordBreak: 'break-all' }}>{s.title}</a>
            ) : (
              <span style={{ color: 'var(--text)' }}>{s.title}</span>
            )}
            <span style={{ marginLeft: 8, fontSize: 10.5, letterSpacing: '.05em', textTransform: 'uppercase', color: tierColor[s.tier] || 'var(--text-dim)', border: `1px solid ${tierColor[s.tier] || 'var(--border)'}55`, borderRadius: 4, padding: '1px 6px' }}>{s.tier}</span>
            {s.indicative && (
              <span style={{ marginLeft: 6, fontSize: 10.5, color: '#F5B544', border: '1px solid #F5B54455', borderRadius: 4, padding: '1px 6px' }}>unresolved · indicative</span>
            )}
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-jetbrains, monospace)' }}>{s.id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
