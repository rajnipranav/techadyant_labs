'use client';

// Sagarmala flagship-project explorer — search + pillar/status filters over the database's
// project inventory. Client-side only; the data arrives fully server-rendered as props so the
// section is SEO-complete even without JavaScript.
import { useMemo, useState } from 'react';

export interface ExplorerProject {
  id: string; name: string; pillar_key: string; pillar_label: string; pillar_letter: string;
  scheme_funded: boolean; location: string; cost_cr: number | null;
  status: string; status_note: string | null; agency: string;
}

const STATUS_GROUPS: { key: string; label: string; match: string[] }[] = [
  { key: 'all', label: 'All statuses', match: [] },
  { key: 'operational', label: 'Operational / completed', match: ['operational', 'completed', 'partially_operational'] },
  { key: 'building', label: 'Under construction / approved', match: ['under_construction', 'approved'] },
];

export function SgProjectExplorer({ projects, pillarLabels }: { projects: ExplorerProject[]; pillarLabels: { key: string; label: string; letter: string }[] }) {
  const [q, setQ] = useState('');
  const [pillar, setPillar] = useState('all');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const statusMatch = STATUS_GROUPS.find((s) => s.key === status)?.match ?? [];
    return projects.filter((p) => {
      if (pillar !== 'all' && p.pillar_key !== pillar) return false;
      if (statusMatch.length && !statusMatch.includes(p.status)) return false;
      if (!needle) return true;
      return [p.name, p.location, p.agency, p.pillar_label, p.status].join(' ').toLowerCase().includes(needle);
    });
  }, [projects, q, pillar, status]);

  return (
    <div className="pi-sg-explorer">
      <div className="pi-sg-ex-controls" role="group" aria-label="Project filters">
        <label className="pi-sg-ex-search">
          <span className="sr-only">Search projects</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, locations, agencies…" />
        </label>
        <label>
          <span className="sr-only">Filter by pillar</span>
          <select value={pillar} onChange={(e) => setPillar(e.target.value)}>
            <option value="all">All pillars</option>
            {pillarLabels.map((p) => <option key={p.key} value={p.key}>{p.letter} · {p.label}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_GROUPS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </label>
        <span className="pi-sg-ex-count" aria-live="polite">{filtered.length} of {projects.length} projects</span>
      </div>
      <div className="pi-table-wrap">
        <table className="pi-table pi-sg-table">
          <thead><tr><th>Project</th><th>Pillar</th><th>Location</th><th>Status</th><th>Cost</th><th>Agency</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td><b>{p.name}</b>{p.scheme_funded && <span className="pi-sg-chip pi-sg-chip-scheme">scheme</span>}</td>
                <td>{p.pillar_letter} · {p.pillar_label}</td>
                <td>{p.location}</td>
                <td><span className="pi-td-status">{p.status.replace(/_/g, ' ')}</span>{p.status_note && <span className="pi-td-sub">{p.status_note}</span>}</td>
                <td className="pi-nowrap">{p.cost_cr == null ? '—' : `₹${p.cost_cr.toLocaleString('en-IN')} cr`}</td>
                <td className="pi-td-sub">{p.agency}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={6} className="pi-sg-empty">No project matches these filters. Clear the search or pick another pillar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
