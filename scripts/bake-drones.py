# India UAS (drones) ecosystem -> app/research/_drones.json  (v2 — enriched, Phase 2)
import openpyxl, csv, json, os, datetime, re
from collections import Counter
BASE="../../Reports and DPR/Drone manufacturing Ecosystem"
DB=os.path.join(BASE,"Drones database")
B=os.path.join(DB,"India_Drone_Intelligence_Database 2.xlsx")
A=os.path.join(DB,"Techadyant_Atlas_UAS_Master_Workbook_v1.xlsx")
WF=os.path.join(BASE,"Drone Manufacturing Ecosystem Strategic Dependencies, Supply-Chain Gaps/working files")

def read(fn, sheet):
    wb=openpyxl.load_workbook(fn, read_only=True, data_only=True)
    rows=[list(r) for r in wb[sheet].iter_rows(values_only=True)]
    best=(0,-1)
    for i,r in enumerate(rows[:8]):
        cnt=sum(1 for c in r if c not in (None,"") and len(str(c))<40)
        if cnt>best[0]: best=(cnt,i)
    hi=best[1]; hdr=[str(h).strip() if h is not None else "" for h in rows[hi]]
    out=[]
    for r in rows[hi+1:]:
        if not any(c not in (None,"") for c in r): continue
        d={hdr[i]:(str(r[i]).strip() if r[i] is not None else "") for i in range(min(len(hdr),len(r))) if hdr[i]}
        if any(v for v in d.values()): out.append(d)
    return out
def g(d,*keys):
    for k in keys:
        for kk in d:
            if kk.lower().replace(" ","_")==k.lower().replace(" ","_"): return d[kk]
    return ""
def c(s,cap=220): return (str(s).strip() if s not in (None,"") else "")[:cap]
def numi(s):
    m=re.search(r'-?\d[\d,]*\.?\d*', str(s or "")); return float(m.group().replace(',','')) if m else None

mfrs=read(B,"Manufacturers"); MFR={m.get("Manufacturer_ID",""):m for m in mfrs}
agys=read(B,"Agencies"); AGY={a.get("Agency_ID",""):a for a in agys}
mname=lambda i: MFR.get(i,{}).get("Manufacturer_Name","") or i
aname=lambda i: AGY.get(i,{}).get("Agency_Name","") or i

dm=read(B,"Drone Master Database")
platforms=[]
for d in dm:
    did=g(d,"Drone_ID")
    if not did: continue
    platforms.append({"id":did,"name":c(g(d,"Platform_Name")),"variant":c(g(d,"Variant"),60),
      "category":c(g(d,"Category"),40),"origin":c(g(d,"Country_of_Origin"),40),
      "mfr":c(mname(g(d,"Manufacturer_ID")),60),"operator":c(aname(g(d,"Primary_Operator_ID")),60),
      "mtow":numi(g(d,"MTOW_kg")),"payload":numi(g(d,"Payload_kg")),"endurance":numi(g(d,"Endurance_hr")),
      "range":numi(g(d,"Range_km")),"ceiling":numi(g(d,"Service_Ceiling_m")),"speed":numi(g(d,"Max_Speed_kmh")),
      "power":c(g(d,"Powerplant"),50),"roles":c(g(d,"Mission_Roles"),90),"sensors":c(g(d,"Sensors"),80),
      "payloads":c(g(d,"Payloads"),80),"ai":c(g(d,"AI_Capability"),60),
      "indig":numi(g(d,"Indigenous_Content_pct")),"status":c(g(d,"Status"),30),
      "inducted":c(g(d,"First_Inducted"),10),"inservice":numi(g(d,"Qty_In_Service")),
      "unitcost":numi(g(d,"Unit_Cost_USD")),"export":c(g(d,"Export_Status"),30),
      "desc":c(g(d,"Description"),260),"conf":c(g(d,"Confidence_Tier"),16)})
companies=[{"id":m.get("Manufacturer_ID",""),"name":c(g(m,"Manufacturer_Name")),"country":c(g(m,"Country"),40),
  "type":c(g(m,"Type"),40),"parent":c(g(m,"Parent"),60),"hq":c(g(m,"HQ"),60),"founded":c(g(m,"Year_Founded"),10),
  "products":c(g(m,"Key_Products"),160),"indig":c(g(m,"Indigenous_Content"),20),"dgca":c(g(m,"DGCA_Certified"),12),
  "web":c(g(m,"Website"),120)} for m in mfrs if g(m,"Manufacturer_Name")]
