# Lissajous - Demo Specification

## Desktop demo
**Duration:** 50 seconds for one loop
**Camera behaviour:** Fixed view with staged transitions between table, trace, and harmonograph modes
**Transitions:** Ratio grid -> animated trace -> damped harmonograph decay

### Timeline
```text
0:00 - Frequency table appears with canonical low-order ratios
0:15 - Transition to animated 3:2 trace with component oscillators
0:30 - Switch to harmonograph mode with visible damping decay
0:46 - Fade to ratio table start state
```

## Mobile demo
**Duration:** 40-50 seconds
**Differences from desktop:** Fewer table cells and shorter harmonograph segment.

## Technical notes
- Demo parameter set should avoid near-degenerate flat-line cases.

## Current state
**Status:** Scaffolded only
**Location:** Demo behaviour documented in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Build parametric solver and shared renderer for all three views
