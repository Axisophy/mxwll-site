# Site-Wide Audit Report

**Date:** 2026-03-03
**Auditor:** Claude Code (Phase 6)
**Build:** Passing after all fixes applied

---

## 1. Styling Inconsistencies

### Fixed

| Issue | Location | Fix |
|---|---|---|
| Homepage cards used `border` without `rounded-xl` | `src/app/page.tsx` | Added `rounded-xl` to all 6 hero cards |
| Homepage Illustrations section had placeholder text | `src/app/page.tsx` | Replaced "Placeholder secondary text" with proper copy |
| Quote page used `container` class instead of `px-4 md:px-8 lg:px-12` | `src/app/quote/page.tsx` | Rewrote with standard container padding |
| Quote page had dashed-border placeholder | `src/app/quote/page.tsx` | Replaced with styled `bg-secondary rounded-xl` container and "Coming soon" message |
| Work/[slug] page used `container` class (4 instances) | `src/app/work/[slug]/page.tsx` | Rewrote with standard container padding throughout |
| Services page had dashed-border placeholder strip | `src/app/services/page.tsx` | Replaced with 3-column dark work thumbnail grid |

### Remaining (intentional or low priority)

- Homepage uses direct `border border-[var(--border-light)]` on cards instead of solid `bg-[var(--bg-secondary)]` containers. This is intentional - the homepage cards sit on dark backgrounds and use border treatments for differentiation.
- 9 lab pages (asteroid-belt through seismic-anatomy) are thin wrappers that delegate all rendering to their visualiser core. Their internal styling is managed by each visualiser. These were not modified.

---

## 2. Typography Audit

### Sabon and Input Mono

**Status: Completely removed from rendered output.**

- `font-sabon` and `font-input` CSS classes exist in `globals.css` but redirect to NHG via CSS custom properties (`--font-serif: var(--font-text)`, `--font-mono: var(--font-text)`).
- No component uses `font-sabon` or `font-serif` directly in JSX.
- `font-mono` is used in `src/app/lab/permissible-universe/page.tsx` for equation displays and Planck values. This is acceptable - the CSS redirects it to NHG Text 500 with uppercase and letter-spacing, which is the desired mono-replacement behaviour.
- References to Sabon/Input Mono in docs (KNOWN-ISSUES, README, ExplanationModal README) are documentation-only, not rendered.

### NHG Bold Tracking

**Status: Consistent.**

All `font-display ... font-bold` headings include `tracking-[-0.03em]`. Grep for `font-display.*font-bold` across all page files confirmed no instances missing the tracking value.

### Mono-Replacement System

**Status: Consistent.**

The `font-label` class (`NHG Text 500, uppercase, 0.05em tracking`) is used correctly for:
- Category labels (About, Design System pages)
- Metadata labels (Work detail pages)
- Status badges

### Fixed

| Issue | Location | Fix |
|---|---|---|
| Header nav links used `font-text` instead of `font-nhg` | `src/components/Header.tsx` | Changed to `font-nhg` |
| Quote page h1 missing `font-display` | `src/app/quote/page.tsx` | Added `font-display` class |
| Quote page body text missing `font-nhg` | `src/app/quote/page.tsx` | Added `font-nhg` class |
| Contact page h1 missing `font-display` | `src/app/contact/page.tsx` | Added `font-display` class |
| Work/[slug] headings missing `font-display` | `src/app/work/[slug]/page.tsx` | Added throughout |
| Work/[slug] sidebar labels used `h3 font-nhg` | `src/app/work/[slug]/page.tsx` | Changed to `p font-label` pattern |
| Method page labels used `font-nhg text-xs uppercase tracking-wider` | `src/app/method/page.tsx` | Changed to `font-label text-xs` (3 instances) |
| Services page labels used `font-nhg text-xs uppercase tracking-wider` | `src/app/services/page.tsx` | Changed to `font-label text-xs` (6 instances) |

---

## 3. Container System Audit

### Rounded-corner containers (`bg-[var(--bg-secondary)] rounded-xl`)

**Status: Consistent across all pages after fixes.**

