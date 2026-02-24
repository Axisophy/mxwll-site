# CLAUDE.md - Instructions for Claude Code

Read this file before making any changes to the codebase.

## What This Project Is

MXWLL is an explanation design studio website for Simon Tyler. It showcases interactive visualisations, scientific illustration, and explanation design work. Built with Next.js, TypeScript, and Tailwind CSS.

**Read these files for full context:**
- `SITE-PLAN.md` - the master plan, design rules, and current status
- `LEARNINGS.md` - mistakes we've made and how to avoid them

## Quick Rules

1. **British English** throughout. No Americanisms. "Colour" not "color" (except CSS), "visualisation" not "visualization".
2. **No em dashes** - use hyphens.
3. **Preserve HTML structure** - don't rewrite component hierarchies without reason.
4. **CSS custom properties** - use the design tokens in globals.css, don't hardcode colours or spacing.
5. **Font classes** - use `font-nhg`, `font-sabon`, `font-input`, `font-display` as defined in the codebase.
6. **Commit messages** - be descriptive. Say what changed and why.

## Before You Change Anything

- Check `SITE-PLAN.md` for whether it's been decided already
- Check `LEARNINGS.md` for known pitfalls
- If you fix a bug or learn something non-obvious, **add it to LEARNINGS.md**

## After You Change Something

- Update `SITE-PLAN.md` status if you completed a task
- Add to `LEARNINGS.md` if you hit a problem worth documenting
- Run `npm run build` to verify the build passes before committing

## Visualiser Rules (IMPORTANT)

Visualisers (WebGL, Canvas, Three.js) have caused the most problems. Read `LEARNINGS.md` carefully before touching them.

Key principles:
- Test on mobile viewport sizes (375px width minimum)
- Always clamp zoom (min 1.0, max 20)
- Always clamp pan to prevent content disappearing off-screen
- Use `preserveDrawingBuffer: true` on WebGL contexts
- Handle `devicePixelRatio` properly (cap at 2 on mobile)
- Handle window resize AND fullscreenchange events
- Touch interaction on mobile: two-finger for zoom/pan, single-finger should scroll the page
- Reduce particle/point counts on mobile (`window.innerWidth < 768 ? 25000 : 50000`)

## File Structure

```
src/app/          - Pages (Next.js App Router)
src/components/   - Shared components
src/lib/          - Utilities, fonts, helpers
src/lib/data/     - Curated datasets (cosmic objects, elements, extraction)

src/visualisers/  - Interactive visualisations (from Bang Industries and Maxwell)
src/explanations/ - Video-based or scrollytelling explainers (non-interactive)
src/widgets/      - Reusable UI components (like FlowFieldVisualiser)
```

### Data Assets

Three curated datasets extracted from Maxwell archive (2026-02-23):

**`src/lib/data/cosmic-objects.ts`**
- ~200 cosmic objects from quarks to supermassive black holes
- Mass, radius, category, four-tier explanations (accessible → intuitive → technical → advanced)
- Used by: The Permissible Universe visualiser
- Can be reused for other astronomy/physics content

**`src/lib/data/elements.ts`**
- 118 chemical elements with full properties
- Atomic data, electron configuration, discovery dates
- Available for chemistry visualisations or periodic table

**`src/lib/data/extraction.ts`**
- ~95 extractable materials (metals, gems, industrial, energy)
- ~100+ mine locations with lat/long and production data
- Supply concentration by country, applications, criticality ratings
- Used by: The Extraction Map visualiser (when migration complete)
- Available for sustainability/systems thinking content

### Reusable Components

**`src/components/ExplanationModal/`**
Generic four-tier explanation component. Presents content at four expertise levels based on cognitive science principle of expertise reversal.

**Usage:**
```typescript
import { ExplanationModal } from '@/components/ExplanationModal'

<ExplanationModal
  title="Object Name"
  subtitle="Optional tagline"
  tiers={[
    { level: 'child', label: 'Accessible', content: '...' },
    { level: 'student', label: 'Intuitive', content: '...' },
    { level: 'undergraduate', label: 'Technical', content: '...' },
    { level: 'expert', label: 'Advanced', content: '...' },
  ]}
  isOpen={isOpen}
  onClose={handleClose}
/>
```

Can be used for any multi-audience content. Currently used in design-system page as example.

### Visualiser Directory Structure

Each visualiser follows this pattern:

```
src/visualisers/[name]/
├── README.md           - What it is, how to run, current state
├── SPEC.md             - Design decisions, rejected approaches, intent
├── CHANGELOG.md        - Migration history and updates
├── KNOWN-ISSUES.md     - Bugs, limitations, performance notes
├── core/               - Rendering engine, data, physics/math
├── demo/               - Autonomous demo mode (for homepage/showcase)
│   └── DEMO-SPEC.md    - Demo timeline, camera behaviour
└── interactive/        - User controls, UI, interactive version
```

**Important**: Most code is currently in `core/` with demo and interactive logic mixed together. Separation into `demo/` and `interactive/` is flagged for future work. Do not attempt to separate during initial development - focus on understanding the existing code structure first.

### Explanations Directory

For video-based or predominantly non-interactive pieces:

```
src/explanations/[name]/
├── README.md           - Format, source generation notes
├── SPEC.md
├── CHANGELOG.md
├── KNOWN-ISSUES.md
└── page.tsx            - Page component (may include minimal interactivity)
```

**Note**: If an explanation includes pre-rendered video, the README should state: "Source generation code lives in Jupyter notebooks — not in this repo. Python/Jupyter source should be located and documented separately."

### Widgets Directory

For reusable components used across multiple pages:

```
src/widgets/[name]/
├── README.md           - Usage, props, configuration
├── SPEC.md
├── CHANGELOG.md
├── KNOWN-ISSUES.md
└── [Name].tsx          - Component file
```

Example: `src/widgets/flow-field-visualiser/FlowFieldVisualiser.tsx`

## Design System Quick Reference

**Colours:**
- Background: `#FFFFFF` (white) - use `var(--bg-primary)`
- Text primary: `#000000` - use `var(--text-primary)`
- Text secondary: `#666666` - use `var(--text-secondary)`
- Always use CSS custom properties, never hardcode hex values
- Status colours are Tailwind equivalents (green-500, yellow-500, etc.)

**Breakpoints:**
- Mobile: 0-767px (default, no prefix)
- Tablet: 768-1023px (md:)
- Desktop: 1024px+ (lg:)

**Container Padding:**
- Mobile: `px-4` (16px)
- Tablet: `md:px-8` (32px)
- Desktop: `lg:px-12` (48px)
- Use on: Header, Footer, all pages, design-system

**Header:**
- No border, not sticky
- Padding: `px-4 md:px-8 lg:px-12 py-6`
- Logo h-10, hamburger on mobile (md:hidden)

**Footer:**
- Black background (`bg-black`), white text
- Logo (50% width) on left, nav menu on right
- Grid: `md:grid-cols-[1fr_1fr]`
- Padding: `px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20`
- No border lines, no social links, no location

**Typography:**
- `font-nhg` or `font-display` - Neue Haas Grotesk for headings/UI
- `font-sabon` or `font-serif` - Sabon for prose
- `font-input` or `font-mono` - Input Mono for data/metadata (always uppercase)

## Brand Voice (for any copy changes)

- Authoritative without being academic
- Precise without being dry
- British English, no em dashes
- Never use: innovative, cutting-edge, leverage, synergy, disrupt, stakeholder, solution (unless chemical), utilize, amazing, game-changing, best-in-class, deliverable

## Related Tools & Ecosystem

### Ptolemy Creative Engine
A standalone desktop app (Tauri + Python backend) for generating mathematical art - strange attractors, fractals, algorithmic visualisations. This is the canonical tool for generating source material for pre-rendered explanation pieces.

Source videos/images for pieces in src/explanations/ may originate from Ptolemy. When documenting an explanation piece, note whether its source assets were generated via Ptolemy or standalone Jupyter notebooks (the goal is to migrate all notebook-based generation into Ptolemy over time).

Ptolemy is a separate repo/project - not part of mxwll-site.

## Visualiser Development Queue

See `docs/VISUALISER-ROADMAP.md` for full implementation order, complexity staging, and data requirements.

See `docs/RENDERING-ARCHITECTURE.md` for performance standards and GPU techniques required for high-quality visualisers.

Current phase ordering:

- **Phase 1 (Canvas 2D, low complexity):** Phyllotaxis, Brownian motion, Penrose tiling, Lissajous, Space-filling curves, Orbital resonance.
- **Phase 2 (Canvas 2D/Three.js, medium):** Double pendulum, Boids, Lagrange points, Neuronal firing, Fourier epicycles, Chladni figures, Exoplanet systems.
- **Phase 3 (WebGL/Three.js, medium-high):** Wave tank, Gaia proper motions, Roche limit, Tectonic drift, Atomic orbitals.
- **Phase 4 (Advanced GPU, high):** Physarum, CMB explorer, Black hole accretion.
