# Penrose Tiling
**Status:** Live
**Last Updated:** 2026-03-03
**Location in site:** `/lab/penrose-tiling`

## What it is
P2 Penrose tiling (kites and darts) via Robinson triangle subdivision. Autonomous 55-second demo showing recursive deflation from seed decagon through 7 levels, with fivefold symmetry overlay.

## How to run / develop
Canvas 2D visualiser. Component at `core/PenroseTilingVisualiser.tsx`. No dependencies beyond React.

## Current state
Demo mode complete. 7 deflation levels on desktop, 5 on mobile. Precomputed triangle arrays for instant level switching. Golden ratio pentagonal overlay at final level.
