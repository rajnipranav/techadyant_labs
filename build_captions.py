import zipfile, re
from pathlib import Path
from collections import Counter

docx_path = Path(r"D:\techadyant\labs_techadyant\Reports and DPR\In-progress\06_Industrial & Deep Tech\Techadyant_India_Shipbuilding_Package\Techadyant_India_Shipbuilding_Report.docx")

# 1) Probe current TOC/LOT/TOF placeholders in document.xml
with zipfile.ZipFile(docx_path) as z:
    styles = z.read('word/styles.xml').decode('utf-8')
    doc = z.read('word/document.xml').decode('utf-8')

print("=== CURRENT CODE-BASED TOC/LOT/TOF FIELDS ===")
for m in re.finditer(r'<w:instrText>([^\n]*)</w:instrText>', doc):
    val = m.group(1)
    print(val)

print("\n=== ALL CAPTION/TOC STYLE DEFINITIONS ===")
for m in re.finditer(r'<w:style[^/]*?</w:style>', styles, re.DOTALL):
    s = m.group()
    if any(k in s for k in ['Caption','TOCHeading','TOC1','Figure','Table']):
        sid = re.search(r'w:styleId="([^"]+)"', s)
        stype = re.search(r'w:type="([^"]+)"', s)
        print(f"  {sid.group(1) if sid else '?'} ({stype.group(1) if stype else '?'})")

print("\n=== OTHER w:style REFERENCES AROUND LOF/LOT FIELDS ===")
# sometimes styles are set via w:pPr directly after the field
for m in re.finditer(r'TOC.*?</w:instrText>', doc, re.DOTALL):
    snippet = m.group()
    print(snippet[:800])
print("done")
