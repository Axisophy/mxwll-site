# CMB Explorer - Demo Specification

## Desktop demo
**Duration:** 70 seconds for one loop
**Camera behaviour:** Slow sphere rotation in globe mode, then fixed framing in harmonic mode
**Transitions:** Globe overview -> projection switch -> harmonic build -> patch zoom

### Timeline
```text
0:00 - 3D globe with full-sky CMB texture rotates slowly
0:20 - Projection toggle demonstration (3D to Mollweide and back)
0:30 - Harmonic build begins from low l values
0:50 - Full-resolution map restored
0:58 - "Your patch" sample zoom to selected sky location
1:08 - Fade back to globe start state
```

## Mobile demo
**Duration:** 45-60 seconds
**Differences from desktop:** Fewer projection transitions and reduced harmonic steps.

## Technical notes
- Demo should use preselected sample date for deterministic "Your patch" segment.
- Avoid loading highest-resolution tiles on low-capability devices.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Build preprocessing script, globe renderer, and harmonic asset loader
