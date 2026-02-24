# Physarum - Demo Specification

## Desktop demo
**Duration:** 60 seconds for one loop
**Camera behaviour:** Fixed top-down view with subtle scale breathing only if performance permits
**Transitions:** Rotate through aesthetic, pathfinding, and cosmic web mode snapshots

### Timeline
```text
0:00 - Pure aesthetic mode initialises and begins emergent growth
0:20 - Transition to pathfinding mode with pre-placed food nodes
0:40 - Transition to cosmic web seeded distribution
0:58 - Fade trails and reset to aesthetic start state
```

## Mobile demo
**Duration:** 45-60 seconds
**Differences from desktop:** Reduced agent count, smaller trail buffer, and optional omission of cosmic web mode on low-end devices.

## Technical notes
- Demo loop should use preconfigured parameter presets rather than exposing controls.
- Capability detection must occur before selecting agent counts.
- If mode changes stutter, prefer fewer modes over unstable playback.

## Current state
**Status:** Scaffolded only
**Location:** Demo behaviour documented in `demo/DEMO-SPEC.md`; no runtime implementation yet
**Next steps:** Define capability tiers, implement GPU pipeline bootstrap, and add timed mode transitions
