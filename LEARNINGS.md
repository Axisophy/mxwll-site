# LEARNINGS.md - Mistakes, Fixes, and Hard-Won Knowledge

**Every agent working on this repo must read this file before making changes.**
**Every agent must add to this file when they learn something non-obvious.**

---

## WebGL / Visualisers

### Gaia Data Fetching (2026-02-22)
- **Problem**: Sync TAP queries to Gaia archive timeout for large datasets
- **Solution**: Use async TAP jobs. Submit query, poll for completion, download results
- **Problem**: Initial fetch only covered RA 0-180° (half the sky)
- **Solution**: Fetch full sky (RA 0-360°) - don't split by quadrant, just use `ORDER BY random_index` with `TOP 50000`
- **What worked**: Direct HTTP to `gea.esac.esa.int/tap-server/tap` with CSV format, no dependencies needed

### Zoom and Pan (2026-02-22)
- **Problem**: Canvas could zoom out smaller than container, or pan entirely off-screen
- **Fix**: Clamp minimum zoom to 1.0, maximum to 20. Clamp pan so content can't leave the viewport
- **Rule**: ALWAYS implement zoom/pan clamping on any new visualiser. Never ship without it.

### Device Pixel Ratio (2026-02-22)
- **Problem**: Visualisers look blurry on retina displays, or render too many pixels on mobile
- **Fix**: Set `canvas.width = clientWidth * devicePixelRatio` (same for height). Pass DPR as uniform to shaders for point size scaling.
- **Rule**: Cap DPR at 2 on mobile devices. High-DPI phones (3x, 4x) don't need that many pixels for WebGL.

### WebGL Context (2026-02-22)
- **Rule**: Always create WebGL context with `preserveDrawingBuffer: true` - needed for screenshots/save functionality
- **Rule**: Always handle both `resize` and `fullscreenchange` events - update canvas size AND viewport

### Mobile Touch Handling
- **Problem**: Touch events on canvas prevent page scrolling
- **Rule**: Single-finger vertical swipe should scroll the page, NOT pan the canvas
- **Rule**: Require tap to "activate" canvas interaction, or use two-finger gestures only
- **Rule**: Touch targets minimum 44px

### Mobile Performance
- **Rule**: Reduce particle/point counts on mobile: `window.innerWidth < 768 ? 25000 : 50000`
- **Rule**: Cap devicePixelRatio at 2
- **Rule**: Test on 375px viewport width minimum

### Stellar Cartography - Specific Issues (2026-02-22)
- HR diagram axis labels: "Hot (Blue)" left, "Cool (Red)" right, "Brighter ↑" top, "Dimmer ↓" bottom
- Transition button should play full cycle: sky → HR (3s) → hold (4s) → HR → sky (3s)
- Mobile control panel should be a bottom sheet (slides up), not floating top-right
- Homepage embed: demo mode only, no user interaction, no control panel, disable touch

### Shader Debugging
- **Tip**: If stars/points aren't rendering, check `gl_PointSize` - it needs to be multiplied by DPR uniform
- **Tip**: If nothing renders at all, check viewport is set correctly after canvas resize
- **Tip**: WebGL errors are silent by default. Use `gl.getError()` after draw calls during development

---

## Next.js / React

### Dynamic Imports for WebGL (2026-02-22)
- **Rule**: Always use `dynamic(() => import(...), { ssr: false })` for any component that uses WebGL, Canvas, or browser APIs
- **Why**: Server-side rendering will crash on `window`, `document`, `WebGLRenderingContext`

### Font Loading
- Currently using Adobe Typekit for some fonts (`use.typekit.net/qka5zju.css`)
- Local font files not yet added (using system fallbacks)
- When adding local fonts: use `next/font/local` in `src/lib/fonts.ts`

---

## CSS / Tailwind

### Design Tokens
- **Rule**: Always use CSS custom properties from globals.css, never hardcode colours
- **Rule**: Use `var(--text-primary)`, `var(--bg-primary)` etc. - this enables dark mode later
- **Exception**: Visualiser backgrounds can use literal dark colours (`#050508` etc.)

### Responsive
- **Rule**: Mobile-first. Test at 375px, 768px, 1024px, 1280px
- **Rule**: Homepage visualiser: `aspect-[4/3]` on mobile, `aspect-[16/10]` on desktop

---

## Copy / Content

### Tone
- Authoritative but not academic
- British English, no Americanisms
- No em dashes - hyphens only
- See SITE-PLAN.md for banned words list

### Product Names
- Keep species Latin names as-is
- Keep mathematical term names as-is (Apollonian Gasket, Ulam Spiral, etc.)
- "Neue Haas Grotesk" not "Neue Haas Grotesk Display" or variants

---

## Git / Workflow

### Commit Messages
- Be descriptive: "Fix zoom clamping on Gaia explorer" not "fix bug"
- If fixing a known issue, reference it

### Build Check
- Always run `npm run build` before committing
- Next.js build will catch TypeScript errors, missing imports, bad JSX

---

## Adding New Entries

When you learn something the hard way, add it here. Format:

```
### Short Title (YYYY-MM-DD)
- **Problem**: What went wrong
- **Solution**: What fixed it
- **Rule**: What to do going forward
```
