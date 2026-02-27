# Known Issues

## Open
- Mobile performance untested
- Helioviewer `takeScreenshot` latency can be high (roughly 2-5s per image), so demo preloading is required before playback
- `HMI_IC` may fail with the current AIA-layer route format; demo attempts fallback to `6173`
- Route validation on `2014-09-10T00:00:00Z` returns Helioviewer `500` for `HMI_IC` and `6173` with the copied route format.
- Route validation on `2014-09-10T00:00:00Z` returns Helioviewer `500` for `094`, but fallback `94` succeeds and is used by the demo.

## Resolved
- Demo/interactive separation implemented for homepage demo mode in `demo/`
- Object URL lifecycle handled in demo preload path (revoked on unmount)

## Notes for future development
[Add notes about code structure, dependencies, complexity as discovered]

## Code organization note
**Demo/Interactive separation pending**: Current code in core/ mixes demo logic (autonomous camera, transitions) with interactive controls. These concerns should be separated:
- core/ → rendering engine, data structures, physics/math
- demo/ → autonomous mode for homepage/showcase
- interactive/ → user controls, UI, interactive version

This separation is flagged for future work. Do not attempt during initial migration.
