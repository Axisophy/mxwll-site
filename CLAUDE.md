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
src/app/work/stellar-cartography/  - Gaia star visualiser
```

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
