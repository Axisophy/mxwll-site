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

### Canvas and Browser API Mocks for Tests (2026-02-23)
- **Problem**: jsdom does not implement canvas/WebGL and some browser APIs used by interactive components.
- **Solution**: Define minimal stubs in `src/test/setup.ts` for `HTMLCanvasElement.getContext` (`2d`, `webgl`, `webgl2`), `ResizeObserver`, `requestAnimationFrame`, and `matchMedia`.
- **Rule**: Keep test environment mocks minimal and interface-level only - no rendering behaviour in setup stubs.

### Stable Callback Props for Effects (2026-02-23)
- **Problem**: A mobile menu closed immediately after opening because `useEffect` depended on an `onClose` prop passed as an inline function, so it changed identity on every render.
- **Solution**: Wrap callback props like `onClose` in `useCallback` when child effects depend on them.
- **Rule**: If a child `useEffect` includes a callback prop in its dependency array, pass a stable callback reference from the parent.

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

### Vitest Version Compatibility (2026-02-23)
- **Problem**: `vitest@3` pulled in a Vite/Node combination that failed to load config on Node 20.15.x.
- **Solution**: Use `vitest@1.6.x` in this repo for local compatibility.
- **Rule**: If test runner config fails with ESM/CJS loader errors, check Node engine requirements and pin a compatible Vitest major version.

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

### Stellar Cartography Demo Projection (2026-02-24)
- **Problem**: Sky view vertical fill looked compressed because Dec was mapped to half NDC height (`-0.5..0.5`) instead of full height.
- **Solution**: Map Dec directly across full range (`-90..+90` -> `-1..+1`) for equirectangular projection in demo rendering.
- **Rule**: For full-sky equirectangular views, never scale Dec to a reduced vertical range unless intentionally letterboxing.

### Homepage Demo Split (2026-02-24)
- **Problem**: Homepage demo behaviour and interactive work-page behaviour were coupled, making mobile and performance tuning harder.
- **Solution**: Split homepage demo into dedicated desktop/mobile components with shared utilities and explicit loop timing.
- **Rule**: Keep homepage demos isolated from interactive visualiser code paths so performance tradeoffs can diverge safely.

### Gaia Export Field Schema (2026-02-27)
- **Problem**: It is easy to assume the regenerated Gaia JSON keeps source photometry fields from the TAP query.
- **Solution**: Verify field presence directly in `public/data/gaia-stars.json` before wiring shader logic. Current export stores `ra`, `dec`, `bp_rp`, `abs_mag`, `teff` only.
- **Rule**: Treat `phot_g_mean_mag` as unavailable at runtime unless explicitly added to the export script and JSON schema.