pr=read(B,"Procurement Database")
procurement=[]
for p in pr:
    did=g(p,"Drone_ID")
    procurement.append({"id":g(p,"Procurement_ID"),"platform":c(next((x["name"] for x in platforms if x["id"]==did), did),60),
      "agency":c(aname(g(p,"Procuring_Agency_ID")),60),"qty":numi(g(p,"Quantity")),
      "inr_cr":numi(g(p,"Contract_Value_INR_Cr")),"usd_m":numi(g(p,"Contract_Value_USD_M")),
      "date":c(g(p,"Date_Signed"),10),"delivery":c(g(p,"Delivery_Status"),24),"method":c(g(p,"Procurement_Method"),30)})
cm=read(B,"Components")
components=[{"id":x.get("Component_ID",""),"name":c(g(x,"Component_Name")),"type":c(g(x,"Component_Type"),40),
  "mfr":c(mname(g(x,"Manufacturer_ID")),50),"supplier":c(g(x,"Supplier"),70),"specs":c(g(x,"Key_Specs"),140),
  "used_in":len([y for y in str(g(x,"Used_In_Drones")).split(";") if y.strip()])} for x in cm if g(x,"Component_Name")]
agencies=[{"id":a.get("Agency_ID",""),"name":c(g(a,"Agency_Name")),"type":c(g(a,"Agency_Type"),30),
  "parent":c(g(a,"Parent_Org"),50),"role":c(g(a,"Role_Re_Drones"),90),"count":numi(g(a,"Drone_Count"))}
  for a in agys if g(a,"Agency_Name") and g(a,"Country")=="India"]
missions=read(B,"Missions"); incidents=read(B,"Incidents"); regs=read(B,"Regulations")
incid=[{"date":c(g(i,"Date"),10),"type":c(g(i,"Incident_Type"),40),"loc":c(g(i,"Location"),50),
  "desc":c(g(i,"Description"),200),"status":c(g(i,"Investigation_Status"),30)} for i in incidents if g(i,"Incident_Type") or g(i,"Description")]
regulations=[{"name":c(g(r,"Regulation_Name")),"auth":c(g(r,"Issuing_Authority"),50),"date":c(g(r,"Notification_Date") or g(r,"Effective_Date"),10),
  "type":c(g(r,"Type"),30),"applies":c(g(r,"Applicable_To"),60),"summary":c(g(r,"Summary"),240),"url":c(g(r,"Document_URL"),200)} for r in regs if g(r,"Regulation_Name")]

# workbook A ecosystem tabs
def simple(sheet, keys):
    return [{k:c(g(row,src),120) for k,src in keys} for row in read(A,sheet) if g(row,keys[0][1])]
payloads=simple("Payloads",[("name","Payload"),("type","Type"),("mfr","Manufacturer"),("app","Application")])
sensors=simple("Sensors",[("name","Sensor"),("type","Type"),("mfr","Manufacturer"),("app","Application")])
software=simple("Software",[("name","Software"),("cat","Category"),("dev","Developer"),("lic","License")])
powersys=simple("Power Systems",[("name","System"),("chem","Battery Chemistry"),("mfr","Manufacturer"),("cap","Capacity")])
comms=simple("Communications",[("name","Technology"),("freq","Frequency"),("enc","Encryption"),("range","Range")])
standards=simple("Standards & Certifications",[("name","Standard"),("auth","Authority"),("scope","Scope")])
testingLabs=simple("Testing Labs",[("name","Lab"),("loc","Location"),("cap","Capabilities")])
mro=simple("MRO",[("name","Provider"),("loc","Location"),("cap","Capabilities")])
training=simple("Training Centres",[("name","Centre"),("loc","Location"),("courses","Courses")])
corridors=simple("Drone Corridors",[("name","Corridor"),("state","State"),("purpose","Purpose")])
parks=simple("Industrial Parks",[("name","Park"),("state","State"),("focus","Focus")])
research=simple("Research Institutes",[("name","Institute"),("focus","Focus"),("loc","Location")])
universities=simple("Universities",[("name","University"),("programs","Programs"),("loc","Location")])
startups=simple("Startups",[("name","Startup"),("focus","Focus"),("hq","HQ"),("stage","Funding Stage")])
investments=simple("Investments",[("investor","Investor"),("company","Company"),("amount","Amount"),("year","Year")])
imp=read(A,"Import Dependencies")
importdeps=[{"item":c(g(i,"Item")),"from":c(g(i,"Import Country"),40),"alt":c(g(i,"Indian Alternative"),60),"risk":c(g(i,"Risk"),20)} for i in imp if g(i,"Item")]
rel=read(A,"Relationships")
relationships=[{"s":c(g(r,"Source Entity")),"r":c(g(r,"Relationship"),30),"t":c(g(r,"Target Entity")),"conf":c(g(r,"Confidence"),12)} for r in rel if g(r,"Source Entity") and g(r,"Target Entity")]

