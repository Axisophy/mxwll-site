# Lissajous - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Three views:
1. Frequency table grid showing Lissajous curves for simple ratios from 1:1 through 5:4.
2. Animated drawing view showing the curve trace and its component oscillators.
3. Harmonograph mode with damping so trajectories decay toward the centre.

User controls include frequency ratio, phase offset, damping factor, draw speed, and colour.

## Design decisions
- Canvas 2D is sufficient and preferred for rapid, reliable iteration.
- Ratio table should prioritise clarity of symmetry and closure patterns.
- Animated mode includes component indicators to connect motion to resulting geometry.
- Harmonograph damping should feel physically plausible rather than purely decorative.

## Implementation path
- Parametric solver for `x(t)` and `y(t)` with configurable frequencies, phase, and damping.
- Reusable draw loop for table previews and full-size interactive view.
- Mobile profile with reduced trail length and lower redraw density.

## Rejected approaches
- 3D rendering stack: rejected because 2D parametric behaviour is the main explanatory content.
- Single view only: rejected because table, trace, and damping each explain different aspects.

## Data sources
- Procedural generation only, no external datasets required.

## Visual design intent
The piece should feel like a precision drawing instrument. Geometry must remain crisp, with controls that make harmonic relationships legible at a glance.
