# India UAS (drones) ecosystem -> app/research/_drones.json
# Sources: India_Drone_Intelligence_Database 2.xlsx (depth) + Techadyant_Atlas_UAS_Master_Workbook_v1.xlsx (schema/opps/graph)
import openpyxl, json, os, datetime, re
from collections import Counter

SRC="../../Reports and DPR/Drone manufacturing Ecosystem/Drones database"
B=os.path.join(SRC,"India_Drone_Intelligence_Database 2.xlsx")
A=os.path.join(SRC,"Techadyant_Atlas_UAS_Master_Workbook_v1.xlsx")

def read(fn, sheet):
    wb=openpyxl.load_workbook(fn, read_only=True, data_only=True)
    rows=[list(r) for r in wb[sheet].iter_rows(values_only=True)]
    # header = row (in first 8) with the most non-empty short cells
    best=(0,-1)
    for i,r in enumerate(rows[:8]):
        cnt=sum(1 for c in r if c not in (None,"") and len(str(c))<40)
        if cnt>best[0]: best=(cnt,i)
    hi=best[1]
    hdr=[str(h).strip() if h is not None else "" for h in rows[hi]]
    out=[]
    for r in rows[hi+1:]:
        if not any(c not in (None,"") for c in r): continue
        d={hdr[i]:(str(r[i]).strip() if r[i] is not None else "") for i in range(min(len(hdr),len(r))) if hdr[i]}
        if any(v for v in d.values()): out.append(d)
    return hdr, out

def clean(s,cap=200): return (str(s).strip() if s else "")[:cap]
def numi(s):
    m=re.search(r'-?\d[\d,]*\.?\d*', str(s or ""))
    return float(m.group().replace(',','')) if m else None

# --- lookups ---
_,mfrs=read(B,"Manufacturers")
MFR={m.get("Manufacturer_ID",""):m for m in mfrs}
_,agys=read(B,"Agencies")
AGY={a.get("Agency_ID",""):a for a in agys}
def mname(mid): return MFR.get(mid,{}).get("Manufacturer_Name","") or mid
def aname(aid): return AGY.get(aid,{}).get("Agency_Name","") or aid

# --- platforms ---
_,dm=read(B,"Drone Master Database")
def g(d,*keys):
    for k in keys:
        for kk in d:
            if kk.lower().replace(" ","_")==k.lower(): return d[kk]
    return ""
platforms=[]
for d in dm:
    did=g(d,"Drone_ID")
    if not did: continue
    platforms.append({
      "id":did,"name":clean(g(d,"Platform_Name")),"variant":clean(g(d,"Variant"),60),
      "category":clean(g(d,"Category"),40),"origin":clean(g(d,"Country_of_Origin"),40),
      "mfr":clean(mname(g(d,"Manufacturer_ID")),60),
      "operator":clean(aname(g(d,"Primary_Operator_ID")),60),
      "status":clean(g(d,"Status","Service_Status"),40),
      "indigenous":clean(g(d,"Indigenous_Content","Indigenous_Content_%","Indigenisation"),20),
      "role":clean(g(d,"Primary_Role","Role","Applications"),80),
    })
# --- companies ---
companies=[{"id":m.get("Manufacturer_ID",""),"name":clean(m.get("Manufacturer_Name")),
            "country":clean(m.get("Country"),40),"type":clean(m.get("Type"),40),
            "parent":clean(m.get("Parent"),60),"hq":clean(m.get("HQ"),60),
            "founded":clean(m.get("Year_Founded"),10)} for m in mfrs if m.get("Manufacturer_Name")]
# --- procurement ---
_,pr=read(B,"Procurement Database")
procurement=[]
for p in pr:
    did=g(p,"Drone_ID")
    procurement.append({"id":g(p,"Procurement_ID"),
      "platform":clean(next((x["name"] for x in platforms if x["id"]==did), did),60),
      "agency":clean(aname(g(p,"Procuring_Agency_ID")),60),
      "qty":numi(g(p,"Quantity")),"inr_cr":numi(g(p,"Contract_Value_INR_Cr")),
      "usd_m":numi(g(p,"Contract_Value_USD_M")),"date":clean(g(p,"Date_Signed"),10)})
