# Physarum
**Status:** Not started
**Last Updated:** 2026-02-24
**Location in site:** Lab

## What it is
GPU-accelerated simulation of *Physarum polycephalum* foraging behaviour. Large agent populations deposit chemical trails, sense gradients, and steer accordingly, producing branching network forms that resemble veins, rivers, and cosmic web structures.

## How to run / develop
Planned architecture keeps simulation kernels and buffers in `core/`, autonomous presentation in `demo/`, and user-facing controls and mode switching in `interactive/`.

## Current state
Scaffold complete. No compute pipeline, renderer, or controls implemented yet.

## Key reference
Polyphorm project (`CreativeCodingLab/Polyphorm`) for cosmic web framing and interaction cues.
