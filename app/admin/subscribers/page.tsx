'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, StatCard, Panel } from '../ui';

interface Stats { total: number; active: number; unsubscribed: number; by_source: { source: string; total: number; active: number }[]; }
interface Sub { id: string; email: string; source: string; country: string | null; unsubscribed: boolean; created_at: string; }

export default function SubscribersPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [rows, setRows] = useState<Sub[] | null>(null);
  const [q, setQ] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const load = () => {
    api<Stats>('/subscribers/stats').then(setStats).catch((e) => setErr(String(e.message || e)));
    api<Sub[]>(`/subscribers/list?q=${encodeURIComponent(q)}`).then(setRows).catch((e) => setErr(String(e.message || e)));
  };
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => rows || [], [rows]);

  function exportCsv() {
    if (!rows) return;
    const head = 'email,source,country,status,joined\n';
    const body = rows.map((r) => [r.email, r.source, r.country || '', r.unsubscribed ? 'unsubscribed' : 'active', r.created_at].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([head + body], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'subscribers.csv'; a.click();
  }

  async function testWelcome() {
    try { const r = await api<{ sent_to: string }>('/subscribers/test-welcome', { method: 'POST', body: '{}' }); alert(`Welcome preview sent to ${r.sent_to}.`); }
    catch (e) { alert('Failed: ' + String((e as Error).message)); }
  }

  return (
    <>
      <h1 className="admin-h1">Subscribers</h1>
      <p className="admin-sub">The Dispatch mailing list (Research Reports project). Welcome email + unsubscribe are automatic. <button className="admin-btn" style={{ marginLeft: 8 }} onClick={testWelcome}>Send welcome preview to me</button></p>
      {err && <ErrorBox error={err} />}
      {!stats && !err && <Loading />}
      {stats && (
        <>
          <div className="admin-grid-kpi">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Active" value={stats.active} />
            <StatCard label="Unsubscribed" value={stats.unsubscribed} />
            <StatCard label="Sources" value={stats.by_source.length} />
          </div>

          <Panel title="By source">
            <table className="admin-table">
              <thead><tr><th>Source</th><th>Total</th><th>Active</th></tr></thead>
              <tbody>
                {stats.by_source.map((s) => (
                  <tr key={s.source}><td>{s.source}</td><td>{s.total}</td><td>{s.active}</td></tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Subscribers" action={<button className="admin-btn" onClick={exportCsv}>Export CSV</button>}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input className="admin-input" placeholder="Search email…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') load(); }} />
              <button className="admin-btn" onClick={load}>Search</button>
            </div>
            {!rows ? <Loading /> : rows.length === 0 ? <p className="admin-sub">No subscribers match.</p> : (
              <table className="admin-table">
                <thead><tr><th>Email</th><th>Source</th><th>Country</th><th>Status</th><th>Joined</th></tr></thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>{r.email}</td><td>{r.source}</td><td>{r.country || '—'}</td>
                      <td style={{ color: r.unsubscribed ? 'var(--admin-muted)' : 'var(--admin-teal, #1D9E75)' }}>{r.unsubscribed ? 'unsubscribed' : 'active'}</td>
                      <td style={{ color: 'var(--admin-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
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
