path = 'app/reports/[slug]/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('};\\n}\\n\\nfunction articleJsonLd', '  };\\n}\\n\\nfunction articleJsonLd')
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed literal newlines')
