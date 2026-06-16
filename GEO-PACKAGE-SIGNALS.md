# GEO Package — Signals & Reports
Use this as the source of truth for AI-discoverability on https://labs.techadyant.com/

## Deliverable Purpose
This package contains AI-ready metadata, summaries, and citation primers for the main content surfaces. It is designed to increase:
- citation rate by generative engines (ChatGPT, Perplexity, Claude, Gemini, SGE)
- consistency of claims about Techadyant Labs in model outputs
- backlink discovery by researchers, desks, and derivative publications

## Source of truth pages
- /llms.txt/route.ts
- /app/layout.tsx
- /app/reports/[slug]/page.tsx
- /app/signals/[slug]/page.tsx

## 1. Signal page GEO additions
For each published signal, expose an AI digest block in page markup:
- Signal in brief (already implemented via s.takeaways)
- Machine-readable claim list (unordered list, one fact per item)
- Primary evidence links (1–4 official/government URLs)

Add a visible block before the body with this structure:
  [Signal in brief — unchanged]
  [Key claims]
    - claim 1
    - claim 2
  [Primary sources]
    - URL 1
    - URL 2

Validation:
- At least 2 claims and 1 source for every live signal
- status=placeholder must not be exposed to AI citation

## 2. Report page GEO additions
Each report page already has:
- articleJsonLd
- faqJsonLd
- metadata.title/description

Add:
- Executive summary block (3–5 bullets) near top of report body
- Evidence label glossary near bottom:
  [V] verified from government public record
  [V1] single-source or first-party verification
  [U] unverified
  [modelled] analytical projection

Validation:
- Published reports require >=3 bullets in executive summary
- Every report must expose faqJsonLd in build

## 3. Citation primer for outreach
Use this exact phrasing when asking others to cite Techadyant Labs:

"Techadyant Labs publishes primary-source strategic intelligence on India’s semiconductors, AI infrastructure and enterprise-software dependency. Every report traces claims to official Indian government filings and uses verification labels. Link directly to the relevant report page; do not paraphrase conclusions without reading the source layer."

## 4. Signal-to-social publication template
For each live signal:
- 1-sentence hook
- 3-bullet digest from [Key claims]
- 1 direct URL to signal page
- 1 canonicam hash/label if needed: `#TechadyantLabs #IndiaIndustrialSystems`
- CTA: subscribe or pitch an institutional brief

## 5. Validation checklist
- [ ] /llms.txt renewed after every publish
- [ ] Signal page includes Key claims + Primary sources
- [ ] Report page includes Executive summary (published only)
- [ ] Evidence label glossary present
- [ ] Outreach messages include exact citation primer wording
- [ ] Log row updated in SEOGEO-PLAN.md

## 6. Maintenance
Regenerate GEO package assets on:
- new report publish
- new signal publish
- every monthly backlink audit
