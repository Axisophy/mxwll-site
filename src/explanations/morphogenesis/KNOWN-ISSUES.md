# Known Issues

## Open
- Video file not yet added (placeholder div present)
- WebGL2 reaction-diffusion visualiser not implemented (only placeholder)
- Need to reference Python/Jupyter source code location (likely in `/projects/Bang-Reaction-Diffusion/`)
- Mobile performance untested (WebGL simulations can be demanding)

## Resolved
None yet

## Implementation Notes
When building the WebGL visualiser:
- Use ping-pong framebuffers (two textures, alternate reading/writing each frame)
- Float textures required for precision (OES_texture_float or WebGL2)
- Laplacian computation needs proper boundary conditions
- Consider user painting interface (mouse/touch to add chemical V)
- Preset parameters should be well-tested and labeled intuitively
