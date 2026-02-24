# Fourier Epicycles - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Build two coordinated modes:
1. Preset paths mode for autonomous demo loops, including MXWLL logo forms, scientific symbols, and animal silhouettes.
2. Interactive mode where the user draws a path and watches epicycle reconstruction.

Both modes should make Fourier decomposition legible and aesthetically strong.

## Design decisions
- Circles are visually prominent and carry frequency labels.
- Show the live epicycle chain and the accumulated completed path at the same time.
- Support variable animation speed, from slow explanatory playback to fast aesthetic playback.
- Use MXWLL Electric Blue for the traced drawing path, with lighter tones for circles and guides.
- Preserve continuity between demo and interactive modes so behaviour and styling feel like one system.

## Implementation path
- Rendering target: Canvas 2D first, with WebGL as an optional upgrade if performance or styling requires it.
- Core maths: sample 2D paths into ordered points, map to complex values, apply FFT/DFT, sort by amplitude, animate rotating vectors.
- Sampling strategy: define fixed resampling count per path to keep reconstruction quality consistent across inputs.
- Interaction reference: `jezzamon.com/fourier` for pacing and control patterns.

## Rejected approaches
- Static-only reconstruction with no animated circles: rejected because it hides the mechanism.
- Path-only output with circles hidden: rejected because it weakens educational value.
- Single fixed playback speed: rejected because understanding and aesthetic viewing need different pacing.

## Data sources
- User-drawn path data from pointer/touch input.
- Curated preset SVG-like paths for autonomous loops.

## Visual design intent
The piece should read as a precise drawing instrument. Geometry remains clear at all times, labels stay readable, and the reconstructed line has confident contrast against supporting epicycle structures.
