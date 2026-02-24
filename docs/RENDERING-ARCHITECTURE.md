# MXWLL Rendering Architecture Reference

## Philosophy: Data-Oriented Design

High-performance visualisers require Data-Oriented Design (DOD).

Do not think in objects:

```ts
class Star { x, y, z, vx, vy, vz }
const stars = stars.map(s => new Star(...))
```

Think in arrays:

```ts
const positions = new Float32Array(N * 3) // x,y,z for N particles
const velocities = new Float32Array(N * 3)
```

Reason: GPU pipelines operate on contiguous memory. Objects fragment memory and reduce throughput. Arrays support batched uploads and single draw calls for very large counts.

## Technique 1: GPGPU via FBO Ping-Pong

Use when: simulating more than 10,000 particles (flocking, fluid, physarum, galaxy dynamics, high-scale physics).

How it works:
1. Create two framebuffer objects (FBOs): A and B.
2. Store particle state in texture pixels (`RGBA = XYZ + spare channel`).
3. Each frame: read A, compute in fragment shader, write B.
4. Next frame: swap A and B.
5. Render pass reads latest state texture and draws particles.

Result: near-million-particle updates with JavaScript acting as orchestration, not per-particle compute.

WebGL2 implementation:
- Use floating-point texture support for position state.
- Use multiple render targets for position and velocity where needed.
- Keep simulation shaders focused and simulation-specific.

WebGPU implementation (future path):
- Compute shaders with explicit workgroups.
- Cleaner than ping-pong orchestration, but browser support is still uneven.

Fallback strategy:
- Detect WebGL2 support.
- If unavailable, degrade to Canvas 2D with lower counts.
- Standard target counts: WebGL2 = 500K+, Canvas fallback = 5K.

## Technique 2: Instanced Mesh Rendering

Use when: rendering more than 1,000 identical geometries (stars, cells, molecules, boids, repeated markers).

Never do this:

```ts
for (let i = 0; i < 10000; i++) {
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}
```

Always do this:

```ts
const mesh = new THREE.InstancedMesh(geometry, material, 10000)
for (let i = 0; i < 10000; i++) {
  matrix.setPosition(x, y, z)
  mesh.setMatrixAt(i, matrix)
}
```

Result: one draw call instead of thousands, with major CPU and driver overhead reduction.

## Technique 3: Custom Shader Materials

Use for: visualisers requiring luminous, volumetric, atmospheric, or high-density visual language.

Avoid `MeshStandardMaterial` for dense particle or field visuals. Prefer direct GLSL control.

Key techniques:
- Additive blending (`THREE.AdditiveBlending`) for natural density glow.
- Fresnel term (`pow(1.0 - dot(normal, viewDir), 3.0)`) for edge glow.
- Point size attenuation (`size *= 1.0 / -mvPosition.z`) for perspective-correct sprites.
- Alpha discard (`if (alpha < 0.01) discard`) for shaping complex silhouettes from simple geometry.

## Technique 4: Raymarching (SDFs)

Use for: volumetric effects, gravitational lensing, gas clouds, nebulae, and other non-solid phenomena.

How it works:
- Cast one ray per pixel.
- March forward along the ray.
- Sample a signed distance field (SDF) each step.
- Accumulate colour and density through the medium.

Common SDFs:
- Sphere: `length(p) - radius`
- Box: `length(max(abs(p)-b, 0.0))`
- Torus: `length(vec2(length(p.xz)-R, p.y)) - r`
- Composition: `min()` for union, `max()` for intersection, smooth min for blending

Performance: expensive per pixel. Use primarily for hero visuals, not high-count background systems.

## Performance Targets

| Scale | Technique | Target FPS |
|-------|-----------|------------|
| <1K objects | Three.js standard | 60fps |
| 1K-10K | Instanced mesh | 60fps |
| 10K-100K | FBO GPGPU | 60fps |
| 100K-1M+ | FBO GPGPU + LOD | 30-60fps |
| Volumetric | Raymarching | 30fps+ |

## Mobile Considerations

Always define two tiers:
- Desktop: full particle count and full shader complexity.
- Mobile: reduced count (roughly one tenth), simplified shaders, optional pre-rendered fallback.

Detection baseline:

```ts
const isMobile = navigator.maxTouchPoints > 0 || window.innerWidth < 768
```

Reduce on mobile:
- Particle count
- Texture resolution
- Raymarch step count
- Post-processing passes

## Recommended Libraries

- Three.js r158+ - core 3D stack
- `@react-three/drei` - Three.js helpers in React
- `lil-gui` - lightweight development parameter GUI
- `glsl-noise` - shader noise helpers
- WebGPU (experimental) - future compute path

Reference studios:
- Variable
- Field
- Onformative

Reference technique:
- PEX-style low-level WebGL modularity (study approach, do not depend on PEX directly)
