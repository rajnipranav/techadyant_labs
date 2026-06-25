path = 'app/admin/cms/page.tsx'
with open(path, 'r', encoding='utf-8') as f: content = f.read()
# Fix table headers in main CmsAdmin component (before CmsForm)
# We need to replace {props.type === 'reports'} with {type === 'reports'} ONLY in the main component
# The main component has table headers around line 142
old = "{props.type === 'reports' && <th>Access</th>}\n                  {props.type === 'reports' && <th>Price (INR)</th>}"
new = "{type === 'reports' && <th>Access</th>}\n                  {type === 'reports' && <th>Price (INR)</th>}"
content = content.replace(old, new)
with open(path, 'w', encoding='utf-8') as f: f.write(content)
print('Fixed')
