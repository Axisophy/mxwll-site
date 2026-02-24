# Exoplanet Systems - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Two coordinated views:
1. TRAPPIST-1 showcase with real orbital periods, resonance ratios, habitable zone overlay, and inner-solar-system comparison.
2. Full catalogue browser with 5,000+ exoplanets shown as a discovery timeline, filterable by discovery method, size, and habitable-zone relationship.

## Design decisions
- TRAPPIST-1 view must show orbital resonance numerically (for example 8:5:3:2 patterning).
- Include habitable zone as a shaded annulus.
- Include Earth orbit as a reference ring for scale.
- Discovery timeline animates chronologically from 1992 to present.
- Use real archive values for orbital period, semi-major axis, and planet radius.

## Implementation path
- Three.js or React Three Fiber for the 3D orrery view.
- Canvas 2D for the discovery timeline view.
- Data pipeline converts NASA CSV export into project JSON for runtime loading.

## Rejected approaches
- Fully artistic synthetic systems only: rejected because real data credibility is central.
- Single-view implementation: rejected because system dynamics and discovery history answer different questions.

## Data sources
- NASA Exoplanet Archive CSV exports, transformed into cached JSON assets.

## Visual design intent
The visual language should balance scientific faithfulness with readability. TRAPPIST-1 should feel compact and surprising, while the catalogue timeline should communicate the acceleration of discovery over time.
