# India strategic-technology patenting monitor — baked from the Indian Patent Office weekly journals.
# India-only. Cleans the IPC-leaked applicant column. No heuristic scores (title/applicant/IPC/dates only).
import csv, json, os, re, datetime
from collections import Counter

SRC = "../../Patents/Patents CSV"
IPO = os.path.join(SRC, "ipo_indian_patents.csv")

KEEP = {
 "semiconductors","critical_minerals","ai_infrastructure","defence_electronics",
 "battery_technologies","robotics","solar_manufacturing","aerospace",
 "drone_technologies","quantum_technologies","telecommunications",
 "advanced_materials","industrial_automation","renewable_energy","water_treatment",
 "agriculture",
}
BLOCK = re.compile(r"(?ix)psoriasis|quinoline|leishman|antibod|vaccine|\bcancer|tumou?r|therapeut|"
                   r"pharmaceutic|\bdrug\b|clinical|\bpatient|\bgene\b|genome|peptide|dermat|prosthes|"
                   r"dental|surgical|insulin|diabet|biomarker|stem\ cell")

SMALL={"of","the","and","for","in","on","a","an","to","with","de"}
def titlecase(s):
    return " ".join(w if (w.isupper() and len(w)<=4) else
                    (w.lower() if w.lower() in SMALL and i else w.capitalize())
                    for i,w in enumerate(s.split()))

def clean_applicant(a):
    a=(a or "").strip()
    if not a or "international classification" in a.lower(): return ""
    if re.match(r'^\s*(\d+/\d+|[A-H]\d{2}[A-Z0-9]*|\(51\))', a):
        m=re.search(r'\d\)\s*(.+)$', a)
        if not m: return ""
        a=m.group(1)
    a=re.sub(r'\s*\d\)\s*', '; ', a).strip('; ').strip()
    a=re.sub(r'\s+',' ',a).strip().rstrip('([,;')
    if a.isupper(): a=titlecase(a)
    return a[:100]

def canon_key(a):
    k=re.sub(r'[^a-z0-9]','',a.lower())
    if k.startswith("indianinstituteoftechnology"): return "iit"+k[27:33]
    return k[:26]

def num(x):
    try: return round(float(x),1)
    except: return None
def clean(s,cap=200): return (s or "").strip().strip('"').replace("\n"," ").strip()[:cap]

rows=[]; seen=set(); dropped=Counter()
with open(IPO, newline="", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        app=clean(r.get("Application Number"),24)
        if not re.match(r'^\d{6,}$', app): dropped["bad_appnum"]+=1; continue
        pn="IN"+app+"A"
        if pn in seen: continue
        i=(r.get("Industry") or "").strip().lower(); t=clean(r.get("Title"),200)
        if i not in KEEP: dropped["off_topic:"+ (i or "blank")]+=1; continue
        if i!="agriculture" and BLOCK.search(t): dropped["medical"]+=1; continue
        a=clean_applicant(r.get("Applicant"))
        if not a: dropped["no_applicant"]+=1; continue
        seen.add(pn)
        ipc=[c.strip() for c in (r.get("IPC") or "").split(";") if c.strip()][:6]
        rows.append({"n":pn,"t":t,"i":i,"s":(r.get("Status") or "application").strip().lower(),
                     "d":clean(r.get("Publication Date"),10),"fd":clean(r.get("Filing Date"),10),
                     "a":a,"ipc":ipc,"j":clean(r.get("Journal"),12)})

rows.sort(key=lambda x:(x["d"] or "0000-00-00"), reverse=True)
byi=Counter(x["i"] for x in rows)
# top applicants grouped by canonical key (merge truncated variants; display longest variant)
groups={}
for x in rows:
    k=canon_key(x["a"]); g=groups.setdefault(k,{"names":Counter(),"n":0}); g["n"]+=1; g["names"][x["a"]]+=1
topapp=sorted(groups.values(), key=lambda g:-g["n"])[:14]
top=[{"a":max(g["names"], key=lambda nm:(len(nm),g["names"][nm])),"n":g["n"]} for g in topapp]
latest=max((x["j"] for x in rows if x["j"]), default="")
meta={"total":len(rows),"updated":datetime.date.today().isoformat(),"latestJournal":latest,
      "byIndustry":[{"i":k,"c":v} for k,v in byi.most_common()],
      "topApplicants":top,"distinctApplicants":len(groups)}
out={"meta":meta,"patents":rows}
p="app/research/_patents.json"
with open(p,"w",encoding="utf-8") as f:
    json.dump(out,f,ensure_ascii=False,separators=(",",":")); f.flush(); os.fsync(f.fileno())
with open(p,encoding="utf-8") as f: chk=json.load(f)
print("INDIA patents kept:",len(chk["patents"]),"| distinct applicants:",len(groups),"| latest journal:",latest,"| bytes:",os.path.getsize(p))
print("industries:",[(d["i"],d["c"]) for d in meta["byIndustry"]])
print("top applicants:",[(d["a"][:38],d["n"]) for d in top[:8]])
print("dropped:",dict(dropped.most_common()))
print("sample:",json.dumps(chk["patents"][0],ensure_ascii=False)[:220])
