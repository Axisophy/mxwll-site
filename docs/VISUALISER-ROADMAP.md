# Visualiser Roadmap

Last updated: 2026-02-24

## Recommended Implementation Order

### Phase 1 - Canvas 2D, low complexity (complete first)
1. Phyllotaxis
2. Brownian motion
3. Penrose tiling
4. Lissajous
5. Space-filling curves
6. Orbital resonance

### Phase 2 - Canvas 2D and Three.js, medium complexity
7. Double pendulum
8. Boids
9. Lagrange points
10. Neuronal firing
11. Fourier epicycles
12. Chladni figures
13. Exoplanet systems

### Phase 3 - WebGL and Three.js, medium-high complexity
14. Wave tank
15. Gaia proper motions
16. Roche limit
17. Tectonic drift
18. Atomic orbitals

### Phase 4 - Advanced GPU, high complexity
19. Physarum
20. CMB explorer
21. Black hole accretion

## Detailed Plan

### 1) Phyllotaxis
- **Complexity:** Low
- **Implementation notes:** Canvas 2D seed-placement growth with angle slider, near-miss angle comparison, and Fibonacci arm highlighting.
- **Data source requirements:** Procedural geometry. Optional nature reference images.
- **Delivery mode:** Live interactive primary. Pre-rendered loops useful for social snippets.

### 2) Brownian motion
- **Complexity:** Low
- **Implementation notes:** Dual-scale Canvas simulation with microscale collisions and macroscale random walk plus live MSD graph.
- **Data source requirements:** Procedural stochastic model. Optional historical constants for annotation.
- **Delivery mode:** Live interactive primary. Pre-rendered explainers suitable for short educational clips.

### 3) Penrose tiling
- **Complexity:** Low
- **Implementation notes:** Deflation algorithm, zoom-safe rendering, and optional infinite pan with golden-ratio overlays.
- **Data source requirements:** Procedural tiling rules only.
- **Delivery mode:** Live interactive primary. Pre-rendered deflation loops also valuable.

### 4) Lissajous
- **Complexity:** Low
- **Implementation notes:** Canvas parametric renderer, ratio table, animated trace mode, and harmonograph damping.
- **Data source requirements:** None (procedural).
- **Delivery mode:** Live interactive primary. Pre-rendered hero loops are feasible.

### 5) Space-filling curves
- **Complexity:** Low
- **Implementation notes:** Recursive Hilbert/Peano/Moore generation with level animation and locality-mapping mode.
- **Data source requirements:** None for core. Optional image/data input for locality demos.
- **Delivery mode:** Live interactive primary. Pre-rendered loops useful for embeds.

### 6) Orbital resonance
- **Complexity:** Medium
- **Implementation notes:** Canvas orbit timing and trace accumulation for Galilean 1:2:4, custom ratios, and TRAPPIST-1 near-resonance.
- **Data source requirements:** Real period ratios for known systems plus procedural ratio inputs.
- **Delivery mode:** Live interactive primary.

### 7) Double pendulum
- **Complexity:** Medium
- **Implementation notes:** Canvas with RK4 integration, synchrony meter, and dual real-space plus phase-space views.
- **Data source requirements:** None (simulated dynamics).
- **Delivery mode:** Live interactive primary.

### 8) Boids
- **Complexity:** Medium
- **Implementation notes:** Rule-based agent simulation with spatial partitioning and optional predator dynamics.
- **Data source requirements:** None (procedural).
- **Delivery mode:** Live interactive primary.

### 9) Lagrange points
- **Complexity:** Medium
- **Implementation notes:** Rotating-frame potential surface plus particle-flow mode showing stable versus unstable points.
- **Data source requirements:** Physical constants and optional NASA Trojan reference positions.
- **Delivery mode:** Live interactive primary.

### 10) Neuronal firing
- **Complexity:** Medium
- **Implementation notes:** Three.js instanced neurons with threshold propagation, refractory dynamics, and network-topology comparison.
- **Data source requirements:** Procedural graph generation initially.
- **Delivery mode:** Live interactive primary.

