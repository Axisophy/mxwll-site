# Space-Filling Curves - Demo Specification

## Desktop demo
**Duration:** 55 seconds for one loop
**Camera behaviour:** Fixed frame with progressive recursion animation
**Transitions:** Hilbert growth -> Peano growth -> locality mapping reveal

### Timeline
```text
0:00 - Hilbert curve grows from L1 to L8
0:20 - Transition to Peano curve with level-by-level reveal
0:38 - Switch to locality mapping demo on sample image/data
0:52 - Fade and return to Hilbert L1
```

## Mobile demo
**Duration:** 40-50 seconds
**Differences from desktop:** Lower maximum recursion depth and one curve family only on low-end devices.

## Technical notes
- Use deterministic recursion keyframes for smooth looping.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Implement recursive generators and staged animation controller
