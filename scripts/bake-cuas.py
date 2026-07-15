# India Counter-UAS ecosystem -> app/research/_cuas.json
import openpyxl, json, os, datetime, re
from collections import Counter, defaultdict
SRC="../../Reports and DPR/Drone manufacturing Ecosystem/Drones database"
F=os.path.join(SRC,"Techadyant_Counter_UAS_Intelligence_Database.xlsx")
wb=openpyxl.load_workbook(F, read_only=True, data_only=True)
def read(sheet):
    ws=wb[sheet]; rows=[list(r) for r in ws.iter_rows(values_only=True)]
    best=(0,-1)
    for i,r in enumerate(rows[:8]):
        cnt=sum(1 for c in r if c not in (None,"") and len(str(c))<40)
        if cnt>best[0]: best=(cnt,i)
    hi=best[1]; hdr=[str(h).strip() if h is not None else "" for h in rows[hi]]
    out=[]
    for r in rows[hi+1:]:
        if not any(c not in (None,"") for c in r): continue
        out.append({hdr[i]:(str(r[i]).strip() if r[i] is not None else "") for i in range(min(len(hdr),len(r))) if hdr[i]})
    return out
def g(d,*ks):
    for k in ks:
        for kk in d:
            if kk.lower().replace(" ","").replace("(fk)","").replace("%","")==k.lower().replace(" ","").replace("%",""): return d[kk]
    return ""
def c(s,cap=240): return (str(s).strip() if s not in (None,"") else "")[:cap]
def numf(s):
    m=re.search(r'-?\d[\d,]*\.?\d*', str(s or "")); return float(m.group().replace(',','')) if m else None
def slug(x,i): return (re.sub(r'-+','-',re.sub(r'[^a-z0-9]+','-',str(x).lower())).strip('-')[:52])+"-"+str(i).lower()
def yesarr(d, keys): return [lbl for lbl,k in keys if str(g(d,k)).lower().startswith('y')]

sys_rows=read("01_Counter_Drone_Systems")
DCLASS=[("Nano","Nano Drone"),("Micro","Micro Drone"),("Small UAV","Small UAV"),("Medium UAV","Medium UAV"),("Fixed Wing","Fixed Wing"),("VTOL","VTOL"),("FPV","FPV Drone"),("Loitering Munition","Loitering Munition"),("Helicopter UAV","Helicopter UAV"),("Swarm","Swarm"),("Autonomous","Autonomous Drone")]
KILL=[("Detect","Detect"),("Track","Track"),("Identify","Identify"),("Classify","Classify"),("Decide","Decide"),("Neutralize","Neutralize"),("Assess","Assess")]
systems=[]
for d in sys_rows:
    sid=g(d,"System ID")
    if not sid: continue
    nm=c(g(d,"System Name"),90)
    systems.append({"id":sid,"slug":slug(nm,sid),"name":nm,"variant":c(g(d,"Variant"),40),
      "mfr":c(g(d,"Manufacturer"),80),"country":c(g(d,"Country"),40),
      "indig":numf(g(d,"Indigenous Content")),"makeInIndia":c(g(d,"Make in India"),40),
      "classification":c(g(d,"Classification"),40),"domain":c(g(d,"Operational Domain"),90),
      "mobility":c(g(d,"Mobility"),40),"kill":yesarr(d,KILL),"counters":yesarr(d,DCLASS),
      "detRange":numf(g(d,"Detection Range")),"neutRange":numf(g(d,"Neutralization Range")),
      "reaction":numf(g(d,"Reaction Time")),"simTargets":numf(g(d,"Simultaneous Targets")),
      "ai":str(g(d,"AI Enabled")).lower().startswith('y'),"fusion":str(g(d,"Sensor Fusion")).lower().startswith('y'),
      "swarmDet":c(g(d,"Swarm Detection"),16),"status":c(g(d,"Deployment Status"),30),
      "year":c(g(d,"Launch Year"),8),"partners":c(g(d,"Technology Partners"),90),"web":c(g(d,"Website"),120)})

def simple(sheet, spec):
    return [{k:c(g(row,src),160) for k,src in spec} for row in read(sheet) if g(row,spec[0][1])]