### 11) Fourier epicycles
- **Complexity:** Medium
- **Implementation notes:** Path resampling, FFT/DFT decomposition, coefficient sorting, and simultaneous chain plus trace rendering.
- **Data source requirements:** Curated path presets and user-drawn paths.
- **Delivery mode:** Live interactive primary.

### 12) Chladni figures
- **Complexity:** Medium
- **Implementation notes:** Particle-based nodal simulation with (m, n) browser, sweep mode, and microphone-reactive mode.
- **Data source requirements:** Procedural equations plus optional microphone stream.
- **Delivery mode:** Live interactive primary. Pre-rendered sweeps useful as secondary assets.

### 13) Exoplanet systems
- **Complexity:** Medium-high
- **Implementation notes:** Three.js orrery for TRAPPIST-1 with companion Canvas discovery timeline.
- **Data source requirements:** NASA Exoplanet Archive CSV transformed into runtime JSON.
- **Delivery mode:** Live interactive primary. Pre-rendered narrative segments useful for showcases.

### 14) Wave tank
- **Complexity:** Medium-high
- **Implementation notes:** WebGL2 fragment-shader wave solver with source injection and diffraction presets.
- **Data source requirements:** Procedural simulation only.
- **Delivery mode:** Live interactive primary.

### 15) Gaia proper motions
- **Complexity:** Medium-high
- **Implementation notes:** Extend Stellar Cartography renderer with `pmra` and `pmdec` timeline transforms over +/-100,000 years.
- **Data source requirements:** Gaia DR3 proper motion fields from existing catalogue.
- **Delivery mode:** Live interactive primary.

### 16) Roche limit
- **Complexity:** Medium-high
- **Implementation notes:** GPGPU particle moon with tidal-force tearing and ring-formation narrative.
- **Data source requirements:** Procedural simulation plus optional density presets.
- **Delivery mode:** Live interactive primary.

### 17) Tectonic drift
- **Complexity:** Medium-high
- **Implementation notes:** Three.js sphere with Voronoi plates and keyframed palaeogeographic interpolation.
- **Data source requirements:** GPlates-derived reconstruction data or simplified keyframes.
- **Delivery mode:** Live interactive primary. Pre-rendered timeline cuts can complement.

### 18) Atomic orbitals
- **Complexity:** Medium-high
- **Implementation notes:** Volume raymarching of `psi^2` fields with orbital browser, filling sequence, and bonding overlap mode.
- **Data source requirements:** Procedural quantum wave-function evaluation.
- **Delivery mode:** Live interactive primary. Pre-rendered walkthroughs may support slower devices.

### 19) Physarum
- **Complexity:** High
- **Implementation notes:** WebGL2 transform-feedback or WebGPU compute simulation with capability-based degradation.
- **Data source requirements:** Procedural for core modes, plus galaxy distribution data for cosmic-web mode.
- **Delivery mode:** Live interactive primary. Pre-rendered ambient loops suitable as supporting media.

### 20) CMB explorer
- **Complexity:** High
- **Implementation notes:** Three.js globe and projection controls with preprocessed harmonic textures.
- **Data source requirements:** ESA Planck HEALPix FITS with offline Python `healpy` pipeline.
- **Delivery mode:** Hybrid. Core interaction should remain live, with optional pre-rendered harmonic sequences.

### 21) Black hole accretion
- **Complexity:** High
- **Implementation notes:** Full-screen raymarching with geodesic approximation, accretion disc shading, and Doppler beaming.
- **Data source requirements:** Optional background star texture.
- **Delivery mode:** Desktop live interactive where possible, with strong mobile pre-rendered fallback.

## Ptolemy Suitability Summary

Good candidates for Ptolemy-generated pre-rendered variants:
- Phyllotaxis
- Penrose tiling
- Lissajous
- Space-filling curves
- Chladni figures (frequency sweeps)
- Exoplanet systems (cinematic fly-through segments)
- Tectonic drift (time-lapse sequences)
- Physarum (ambient high-density loops)
- CMB explorer (harmonic progression cinematics)
- Black hole accretion (mobile fallback sequences)

Should remain primarily live interactive:
- Brownian motion
- Orbital resonance
- Double pendulum
- Boids
- Lagrange points
- Neuronal firing
- Fourier epicycles
- Wave tank
- Gaia proper motions
- Roche limit
- Atomic orbitals
