# Brownian Motion - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Show two scales simultaneously:
1. Microscale collisions between many molecules and one larger tracer particle.
2. Macroscale random-walk trajectory traced over time.

## Key concepts
- Mean squared displacement grows linearly with time: `<r^2> = 2Dt`.
- Display live MSD graph alongside simulation.
- Multiple tracer particles reveal Gaussian ensemble spread despite random single paths.

## Historical framing
Include concise context from Einstein's 1905 Brownian analysis and its role in confirming atomic theory, including connection to Avogadro-number estimation.

## Implementation
- Canvas 2D with simple stochastic collision model.
- Real-time graph plotting for MSD verification.
- Good early completion candidate.

## Rejected approaches
- Path-only view with no microscale causes: rejected because mechanism becomes opaque.
- Single-particle-only mode: rejected because ensemble behaviour is crucial for statistical interpretation.

## Data sources
- Procedural simulation parameters.
- Optional historical constants for annotation.

## Visual design intent
Clear, didactic, and quantitative. The visual should connect noisy motion to measurable law.
