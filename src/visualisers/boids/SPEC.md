# Boids - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
WebGL or Canvas simulation of flocking agents with real-time adjustable rule strengths:
- Separation
- Alignment
- Cohesion

Optional predator agent introduces evasive dynamics.

Presets: sparse fish school, dense murmuration, and panicking flock with predator active.

Explanation target: three local rules produce complex global behaviour without central coordination.

## Design decisions
- Target 1,000-5,000 agents at 60fps depending on hardware.
- Make rule sliders responsive enough that behavioural changes appear immediately.
- Predator mode is optional but should clearly alter collective dynamics.
- Provide clear colour/shape contrast between flock and predator.

## Implementation path
- Start with Canvas 2D for deterministic behaviour tuning.
- Move to WebGL if higher agent counts are required.
- Spatial partitioning (grid or quadtree) is recommended to control neighbour search cost.

## Rejected approaches
- Fixed preset-only playback: rejected because the explanatory core is parameter manipulation.
- High-detail boid meshes: rejected because simple glyphs preserve performance and legibility.

## Data sources
- Procedural simulation only, no external datasets required.

## Visual design intent
The piece should foreground collective behaviour. Individual agents remain minimal, while motion patterns and transitions between regimes are visually obvious.
