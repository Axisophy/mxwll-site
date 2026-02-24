# Visualiser Roadmap

Last updated: 2026-02-24

## Queue Overview

Implementation order is based on complexity, dependency risk, and data-preparation overhead.

1. Lissajous
2. Space-filling curves
3. Double pendulum
4. Boids
5. Wave tank
6. Fourier epicycles
7. Chladni figures
8. Exoplanet systems
9. Gaia proper motions
10. Physarum
11. CMB explorer

## Detailed Plan

### 1) Lissajous
- **Complexity:** Low
- **Implementation notes:** Canvas 2D parametric renderer, frequency table grid, animated trace mode, harmonograph damping.
- **Data source requirements:** None (procedural).
- **Delivery mode:** Best as live interactive. Pre-rendered variant possible for hero loops.

### 2) Space-filling curves
- **Complexity:** Low
- **Implementation notes:** Recursive generators for Hilbert/Peano/Moore, level-by-level animation, optional locality-mapping mode.
- **Data source requirements:** None for core. Optional image/data input for locality demos.
- **Delivery mode:** Best as live interactive. Pre-rendered loops useful for lightweight embeds.

### 3) Double pendulum
- **Complexity:** Medium
- **Implementation notes:** Canvas 2D with RK4 integrator, synchrony meter, dual real-space/phase-space view.
- **Data source requirements:** None (simulated dynamics).
- **Delivery mode:** Must be live interactive for parameter exploration. Pre-rendered cycle is secondary.

### 4) Boids
- **Complexity:** Medium
- **Implementation notes:** Start Canvas 2D, add spatial partitioning, move to WebGL if higher agent counts needed.
- **Data source requirements:** None (agent simulation).
- **Delivery mode:** Must be live interactive. Pre-rendered clips can support social/editorial use.

### 5) Wave tank
- **Complexity:** Medium
- **Implementation notes:** WebGL2 fragment-shader solver, source injection, boundary masks, deterministic preset cycle.
- **Data source requirements:** None (procedural physics).
- **Delivery mode:** Must be live interactive. Pre-rendered versions are useful only as teaser media.

### 6) Fourier epicycles
- **Complexity:** Medium
- **Implementation notes:** Path resampling, FFT/DFT decomposition, coefficient sorting, dual display of chain and reconstructed path.
- **Data source requirements:** Curated preset paths plus user input paths.
- **Delivery mode:** Must be live interactive to allow user-drawn paths. Pre-rendered demo mode is complementary.

### 7) Chladni figures
- **Complexity:** Medium
- **Implementation notes:** Particle-based nodal simulation, (m, n) mode browser, sweep mode, microphone-reactive mode.
- **Data source requirements:** None for analytical mode. Microphone input required for sound-reactive mode.
- **Delivery mode:** Primarily live interactive. Pre-rendered resonance sweeps are suitable for Ptolemy-style outputs.

### 8) Exoplanet systems
- **Complexity:** Medium-high
- **Implementation notes:** Three.js or React Three Fiber orrery for TRAPPIST-1 plus Canvas timeline browser for full catalogue.
- **Data source requirements:** NASA Exoplanet Archive CSV transformed to JSON.
- **Delivery mode:** Live interactive preferred for filtering and comparisons. Pre-rendered narrative segments are viable for showcase reels.

### 9) Gaia proper motions
- **Complexity:** Medium-high
- **Implementation notes:** Extend existing Stellar Cartography renderer, apply `pmra`/`pmdec`, add ±100,000 year scrubber and labelled exemplars.
- **Data source requirements:** Gaia DR3 proper-motion fields from existing catalogue.
- **Delivery mode:** Must be live interactive for time scrubbing. Pre-rendered loops can supplement.

### 10) Physarum
- **Complexity:** High
- **Implementation notes:** WebGL2 transform-feedback or WebGPU compute path, capability-based degradation, multi-mode parameter presets.
- **Data source requirements:** None for aesthetic/pathfinding modes. Cosmic web mode needs galaxy distribution dataset.
- **Delivery mode:** Must be live interactive for parameter and mode exploration. Pre-rendered atmospheric loops are suitable for background media.

### 11) CMB explorer
- **Complexity:** High
- **Implementation notes:** Three.js globe + projection controls, harmonic decomposition assets, preprocessed texture pipeline.
- **Data source requirements:** ESA Planck Legacy HEALPix FITS, offline preprocessing with Python `healpy`.
- **Delivery mode:** Hybrid. Core educational interaction should be live; high-resolution harmonic transitions are good candidates for pre-rendered Ptolemy-style sequences.

## Ptolemy Suitability Summary

Good candidates for Ptolemy-generated pre-rendered variants:
- Lissajous
- Space-filling curves
- Chladni figures (frequency sweeps)
- Exoplanet systems (cinematic fly-through segments)
- Physarum (ambient high-density loops)
- CMB explorer (harmonic progression cinematics)

Should remain primarily live interactive:
- Double pendulum
- Boids
- Wave tank
- Fourier epicycles
- Gaia proper motions
