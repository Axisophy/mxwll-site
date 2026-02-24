# Gravitational Wave Explorer — Specification
**Version:** 1.0
**Created:** 2026-02-23

## Brief
Make the LIGO gravitational wave detection accessible to general audiences. The challenge: the raw detector data looks like noise. Users need to understand what LIGO was looking for, why the signal is significant, and what physically happened.

## Design decisions

### 4-stage narrative structure
1. **Raw data** - "Can you see anything?" (Answer: no, it looks like noise)
2. **Predicted waveform** - Show what General Relativity predicts for this event
3. **Signal extraction** - Animated template matching demonstrates how signal is found in noise
4. **Physical interpretation** - What happened: masses, energy radiated, distance, time

This structure follows the cognitive arc: establish ignorance → provide framework → demonstrate method → reveal significance.

### Visual components
- **Waveform panels**: Hanford and Livingston detector outputs, time-synchronized
- **Spectrogram**: Frequency-time representation shows the "chirp" rising in pitch
- **Orbital diagram**: Black holes spiraling inward (illustrative, not to scale)

### Audio sonification
The chirp is pitched up 400× to make it audible (real signal is ~35-250 Hz, too low for human perception). This creates visceral connection to data.

### Progressive disclosure
Each stage adds one new element. Stage 1 is just raw data. Stage 2 overlays predicted signal. Stage 3 adds animated template. Stage 4 adds orbital diagram and narrative text.

## Rejected approaches
- Interactive parameter exploration (mass sliders, etc.) - would dilute the narrative focus on GW150914 specifically
- Real LIGO data files - too large, too complex to parse in browser, mock data serves pedagogical purpose
- WebGL rendering - Canvas 2D sufficient for this resolution and update rate

## Data sources
- Simplified mock data based on published GW150914 parameters
- Event details: LIGO Scientific Collaboration papers (2016)
- Waveform shape approximated from numerical relativity

## Visual design intent
Dark interface (LIGO aesthetic). Waveforms in white/blue against black. Spectrogram uses scientific colormap (viridis-like). Template overlay in contrasting color (pink/red) for visibility. Minimal UI - stage buttons only appear when relevant.
