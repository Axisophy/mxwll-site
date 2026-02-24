# Changelog - The Permissible Universe

All notable changes to this visualiser.

## [1.0.0] - 2026-02-24

### Added
- Initial migration from Maxwell archive to MXWLL site
- Integrated with `src/lib/data/cosmic-objects.ts` data source (replacing embedded data)
- Created visualiser directory structure (`core/`, `demo/`, `interactive/`)
- Added comprehensive documentation (README, SPEC, CHANGELOG, KNOWN-ISSUES, DEMO-SPEC)
- Configured Next.js page route at `/work/permissible-universe`

### Changed
- Updated import paths to use centralised cosmic objects data
- Moved from `src/app/data/fabric/permissible-universe/` to `src/visualisers/permissible-universe/`
- Removed Maxwell-specific dependencies (Clerk auth, BreadcrumbFrame)

### Preserved
- All 200+ cosmic objects with four-tier explanations
- Physical boundary lines (Schwarzschild, degeneracy, Compton, Hubble)
- Pan/zoom interaction
- Category filtering
- Search functionality
- Object detail modals
- Big Questions mode (dark matter candidates, EM spectrum)
- Epochs/Domination timeline views

### Not Yet Migrated
- Design system update (still uses Maxwell dark theme - needs MXWLL light theme)
- Mobile optimisation (works but not refined)
- Demo mode implementation (scaffolded but not built)
- Homepage integration

### Known Issues
See KNOWN-ISSUES.md

## Source History

**Original Implementation:** Maxwell Observatory (2024-2025)
**Created by:** Simon Tyler
**Original Location:** `maxwell-archived-2026-02/src/app/data/fabric/permissible-universe/`
**Migration Date:** 2026-02-24
