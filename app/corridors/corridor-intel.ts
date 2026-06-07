// Corridor intelligence layer: Readiness Score + enriched corridor & node data (all 11).
// Readiness Score: 4 axes each 0–25 → 0–100. Maturity · Capital momentum · Connectivity · Opportunity openness.
// Tiers: Build-now ≥65 · Position-early 40–64 · Watch <40. Scored consistently to allow cross-corridor ranking.
// Sources: NICDC/DPIIT DMU monthly reports, ADB/JICA plans, PIB, India Investment Grid, state portals (2025).

export type Stage = 'operational' | 'construction' | 'planned';
export interface IntelNode { name: string; area?: string; land?: string; sectors?: string; anchor?: string; stage: Stage; note?: string; }
export interface CorridorScore { maturity: number; capital: number; connectivity: number; opportunity: number; total: number; tier: 'Build-now' | 'Position-early' | 'Watch'; }
export interface CorridorIntel { spv?: string; funding?: string; dfc?: string; investment?: string; jobs?: string; stageLabel: string; connectivity: string[]; score: CorridorScore; nodes: IntelNode[]; }

export const SCORE_AXES = ['Maturity','Capital momentum','Connectivity','Opportunity'] as const;
export const TIER_COLOR: Record<string,string> = { 'Build-now':'#0F8E78', 'Position-early':'#B5891E', 'Watch':'#8593A6' };
export const STAGE_COLOR: Record<Stage,string> = { operational:'#0F8E78', construction:'#B5891E', planned:'#8593A6' };
export const STAGE_LABEL: Record<Stage,string> = { operational:'Operational', construction:'Under construction', planned:'Planned' };

