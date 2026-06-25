import re

path = 'app/reports/[slug]/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r";\\\\n\}\\\\n\\\\n", ";\n}\n\n", content)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed')