mfrs=[{"id":g(m,"Manufacturer ID"),"slug":slug(c(g(m,"Company Name"),60),g(m,"Manufacturer ID")),"name":c(g(m,"Company Name"),80),
  "hq":c(g(m,"Headquarters"),60),"country":c(g(m,"Country"),40),"founded":c(g(m,"Year Founded"),8),
  "portfolio":c(g(m,"Product Portfolio"),160),"locations":c(g(m,"Manufacturing Locations"),120),
  "exports":c(g(m,"Exports"),140),"certifications":c(g(m,"Certifications"),120),"indigenous":c(g(m,"Indigenous Capability"),60)}
  for m in read("09_Manufacturers") if g(m,"Company Name")]
agencies=[{"id":g(a,"Agency ID"),"name":c(g(a,"Agency Name"),70),"type":c(g(a,"Agency Type"),30),
  "ministry":c(g(a,"Ministry"),50),"role":c(g(a,"Operational Role"),140),"systems":c(g(a,"Known Counter-UAS Systems"),160)}
  for a in read("10_Agencies_Users") if g(a,"Agency Name")]
deployments=[{"id":g(x,"Deployment ID"),"sysId":g(x,"System ID"),"system":c(g(x,"System Name"),70),
  "location":c(g(x,"Location"),70),"state":c(g(x,"State/UT"),40),"agency":c(g(x,"Agency Name"),60),
  "purpose":c(g(x,"Purpose"),140),"since":c(g(x,"Operational Since"),12),"status":c(g(x,"Current Status"),24),
  "lat":numf(g(x,"Latitude")),"lng":numf(g(x,"Longitude"))} for x in read("11_Deployments") if g(x,"Deployment ID")]
procurement=[{"id":g(x,"Procurement ID"),"tender":c(g(x,"Tender Number"),40),"agency":c(g(x,"Procuring Agency"),70),
  "vendor":c(g(x,"Vendor"),70),"qty":numf(g(x,"Quantity")),"inr":numf(g(x,"Contract Value (INR)")),
  "usd":numf(g(x,"Contract Value (USD)")),"date":c(g(x,"Award Date"),12),"status":c(g(x,"Delivery Status"),24),"inr_cr":(round(numf(g(x,"Contract Value (INR)"))/1e7,2) if numf(g(x,"Contract Value (INR)")) else None)}
  for x in read("12_Procurements") if g(x,"Procurement ID")]
components=[{"id":g(x,"Component ID"),"name":c(g(x,"Component Name"),80),"category":c(g(x,"Category"),40),
  "mfr":c(g(x,"Manufacturer"),90),"country":c(g(x,"Country"),50),"indianAlt":c(g(x,"Indian Alternative"),120),
  "risk":c(g(x,"Supply Risk Level"),40),"importance":c(g(x,"Strategic Importance"),140)} for x in read("13_Components") if g(x,"Component Name")]
technologies=[{"id":g(x,"Taxonomy ID"),"l1":c(g(x,"Level 1 Category"),40),"l2":c(g(x,"Level 2 Subcategory"),50),
  "l3":c(g(x,"Level 3 Technology"),60),"desc":c(g(x,"Description"),200),"maturity":c(g(x,"Maturity Level"),30),
  "indianCap":c(g(x,"Indian Capability"),120)} for x in read("14_Technology_Taxonomy") if g(x,"Level 3 Technology")]
detection=simple("02_Detection_Sensors",[("name","Sensor Name"),("mfr","Manufacturer"),("country","Country"),("principle","Detection Principle"),("range","Detection Range (km)"),("band","Frequency / Band")])
tracking=simple("03_Tracking_Systems",[("name","Tracking Technology"),("mfr","Manufacturer"),("country","Country"),("accuracy","Tracking Accuracy (m)"),("ai","AI Capability")])
identification=simple("04_Identification_Systems",[("name","Identification Technology"),("mfr","Manufacturer"),("country","Country"),("method","Method"),("accuracy","Accuracy (%)")])
softkill=simple("05_Soft_Kill_Systems",[("name","System Name"),("mfr","Manufacturer"),("country","Country"),("type","Type"),("range","Effective Range (km)"),("bands","Frequency Bands")])
hardkill=simple("06_Hard_Kill_Systems",[("name","System Name"),("mfr","Manufacturer"),("country","Country"),("type","Type"),("range","Effective Range (km)"),("kp","Kill Probability (%)")])
dew=simple("07_Directed_Energy_Systems",[("name","System Name"),("mfr","Manufacturer"),("country","Country"),("type","Type"),("power","Power Output (kW)"),("range","Effective Range (km)")])
interceptors=simple("08_Interceptor_Drones",[("name","System Name"),("mfr","Manufacturer"),("country","Country"),("speed","Speed (km/h)"),("capture","Capture Method")])
regulations=simple("15_Regulations",[("name","Regulation Name"),("auth","Issuing Authority"),("type","Regulation Type"),("scope","Scope"),("date","Effective Date"),("relevance","Counter-UAS Relevance")])
trials=simple("16_Testing_Trials",[("name","Trial Name"),("date","Trial Date"),("agency","Agency"),("location","Location"),("scenario","Scenario"),("outcome","Outcome")])
incidents=simple("17_Incident_Database",[("date","Incident Date"),("location","Location"),("state","State/UT"),("type","Incident Type"),("drone","Drone Type"),("counter","Countermeasure Used"),("outcome","Outcome")])
intel=[{"topic":c(g(x,"System/Topic"),70),"importance":c(g(x,"Strategic Importance"),120),"trl":c(g(x,"TRL"),16),
  "indig":c(g(x,"Indigenous Content"),16),"china":c(g(x,"Chinese Dependency"),60),"semi":c(g(x,"Semiconductor Dependency"),80),
  "ai":c(g(x,"AI Maturity"),50),"swarm":c(g(x,"Swarm Readiness"),50),"ew":c(g(x,"EW Resistance"),50),
  "gps":c(g(x,"GPS-Denied Capability"),50),"outlook":c(g(x,"Future Outlook"),160)} for x in read("18_Intelligence_Notes") if g(x,"System/Topic")]