export const intel: Record<string, CorridorIntel> = {
  "delhi-mumbai": {
    "spv": "NICDC / DMICDC",
    "funding": "GoI + JBIC (Japan)",
    "dfc": "Western DFC",
    "investment": "~US$90–100 bn programme",
    "jobs": "~3 million (programme)",
    "stageLabel": "Operational · plots being allotted",
    "connectivity": [
      "Western Dedicated Freight Corridor",
      "JNPT / Mumbai port",
      "Dadri ICD",
      "Delhi · Ahmedabad · Mumbai airports"
    ],
    "score": {
      "maturity": 25,
      "capital": 24,
      "connectivity": 25,
      "opportunity": 15,
      "total": 89,
      "tier": "Build-now"
    },
    "nodes": [
      {
        "name": "Dholera SIR (Gujarat)",
        "area": "920 km²",
        "land": "~503 ac allotted",
        "sectors": "Semiconductors, electronics, renewables",
        "anchor": "Tata Electronics–PSMC fab; Tata Chemicals",
        "stage": "operational"
      },
      {
        "name": "Shendra–Bidkin / AURIC (Maharashtra)",
        "area": "~10,000 ac",
        "land": "3,327 ac allotted",
        "sectors": "Auto, EV, engineering",
        "anchor": "Hyosung",
        "stage": "operational"
      },
      {
        "name": "Greater Noida (IITGNL, UP)",
        "area": "~750 ac",
        "land": "operational",
        "sectors": "Logistics, light mfg",
        "anchor": "Dadri multi-modal hub",
        "stage": "operational"
      },
      {
        "name": "Vikram Udyogpuri (MP)",
        "sectors": "Light mfg, agro-industry",
        "stage": "operational"
      },
      {
        "name": "Jodhpur–Pali–Marwar (Rajasthan)",
        "sectors": "General mfg",
        "stage": "planned"
      }
    ]
  },
  "chennai-bengaluru": {
    "spv": "NICDC + state SPVs",
    "funding": "GoI · JICA-planned",
    "stageLabel": "In build-out",
    "connectivity": [
      "Chennai & Krishnapatnam ports",
      "Chennai & Bengaluru airports",
      "Chennai–Bengaluru NH/expressway"
    ],
    "score": {
      "maturity": 16,
      "capital": 16,
      "connectivity": 20,
      "opportunity": 18,
      "total": 70,
      "tier": "Build-now"
    },
    "nodes": [
      {
        "name": "Krishnapatnam / KRIS City (AP)",
        "area": "port-linked node",
        "land": "under construction",
        "sectors": "General mfg, electronics",
        "anchor": "~₹10,500 cr targeted",
        "stage": "construction"
      },
      {
        "name": "Tumakuru (Karnataka)",
        "area": "activation area",
        "land": "under construction",
        "sectors": "Engineering, mfg",
        "stage": "construction"
      },
      {
        "name": "Ponneri (Tamil Nadu)",
        "area": "~4,000 ac",
        "land": "master plan complete",
        "sectors": "Engineering, mfg",
        "stage": "planned"
      }
    ]
  },
  "cbic-kochi-extension": {
    "spv": "NICDC + KICDCL (Kerala)",
    "funding": "GoI + state",
    "investment": "~₹10,000 cr (Palakkad)",
    "jobs": "~10,000 (Palakkad)",
    "stageLabel": "Master planning",
    "connectivity": [
      "Kochi port",
      "Coimbatore & Kochi airports",
      "Kochi–Salem NH"
    ],
    "score": {
      "maturity": 9,
      "capital": 9,
      "connectivity": 15,
      "opportunity": 15,
      "total": 48,
      "tier": "Position-early"
    },
    "nodes": [
      {
        "name": "Palakkad (Kerala)",
        "area": "~1,710 ac",
        "sectors": "Electronics, food processing, IT",
        "anchor": "~₹10,000 cr targeted",
        "stage": "planned"
      },
      {
        "name": "Salem–Dharmapuri (Tamil Nadu)",
        "area": "~1,773 ac",
        "sectors": "Engineering, mfg",
        "stage": "planned"
      }
    ]
  },
  "amritsar-kolkata": {
    "spv": "NICDC + state SPVs",
    "funding": "GoI",
    "dfc": "Eastern DFC",
    "stageLabel": "In build-out · land acquisition",
    "connectivity": [
      "Eastern Dedicated Freight Corridor",
      "Kolkata / Haldia port",
      "Multiple state airports"
    ],
    "score": {
      "maturity": 11,
      "capital": 12,
      "connectivity": 18,
      "opportunity": 18,
      "total": 59,
      "tier": "Position-early"
    },
    "nodes": [
      {
        "name": "Gaya IMC (Bihar)",
        "area": "1,670 ac",
        "sectors": "Mfg, light industry",
        "stage": "planned"
      },
      {
        "name": "Raghunathpur IMC (West Bengal)",
        "area": "2,483 ac",
        "sectors": "Mfg",
        "stage": "planned"
      },
      {
        "name": "Agra & Prayagraj IMCs (UP)",
        "land": "SSA signed, acquisition under way",
        "sectors": "Mfg",
        "stage": "planned"
      },
      {
        "name": "Hisar / Rajpura–Patiala (Haryana / Punjab)",
        "sectors": "Mfg, agro",
        "stage": "planned"
      },
      {
        "name": "Prag-Khurpia (Uttarakhand)",
        "sectors": "Mfg",
        "stage": "planned"
      }
    ]
  },
  "hyderabad-nagpur": {
    "spv": "NICDIT Zaheerabad Industrial Smart City",
    "funding": "NICDIT (~₹596 cr equity / ₹655 cr debt)",
    "investment": "₹2,361 cr (Zaheerabad)",
    "stageLabel": "In build-out (Zaheerabad)",
    "connectivity": [
      "NH-44 (Hyderabad–Nagpur)",
      "Hyderabad & Nagpur airports",
      "PM GatiShakti"
    ],
    "score": {
      "maturity": 12,
      "capital": 13,
      "connectivity": 14,
      "opportunity": 16,
      "total": 55,
      "tier": "Position-early"
    },
    "nodes": [
      {
        "name": "Zaheerabad (Telangana)",
        "area": "17 villages, Sangareddy",
        "land": "funded · PMNC tendering",
        "sectors": "Auto, electronics, FMCG, engineering",
        "anchor": "₹2,361 cr smart city",
        "stage": "construction"
      }
    ]
  },
  "hyderabad-warangal": {
    "spv": "State-led (TSIIC) — NICDP node withdrawn 2022",
    "funding": "State",
    "stageLabel": "NICDP node withdrawn (2022) · state-led",
    "connectivity": [
      "NH-163 (Hyderabad–Warangal)",
      "Hyderabad airport"
    ],
    "score": {
      "maturity": 8,
      "capital": 10,
      "connectivity": 12,
      "opportunity": 12,
      "total": 42,
      "tier": "Position-early"
    },
    "nodes": [
      {
        "name": "Hyderabad Pharma City (Telangana)",
        "area": "~19,000 ac",
        "sectors": "Pharma, bulk drugs",
        "anchor": "NIMZ (state-led; withdrawn from NICDP 2022)",
        "stage": "planned"
      },
      {
        "name": "Kakatiya Mega Textile Park, Warangal",
        "sectors": "Textiles, apparel",
        "anchor": "state-developed",
        "stage": "construction"
      }
    ]
  },
  "hyderabad-bengaluru": {
    "spv": "NICDC + Andhra Pradesh",
    "funding": "GoI + AP",
    "stageLabel": "Early · Orvakal tendering",
    "connectivity": [
      "NH-44 / NH-40",
      "Hyderabad & Bengaluru airports"
    ],
    "score": {
      "maturity": 11,
      "capital": 11,
      "connectivity": 14,
      "opportunity": 16,
      "total": 52,
      "tier": "Position-early"
    },
    "nodes": [
      {
        "name": "Orvakal (Kurnool, AP)",
        "area": "~4,742 ac",
        "land": "load specs 2024 · EPC imminent",
        "sectors": "Electronics, aerospace/defence, engineering",
        "stage": "planned"
      },
      {
        "name": "Kopparthy (Kadapa, AP)",
        "sectors": "Electronics",
        "stage": "planned"
      }
    ]
  },
  "bengaluru-mumbai": {
    "spv": "NICDC + Karnataka / Maharashtra",
    "funding": "GoI + states",
    "stageLabel": "Master planning",
    "connectivity": [
      "Mumbai / JNPT port",
      "Mumbai · Pune · Bengaluru · Hubballi airports",
      "Pune–Bengaluru NH"
    ],
    "score": {
      "maturity": 10,
      "capital": 10,
      "connectivity": 17,
      "opportunity": 16,
      "total": 53,
      "tier": "Position-early"
    },
    "nodes": [
      {
        "name": "Dharwad (Karnataka)",
        "area": "~6,000+ ac",
        "sectors": "Auto, engineering, agro",
        "anchor": "priority node",
        "stage": "planned"
      },
      {
        "name": "Satara (Maharashtra)",
        "area": "~12,355 ac",
        "sectors": "Engineering, agro",
        "stage": "planned"
      }
    ]
  },
  "vizag-chennai": {
    "spv": "NICDC + Andhra Pradesh",
    "funding": "GoI + AP + ADB (~US$631 m)",
    "stageLabel": "In build-out (Vizag civil works)",
    "connectivity": [
      "Visakhapatnam · Krishnapatnam · Chennai ports",
      "Vizag & Chennai airports",
      "NH-16 (coastal)"
    ],
    "score": {
      "maturity": 13,
      "capital": 15,
      "connectivity": 22,
      "opportunity": 18,
      "total": 68,
      "tier": "Build-now"
    },
    "nodes": [
      {
        "name": "Visakhapatnam (AP)",
        "land": "master plan complete",
        "sectors": "Heavy industry, pharma, port-industrial",
        "anchor": "~49% of corridor output",
        "stage": "construction"
      },
      {
        "name": "Krishnapatnam (AP)",
        "area": "12,000+ ac",
        "sectors": "General mfg",
        "anchor": "~₹37,500 cr · 4.6 lakh jobs by 2040",
        "stage": "construction"
      },
      {
        "name": "Kopparthy (Kadapa, AP)",
        "area": "6,740 ac",
        "sectors": "Electronics",
        "anchor": "~₹7,790 cr · 78,700 jobs",
        "stage": "planned"
      },
      {
        "name": "Chittoor (AP)",
        "sectors": "Electronics, auto",
        "stage": "planned"
      },
      {
        "name": "Machilipatnam & Donakonda (AP)",
        "sectors": "Coastal mfg",
        "stage": "planned"
      }
    ]
  },
  "odisha-economic": {
    "spv": "NICDC + Odisha (IDCO)",
    "funding": "GoI + ADB (ECIC)",
    "stageLabel": "Phase-1 clusters approved",
    "connectivity": [
      "Paradip · Dhamra · Gopalpur ports",
      "Bhubaneswar airport",
      "NH-16 (coastal)"
    ],
    "score": {
      "maturity": 12,
      "capital": 14,
      "connectivity": 20,
      "opportunity": 17,
      "total": 63,
      "tier": "Position-early"
    },
    "nodes": [
      {
        "name": "Gopalpur–Bhubaneswar–Kalinganagar (Zone 1)",
        "area": "~4,748 ac",
        "sectors": "Steel, metals, fabrication",
        "anchor": "Kalinganagar steel hub (Tata, JSW)",
        "stage": "construction"
      },
      {
        "name": "Paradip–Kendrapada–Dhamra–Subarnarekha (Zone 2)",
        "area": "~6,618 ac",
        "sectors": "Petrochemicals, ports, plastics",
        "stage": "planned"
      }
    ]
  },
  "delhi-nagpur": {
    "spv": "NICDC",
    "funding": "GoI",
    "dfc": "North–South DFC (planned)",
    "stageLabel": "Perspective plan",
    "connectivity": [
      "North–South DFC (planned)",
      "NH-44"
    ],
    "score": {
      "maturity": 5,
      "capital": 4,
      "connectivity": 14,
      "opportunity": 14,
      "total": 37,
      "tier": "Watch"
    },
    "nodes": [
      {
        "name": "Perspective-plan stage",
        "sectors": "Mfg, agro-processing (proposed)",
        "stage": "planned",
        "note": "Node locations being identified along the N–S DFC across Delhi, UP, Rajasthan, MP and Maharashtra."
      }
    ]
  }
};

export const corridorIntel = (slug: string): CorridorIntel | undefined => intel[slug];
export const leaderboard = Object.entries(intel)
  .map(([slug, v]) => ({ slug, total: v.score.total, tier: v.score.tier }))
  .sort((a, b) => b.total - a.total);
export const rankOf = (slug: string) => leaderboard.findIndex((x) => x.slug === slug) + 1;
