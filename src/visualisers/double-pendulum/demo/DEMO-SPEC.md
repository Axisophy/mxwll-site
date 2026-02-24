# Double Pendulum - Demo Specification

## Desktop demo
**Duration:** 30 seconds per cycle
**Camera behaviour:** Fixed dual-panel layout with real-space and phase-space visible throughout
**Transitions:** Start synchronised, diverge chaotically, then hard reset to synchrony

### Timeline
```text
0:00 - Reset all pendulums to synchronised initial state
0:03 - Small perturbations begin to separate trajectories
0:10 - Divergence is visible in trails and synchrony meter drops
0:20 - Strongly chaotic spread across both views
0:28 - Prepare reset, fade trails
0:30 - Instant reset and loop restart
```

## Mobile demo
**Duration:** 30 seconds
**Differences from desktop:** Main view only, reduced N to 10 pendulums, simplified synchrony indicator.

## Technical notes
- Phase space remains active throughout desktop loop.
- Synchrony meter should be monotonic within each cycle where practical.
- Reset must clear trail buffers deterministically.

## Current state
**Status:** Scaffolded only
**Location:** Demo timeline documented in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Implement RK4 solver, dual-view renderer, and synchrony metric calculation
