# Gaia Proper Motions - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Use the Stellar Cartography star field as base, then apply proper motion vectors with a time scrubber spanning `-100,000` to `+100,000` years.

Narrative objective: the "fixed" stars are not fixed - constellation permanence is an illusion created by short human timescales.

Visual elements include subtle motion trails, constellation outlines that deform through time, and labels for notable fast movers (especially Barnard's Star).

## Design decisions
- Preserve the established Stellar Cartography visual language for continuity.
- Motion trails remain subtle so starfield readability is retained.
- Time controls must make both slow drift and dramatic long-range deformation understandable.
- Barnard's Star is used as the anchor case for highest proper motion visibility.

## Implementation path
- Extend `stellar-cartography/core` WebGL renderer rather than rewriting foundational star rendering.
- Convert proper-motion components to projected sky displacement over selectable timescales.
- Add UI time scrubber with playback presets for guided storytelling.

## Rejected approaches
- Separate unrelated renderer stack: rejected because shared code reduces inconsistency and duplicated effort.
- Constant-speed autoplay only: rejected because user scrub control is essential for understanding scale.

## Data sources
- Existing Gaia DR3 catalogue already used by Stellar Cartography, including `pmra` and `pmdec` fields.

## Visual design intent
This piece should feel familiar at first glance, then increasingly unsettling as familiar constellations dissolve. The emotional arc is part of the explanation.
