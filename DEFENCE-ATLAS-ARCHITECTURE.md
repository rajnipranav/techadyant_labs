# Defence Atlas — New Architecture

## Purpose

Redesign the existing Defence pillar from a single broad service page into a Defence Atlas with three service-oriented analytical views while preserving the existing shared Atlas graph.

The architecture is:

```text
DEFENCE ATLAS
India's Defence Industrial System
│
├── ARMY ATLAS
├── NAVY & COAST GUARD ATLAS
└── AIR FORCE ATLAS

CROSS-SERVICE INTELLIGENCE
├── Unmanned Warfare
├── Counter-UAS
├── Missiles
├── Defence Electronics
├── Military Aerospace
├── Propulsion
└── C4ISR / EW
```

## Design principle

The three service Atlases are views over the same underlying entity and relationship graph. Do not create three isolated databases or duplicate companies, platforms, technologies, components, suppliers or dependencies.

A single entity can belong to multiple service views.

Examples:

- BEL → Army, Navy & Coast Guard, Air Force
- BrahMos → Army, Navy, Air Force
- AESA radar → multiple service and technology views
- Engines / FADEC / actuators → Air Force and cross-service industrial dependency layer
- UAS / Counter-UAS → relevant service Atlas plus dedicated specialist Atlases

## Defence parent page

Route: `/research/pillars/defence/`

Role: Defence Atlas landing page and navigation hub.

Required sections:

1. Hero: "Defence Atlas — India's Defence Industrial System"
2. Thesis: who builds India's military capability and where the industrial system remains dependent on foreign technology.
3. Three service Atlas cards:
   - Army Atlas
   - Navy & Coast Guard Atlas
   - Air Force Atlas
4. Cross-service intelligence links
5. Shared industrial system:
   - Companies
   - Platforms
   - Components
   - Technologies
   - Suppliers
   - Procurement
   - Dependencies
   - Industrial clusters
   - Opportunities
6. Cross-service chokepoints
7. Latest defence signals / events

## Army Atlas

Route: `/research/pillars/defence/army/`

Organising principle: land-warfare capability and its industrial base.

Primary taxonomy:

- Platforms
  - MBTs
  - IFVs / APCs
  - Artillery
  - Tactical vehicles
  - Air-defence platforms
- Fires
  - Artillery
  - Rockets
  - Ballistic missiles
  - ATGMs
  - Loitering munitions
- Infantry systems
  - Small arms
  - Optics
  - Body armour
  - Communications
  - Battlefield management systems
- Unmanned warfare
  - ISR drones
  - Attack drones
  - Loitering systems
  - UGVs
  - Counter-UAS
- Electronic warfare
- Battlefield communications / C4ISR
- Logistics & mobility
- Ammunition
- Air defence
- Manufacturers
- Procurement programmes
- Indigenisation
- Critical dependencies
- Industrial clusters
- Opportunities

## Navy & Coast Guard Atlas

Route: `/research/pillars/defence/navy-coast-guard/`

Organising principle: maritime military capability and the naval / coast-guard industrial ecosystem.

Primary taxonomy:

- Fleet
  - Aircraft carriers
  - Destroyers
  - Frigates
  - Corvettes
  - OPVs
  - Submarines
  - Patrol vessels
  - Coast Guard fleet
- Ship systems
  - Propulsion
  - Engines
  - Gearboxes
  - Generators
  - Combat management systems
  - Radars
  - Sonars
  - Electronic warfare
  - Communications
  - Navigation
  - Power systems
- Naval weapons
  - Anti-ship missiles
  - SAMs
  - Torpedoes
  - Naval guns
  - CIWS
  - ASW weapons
  - Loitering systems
- Naval aviation
  - Fighters
  - Helicopters
  - Maritime patrol aircraft
  - UAVs
- Underwater warfare
  - Submarines
  - AIP
  - Batteries
  - Sonars
  - Torpedoes
  - UUVs
  - Seabed systems
- Shipbuilding industrial base
  - Public yards
  - Private yards
  - Naval design
  - Marine steel
  - Composites
  - Electronics
  - Precision manufacturing
- Coast Guard industrial ecosystem
- Procurement
- Indigenisation
- Critical dependencies
- Industrial clusters
- Opportunities

## Air Force Atlas

Route: `/research/pillars/defence/air-force/`

Organising principle: air power, aerospace systems and the industrial dependencies behind them.

Primary taxonomy:

- Combat aircraft
  - Fighters
  - Multirole aircraft
  - AEW&C
  - Electronic warfare aircraft
- Transport & mobility
  - Strategic transport
  - Tactical transport
  - Tankers
  - Helicopters
- Unmanned air power
  - MALE
  - HALE
  - UCAV
  - Loitering systems
  - Autonomous systems
  - Swarms
- Air weapons
  - BVR missiles
  - WVR missiles
  - Air-to-ground weapons
  - Cruise missiles
  - Glide weapons
  - Anti-radiation weapons
- Air defence
  - SAM
  - BMD
  - Counter-UAS
  - Radars
  - Sensors
- Aerospace industrial base
  - Engines
  - FADEC
  - Avionics
  - AESA
  - IRST
  - EW
  - Actuators
  - Landing gear
  - Composites
  - Titanium
  - Superalloys
  - Semiconductors
  - Propulsion
- MRO
  - Engine MRO
  - Airframe MRO
  - Component MRO
  - Testing
  - Certification
- Procurement
- Indigenisation
- Critical dependencies
- Industrial clusters
- Opportunities

## Shared entity model

The underlying graph remains shared.

```text
ENTITY
├── Service
├── Platform
├── System
├── Component
├── Technology
├── Manufacturer
├── Supplier
├── Facility / Cluster
├── Procurement
├── Dependency
└── Opportunity
```

Service membership should be represented as metadata / relationships, not duplicated records.

## Service membership

Recommended values:

- army
- navy
- coast_guard
- air_force
- joint
- cross_service

For the UI, Navy and Coast Guard are presented together but retain distinct service tags internally.

## Cross-service specialist Atlases

Existing specialist Atlases should remain first-class analytical views rather than being absorbed into the service pages:

- Drones / UAS
- Counter-UAS
- Military Aerospace
- Future specialist defence Atlases as appropriate

Service pages should link to these where relevant.

## Data rules

1. Do not duplicate entities merely because they serve multiple services.
2. Preserve existing stable entity IDs and player slugs.
3. Preserve existing Atlas relationships wherever possible.
4. Add service membership through explicit fields / relationships.
5. Avoid inventing service assignment when evidence is uncertain.
6. Keep Coast Guard distinct in data even though it is grouped with Navy in navigation.
7. Keep specialist Atlases cross-linked rather than duplicated.
8. Keep procurement, dependencies and industrial opportunities as first-class data.
9. The service Atlases should be generated from the same source graph where practical.
10. Existing Defence content should be migrated, not discarded.

## Migration sequence

1. Add architecture metadata and service taxonomy.
2. Audit current Defence entities and relationships.
3. Assign service membership with evidence status.
4. Identify entities belonging to multiple services.
5. Build parent Defence Atlas navigation.
6. Build Army view.
7. Build Navy & Coast Guard view.
8. Build Air Force view.
9. Add cross-service intelligence layer.
10. Validate specialist Atlas links.
11. Validate static generation, SEO, canonical URLs and internal links.
12. Only then retire or redirect the old single-view Defence presentation.
