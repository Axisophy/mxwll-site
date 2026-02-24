# Neuronal Firing - Demo Specification

## Desktop demo
**Duration:** 45 seconds
**Camera behaviour:** Slow drift around network with focus pulls to active regions
**Transitions:** Quiet background -> triggered cascade -> synchronised burst -> recovery

### Timeline
```text
0:00 - Low-level spontaneous firing
0:10 - Single strong trigger event initiates cascade
0:22 - Wave propagates across network
0:32 - Brief synchronised burst
0:40 - Activity decays to quiet baseline
0:45 - Loop reset
```

## Mobile demo
**Duration:** 45 seconds
**Differences from desktop:** Reduced neuron count (~500) with same narrative pattern.

## Technical notes
- Activity intensity should be bounded to avoid pure white saturation.

## Current state
**Status:** Scaffolded only
**Location:** Demo sequence documented in `demo/DEMO-SPEC.md`
**Next steps:** Implement graph generator, threshold dynamics, and pulse shaders