# report score CSVs
def rd(p):
    return list(csv.DictReader(open(os.path.join(WF,p),encoding="utf-8-sig")))
sov=[{"rank":int(x["rank"]),"component":c(x["component"],60),"layer":c(x["layer"],30),
  "india":int(x["india_score"]),"china":int(x["china_score"]),"importance":c(x["importance"],14),
  "risk":round(float(x["dsi_risk"]),1)} for x in rd("dsi-scores.csv")]
opps=[{"rank":int(x["rank"]),"opportunity":c(x["opportunity"],80),"category":c(x["category"],30),
  "tam":c(x["tam"],3),"capital":c(x["capital"],14),"timeline":c(x["timeline"],10),"export":c(x["export"],10),
  "dosf":round(float(x["dosf"]),1),"tier":c(x["tier"],16)} for x in rd("registry-scores.csv")]


# --- Phase 3: procurement rollups, manufacturing playbook, certification pathway ---
from collections import defaultdict
_py=defaultdict(lambda:[0,0])
for p in procurement:
    y=(p["date"] or "")[:4]
    if y.isdigit() and p["inr_cr"]:
        _py[y][0]+=p["inr_cr"]; _py[y][1]+=1
procByYear=[{"year":y,"inr_cr":round(v[0]),"n":v[1]} for y,v in sorted(_py.items())]
_pa=defaultdict(lambda:[0,0])
for p in procurement:
    if p["agency"] and p["inr_cr"]:
        _pa[p["agency"]][0]+=p["inr_cr"]; _pa[p["agency"]][1]+=1
procByAgency=[{"agency":a,"inr_cr":round(v[0]),"n":v[1]} for a,v in sorted(_pa.items(),key=lambda kv:-kv[1][0])[:10]]

# parse Manufacturing Playbook (Appendix J)
playbooks=[]
try:
    jtxt=open(os.path.join(WF,"draft-appendix-j.md"),encoding="utf-8").read()
    for m in re.finditer(r'### J\.\d+\s+([^\n]+)\n(.+?)(?=\n### |\Z)', jtxt, re.S):
        title=m.group(1).strip(); body=m.group(2)
        if title.lower().startswith("how to use"): continue
        def fld(label):
            mm=re.search(r'\*\*'+label+r'[^:]*:\*\*\s*(.+?)(?=\s*\*\*[A-Z]|\Z)', body, re.S)
            return re.sub(r'\s+',' ',mm.group(1)).strip().rstrip('.') if mm else ""
        playbooks.append({"venture":title,"investment":fld("Investment"),"talent":fld("Talent"),
            "certification":fld("Certification"),"regulation":fld("Regulation"),"margins":fld("Margins"),
            "failure":fld("Failure modes"),"edge":fld("Edge")})
except Exception as e:
    print("playbook parse warn:",e)

