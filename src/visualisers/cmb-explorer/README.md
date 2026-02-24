# CMB Explorer
**Status:** Not started
**Last Updated:** 2026-02-24
**Location in site:** Lab

## What it is
Cosmic Microwave Background visualisation using ESA Planck Legacy Archive data. The full-sky temperature map is rendered on a rotating 3D sphere with an additional spherical-harmonic build mode.

## How to run / develop
Planned architecture uses `core/` for Three.js rendering and texture handling, `demo/` for autonomous mode transitions, and `interactive/` for projection controls and the user patch feature.

## Current state
Scaffold complete. No globe renderer, harmonic stack, or preprocessing pipeline integrated yet.

## Data source
ESA Planck Legacy Archive (HEALPix FITS).
