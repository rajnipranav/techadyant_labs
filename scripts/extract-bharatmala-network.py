#!/usr/bin/env python3
"""Extract the road network from NHAI's "Map of Bharatmala Pariyojana" PDF (vector AutoCAD plot)
into public/data/bharatmala-network.json for the programme footprint map.

Usage:  python3 -I scripts/extract-bharatmala-network.py <map.pdf> [out.json]
Needs:  pymupdf, numpy, scipy.   The PDF itself is NOT committed (2.5 MB, NHAI publication).

Method (schematic, not survey data; the source says NOT TO SCALE):
 1. The PDF's black outline points are matched to the site's India outline (app/corridors/data.ts
    INDIA_OUTLINE, via the inverse of app/research/industrial/geo.ts) by trimmed ICP on an
    affine fit seeded from ~37 labelled cities. Typical error: a few km on the best-matched
    coast, tens of km inland.
 2. Lines are grouped by the legend colour, split at drafting jumps, simplified (RDP) and
    written as lat/lng x100 integers.
"""
import json, re, sys
import numpy as np, pymupdf
from scipy.spatial import cKDTree

SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else 'public/data/bharatmala-network.json'
CATS = {  # legend colour -> key, label
    (1.0, 0.0, 1.0): ('expressway', 'Expressways'),
    (1.0, 0.0, 0.0): ('economic', 'Economic corridors'),
    (0.0, 0.58, 0.29): ('national', 'National corridors (GQ & NS-EW)'),
    (0.75, 0.0, 1.0): ('ring', 'Ring roads'),
    (0.5, 1.0, 0.0): ('neip', 'NEIP'),
    (1.0, 0.5, 0.0): ('inter', 'Inter-corridor routes'),
    (0.0, 1.0, 1.0): ('feeder', 'Feeder roads'),
}
# seed affine from city labels (label centre, lng/lat); refined by outline ICP below
CITY = {'DELHI': (28.61, 77.21), 'MUMBAI': (19.08, 72.88), 'CHENNAI': (13.08, 80.27), 'KOLKATA': (22.57, 88.36), 'BENGALURU': (12.97, 77.59),
        'HYDERABAD': (17.39, 78.49), 'AHMEDABAD': (23.02, 72.57), 'JAIPUR': (26.91, 75.79), 'LUCKNOW': (26.85, 80.95), 'PATNA': (25.59, 85.14),
        'BHOPAL': (23.26, 77.41), 'RAIPUR': (21.25, 81.63), 'GUWAHATI': (26.14, 91.74), 'AMRITSAR': (31.63, 74.87), 'JAMNAGAR': (22.47, 70.06),
        'VISAKHAPATNAM': (17.69, 83.22), 'KOCHI': (9.93, 76.27), 'NAGPUR': (21.15, 79.09), 'PUNE': (18.52, 73.86), 'SURAT': (21.17, 72.83),
        'KANPUR': (26.45, 80.35), 'BHUBANESWAR': (20.30, 85.82), 'JODHPUR': (26.29, 73.02), 'BIKANER': (28.02, 73.31), 'KOTA': (25.18, 75.84),
        'INDORE': (22.72, 75.86), 'AGRA': (27.18, 78.01), 'VIJAYAWADA': (16.51, 80.65), 'COIMBATORE': (11.02, 76.96), 'MADURAI': (9.92, 78.12),
        'CHANDIGARH': (30.73, 76.78), 'DEHRADUN': (30.32, 78.03), 'RANCHI': (23.34, 85.31), 'KANYAKUMARI': (8.08, 77.54), 'JAMMU': (32.73, 74.86)}

doc = pymupdf.open(SRC); pg = doc[0]
words = pg.get_text('words'); pts = {}
for x0, y0, x1, y1, t, *_ in words:
    T = t.strip(',.()').upper()
    if T in CITY and T not in pts: pts[T] = ((x0 + x1) / 2, (y0 + y1) / 2)
keys = list(pts)
for _ in range(6):
    A = np.array([[CITY[k][1], CITY[k][0], 1] for k in keys]); X = np.array([pts[k] for k in keys])
    c, *_ = np.linalg.lstsq(A, X, rcond=None)
    res = {k: np.hypot(*(np.array([CITY[k][1], CITY[k][0], 1]) @ c - np.array(pts[k]))) for k in pts}
    med = np.median(list(res.values())); keys = [k for k in pts if res[k] < max(3 * med, 25)]

