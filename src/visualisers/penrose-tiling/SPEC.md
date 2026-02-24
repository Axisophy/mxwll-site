# Penrose Tiling - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Generate Penrose tilings with deflation recursion and animate complexity growth iteration by iteration.

Modes:
1. Deflation animation from seed tile through repeated subdivision.
2. Infinite pan and zoom exploration mode.
3. Golden-ratio relationship reveal overlays.

## Explanation targets
- Why Penrose tilings are aperiodic and never translationally repeating.
- Connection to quasicrystals and fivefold symmetry in real materials.
- Inflation and deflation self-similarity without periodic repetition.

## Implementation
- Canvas 2D or SVG implementation.
- Deflation algorithm with stable topology tracking.
- Interaction model includes pan, zoom, and iteration controls.

## Rejected approaches
- Random tiling approximations: rejected because rule-driven aperiodicity is central.
- Static final pattern only: rejected because recursive growth explains structure.

## Data sources
- Procedural generation only.

## Visual design intent
Crisp, mathematical, and intricate. Tile boundaries should remain clear at all zoom levels.
