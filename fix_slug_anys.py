path = 'app/reports/[slug]/page.tsx'
with open(path, 'r', encoding='utf-8') as f: content = f.read()
content = content.replace(": { k: string; name: string }", ": any")
content = content.replace(": { src: string; idx: number }", ": any")
content = content.replace(": { f: any; i: number }", ": any")
# fix the TS2552: Cannot find name 'getReport' by ensuring staticGetReport is used everywhere
content = content.replace('typeof getReport', 'typeof staticGetReport')
with open(path, 'w', encoding='utf-8') as f: f.write(content)
print('Fixed')
