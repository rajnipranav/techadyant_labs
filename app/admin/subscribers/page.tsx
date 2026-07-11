'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, StatCard, Panel } from '../ui';
import { issues } from '../../newsletter/data';

interface Stats { total: number; active: number; unsubscribed: number; by_source: { source: string; total: number; active: number }[]; }
interface Sub { id: string; email: string; source: string; country: string | null; unsubscribed: boolean; created_at: string; welcome_sent?: boolean; welcome_sent_at?: string | null; }

const SITE = 'https://labs.techadyant.com';

export default function SubscribersPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [rows, setRows] = useState<Sub[] | null>(null);
  const [q, setQ] = useState('');
  const [err, setErr] = useState<string | null>(null);

  // --- Send latest Sanket issue ---
  const latest = issues[0];
  const nlSubject = `${latest.title} · Sanket ${latest.no}`;
  const nlBody =
    `**Sanket — ${latest.no} · ${latest.month}**\n\n` +
    `${latest.standfirst}\n\n` +
    `Read it online: [${latest.title}](${SITE}/newsletter/${latest.slug}/)` +
    (latest.pdfReady ? `\n\nDownload the PDF: [${latest.title} (PDF)](${latest.pdf})` : '') +
    `\n\n— Techadyant Labs`;
  const [nlId, setNlId] = useState<string | null>(null);
  const [nlBusy, setNlBusy] = useState(false);
  const [nlMsg, setNlMsg] = useState<string | null>(null);

  // --- Send to selected subscribers ---
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [selSubject, setSelSubject] = useState('');
  const [selBody, setSelBody] = useState('');
  const [selBusy, setSelBusy] = useState(false);
  const [selMsg, setSelMsg] = useState<string | null>(null);

  const load = () => {
    api<Stats>('/subscribers/stats').then(setStats).catch((e) => setErr(String(e.message || e)));
    api<Sub[]>(`/subscribers/list?q=${encodeURIComponent(q)}`).then(setRows).catch((e) => setErr(String(e.message || e)));
  };
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => rows || [], [rows]);

  async function nlSave(): Promise<string> {
    const res = await api<{ id: string }>('/broadcasts/save', {
      method: 'POST',
      body: JSON.stringify({ id: nlId, subject: nlSubject, body: nlBody, segment: 'all', report_slug: null }),
    });
    setNlId(res.id);
    return res.id;
  }
  async function nlTest() {
    setNlBusy(true); setNlMsg(null);
    try { const id = nlId || (await nlSave()); const r = await api<{ sent_to: string }>('/broadcasts/test', { method: 'POST', body: JSON.stringify({ id }) }); setNlMsg(`Test sent to ${r.sent_to}.`); }
    catch (e) { setNlMsg('Failed: ' + String((e as Error).message)); }
    finally { setNlBusy(false); }
  }
  async function nlSend() {
    const n = stats?.active ?? 0;
    if (!confirm(`Send "${nlSubject}" to all ${n} active subscribers? This cannot be undone.`)) return;
    setNlBusy(true); setNlMsg(null);
    try { const id = nlId || (await nlSave()); const r = await api<{ recipients: number; sent: number }>('/broadcasts/send', { method: 'POST', body: JSON.stringify({ id }) }); setNlMsg(`Sent to ${r.sent}/${r.recipients} subscribers.`); setNlId(null); }
    catch (e) { setNlMsg('Failed: ' + String((e as Error).message)); }
    finally { setNlBusy(false); }
  }

  const activeShown = (rows || []).filter((r) => !r.unsubscribed).map((r) => r.email);
  const allSelected = activeShown.length > 0 && activeShown.every((e) => sel.has(e));
  const toggle = (email: string) => setSel((s) => { const n = new Set(s); if (n.has(email)) n.delete(email); else n.add(email); return n; });
  const toggleAll = () => setSel((s) => { const n = new Set(s); if (allSelected) activeShown.forEach((e) => n.delete(e)); else activeShown.forEach((e) => n.add(e)); return n; });

  async function sendSelected(test: boolean) {
    if (sel.size === 0) return;
    const emails = [...sel];
    const subject = selSubject.trim() || nlSubject;
    const body = selBody.trim() || nlBody;
    if (!test && !confirm(`Send "${subject}" to ${sel.size} selected subscriber(s)? This cannot be undone.`)) return;
    setSelBusy(true); setSelMsg(null);
    try {
      const saved = await api<{ id: string }>('/broadcasts/save', {
        method: 'POST',
        body: JSON.stringify({ id: null, subject, body, segment: `emails:${emails.join(',')}`, report_slug: null }),
      });
      if (test) {
        const r = await api<{ sent_to: string }>('/broadcasts/test', { method: 'POST', body: JSON.stringify({ id: saved.id }) });
        setSelMsg(`Test sent to ${r.sent_to}.`);
      } else {
        const r = await api<{ recipients: number; sent: number }>('/broadcasts/send', { method: 'POST', body: JSON.stringify({ id: saved.id }) });
        setSelMsg(`Sent to ${r.sent}/${r.recipients} selected subscriber(s).`);
      }
    } catch (e) { setSelMsg('Failed: ' + String((e as Error).message)); }
    finally { setSelBusy(false); }
  }

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

  async function resendWelcome(email: string) {
    if (!confirm(`Re-send the welcome email to ${email}? (They will receive it in their own inbox.)`)) return;
    try { const r = await api<{ sent_to: string }>('/subscribers/resend-welcome', { method: 'POST', body: JSON.stringify({ email }) }); alert(`Welcome email sent to ${r.sent_to}. Resend has accepted it — check its status in the Resend dashboard if you want delivery confirmation.`); }
    catch (e) { alert('Failed: ' + String((e as Error).message)); }
  }

  return (
    <>
      <h1 className="admin-h1">Subscribers</h1>
      <p className="admin-sub">Sanket mailing list (Research Reports project). Welcome email + unsubscribe are automatic. <button className="admin-btn" style={{ marginLeft: 8 }} onClick={testWelcome}>Send welcome preview to me</button></p>
      {err && <ErrorBox error={err} />}

      <Panel title="Send the latest Sanket issue" action={<a className="admin-btn" href="/admin/announcements">Full composer →</a>}>
        <p className="admin-sub" style={{ marginTop: 0 }}>
          Latest: <strong>Sanket {latest.no} — {latest.title}</strong> ({latest.month}).{' '}
          {latest.pdfReady ? 'The email links to the online issue and the PDF.' : 'The PDF is not live yet — the email will link to the online issue only.'}
        </p>
        <p className="admin-sub" style={{ marginBottom: 14 }}>
          Subject: <code>{nlSubject}</code> · Recipients: all active subscribers{stats ? ` (${stats.active})` : ''}. Each email carries its own unsubscribe link.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="admin-btn" disabled={nlBusy} onClick={nlTest}>Send test to me</button>
          <button className="admin-btn" disabled={nlBusy} onClick={nlSend} style={{ borderColor: 'var(--admin-teal, #1D9E75)' }}>Send latest newsletter to all →</button>
        </div>
        {nlMsg && <p className="admin-sub" style={{ color: 'var(--admin-teal, #1D9E75)', marginTop: 12, marginBottom: 0 }}>{nlMsg}</p>}
      </Panel>

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

            {sel.size > 0 && (
              <div style={{ border: '1px solid var(--admin-teal, #1D9E75)', borderRadius: 8, padding: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong>{sel.size} selected</strong>
                  <button className="admin-btn" onClick={() => { setSel(new Set()); setSelMsg(null); }}>Clear selection</button>
                </div>
                <input className="admin-input" style={{ width: '100%', marginBottom: 8 }} placeholder={`Subject (defaults to: ${nlSubject})`} value={selSubject} onChange={(e) => setSelSubject(e.target.value)} />
                <textarea className="admin-input" style={{ width: '100%', minHeight: 110, marginBottom: 8, fontFamily: 'monospace', fontSize: 12 }} placeholder="Message in Markdown. Leave blank to send the latest Sanket issue." value={selBody} onChange={(e) => setSelBody(e.target.value)} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="admin-btn" disabled={selBusy} onClick={() => sendSelected(true)}>Send test to me</button>
                  <button className="admin-btn" disabled={selBusy} onClick={() => sendSelected(false)} style={{ borderColor: 'var(--admin-teal, #1D9E75)' }}>Send to {sel.size} selected →</button>
                </div>
                {selMsg && <p className="admin-sub" style={{ color: 'var(--admin-teal, #1D9E75)', marginTop: 10, marginBottom: 0 }}>{selMsg}</p>}
                <p className="admin-sub" style={{ marginTop: 8, marginBottom: 0, fontSize: 11 }}>Only active subscribers among those selected are emailed; each carries its own unsubscribe link.</p>
              </div>
            )}

            {!rows ? <Loading /> : rows.length === 0 ? <p className="admin-sub">No subscribers match.</p> : (
              <table className="admin-table">
                <thead><tr>
                  <th style={{ width: 28 }}><input type="checkbox" checked={allSelected} onChange={toggleAll} title="Select all active on this page" /></th>
                  <th>Email</th><th>Source</th><th>Country</th><th>Status</th><th>Welcome</th><th>Joined</th><th></th>
                </tr></thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td><input type="checkbox" disabled={r.unsubscribed} checked={sel.has(r.email)} onChange={() => toggle(r.email)} /></td>
                      <td>{r.email}</td><td>{r.source}</td><td>{r.country || '—'}</td>
                      <td style={{ color: r.unsubscribed ? 'var(--admin-muted)' : 'var(--admin-teal, #1D9E75)' }}>{r.unsubscribed ? 'unsubscribed' : 'active'}</td>
                      <td title={r.welcome_sent_at ? new Date(r.welcome_sent_at).toLocaleString() : ''} style={{ color: r.welcome_sent ? 'var(--admin-teal, #1D9E75)' : 'var(--admin-muted)', whiteSpace: 'nowrap' }}>
                        {r.welcome_sent ? `✓ ${r.welcome_sent_at ? new Date(r.welcome_sent_at).toLocaleDateString() : 'sent'}` : '—'}
                      </td>
                      <td style={{ color: 'var(--admin-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {!r.unsubscribed && <button className="admin-btn" style={{ padding: '3px 9px', fontSize: 12 }} onClick={() => resendWelcome(r.email)}>Resend welcome</button>}
                      </td>
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
