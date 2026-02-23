# Maxwell Archive Audit Report

**Date:** 2026-02-23
**Archive Location:** `maxwell-archived-2026-02/`
**Auditor:** Claude Code
**Purpose:** Identify reusable content, visualisations, and code suitable for migration to MXWLL portfolio site

---

## Executive Summary

The Maxwell archive contains a **real-time data observatory platform** with extensive API integrations, interactive visualisations, and educational content. The site focused on observing Earth systems, space phenomena, and fundamental science in real-time.

**Key Findings:**
- 2 major explanation pieces with high MXWLL potential (Permissible Universe, Extraction Map)
- 30+ real-time data widgets (most require live API endpoints)
- Interactive Periodic Table and Lunar Atlas
- Several attractor visualisations (Lorenz, Rossler, Aizawa)
- Comprehensive element/nuclide datasets
- Extensive API infrastructure (40+ endpoints for real-time data)

**Overall Assessment:** The archive contains excellent explanation design work, but most widgets depend on live APIs that may not be sustainable for MXWLL. Priority should be given to standalone visualisations and the two major explanation pieces.

---

## 1. VISUALISERS & INTERACTIVE COMPONENTS

### 1.1 The Permissible Universe ⭐⭐⭐
**Location:** `src/app/data/fabric/permissible-universe/`
**Size:** 17 files, ~3,147 lines of code
**Technology:** React, Canvas, custom coordinate transformations

**What it does:**
Interactive mass-radius diagram showing everything that can exist in the universe - from subatomic particles to supermassive black holes. Users can explore ~200 cosmic objects (planets, stars, black holes, fundamental particles, spacecraft) positioned according to physical limits (Schwarzschild radius, electron degeneracy, etc.).

**Features:**
- Log-log scatter plot with pan/zoom
- Object categories (fundamental particles, atoms, molecules, spacecraft, biology, planets, stars, neutron stars, black holes)
- Search functionality
- Detailed object modals with 4 levels of explanation (child → student → undergraduate → expert)
- Boundary lines (Schwarzschild radius, quantum degeneracy, etc.)
- "Big Questions" mode (dark matter candidates, EM spectrum overlay)
- Epochs mode (showing early universe timeline)

**Complexity:** High - sophisticated coordinate math, extensive data curation

**Condition:** Appears complete - comprehensive object database, fully functional UI

**MXWLL Potential:** ⭐⭐⭐ **HIGH**
This is portfolio-grade explanation design. Could be a Lab piece or featured in Data section. Standalone - no API dependencies.

**Migration Notes:**
- All data is embedded (no external APIs)
- Would benefit from visual refinement to match MXWLL design system
- The 4-tier explanation system is excellent and could be reused elsewhere
- Object database could be extended with more examples

---

### 1.2 The Extraction Map ⭐⭐⭐
**Location:** `src/app/data/earth/extraction/page.tsx`, `src/components/data/extraction/`
**Size:** ~800 lines across 6 components
**Technology:** Mapbox GL JS, React

**What it does:**
Interactive world map showing major mining operations and material extraction sites. Users can filter by material (copper, lithium, cobalt, rare earths, etc.) and see:
- Mine locations with production data
- Supply concentration (which countries control which materials)
- "What's In Your..." sections (phone, EV battery, solar panel)
- Ocean mining potential
- Energy transition material requirements

**Features:**
- Mapbox 3D globe/map with custom pins
- Material filtering
- InfoPanel with production statistics
- Content sections with interactive material selection
- Responsive design

**Complexity:** Medium-High - Mapbox integration, geographic data

**Condition:** Complete - appears fully functional with extensive data

**MXWLL Potential:** ⭐⭐⭐ **HIGH**
Excellent storytelling about material supply chains. Highly relevant for sustainability/systems thinking. Would fit MXWLL's explanation design focus.

**Migration Notes:**
- **Requires Mapbox API key** (included in .env.local in archive)
- Mine location data is embedded (no API calls needed)
- Would need design system updates for MXWLL branding
- Could be expanded with more materials or supply chain visualisations

---

### 1.3 Interactive Periodic Table ⭐⭐
**Location:** `src/app/data/elements/periodic-table/`, `src/components/data/elements/`
**Size:** ~600 lines
**Technology:** React, SVG

