# Double Pendulum - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Build two coordinated views:
1. Main view: pendulum motion and trails in real space. All pendulums start synchronised and then diverge.
2. Phase space view: theta1 versus theta2 trajectory to reveal chaotic structure over time.

## Design decisions
- Simulate N = 20-50 pendulums on desktop, each offset by 0.001 degrees in initial angle.
- Apply a blue-to-red gradient mapped to initial condition index.
- Trails persist for a defined temporal window, then fade to preserve readability.
- Add a synchrony meter that decreases as trajectories diverge, making chaos legible.
- Expose controls for reset, initial offset magnitude, and simulation speed.

## Implementation path
- Renderer: Canvas 2D.
- Integrator: RK4 for stable timestep integration under chaotic motion.
- State model: shared simulation state feeding both real-space and phase-space views.
- Mobile profile: reduced pendulum count and optional single-view rendering.

## Rejected approaches
- Euler integration: rejected due to high numerical drift and poor stability.
- Single-pendulum display: rejected because it does not communicate divergence clearly.
- Permanent trails with no fade: rejected because phase information becomes unreadable.

## Data sources
- No external data sources required.
- Initial conditions generated procedurally at runtime.

## Visual design intent
The piece should feel precise and analytical rather than decorative. Early synchrony should be visually obvious, and divergence should become unmistakable without requiring technical background.
