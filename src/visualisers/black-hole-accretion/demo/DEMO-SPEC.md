# Black Hole Accretion - Demo Specification

## Desktop demo
**Duration:** 90 seconds
**Camera behaviour:** Slow orbit from face-on to edge-on and back toward face-on
**Transitions:** Einstein ring emphasis -> lensing distortion sweep -> edge-on asymmetry hold

### Timeline
```text
0:00 - Face-on framing, Einstein ring clearly visible
0:25 - Camera begins orbital sweep around black hole
0:45 - Mid-angle lensing distortion and disc warping are emphasised
1:05 - Edge-on framing, approaching side brighter from Doppler beaming
1:20 - Return toward face-on framing
1:30 - Loop reset
```

## Mobile demo
**Duration:** 90 seconds
**Differences from desktop:** Pre-rendered video loop. Live raymarching disabled.

## Technical notes
- Desktop demo can use reduced internal resolution with upscale for stable frame time.
- Mobile serves encoded video fallback by default.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`
**Next steps:** Build raymarch prototype, then tune geodesic and disc shading passes
