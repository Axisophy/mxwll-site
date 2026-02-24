# Phyllotaxis - Demo Specification

## Desktop demo
**Duration:** 30 seconds
**Camera behaviour:** Begin centred close-up, then zoom out to full flower pattern
**Transitions:** Seed growth -> zoom reveal -> angle morph -> spiral highlighting

### Timeline
```text
0:00 - Seeds begin appearing from centre
0:08 - Growth slows and camera zooms out
0:14 - Full sunflower pattern visible
0:18 - Angle morph from 90 degrees toward golden angle
0:24 - Spiral arm overlays appear and count labels update
0:30 - Reset
```

## Mobile demo
**Duration:** 30 seconds
**Differences from desktop:** Same narrative with reduced seed count and simpler overlays.

## Technical notes
- Maintain smooth animation at 375px width by capping seed count dynamically.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`
**Next steps:** Implement seed placement core and spiral-detection overlays
