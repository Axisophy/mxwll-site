# Roche Limit - Demo Specification

## Desktop demo
**Duration:** 120 seconds
**Camera behaviour:** Slow orbital camera with occasional zoom-in at disruption onset
**Transitions:** Stable orbit -> inward decay -> disintegration -> ring stabilisation

### Timeline
```text
0:00 - Moon stable beyond Roche limit
0:25 - Orbit begins decaying inward
0:50 - Tidal bulge clearly visible
1:05 - Roche limit crossing and first particle escape
1:25 - Major fragmentation and ring stream formation
1:55 - Ring settles and loop resets
```

## Mobile demo
**Duration:** 120 seconds
**Differences from desktop:** Reduced particle count to ~1000 with same narrative beats.

## Technical notes
- Narrative timing should be deterministic for consistent educational playback.
- Critical-radius overlay remains visible throughout.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`
**Next steps:** Build core particle solver and tidal-force visual overlays