**What it does:**
Interactive periodic table with element selection, property highlighting, and detail panels. Shows:
- 118 elements in classic periodic table layout
- Category colouring (metals, nonmetals, noble gases, etc.)
- Element detail panel with atomic data
- Spectral line strip (visual representation)
- Lens bar (property-based highlighting)

**Complexity:** Medium - mostly data display, some SVG rendering

**Condition:** Complete - functional with full element dataset

**MXWLL Potential:** ⭐⭐ **MEDIUM**
Solid educational tool but not unique. Many good periodic tables exist. Could be useful as a Lab piece or reference tool.

**Migration Notes:**
- Element data is comprehensive (`elementsData.ts` - ~118 elements with properties)
- No API dependencies
- Would need visual polish to stand out
- Could be enhanced with more interactive exploration modes

---

### 1.4 Lunar Atlas ⭐⭐
**Location:** `src/app/observe/space/lunar-atlas/`
**Size:** ~1,063 lines across 4 files
**Technology:** WebGL, Three.js, lunar texture maps

**What it does:**
Interactive 3D moon viewer with selectable terrain features (maria, craters, landing sites). Features:
- WebGL sphere with high-resolution lunar textures
- Named features (maria, craters, Apollo sites)
- Layer toggles (nomenclature, missions, geology)
- Info panel with feature details
- Mouse/touch rotation

**Complexity:** Medium-High - WebGL, texture loading, 3D math

**Condition:** Appears complete - functional with full feature database

**MXWLL Potential:** ⭐⭐ **MEDIUM**
Polished WebGL piece but fairly standard moon viewer. Could be Lab content or standalone widget.

**Migration Notes:**
- Uses public lunar textures (URL in code)
- Feature data embedded (~200 named locations)
- No API dependencies
- Mobile performance would need testing
- Could be enhanced with more layers or storytelling

---

### 1.5 Strange Attractors (Lorenz, Rossler, Aizawa) ⭐⭐
**Location:**
- `src/components/widgets/LorenzAttractor.tsx`
- `src/components/widgets/RosslerAttractor.tsx`
- `src/components/widgets/AizawaAttractor.tsx`
- `src/app/play/attractors/aizawa/page.tsx`

**Technology:** Canvas 2D, WebGL (varies by attractor), real-time numerical integration

**What they do:**
Real-time chaos theory visualisations - particles tracing strange attractor trajectories. Each shows different chaotic system (Lorenz weather model, Rossler oscillator, Aizawa torus).

**Complexity:** Medium - differential equation solvers, particle rendering

**Condition:** Mix of widget versions (compact) and full-page versions. Appear functional.

**MXWLL Potential:** ⭐⭐ **MEDIUM**
Beautiful generative visuals. Could be Lab/Play pieces or homepage background elements. **Note:** Ptolemy Creative Engine may supersede these for art generation.

**Migration Notes:**
- Self-contained (no APIs)
- Could be extracted as standalone widgets
- Would fit MXWLL's mathematics/pattern exploration themes
- Consider consolidating into single "Attractors" visualiser with multiple modes

---

### 1.6 Fractals & Patterns ⭐
**Location:** `src/app/play/fractals/`, `src/app/play/patterns/`

**Technology:** Canvas rendering, likely iterative algorithms

**What it does:** Purpose unclear from directory structure alone - would need code inspection.

**Complexity:** Unknown without code inspection

**Condition:** Unknown

**MXWLL Potential:** ⭐ **LOW-MEDIUM**
Depends on implementation quality. MXWLL already has fractal explorers from Bang Industries migration.

**Migration Notes:**
- Inspect code to determine if worth migrating
- Bang Industries already provided Mandelbrot/Julia explorers
- May be redundant

---

### 1.7 Real-Time Data Widgets (30+) ⚠️
**Location:** `src/components/widgets/`

