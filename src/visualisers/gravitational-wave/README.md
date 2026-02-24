# Gravitational Wave Explorer
**Status:** Complete
**Last Updated:** 2026-02-23
**Location in site:** `/work/gravitational-wave`

## What it is
Interactive explainer for the first direct detection of gravitational waves (LIGO GW150914). Uses a 4-stage narrative structure to guide users from raw detector data to understanding the black hole merger. Features waveform visualization, spectrograms, orbital mechanics, and audio sonification of the "chirp."

## How to run / develop
Located in `core/components/` and `core/lib/`. Main component is `GravitationalWaveExplorer.tsx`.

Import and use in page:
```tsx
import GravitationalWaveExplorer from '@/visualisers/gravitational-wave/core/components/GravitationalWaveExplorer';

<GravitationalWaveExplorer />
```

## Current state
**What works:**
- 4-stage narrative progression (raw data → predicted signal → noise analysis → event interpretation)
- Canvas-based rendering: waveform panels, spectrogram, orbital diagram
- Audio sonification (Web Audio API chirp synthesis)
- Animated template overlay for signal matching (stage 3)
- Playhead scrubbing
- Responsive layout

**Known limitations:**
- Mock data (simplified LIGO signal, not real data files)
- Template animation is illustrative, not scientifically precise
- Audio requires user interaction to start (browser autoplay policies)

## Dependencies
- React hooks (useState, useRef, useCallback, useEffect)
- Canvas 2D API
- Web Audio API (AudioContext, OscillatorNode)

## File structure
```
core/
  components/
    GravitationalWaveExplorer.tsx  (main component)
  lib/
    types.ts      (Stage enum, data types, constants)
    mock-data.ts  (generate simplified LIGO-like data)
    renderer.ts   (Canvas drawing functions for panels)
    audio.ts      (ChirpAudio class for sonification)
```
