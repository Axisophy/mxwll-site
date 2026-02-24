# Brownian Motion - Demo Specification

## Desktop demo
**Duration:** 40 seconds
**Camera behaviour:** Split-screen fixed view (microscale left, trajectory and MSD right)
**Transitions:** Collision field start -> trajectory expansion -> MSD linear trend highlight

### Timeline
```text
0:00 - Molecule collisions begin and tracer starts jittering
0:12 - Random walk path extends and broadens
0:24 - Multiple tracers appear to show ensemble spread
0:32 - MSD trend line overlay highlights linear growth
0:40 - Reset
```

## Mobile demo
**Duration:** 30-40 seconds
**Differences from desktop:** Fewer molecules and simplified MSD chart with single tracer.

## Technical notes
- Keep collision count capability-scaled for stable frame rates.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`
**Next steps:** Implement stochastic collision model and live MSD computation
