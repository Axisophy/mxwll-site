# Brownian Motion
**Status:** Live
**Last Updated:** 2026-03-03
**Location in site:** `/lab/brownian-motion`

## What it is
Dual-scale simulation of Brownian motion. Left panel: microscale molecular collisions with tracer particle. Right panel: zoomed-out random walk trajectory and live MSD graph. 40-second autonomous demo with ensemble spread at t=24s.

## How to run / develop
Canvas 2D visualiser. Component at `core/BrownianMotionVisualiser.tsx`. No dependencies beyond React.

## Current state
Demo mode complete. Split-panel layout (stacked on mobile). Shows collision field, random walk path, ensemble spread, and linear MSD verification.
