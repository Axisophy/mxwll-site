# Chladni Figures - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Three modes:
1. Frequency sweep - animate through resonant modes as frequency increases, watching patterns transform.
2. Mode browser - user selects specific (m, n) modes and sees the resulting pattern.
3. Sound-reactive - Web Audio API microphone input drives frequency parameter in real time.

## Design decisions
- Render sand as particles rather than a texture for stronger physical legibility and visual quality.
- Show frequency readout and mode designation `(m, n)` at all times in interactive mode.
- Transition between modes with particle animation so sand appears to slide to new nodal positions.
- Palette variants: warm sand colours on dark background, or pure white particles for a clinical aesthetic.
- Mobile profile uses lower particle counts and simpler updates while preserving nodal clarity.

## Implementation path
- Renderer: Canvas 2D or WebGL particle system.
- Physics: Chladni pattern formula for simple geometries, with FEM-style approximation as an extension path.
- Sound mode pipeline: Web Audio API -> `AnalyserNode` -> mapped frequency parameter -> pattern update.

## Rejected approaches
- Texture-only rendering: rejected because it hides granular movement and weakens the physical metaphor.
- Immediate hard cut between modes: rejected because transitions become visually abrupt and less explanatory.

## Data sources
- Procedural mode generation from analytical equations.
- Live microphone input for sound-reactive mode when user permission is granted.

## Visual design intent
The visual style should combine instrument precision with material behaviour. Nodal geometry needs to read clearly while particulate sand motion carries the sense of vibration and energy transfer.
