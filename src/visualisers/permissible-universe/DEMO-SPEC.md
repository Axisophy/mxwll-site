# Demo Mode Specification - The Permissible Universe

**Status:** Not yet implemented (scaffolded only)
**Created:** 2026-02-24

## Purpose

Autonomous demonstration mode for showcasing the Permissible Universe on the MXWLL homepage or in portfolio contexts. Should tell a visual story without user interaction, drawing the viewer's eye across the mass-radius diagram to reveal the scope and structure of the cosmic landscape.

## Desktop Demo

### Duration
60-90 seconds total

### Camera Sequence

#### Act 1: The Quantum Realm (0-15s)
**Start:** Zoom to quantum scale (10^-35 to 10^-15 metres)
**Show:** Planck length, quarks, protons, atoms
**Dwell:** 3s on each cluster
**Boundary:** Highlight Compton wavelength line
**Narration Concept:** "At the smallest scales, quantum uncertainty dominates..."

#### Act 2: The Human Scale (15-30s)
**Transition:** Pan diagonally from atoms to biological objects
**Show:** Viruses, cells, humans, terrestrial biology
**Dwell:** 5s on human-scale cluster
**Boundary:** None prominent here (we live in the middle)
**Narration Concept:** "We exist in the middle, between quantum and cosmic..."

#### Act 3: Engineering and Exploration (30-45s)
**Transition:** Pan right to spacecraft/satellites
**Show:** Voyager, ISS, spacecraft
**Dwell:** 3s
**Comparison:** Highlight how tiny our largest machines are compared to natural objects
**Narration Concept:** "Our furthest reach still tiny by cosmic standards..."

#### Act 4: The Cosmic Scale (45-70s)
**Transition:** Zoom out and pan up-right
**Show:** Planets → stars → neutron stars → black holes
**Dwell:** 5s on each major cluster
**Boundary:** Highlight Schwarzschild radius line - show black holes sitting on it
**Special Focus:** Sagittarius A* (our galaxy's supermassive black hole)
**Narration Concept:** "Scale up to stellar objects, where gravity dominates..."

#### Act 5: The Limits (70-90s)
**Transition:** Zoom to show full diagram
**Show:** All boundaries visible, full range from Planck to Hubble
**Dwell:** 10s on complete view
**Highlight:** Boundaries pulse subtly - Schwarzschild, degeneracy, Compton, Hubble
**Narration Concept:** "These are the permissible regions of our universe, defined by fundamental physics."

### Camera Behaviour

**Zoom:** Smooth ease-in/ease-out (cubic bezier)
**Pan:** Gentle acceleration/deceleration
**Speed:** Slow enough to read object labels (at least 2s per cluster)
**Pauses:** Brief pauses (1-2s) at interesting clusters
**Highlight:** Subtle glow or pulse on featured objects

### Visual Emphasis

**Labels:** Fade in for featured objects, fade out when camera moves on
**Boundaries:** Pulse or glow when camera focuses on relevant region
**Categories:** Colour-code remains visible throughout
**Background:** Keep clean - no cluttered labels far from camera focus

## Mobile Demo

### Constraints
- Screen size: 375-768px width
- Performance: Lower particle counts, simpler rendering
- Touch: Demo must not interfere with user's ability to scroll page

### Simplified Approach

**Duration:** 30-45 seconds (shorter than desktop)

**Option A: Static Showcase**
- Show diagram at "human scale" (10^-6 to 10^8 metres, 10^-10 to 10^3 kg)
- Highlight interesting clusters with sequential pulses
- No camera movement (avoids performance issues)
- Labels appear sequentially: "Viruses → Cells → Humans → Trees → Earth → Sun"

**Option B: Simplified Journey**
- Single zoom-out motion from human scale to cosmic scale
- No pan (just zoom)
- Duration: 30s
- Pause at: Humans (0-10s) → Earth (10-20s) → Sun (20-30s)

**Recommendation:** Option A (Static Showcase)
- More reliable performance
- Doesn't compete with page scroll
- Still shows the range and structure
- Less battery drain

## Implementation Notes

### Code Structure
Place in `src/visualisers/permissible-universe/demo/`

**Files:**
- `DemoController.ts` - orchestrates camera movements
- `CameraPath.ts` - defines waypoints and timing
- `transitions.ts` - easing functions
- `highlights.ts` - object highlight effects

### Integration
- Detect `?mode=demo` query parameter
- Or export `<PermissibleUniverseDemo />` component for homepage
- Auto-start on mount, loop indefinitely
- Fade-out UI controls (filters, search) during demo
- Allow user interaction to exit demo mode

### Performance Targets
- **Desktop:** Smooth 60fps throughout
- **Mobile:** 30fps acceptable (use `requestAnimationFrame` throttling)
- **Battery:** Pause demo when tab not visible (`document.visibilityState`)

### Accessibility
- Provide "Skip demo" button for users who prefer static view
- Respect `prefers-reduced-motion` - show static view instead
- Don't auto-play sound (this is visual only)

## Camera Maths

### Zoom Calculation
Current code uses log-scale coordinates. Demo camera needs to:
1. Convert world coordinates to screen space
2. Calculate zoom level to fit desired region
3. Interpolate smoothly between zoom levels

**Target Zoom Levels:**
- Quantum scale: ~0.1 (zoomed in)
- Human scale: ~1.0 (default view)
- Cosmic scale: ~10 (zoomed out to see all)

### Pan Calculation
Pan in world space (log coordinates):
- Target X = log10(mass in kg)
- Target Y = log10(radius in m)

Interpolate from current position to target using easing function.

### Easing Functions
**Recommended:** `easeInOutCubic` for smooth, natural motion
**Avoid:** Linear (too robotic), `easeInOutQuint` (too aggressive)

```typescript
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}
```

### Timing
Use `requestAnimationFrame` for smooth 60fps rendering.
Track elapsed time to progress through camera sequence.

```typescript
const SEQUENCE = [
  { start: 0, duration: 15, target: 'quantum', zoom: 0.1 },
  { start: 15, duration: 15, target: 'human', zoom: 1.0 },
  // ... etc
]
```

## Testing Checklist

- [ ] Demo runs smoothly at 60fps desktop
- [ ] Demo runs at 30fps mobile without jank
- [ ] User interaction exits demo cleanly
- [ ] Query parameter `?mode=demo` activates demo
- [ ] Demo loops seamlessly after completion
- [ ] `prefers-reduced-motion` respected (shows static view)
- [ ] Tab visibility pause works
- [ ] No memory leaks on repeated loops
- [ ] Boundaries highlight at correct moments
- [ ] Labels fade in/out correctly
- [ ] Camera never goes outside permissible pan/zoom range

## Future Enhancements

- **Audio narration:** Voiceover describing the journey (optional)
- **Music:** Subtle ambient soundtrack (off by default)
- **Interactive waypoints:** User can skip to specific scales
- **Branching paths:** Multiple demo sequences (quantum focus, stellar focus, etc.)
- **Story mode:** Explicit narration panels overlaid during demo

---

**Note:** This is a specification only. Implementation is flagged as future work. The visualiser works fully in interactive mode; demo mode is for portfolio/homepage showcase purposes.
