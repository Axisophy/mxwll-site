# Changelog

## 2026-02-24
- Implemented homepage-only demo split with separate desktop and mobile components under `demo/`.
- Added `StellarDemo.tsx` wrapper with SSR-safe mobile detection (`window.innerWidth < 768`).
- Implemented full-height Dec mapping for sky view in demo mode (Dec -90/+90 to full canvas height).
- Added magnitude-based point sizing and `bp_rp`-based colour buckets for both sky and HR views.
- Added autonomous desktop loop (36s) and static mobile loop (29s) with smooth sky/HR interpolation.
- Wired homepage hero from legacy `GaiaExplorer` demo path to new `StellarDemo` wrapper.
- Updated demo documentation and known issues with current behaviour and constraints.

## 2026-02-23
- Initial migration from Bang Industries site.
- Source code copied to core/.
- Documentation templates created.
