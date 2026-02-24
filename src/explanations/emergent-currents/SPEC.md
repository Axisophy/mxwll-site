# Emergent Currents — Specification
**Version:** 1.0
**Created:** 2026-02-23

## Brief
Create an accessible explainer for curl noise and divergence-free vector fields. Target audience: creative technologists and general audiences interested in generative systems.

## Design decisions
- Two-part approach: pre-rendered video for polished demonstration, interactive widget for hands-on exploration
- Curl noise chosen over raw Perlin/Simplex because it guarantees divergence-free fields (particles never bunch up or disperse unnaturally)
- Layered octaves create visually interesting complexity

## Rejected approaches
- Pure interactive-only approach: rendering quality not high enough for professional showcase
- Pure video-only approach: doesn't allow audience to explore parameters themselves

## Data sources
N/A - procedurally generated

## Visual design intent
Organic, fluid motion. Visually mesmerizing but mathematically grounded. Dark background to emphasize particle trails.
