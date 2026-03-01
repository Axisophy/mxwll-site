# Known Issues

## Open
- Mobile performance untested
- Demo/interactive separation not yet implemented
- Documentation incomplete (README, SPEC need details)
- Kepler field concentration visibility depends on `ra/dec` quality in source records.
- Records with null `ra/dec` are assigned deterministic seeded random sky positions.
- Demo loop timings are reduced by 25% on mobile to improve pacing and performance.

## Resolved
None yet

## Notes for future development
[Add notes about code structure, dependencies, complexity as discovered]

## Code organization note
**Demo/Interactive separation pending**: Current code in core/ mixes demo logic (autonomous camera, transitions) with interactive controls. These concerns should be separated:
- core/ → rendering engine, data structures, physics/math
- demo/ → autonomous mode for homepage/showcase
- interactive/ → user controls, UI, interactive version

This separation is flagged for future work. Do not attempt during initial migration.
