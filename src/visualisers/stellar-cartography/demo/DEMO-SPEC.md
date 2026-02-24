# Stellar Cartography - Demo Specification

## Desktop demo
**Duration:** 19.5 seconds per loop  
**Canvas sizing:** container width from `getBoundingClientRect()`, height `100vh`, DPR cap `2.0`  
**Data volume:** up to 50,000 stars (full dataset)  
**Projection:** equirectangular sky and galactic mappings (full width/height)  
**Point encoding:**
- Size from magnitude (`phot_g_mean_mag` if present, fallback to `abs_mag`)
- Magnitude stops: `<=0: 3.5px`, `3: 2.5px`, `5: 1.8px`, `7: 1.2px`, `>8: 1.0px`
- Colour from `bp_rp` buckets (blue-white, yellow-white, orange, red), fallback warm white
- Galactic coordinates (`l`, `b`) are precomputed at load using IAU NGP/NCP constants.

### Timeline
```text
0.0s-5.0s    Sky view with slow right-to-left pan and subtle vertical drift
5.0s-6.5s    Sky -> HR transition (1.5s, ease-in-out cubic)
6.5s-11.5s   HR view with subtle zoom and drift
11.5s-13.0s  HR -> Galactic transition (1.5s, ease-in-out cubic)
13.0s-18.0s  Galactic view (static framing)
18.0s-19.5s  Galactic -> Sky transition (1.5s, ease-in-out cubic)
```

## Mobile demo
**Duration:** 16.5 seconds per loop  
**Canvas sizing:** width `100vw`, height `60vh`, DPR cap `1.5`  
**Data volume:** brightest 15,000 stars (selected by lowest magnitude)  
**Projection:** same full-sky, HR, and galactic mappings as desktop  
**Point encoding:**
- Size from magnitude with mobile stops: `<=0: 2.0px`, `3: 1.5px`, `5: 1.2px`, `7: 0.8px`, `>8: 0.6px`
- Same colour mapping as desktop

### Timeline
```text
0.0s-4.0s    Sky view (static)
4.0s-5.5s    Sky -> HR transition (1.5s, ease-in-out cubic)
5.5s-9.5s    HR view (static)
9.5s-11.0s   HR -> Galactic transition (1.5s, ease-in-out cubic)
11.0s-15.0s  Galactic view (static)
15.0s-16.5s  Galactic -> Sky transition (1.5s, ease-in-out cubic)
```

## Technical notes
- Wrapper: `StellarDemo.tsx` chooses desktop/mobile with `window.innerWidth < 768` via `useEffect` + `useState`.
- Desktop and mobile are separate components:
  - `StellarDemo.desktop.tsx`
  - `StellarDemo.mobile.tsx`
- Shared helpers/constants are in `demo-utils.ts`.
- Resize handling is debounced and listens to resize plus `fullscreenchange`.
- Both paths log Dec ranges, magnitude ranges, and galactic latitude ranges for verification.

## Current state
**Status:** Implemented and wired to homepage demo embed.
**Scope:** Homepage demo only. Full interactive visualiser remains separate.