Used correctly on:
- About page: all bento cells and CTA
- Method page: all accordion items, nested cards, and CTA
- Services page: all service cards, process steps, and CTA pair
- Lab index: all lab item cards
- Work index: WorkCard component uses `rounded-xl`
- All lab pages (new Phase 1): `rounded-xl bg-[#03060f] overflow-hidden` on visualiser containers
- All work detail pages: same dark container pattern

### Fixed

| Issue | Location | Fix |
|---|---|---|
| Homepage cards missing `rounded-xl` | `src/app/page.tsx` | Added to all 6 cards |
| Quote page placeholder lacked `rounded-xl` | `src/app/quote/page.tsx` | Rewrote with proper container |

---

## 4. Method Page

### Fixed

| Issue | Fix |
|---|---|
| Process diagram was dashed-border placeholder | Replaced with styled 3-step numbered flow diagram (circles, connector lines) |
| Seven-stage explanation arc was dashed-border placeholder | Replaced with bar chart showing 7 stages with heights, descriptions, and labels |
| Audit report mockup was dashed-border placeholder | Replaced with 6-dimension assessment grid (2x3 cards) |
| Visual encoding hierarchy was dashed-border placeholder | Replaced with Cleveland hierarchy ranked bar chart (7 channels) |
| Illustration placeholder was dashed-border placeholder | Replaced with 3-principle grid (Accuracy, Consistency, Clarity) with SVG icons |

All 5 dashed-border placeholders have been replaced with styled, content-appropriate diagrams using the MXWLL container system.

---

## 5. Services Page

### Fixed

| Issue | Fix |
|---|---|
| Work thumbnails placeholder strip | Replaced with 3-column dark card grid (Stellar Cartography, Chart of Nuclides, Gravitational Wave) |
| Label classes inconsistent | Unified to `font-label text-xs` |

### Assessment

The Services page is now polished and consistent. 6 service cards, 3-column process steps, work strip, and dual CTA all follow the design system.

---

## 6. Navigation

### All links verified

| Link | Source | Target | Status |
|---|---|---|---|
| / | Header logo | Homepage | OK |
| /work | Header, Footer | Work index | OK |
| /lab | Header, Footer | Lab index | OK |
| /method | Header, Footer | Method page | OK |
| /services | Header, Footer | Services page | OK |
| /about | Header, Footer | About page | OK |
| /contact | Header, Footer, multiple CTAs | Contact page | OK |
| /quote | Header, Footer, Services CTA | Quote page | OK |
| /work/stellar-cartography | Homepage, Work index | Work detail | OK |
| /work/nuclide-chart | Homepage, Work index | Work detail | OK |
| /work/gravitational-wave | Homepage, Work index | Work detail | OK |
| /work/permissible-universe | Homepage, Work index | Work detail | OK |
| /work/stellar-evolution | Work index | Work detail | OK |
| /work/exoplanet-systems | Work index | Work detail | OK |
| /work/solar-wavelength | Work index | Work detail | OK |
| /lab/permissible-universe | Lab index | Lab page | OK |
| /lab/phyllotaxis | Lab index | Lab page | OK |
| /lab/brownian-motion | Lab index | Lab page | OK |
| /lab/penrose-tiling | Lab index | Lab page | OK |
| /lab/lissajous | Lab index | Lab page | OK |
| /lab/space-filling-curves | Lab index | Lab page | OK |
| /lab/orbital-resonance | Lab index | Lab page | OK |
| All other lab pages | Lab index | Lab pages | OK |

### Work index completeness

7 items: Stellar Cartography, Gravitational Wave, Chart of Nuclides, Stellar Evolution, Exoplanet Systems, Solar Wavelength, What's Inside Your Console. All have correct slugs.

Note: "What's Inside Your Console" links to `/work/whats-inside-your-console` which hits the dynamic `[slug]` route with placeholder content. This is expected - it's a future project.

### Lab index completeness

17 live items + 4 in-development items. All live items have working links. In-development items correctly use `slug: '#'` and are not clickable.

---

## 7. Broken Things

