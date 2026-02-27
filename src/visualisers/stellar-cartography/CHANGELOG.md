# Changelog

## 2026-02-27
- Regenerated Gaia DR3 dataset with full-sky RA coverage and verified `public/data/gaia-stars.json` spans the full longitude range (`minRa ~ 0.0`, `maxRa ~ 360.0`) across 50,000 stars.
- Verified stellar field coverage in the shipped JSON for demo rendering: all 50,000 stars include `bp_rp` and `abs_mag`, with current ranges `bp_rp -0.229..4.253` and `abs_mag -2.12..13.34`.
- Confirmed the exported runtime dataset does not currently retain `phot_g_mean_mag`; only derived `abs_mag` is stored for sizing.

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
- Added galactic-view horizontal pan with seamless longitude wrap and transition-aware latitude density treatment (opacity and subtle warm/cool tint).
- Added a fourth magnitude-vs-colour observer view and expanded shader/view blending from three to four position sets.
- Updated demo loops to four-view timing: desktop 26s and mobile 22s.
- Differentiated HR (`v2`) and observer (`v4`) diagrams by using uniform small HR point sizes and inverted-y dramatic observer sizing.
- Added v4-only saturated `bp_rp` colour palette, blended in and out during transitions to and from observer view.
- Fixed v2/v4 clipping by computing padded magnitude and `bp_rp` ranges from loaded data instead of hardcoded axis ranges.

## 2026-02-23
- Initial migration from Bang Industries site.
- Source code copied to core/.
- Documentation templates created.
