# Phyllotaxis - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Animate seed placement one point at a time using a rotational increment and radial growth law. Show spiral arms emerging naturally and compare golden-angle packing against non-optimal angles.

## Interactive exploration
- Angle control slider with focus on golden value near 137.5 degrees.
- Non-golden angles demonstrate spoke patterns and poorer packing.
- Include near-miss comparisons (for example 137 and 138 degrees).

## Spiral counting
- Highlight clockwise and anticlockwise arm families in distinct colours.
- Count visible spirals and relate them to consecutive Fibonacci numbers.

## Nature connection
Provide side-by-side reference imagery links or placeholders for sunflower, pine cone, and succulent patterns.

## Implementation
- Canvas 2D point renderer.
- Very low computational overhead.
- Strong candidate for early completion.

## Rejected approaches
- Static single frame only: rejected because growth process is explanatory.
- Heavy 3D rendering: rejected because 2D packing is sufficient and clearer.

## Data sources
- Procedural geometry.
- Optional curated reference photos for contextual comparison.

## Visual design intent
Organic but precise. The viewer should feel the inevitability of efficient packing at the golden angle.
