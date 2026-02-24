# Flow Field Visualiser
**Status:** Complete
**Last Updated:** 2026-02-23
**Location in site:** Homepage, `/work/emergent-currents`

## What it is
Reusable React component rendering particles flowing through a 3D Simplex noise field. Creates organic, fluid-like motion patterns. Used site-wide as a visual motif.

## Usage
```tsx
import FlowFieldVisualiser from '@/widgets/flow-field-visualiser/FlowFieldVisualiser';

<FlowFieldVisualiser />
```

## Props / Configuration
Currently no props - runs autonomously with internal parameters.

## Current state
- Fully functional
- Canvas 2D rendering with particle trails
- Embedded SimplexNoise implementation (no external dependencies)
- Autonomous animation loop
- Mobile performance untested (may need particle count reduction)
