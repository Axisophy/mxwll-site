# Physarum - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Build a high-density slime mould simulation with three modes:
1. Pure aesthetic mode: no food sources, emergent network formation only.
2. Pathfinding mode: user places food sources and slime converges on efficient connecting networks.
3. Cosmic web mode: initialise particles from galaxy distribution data and evolve filaments that reconstruct large-scale structure.

## Design decisions
- Performance target is 500K+ agents minimum, with 1M+ on capable hardware.
- Apply graceful degradation by detecting GPU capability and scaling agent count, trail resolution, and update rate.
- Use dark background with bioluminescent trail palettes (cyan, amber, or monochrome white variants).
- Trail decay and diffusion are primary aesthetic controls and must be explicitly documented with tuned values once calibration is complete.
- Keep mode switching immediate and stable so behaviour differences are clear to users.

## Implementation path
- Preferred pipeline: WebGL2 compute via transform feedback.
- Alternative pipeline: WebGPU compute shaders, contingent on robust browser support.
- Fallback: Canvas 2D with significantly reduced agent counts and lower spatial resolution.
- Capability detection should run on load and choose a pipeline before simulation start.

## Rejected approaches
- CPU-only simulation at high agent counts: rejected due to frame time instability.
- WebGPU-only implementation: rejected because browser support remains inconsistent.
- One fixed palette: rejected because different modes benefit from different contrast and legibility profiles.

## Data sources
- Synthetic initial distributions for aesthetic and pathfinding modes.
- Cosmic web mode requires galaxy position datasets (source to be confirmed).

## Visual design intent
The simulation should feel alive, with fluid branching growth and persistent memory in the trail field. The visual language should support both scientific interpretation and ambient viewing without clutter.
