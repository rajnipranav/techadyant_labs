'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, StatCard, Panel } from '../ui';

interface Summary { total_revenue: number; total_sales: number; unique_customers: number; avg_order: number; mtd_revenue: number; data_tier_sales: number }
interface Order { invoice_no: string | null; email: string; report_slug: string; title: string; tier: string | null; amount_inr: number; payment_id: string | null; order_id: string | null; date: string }
interface ByReport { slug: string; title: string; sales: number; revenue: number }
interface Customer { email: string; purchases: number; total_spent: number; first_purchase: string; last_purchase: string; reports: string[] }
interface Sales { summary: Summary; orders: Order[]; by_report: ByReport[]; customers: Customer[] }

const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');
const tierLabel = (t: string | null) => (t === 'report_plus_data' ? 'Report + Data' : 'Report');

const cell: React.CSSProperties = { padding: '9px 10px', borderBottom: '1px solid var(--admin-border)', fontSize: 13, textAlign: 'left', verticalAlign: 'top' };
const head: React.CSSProperties = { ...cell, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--admin-muted)', borderBottom: '1px solid var(--admin-border)' };
const num: React.CSSProperties = { ...cell, textAlign: 'right', fontFamily: 'var(--admin-mono)' };
const numHead: React.CSSProperties = { ...head, textAlign: 'right' };

function tierChip(t: string | null) {
  const data = t === 'report_plus_data';
  return <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: data ? '#0f8e7822' : '#5a788622', color: data ? '#0F8E78' : '#8CA0C0' }}>{tierLabel(t)}</span>;
}

export default function SalesPage() {
  const [d, setD] = useState<Sales | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { api<Sales>('/sales').then(setD).catch((e) => setErr(String(e.message || e))); }, []);

  function exportCsv() {
    if (!d) return;
    const h = ['Invoice', 'Date', 'Customer', 'Report', 'Tier', 'Amount (INR)', 'Payment ID', 'Order ID'];
    const rows = d.orders.map((o) => [o.invoice_no || '', o.date, o.email, o.title, tierLabel(o.tier), o.amount_inr, o.payment_id || '', o.order_id || '']);
    const csv = [h, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = 'techadyant-sales.csv'; a.click(); URL.revokeObjectURL(url);
  }

  if (err) return <ErrorBox error={err} />;
  if (!d) return <Loading label="Loading sales…" />;
  const s = d.summary;

  return (
    <div>
      <h1 style={{ fontSize: 22, margin: '0 0 4px' }}>Sales &amp; customers</h1>
      <p style={{ color: 'var(--admin-muted)', margin: '0 0 20px', fontSize: 14 }}>Every paid order, revenue, and who bought what — live from the store.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 22 }}>
        <StatCard label="Total revenue" value={inr(s.total_revenue)} />
        <StatCard label="This month" value={inr(s.mtd_revenue)} />
        <StatCard label="Sales" value={s.total_sales} />
        <StatCard label="Customers" value={s.unique_customers} />
        <StatCard label="Avg. order" value={inr(s.avg_order)} />
        <StatCard label="Report + Data sales" value={s.data_tier_sales} />
      </div>

      <Panel title="Revenue by report">
        {d.by_report.length === 0 ? <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>No sales yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={head}>Report</th><th style={numHead}>Sales</th><th style={numHead}>Revenue</th></tr></thead>
            <tbody>{d.by_report.map((r) => (
              <tr key={r.slug}><td style={cell}>{r.title}</td><td style={num}>{r.sales}</td><td style={num}>{inr(r.revenue)}</td></tr>
            ))}</tbody>
          </table>
        )}
      </Panel>

      <Panel title={`Customers (${d.customers.length})`}>
        {d.customers.length === 0 ? <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>No customers yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={head}>Customer</th><th style={numHead}>Purchases</th><th style={numHead}>Total spent</th><th style={head}>Reports</th><th style={head}>First</th><th style={head}>Last</th></tr></thead>
            <tbody>{d.customers.map((c) => (
              <tr key={c.email}>
                <td style={cell}><a href={`mailto:${c.email}`} style={{ color: 'var(--admin-brassb)' }}>{c.email}</a></td>
                <td style={num}>{c.purchases}</td>
                <td style={num}>{inr(c.total_spent)}</td>
                <td style={{ ...cell, color: 'var(--admin-muted)', fontSize: 12 }}>{(c.reports || []).join(', ')}</td>
                <td style={{ ...cell, fontSize: 12 }}>{c.first_purchase}</td>
                <td style={{ ...cell, fontSize: 12 }}>{c.last_purchase}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Panel>

      <Panel title={`Orders (${d.orders.length})`} action={<button className="admin-btn" style={{ padding: '5px 12px', fontSize: 12 }} onClick={exportCsv}>Export CSV</button>}>
        {d.orders.length === 0 ? <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>No orders yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={head}>Date</th><th style={head}>Invoice</th><th style={head}>Customer</th><th style={head}>Report</th><th style={head}>Tier</th><th style={numHead}>Amount</th><th style={head}>Payment ID</th></tr></thead>
            <tbody>{d.orders.map((o, i) => (
              <tr key={o.order_id || i}>
                <td style={{ ...cell, whiteSpace: 'nowrap', fontSize: 12 }}>{o.date}</td>
                <td style={{ ...cell, fontFamily: 'var(--admin-mono)', fontSize: 12 }}>{o.invoice_no || '—'}</td>
                <td style={{ ...cell, fontSize: 12 }}>{o.email}</td>
                <td style={cell}>{o.title}</td>
                <td style={cell}>{tierChip(o.tier)}</td>
                <td style={num}>{inr(o.amount_inr)}</td>
                <td style={{ ...cell, fontFamily: 'var(--admin-mono)', fontSize: 11, color: 'var(--admin-muted)' }}>{o.payment_id || '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
