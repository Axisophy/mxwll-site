# Changelog

## 2026-03-01
- Copied `planets.json` and `featured.json` from `bang_industries_site/public/data/exoplanets/` into `public/data/exoplanets/` for runtime loading in MXWLL.
- Added autonomous demo component at `demo/ExoplanetDemo.tsx` with a three-view loop:
- discovery timeline with year sweep (1992-2025), reveal flash, axis labels, and Kepler marker.
- radius-vs-period scatter on a log-period axis with clamped edge parking for out-of-range values.
- sky map projection from RA/Dec with seeded random fallback positions for missing coordinates.
- Added mobile timing scale (0.75x duration), DPR-capped canvas rendering, and CSS-dimension position mapping to avoid double-DPR coordinate drift.
- Added `demo/index.ts` export for dynamic import usage.
- Added work route page at `src/app/work/exoplanet-systems/page.tsx`.
- Added Exoplanet Systems card to `src/app/work/page.tsx` with status `In Development`.

## 2026-02-23
- Initial migration from Bang Industries site
- Source code copied to core/
- Documentation templates created
