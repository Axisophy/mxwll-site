# Tectonic Drift - Demo Specification

## Desktop demo
**Duration:** 80 seconds
**Camera behaviour:** Slow globe rotation with timeline-led transitions
**Transitions:** Pangea -> breakup -> present -> future projection

### Timeline
```text
0:00 - Pangea baseline at -250 Ma
0:18 - Rifting progression and Atlantic opening
0:38 - Mid-Cenozoic reconfiguration and India collision context
0:55 - Present-day plate map and active boundaries
1:05 - Future projection toward Pangea Proxima scenario
1:20 - Reset
```

## Mobile demo
**Duration:** 50-60 seconds
**Differences from desktop:** Reduced annotation density and fewer intermediate timeline stops.

## Technical notes
- Boundary type colours must maintain contrast against ocean shading.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`
**Next steps:** Build plate keyframe loader and globe interpolation system
