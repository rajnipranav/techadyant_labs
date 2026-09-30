#!/usr/bin/env python3
"""
High-Altitude Defence Atlas (v0.4) -> SID (Strategic Intelligence Database).

Adds only what the Atlas graph needs to carry the high-altitude work — the key DRDO
labs, the programmes/events, the new suppliers and one technology node — and links
them to entities that already exist in SID (verified by read-only queries on
2026-09-30). The 100 page-level "technology tasks" stay on the Atlas page; they are
not bulk-loaded into SID.

Outputs (idempotent; deterministic UUIDv5 ids):
  data/osint/high-altitude-defence/sid_ingest_high_altitude.sql   (review, then apply)
  app/research/_atlas.json      snapshot patched (players + relationships)
  app/research/_platform.json   snapshot patched (technology node + edges)

Usage:
  python3 scripts/sid-high-altitude.py          # generate + validate
  python3 scripts/sid-high-altitude.py --check  # validate only
"""
import json, os, re, sys, uuid

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
HA = os.path.join(ROOT, 'app', 'research', 'pillars', 'defence', '_high_altitude.json')
ATLAS = os.path.join(ROOT, 'app', 'research', '_atlas.json')
PLATFORM = os.path.join(ROOT, 'app', 'research', '_platform.json')
SQL_OUT = os.path.join(ROOT, 'data', 'osint', 'high-altitude-defence', 'sid_ingest_high_altitude.sql')
TODAY = '2026-09-30'


def uid(key):
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f'techadyant:sid:high-altitude-v0.4:{key}'))


# Existing SID entities (verified 2026-09-30). Where SID holds duplicates, the
# best-connected record is used; the duplicates are left for a separate clean-up.
EX = {
    'drdo':        ('358b6123-2127-4c8b-b95e-bda153de8986', 'Defence Research and Development Organisation', 'research_institution'),
    'ade':         ('04bdd7b4-429f-4fd8-89e5-377658912a06', 'Aeronautical Development Establishment', 'research_institution'),
    'army':        ('8963fd6a-e689-489d-9b4e-e43f18bbadb2', 'Indian Army', 'govt_body'),
    'iitj':        ('7f5c0567-9bf4-4a9d-b438-8ab592dcbfde', 'IIT Jodhpur', 'university'),
    'tdf':         ('ea919663-ea45-457d-8dce-a158879089c9', 'Technology Development Fund', 'scheme'),
    'ideaforge':   ('080e8af1-025f-478f-bea8-26082bf32df1', 'ideaForge Technology Limited', 'company'),
    'bonv':        ('8bba2ce2-55b3-4df8-bb49-cf732c173a77', 'BonV Aero', 'company'),
    'raphe':       ('63db7ed7-7790-4789-b791-7a8991ea8339', 'Raphe mPhibr Private Limited', 'company'),
    'droneacharya':('49976d34-2c4c-4cca-a49c-a166a235a2e6', 'DroneAcharya Aerial Innovations', 'company'),
    'mistral':     ('3ab58716-b798-457d-b2be-90a248f86389', 'Mistral Solutions', 'company'),
    'small_uav':   ('c5e5bd7b-bcde-47d8-b533-383f667dd37f', 'Small UAV (multirotor)', 'product'),
    'cells':       ('3b19bd89-8cc0-4414-aa82-28badad6fa3b', 'High-energy Li-ion cells', 'technology'),
}

