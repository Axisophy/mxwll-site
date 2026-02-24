# Wave Tank - Demo Specification

## Desktop demo
**Duration:** 60 seconds for one loop
**Camera behaviour:** Fixed top-down field view
**Transitions:** Autonomous preset cycle from simple to complex phenomena

### Timeline
```text
0:00 - Single source waves radiate across open field
0:15 - Two-source interference pattern forms stable fringes
0:30 - Double-slit diffraction preset with pronounced interference bands
0:45 - Resonant cavity standing-wave structure appears
0:58 - Fade and reset to single-source start
```

## Mobile demo
**Duration:** 45-60 seconds
**Differences from desktop:** Simplified static preset display with tap-to-create source interaction and reduced resolution.

## Technical notes
- Demo mode should disable dense user interactions and run deterministic preset keyframes.
- Double-slit preset must remain in the loop even on reduced capability devices.

## Current state
**Status:** Scaffolded only
**Location:** Demo behaviour defined in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Implement shader solver, source injection, and preset state machine