### Fixed

| Issue | Location | Fix |
|---|---|---|
| Work/[slug] template had stale data (lorenz-attractor, quantum-guide) with broken related work links | `src/app/work/[slug]/page.tsx` | Replaced with single valid entry (whats-inside-your-console), removed broken related links |

### Remaining (documented, not fixable in this pass)

| Issue | Notes |
|---|---|
| 9 lab thin-wrapper pages render full dark-themed Bang Industries pages | These need individual conversion to MXWLL template (like was done for Stellar Evolution and Exoplanet Systems work pages). Functional but visually inconsistent with the rest of the site. |
| Exoplanet Systems lab page is an outlier | Unlike the other 9 thin wrappers, this one is a full MXWLL-template page. Inconsistent with other lab pages but higher quality. |
| Design system page has unusual indentation | `py-16` top padding instead of standard `pt-24 md:pt-28 lg:pt-32`. Low priority - it's an internal reference page. |

---

## 8. SEO Basics

### Page titles and meta descriptions

| Page | Title | Description | Status |
|---|---|---|---|
| / (Homepage) | Root layout metadata | Root layout metadata | OK (via layout.tsx) |
| /about | "About - MXWLL" | Yes | **Added** |
| /method | "Method - MXWLL" | Yes | **Added** (via layout.tsx) |
| /services | "Services - MXWLL" | Yes | **Added** |
| /contact | "Contact - MXWLL" | Yes | **Added** (via layout.tsx) |
| /work | "Work - MXWLL" | Yes | **Added** (via layout.tsx) |
| /lab | "Lab - MXWLL" | Yes | **Added** (via layout.tsx) |
| /quote | "Get a Quote - MXWLL" | Yes | **Added** |
| /design-system | Inherits root | Inherits root | OK for internal page |

Work detail pages and lab pages inherit from their respective layout.tsx files.

### Other SEO

- `lang="en-GB"` set on `<html>` tag: OK
- Open Graph tags on root layout: OK
- Twitter card meta on root layout: OK
- `robots: { index: true, follow: true }` on root: OK
- Semantic HTML: `<main>`, `<section>`, `<nav>`, `<footer>` used correctly

---

## 9. Favicon

**Status: Present.**

`src/app/favicon.ico` exists and is served by Next.js automatically.

Note: No Apple touch icon, no web manifest, no SVG favicon. These are nice-to-haves for a future pass.

---

## 10. Contact Form

### Resend integration

**Status: Configured and functional.**

- `RESEND_API_KEY` present in `.env.local`
- `STUDIO_EMAIL` present in `.env.local`
- `BUTTONDOWN_API_KEY` present for newsletter integration
- API route at `/api/contact` includes:
  - Input validation (required fields, length limits, email format)
  - Dual email: notification to studio + auto-reply to enquirer
  - Graceful error handling with fallback message
- API route at `/api/newsletter` handles Buttondown subscription

---

## Summary of Changes Made

### Files modified (13)

1. `src/components/Header.tsx` - `font-text` → `font-nhg` on nav links
2. `src/app/page.tsx` - Added `rounded-xl` to all homepage cards, fixed placeholder text
3. `src/app/quote/page.tsx` - Complete rewrite: container system, font classes, metadata, no dashed placeholder
4. `src/app/contact/page.tsx` - Added `font-display` to h1
5. `src/app/work/[slug]/page.tsx` - Complete rewrite: container padding, font classes, label system, removed stale data
6. `src/app/method/page.tsx` - Replaced 5 dashed placeholders with styled diagrams, fixed label classes
7. `src/app/services/page.tsx` - Fixed label classes, replaced placeholder strip, added metadata
8. `src/app/about/page.tsx` - Added metadata export

### Files created (5)

1. `src/app/method/layout.tsx` - Metadata for Method route
2. `src/app/contact/layout.tsx` - Metadata for Contact route
3. `src/app/work/layout.tsx` - Metadata for Work route
4. `src/app/lab/layout.tsx` - Metadata for Lab route
5. `docs/SITE-AUDIT-REPORT.md` - This report
