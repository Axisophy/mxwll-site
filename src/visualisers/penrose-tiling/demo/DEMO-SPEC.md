# Penrose Tiling - Demo Specification

## Desktop demo
**Duration:** 55 seconds
**Camera behaviour:** Zoom out as deflation depth increases
**Transitions:** Seed tile -> recursive deflation -> golden-ratio overlay

### Timeline
```text
0:00 - Seed tile initial state
0:12 - Deflation level 1-3 progression
0:28 - Deflation level 4-6 with zoom-out
0:42 - Golden-ratio guides overlay
0:55 - Reset
```

## Mobile demo
**Duration:** 40-50 seconds
**Differences from desktop:** Lower max deflation depth and simplified overlays.

## Technical notes
- Keep tile stroke weight adaptive with zoom.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`
**Next steps:** Implement deflation engine and zoom-safe renderer