# New SID entities (10). type_code, name, description, source key (from the Atlas page's sources).
NEW = {
    'dihar': ('research_institution', 'Defence Institute of High Altitude Research (DIHAR), DRDO',
              'DRDO laboratory for cold-arid and high-altitude technologies — greenhouse and soilless agriculture, shelters, water and waste systems — with a high-altitude trial/testing mandate. Lead organisation in the Techadyant High-Altitude Defence Atlas.',
              'SRC-012'),
    'dipas': ('research_institution', 'Defence Institute of Physiology and Allied Sciences (DIPAS), DRDO',
              'DRDO laboratory for soldier physiology at altitude — acclimatisation, high-altitude illness, nutrition and performance in extreme environments.',
              'SRC-002'),
    'debel': ('research_institution', 'Defence Bio-Engineering and Electro Medical Laboratory (DEBEL), DRDO',
              'DRDO laboratory for protective clothing and life-support equipment, including high-altitude partial-pressure suit fabric and cold-weather protective gear.',
              'SRC-003'),
    'ha_logistics': ('scheme', 'DRDO high-altitude logistics drone programme (20 kg)',
                     'DRDO/ADE development of 20 kg-payload high-altitude logistics drones in electric, hybrid and engine variants; 18,000 ft take-off altitude stated. Development programme — not evidence of production or induction.',
                     'SRC-030'),
    'himdrone': ('scheme', 'HIM-DRONE-A-THON (Indian Army high-altitude drone demonstrations)',
                 'Indian Army-organised high-altitude drone demonstrations with industry at roughly 4,000–5,000 m around Leh/Wari La (HIM-DRONE-A-THON 2, HIMTECH 2024). A demonstration and demand signal — not procurement.',
                 'SRC-014'),
    'innoyoddha': ('scheme', 'Inno-Yoddha (Indian Army innovation programme)',
                   'Indian Army in-house innovation pipeline and annual cohort; ideas and prototypes, not procurement.',
                   'SRC-013'),
    'endureair': ('company', 'EndureAir Systems',
                  'Indian UAV maker; SABAL described by the company for high-altitude logistics. Company-stated capability; procurement status not inferred.',
                  'SRC-020'),
    'insidefpv': ('company', 'InsideFPV',
                  'Indian FPV/tactical UAV maker; company documents a high-altitude demonstration result at HIM-DRONE-A-THON. Procurement status not inferred.',
                  'SRC-023'),
    'optiemus': ('company', 'Optiemus Unmanned Systems',
                 'Indian UAV maker (Vajra series); company materials record HIM-DRONE-A-THON participation. Event technical parameters unverified.',
                 'SRC-025'),
    'navisys': ('company', 'Navisys Technologies',
                'Indian UAV, navigation and autonomy company; company materials report high-altitude trial activity. Procurement status not inferred.',
                'SRC-026'),
    'ha_uas': ('technology', 'High-altitude UAS (thin-air, cold operation)',
               'Unmanned aircraft engineered for thin air and extreme cold — reduced rotor/propeller thrust, cold-degraded battery capacity and cold-qualified electronics set the design limits. Mapped in the Techadyant High-Altitude Defence Atlas.',
               'SRC-018'),
}

REL_TYPE_ID = {'supplies_to': 1, 'depends_on': 2, 'operates': 5, 'beneficiary_of': 8, 'develops': 14, 'researches': 20, 'part_of': 23, 'related_to': 30}
REL_LABEL = {'depends_on': 'Depends on', 'operates': 'Operates', 'beneficiary_of': 'Beneficiary of', 'develops': 'Develops',
             'researches': 'researches', 'part_of': 'part of', 'related_to': 'related to'}
VERIF = {'official': 'verified', 'company': 'single_source'}

# (type, source, target, description, source key, evidence class)
RELS = [
    ('part_of', 'dihar', 'drdo', 'DRDO laboratory (Leh).', 'SRC-012', 'official'),
    ('part_of', 'dipas', 'drdo', 'DRDO laboratory.', 'SRC-002', 'official'),
    ('part_of', 'debel', 'drdo', 'DRDO laboratory.', 'SRC-003', 'official'),
    ('develops', 'ade', 'ha_logistics', 'ADE with industry: 20 kg high-altitude logistics drone in electric, hybrid and engine variants.', 'SRC-030', 'official'),
    ('related_to', 'ha_logistics', 'ha_uas', 'DRDO high-altitude logistics UAS development programme.', 'SRC-030', 'official'),
    ('operates', 'army', 'himdrone', 'Indian Army organises the HIM-DRONE-A-THON high-altitude demonstrations.', 'SRC-014', 'official'),
    ('related_to', 'himdrone', 'ha_uas', 'Demonstration venue for high-altitude UAS (4,000–5,000 m).', 'SRC-014', 'official'),
    ('operates', 'army', 'innoyoddha', 'Indian Army innovation programme.', 'SRC-013', 'official'),
    ('researches', 'iitj', 'ha_uas', 'DRDO DIA-CoE IIT Jodhpur lists drones for high-altitude mountain areas as a research thrust.', 'SRC-009', 'official'),
    ('develops', 'ideaforge', 'ha_uas', 'YETI: 6,500 m maximum take-off altitude, 50–200 kg payload (company product page).', 'SRC-021', 'company'),
    ('develops', 'endureair', 'ha_uas', 'SABAL described for high-altitude logistics (company).', 'SRC-020', 'company'),
    ('develops', 'bonv', 'ha_uas', 'Air Hans: 16,500 ft operational ceiling, designed for high-altitude environments (company).', 'SRC-019', 'company'),
    ('develops', 'raphe', 'ha_logistics', 'DRDO TDF award for high-altitude stores-carriage drone development (ICE-engine and electric multicopter).', 'SRC-027', 'official'),
    ('beneficiary_of', 'raphe', 'tdf', 'TDF-awarded high-altitude stores-carriage drone project.', 'SRC-027', 'official'),
    ('develops', 'navisys', 'ha_uas', 'Company reports high-altitude UAV trial activity.', 'SRC-026', 'company'),
    ('related_to', 'insidefpv', 'himdrone', 'Company documents its HIM-DRONE-A-THON high-altitude FPV result.', 'SRC-023', 'company'),
    ('related_to', 'droneacharya', 'himdrone', 'Annual report documents high-altitude FPV demonstration at HIM-DRONE-A-THON.', 'SRC-024', 'company'),
    ('related_to', 'optiemus', 'himdrone', 'Company materials record HIM-DRONE-A-THON participation; parameters unverified.', 'SRC-025', 'company'),
    ('related_to', 'mistral', 'ha_uas', 'Harsh-environment embedded electronics and defence engineering (AXISCADES group).', 'SRC-022', 'company'),
    ('depends_on', 'ha_uas', 'cells', 'Cold degrades cell capacity; DRDO lists high-altitude battery performance and thermal management as a research need.', 'SRC-001', 'official'),
    ('related_to', 'ha_uas', 'small_uav', 'High-altitude variant class of small multirotor UAS.', 'SRC-018', 'official'),
]


