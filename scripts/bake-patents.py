import csv, json, os, re, datetime
from collections import Counter

SRC = "../../Patents/Patents CSV"
GLOBAL = os.path.join(SRC, "techadyant_patent_database (2).csv")
IPO = os.path.join(SRC, "ipo_indian_patents.csv")

# Industries that match Techadyant Labs' website content (strategic industrial systems).
KEEP = {
 "semiconductors","critical_minerals","ai_infrastructure","defence_electronics",
 "battery_technologies","robotics","solar_manufacturing","aerospace",
 "drone_technologies","quantum_technologies","telecommunications",
 "advanced_materials","industrial_automation","renewable_energy","water_treatment",
 "agriculture",
}
# Everything else (pharmaceuticals, biotechnology, medical_devices, food_technology,
# agriculture, automotive, construction, other, parse-noise) is dropped.

# Catch medical / life-science / agri items mis-tagged INTO a kept bucket.
BLOCK = re.compile(r"""(?ix)
 psoriasis|quinoline|leishman|antibod|vaccine|\bcancer|tumou?r|therapeut|pharmaceutic|
 \bdrug\b|\bdisease|clinical|\bpatient|diagnos|\bgene\b|genome|peptide|dermat|prosthes|
 dental|surgical|insulin|diabet|cognitive\ health|neuromirror|biomarker|\bcardio|
 stem\ cell|identification\ of\ talent|respiratory\ mask|goggle\ device|
 agricultur|\bcrop\b|fertili[sz]|pesticide|herbicide|\bfood\b|beverage|nutrit|\bdairy
""")

def ind(x):
    return (x or "").strip().lower()
def num(x):
    try: return round(float(x),1)
    except: return None
def intn(x):
    try: return int(float(x))
    except: return None
def clean(s, cap=140):
    return (s or "").strip().strip('"').replace("\n"," ").strip()[:cap]

rows=[]; seen=set(); dropped=Counter()

def consider(rec, industry, title):
    if industry not in KEEP:
        dropped[industry or "(blank)"]+=1; return False
    if industry != "agriculture" and BLOCK.search(title or ""):
        dropped["_medical_in_kept_bucket"]+=1; return False
    rows.append(rec); return True

with open(GLOBAL, newline="", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        pn=clean(r.get("Patent Number"),40)
        if not pn or pn in seen: continue
        seen.add(pn)
        i=ind(r.get("Industry")); t=clean(r.get("Title"),200)
        consider({"n":pn,"t":t,"i":i,"s":(r.get("Status") or "").strip().lower(),
                  "c":(r.get("Country") or "").strip(),"d":clean(r.get("Publication Date"),10),
                  "a":clean(r.get("Applicants"),120),"tr":intn(r.get("TRL")),
                  "is":num(r.get("Industrial Score")),"ss":num(r.get("Strategic Score"))}, i, t)

with open(IPO, newline="", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        app=clean(r.get("Application Number"),24)
        if not app: continue
        pn="IN"+app+"A"
        if pn in seen: continue
        seen.add(pn)
        i=ind(r.get("Industry")); t=clean(r.get("Title"),200)
        ipc=[c.strip() for c in (r.get("IPC") or "").split(";") if c.strip()][:6]
        consider({"n":pn,"t":t,"i":i,"s":(r.get("Status") or "application").strip().lower(),
                  "c":"IN","d":clean(r.get("Publication Date"),10),"a":clean(r.get("Applicant"),120),
                  "tr":intn(r.get("TRL")),"is":num(r.get("Industrial Score")),
                  "ss":num(r.get("Strategic Score")),"ipc":ipc,"j":clean(r.get("Journal"),12)}, i, t)

rows.sort(key=lambda x:(x["d"] or "0000-00-00"), reverse=True)
byi=Counter(x["i"] for x in rows); byc=Counter(x["c"] for x in rows)
india=sum(1 for x in rows if x["c"]=="IN")
meta={"total":len(rows),"india":india,"updated":datetime.date.today().isoformat(),
      "byIndustry":[{"i":k,"c":v} for k,v in byi.most_common()],
      "byCountry":[{"c":k,"n":v} for k,v in byc.most_common(12)]}
out={"meta":meta,"patents":rows}
p="app/research/_patents.json"
with open(p,"w",encoding="utf-8") as f:
    json.dump(out,f,ensure_ascii=False,separators=(",",":")); f.flush(); os.fsync(f.fileno())
with open(p,encoding="utf-8") as f: chk=json.load(f)
print("KEPT:",len(chk["patents"]),"| India:",india,"| bytes:",os.path.getsize(p))
print("kept industries:",[(d["i"],d["c"]) for d in meta["byIndustry"]])
print("REMOVED total:",sum(dropped.values()))
for k,v in dropped.most_common(): print(f"   drop {k}: {v}")
