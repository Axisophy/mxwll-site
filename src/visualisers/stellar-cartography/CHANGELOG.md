# Changelog

## 2026-02-24
- Implemented homepage-only demo split with separate desktop and mobile components under `demo/`.
- Added `StellarDemo.tsx` wrapper with SSR-safe mobile detection (`window.innerWidth < 768`).
- Implemented full-height Dec mapping for sky view in demo mode (Dec -90/+90 to full canvas height).
- Added magnitude-based point sizing and `bp_rp`-based colour buckets for both sky and HR views.
- Added autonomous desktop loop (36s) and static mobile loop (29s) with smooth sky/HR interpolation.
- Wired homepage hero from legacy `GaiaExplorer` demo path to new `StellarDemo` wrapper.
- Updated demo documentation and known issues with current behaviour and constraints.
- Fixed initial sky-view horizontal offset causing left-edge black gap by introducing wrapped RA sky offset starting at zero.
- Fixed desktop loop dwell sequencing to enforce exact 15/3/15/3 phase boundaries across the 36-second cycle.
- Added galactic coordinates (`l/b`) as a third demo view with precomputed IAU coordinate transform at data-load time.
- Updated desktop demo loop to a 54-second three-view sequence: sky -> HR -> galactic -> sky.
- Updated mobile demo loop to include galactic view with 12s dwell phases and 2.5s transitions.
- Fixed demo timing to short-cycle loops: desktop 19.5s and mobile 16.5s with 1.5s transitions.
- Fixed galactic rendering path by using explicit sky/HR/galactic view weights in the vertex shader interpolation.
- Fixed galactic canvas mapping implementation to explicit l/b canvas-formula projection so the Milky Way band appears in galactic view.

## 2026-02-23
- Initial migration from Bang Industries site.
- Source code copied to core/.
- Documentation templates created.
