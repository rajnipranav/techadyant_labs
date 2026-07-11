#!/usr/bin/env python3
"""
Refresh the Supplier Atlas data from the source workbook.

Reads  ../Database/India_Industrial_Supplier_Atlas*.xlsx  (Master Index sheet)
Writes app/research/_suppliers.json          (PUBLIC directory fields + aggregates)
       functions/api/_supplier-contacts.json (GATED fields: contact/phone/email/GSTIN/Udyam/MOQ)

Run locally after editing the workbook, then commit both JSON files:
    pip install openpyxl
    python scripts/bake-suppliers.py
The site build does NOT run this (Cloudflare has no workbook/Python) — the JSONs are committed.
"""
import json, re, glob, os, sys
from collections import Counter, defaultdict
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
cands = sorted(glob.glob(os.path.join(ROOT, '..', 'Database', 'India_Industrial_Supplier_Atlas*.xlsx')))
if not cands:
    sys.exit('No workbook found in ../Database/')
SRC = cands[-1]
print('Reading', SRC)

wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
ws = wb['Master Index']
it = ws.iter_rows(min_row=4, values_only=True)
hdr = next(it)
cols = [(i, h) for i, h in enumerate(hdr) if h not in (None, '')]
def val(row, name):
    for i, h in cols:
        if h == name:
            v = row[i]
            return None if v in (None, '') else v
    return None

pub, contacts = [], {}
for row in it:
    sid = val(row, 'Supplier ID')
    if not sid:
        continue
    pub.append({
        'id': sid, 'name': val(row, 'Company Name'), 'category': val(row, 'Category'),
        'subSpecialty': val(row, 'Sub-Specialty'), 'city': val(row, 'City'), 'state': val(row, 'State'),
        'region': val(row, 'Geo-Region'), 'year': val(row, 'Year Established'), 'ownership': val(row, 'Ownership Type'),
        'plantSize': val(row, 'Plant Size (sqft)'), 'headcount': val(row, 'Headcount'),
        'machineCount': val(row, 'Machine Count'), 'machineBrands': val(row, 'Machine Brands'),
        'maxPartSize': val(row, 'Max Part Size (mm)'), 'tolerance': val(row, 'Tolerance Band'),
        'materials': val(row, 'Materials Handled'), 'monthlyCapacity': val(row, 'Monthly Capacity'),
        'leadWeeks': val(row, 'Lead Time (weeks)'), 'certifications': val(row, 'Certifications'),
        'customerTiers': val(row, 'Customer Tiers Served'), 'exportExp': val(row, 'Export Experience'),
        'nearestPort': val(row, 'Nearest Port'), 'revenueBand': val(row, 'Annual Revenue Band'),
        'website': val(row, 'Website'), 'linkedin': val(row, 'LinkedIn'),
        'verified': val(row, 'Verified Status'), 'rating': val(row, 'Internal Rating (1-5)'),
    })
    contacts[sid] = {
        'contact': val(row, 'Contact Person'), 'designation': val(row, 'Designation'),
        'phone': val(row, 'Phone'), 'email': val(row, 'Email'),
        'gstin': val(row, 'GSTIN'), 'udyam': val(row, 'Udyam Reg No.'), 'moq': val(row, 'Min Order Qty (INR)'),
    }

def cnt(k):
    c = Counter()
    for d in pub:
        v = d.get(k)
        if v not in (None, ''):
            c[str(v)] += 1
    return c

total = len(pub)
ver, exp = cnt('verified'), cnt('exportExp')
avg = round(sum(int(d['rating']) for d in pub if d.get('rating') not in (None, '')) / total, 2)
CATS = [k for k, _ in cnt('category').most_common()]
REGS = ['West', 'South', 'North', 'East', 'Central']
mat = defaultdict(lambda: defaultdict(int))
for d in pub:
    mat[d['category']][d['region']] += 1
matrix = [[mat[c].get(r, 0) for r in REGS] for c in CATS]

def microns(t):
    t = str(t); m = re.search(r'([\d.]+)\s*μm', t)
    if m: return float(m.group(1))
    m = re.search(r'([\d.]+)\s*mm', t)
    if m: return float(m.group(1)) * 1000
    return None
prec = Counter()
for d in pub:
    u = microns(d.get('tolerance'))
    if u is None: continue
    prec['Ultra ≤5μm' if u <= 5 else 'High 6–15μm' if u <= 15 else 'Precision 16–50μm' if u <= 50 else 'General >50μm'] += 1
PO = ['Ultra ≤5μm', 'High 6–15μm', 'Precision 16–50μm', 'General >50μm']
dec = Counter()
for d in pub:
    y = d.get('year')
    if not y: continue
    y = int(y)
    dec['Pre-1980' if y < 1980 else '1980s' if y < 1990 else '1990s' if y < 2000 else '2000s' if y < 2010 else '2010s' if y < 2020 else '2020s'] += 1
DO = ['Pre-1980', '1980s', '1990s', '2000s', '2010s', '2020s']
certs = Counter()
for d in pub:
    for c in str(d.get('certifications', '')).split(','):
        c = c.strip()
        if c: certs[c] += 1
rev = cnt('revenueBand')

meta = {
    'total': total, 'verified': ver.get('Yes', 0), 'avg': avg, 'states': len(cnt('state')),
    'export': exp.get('Yes', 0), 'updated': '2026-07-11', 'version': '1.1',
    'agg': {
        'category': cnt('category').most_common(), 'ownership': cnt('ownership').most_common(),
        'states_top': cnt('state').most_common(10),
        'revenue': [(k, rev[k]) for k in ['10-50 Cr', '50-100 Cr', '100-250 Cr', '250-500 Cr', '500-1000 Cr', '1000+ Cr'] if k in rev],
        'certs': certs.most_common(8), 'verifmix': [ver.get('Yes', 0), ver.get('Partial', 0)],
        'exportmix': [exp.get('Yes', 0), exp.get('Limited', 0)],
        'cats': CATS, 'regs': REGS, 'matrix': matrix,
        'precision': [(k, prec.get(k, 0)) for k in PO], 'decade': [(k, dec.get(k, 0)) for k in DO],
    },
}
json.dump({'meta': meta, 'suppliers': pub}, open(os.path.join(ROOT, 'app/research/_suppliers.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
json.dump(contacts, open(os.path.join(ROOT, 'functions/api/_supplier-contacts.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print(f'Wrote {total} suppliers (public) + {len(contacts)} contact records (gated).')
