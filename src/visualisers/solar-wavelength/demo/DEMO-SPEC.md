# Solar Wavelength - Demo Specification

## Scope
- Autonomous homepage-style demo in `src/visualisers/solar-wavelength/demo/`.
- No interactive controls required.

## Channel order
1. `171` - extreme UV
2. `304` - chromosphere
3. `193` - hot corona
4. `094` fallback `94` - flare regions
5. `HMI_IC` fallback `6173` (visible continuum style attempt, may be unavailable)

## Data source and route contract
- Route: `GET /api/solar`
- Query params:
- `wavelength` (string)
- `date` (ISO timestamp)
- `size` (square image size in px)
- Demo request format:
- `/api/solar?wavelength=<channel>&date=2014-09-10T00:00:00Z&size=512`
- Route returns raw PNG bytes (`Content-Type: image/png`).

## Image loading approach
- All channels preload on mount before animation starts.
- Each image is fetched as a `Blob`, converted to an object URL, and decoded into `HTMLImageElement`.
- If a channel fails, it is skipped silently and loop continues with successful channels.
- Object URLs are revoked on unmount.

## Timing
### Desktop
- Display per channel: `4.0s`
- Crossfade per channel: `1.5s`
- Loop duration:
- 5 channels loaded: `27.5s`
- 4 channels loaded: `22.0s`

### Mobile
- Display per channel: `3.0s`
- Crossfade per channel: `1.5s`
- Loop duration:
- 5 channels loaded: `22.5s`
- 4 channels loaded: `18.0s`

## Rendering
- Canvas is square, centred in container.
- Size = `min(containerWidth, containerHeight, maxSize)` with `maxSize`:
- desktop `600px`
- mobile `320px`
- DPR cap: `Math.min(window.devicePixelRatio, 2)`.
- Circular clipping mask via `ctx.arc(...)` ensures a disc, not a square frame.
- Crossfade uses alpha blend:
- current image at opacity `1`
- next image at opacity `0 -> 1` during transition window.

## Optional label
- Prop: `showLabel` (default `false`).
- Style: `font-input`, `11px`, `rgba(255,255,255,0.6)`.
- Position: bottom-left of canvas.
- Format: `171 Å`.
