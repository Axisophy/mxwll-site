# Tectonic Drift - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Render Earth as sphere with tectonic plates as Voronoi regions that drift and interact through geological time.

Timeline anchors:
- 250 Ma: Pangea
- 200 Ma: rifting begins
- 150 Ma: Atlantic opening
- 65 Ma: India migrating north
- Present day
- +50 Ma: Mediterranean closure trend
- +250 Ma: Pangea Proxima scenario

## Visual representation
- Ocean with depth-shaded blue gradients.
- Continents with terrain-oriented colour treatment.
- Plate boundaries highlighted by type: ridge, trench, transform.
- Mountain growth at convergent zones over time.
- Seafloor age colouring: young warm near ridges, old cool farther away.

## Controls
- Time scrubber from -250 Ma to +250 Ma.
- Play and pause for autonomous drift animation.

## Data
Use published palaeogeographic reconstructions (for example GPlates-derived data) or a simplified keyframe approximation for initial release.

## Implementation
- Three.js sphere.
- Plate keyframe interpolation between known epochs.
- Voronoi boundary lines rendered as globe-conforming geometry.

## Rejected approaches
- Flat map only: rejected because spherical context is central to plate-motion understanding.
- Purely artistic random drift: rejected because timeline credibility matters.

## Data sources
- GPlates-compatible reconstructions or simplified derived datasets.

## Visual design intent
Geological and temporal clarity first. The viewer should read Earth history as continuous motion, not static snapshots.
