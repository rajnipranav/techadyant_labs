#!/usr/bin/env python3
"""
High-Altitude Defence Technology Ecosystem Atlas -> site data.

Reads the publish-ready master (data/osint/high-altitude-defence/source/
techadyant_high_altitude_defence_atlas_v0_4_publish_ready.json), applies the small,
logged set of editorial corrections below, validates everything, and writes
app/research/pillars/defence/_high_altitude.json for
/research/pillars/defence/high-altitude/.

The master file is never edited in place: corrections live in CORRECTIONS and are
published in the output's `corrections` list, so the page can show them.

Usage:
  python3 scripts/build-high-altitude-atlas.py          # build + validate
  python3 scripts/build-high-altitude-atlas.py --check  # validate only
"""
import copy, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, 'data', 'osint', 'high-altitude-defence', 'source',
                   'techadyant_high_altitude_defence_atlas_v0_4_publish_ready.json')
OUT = os.path.join(ROOT, 'app', 'research', 'pillars', 'defence', '_high_altitude.json')
DRONES = os.path.join(ROOT, 'app', 'research', '_drones.json')

# Existing Atlas company pages for suppliers the master marks "Existing Atlas company page".
SUPPLIER_PAGES = {
    'SUP-001': '/research/drones-uas/company/bonv-aero-mfr-041/',
    'SUP-002': '/research/drones-uas/company/endureair-systems-mfr-095/',
    'SUP-003': '/research/drones-uas/company/ideaforge-technology-ltd-mfr-014/',
    'SUP-006': '/research/drones-uas/company/droneacharya-aerial-innovations-mfr-038/',
    'SUP-009': '/research/drones-uas/company/raphe-mphibr-mfr-049/',
}

TECH_FOCUS = {
    'source_id': 'SRC-030',
    'title': 'DRDO Technology Focus, May–June 2025 (high-altitude logistics drones)',
    'url': 'https://www.drdo.gov.in/drdo/sites/default/files/technology-focus-documrnt/TF_MayJune2025.pdf',
    'source_class': 'Primary official',
    'coverage': 'High-altitude logistics drone development (20 kg payload; electric, hybrid and engine variants)',
    'checked': '2026-09-30',
}

# Every correction is explicit, minimal and published.
CORRECTIONS = [
    dict(id='COR-01', target='sources', change='Re-added DRDO Technology Focus May–June 2025 (present in v0.3, dropped in v0.4) as SRC-030.',
         reason='Five entities are labelled "DRDO Technology Focus" but pointed at SRC-005 (Agro Technology foresight page).'),
    dict(id='COR-02', target='HA-E014, HA-E070, HA-E071, HA-E072, HA-E073', change='source_ref SRC-005 → SRC-030.',
         reason='Their own source label and evidence (20 kg payload, three variants, 18,000 ft take-off) come from the Technology Focus issue, not the Agro page.'),
    dict(id='COR-03', target='HA-E014', change='claim_type research_need → development_programme.',
         reason='Evidence states three variants were developed with stated specifications — the same programme recorded as HA-E070 (development_programme).'),
    dict(id='COR-04', target='SUP-001 BonV Aero', change='parent_group "AXISCADES? no" → empty.',
         reason='Editing artefact; BonV Aero has no documented parent group in the master.'),
]
OPEN_ITEMS = [
    dict(id='OPEN-01', target='HA-E029', note='Evidence cites a dedicated DRDO Technology Focus issue on high-altitude health, habitability and sustenance, but the reference points to the Soldier Support foresight page (SRC-002). Direct citation to be added when the issue is located.'),
    dict(id='OPEN-02', target='SUP-007 Optiemus', note='Source is the company homepage; event-level parameters remain unverified (the master already keeps this claim conservative).'),
    dict(id='OPEN-03', target='Research gaps', note='v0.3 carried a 10-item research-gap register; v0.4 folds it into OP-015 (component-level dependency mapping). Not republished separately.'),
]

CLAIM_LABELS = {
    'research_need': 'Research need',
    'technology_transfer_available': 'ToT available',
    'demonstrated_demand_or_event': 'Demonstration / demand',
    'research_thrust': 'Research thrust',
    'policy_or_industrial_ecosystem': 'Policy / industrial ecosystem',
    'development_programme': 'Development programme',
    'documented_operational_or_institutional_capability': 'Documented capability',
    'innovation_pipeline': 'Innovation pipeline',
}
CLAIM_NOTES = {
    'research_need': 'Listed by DRDO or another primary source as a research or technology need — not an existing product or fielded capability.',
    'technology_transfer_available': 'Listed as a DRDO technology available for transfer — availability, not commercial production or procurement.',
    'demonstrated_demand_or_event': 'Documented Army/industry demonstration or stated demand — not a procurement or induction.',
    'research_thrust': 'Declared research thrust of an academic or DRDO centre.',
    'policy_or_industrial_ecosystem': 'Policy instrument or regional industrial ecosystem — an enabler, not a capability.',
    'development_programme': 'Documented development programme — not yet evidence of production or induction.',
    'documented_operational_or_institutional_capability': 'Documented operational infrastructure or institutional capability.',
    'innovation_pipeline': 'Innovation pipeline or cohort (e.g. Inno-Yoddha) — ideas and prototypes, not procurement.',
}


