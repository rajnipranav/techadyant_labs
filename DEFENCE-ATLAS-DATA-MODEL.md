# Defence Atlas — Data Model

## Objective

Extend the current Atlas graph without breaking its existing corridor, player, relationship and event model.

The current Atlas already exposes corridors, layers, players, relationships and events through `app/research/atlas.ts` and the baked `_atlas.json` snapshot. The Defence redesign should build on that model rather than introduce a second graph.

## Current base model

Existing core entities include:

- `Corridor`
- `Layer`
- `StatusLevel`
- `GridCell`
- `Player`
- `Relationship`
- `AtlasEvent`

Existing player fields include:

```ts
interface Player {
  id: string;
  name: string;
  type_code: string;
  type: string;
  country: string;
  description: string;
  corridors: string[] | null;
}
```

## Proposed Defence extension

Do not change stable IDs. Add optional Defence-specific metadata at the data layer.

Recommended conceptual structure:

```ts
interface DefenceProfile {
  service_codes: DefenceServiceCode[];
  service_primary?: DefenceServiceCode;
  capability_domains: string[];
  platform_types?: string[];
  industrial_roles?: string[];
  evidence_status?: 'verified' | 'partial' | 'inferred';
}

type DefenceServiceCode =
  | 'army'
  | 'navy'
  | 'coast_guard'
  | 'air_force'
  | 'joint'
  | 'cross_service';
```

Whether this is embedded directly in Player or represented through a separate generated mapping should be decided after auditing the source database / bake pipeline. Prefer a relational mapping if the existing SID schema supports it cleanly.

## Service taxonomy

### Army

Capability domains:

- armour
- mechanised_infantry
- artillery
- rockets
- missiles
- air_defence
- infantry_systems
- ammunition
- unmanned
- counter_uas
- electronic_warfare
- c4isr
- communications
- logistics
- mobility
- battlefield_management

### Navy

Capability domains:

- surface_warfare
- submarine_warfare
- naval_air
- maritime_patrol
- anti_submarine_warfare
- naval_missiles
- naval_air_defence
- naval_guns
- torpedoes
- sensors
- radar
- sonar
- electronic_warfare
- communications
- propulsion
- shipbuilding
- underwater_systems

### Coast Guard

Capability domains:

- coastal_surveillance
- offshore_patrol
- search_and_rescue
- maritime_security
- patrol_vessels
- aviation
- unmanned
- sensors
- communications
- marine_propulsion

### Air Force

Capability domains:

- fighter_aircraft
- combat_aircraft
- transport
- tanker
- helicopter
- aewc
- electronic_warfare
- unmanned
- ucav
- air_to_air_weapons
- air_to_ground_weapons
- air_defence
- radar
- avionics
- propulsion
- aerospace_materials
- mro
- c4isr

## Shared capability domains

Use `joint` or `cross_service` when a capability is genuinely shared rather than forcing it into one service.

Examples:

- missiles
- counter_uas
- electronic_warfare
- c4isr
- secure_communications
- satellite_support
- propulsion
- advanced_materials
- semiconductors
- sensors

## Relationship semantics

Existing relationship types should remain authoritative.

Relevant relationship types include:

- `supplies_to`
- `depends_on`
- `controls`
- `part_of`
- `component_of`

Defence-specific service relationships should be additive rather than replacing these relationships.

Conceptually:

```text
BEL
  ├─ service_member_of → Army
  ├─ service_member_of → Navy
  └─ service_member_of → Air Force

BrahMos
  ├─ service_member_of → Army
  ├─ service_member_of → Navy
  └─ service_member_of → Air Force

Engine X
  └─ supplies_to → Aircraft Y
```

## Service membership record

If implemented as a generated relational table:

```text
DefenceServiceMembership
------------------------
player_id
service_code
role
confidence
evidence_source
evidence_date
notes
```

Suggested `role` values:

- operator
- developer
- manufacturer
- supplier
- integrator
- subsystem
- platform
- facility
- procurement_anchor
- research
- regulator
- infrastructure

## Platform record

Where existing Player records already represent platforms, do not duplicate them. Add platform metadata:

```text
platform_type
service_codes
operator_codes
manufacturer_ids
primary_systems
weapon_systems
propulsion_systems
status
induction_year
replacement_program
```

Only populate fields supported by source evidence.

## Component / technology records

Components and technologies should remain separate from platform records where they have reusable cross-platform identity.

Examples:

- AESA radar
- FADEC
- aircraft engine
- naval gearbox
- submarine AIP
- torpedo
- EO/IR sensor
- GaN RF module
- secure radio
- battlefield management system

This is important because the commercial value of the Atlas comes from showing **dependency chains**, not only end platforms.

## Dependency model

A dependency should be represented through existing relationships where possible:

```text
Platform → depends_on → Component
Platform → depends_on → Technology
Indian Manufacturer → depends_on → Foreign Supplier
System → component_of → Platform
Supplier → supplies_to → Manufacturer
```

Add structured dependency metadata if available:

```text
dependency_type
criticality
import_status
substitutability
localisation_status
verification
last_verified
```

## Procurement model

Procurement should be linked to service and capability rather than hard-coded into individual service pages.

Recommended fields:

```text
procurement_id
title
service_codes
category
quantity
value
currency
stage
contract_date
expected_delivery
buyer
supplier
indigenous_status
source
last_verified
```

## Industrial cluster model

Clusters should be reusable across service views.

Examples of conceptual tags:

- aerospace
- shipbuilding
- defence_electronics
- missiles
- ammunition
- propulsion
- naval_systems
- mro
- drones
- advanced_materials

A company can belong to multiple clusters.

## Opportunity model

Opportunities should be explicit Atlas objects / records where possible.

Recommended fields:

```text
opportunity_id
title
service_codes
capability_domain
technology_or_component
current_dependency
indian_capability
gap
market_signal
industrial_entry_point
confidence
sources
last_updated
```

The objective is to allow the Atlas to answer:

> What does each service need that Indian industry does not yet fully control?

## Cross-service query patterns

The data model should support these queries:

1. Show every Army dependency on foreign suppliers.
2. Show every Navy platform using an imported subsystem.
3. Show Air Force components supplied by a specific company.
4. Show companies serving all three services.
5. Show technologies shared by Army and Air Force.
6. Show shipbuilding suppliers that also serve Coast Guard.
7. Show cross-service chokepoints.
8. Show industrial clusters supporting multiple services.
9. Show procurement programmes linked to a specific dependency.
10. Show opportunities where a foreign-controlled dependency has an identifiable Indian industrial gap.

## Data quality rules

- Never infer service membership solely from a company name.
- Distinguish operator, manufacturer and supplier roles.
- Preserve foreign / Indian status from the existing country field unless better evidence exists.
- Record Coast Guard separately from Navy internally.
- Use `joint` only where evidence indicates genuine joint service relevance.
- Prefer evidence-backed capability tags over broad marketing categories.
- Preserve source and verification dates.
- Avoid duplicate records for shared systems.

## Backward compatibility

The redesign must continue to support:

- `/research/`
- existing pillar routes
- existing player routes
- existing specialist Atlas routes
- existing player slugs
- existing `_atlas.json` generation
- existing Atlas navigation
- existing SEO / JSON-LD patterns

The new Defence service views should consume the same underlying graph and should not require a second independent build pipeline unless technically necessary.
