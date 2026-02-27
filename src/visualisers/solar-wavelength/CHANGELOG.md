# Changelog

## 2026-02-24
- Added `src/app/api/solar/route.ts` proxy route (MXWLL copy of Bang Industries route) returning PNG bytes from Helioviewer
- Added autonomous demo component at `demo/SolarDemo.tsx` with:
- preload-all-channels start-up gate
- object URL image loading and cleanup on unmount
- circular canvas mask and alpha crossfade transitions
- mobile/desktop timing split (3s mobile dwell, 4s desktop dwell, 1.5s crossfade)
- optional wavelength label (`showLabel`)
- fallback candidates for unstable channels (`094 -> 94`, `HMI_IC -> 6173`) with skip-on-failure behaviour
- Added `demo/index.ts` export
- Added work route page at `src/app/work/solar-wavelength/page.tsx`
- Added Solar Wavelength item to `src/app/work/page.tsx` with status `In Development`
- Updated demo and issue documentation for route contract, channel fallback, preload requirement, and object URL cleanup

## 2026-02-23
- Initial migration from Bang Industries site
- Source code copied to core/
- Documentation templates created