Examples include:
- `NeutrinoWatch.tsx` - Neutrino detection alerts
- `SeismicPulse.tsx` - Live earthquake feed
- `ActiveFires.tsx` - NASA FIRMS fire data
- `GravitationalWaves.tsx` - LIGO detection events
- `AuroraForecast.tsx` - NOAA space weather
- `MarsRover.tsx` - Latest Mars rover images
- `eBirdLive.tsx` - Recent bird observations
- `LaunchCountdown.tsx` - Upcoming rocket launches
- `CosmicRayMonitor.tsx` - Cosmic ray flux
- `OceanHydrophones.tsx` - Underwater audio streams
- `EarthquakesLive.tsx` - USGS seismic feed
- `LightTravel.tsx` - Photon journey visualisation (?)
- `WorldPopulation.tsx` - Real-time population counter
- `EuropeanRadiationMap.tsx` - Nuclear monitoring

**Technology:** React, API integrations (fetch), real-time updates

**What they do:**
Display live data from external APIs - earthquakes, space weather, wildlife observations, particle physics detectors, etc. Most refresh on intervals (1-60 minutes).

**Complexity:** Low-Medium individually - mostly API fetching and data display

**Condition:** **Depends on API availability** - many rely on external services that may no longer be accessible or require API keys

**MXWLL Potential:** ⚠️ **LOW** (API dependency risk)
These were the core of Maxwell's "observe the world in real-time" concept. Most are not suitable for MXWLL unless:
1. APIs are still functional and free
2. Willing to maintain API endpoints
3. Content aligns with MXWLL's explanation design focus (not just data dashboards)

**Migration Notes:**
- Check each API endpoint before considering migration
- Many require API keys (stored in .env.local)
- Some may have rate limits or cost
- `WorldPopulation` and `LightTravel` might be self-contained (worth checking)
- Most are dashboards rather than explanation pieces

---

### 1.8 Game Theory Handheld ⭐⭐
**Location:** `src/components/widgets/GameTheoryHandheld.tsx`

**What it does:** Purpose unclear from filename - likely a game theory simulation or interactive game

**Complexity:** Unknown without inspection

