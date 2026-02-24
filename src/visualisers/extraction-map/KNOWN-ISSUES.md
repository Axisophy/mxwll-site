# Known Issues - The Extraction Map

**Last Updated:** 2026-02-24

## Migration Status

### Not Yet Migrated
**Status:** Scaffolded only
**Severity:** High (blocking)
**Description:** The Extraction Map migration was started but not completed in the autonomous session due to time constraints and complexity.

**What's Done:**
- ✅ Directory structure created
- ✅ Data extracted to `src/lib/data/extraction.ts`
- ✅ Documentation files created (this file)

**What's Not Done:**
- ❌ Component files not copied from Maxwell archive
- ❌ Mapbox dependencies not installed
- ❌ Page route not created
- ❌ Design system not updated
- ❌ Build not tested

**Reason:** Component is more complex than anticipated with 6 separate content sections, Mapbox GL integration, and significant Maxwell UI dependencies (BreadcrumbFrame, PageHeaderFrame, DataIcon). Autonomous session prioritised completing other critical tasks (navigation updates, documentation) instead of getting blocked on this migration.

## Dependencies

### Mapbox GL JS Not Installed
**Status:** Blocking
**Severity:** High
**Description:** The extraction map requires `mapbox-gl` and `@types/mapbox-gl` packages which are not yet installed.

**Fix Required:**
```bash
npm install mapbox-gl @types/mapbox-gl --save
```

### Mapbox API Key Required
**Status:** Required before testing
**Severity:** High
**Description:** The map component requires a Mapbox API key in environment variables.

**Fix Required:**
1. Create free Mapbox account at https://www.mapbox.com/
2. Generate API token
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
   ```
4. Free tier should be sufficient for MXWLL traffic levels

## Migration Blockers

### Maxwell UI Components
**Status:** Blocking
**Severity:** High
**Description:** The extraction page uses several Maxwell-specific UI components that don't exist in MXWLL:
- `BreadcrumbFrame` from `@/components/ui`
- `PageHeaderFrame` from `@/components/ui`
- `breadcrumbItems` utility
- `DataIcon` from `@/components/icons`

**Fix Required:**
- Remove or replace with MXWLL equivalents
- Simplify header structure (like permissible-universe migration)
- Use standard HTML/Tailwind instead of custom frames

### Multiple Component Files
**Status:** Not migrated
**Severity:** Medium
**Description:** The extraction map consists of 6 separate component files that need to be copied and updated:

1. **ExtractionMapContainer.tsx** (17KB) - Main Mapbox map with material filtering
2. **WhatsInYour.tsx** (7KB) - "What's in your phone/EV/solar panel" sections
3. **Superlatives.tsx** (5.7KB) - Record-breaking mines and extraction sites
4. **SupplyConcentration.tsx** (5KB) - Country-level supply chain data
5. **EnergyTransition.tsx** (8.6KB) - Materials needed for renewable energy
6. **OceanMining.tsx** (6.6KB) - Deep sea mining prospects

Each component needs:
- Import paths updated
- Maxwell UI components removed
- Design system colours and typography applied
- MXWLL font classes used

**Estimated Effort:** 2-3 hours for all 6 components

## Design System Updates

### Light Background Not Applied
**Status:** Not started
**Severity:** Medium
**Description:** Maxwell version uses light grey background (#f5f5f5). MXWLL uses white.

**Fix Required:**
- Change `bg-[#f5f5f5]` to `bg-white` or `var(--bg-primary)`
- Update content section backgrounds
- Update text colours if needed

### Font Classes Not Updated
**Status:** Not started
**Severity:** Low
**Description:** Needs MXWLL semantic font classes:
- Headings: `font-display` or `font-nhg`
- Prose: `font-sabon`
- Data/metadata: `font-input` (uppercase)

## Testing Required

### Mapbox Rendering
**Status:** Not tested
**Severity:** High (when migration complete)
**Description:** Mapbox rendering needs testing on:
- Desktop (Chrome, Safari, Firefox, Edge)
- Mobile (iOS Safari, Chrome Android)
- Different screen sizes (375px to 2560px)

### Mobile Performance
**Status:** Unknown
**Severity:** Medium
**Description:** Mapbox can be heavy on mobile. May need performance optimizations:
- Reduce marker density on mobile
- Simplify 3D terrain on mobile
- Limit zoom range on small screens

### Material Filtering
**Status:** Not tested
**Severity:** High
**Description:** The material filter UI and map marker updates need testing for all ~95 materials in the database.

## Documentation

### SPEC.md Not Written
**Status:** Not started
**Severity:** Medium
**Description:** Design decisions, data sources, rejected approaches not documented.

### DEMO-SPEC.md Not Written
**Status:** Not started
**Severity:** Medium
**Description:** Autonomous demo mode specification not written. Desktop sequence should show:
- Global view → zoom to lithium triangle (Chile/Bolivia/Argentina)
- → zoom to DRC cobalt mines
- → zoom to Chinese rare earth deposits
- Mobile: static map, simplified UI

### CHANGELOG.md Not Written
**Status:** Not started
**Severity:** Low
**Description:** Migration history not documented.

## Next Steps for Future Migration

**Immediate (blocking):**
1. Install Mapbox GL JS dependencies
2. Copy component files from Maxwell archive
3. Create basic page route with SSR disabled
4. Remove Maxwell UI components
5. Verify map renders

**Design system update (medium priority):**
1. Update backgrounds to white
2. Apply MXWLL font classes
3. Use CSS custom properties for colours
4. Test visual consistency with rest of site

**Polish (lower priority):**
1. Mobile performance optimization
2. Demo mode implementation
3. Complete documentation
4. Accessibility improvements

**Estimated Total Time:** 4-6 hours

---

## Priority Order

1. **High:** Complete component migration (copy files, update imports)
2. **High:** Install Mapbox dependencies and get API key
3. **High:** Create page route and verify basic rendering
4. **Medium:** Design system updates
5. **Medium:** Mobile optimization
6. **Low:** Demo mode
7. **Low:** Complete documentation

## Notes

This visualiser was prioritised in the Maxwell audit as "TOP TIER" for migration due to excellent storytelling about material supply chains and relevance to sustainability/systems thinking. It's worth the effort to complete the migration properly rather than rushing it in the autonomous session.

The data is already extracted and ready to use in `src/lib/data/extraction.ts`. The main work is component migration and Mapbox integration.
