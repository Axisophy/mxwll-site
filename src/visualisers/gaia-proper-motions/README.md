# Gaia Proper Motions
**Status:** Not started
**Last Updated:** 2026-02-24
**Location in site:** Lab

## What it is
Extension of Stellar Cartography that animates Gaia DR3 proper motions, showing the night sky in accelerated time as stars drift across the celestial sphere and familiar constellations deform.

## How to run / develop
Planned to share rendering foundations with `stellar-cartography`, with motion integration and time controls in `core/`, autoplay narrative in `demo/`, and user controls in `interactive/`.

## Current state
Scaffold complete. No proper-motion integration, time scrubber, or constellation deformation overlays implemented yet.

## Data source
Gaia DR3 proper motion fields (`pmra`, `pmdec`) from the existing stellar catalogue.
