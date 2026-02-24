# The Permissible Universe

**Status:** In Development
**Last Updated:** 2026-02-23
**Location in site:** /work/permissible-universe

## What it is

Interactive mass-radius diagram showing ~200 cosmic objects from quarks to supermassive black holes. Objects are positioned according to physical limits (Schwarzschild radius, electron degeneracy pressure, Compton wavelength, Hubble radius).

## How it works

- **Log-log scatter plot**: Both axes are logarithmic to span 80+ orders of magnitude
- **Physical boundaries**: Lines showing fundamental limits (black hole formation, quantum limits)
- **Four-tier explanations**: Each object has explanations at child → student → undergraduate → expert levels
- **Category filtering**: View by object type (fundamental particles, atoms, planets, stars, galaxies, etc.)
- **Search**: Find objects by name or description
- **Interactive modals**: Click objects for detailed information

## Current state

- **Data source**: Uses src/lib/data/cosmic-objects.ts (~200 objects)
- **Explanation modal**: Uses generic ExplanationModal component
- **UI**: Original Maxwell styling (dark theme) - needs update to MXWLL design system
- **Responsive**: Desktop only - mobile version needs work

## Dependencies

- React (state management)
- Canvas 2D (rendering)
- No external APIs (all data embedded)

## Known issues

See KNOWN-ISSUES.md
