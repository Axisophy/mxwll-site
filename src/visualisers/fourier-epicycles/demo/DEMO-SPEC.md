# Fourier Epicycles - Demo Specification

## Desktop demo
**Duration:** 60 seconds for one full loop
**Camera behaviour:** Fixed orthographic view with no camera movement
**Transitions:** 3-4 preset paths rotate through a cycle of assemble, trace, pause, dissolve

### Timeline
```text
0:00 - Preset 1 selected, epicycles begin assembling from largest amplitudes
0:10 - Full path trace becomes legible, epicycle chain remains visible
0:14 - Brief hold on completed path
0:16 - Path dissolves, transition to preset 2
0:18 - Preset 2 assembly begins
0:30 - Preset 2 hold and dissolve
0:32 - Preset 3 assembly begins
0:44 - Preset 3 hold and dissolve
0:46 - Optional preset 4 assembly begins
0:58 - Final hold, dissolve to loop start
```

## Mobile demo
**Duration:** 60 seconds
**Differences from desktop:** Use 1-2 preset paths and reduced circle count to protect frame rate and readability.

## Technical notes
- Demo mode runs autonomously with no user input.
- Shared rendering and Fourier core should be reused from `core/`.
- Coefficient count should scale by viewport and device capability.

## Current state
**Status:** Scaffolded only
**Location:** Demo spec defined in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Implement path sampler, Fourier solver, and timed state machine for loop playback
