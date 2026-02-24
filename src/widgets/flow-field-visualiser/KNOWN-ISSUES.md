# Known Issues

## Open
- Mobile performance untested - particle count may be too high for slower devices
- No mobile-specific optimization (should check window.innerWidth and reduce count)
- Hard-coded dark particle color (should respect site theme)
- No cleanup on unmount if animation loop doesn't cancel properly
- Uses requestAnimationFrame but no FPS limiting (could throttle on slower devices)

## Resolved
None yet

## Performance Notes
- Current particle count: check source code (likely 500-2000 particles)
- Each frame: compute noise for all particles + draw trails
- Consider: reduce to 25% particle count on mobile (window.innerWidth < 768)