**MXWLL Potential:** ⭐⭐ **MEDIUM**
Game theory visualisations can be excellent explanation tools (e.g., prisoner's dilemma, tragedy of commons). Worth inspecting.

**Migration Notes:**
- Inspect to determine if it's a reusable explanation tool
- Could fit MXWLL's systems thinking / mathematics themes

---

### 1.9 Scientific Calculator ⭐
**Location:** `src/components/widgets/ScientificCalculator.tsx`, `src/app/tools/calculator/`

**What it does:** In-browser scientific calculator

**Complexity:** Medium

**MXWLL Potential:** ⭐ **LOW**
Utility tool rather than explanation piece. Not portfolio-worthy.

---

### 1.10 The Plotter ⭐⭐
**Location:** `src/components/widgets/ThePlotter.tsx`

**What it does:** Purpose unclear - likely a function plotter or data visualisation tool

**Complexity:** Unknown

**MXWLL Potential:** ⭐⭐ **MEDIUM**
If it's a mathematical function plotter, could be useful for Lab/Tools section

---

## 2. EXPLANATION & SCIENCE CONTENT

### 2.1 The Permissible Universe (see 1.1)
**Format:** Interactive visualisation + explanation
**Topic:** Physical limits of objects in the universe
**Apparent Completeness:** Complete - comprehensive content with 4-tier explanation system
**MXWLL Fit:** Excellent - this is high-quality explanation design

---

### 2.2 The Extraction Map (see 1.2)
**Format:** Interactive map + scrollable content sections
**Topic:** Geography of mining and material extraction
**Apparent Completeness:** Complete - extensive data and content sections
**MXWLL Fit:** Excellent - systems thinking about material supply chains

---

### 2.3 Data Section - Overview Pages
**Locations:**
- `src/app/data/cosmos/` - Solar system overview pages (Sun, Earth, Mars, Neptune, etc.)
- `src/app/data/earth/` - Earth systems (geology, life, civilisation)
- `src/app/data/life/` - Biology overview (?)
- `src/app/data/mathematics/` - Mathematics overview (?)
- `src/app/data/society/` - Society overview (?)
- `src/app/data/units/` - Units of measurement (?)

**Format:** Likely static/semi-interactive reference pages

**Apparent Completeness:** Unknown without inspection - likely mix of complete and placeholder content

**MXWLL Potential:** ⭐ **LOW-MEDIUM**
These appear to be reference/encyclopedia pages rather than narrative explanations. May contain useful content but likely not portfolio pieces.

**Note:** Would need code inspection to assess completeness and quality

---

### 2.4 Living Network
**Location:** `src/app/data/living-network/`, `src/components/living-network/`

**What it is:** Biology/ecology content - appears to be taxonomy browser or biodiversity visualisation

**Format:** Unknown without inspection

**MXWLL Potential:** ⭐⭐ **MEDIUM**
If it's a well-designed taxonomy explorer, could be interesting. Depends on implementation quality.

---

### 2.5 Vault Section
**Location:** `src/app/vault/`, `content/vault/`

**What it is:** Content library organised by era (Ancient, Renaissance, Modern, Scientific Fiction). Only one MDX file found: `origin-of-species.mdx`

**Format:** MDX content pages

**Apparent Completeness:** Mostly empty - appears to be a planned content library that was barely populated

**MXWLL Potential:** ⭐ **LOW**
Insufficient content. The concept (curated historical scientific texts) is interesting but largely unimplemented.

---

### 2.6 Pulse Section
**Location:** `src/app/pulse/`, `content/pulse/`

**What it is:** Blog/articles section (appears to be news or updates about real-time phenomena)

**Format:** MDX content pages

**MXWLL Potential:** ⭐ **LOW**
Content blog - not relevant to MXWLL's portfolio focus

---

## 3. DATA ASSETS

### 3.1 Element Database ⭐⭐⭐
**Location:** `src/components/data/elements/elementsData.ts`

**Content:** Complete dataset of 118 chemical elements with:
- Atomic number, symbol, name
- Category (metal, nonmetal, etc.)
- Atomic mass
- Electron configuration
- Discovery date
- Properties (melting point, boiling point, density, etc.)

**Quality:** Comprehensive and accurate

**Reuse Potential:** ⭐⭐⭐ **HIGH**
Could power periodic table, chemistry visualisations, or element-based explanations

---

### 3.2 Cosmic Objects Database ⭐⭐⭐
**Location:** `src/app/data/fabric/permissible-universe/lib/objects.ts`, `objects-part2.ts`

**Content:** ~200 cosmic objects with:
- Mass (kg)
- Radius (m)
- Category
- Description
- Discovery info
- Detailed explanations (4 levels)

**Objects include:** Subatomic particles, atoms, molecules, viruses, cells, organisms, spacecraft, asteroids, planets, moons, stars, neutron stars, black holes, galaxies

**Quality:** Extensive curation - appears scientifically accurate

**Reuse Potential:** ⭐⭐⭐ **HIGH**
Valuable dataset for astronomy/physics explanations. Could be used in multiple MXWLL pieces.

---

### 3.3 Lunar Features Database ⭐⭐
**Location:** `src/app/observe/space/lunar-atlas/` (embedded in component)

**Content:** ~200 named lunar features:
- Craters (Copernicus, Tycho, Clavius, etc.)
- Maria (seas)
- Highlands
- Apollo landing sites
- Other notable features

**Reuse Potential:** ⭐⭐ **MEDIUM**
Useful if doing lunar content. Fairly standard dataset.

---

### 3.4 Mining/Extraction Data ⭐⭐⭐
**Location:** `src/components/data/extraction/` (embedded in components)

**Content:**
- Mine locations (lat/long, production data)
- Material supply concentration by country
- Energy transition material requirements
- "What's in your..." breakdowns (phone, EV, solar panel)

**Quality:** Appears well-researched

**Reuse Potential:** ⭐⭐⭐ **HIGH**
Valuable for sustainability/systems explanations

---

### 3.5 Nuclide Database ⭐⭐⭐
**Location:** `src/app/data/elements/nuclides/` (likely)

**Content:** Unknown without inspection - likely nuclear isotope data

**Reuse Potential:** ⭐⭐⭐ **HIGH IF EXISTS**
Bang Industries already has nuclide data - compare to see which is more complete

---

## 4. REUSABLE CODE / UTILITIES

### 4.1 Coordinate Transformation System ⭐⭐⭐
**Location:** `src/app/data/fabric/permissible-universe/lib/` (embedded in visualisation code)

**What it does:** Log-log coordinate transforms for mass-radius diagram with pan/zoom

**Quality:** Sophisticated - handles extreme scales (10^-35 to 10^40)

**Reuse Potential:** ⭐⭐⭐ **HIGH**
Could be extracted as utility for any log-scale visualisations

---

### 4.2 Mapbox Integration Pattern ⭐⭐
**Location:** `src/components/data/extraction/ExtractionMapContainer.tsx`

**What it provides:** React wrapper for Mapbox GL with ref-based control pattern

**Quality:** Functional

**Reuse Potential:** ⭐⭐ **MEDIUM**
Useful if doing more map-based work, but fairly standard Mapbox integration

---

### 4.3 Modal with Tiered Explanations ⭐⭐⭐
**Location:** `src/app/data/fabric/permissible-universe/components/ObjectModal.tsx`

**What it does:** 4-level explanation system (child → student → undergrad → expert) with toggle UI

**Quality:** Excellent UX pattern

**Reuse Potential:** ⭐⭐⭐ **HIGH**
Could be extracted as reusable component for any multi-audience content. This is a great explanation design pattern.

---

### 4.4 Differential Equation Solvers ⭐⭐
**Location:** Embedded in attractor components (`LorenzAttractor.tsx`, etc.)

**What they do:** Runge-Kutta integrators for chaotic systems

**Quality:** Standard implementations

**Reuse Potential:** ⭐⭐ **MEDIUM**
Useful for any physics simulations, but Ptolemy Creative Engine may supersede this need

---

### 4.5 API Fetching Patterns ⭐
**Location:** Throughout `src/app/api/` and widget components

**What they provide:** Fetch wrappers, caching, error handling

**Quality:** Functional but standard

**Reuse Potential:** ⭐ **LOW**
Standard patterns - not worth extracting unless consolidating many API integrations

---

### 4.6 Breadcrumb & UI Shell Components ⭐⭐
**Location:** `src/components/ui/` (likely)

**What they provide:** Page shells, breadcrumb navigation, header frames

**Quality:** Unknown without inspection

**Reuse Potential:** ⭐⭐ **MEDIUM**
May have useful UI patterns, but MXWLL already has its own design system

---

## 5. WIDGETS SUITABLE FOR src/widgets/

### Recommendation: Extract with Caution ⚠️

Most Maxwell "widgets" are tightly coupled to real-time APIs and designed for dashboard display rather than standalone explanation pieces. **Before migrating any widget:**
1. Verify API still works and is free/sustainable
2. Assess whether it tells a story (explanation) vs. just displays data (dashboard)
3. Check if it can function without live data (using mock/historical data)

### Potentially Suitable Widgets:

#### 5.1 LightTravel.tsx ⭐⭐
**If self-contained** (no API), could be interesting "photon journey from Sun to Earth" visualisation

#### 5.2 YourAirsJourney.tsx ⭐⭐
**If self-contained**, could be atmospheric circulation visualisation

#### 5.3 WorldPopulation.tsx ⭐⭐
**If algorithmic** (calculated, not API-fetched), could work as demographic counter

#### 5.4 Strange Attractors ⭐⭐
LorenzAttractor, RosslerAttractor, AizawaAttractor - self-contained, no APIs

#### 5.5 GameTheoryHandheld.tsx ⭐⭐
Depends on implementation - if it's an interactive game theory simulation, could work

### Not Suitable (API-Dependent):
All the real-time observation widgets (earthquakes, fires, neutrinos, cosmic rays, aurora, etc.) require external APIs and are dashboard-focused rather than explanation-focused.

---

## 6. PRIORITY CANDIDATES FOR MXWLL MIGRATION

Based on quality, completeness, standalone nature, and alignment with MXWLL's explanation design focus:

### TOP TIER (Immediate Migration Candidates)

#### 1. The Permissible Universe ⭐⭐⭐
**Why:** Portfolio-grade explanation piece. Sophisticated visualisation, excellent content, 4-tier explanation system. Standalone (no APIs). Aligns perfectly with MXWLL's "explain science visually" mission.

**Effort:** High (needs design system integration, code refactoring)
**Destination:** `src/visualisers/permissible-universe/` OR featured Lab piece
**Dependencies:** None - fully self-contained
**Migration Strategy:**
1. Extract as visualiser with full documentation
2. Refactor coordinate math into `core/`
3. Update styling to MXWLL design system
4. Consider expanding object database
5. Reuse 4-tier explanation pattern elsewhere

---

#### 2. The Extraction Map ⭐⭐⭐
**Why:** Excellent storytelling about material supply chains. Relevant to sustainability/systems thinking. High-quality content and data. Mostly standalone (needs Mapbox key).

**Effort:** Medium (Mapbox integration already done, needs styling updates)
**Destination:** `src/visualisers/extraction-map/` OR featured Data piece
**Dependencies:** Mapbox API key (free tier should suffice)
**Migration Strategy:**
1. Extract as visualiser
2. Verify Mapbox key in MXWLL account
3. Update design system
4. Consider expanding material coverage
5. Add more "What's in your..." sections

---

### HIGH PRIORITY

#### 3. Cosmic Objects Database ⭐⭐⭐
**Why:** Valuable dataset. Could power multiple MXWLL pieces beyond just Permissible Universe.

**Effort:** Low (data extraction)
**Destination:** `src/lib/data/cosmic-objects.ts`
**Migration Strategy:** Extract as standalone data file for reuse across site

---

#### 4. Element Database ⭐⭐⭐
**Why:** Complete, accurate chemical element data. Could power chemistry visualisations.

**Effort:** Low (data extraction)
**Destination:** `src/lib/data/elements.ts`
**Migration Strategy:**
1. Extract data
2. Compare with any existing element data in MXWLL
3. Use for periodic table or chemistry pieces

---

#### 5. Mining/Extraction Data ⭐⭐⭐
**Why:** Well-researched supply chain data. Valuable for sustainability content.

**Effort:** Low (data extraction)
**Destination:** `src/lib/data/extraction.ts`
**Migration Strategy:** Extract alongside Extraction Map migration

---

### MEDIUM PRIORITY (Consider After Top Tier)

#### 6. Tiered Explanation Modal Pattern ⭐⭐⭐
**Why:** Excellent UX pattern for multi-audience content. Could be used across many MXWLL pieces.

**Effort:** Medium (extract as reusable component)
**Destination:** `src/components/ExplanationModal.tsx` or `src/widgets/explanation-modal/`
**Migration Strategy:**
1. Abstract from Permissible Universe
2. Make data structure generic
3. Document usage pattern
4. Apply to other MXWLL content

---

#### 7. Periodic Table ⭐⭐
**Why:** Complete implementation. Could be Lab piece or reference tool.

**Effort:** Medium
**Destination:** `src/visualisers/periodic-table/`
**Migration Strategy:** Extract, update styling, consider enhancements (better interactivity, storytelling)

---

#### 8. Lunar Atlas ⭐⭐
**Why:** Polished WebGL piece. Could be Lab content.

**Effort:** Medium-High
**Destination:** `src/visualisers/lunar-atlas/`
**Migration Strategy:** Extract, test mobile performance, update design system

---

### LOWER PRIORITY

#### 9. Strange Attractors (Lorenz, Rossler, Aizawa) ⭐⭐
**Why:** Beautiful visualisations, self-contained. BUT: Ptolemy Creative Engine may supersede.

**Effort:** Low-Medium
**Destination:** `src/visualisers/attractors/` OR wait for Ptolemy
**Decision Point:** Does Ptolemy already handle attractors better? If yes, skip. If no, extract.

---

#### 10. GameTheoryHandheld ⭐⭐
**Why:** Unknown quality but game theory is valuable topic.

**Effort:** Unknown - inspect first
**Destination:** TBD
**Migration Strategy:** Inspect code, assess quality, then decide

---

### DO NOT MIGRATE

- Real-time data widgets (API-dependent, dashboard-focused, not explanation pieces)
- Vault content (mostly empty)
- Pulse blog (not portfolio content)
- Scientific Calculator (utility, not explanation)
- Fractals (redundant with Bang Industries content unless significantly better)
- Most Data section overview pages (encyclopedic, not narrative)

---

## Summary Tables

### Visualisers by Complexity

| Name | Complexity | Lines | Technology | Standalone | MXWLL Fit |
|------|------------|-------|------------|------------|-----------|
| Permissible Universe | High | 3,147 | React, Canvas | ✅ Yes | ⭐⭐⭐ |
| Extraction Map | Med-High | 800 | Mapbox GL, React | ⚠️ Needs API key | ⭐⭐⭐ |
| Periodic Table | Medium | 600 | React, SVG | ✅ Yes | ⭐⭐ |
| Lunar Atlas | Med-High | 1,063 | WebGL, Three.js | ✅ Yes | ⭐⭐ |
| Strange Attractors | Medium | ~300 each | Canvas/WebGL | ✅ Yes | ⭐⭐ |

### Data Assets by Value

| Asset | Records | Quality | Reuse Potential |
|-------|---------|---------|-----------------|
| Cosmic Objects | ~200 | High | ⭐⭐⭐ |
| Element Data | 118 | High | ⭐⭐⭐ |
| Mining/Extraction | ~100+ | High | ⭐⭐⭐ |
| Lunar Features | ~200 | Medium | ⭐⭐ |
| Nuclide Data | Unknown | Unknown | ⭐⭐⭐ (if exists) |

### Migration Priority Order

1. **The Permissible Universe** (visualiser + data)
2. **The Extraction Map** (visualiser + data)
3. **Cosmic Objects Database** (data extraction)
4. **Element Database** (data extraction)
5. **Tiered Explanation Pattern** (component extraction)
6. **Periodic Table** (visualiser)
7. **Lunar Atlas** (visualiser)
8. **Strange Attractors** (assess vs Ptolemy first)

---

## Technical Notes

### Build System
- Next.js 14/15 with App Router
- TypeScript
- Tailwind CSS
- Clerk authentication (not needed for MXWLL)

### API Infrastructure
The archive contains **40+ API endpoints** in `src/app/api/`. Most fetch data from external sources:
- NASA (APOD, NEO, Mars rovers, JWST)
- USGS (earthquakes)
- NOAA (space weather, aurora)
- IceCube (neutrinos)
- LIGO (gravitational waves)
- And many more...

**Migration Note:** These APIs are the backbone of Maxwell's real-time observation features but are **not suitable for MXWLL** due to maintenance burden and misalignment with portfolio focus.

### Environment Variables Required
From `.env.local`:
- `NEXT_PUBLIC_MAPBOX_TOKEN` (for Extraction Map)
- `CLERK_*` keys (authentication - not needed)
- Various API keys for real-time widgets (not needed)

---

## Recommendations

### Immediate Actions
1. **Migrate Permissible Universe** - This is portfolio-ready content
2. **Migrate Extraction Map** - Excellent explanation piece, minimal dependencies
3. **Extract data assets** - Cosmic objects, elements, extraction data

### Before Migrating Any Widget
1. Check if Ptolemy Creative Engine supersedes it
2. Verify it tells a story (not just displays data)
3. Confirm it works standalone (no APIs or uses sustainable APIs)

### Long-term Considerations
- The tiered explanation pattern (child → student → undergrad → expert) is excellent and should be applied more broadly across MXWLL
- Consider whether MXWLL wants any real-time data features. If yes, build custom API infrastructure. If no, stick to standalone visualisations.
- The archive shows strong work in systems thinking and data visualisation - themes that align well with MXWLL's mission

---

## Files Requiring Inspection

These files were identified but not fully inspected. Recommend reviewing before final migration decisions:

- `src/app/play/fractals/page.tsx` - Check if better than Bang Industries fractals
- `src/app/play/patterns/page.tsx` - Unknown content
- `src/components/widgets/GameTheoryHandheld.tsx` - Potentially valuable
- `src/components/widgets/ThePlotter.tsx` - May be useful tool
- `src/components/widgets/LightTravel.tsx` - Check if self-contained
- `src/components/widgets/YourAirsJourney.tsx` - Check if self-contained
- `src/components/widgets/WorldPopulation.tsx` - Check if algorithmic or API-based
- `src/app/data/living-network/` - May contain interesting biology viz
- All `src/app/data/[section]/` pages - May have useful content worth reviewing

---

**Audit completed:** 2026-02-23
**Next steps:** Await approval to begin migration of priority candidates
**Estimated migration effort for top 5 items:** 2-3 full days of work

---

END OF AUDIT
