#!/usr/bin/env python3
"""Idempotent integration edits for the Industrial Intelligence layer (Phase 1).

Applies small, anchored insertions to existing files so they work on any working copy
(including one with unrelated uncommitted edits). Run from the repo root:
    python3 scripts/apply-industrial-integration.py
Each edit is skipped if already present; an anchor that cannot be found is reported, not guessed.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
failures = []


def edit(rel, anchor, insert, *, before=False, marker=None, regex=False):
    p = ROOT / rel
    s = p.read_text(encoding='utf-8')
    crlf = '\r\n' in s
    s_n = s.replace('\r\n', '\n')
    if insert.strip() in s_n:
        print(f'skip  {rel} (already applied)')
        return
    m = re.search(anchor, s_n) if regex else None
    idx = (m.start() if before else m.end()) if regex and m else (s_n.find(anchor) if not regex else -1)
    if idx < 0:
        failures.append(f'{rel}: anchor not found -> {anchor[:70]!r}')
        print(f'FAIL  {rel}')
        return
    if not regex and not before:
        idx += len(anchor)
    out = s_n[:idx] + insert + s_n[idx:]
    if crlf:
        out = out.replace('\n', '\r\n')
    p.write_text(out, encoding='utf-8', newline='')
    print(f'ok    {rel}')


# 1. Atlas navigation — two links in the "Data" group, right after Explorer.
edit('app/research/AtlasNav.tsx',
     "      { href: '/research/explorer', label: 'Explorer' },\n",
     "      { href: '/research/industrial-nodes', label: 'Industrial Nodes' },\n"
     "      { href: '/research/infrastructure-projects', label: 'Infrastructure Projects' },\n")

# 2. Atlas overview — first entry in "Specialised datasets".
edit('app/research/page.tsx',
     "const DATABASES = [\n",
     "  { href: '/research/industrial-nodes/', name: 'Industrial Nodes & Connectivity', desc: 'What infrastructure means for industry: semiconductor-node dossiers (Dholera, Sanand, Jewar–YEIDA, Jagiroad) with connectivity, gaps, supply-chain position and opportunity surfaces.' },\n")

# 3. Player pages — back-link block before the feedback widget.
edit('app/research/players/[slug]/page.tsx',
     "import { RelatedReportsLinks, ENTITY_TO_REPORTS } from '../../report-links';\n",
     "import { PlayerIndustrialLinks } from '../../industrial/Backlinks';\n")
edit('app/research/players/[slug]/page.tsx',
     "        <div style={{ marginTop: 24 }}>\n          <MicroFeedback contentType=\"atlas\"",
     "        <PlayerIndustrialLinks playerId={p.id} />\n\n", before=True, marker='PlayerIndustrialLinks playerId')

# 4. Signal pages — "In the Atlas" block after the report CTA, before the subscribe CTA.
edit('app/signals/[slug]/page.tsx',
     "import { SIGNAL_TO_REPORTS } from '../report-links';\n",
     "import { SignalAtlasLinks } from '../../research/industrial/Backlinks';\n")
edit('app/signals/[slug]/page.tsx',
     "        <div className=\"report-cta\" style={{ padding: 0, marginTop: 48 }}>",
     "        <SignalAtlasLinks slug={s.slug} />\n\n", before=True, marker='SignalAtlasLinks slug')

# 5. Corridor node pages — link to the connectivity dossier before the facts block.
edit('app/corridors/[slug]/[node]/page.tsx',
     "import { JsonLd, breadcrumb, faqLd, SITE } from '../../../research/seo';\n",
     "import { CorridorNodeDossierLink } from '../../../research/industrial/Backlinks';\n")
edit('app/corridors/[slug]/[node]/page.tsx',
     "        <div className=\"node-facts\">",
     "        <CorridorNodeDossierLink corridor={slug} node={node} />\n\n", before=True, marker='CorridorNodeDossierLink corridor')

# 6. Sitemap — new URLs after the sources entry.
edit('app/sitemap.ts',
     "    { url: `${SITE}/research/sources/`,       lastModified: now, changeFrequency: 'weekly', priority: 0.75 },\n",
     "    { url: `${SITE}/research/industrial-nodes/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },\n"
     "    ...['dholera', 'sanand', 'jewar-yeida', 'jagiroad'].map((s) => ({ url: `${SITE}/research/industrial-nodes/${s}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.75 })),\n"
     "    { url: `${SITE}/research/industrial-nodes/methodology/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },\n"
     "    { url: `${SITE}/research/infrastructure-projects/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },\n")

# 8. llms.txt — one line after the pillar-maps entry.
edit('app/llms.txt/route.ts',
     "- [Pillar maps](${SITE}/research/pillars): each strategic industry as a system map — value-chain streams, the chokepoints inside them, and who controls each layer.\n",
     "- [Industrial Nodes & Connectivity](${SITE}/research/industrial-nodes): what infrastructure means for industry — semiconductor-node dossiers (Dholera, Sanand, Jewar–YEIDA, Jagiroad) linking anchor companies to road/rail/port/airport/DFC connectivity, a Connectivity Gap Index, transparent scores (Insufficient Data where evidence is thin) and labelled opportunity-surface hypotheses; every fact dated and sourced. Companion [Infrastructure Projects](${SITE}/research/infrastructure-projects) tracker (project → industrial consequence). Does not reproduce PM GatiShakti data.\n")

# 7. package.json — scripts + validator first in the build chain.
pkg = ROOT / 'package.json'
ps = pkg.read_text(encoding='utf-8')
if 'validate:industrial' not in ps:
    ps2 = ps.replace('"build": "node scripts/sync-cms-to-data.mjs && ', '"build": "node scripts/validate-industrial.mjs && node scripts/sync-cms-to-data.mjs && ', 1)
    ps2 = ps2.replace('"lint": "eslint .",', '"lint": "eslint .",\n    "validate:industrial": "node scripts/validate-industrial.mjs",\n    "test:industrial": "node --experimental-strip-types scripts/test-industrial-scoring.mjs",', 1)
    if ps2.count('validate:industrial') == 1 and ps2.count('validate-industrial.mjs') == 2:
        pkg.write_text(ps2, encoding='utf-8', newline='')
        print('ok    package.json')
    else:
        failures.append('package.json: build/lint anchors not found')
        print('FAIL  package.json')
else:
    print('skip  package.json (already applied)')

if failures:
    print('\nAnchors not found (apply by hand):\n  ' + '\n  '.join(failures))
    sys.exit(1)
