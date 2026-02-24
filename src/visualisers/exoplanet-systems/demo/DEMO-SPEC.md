# Exoplanet Systems - Demo Specification

## Desktop demo
**Duration:** 75 seconds for one loop
**Camera behaviour:** Slow orbital camera in TRAPPIST-1 view, then fixed timeline view
**Transitions:** Showcase view -> comparison overlay -> discovery timeline build

### Timeline
```text
0:00 - TRAPPIST-1 system appears with labelled resonant orbits
0:20 - Habitable zone and Earth-reference orbit overlay fade in
0:35 - Camera recentres and transitions to catalogue timeline
0:38 - Discovery timeline animates from 1992 toward present
1:10 - Hold on current catalogue state, then fade to start
```

## Mobile demo
**Duration:** 45-60 seconds
**Differences from desktop:** Reduced labels, simplified camera movement, and shorter timeline segment.

## Technical notes
- Timeline animation should be deterministic and based on sorted discovery year.
- TRAPPIST-1 segment should remain the opening anchor on all devices.

## Current state
**Status:** Scaffolded only
**Location:** Demo behaviour documented in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Define data schema, build orrery prototype, then add timeline renderer
