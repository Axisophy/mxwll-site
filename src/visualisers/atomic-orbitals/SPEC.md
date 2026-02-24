# Atomic Orbitals - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Each orbital (1s, 2s, 2p, 3d, etc.) appears as a probability density cloud. Denser regions indicate higher probability of electron detection.

Views:
1. Orbital browser grid with quantum numbers (n, l, m), selectable into 3D view.
2. Building atoms view showing orbital filling via Aufbau ordering.
3. Bonding view where two atoms approach and orbital overlap forms sigma and pi bonding states.

## Rendering approach
- Volume raymarch through 3D probability density field.
- Sample `psi^2(r,theta,phi)` along ray and accumulate density.
- Map probability density to opacity and colour.
- Include optional 90% probability isosurface as reference shell.

## Explanation targets
- Planetary electron orbit diagrams are not physically accurate.
- Electrons are described by probability density clouds until measurement.
- Orbital shape depends on angular momentum quantum number `l`.
- s orbitals are spherical, p orbitals are lobed, d orbitals are more complex.

## Technical approach
- Compute `psi(r,theta,phi) = R(r) * Y(theta,phi)` in shader path.
- Use real spherical harmonics for angular term.
- Use radial wave functions for each `(n,l)` state.
- GPU raymarch accumulates volume density per pixel.

## Rejected approaches
- Particle sprite approximations for clouds: rejected due to weaker scientific readability.
- Static meshes only: rejected because density interpretation benefits from volumetric rendering.

## Data sources
- Procedural orbital equations.
- Optional reference constants from standard quantum mechanics tables.

## Visual design intent
Clinical and clear. Visuals should privilege explanatory precision over decorative effects.
