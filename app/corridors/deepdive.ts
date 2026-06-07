// Deepened, research-backed content for flagship corridors (concise analytical).
// Additive layer over data.ts — add a slug here as each corridor is researched.
// Sources: NICDC/DPIIT monthly reports, JICA/ADB master plans, PIB, state IDC portals (2025).

export interface DeepNode { name: string; detail: string; }
export interface DeepDive { view: string[]; nodes: DeepNode[]; }

export const deepDives: Record<string, DeepDive> = {
  "delhi-mumbai": {
    "view": [
      "The DMIC is the most advanced of India's corridors — the one place where the question has shifted from “will it build?” to “who captures the cluster?” Dholera, at 920 km² the largest node, has become the anchor of India's semiconductor ambition: the Tata Electronics–PSMC fab sits here, pulling in an ecosystem of industrial gases, ultra-pure water, speciality chemicals and equipment vendors that did not previously exist in India.",
      "Value is concentrating at two poles. In Gujarat, Dholera and the Sanand belt are forming an electronics-and-semiconductor cluster; in Maharashtra, Shendra–Bidkin (AURIC) — already operational, with 3,327 acres allotted and Hyosung anchoring — is an auto, EV and engineering cluster. The Western Dedicated Freight Corridor is what makes both viable, collapsing the logistics cost that historically tied manufacturing to the ports.",
      "For industry and MSMEs the opening is less the anchor plots (largely taken) than the second tier: the consumables, sub-assembly, testing, calibration, facility-services and logistics economy that forms around a fab or an auto cluster. This is where domestic firms can enter without bidding for marquee land.",
      "The risk we track is value pass-through. Anchor tenants are often foreign and the high-margin IP stays abroad; whether the corridor captures value or merely hosts assembly depends on how deeply the domestic supplier base localises — the central question of our Technology Sovereignty work."
    ],
    "nodes": [
      {
        "name": "Dholera SIR (Gujarat)",
        "detail": "920 km² greenfield smart city — the corridor's largest node and the anchor of India's semiconductor push (Tata Electronics–PSMC fab). 12 plots / ~503 acres allotted, with ~₹2,785 cr of activation infrastructure funded."
      },
      {
        "name": "Shendra–Bidkin / AURIC (Maharashtra)",
        "detail": "Operational smart industrial city near Chhatrapati Sambhajinagar; 327 plots / 3,327 acres allotted, Hyosung anchoring. Auto, EV and engineering cluster."
      },
      {
        "name": "Integrated Industrial Township, Greater Noida (UP)",
        "detail": "Operational township at the Dadri DFC junction (IITGNL) — logistics and light-manufacturing focus."
      },
      {
        "name": "Vikram Udyogpuri (Madhya Pradesh)",
        "detail": "Operational township near Ujjain; light manufacturing and agro-industry."
      },
      {
        "name": "Jodhpur–Pali–Marwar (Rajasthan)",
        "detail": "Planned investment region on the corridor's western leg."
      }
    ]
  },
  "chennai-bengaluru": {
    "view": [
      "The CBIC connects south India's two largest industrial economies — Bengaluru's R&D and electronics depth with Chennai's automotive and port base — across a ~560 km belt planned by JICA. Its thesis is less about new geography than about thickening the existing southern manufacturing core and giving it a dedicated export channel.",
      "Three nodes anchor it. Krishnapatnam (“KRIS City”, Andhra Pradesh) is the port-linked, export-oriented node — foundation laid in early 2025, ~₹10,500 cr of investment targeted, Phase-I trunk infrastructure due by end-2026. Tumakuru (Karnataka) is under construction with plug-and-play infrastructure on a similar timeline, and Ponneri (Tamil Nadu), ~4,000 acres north of Chennai, is master-planned for engineering and manufacturing.",
      "This is the corridor where post-PLI electronics manufacturing and the auto/EV supply chain are most likely to deepen. For MSMEs the entry points are component manufacturing, machine-vision and factory automation, and the logistics economy forming around the three nodes.",
      "The payoff depends on the nodes activating on schedule and on Tamil Nadu, Karnataka and Andhra Pradesh coordinating incentives rather than competing for the same investors — a live risk for any multi-state corridor."
    ],
    "nodes": [
      {
        "name": "Krishnapatnam / KRIS City (Andhra Pradesh)",
        "detail": "Greenfield, port-linked smart node; foundation laid Jan 2025. ~₹2,139 cr approved cost, ~₹10,500 cr investment; Phase-I trunk infrastructure targeted end-2026."
      },
      {
        "name": "Tumakuru (Karnataka)",
        "detail": "Foundation laid 2023, under construction; plug-and-play infrastructure targeted by late 2026."
      },
      {
        "name": "Ponneri (Tamil Nadu)",
        "detail": "~4,000 acres ~35 km north of Chennai; master plan complete; engineering and manufacturing focus."
      }
    ]
  },
  "amritsar-kolkata": {
    "view": [
      "AKIC is the Gangetic-plain corridor on the Eastern Dedicated Freight Corridor — the longest and least-developed of the flagships, spanning seven states. Its thesis is to reach India's large, lower-cost labour belt (Punjab, UP, Bihar, West Bengal) with freight connectivity that has historically been absent, and to industrialise the east the way the DMIC is industrialising the west.",
      "It is built as a chain of Integrated Manufacturing Clusters rather than a few mega-nodes: Gaya in Bihar (1,670 acres), Raghunathpur in West Bengal (2,483 acres), and Agra and Prayagraj in UP, where a State Support Agreement is signed and land acquisition is under way — alongside northern-leg clusters at Hisar, Rajpura–Patiala and Prag-Khurpia. Most are at land-acquisition or perspective-plan stage.",
      "This is the corridor for labour-intensive manufacturing — textiles, food processing, light engineering and assembly — and for early land and logistics positioning before activation. Returns are longer-dated, but entry costs are correspondingly lower.",
      "Execution is the binding constraint: land acquisition, multi-state coordination and the Eastern DFC's own ramp-up. Jharkhand's node relocation — land unavailable as of mid-2025, forcing a search for a new site — is a fair marker of the friction here."
    ],
    "nodes": [
      {
        "name": "Gaya IMC (Bihar)",
        "detail": "1,670-acre Integrated Manufacturing Cluster on the Eastern DFC — Bihar's anchor node."
      },
      {
        "name": "Raghunathpur IMC (West Bengal)",
        "detail": "2,483-acre IMC in Purulia — the corridor's eastern terminus cluster."
      },
      {
        "name": "Agra & Prayagraj IMCs (Uttar Pradesh)",
        "detail": "State Support Agreement signed (NICDC–UPSIDA); land acquisition under way."
      },
      {
        "name": "Hisar & Rajpura–Patiala (Haryana / Punjab)",
        "detail": "Northern-leg clusters at perspective-plan / development stage."
      },
      {
        "name": "Prag-Khurpia (Uttarakhand)",
        "detail": "Integrated Manufacturing Cluster under development."
      }
    ]
  },
  "vizag-chennai": {
    "view": [
      "VCIC is India's first coastal corridor and the Phase-1 spine of the East Coast Economic Corridor — explicitly oriented to ASEAN and East-Asia trade, with the ADB (~US$631 m in loans and grants) as lead development partner. Its logic is export-led manufacturing along ~800 km of the Andhra coast, using the ports rather than fighting inland logistics.",
      "Visakhapatnam already generates close to half the corridor's manufacturing output and anchors the heavy and port-industrial end; Chittoor in the south (electronics and auto, adjacent to the CBIC) and Machilipatnam and Donakonda fill the middle. Krishnapatnam (12,000+ acres, ~₹37,500 cr targeted by 2040) and Kopparthy (~₹7,790 cr) are the largest greenfield bets.",
      "The opportunity is port-linked, export-oriented manufacturing — electronics, pharma, food and marine processing — and the logistics and cold-chain economy around the ports. For investors, coastal node land paired with port access is the differentiator the inland corridors cannot match.",
      "VCIC remains largely at master-plan stage with no firm construction start across most nodes; realisation depends on Andhra Pradesh's fiscal capacity and on ports and power keeping pace with the manufacturing build-out."
    ],
    "nodes": [
      {
        "name": "Visakhapatnam (Andhra Pradesh)",
        "detail": "Anchor port-industrial city generating ~49% of the corridor's manufacturing output; master planning complete (ADB)."
      },
      {
        "name": "Chittoor (Andhra Pradesh)",
        "detail": "Southern node adjacent to the CBIC; electronics and auto focus; prioritised with master planning done."
      },
      {
        "name": "Krishnapatnam (Andhra Pradesh)",
        "detail": "12,000+ acre greenfield node; ~₹37,500 cr investment and ~4.6 lakh jobs targeted by 2040 (shared with the CBIC)."
      },
      {
        "name": "Kopparthy (Kadapa, Andhra Pradesh)",
        "detail": "6,740 acres (2,596 under the NICDC framework); ~₹7,790 cr investment, ~78,700 jobs."
      },
      {
        "name": "Machilipatnam & Donakonda (Andhra Pradesh)",
        "detail": "Coastal and central nodes in the ADB concept development plan."
      }
    ]
  },
  "cbic-kochi-extension": {
    "view": [
      "The Kochi extension carries the CBIC spine south-west into Kerala and western Tamil Nadu — NICDIT-approved in 2019, with two priority nodes: Palakkad in Kerala (~1,710 acres) and Salem–Dharmapuri in Tamil Nadu (~1,773 acres). It is the corridor that finally gives Kerala a federally-backed manufacturing node, sited on the Kochi–Salem highway.",
      "The intent is deliberately diversified — electronics, food and agro-processing, and IT/services rather than heavy industry — a fit for Kerala's land constraints and its skilled-services base. The Palakkad node targets roughly ₹10,000 cr of investment and about 10,000 jobs.",
      "For MSMEs this is an electronics-assembly, food-processing and light-engineering play in a state that has historically exported labour rather than hosted factories; early-mover land near the Palakkad node is the position to take.",
      "Both nodes are at master-planning / state-agreement stage — earlier than the parent CBIC. Kerala's smaller industrial land bank and the pace of the state SPV (KICDCL) are the constraints to watch."
    ],
    "nodes": [
      {
        "name": "Palakkad (Kerala)",
        "detail": "~1,710 acres on the Kochi–Salem NH; electronics, food processing and IT focus; ~₹10,000 cr and ~10,000 jobs targeted; master planning under way (KICDCL)."
      },
      {
        "name": "Salem–Dharmapuri (Tamil Nadu)",
        "detail": "~1,773-acre western-TN engineering and manufacturing cluster; State Support / Shareholder Agreements being finalised."
      }
    ]
  },
  "hyderabad-nagpur": {
    "view": [
      "HNIC links Telangana's capital region to central India at Nagpur, and unlike its sister Telangana corridors it has a live, funded NICDP node — Zaheerabad. The thesis is to extend Hyderabad's manufacturing hinterland north-west along a freight axis toward the Maharashtra industrial belt.",
      "Zaheerabad, in Sangareddy district, is a ~₹2,361 cr greenfield industrial smart city spanning 17 villages, with NICDIT equity (~₹596 cr) and debt (~₹655 cr) committed, a dedicated SPV established and project-management tendering begun. It is the corridor's anchor and its most concrete element.",
      "The opportunity is broad-based manufacturing — auto components, electronics, FMCG and engineering — drawing on Hyderabad's labour and logistics; the early opening is land and supplier positioning around Zaheerabad before activation.",
      "Today the corridor is effectively a single-node story; its breadth depends on the Maharashtra leg developing and on Zaheerabad activating on schedule."
    ],
    "nodes": [
      {
        "name": "Zaheerabad (Telangana)",
        "detail": "~₹2,361 cr greenfield industrial smart city in Sangareddy (17 villages); NICDIT-funded (~₹596 cr equity / ~₹655 cr debt), SPV set up, project-management tendering under way."
      }
    ]
  },
  "hyderabad-warangal": {
    "view": [
      "HWIC was conceived as a ~235 km pharma-anchored corridor between Telangana's two largest cities, with Hyderabad Pharma City — a ~19,000-acre National Investment & Manufacturing Zone — as the marquee node. Its federal status is unsettled, however: NICDIT withdrew Hyderabad Pharma City from the programme in 2022 after the state did not confirm the project on the trust's terms.",
      "The industrial logic survives even where the NICDP wrapper lapsed. Telangana is advancing pharma (the Pharma City / Genome Valley cluster) and textiles (the Kakatiya Mega Textile Park at Warangal) under its own policy. The corridor is best read today as a state-led pharma-and-textile axis rather than a fully-funded national node.",
      "The opportunity is in bulk-drug and formulations supply chains, contract manufacturing, and textile and apparel value chains — sectors where Telangana has genuine depth and where India is pushing import-substitution in APIs.",
      "The binding uncertainty here is institutional — whether the corridor is revived under the NICDP or continues purely as state industrial policy. Track the node's governance, not just the land."
    ],
    "nodes": [
      {
        "name": "Hyderabad Pharma City (Telangana)",
        "detail": "~19,000-acre pharma NIMZ — the original priority node; withdrawn from the NICDP by NICDIT in 2022, now advancing under state policy."
      },
      {
        "name": "Kakatiya Mega Textile Park, Warangal (Telangana)",
        "detail": "State-developed textile-and-apparel park anchoring the Warangal end of the corridor."
      }
    ]
  },
  "hyderabad-bengaluru": {
    "view": [
      "HBIC connects Hyderabad and Bengaluru — two of India's three largest technology-and-manufacturing metros — through Andhra Pradesh's Rayalaseema. Its anchor is Orvakal in Kurnool, a ~4,742-acre mega industrial hub on three parcels near NH-40, with load specifications announced in 2024 and EPC tendering imminent.",
      "The corridor's distinctive pull is proximity to two deep talent pools; the separately-mooted Hyderabad–Bengaluru technology corridor points to the same logic — electronics, aerospace and defence, and high-value engineering rather than commodity manufacturing.",
      "The opportunity is component manufacturing and engineering services feeding the two metros, plus the land and logistics economy around Orvakal and Kopparthy as they activate.",
      "It is early — one node at the tendering threshold; realisation depends on Andhra Pradesh executing and on the inter-state segment cohering."
    ],
    "nodes": [
      {
        "name": "Orvakal (Kurnool, Andhra Pradesh)",
        "detail": "~4,742-acre mega industrial hub on three parcels near NH-40; load specifications announced 2024, EPC tenders imminent."
      },
      {
        "name": "Kopparthy (Kadapa, Andhra Pradesh)",
        "detail": "Electronics manufacturing cluster on the Rayalaseema leg (shared with the VCIC)."
      }
    ]
  },
  "bengaluru-mumbai": {
    "view": [
      "BMIC connects two of India's largest metropolitan economies across the Deccan, but it is earlier-stage than its profile suggests. The perspective plan is complete and both states have confirmed land — Dharwad in Karnataka (the priority node) and Satara in Maharashtra — with consultants appointed for master planning.",
      "Dharwad (~6,000+ acres, beside the Hubballi-Dharwad twin city, Karnataka's second-largest municipal area) is the lead node and gives north Karnataka a manufacturing anchor away from the Bengaluru gravity well; Satara (~12,355 acres) extends the corridor toward the Pune–Mumbai belt.",
      "The opportunity is to seed manufacturing in tier-2 Karnataka and western Maharashtra — auto components, engineering, agro-processing — at lower land cost than the metros; early positioning at Dharwad is the play.",
      "It is still pre-activation; the corridor competes for attention with the more advanced DMIC and CBIC, and its pace depends on Karnataka and Maharashtra moving their nodes from plan to ground."
    ],
    "nodes": [
      {
        "name": "Dharwad (Karnataka)",
        "detail": "Priority node, ~6,000+ acres beside the Hubballi-Dharwad twin city; master planning under way."
      },
      {
        "name": "Satara (Maharashtra)",
        "detail": "~12,355-acre prospective node toward the Pune–Mumbai belt; consultants appointed for master planning."
      }
    ]
  },
  "odisha-economic": {
    "view": [
      "The Odisha Economic Corridor runs ~600 km along NH-16 as part of the ADB-conceived East Coast Industrial Corridor — 11 clusters across ~11,366 acres, organised into two zones. It is Odisha's bid to convert its mineral and port endowment into downstream manufacturing rather than exporting raw ore.",
      "Zone 1 (Gopalpur–Bhubaneswar–Kalinganagar, ~4,748 acres) leans on Odisha's metals core — Kalinganagar is already one of India's largest steel hubs — while Zone 2 (Paradip–Kendrapada–Dhamra–Subarnarekha, ~6,618 acres) is port-and-petrochemicals, anchored by Paradip and the Dhamra port complex. The corridor integrates with the Bhubaneswar–Cuttack–Paradip economic region.",
      "The opportunity is metals downstreaming (special steels, fabrication), petrochemicals and plastics, and the port-logistics and cold-chain economy — alongside Odisha's emerging role in critical minerals and coastal green-hydrogen siting.",
      "Phase-1 priority clusters are approved and development is initiating; the upside is real — existing industry plus ports — but land and rehabilitation in the mineral belt are the recurring frictions."
    ],
    "nodes": [
      {
        "name": "Gopalpur–Bhubaneswar–Kalinganagar (Zone 1)",
        "detail": "~4,748 acres — Odisha's metals-and-manufacturing belt; Kalinganagar is a major steel hub (Tata Steel, JSW)."
      },
      {
        "name": "Paradip–Kendrapada–Dhamra–Subarnarekha (Zone 2)",
        "detail": "~6,618 acres — port-and-petrochemicals zone anchored by Paradip and the Dhamra port complex."
      }
    ]
  },
  "delhi-nagpur": {
    "view": [
      "DNIC is the youngest of the eleven — a planned spine down the North–South Dedicated Freight Corridor, with an influence area across Delhi, Uttar Pradesh, Rajasthan, Madhya Pradesh and Maharashtra. Only the perspective-plan work has begun; there are no activated nodes yet.",
      "Its rationale is to give central India — the Bhopal–Nagpur axis — the same freight-led industrialisation the DMIC brought to the west, with a stated focus on manufacturing, agro-processing, services and export-oriented units.",
      "This is an early-positioning corridor: the value today is in tracking where nodes are sited along the N–S DFC, and in agro-processing and logistics plays across a region with land availability and improving connectivity.",
      "It is the least mature corridor in the programme; timelines are long and node locations are not yet fixed. For now it is a watch-list corridor rather than an investable one."
    ],
    "nodes": [
      {
        "name": "Perspective-plan stage",
        "detail": "Node locations along the North–South DFC are being identified across Delhi, UP, Rajasthan, MP and Maharashtra; no nodes activated yet."
      }
    ]
  }
};

export const deepDive = (slug: string): DeepDive | undefined => deepDives[slug];
