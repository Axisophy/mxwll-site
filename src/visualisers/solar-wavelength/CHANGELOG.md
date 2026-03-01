# Changelog

## 2026-03-01
- Updated `demo/SolarDemo.tsx` container styling with a dark blue-black viewport treatment (`#03060f`) and responsive padding (24px desktop, 16px mobile).
- Centered the solar disc inside the viewport and constrained circle diameter to available padded width.
- Added a wavelength indicator panel below the disc with:
- current wavelength and human-readable channel description row.
- full spectrum tick bar (`094`, `131`, `171`, `193`, `211`, `304`, `1600`, visible).
- animated dot/tick highlight that interpolates during image crossfades.
- Updated demo channel cycle order to: `171 -> 304 -> 193 -> 094 -> visible(HMI)` with fallback ending at `094` when visible-light data is unavailable.
- Added explicit human-readable channel naming for all displayed spectrum labels.

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
