# Black Hole Accretion
**Status:** Not started
**Last Updated:** 2026-02-24
**Location in site:** Lab

## What it is
Raymarched gravitational lensing simulation around a Schwarzschild black hole. Visualises light bending, accretion disc structure, photon sphere behaviour, and black hole shadow.

## Rendering
Raymarching using signed distance fields plus volumetric disc shading.

## Complexity
High.

## How to run / develop
Planned architecture keeps raymarch and geodesic approximation code in `core/`, autonomous camera choreography in `demo/`, and user camera controls in `interactive/`.

## Current state
Scaffold complete. No live shader implementation yet.
