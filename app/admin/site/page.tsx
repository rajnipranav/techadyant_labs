'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, StatCard, Panel } from '../ui';

interface SiteData {
  configured: boolean;
  subscribers?: string | null;
  commission?: { id: string; name: string; email: string; created_at: string }[];
}

export default function SiteManagement() {
  const [d, setD] = useState<SiteData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { api<SiteData>('/site').then(setD).catch((e) => setErr(String(e.message || e))); }, []);

  return (
    <>
      <h1 className="admin-h1">Site management</h1>
      <p className="admin-sub">Operational view of the public labs site (Research Reports project).</p>
      {err && <ErrorBox error={err} />}
      {!d && !err && <Loading />}
      {d && !d.configured && <p className="admin-sub">Website Supabase binding not configured on this deployment.</p>}
      {d && d.configured && (
        <>
          <div className="admin-grid-kpi">
            <StatCard label="Subscribers" value={d.subscribers ?? '—'} />
            <StatCard label="Commission inquiries" value={d.commission?.length ?? 0} />
          </div>
          <Panel title="Recent commission inquiries">
            {(!d.commission || d.commission.length === 0) ? <p className="admin-sub">None yet.</p> : (
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>When</th></tr></thead>
                <tbody>
                  {d.commission.map((c) => (
                    <tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td style={{ color: 'var(--admin-muted)' }}>{new Date(c.created_at).toLocaleDateString()}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </>
      )}
    </>
  );
}
