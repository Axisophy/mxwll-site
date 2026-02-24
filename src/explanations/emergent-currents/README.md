# Emergent Currents
**Status:** Complete
**Last Updated:** 2026-02-23
**Location in site:** `/work/emergent-currents`
**Type:** Video + Interactive Widget

## What it is
Video-based explainer showing particles tracing a divergence-free curl noise field. Demonstrates how layered fractal noise creates organic, fluid-like motion patterns.

## Format
- Pre-rendered video (generated from Python/Jupyter notebooks)
- Interactive FlowFieldVisualiser widget (see src/widgets/flow-field-visualiser)

## Source generation
**Pre-rendered video**: Source generation code lives in Jupyter notebooks — not in this repo. Python/Jupyter source should be located and documented separately.

**Interactive component**: The FlowFieldVisualiser is implemented as a React/Canvas2D widget with embedded Simplex noise.

## Current state
- Page structure complete
- Video placeholder present (needs actual video file)
- FlowFieldVisualiser functional (migrated to src/widgets/)
- Content placeholder text needs finalization
