# The Extraction Map

**Status:** Migration Scaffolded (Not Complete)
**Last Updated:** 2026-02-24
**Location in site:** /work/extraction-map (not yet created)

## What it is

Interactive world map showing major mining operations and material extraction sites. Users can filter by material (copper, lithium, cobalt, rare earths, etc.) and explore:
- Mine locations with production data
- Supply concentration (which countries control which materials)
- "What's In Your..." sections (phone, EV battery, solar panel)
- Ocean mining potential
- Energy transition material requirements

## Migration Status

**Scaffolded but not complete.** Directory structure created but source code not yet migrated.

## Source Location

Maxwell archive:
- Page: `maxwell-archived-2026-02/src/app/data/earth/extraction/page.tsx`
- Components: `maxwell-archived-2026-02/src/components/data/extraction/`
  - ExtractionMapContainer.tsx (main Mapbox map)
  - WhatsInYour.tsx
  - Superlatives.tsx
  - SupplyConcentration.tsx
  - EnergyTransition.tsx
  - OceanMining.tsx

## Dependencies

- **Mapbox GL JS** (`mapbox-gl`, `@types/mapbox-gl`) - NOT YET INSTALLED
- **Mapbox API key** - Required in .env.local as `NEXT_PUBLIC_MAPBOX_TOKEN`
- Data source: `src/lib/data/extraction.ts` (already extracted ✓)

## Migration Steps Required

1. Install Mapbox dependencies:
   ```bash
   npm install mapbox-gl @types/mapbox-gl --save
   ```

2. Copy component files from Maxwell archive:
   - Copy all 6 components from `maxwell-archived-2026-02/src/components/data/extraction/` to `src/visualisers/extraction-map/core/components/`
   - Copy page.tsx to `src/visualisers/extraction-map/core/ExtractionMap.tsx`

3. Update imports:
   - Remove `@/components/ui` (BreadcrumbFrame, PageHeaderFrame, breadcrumbItems)
   - Remove `@/components/icons` (DataIcon)
   - Update data imports to use `@/lib/data/extraction`
   - Simplify header to match MXWLL design system

4. Create page route:
   - Create `src/app/work/extraction-map/page.tsx`
   - Dynamic import with `{ ssr: false }` for Mapbox

5. Update styling:
   - Change from light grey background (#f5f5f5) to white
   - Use MXWLL design system colours and typography
   - Update font classes (font-display, font-sabon, font-input)

6. Test Mapbox integration:
   - Verify Mapbox token works
   - Test map rendering on desktop and mobile
   - Test material filtering
   - Test flyTo functionality

7. Documentation:
   - Fill in SPEC.md with design decisions
   - Complete CHANGELOG.md
   - Complete KNOWN-ISSUES.md
   - Complete DEMO-SPEC.md

8. Verify build passes

## Complexity

**High** - Multiple components, Mapbox integration, significant Maxwell UI dependencies

## Estimated Effort

4-6 hours for complete migration including:
- Component extraction and cleanup (2-3 hours)
- Design system updates (1-2 hours)
- Testing and debugging (1-2 hours)
- Documentation (30 minutes)

## Notes

Migration was started but not completed in the autonomous session due to time constraints. The component is more complex than Permissible Universe with 6 separate content sections and Mapbox dependency. Prioritised completing other tasks (navigation, documentation) instead.

See KNOWN-ISSUES.md for blocking issues and next steps.
