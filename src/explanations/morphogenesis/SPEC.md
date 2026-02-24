# Morphogenesis — Specification
**Version:** 1.0
**Created:** 2026-02-23

## Brief
Make Turing's insight about pattern formation visceral and interactive. Target audience: science communicators, educators, and curious general audiences.

## Design decisions
- Gray-Scott model chosen over other reaction-diffusion systems for its rich variety of patterns
- WebGL2 with float framebuffers for GPU acceleration and numerical precision
- Preset system to guide users to interesting parameter regions (mitosis, coral, waves, etc.)
- User can paint chemicals directly onto canvas for immediate feedback
- Feed and kill rates adjustable in real time

## Rejected approaches
- CPU-based simulation: too slow for real-time interaction at useful resolutions
- WebGL 1.0: lacks float texture support needed for precision
- Fixed patterns only: loses the "ah-ha" moment of watching emergence happen

## Data sources
Gray-Scott reaction-diffusion equations. No external data.

## Visual design intent
Patterns should be crisp and colorful against dark background. User interface minimal - focus on the patterns themselves. Real-time feedback essential for understanding parameter space.
