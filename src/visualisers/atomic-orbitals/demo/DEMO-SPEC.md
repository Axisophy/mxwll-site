# Atomic Orbitals - Demo Specification

## Desktop demo
**Duration:** 75 seconds
**Camera behaviour:** Slow orbital camera around each selected density cloud
**Transitions:** 1s -> 2p -> 3d -> Aufbau fill sequence -> simple bond overlap

### Timeline
```text
0:00 - 1s orbital with spherical density cloud
0:15 - 2p orbital with lobe structure
0:30 - 3d orbital with complex nodal structure
0:45 - Aufbau fill sequence overlays shell occupation
1:00 - Two-atom approach, sigma overlap demonstration
1:15 - Loop reset
```

## Mobile demo
**Duration:** 45-60 seconds
**Differences from desktop:** Lower raymarch steps, fewer orbital transitions, no live bonding overlap if performance is low.

## Technical notes
- Use quality tiers for raymarch sample count.
- Keep text overlays sparse for small screens.

## Current state
**Status:** Scaffolded only
**Location:** Demo flow defined in `demo/DEMO-SPEC.md`
**Next steps:** Implement orbital field evaluator, then volume integration pass
