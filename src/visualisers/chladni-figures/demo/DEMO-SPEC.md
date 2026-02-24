# Chladni Figures - Demo Specification

## Desktop demo
**Duration:** 60 seconds for one loop
**Camera behaviour:** Fixed plate view, no camera movement
**Transitions:** Frequency sweep through curated resonant intervals with occasional locked-mode holds

### Timeline
```text
0:00 - Start at low frequency with sparse nodal structure
0:10 - Sweep into first resonance, particle accumulation intensifies
0:22 - Hold on stable (m, n) mode for inspection
0:30 - Resume sweep through mid frequencies
0:45 - Brief second hold on high-complexity mode
0:55 - Fade to low-frequency start state
```

## Mobile demo
**Duration:** 45-60 seconds
**Differences from desktop:** Lower particle count, fewer mode holds, and narrower sweep range to preserve frame stability.

## Technical notes
- Demo uses deterministic frequency keyframes for repeatable playback.
- Microphone input remains disabled in autonomous demo mode.
- Pattern labels should remain readable at minimum 375px viewport width.

## Current state
**Status:** Scaffolded only
**Location:** Demo behaviour documented in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Implement Chladni field solver, particle dynamics, and timed sweep controller