# --- components ---
_,cm=read(B,"Components")
components=[{"id":c.get("Component_ID",""),"name":clean(g(c,"Component_Name")),
            "type":clean(g(c,"Component_Type"),40),"mfr":clean(mname(g(c,"Manufacturer_ID")),50),
            "supplier":clean(g(c,"Supplier"),60),"specs":clean(g(c,"Key_Specs"),120),
            "used_in":len([x for x in str(g(c,"Used_In_Drones")).split(";") if x.strip()])} for c in cm if g(c,"Component_Name")]
# --- agencies (operators) ---
agencies=[{"id":a.get("Agency_ID",""),"name":clean(a.get("Agency_Name")),"type":clean(a.get("Agency_Type"),30),
           "parent":clean(a.get("Parent_Org"),50),"role":clean(a.get("Role_Re_Drones"),90),
           "count":numi(a.get("Drone_Count"))} for a in agys if a.get("Agency_Name") and a.get("Country")=="India"]
# --- workbook A: opportunities, import deps, relationships ---
_,opp=read(A,"Opportunity Surfaces")
opportunities=[{"opportunity":clean(o.get("Opportunity")),"gap":clean(o.get("Gap"),160),
                "market":clean(o.get("Market"),60),"priority":clean(o.get("Priority"),20)} for o in opp if o.get("Opportunity")]
_,imp=read(A,"Import Dependencies")
importdeps=[{"item":clean(i.get("Item")),"from":clean(i.get("Import Country"),40),
             "alt":clean(i.get("Indian Alternative"),60),"risk":clean(i.get("Risk"),20)} for i in imp if i.get("Item")]
_,rel=read(A,"Relationships")
relationships=[{"s":clean(r.get("Source Entity")),"r":clean(r.get("Relationship"),30),"t":clean(r.get("Target Entity")),
                "conf":clean(r.get("Confidence"),12)} for r in rel if r.get("Source Entity") and r.get("Target Entity")]

# --- meta ---
india_platforms=[p for p in platforms if p["origin"]=="India" or "India" in p["mfr"]]
cats=Counter(p["category"] for p in platforms if p["category"])
proc_total=sum(p["inr_cr"] or 0 for p in procurement)
meta={"updated":datetime.date.today().isoformat(),
      "platforms":len(platforms),"companies":len(companies),"indianCompanies":len([c for c in companies if c["country"]=="India"]),
      "procurementRows":len(procurement),"procurementInrCr":round(proc_total),
      "components":len(components),"agencies":len(agencies),"opportunities":len(opportunities),
      "importDeps":len(importdeps),"relationships":len(relationships),
      "byCategory":[{"c":k,"n":v} for k,v in cats.most_common()],
      "topOperators":[{"a":a["name"],"n":a["count"]} for a in sorted(agencies,key=lambda x:-(x["count"] or 0))[:8] if a["count"]]}
out={"meta":meta,"platforms":platforms,"companies":companies,"procurement":procurement,
     "components":components,"agencies":agencies,"opportunities":opportunities,
     "importDeps":importdeps,"relationships":relationships}
p="app/research/_drones.json"
with open(p,"w",encoding="utf-8") as f: json.dump(out,f,ensure_ascii=False,separators=(",",":")); f.flush(); os.fsync(f.fileno())
chk=json.load(open(p,encoding="utf-8"))
print("bytes:",os.path.getsize(p))
for k in ["platforms","companies","procurement","components","agencies","opportunities","importDeps","relationships"]:
    print(f"  {k}: {len(chk[k])}")
print("indianCompanies:",meta["indianCompanies"],"| procurement INR cr:",meta["procurementInrCr"])
print("categories:",[ (c['c'],c['n']) for c in meta['byCategory'][:8]])
print("top operators:",[ (o['a'][:26],o['n']) for o in meta['topOperators']])
print("sample platform:",json.dumps(chk["platforms"][0],ensure_ascii=False))
print("sample procurement:",json.dumps(chk["procurement"][2],ensure_ascii=False))
print("sample opportunity:",json.dumps(chk["opportunities"][0],ensure_ascii=False))
