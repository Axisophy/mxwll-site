# Lagrange Points - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Two linked representations:
1. Effective gravitational potential surface in rotating frame, with Lagrange points as characteristic extrema/saddle structures.
2. Particle flow simulation where test particles move along potential gradients and collect or disperse by point stability.

## Explanation targets
- L1 and L2 are unstable but operationally useful (JWST, SOHO contexts).
- L3 is unstable opposite primary body.
- L4 and L5 are stable Trojan regions 60 degrees ahead/behind secondary.
- Stability explanation includes Coriolis effects in rotating frame.

## Real examples
Include known Trojan populations and Earth Trojan 2010 TK7 as contextual reference.

## Implementation approach
- Potential grid evaluation in rotating frame.
- Surface rendering for 3D potential mode.
- Thousands of test particles advected by effective-force field.
- Switchable system presets (Earth-Sun and Earth-Moon).

## Rejected approaches
- Point-only diagram without field context: rejected because stability intuition is weaker.
- Static labels only: rejected because particle flow best shows stable vs unstable behaviour.

## Data sources
- Standard mass and distance constants for two-body systems.
- NASA reference positions for Trojan examples.

## Visual design intent
Scientific and navigational. The visual should feel like a dynamical map rather than decorative art.