# certification pathway (verified from the drone reports; DGCA/QCI/NTH/CEMILAC regime)
CERT=[
 {"step":"Register the drone (UIN)","body":"DGCA Digital Sky","detail":"All drones up to 500 kg register on the Digital Sky portal for a Unique Identification Number. Drone Rules 2021 cut the forms from 25 to 5 and approvals from 72 to 4; ~90% of airspace is Green Zone up to 400 ft."},
 {"step":"Type Certification (civil)","body":"QCI / NTH (National Test House, Ghaziabad)","detail":"Civil platforms need DGCA type certification via the QCI-run scheme; NTH Ghaziabad became the designated type-certification body in Dec 2023. Indicative fee ~₹1.5 lakh; throughput ~3–6 months per model — the structural bottleneck."},
 {"step":"Safety, EMI/EMC & environmental testing","body":"QCI-accredited / NABL labs","detail":"Certification requires EMI/EMC, environmental and safety testing at accredited labs — the reason independent testing capacity is itself a high-margin opportunity."},
 {"step":"Airworthiness (military)","body":"CEMILAC / DRDO","detail":"Defence platforms are certified for airworthiness through CEMILAC/DRDO rather than DGCA; provenance and qualification matter more than price."},
 {"step":"Import compliance","body":"DGFT","detail":"The 2022 policy bans import of complete drones (CBU/SKD/CKD) but leaves components 'Free' — the paradox that shapes where value is added. Advanced optics/RF carry export-control considerations."},
]

# meta
roles=Counter()
for p in platforms:
    for r in re.split(r'[;,/]', p["roles"]):
        r=r.strip()
        if r and len(r)<30: roles[r]+=1
cats=Counter(p["category"] for p in platforms if p["category"])
tiers=Counter(o["tier"] for o in opps)
meta={"updated":datetime.date.today().isoformat(),
  "platforms":len(platforms),"companies":len(companies),"indianCompanies":len([x for x in companies if x["country"]=="India"]),
  "procurementRows":len(procurement),"procurementInrCr":round(sum(p["inr_cr"] or 0 for p in procurement)),
  "components":len(components),"sovereignty":len(sov),"criticalDeps":len([s for s in sov if s["importance"]=="Critical"]),
  "opportunities":len(opps),"buildNow":tiers.get("Build-now",0),"agencies":len(agencies),
  "incidents":len(incid),"regulations":len(regulations),"testingLabs":len(testingLabs),"mro":len(mro),
  "training":len(training),"corridors":len(corridors),"parks":len(parks),"startups":len(startups),
  "byCategory":[{"c":k,"n":v} for k,v in cats.most_common()],
  "byRole":[{"r":k,"n":v} for k,v in roles.most_common(12)],
  "byTier":[{"t":k,"n":v} for k,v in tiers.most_common()],
  "topOperators":[{"a":a["name"],"n":a["count"]} for a in sorted(agencies,key=lambda x:-(x["count"] or 0))[:8] if a["count"]],
  "procByYear":procByYear,"procByAgency":procByAgency,"playbooks":len(playbooks)}
out={"meta":meta,"platforms":platforms,"companies":companies,"procurement":procurement,"components":components,
  "sovereignty":sov,"opportunities":opps,"importDeps":importdeps,"agencies":agencies,"incidents":incid,
  "regulations":regulations,"standards":standards,"testingLabs":testingLabs,"mro":mro,"training":training,
  "corridors":corridors,"parks":parks,"research":research,"universities":universities,"startups":startups,
  "investments":investments,"payloads":payloads,"sensors":sensors,"software":software,"power":powersys,
  "comms":comms,"relationships":relationships,"playbooks":playbooks,"certification":CERT}
p="app/research/_drones.json"
json.dump(out,open(p,"w",encoding="utf-8"),ensure_ascii=False,separators=(",",":"))
chk=json.load(open(p,encoding="utf-8"))
print("bytes:",os.path.getsize(p))
for k in ["platforms","companies","procurement","components","sovereignty","opportunities","incidents","regulations","standards","testingLabs","mro","training","corridors","parks","research","universities","startups","investments","payloads","sensors","software","power","comms","relationships"]:
    print(f"  {k}: {len(chk[k])}")
print("meta buildNow:",meta["buildNow"],"critical deps:",meta["criticalDeps"])
print("roles:",[ (r['r'],r['n']) for r in meta['byRole'][:6]])
print("sample platform:",json.dumps(chk['platforms'][0],ensure_ascii=False)[:300])
print("sample opp:",json.dumps(chk['opportunities'][0],ensure_ascii=False))
print("sample sov:",json.dumps(chk['sovereignty'][0],ensure_ascii=False))
