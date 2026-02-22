# MXWLL Site

A digital laboratory for science, maths, and explanation design.

Built with Next.js 14+, TypeScript, and Tailwind CSS.

## Project Status

**Phase 1 Complete** - Core site structure and design system implemented.

### What's Built

- ✅ Complete design system with CSS custom properties
- ✅ Design tokens (`brand-kit/visual-system.json`)
- ✅ Header component (desktop sticky + mobile hamburger)
- ✅ Footer component
- ✅ Homepage with featured work and work grid
- ✅ Work index page with typographic filters
- ✅ Work detail page template
- ✅ Method page
- ✅ About page
- ✅ Contact page
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Light mode colours (dark mode tokens prepared)

### What's Next

Priority order:

1. **Font Files** - Add actual font files for Neue Haas Grotesk, Sabon, and Input Mono
   - Input Mono: Download from [input.djr.com](https://input.djr.com)
   - Extract NHG and Sabon from old repo assets
   - Update `src/lib/fonts.ts` with font paths

2. **Logo & Icons** - Extract from archived repo
   - MXWLL logo (SVG)
   - Custom hamburger menu icon
   - Add to Header component

3. **Work Content** - Add real work data
   - Replace placeholder work items in homepage
   - Add actual project content to work pages
   - Add project images/videos

4. **Visualisers** - Integrate existing visualisers
   - Lorenz attractor (from `mxwll-lorenz-loop`)
   - Reaction-diffusion systems
   - Other visualisers from archived repos

5. **Control Panel Component** - Build reusable control panel
   - Based on heartbeatdrummachine.plan8.co aesthetic
   - For visualiser parameters
   - Always dark, even in light mode

6. **Theme Toggle** - Implement dark mode
   - Toggle component in header
   - Persist preference
   - Smooth transition

7. **Content Migration** - Import from old site
   - Bio and credentials
   - Book credits
   - Client list
   - Project details

8. **Deployment** - Deploy to Vercel
   - Set up custom domain
   - Configure environment variables
   - Set up analytics

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + CSS Custom Properties
- **Animation**: Framer Motion
- **Deployment**: Vercel

## Design System

### Colours (Light Mode)

```css
--bg-primary: #FAFAF8;
--bg-secondary: #F0EFED;
--bg-tertiary: #E5E4E1;

--text-primary: #1A1A18;
--text-secondary: #6B6B66;
--text-tertiary: #9B9B95;

--accent: #1A1A18;
--border: #D8D7D4;
```

Dark mode tokens defined in `globals.css` under `[data-theme="dark"]`.

### Typography

- **Neue Haas Grotesk**: Primary sans (400, 500, 700)
- **Sabon**: Serif accent (400, 400 italic)
- **Input Mono**: Monospace (400 only, uppercase with letter-spacing)

Type scale: 11px (xs) → 72px (5xl) with mobile adjustments.

### Spacing

8px base grid: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px

### Breakpoints

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Project Structure

```
mxwll-site/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Homepage
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Design system CSS
│   │   ├── work/
│   │   │   ├── page.tsx             # Work index with filters
│   │   │   └── [slug]/page.tsx      # Work detail pages
│   │   ├── method/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── components/
│   │   ├── Header.tsx               # Sticky header with mobile menu
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── WorkCard.tsx
│   │   └── WorkFilter.tsx           # Typographic filter
│   ├── lib/
│   │   └── fonts.ts                 # Font configuration
│   └── visualisers/                 # Self-contained visualiser modules
└── brand-kit/
    ├── visual-system.json           # Design tokens source of truth
    └── [other brand assets]
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Design Philosophy

**Teenage Engineering aesthetic** - Obsessive functional aesthetics. Every detail considered. Modular. Precision as beauty.

**Fundamental qualities**: Extremely cool, very interesting, but still logical and organised.

**Reference sites**:
- over-stimulated.com - header structure
- losyork.tv/projects - typographic filters
- heartbeatdrummachine.plan8.co - physical UI controls
- jonway.studio - systematic grid

## Brand Voice

- Authoritative without being academic
- Precise without being dry
- Lead with the interesting thing, not the preamble
- British English throughout
- No em dashes - use hyphens
- Never use: innovative, cutting-edge, leverage, synergy, disrupt, stakeholder, solution (unless chemical), utilize, amazing, game-changing, best-in-class, deliverable

## Notes

- Build tested and passing ✓
- All pages rendering correctly
- Mobile responsive
- Using system font fallbacks until actual fonts added
- Dark mode tokens ready but toggle not implemented yet
- Work data currently placeholder - needs real content
- Images/videos need to be added to `/public/work/`

## Questions?

See the handoff document in the project root for complete specifications.
