# CMB Explorer - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Two main modes:
1. Full-sky globe mode showing Planck CMB temperature map on a rotating sphere with projection controls (Mollweide and 3D globe).
2. Harmonic decomposition mode that adds spherical harmonics progressively (l = 2 -> l = 50 -> full resolution) to show how structure emerges across scales.

Special feature: "Your CMB patch". User enters birth date, which maps to sky coordinates, then the interface zooms to that patch for a memorable, shareable anchor.

## Design decisions
- Use standard WMAP/Planck blue-white-red CMB colour scale for scientific credibility.
- Always display temperature scale in microkelvin (`uK`).
- Harmonic mode displays current `l` value and interpreted physical scale.
- "Your patch" coordinate mapping needs explicit rule definition before implementation.
- Data should be preprocessed offline to keep browser runtime light.

## Implementation path
- Three.js sphere using preprocessed Planck texture assets.
- Python preprocessing pipeline (`healpy`) converts HEALPix FITS to web texture formats.
- Pre-compute harmonic cutoff textures at selected `l` bands.
- Runtime loads tiered assets with level-of-detail safeguards.

## Rejected approaches
- Browser-side FITS parsing: rejected due to payload and processing cost.
- Non-standard colour palettes: rejected because interpretability and trust are priority goals.

## Data sources
- ESA Planck Legacy Archive full-sky maps in HEALPix FITS format.
- Preprocessed derivatives for browser delivery.

## Visual design intent
The piece should feel scientifically grounded and cinematic. The globe mode provides orientation, while harmonic mode communicates scale decomposition clearly without overwhelming controls.
