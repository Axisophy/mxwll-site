# Lagrange Points - Demo Specification

## Desktop demo
**Duration:** 70 seconds
**Camera behaviour:** Start in potential surface view, then transition to top-down particle flow
**Transitions:** Earth-Sun L-point tour -> particle release -> Trojan clustering highlight

### Timeline
```text
0:00 - Potential surface with L1-L5 labels
0:20 - Sweep across L1/L2 instability regions
0:35 - Switch to particle flow mode with random seeding
0:55 - Highlight L4/L5 clustering and Trojan examples
1:10 - Reset
```

## Mobile demo
**Duration:** 45-60 seconds
**Differences from desktop:** Reduced particle count and abbreviated point tour.

## Technical notes
- Ensure L-point labels remain readable at 375px width.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`
**Next steps:** Implement rotating-frame potential solver and particle advection
