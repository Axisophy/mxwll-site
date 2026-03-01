# Changelog

## 2026-03-01
- Refined `demo/ExoplanetDemo.tsx` presentation with a padded viewport container (`#03060f`) to frame the animation.
- Added persistent top-right method legend with mapped categories: `Transit`, `Radial Velocity`, and `Other`.
- Added top-left phase title overlays for all three views with fade-in/fade-out timing tied to view activation.
- Added scatter-view-only axis copy overlays for orbital period and planet size.
- Replaced timeline Kepler annotation with `Kepler 2009` and `discoveries accelerate`, including a dedicated 2009 axis tick.
- Added sky-view Kepler field marker/label at mapped coordinates (`ra ~300`, `dec ~45`) with delayed fade-in after sky transition.
- Updated discovery-method mapping for demo rendering so only `Transit` and `Radial Velocity` keep named categories; all other methods render and label as `Other`.

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
