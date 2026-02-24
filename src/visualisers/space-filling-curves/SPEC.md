# Space-Filling Curves - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Primary mode animates recursive growth level by level (L = 1 to L = 8 or deeper) for Hilbert, Peano, and Moore curves.

Secondary mode demonstrates 1D-to-2D locality-preserving mapping by laying image or data samples along a Hilbert traversal.

## Design decisions
- Prioritise clear recursion transitions so each level is understandable.
- Support multiple curve families to compare traversal behaviour.
- Include locality demonstration because it connects the maths to practical data layout uses.
- Keep controls simple: curve type, recursion depth, animation speed.

## Implementation path
- Canvas 2D or SVG renderer with recursive path generation.
- Deterministic point-order output reused by both animation and locality-map mode.
- Mobile profile caps recursion depth to protect frame time.

## Rejected approaches
- Static final-only render: rejected because construction process is the key explanatory layer.
- Single curve family: rejected because comparison reveals structure differences more clearly.

## Data sources
- Procedural curve generation.
- Optional image or scalar field input for locality mapping demonstration.

## Visual design intent
The visual should feel precise and architectural. Each recursion step needs crisp continuity so the curve's path logic is easy to follow even at deeper levels.
