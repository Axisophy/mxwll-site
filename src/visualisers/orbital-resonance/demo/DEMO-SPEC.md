# Orbital Resonance - Demo Specification

## Desktop demo
**Duration:** 60 seconds
**Camera behaviour:** Fixed top-down orbital diagram
**Transitions:** Galilean 1:2:4 -> ratio explorer examples -> TRAPPIST-1 near-resonance

### Timeline
```text
0:00 - Galilean system with 1:2:4 overlays
0:20 - Ratio explorer cycles 1:2, 2:3, 3:5
0:42 - TRAPPIST-1 near-resonance chain overview
0:58 - Reset to Galilean start
```

## Mobile demo
**Duration:** 45-60 seconds
**Differences from desktop:** Fewer ratio transitions and reduced label density.

## Technical notes
- Keep trace persistence short enough to prevent visual clutter.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`
**Next steps:** Build orbital timing core and trace renderer
