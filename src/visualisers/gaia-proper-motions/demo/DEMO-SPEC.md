# Gaia Proper Motions - Demo Specification

## Desktop demo
**Duration:** 65 seconds for one loop
**Camera behaviour:** Fixed sky framing with controlled timeline progression
**Transitions:** Present-day sky -> accelerated future drift -> accelerated past drift -> reset

### Timeline
```text
0:00 - Present-day constellation overlay baseline
0:12 - Accelerate toward +100,000 years with subtle trails enabled
0:32 - Hold on deformed constellations and highlight Barnard's Star motion
0:40 - Reverse through present to -100,000 years
0:58 - Return to present-day alignment and fade to loop start
```

## Mobile demo
**Duration:** 45-55 seconds
**Differences from desktop:** Reduced labelled stars and shorter timeline span for readability.

## Technical notes
- Use precomputed timeline checkpoints for stable playback.
- Keep star count and trail length capability-scaled on mobile devices.

## Current state
**Status:** Scaffolded only
**Location:** Demo behaviour documented in `demo/DEMO-SPEC.md`; no implementation yet
**Next steps:** Integrate proper motion transforms into shared renderer and add timeline controls