def build():
    m = json.load(open(SRC, encoding='utf-8'))
    d = copy.deepcopy(m)

    # COR-01..03
    d['sources'].append(TECH_FOCUS)
    for e in d['entities']:
        if e['entity_id'] in ('HA-E014', 'HA-E070', 'HA-E071', 'HA-E072', 'HA-E073'):
            assert e['source_ref'] == 'SRC-005', e['entity_id']
            e['source_ref'] = 'SRC-030'
            e['source_url'] = TECH_FOCUS['url']
        if e['entity_id'] == 'HA-E014':
            assert e['claim_type'] == 'research_need'
            e['claim_type'] = 'development_programme'
    # COR-04
    for s in d['suppliers']:
        if s['supplier_id'] == 'SUP-001':
            assert s['parent_group'] == 'AXISCADES? no'
            s['parent_group'] = ''

    src = {s['source_id']: s for s in d['sources']}
    ent_ids = {e['entity_id'] for e in d['entities']}
    cat_names = [c['category'] for c in d['categories']]

    entities = []
    for e in d['entities']:
        entities.append(dict(
            id=e['entity_id'], name=e['entity'], category=e['category'], organisation=e['organisation'],
            entity_type=e['entity_type'], summary=e['evidence_summary'], status=e['status'],
            claim_type=e['claim_type'], grade=e['evidence_grade'], role=e['atlas_role'],
            source_ref=e['source_ref'], last_verified=e['last_verified'],
            hypothesis='hypothesis' in e['status'].lower() or 'verify' in e['status'].lower(),
        ))
    suppliers = []
    for s in d['suppliers']:
        suppliers.append(dict(
            id=s['supplier_id'], company=s['company'], parent_group=s.get('parent_group') or '',
            capability=s['capability_class'], product=s['product_or_programme'], relevance=s['high_altitude_relevance'],
            grade=s['evidence_grade'], source_ref=s['source_ref'], atlas_path=SUPPLIER_PAGES.get(s['supplier_id']),
            linked_entities=[x for x in s['linked_atlas_entities'].split(';') if x], note=s['publication_note'],
        ))
    links = [dict(id=l['link_id'], supplier=l['supplier_id'], entity=l['entity_id'], capability=l['capability_link'],
                  relationship=l['relationship'], basis=l['basis'], grade=l['evidence_grade']) for l in d['supplier_links']]
    opps = [dict(id=o['opportunity_id'], name=o['opportunity'], problem=o['problem_surface'], category=o['category'],
                 priority=o['priority_for_research'], evidence=o['evidence_position'], next=o['next_research_action'])
            for o in d['opportunity_map']]
    out = dict(
        atlas_id=d['atlas_id'], version=d['version'], status=d['status'], last_updated=d['last_updated'],
        title=d['title'], subtitle=d['subtitle'], scope_note=d['scope_note'],
        evidence_policy=d['evidence_policy'], claim_labels=CLAIM_LABELS, claim_notes=CLAIM_NOTES,
        categories=d['categories'], entities=entities, suppliers=suppliers, supplier_links=links,
        opportunities=opps, excluded_suppliers=d['excluded_suppliers'],
        sources=[dict(id=s['source_id'], title=s['title'], url=s['url'], cls=s['source_class'],
                      coverage=s['coverage'], checked=s['checked']) for s in d['sources']],
        corrections=CORRECTIONS, open_items=OPEN_ITEMS,
        source_file='data/osint/high-altitude-defence/source/' + os.path.basename(SRC),
    )

    # ---------------- validation ----------------
    errs = []
    if len(entities) != 100: errs.append(f'expected 100 entities, got {len(entities)}')
    ids = [e['id'] for e in entities]
    if len(set(ids)) != len(ids): errs.append('duplicate entity ids')
    for e in entities:
        if e['source_ref'] not in src: errs.append(f"{e['id']}: unresolved source {e['source_ref']}")
        if e['category'] not in cat_names: errs.append(f"{e['id']}: unknown category {e['category']}")
        if e['claim_type'] not in CLAIM_LABELS: errs.append(f"{e['id']}: unknown claim_type {e['claim_type']}")
        if e['grade'] not in ('A', 'B', 'C', 'H'): errs.append(f"{e['id']}: bad grade {e['grade']}")
    for s in suppliers:
        if s['source_ref'] not in src: errs.append(f"{s['id']}: unresolved source")
        for x in s['linked_entities']:
            if x not in ent_ids: errs.append(f"{s['id']}: unknown linked entity {x}")
    for l in links:
        if l['entity'] not in ent_ids: errs.append(f"{l['id']}: unknown entity")
        if l['supplier'] not in {s['id'] for s in suppliers}: errs.append(f"{l['id']}: unknown supplier")
    for s in out['sources']:
        if not re.match(r'^https?://[^\s]+\.[a-z]{2,}', s['url']): errs.append(f"{s['id']}: malformed URL")
    blob = json.dumps(out)
    for pat in (r'turn\d+search\d+', r'\?\s*no"', r'\bTODO\b', r'\bTBD\b'):
        if re.search(pat, blob): errs.append(f'artefact pattern present: {pat}')
    drones = {c['slug'] for c in json.load(open(DRONES, encoding='utf-8'))['companies']}
    for sid, path in SUPPLIER_PAGES.items():
        slug = path.rstrip('/').split('/')[-1]
        if slug not in drones: errs.append(f'{sid}: company page slug not in _drones.json: {slug}')
    if any(x['company'] == 'Scandron' for x in suppliers): errs.append('Scandron must stay excluded')
    return out, errs


def main():
    out, errs = build()
    if errs:
        print('VALIDATION FAILED:'); [print('  -', e) for e in errs]; sys.exit(1)
    if '--check' in sys.argv:
        print(f"OK — {len(out['entities'])} entities, {len(out['suppliers'])} suppliers, {len(out['sources'])} sources, {len(out['corrections'])} corrections.")
        return
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1); f.write('\n')
    print(f"Wrote {os.path.relpath(OUT, ROOT)} — {len(out['entities'])} entities, {len(out['suppliers'])} suppliers, {len(out['sources'])} sources.")


if __name__ == '__main__':
    main()
