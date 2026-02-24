# Black Hole Accretion - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Full-screen fragment shader raymarches a Schwarzschild black hole scene with:
- Event horizon shadow
- Accretion disc temperature gradient (hot inner to cooler outer)
- Photon sphere around 1.5x Schwarzschild radius
- Gravitational lensing of background star field

## User interaction
- Orbit camera around black hole to inspect lensing from different angles.
- Face-on framing should reveal Einstein ring behaviour.
- Edge-on framing should reveal upper and lower disc images and asymmetry.

## Explanation targets
- Why observed shadow is larger than event horizon radius.
- What photon sphere means in practical visual terms.
- Why one side of the disc is brighter (Doppler beaming).

## Technical approach
- Fragment shader casts ray per pixel.
- Ray bend uses geodesic approximation via numerical integration.
- Disc shape represented via torus-like SDF and volumetric density profile.
- Disc temperature mapped roughly from 2000K to 20000K into colour ramp.
- Background either sampled from star texture or generated procedurally.
- Doppler term shifts brightness and colour by disc rotational velocity relative to camera.

## Performance notes
- Raymarching is expensive.
- Desktop target: 30fps at 1080p.
- Mobile strategy: reduced render resolution with strong recommendation for pre-rendered video fallback.

## Rejected approaches
- Particle disc approximation: rejected for first version because raymarched disc gives clearer lensing continuity.
- Full GR metric solver in-browser: rejected for scope and performance.

## Data sources
- Optional background star texture.
- No mandatory external dataset for first prototype.

## Visual design intent
Cinematic and physically suggestive, while still explanatory. The image should make lensing legible, not just dramatic.

## References
- Shadertoy black hole implementations for geodesic approximation patterns.
