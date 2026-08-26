# Defence Atlas — Route & UI Specification

## Parent

`/research/pillars/defence/`

Purpose: Defence Atlas home and service selector.

Hero:

**Defence Atlas**

*India's Defence Industrial System*

Suggested thesis:

> India is moving from platform assembly toward a broader defence industrial system. The strategic question is no longer only who builds the platform, but who controls the engines, electronics, sensors, weapons, materials and manufacturing capacity underneath it.

Primary cards:

- **Army Atlas** — Land warfare and the industrial system behind it.
- **Navy & Coast Guard Atlas** — Maritime capability, shipbuilding and underwater systems.
- **Air Force Atlas** — Air power, aerospace systems and critical dependencies.

Secondary cross-service navigation:

- Unmanned Warfare
- Counter-UAS
- Missiles
- Defence Electronics
- Military Aerospace
- Propulsion
- C4ISR / EW

## Army

Route: `/research/pillars/defence/army/`

Page sequence:

1. Breadcrumb
2. Service hero
3. Service metrics
4. Capability map
5. Major platforms
6. Fires and weapons
7. Infantry systems
8. Unmanned / counter-UAS
9. Electronic warfare / C4ISR
10. Industrial base
11. Procurement programmes
12. Critical dependencies / chokepoints
13. Industrial clusters
14. Opportunities
15. Cross-service connections
16. Specialist Atlas links

Metrics should be generated from data, not hard-coded:

- platforms
- Indian manufacturers
- foreign suppliers
- relationships
- critical dependencies
- active procurement programmes

## Navy & Coast Guard

Route: `/research/pillars/defence/navy-coast-guard/`

Page sequence:

1. Breadcrumb
2. Service hero
3. Navy / Coast Guard selector or split metrics
4. Fleet map / fleet categories
5. Ship systems
6. Naval weapons
7. Naval aviation
8. Underwater warfare
9. Shipbuilding industrial base
10. Coast Guard industrial base
11. Procurement
12. Critical dependencies / chokepoints
13. Industrial clusters
14. Opportunities
15. Cross-service connections
16. Specialist Atlas links

Internally retain separate service tags for Navy and Coast Guard.

## Air Force

Route: `/research/pillars/defence/air-force/`

Page sequence:

1. Breadcrumb
2. Service hero
3. Service metrics
4. Combat aircraft
5. Transport / mobility
6. Unmanned air power
7. Air weapons
8. Air defence
9. Aerospace industrial base
10. Propulsion / engine dependency map
11. Avionics / sensors / EW
12. MRO
13. Procurement
14. Critical dependencies / chokepoints
15. Industrial clusters
16. Opportunities
17. Cross-service connections
18. Specialist Atlas links

## Shared UI patterns

Use the existing Atlas visual language and components where appropriate. The service pages should feel like a coherent family with different content, not three unrelated designs.

Common components:

- `AtlasNav`
- breadcrumb / JSON-LD pattern
- service metrics strip
- capability stack
- entity chips / links
- chokepoint table
- player role groups
- cross-service edge list
- specialist Atlas links

## Service selector

Every service page should provide a compact selector:

```text
Defence Atlas
[Army] [Navy & Coast Guard] [Air Force]
```

The parent Defence page should be one click away.

## Cross-service section

Every service page should contain a final section titled:

**Where this service connects**

Show only meaningful cross-service relationships, for example:

```text
Army → Counter-UAS
Army → Missiles
Army → Defence Electronics
Navy → Military Aerospace
Navy → Propulsion
Air Force → Military Aerospace
Air Force → Counter-UAS
Air Force → Defence Electronics
```

## Entity navigation

All entity names should link to the existing stable player route:

`/research/players/{playerSlug}/`

Do not create service-specific duplicate entity URLs.

## Specialist Atlas integration

Use specialist links contextually.

Examples:

- Army UAS section → Drones / UAS Atlas
- Army counter-UAS section → Counter-UAS Atlas
- Navy unmanned section → Drones / UAS Atlas
- Air Force unmanned section → Drones / UAS Atlas
- Air Force aerospace section → Military Aerospace Atlas

## SEO

Each service page must have:

- unique title
- unique meta description
- canonical URL
- breadcrumb JSON-LD
- Dataset JSON-LD where appropriate
- relevant service / capability keywords
- internal links to entity pages and specialist Atlases

Do not keyword-stuff.

## URL policy

New canonical URLs:

```text
/research/pillars/defence/
/research/pillars/defence/army/
/research/pillars/defence/navy-coast-guard/
/research/pillars/defence/air-force/
```

If an existing single Defence page has the same parent URL, transform it into the parent Defence Atlas rather than creating a competing URL.

If old service-specific URLs are discovered during implementation, preserve them through redirects rather than silently removing them.

## Mobile behaviour

The service selector and capability navigation must remain usable on narrow screens. Do not rely on wide tables for the primary information architecture.

Tables such as chokepoints and procurement may scroll horizontally where necessary, but key analytical conclusions must remain visible without horizontal scrolling.

## Accessibility

- Semantic headings.
- Descriptive link text.
- Keyboard-accessible service navigation.
- Do not use colour alone to communicate Indian / foreign / contested status.
- Preserve visible focus states.