def E(k):
    if k in EX: return EX[k][0], EX[k][1], EX[k][2]
    t, name, *_ = NEW[k]
    return uid('entity:' + k), name, t


def q(s):
    return 'NULL' if s is None else "'" + str(s).replace("'", "''") + "'"


def main():
    ha = json.load(open(HA, encoding='utf-8'))
    S = {s['id']: s for s in ha['sources']}
    errs = []
    for k, v in NEW.items():
        if v[3] not in S: errs.append(f'{k}: unknown source {v[3]}')
    for r in RELS:
        if r[0] not in REL_TYPE_ID: errs.append(f'bad rel type {r[0]}')
        if r[4] not in S: errs.append(f'rel {r[1]}->{r[2]}: unknown source {r[4]}')
        for k in (r[1], r[2]):
            if k not in EX and k not in NEW: errs.append(f'unknown key {k}')
    linked = {r[1] for r in RELS} | {r[2] for r in RELS}
    for k in NEW:
        if k not in linked: errs.append(f'orphan new entity {k}')
    atlas = json.load(open(ATLAS, encoding='utf-8'))
    names = {p['name'].lower() for p in atlas['players']}
    for k, v in NEW.items():
        if v[1].lower() in names and uid('entity:' + k) not in {p['id'] for p in atlas['players']}:
            errs.append(f'name already a player: {v[1]}')
    if errs:
        print('VALIDATION FAILED'); [print(' -', e) for e in errs]; sys.exit(1)
    if '--check' in sys.argv:
        print(f'OK — {len(NEW)} new entities, {len(RELS)} relationships.'); return

    # ---- SQL ----
    L = ['-- High-Altitude Defence Atlas v0.4 -> SID. Generated by scripts/sid-high-altitude.py.',
         '-- Idempotent: every insert is ON CONFLICT DO NOTHING (covers all unique constraints). Review, then run in the n8ndb SQL editor.',
         'begin;', 'set search_path=sid,public;', '', '-- sources']
    used_src = sorted({v[3] for v in NEW.values()} | {r[4] for r in RELS})
    for sid in used_src:
        s = S[sid]
        st = 8 if s['cls'].startswith('Primary company') else (1 if 'pib.gov.in' in s['url'] else 2)
        L.append(f"insert into sid.sources (source_id, source_type_id, publisher, title, url, is_primary) values ({q(uid('src:'+sid))}, {st}, {q(s['title'].split(' — ')[0])}, {q(s['title'])}, {q(s['url'])}, true) on conflict do nothing;")
    L += ['', '-- new entities']
    for k, (t, name, desc, _) in NEW.items():
        eid = uid('entity:' + k)
        L.append(f"insert into sid.entities (entity_id, canonical_name, entity_type_id, home_country, is_watchlist, watchlist_since, status, description) values ({q(eid)}, {q(name)}, (select id from sid.entity_types where code={q(t)}), 'IN', true, {q(TODAY)}, 'active', {q(desc)}) on conflict do nothing;")
        L.append(f"insert into sid.entity_corridors (entity_id, corridor_id, role) values ({q(eid)}, 4, 'high_altitude_atlas') on conflict do nothing;")
    aliases = [('dihar', 'DIHAR', 'abbreviation'), ('dipas', 'DIPAS', 'abbreviation'), ('debel', 'DEBEL', 'abbreviation'),
               ('himdrone', 'HIM-DRONE-A-THON', 'common'), ('himdrone', 'Him Drone-a-thon', 'common')]
    L += ['', '-- aliases (alias_norm is generated by the database)']
    for k, a, t in aliases:
        L.append(f"insert into sid.entity_aliases (alias_id, entity_id, alias, alias_type) values ({q(uid('alias:'+k+':'+a))}, {q(uid('entity:'+k))}, {q(a)}, {q(t)}) on conflict do nothing;")
    L += ['', '-- relationships']
    for (t, s_, tg, desc, sk, cls) in RELS:
        sid_, _, _ = E(s_); tid, _, _ = E(tg)
        L.append(f"insert into sid.relationships (relationship_id, source_entity_id, target_entity_id, relationship_type_id, corridor_id, description, verification_status, primary_source_id) values ({q(uid(f'rel:{t}:{s_}:{tg}'))}, {q(sid_)}, {q(tid)}, {REL_TYPE_ID[t]}, 4, {q(desc)}, {q(VERIF[cls])}, {q(uid('src:'+sk))}) on conflict do nothing;")
    L += ['', 'commit;', '']
    os.makedirs(os.path.dirname(SQL_OUT), exist_ok=True)
    open(SQL_OUT, 'w', encoding='utf-8').write('\n'.join(L))

    # ---- snapshot patches ----
    TYPE_LABEL = {'research_institution': 'Research Institution', 'scheme': 'Scheme / Programme', 'company': 'Private Company', 'technology': 'Technology'}
    pids = {p['id'] for p in atlas['players']}
    added = 0
    for k, (t, name, desc, _) in NEW.items():
        eid = uid('entity:' + k)
        if eid not in pids:
            atlas['players'].append(dict(id=eid, name=name, type=TYPE_LABEL[t], country='IN', corridors=['defence'], type_code=t, description=desc[:280])); added += 1
    have = {(r['source_id'], r['target_id'], r['type']) for r in atlas['relationships']}
    radd = 0
    for (t, s_, tg, desc, sk, cls) in RELS:
        sid_, sn, _ = E(s_); tid, tn, _ = E(tg)
        if (sid_, tid, t) in have: continue
        atlas['relationships'].append(dict(type=t, unit=None, source=sn, target=tn, magnitude=None, source_id=sid_, target_id=tid,
                                           type_label=REL_LABEL[t], corridor_id=4, description=desc[:200])); radd += 1
    with open(ATLAS, 'w', encoding='utf-8') as f:
        json.dump(atlas, f, ensure_ascii=False, indent=1)

    plat = json.load(open(PLATFORM, encoding='utf-8'))
    by = {e['id']: e for e in plat}
    tid = uid('entity:ha_uas')
    if tid not in by:
        name = NEW['ha_uas'][1]
        slug = re.sub(r'^-+|-+$', '', re.sub(r'[^a-z0-9]+', '-', name.lower())) + '-' + tid[:6]
        e = dict(id=tid, kind='technology', name=name, slug=slug, country='IN', kind_label='Technology', description=NEW['ha_uas'][2], relationships=[])
        plat.append(e); by[tid] = e
    for (t, s_, tg, desc, sk, cls) in RELS:
        sid_, sn, sk_t = E(s_); tid2, tn, tk_t = E(tg)
        for this, oname, okind, d in ((sid_, tn, tk_t, 'out'), (tid2, sn, sk_t, 'in')):
            if this in by:
                rel = dict(dir=d, kind=okind, name=oname, predicate=REL_LABEL[t])
                if rel not in by[this]['relationships']: by[this]['relationships'].append(rel)
    with open(PLATFORM, 'w', encoding='utf-8') as f:
        json.dump(plat, f, ensure_ascii=False, separators=(',', ':'))
    print(f'Wrote {os.path.relpath(SQL_OUT, ROOT)}; _atlas.json +{added} players +{radd} relationships; _platform.json updated.')


if __name__ == '__main__':
    main()