byClass=Counter(s["classification"] for s in systems if s["classification"])
byMob=Counter(s["mobility"] for s in systems if s["mobility"])
byState=Counter(d["state"] for d in deployments if d["state"])
indianSys=[s for s in systems if s["country"]=="India"]
killLayers=[{"layer":"Soft-kill (RF/jam)","n":len(softkill)},{"layer":"Hard-kill (kinetic)","n":len(hardkill)},{"layer":"Directed-energy","n":len(dew)},{"layer":"Interceptor drones","n":len(interceptors)}]
crit=[x for x in components if 'critical' in x["risk"].lower()]
avgIndig=round(sum(s["indig"] or 0 for s in indianSys)/max(1,len(indianSys)))
meta={"updated":datetime.date.today().isoformat(),"systems":len(systems),"indianSystems":len(indianSys),
  "manufacturers":len(mfrs),"indianManufacturers":len([m for m in mfrs if m["country"]=="India"]),
  "agencies":len(agencies),"deployments":len(deployments),"procurementCr":round(sum(p["inr"] or 0 for p in procurement)/1e7),
  "procurementRows":len(procurement),"components":len(components),"criticalComponents":len(crit),
  "technologies":len(technologies),"incidents":len(incidents),"trials":len(trials),"avgIndigenous":avgIndig,
  "byClassification":[{"c":k,"n":v} for k,v in byClass.most_common()],
  "byMobility":[{"c":k,"n":v} for k,v in byMob.most_common()],
  "byState":[{"c":k,"n":v} for k,v in byState.most_common(12)],
  "killLayers":killLayers,
  "topManufacturers":[{"m":k,"n":v} for k,v in Counter(s["mfr"] for s in systems if s["mfr"]).most_common(8)]}
out={"meta":meta,"systems":systems,"manufacturers":mfrs,"agencies":agencies,"deployments":deployments,
  "procurement":procurement,"components":components,"technologies":technologies,"detection":detection,
  "tracking":tracking,"identification":identification,"softkill":softkill,"hardkill":hardkill,"dew":dew,
  "interceptors":interceptors,"regulations":regulations,"trials":trials,"incidents":incidents,"intel":intel}
p="app/research/_cuas.json"
json.dump(out,open(p,"w",encoding="utf-8"),ensure_ascii=False,separators=(",",":"))
chk=json.load(open(p,encoding="utf-8"))
print("bytes:",os.path.getsize(p))
for k in ["systems","manufacturers","agencies","deployments","procurement","components","technologies","detection","tracking","identification","softkill","hardkill","dew","interceptors","regulations","trials","incidents","intel"]:
    print(f"  {k}: {len(chk[k])}")
print("indianSystems:",len(indianSys),"| procurement Cr:",meta["procurementCr"],"| critical comps:",len(crit),"| avg indig:",avgIndig)
print("byClass:",[(x['c'],x['n']) for x in meta['byClassification'][:5]])
print("deployments w/ latlng:",sum(1 for d in deployments if d['lat'] and d['lng']),"| states:",[x['c'] for x in meta['byState'][:6]])
print("sample system:",json.dumps(chk['systems'][0],ensure_ascii=False)[:340])
