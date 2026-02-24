# Known Issues - The Permissible Universe

**Last Updated:** 2026-02-24

## Design System

### Dark Theme Not Updated
**Status:** Not started
**Severity:** Medium
**Description:** Still uses Maxwell's dark theme (black background, `#111118` panels, white text). Needs update to MXWLL design system (white background, custom properties from `globals.css`).

**Impact:** Visual inconsistency with rest of MXWLL site. Works fine functionally but doesn't match the portfolio aesthetic.

**Fix Required:**
- Update ObjectModal background from `bg-[#111118]` to `bg-white`
- Update text colours from `text-white` to `text-black`
- Use CSS custom properties: `var(--bg-primary)`, `var(--text-primary)`, etc.
- Update CosmicDiagram canvas background from black to white
- Invert boundary line colours
- Update category colour palette to work on light background

### Font Classes
**Status:** Not started
**Severity:** Low
**Description:** Uses generic class names (`font-light`, `font-mono`) instead of MXWLL semantic font classes (`font-display`, `font-sabon`, `font-input`)

**Fix Required:**
- Headings: `font-display` or `font-nhg`
- Explanations: `font-sabon`
- Data/metadata: `font-input` (uppercase)

## Mobile Experience

### Touch Interaction Not Optimised
**Status:** Partial
**Severity:** Medium
**Description:** Pan/zoom works on mobile but isn't refined. Two-finger gestures work but single-finger scroll can conflict with diagram pan.

**Expected Behaviour (per LEARNINGS.md):**
- Two-finger pinch: zoom
- Two-finger drag: pan
- Single-finger: scroll page (not diagram)

**Current Behaviour:**
- Touch works but doesn't follow conventions
- Easy to accidentally pan when trying to scroll

### Small Screen Layout
**Status:** Partial
**Severity:** Medium
**Description:** Modal takes up most of screen on mobile (max-h-[90vh]). Search box and filters could be better positioned.

**Fix Required:**
- Consider bottom sheet on mobile instead of centred modal
- Stack category filters vertically on narrow screens
- Reduce padding in modals on mobile

## Performance

### Label Density on High-DPI Displays
**Status:** Minor issue
**Severity:** Low
**Description:** At high zoom levels with many objects visible, labels can overlap. Not a bug but could be improved.

**Potential Fix:**
- Implement label collision detection
- Show only top N most important labels when crowded
- Fade out labels at low zoom levels

## Functional

### Zoom/Pan Constraints
**Status:** Working but unverified
**Severity:** Low (but HIGH priority in LEARNINGS.md)
**Description:** Zoom min/max appears to be implemented but needs verification against LEARNINGS.md guidance:
- Minimum zoom: 1.0 (or appropriate for this viz)
- Maximum zoom: 20
- Pan clamping: prevent content disappearing off-screen

**Action Required:**
- Test on mobile (375px width minimum)
- Verify zoom limits in place
- Verify pan clamping prevents "lost in space" feeling

### Related Objects Links
**Status:** Works but could be clearer
**Severity:** Low
**Description:** ObjectModal shows "nearby objects" but clicking them opens new modal. Could be confusing - maybe show indication that these are clickable.

## Content

### Advanced Explanations Missing for Some Objects
**Status:** Data limitation
**Severity:** Low
**Description:** Some objects fall back to Technical explanation for Advanced tier (no separate graduate-level content written yet)

**Impact:** Users selecting "Advanced" for these objects get undergraduate content repeated

**Fix:** Write missing advanced explanations (content work, not code)

## Demo Mode

### Not Implemented
**Status:** Scaffolded only
**Severity:** Medium (if homepage integration planned)
**Description:** The `demo/` directory exists but autonomous demo mode not built yet.

**Required for:** Homepage showcase, autoplay in portfolio context

**See:** DEMO-SPEC.md for implementation plan

## Documentation

### Migration Incomplete
**Status:** In progress
**Severity:** Medium
**Description:** This is the initial migration from Maxwell archive. Design system update, mobile refinement, and demo mode are flagged as future work.

**Not Bugs:** These are known incomplete features, not defects in existing functionality.

## Browser Compatibility

### Not Tested
**Status:** Unknown
**Severity:** TBD
**Description:** Canvas rendering should work in all modern browsers. Not yet tested in Safari, Firefox, Edge.

**Action Required:** Cross-browser testing

## Accessibility

### Keyboard Navigation Limited
**Status:** Partial
**Severity:** Medium
**Description:** Modal closes with ESC but diagram itself isn't keyboard-navigable. Can't tab through objects or focus on them.

**Fix Required:**
- Make objects focusable (tabindex)
- Arrow keys to navigate between objects
- Enter to open modal
- Focus management in modals

### Screen Reader Support
**Status:** Unknown
**Severity:** Medium
**Description:** Canvas content not accessible to screen readers. Needs ARIA labels and semantic HTML fallback.

**Fix Required:**
- ARIA labels for canvas regions
- Hidden semantic list of objects for screen readers
- Announce zoom level and current view

---

## Priority Order

1. **High:** Zoom/pan constraints verification (LEARNINGS.md says this causes most problems)
2. **High:** Design system update (visual consistency with MXWLL)
3. **Medium:** Mobile touch interaction refinement
4. **Medium:** Accessibility improvements
5. **Medium:** Demo mode implementation (if needed for homepage)
6. **Low:** Content completeness (advanced explanations)
7. **Low:** Label collision detection

## Testing Checklist (Before Production)

- [ ] Test on mobile 375px width minimum
- [ ] Verify zoom clamped (min 1.0, max 20)
- [ ] Verify pan clamped (can't lose content off-screen)
- [ ] Test two-finger zoom/pan on mobile
- [ ] Test single-finger scroll (should scroll page, not pan diagram)
- [ ] Test in Safari, Firefox, Edge
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] All modals open/close correctly
- [ ] Search returns relevant results
- [ ] Category filters work
- [ ] Boundary lines render correctly on light background
- [ ] Build passes without errors
