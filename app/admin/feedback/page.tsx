'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, StatCard, Panel } from '../ui';

interface Summary { total: number; new: number; research: number; features: number; atlas: number; gaps: number; ratings: number; avg_rating: number | null }
interface Item {
  id: string; type: string; email: string | null; message: string | null; topic: string | null;
  report_slug: string | null; rating: number | null; decision_context: string | null; gap: string | null;
  helpful: string | null; content_type: string | null; details: Record<string, any> | null;
  page_url: string | null; source: string | null; status: string; admin_note: string | null; country: string | null; date: string;
}
interface TopTopic { topic: string; n: number }
interface Feedback { summary: Summary; items: Item[]; top_topics: TopTopic[] }

const cell: React.CSSProperties = { padding: '9px 10px', borderBottom: '1px solid var(--admin-border)', fontSize: 13, textAlign: 'left', verticalAlign: 'top' };
const head: React.CSSProperties = { ...cell, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--admin-muted)' };

const TYPE_LABEL: Record<string, string> = {
  research_suggestion: 'Research', research_question: 'Question', report_request: 'Report request',
  feature_request: 'Feature', atlas_contribution: 'Atlas', site_gap: 'Not found',
  report_rating: 'Rating', content_feedback: 'Content', general: 'Feedback',
};
const STATUSES = ['new', 'reviewed', 'planned', 'done', 'dismissed'];

function typeChip(t: string) {
  const c: Record<string, string> = {
    research_suggestion: '#0F8E78', research_question: '#2E9E86', report_request: '#0F8E78',
    feature_request: '#7C83E0', atlas_contribution: '#C9A84C', site_gap: '#C9A84C',
    report_rating: '#8CA0C0', content_feedback: '#8CA0C0', general: '#5a7886',
  };
  return <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: (c[t] || '#5a7886') + '22', color: c[t] || '#8CA0C0' }}>{TYPE_LABEL[t] || t}</span>;
}

export default function FeedbackAdminPage() {
  const [d, setD] = useState<Feedback | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function load() { api<Feedback>('/feedback').then(setD).catch((e) => setErr(String(e.message || e))); }
  useEffect(load, []);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    try {
      await api('/feedback/update', { method: 'POST', body: JSON.stringify({ id, status }) });
      setD((prev) => prev ? { ...prev, items: prev.items.map((it) => it.id === id ? { ...it, status } : it) } : prev);
    } catch (e) { setErr(String((e as Error).message || e)); }
    setBusy(null);
  }

  if (err) return <ErrorBox error={err} />;
  if (!d) return <Loading label="Loading feedback…" />;
  const s = d.summary;

  return (
    <div>
      <h1 style={{ fontSize: 22, margin: '0 0 4px' }}>Feedback &amp; requests</h1>
      <p style={{ color: 'var(--admin-muted)', margin: '0 0 20px', fontSize: 14 }}>What readers want next, what they couldn&rsquo;t find, and general feedback — live from the site.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 22 }}>
        <StatCard label="Total" value={s.total} />
        <StatCard label="New" value={s.new} />
        <StatCard label="Research demand" value={s.research} />
        <StatCard label="Features" value={s.features} />
        <StatCard label="Atlas" value={s.atlas} />
        <StatCard label="Content gaps" value={s.gaps} />
      </div>

      {d.top_topics.length > 0 && (
        <Panel title="Most-requested topics">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {d.top_topics.map((t) => (
              <span key={t.topic} style={{ fontSize: 13, padding: '5px 11px', borderRadius: 20, background: '#0f8e7815', border: '1px solid var(--admin-border)' }}>
                {t.topic} <b style={{ color: 'var(--admin-brassb)' }}>×{t.n}</b>
              </span>
            ))}
          </div>
        </Panel>
      )}

      <Panel title={`All feedback (${d.items.length})`}>
        {d.items.length === 0 ? <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>Nothing yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={head}>Date</th><th style={head}>Type</th><th style={head}>Topic / message</th>
              <th style={head}>Email</th><th style={head}>Status</th>
            </tr></thead>
            <tbody>{d.items.map((it) => (
              <tr key={it.id} style={{ opacity: it.status === 'dismissed' || it.status === 'done' ? 0.55 : 1 }}>
                <td style={{ ...cell, whiteSpace: 'nowrap', fontSize: 12 }}>{it.date}</td>
                <td style={cell}>{typeChip(it.type)}{it.rating ? <div style={{ fontSize: 12, color: 'var(--admin-brassb)', marginTop: 4 }}>{it.rating}/5</div> : null}</td>
                <td style={cell}>
                  {it.topic && <div style={{ fontWeight: 600 }}>{it.topic}</div>}
                  {it.helpful && <div style={{ fontSize: 12, marginTop: 2 }}>Helpful? <b style={{ color: it.helpful === 'yes' ? 'var(--admin-teal,#0F8E78)' : 'var(--admin-brassb)' }}>{it.helpful}</b></div>}
                  {it.message && <div style={{ color: 'var(--admin-muted)', fontSize: 12, marginTop: 2 }}>{it.message}</div>}
                  {it.decision_context && <div style={{ fontSize: 12, marginTop: 3 }}><span style={{ color: 'var(--admin-muted)' }}>Decision:</span> {it.decision_context}</div>}
                  {it.gap && <div style={{ fontSize: 12, marginTop: 3 }}><span style={{ color: 'var(--admin-muted)' }}>Still looking for:</span> {it.gap}</div>}
                  {it.details && it.details.willingness_to_pay && <div style={{ fontSize: 11, color: 'var(--admin-brassb)', marginTop: 3 }}>Pay: {it.details.willingness_to_pay}</div>}
                  {it.report_slug && <div style={{ fontSize: 11, color: 'var(--admin-muted)', marginTop: 2 }}>re: {it.report_slug}{it.content_type ? ` (${it.content_type})` : ''}</div>}
                  {it.page_url && <div style={{ fontSize: 11, color: 'var(--admin-muted)', marginTop: 2 }}>from {it.page_url}</div>}
                </td>
                <td style={{ ...cell, fontSize: 12 }}>{it.email ? <a href={`mailto:${it.email}`} style={{ color: 'var(--admin-brassb)' }}>{it.email}</a> : <span style={{ color: 'var(--admin-muted)' }}>—</span>}</td>
                <td style={cell}>
                  <select value={it.status} disabled={busy === it.id} onChange={(e) => setStatus(it.id, e.target.value)}
                    style={{ fontSize: 12, padding: '3px 6px', background: 'var(--admin-panel,#141b26)', color: 'inherit', border: '1px solid var(--admin-border)', borderRadius: 6 }}>
                    {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
