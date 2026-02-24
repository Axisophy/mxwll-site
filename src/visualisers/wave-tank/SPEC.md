# Wave Tank - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
WebGL fragment-shader wave simulation with:
- Click/tap anywhere to create wave sources.
- Multiple simultaneous sources for interference patterns.
- Boundaries (walls and slits) to demonstrate diffraction and reflection.
- Colour mapped amplitude showing positive and negative phase.
- Presets: single source, double-slit, wall reflection, resonant cavity.

## Design decisions
- Use diverging colour map: blue (trough) -> white (zero) -> red (crest) for immediate legibility.
- Expose wavelength and frequency controls.
- Double-slit preset is the primary explanation target and must show a clean interference fringe pattern.
- Real-time 60fps response is a core requirement rather than an enhancement.
- Interaction should remain simple: place source, adjust parameters, compare presets.

## Implementation path
- WebGL2 fragment shader solving the 2D wave equation each frame.
- Source injection and boundary masks as texture inputs to the solver.
- Adaptive resolution scaling for low-end/mobile hardware.
- Reference approach: `github.com/dionyziz/wave-experiment`.

## Rejected approaches
- CPU grid solver: rejected due to poor scaling at interactive resolutions.
- Monochrome amplitude map: rejected because positive/negative phase distinction is less legible.

## Data sources
- Procedural simulation, no external datasets required.

## Visual design intent
The simulation should feel laboratory-clear rather than decorative. Wave fronts, nodes, antinodes, and boundary effects need to be readable in seconds, especially in the double-slit scene.
