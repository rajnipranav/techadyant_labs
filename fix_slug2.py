path = 'app/reports/[slug]/page.tsx'
with open(path, 'r', encoding='utf-8') as f: content = f.read()

# Fix getReport not found in articleJsonLd
content = content.replace(
  "function articleJsonLd(meta: ReturnType<typeof staticGetReport>) {",
  "function articleJsonLd(meta: any) {"
)

# Fix generateStaticParams - cast reports to any
content = content.replace(
  '  let reports: any[] = staticReports;\n  try {\n    const cms = await getReports();\n    if (cms.length) reports = cms as any[];\n  } catch {}\n  return reports.map((r) => ({ slug: r.slug }));',
  '  let reports: any[] = staticReports;\n  try {\n    const cms = await getReports();\n    if (cms.length) reports = cms as any[];\n  } catch {}\n  return (reports || []).map((r: any) => ({ slug: r.slug }));'
)

# Fix generateMetadata - cast r to any
content = content.replace(
  '  const r = await getReportBySlug(slug) || staticGetReport(slug);\n  if (!r) return {};',
  '  const r = await getReportBySlug(slug) || staticGetReport(slug);\n  if (!r) return {};\n  (r as any);'
)

# Fix implicit any in articleJsonLd map
content = content.replace("(meta.keywords && meta.keywords.length ? meta.keywords : [meta.domain])\n      .slice(0, 6)\n      .map((k) => ({ '@type': 'Thing', name: k }));",
                          "(meta.keywords && meta.keywords.length ? meta.keywords : [meta.domain])\n      .slice(0, 6)\n      .map((k: any) => ({ '@type': 'Thing', name: k }));")
content = content.replace("meta.faq.map((f) => ({", "meta.faq.map((f: any) => ({")

with open(path, 'w', encoding='utf-8') as f: f.write(content)
print('Fixed')
