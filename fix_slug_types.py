path = 'app/reports/[slug]/page.tsx'
with open(path, 'r', encoding='utf-8') as f: content = f.read()

# Fix 1: import formatPrice
content = content.replace(
    "import { reports as staticReports, getReport as staticGetReport } from '../data';",
    "import { reports as staticReports, getReport as staticGetReport, formatPrice } from '../data';"
)

# Fix 2: fix generateStaticParams type casting
content = content.replace(
    'export async function generateStaticParams() {\n  let reports = staticReports;\n  try {\n    const cms = await getReports();\n    if (cms.length) reports = cms;\n  } catch {}\n  return reports.map((r) => ({ slug: r.slug }));\n}',
    'export async function generateStaticParams() {\n  let reports: any[] = staticReports;\n  try {\n    const cms = await getReports();\n    if (cms.length) reports = cms as any[];\n  } catch {}\n  return reports.map((r) => ({ slug: r.slug }));\n}'
)

# Fix 3: ensure getReport is used as staticGetReport
content = content.replace('typeof getReport', 'typeof staticGetReport')

with open(path, 'w', encoding='utf-8') as f: f.write(content)
print('Fixed')
