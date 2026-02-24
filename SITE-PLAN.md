# SITE-PLAN.md - Master Plan for MXWLL

Last updated: 2026-02-24

## Vision

MXWLL is an explanation design studio. The site needs to do two things:
1. Showcase the work (interactive visualisations, illustration, explanation design)
2. Attract clients (research institutions, publishers, museums, organisations)

**Design spirit**: Teenage Engineering. Obsessive functional aesthetics. Precision as beauty. Tools that look like they were designed by someone who cares deeply about both how things work and how they look.

## Navigation

Work / Lab / Method / About / Contact

- **Work**: Client-facing projects and portfolio pieces (static cards for now, interactive pages later)
- **Lab**: Experiments, visualisers, generative work (this is where the interactive demos live)
- **Method**: Explanation design methodology, process, services
- **About**: Simon Tyler bio, capabilities, books, background
- **Contact**: Email, location, social links

## Design System

### Typography
- **Neue Haas Grotesk**: Primary sans (400, 500, 700) - headlines, nav, body, UI
- **Sabon**: Serif accent (400, 400i) - longer prose, editorial moments
- **Input Mono**: Monospace (400) - metadata, labels, technical annotations. Uppercase + letter-spacing: 0.08em
- No em dashes anywhere - hyphens only
- British English throughout

### Colours (Light Mode)
```
--bg-primary:     #FAFAF8   (warm off-white)
--text-primary:   #1A1A18   (warm near-black)
--text-secondary: #6B6B66   (mid grey)
--text-tertiary:  #9B9B95   (light grey)
--border:         #D8D7D4   (subtle warm border)
```
Dark mode tokens are defined but not yet active.

### Spacing
8px base grid. All spacing multiples of 8.

### Breakpoints
sm: 640px / md: 768px / lg: 1024px / xl: 1280px / 2xl: 1536px

## Current Status

### Done ✅
- [x] Site scaffolding (Next.js, Tailwind, App Router)
- [x] Design system (CSS custom properties, tokens)
- [x] Header (desktop sticky + mobile hamburger)
- [x] Footer
- [x] Homepage with hero, stellar cartography embed, selected work, methodology teaser, CTA
- [x] Work index page with filters
- [x] Work detail page template
- [x] Method page (full methodology, process, services)
- [x] About page (bio, five capabilities, books, background)
- [x] Contact page
- [x] Lab page (experiments listing)
- [x] All pages populated with real copy
- [x] Responsive layout
- [x] Stellar Cartography visualiser (Gaia DR3, 50K stars, sky/HR transition)
- [x] Gaia data fetched (50K stars full-sky via async TAP queries)
- [x] Stellar Cartography homepage demo split (separate desktop/mobile demo components)
- [x] OG/Twitter meta tags
- [x] Robots directive
- [x] Scaffolding for 11 new Lab visualisers with docs (Fourier Epicycles, Physarum, Double Pendulum, Chladni Figures, Wave Tank, Exoplanet Systems, CMB Explorer, Lissajous, Space-filling Curves, Gaia Proper Motions, Boids)

### MVP Remaining 🔴
- [ ] Static work cards with images (need project images from Simon)
- [ ] Favicon (need to design or extract from old repo)
- [ ] OG image (social sharing preview)
- [ ] Analytics (Vercel Analytics or similar)
- [ ] SEO basics (sitemap.xml, robots.txt)
- [ ] Competitor keyword research
- [ ] Verify hello@mxwll.io email
- [ ] Deploy to Vercel with custom domain
- [ ] Make GitHub repo private again

### V2 (After MVP) 🔜
- [ ] Font files (actual Neue Haas Grotesk, Sabon, Input Mono - currently system fallbacks)
- [ ] Dark mode toggle
- [ ] Individual work pages with real content
- [ ] Gravitational Wave visualiser (port from Bang Industries)
- [ ] Stellar Cartography fixes (zoom clamping, mobile, pan limits)
- [ ] Stellar Cartography mobile handling (homepage embed vs work page)
- [ ] Emergent Currents visualiser
- [ ] Lorenz Attractor visualiser
- [ ] Control panel component (glass-morphism, heartbeat drum machine aesthetic)
- [ ] Live header widget
- [ ] Work card video thumbnails (autoplay on hover)
- [ ] Ballpark pricing tool (like ballpark.ing)
- [ ] Interactive Insect Anatomy Explorer

## Work Items (the 6 portfolio projects)

These are the projects shown on the Work page. For MVP they're static cards. Later each gets its own interactive page.

1. **Chart of Nuclides** - "A Beginner's Guide" - Nuclear physics interactive explorer
2. **Stellar Evolution** - "A map of how stars live and die" - HR diagram explorer
3. **Gravitational Wave Detection** - "How LIGO found a whisper from 1.3 billion years ago" - WebAudio interactive
4. **Network Effects and Market Timing** - "Why your competitor's head start doesn't matter" - Strategy framework
5. **Orbital Mechanics** - "A Beginner's Guide" - Space navigation interactive
6. **What's Inside Your Console?** - "A guide for gamers aged 8-12" - Kids tech explainer

## Lab Items (experiments)

1. **Stellar Cartography** - 50K Gaia stars, sky/HR transition (LIVE)
2. **Emergent Currents** - Curl noise particle flow (IN DEVELOPMENT)
3. **Lorenz Attractor** - Chaos theory 3D visualiser (IN DEVELOPMENT)

## Services Offered

1. **Visual Audit + Redesign Sprint** (3-5 days)
2. **Explanation Design** (2-4 weeks)
3. **Interactive Explanations** (4-8 weeks)
4. **Adaptive Explanation Systems** (custom)

## Banned Words

Never use in any copy on this site:
innovative, cutting-edge, leverage, synergy, disrupt, stakeholder, solution (unless chemical), utilize, amazing, game-changing, best-in-class, deliverable

## Key URLs

- Site: mxwll.io (not yet live)
- Email: hello@mxwll.io
- Repo: github.com/Axisophy/mxwll-site
- Simon's other sites: axisophy.com, elxsis.com