# reference outline in lng/lat
src = open('app/corridors/data.ts').read()
o = re.search(r"INDIA_OUTLINE\s*=\s*(['\"`])(.*?)\1", src, re.S).group(2)
main = max([np.array([tuple(map(float, p.split(','))) for p in re.findall(r'(-?[\d.]+,-?[\d.]+)', s)]) for s in re.split(r'(?=M)', o) if s.strip()], key=len)
ref = np.c_[(main[:, 0] + 955.12) / 14.5623, (648.469 - main[:, 1]) / 15.608]
dense = []
for a, b in zip(ref[:-1], ref[1:]):
    n = max(1, int(np.hypot(*(b - a)) / 0.05)); dense += [a + (b - a) * t / n for t in range(n)]
R = np.array(dense)
D = pg.get_drawings()
P = []
for d in D:
    if d.get('color') and tuple(d['color']) == (0.0, 0.0, 0.0):
        for it in d['items']:
            if it[0] == 'l':
                a = np.array([it[1].x, it[1].y]); b = np.array([it[2].x, it[2].y]); n = max(1, int(np.hypot(*(b - a)) / 2))
                P += [a + (b - a) * t / n for t in range(n + 1)]
P = np.array(P); tree = cKDTree(P)
for _ in range(40):
    dist, idx = tree.query(np.c_[R, np.ones(len(R))] @ c); keep = dist < np.percentile(dist, 60)
    c, *_ = np.linalg.lstsq(np.c_[R[keep], np.ones(keep.sum())], P[idx[keep]], rcond=None)
Minv = np.linalg.inv(c[:2].T); t0 = c[2]
to_ll = lambda a: (Minv @ (np.asarray(a) - t0).T).T  # -> lng, lat

def rdp(p, eps):
    if len(p) < 3: return p
    a, b = p[0], p[-1]; ab = b - a; L = np.hypot(*ab)
    q = p - a; d = np.abs(ab[0] * q[:, 1] - ab[1] * q[:, 0]) / L if L else np.hypot(q[:, 0], q[:, 1])
    i = int(np.argmax(d))
    if d[i] > eps: return np.vstack([rdp(p[:i + 1], eps)[:-1], rdp(p[i:], eps)])
    return np.array([a, b])

raw = {k: [] for k, _ in CATS.values()}
for d in D:
    col = d.get('color')
    if not col: continue
    hit = next((v for kk, v in CATS.items() if all(abs(x - y) < 0.02 for x, y in zip(col, kk))), None)
    if not hit: continue
    chain = []
    def flush():
        global chain
        if len(chain) > 1: raw[hit[0]].append(np.array(chain))
        chain = []
    for it in d['items']:
        if it[0] not in ('l', 'c'): continue
        a = (it[1].x, it[1].y); b = (it[2].x, it[2].y) if it[0] == 'l' else (it[4].x, it[4].y)
        if np.hypot(b[0] - a[0], b[1] - a[1]) > 12: flush(); continue   # drafting jump, not a road
        if chain and np.hypot(chain[-1][0] - a[0], chain[-1][1] - a[1]) > 0.5: flush()
        if not chain: chain.append(a)
        chain.append(b)
    flush()

def stitch(lines, tol=0.8):
    """Greedily join polylines whose end points touch."""
    lines = [l for l in lines]; changed = True
    while changed:
        changed = False
        ends = {}
        for i, l in enumerate(lines):
            for side, pt in ((0, l[0]), (1, l[-1])): ends.setdefault((round(pt[0] / tol), round(pt[1] / tol)), []).append((i, side))
        used = set(); nxt = []
        for i, l in enumerate(lines):
            if i in used: continue
            cur = l; used.add(i)
            while True:
                found = None
                for side, pt in ((1, cur[-1]), (0, cur[0])):
                    for dx in (-1, 0, 1):
                        for dy in (-1, 0, 1):
                            for j, sj in ends.get((round(pt[0] / tol) + dx, round(pt[1] / tol) + dy), []):
                                if j in used: continue
                                o = lines[j]; q = o[0] if sj == 0 else o[-1]
                                if np.hypot(*(q - pt)) <= tol * 1.5: found = (side, j, sj); break
                            if found: break
                        if found: break
                    if found: break
                if not found: break
                side, j, sj = found; o = lines[j]; used.add(j); changed = True
                o = o if (sj == 0) == (side == 1) else o[::-1]
                cur = np.vstack([cur, o]) if side == 1 else np.vstack([o, cur])
            nxt.append(cur)
        lines = nxt
    return lines

