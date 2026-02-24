# Boids - Demo Specification

## Desktop demo
**Duration:** 60 seconds for one loop
**Camera behaviour:** Fixed top-down flock field
**Transitions:** Sparse school -> dense murmuration -> predator panic

### Timeline
```text
0:00 - Sparse fish-school preset with wide spacing
0:20 - Transition to dense murmuration with tighter cohesion
0:40 - Predator enters and flock exhibits evasive scattering
0:57 - Predator exits, fade and reset to sparse state
```

## Mobile demo
**Duration:** 45-55 seconds
**Differences from desktop:** Lower agent count and shorter predator segment.

## Technical notes
- Demo uses fixed preset values rather than interactive sliders.
- Capability detection should choose agent count tier before simulation starts.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Implement agent solver with spatial partitioning and preset scheduler
