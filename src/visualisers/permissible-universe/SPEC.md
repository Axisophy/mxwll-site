# The Permissible Universe - Specification

**Created:** 2026-02-24
**Last Updated:** 2026-02-24

## Brief

Interactive mass-radius diagram showing ~200 cosmic objects from quarks to supermassive black holes. Explores the fundamental physical limits that determine what can exist in the universe - from quantum mechanical constraints at the smallest scales to gravitational collapse at the largest.

Objects are positioned on a log-log scatter plot spanning 80+ orders of magnitude in both mass and radius. Physical boundary lines show the Schwarzschild radius (black hole formation), electron degeneracy pressure, Compton wavelength, and Hubble radius.

## Design Decisions

### Log-Log Scale
**Decision:** Use logarithmic scales for both axes.

**Rationale:** The only way to display objects spanning from 10^-35 metres (Planck length) to 10^26 metres (observable universe) on a single diagram. Linear scales would make the vast majority of objects invisible.

### Boundary Lines
**Decision:** Display physical limit lines (Schwarzschild radius, degeneracy pressure, etc.)

**Rationale:** These boundaries tell the story of why certain combinations of mass and radius are impossible. Objects above the Schwarzschild line would be black holes. Objects below degeneracy pressure would collapse. The boundaries define the "permissible" region of the universe.

**Schwarzschild Radius:** R_s = 2GM/c^2 - any object compressed below this radius becomes a black hole

**Electron Degeneracy:** Quantum pressure prevents further compression in white dwarfs

**Compton Wavelength:** λ = h/(mc) - quantum mechanical limit for localisation

**Hubble Radius:** c/H_0 - the observable universe boundary

### Four-Tier Explanation System
**Decision:** Provide explanations at four levels: Accessible (child), Intuitive (student), Technical (undergraduate), Advanced (expert)

**Rationale:** Based on the cognitive science principle of expertise reversal - novices and experts learn differently. A detailed technical explanation that helps an undergraduate can overwhelm a general audience. Four tiers allows each user to engage at their level without being talked down to or lost in jargon.

**Tier Mapping:**
- **Accessible (Level 1):** Everyday language, analogies, no equations
- **Intuitive (Level 2):** High school physics, qualitative concepts
- **Technical (Level 3):** Undergraduate level, equations, proper terminology
- **Advanced (Level 4):** Graduate level, full mathematical treatment

### Category System
**Decision:** Organise objects into 10 categories (fundamental particles, atoms, molecules, spacecraft, biology, planets, stars, neutron stars, black holes, galaxies)

**Rationale:** Helps users navigate the ~200 objects. Categories are colour-coded and can be toggled on/off to focus on specific domains.

### Interactive Features
**Decision:** Pan, zoom, search, click for details

**Rationale:** With 200+ objects across 80 orders of magnitude, users need multiple ways to explore: spatial (pan/zoom), semantic (search), and structured (category filter). Click-for-details provides deeper information without cluttering the main diagram.

## Data Source

Cosmic objects database curated from:
- Gaia DR3 (stellar data)
- NASA Exoplanet Archive
- Published astrophysics literature
- Particle Data Group (fundamental particles)
- Various astronomical catalogues

~200 objects selected to represent the full range of cosmic scales and include both familiar examples (Earth, Sun) and extreme cases (Planck mass, Sagittarius A*).

Each object includes:
- Mass (kg)
- Radius (m)
- Category
- Discovery information
- Four-tier explanations
- Related/nearby objects for context

## Rejected Approaches

### Linear Scales
Rejected - would compress 99.99% of the universe into a single pixel.

### 3D View
Rejected - adding a third axis (density, temperature, etc.) made the visualisation too complex and hard to navigate.

### Real-Time Data
Rejected - unlike observational widgets, this is a curated reference diagram. Real-time updates would be meaningless (stellar masses don't change on human timescales).

### Animation/Time Evolution
Rejected for main view - objects don't move in mass-radius space except during stellar evolution, which happens over billions of years. However, an "Epochs" mode shows early universe timeline as a separate view.

## Technical Implementation

**Rendering:** Canvas 2D (not WebGL) - sufficient for ~200 points, allows for precise control over coordinate transforms

**Coordinate Transform:** Custom log-log transform with pan/zoom handling extreme scale differences

**Interaction:** Mouse for desktop, touch for mobile

**Data Loading:** Static import (no API calls) - all data embedded

## Performance Considerations

**Desktop:** Smooth at 60fps with full dataset

**Mobile:** Reduce label density, simplify boundary rendering, cap zoom range

## Future Enhancements (Not In Scope)

- Compare mode (overlay two objects)
- Density dimension (3rd axis as colour)
- Historical timeline (show how objects form/evolve)
- User-submitted objects (crowdsourced database)
- Dark matter/exotic objects section expansion