out = {}
for k, lab in CATS.values():
    ls = stitch(raw[k]); keep = []
    for l in ls:
        length = float(np.sum(np.hypot(*np.diff(l, axis=0).T)))
        if length < (2 if k in ('expressway', 'ring') else 8): continue   # drop specks and stubs
        sl = rdp(l, 1.4)
        keep.append(np.round(to_ll(sl)[:, ::-1] * 100).astype(int))
    # delta-encode: first vertex absolute, then differences
    enc = []
    for l in keep:
        d = np.vstack([l[:1], np.diff(l, axis=0)]); d = d[np.r_[True, np.any(d[1:] != 0, axis=1)]]
        enc.append(d.reshape(-1).tolist())
    out[k] = {'label': lab, 'lines': enc}
json.dump({'credit': 'NHAI Bharatmala Division, "Map of Bharatmala Pariyojana" (undated, NOT TO SCALE). Georeferenced by Techadyant; schematic.',
           'encoding': 'each line: [lat0, lng0, dlat1, dlng1, ...] in 1/100 degree', 'layers': out}, open(OUT, 'w'), separators=(',', ':'))

# --- snap the registry-linked roads (guide polylines in app/research/programmes/footprint-geo.ts)
# onto the traced network. Each guide point snaps to the nearest traced vertex within 0.32 deg;
# expressway vertices are preferred over economic and national corridors. A running median
# removes hops between parallel roads. The guide towns are only a seed: the shape is NHAI's.
dec = lambda l: np.cumsum(np.array(l).reshape(-1, 2), axis=0) / 100.0
PREF = {'expressway': 0.5, 'ring': 0.7, 'economic': 1.0, 'national': 1.1}
VV, CC = [], []
for cat, w in PREF.items():
    for l in out[cat]['lines']:
        a = dec(l); VV.append(a); CC += [w] * len(a)
VV = np.vstack(VV); CC = np.array(CC); vt = cKDTree(VV)
geo = open('app/research/programmes/footprint-geo.ts').read()
guides = {m.group(1): np.array(json.loads(m.group(2))) for m in re.finditer(r"'(infra:[^']+)':\s*\{\s*path:\s*(\[\[.*?\]\]),", geo, re.S)}
def sample(P, step=0.03):
    o2 = []
    for a, b in zip(P[:-1], P[1:]):
        n = max(1, int(np.hypot(b[0] - a[0], (b[1] - a[1]) * .9) / step)); o2 += [a + (b - a) * k / n for k in range(n)]
    o2.append(P[-1]); return np.array(o2)
def runmed(a, w=7):
    h = w // 2; r = a.copy()
    for i in range(len(a)): r[i] = np.median(a[max(0, i - h):i + h + 1], axis=0)
    return r
routes = {}
for rid, G in guides.items():
    if len(G) < 2: continue
    snapped = []
    for sp in sample(G):
        idx = vt.query_ball_point(sp, 0.32)
        if not idx: continue
        idx = np.array(idx); dd = np.hypot(VV[idx, 0] - sp[0], (VV[idx, 1] - sp[1]) * .9) * CC[idx]; snapped.append(VV[idx[dd.argmin()]])
    if len(snapped) < 3 or len(snapped) < 0.6 * len(sample(G)): continue   # too little network nearby: keep the guide
    r = rdp(runmed(np.array(snapped)), 0.02)
    routes[rid] = np.round(r, 2).tolist()
json.dump({'note': 'Registry-linked roads snapped onto the NHAI Bharatmala map by scripts/extract-bharatmala-network.py. Schematic; [lat, lng].',
           'source': 'NHAI Bharatmala Division, Map of Bharatmala Pariyojana (undated, NOT TO SCALE)', 'routes': routes},
          open('data/programme-intelligence/bharatmala-routes.json', 'w'), indent=1)
print('routes', {k: len(v) for k, v in routes.items()})
print({k: (len(v['lines']), sum(len(l) // 2 for l in v['lines'])) for k, v in out.items()})
