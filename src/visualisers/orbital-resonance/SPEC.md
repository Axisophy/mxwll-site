# Orbital Resonance - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Show bodies orbiting at relative periods and draw connective traces to reveal resonance geometry.

Views:
1. Galilean resonance with Io, Europa, Ganymede in 1:2:4 ratio.
2. Resonance explorer with adjustable ratios (1:2, 1:3, 2:3, 3:5, etc.).
3. TRAPPIST-1 near-resonance chain overview.

## Explanation targets
- Resonance is a dynamical trap, not coincidence.
- Tidal forcing in resonant systems can drive heating (Io volcanism).
- Simple ratios produce closed patterns, irrational ratios do not.
- Mathematical connection to harmonic intervals in music (1:2 octave, 2:3 fifth).

## Implementation
- Canvas 2D orbital renderer and trace accumulator.
- Ratio controls with real-time path redraw.
- Low computational complexity, suitable as early completion candidate.

## Rejected approaches
- 3D-only first implementation: rejected because 2D traces are clearer for pattern recognition.
- No-trace mode as default: rejected because the trace is the explanatory core.

## Data sources
- Real period ratios for Galilean and TRAPPIST-1 modes.
- Procedural ratio input for explorer mode.

## Visual design intent
Precise, geometric, and musical in pacing. Patterns should feel mathematically inevitable.
