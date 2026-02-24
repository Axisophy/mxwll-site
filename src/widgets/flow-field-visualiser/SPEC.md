# Flow Field Visualiser — Specification
**Version:** 1.0
**Created:** 2026-02-23

## Brief
Create a visually engaging, performance-efficient particle system for site-wide use. Must run autonomously without user interaction.

## Design decisions
- 3D Simplex noise (not 2D Perlin) for more organic motion
- Embedded noise implementation to avoid external dependencies
- Fixed particle count and parameters (no user controls) for consistency
- Canvas 2D (not WebGL) for simplicity and compatibility
- Particle trails create sense of flow history

## Rejected approaches
- WebGL implementation: overkill for this use case, adds complexity
- External noise library: adds dependency, embedded version is self-contained
- User controls: would break site-wide consistency

## API Design
No props currently. Could be extended with:
- `particleCount?: number`
- `speed?: number`
- `trailLength?: number`
- `colorScheme?: 'light' | 'dark'`

## Visual design intent
Subtle, organic background motion. Should not compete with content. Dark particles on light background (or inverse).
