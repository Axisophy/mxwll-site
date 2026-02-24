# Known Issues

## Open
- **Mock data, not real LIGO files**: Uses simplified approximation for performance. Real LIGO HDF5 files are too large/complex for browser.
- **Template animation is illustrative**: The sliding template overlay shows the concept of matched filtering but isn't numerically accurate.
- **Audio requires user interaction**: Browser autoplay policies prevent audio starting automatically. User must toggle sound on.
- **No mobile optimization**: Canvas rendering not tested on mobile. Controls may be too small. Consider responsive breakpoints for panel layout.
- **Fixed time window**: Shows ~0.4s around merger. Full LIGO strain data spans much longer.
- **Spectrogram resolution**: Uses simplified FFT, not full LIGO analysis pipeline.

## Resolved
None yet

## Stage-specific notes

**Stage 1 (Raw Data)**
- Noise level approximates real detector sensitivity
- Glitch-free (real LIGO data has instrumental artifacts)

**Stage 2 (Predicted Waveform)**
- Uses inspiral-merger-ringdown phenomenological waveform
- Not full numerical relativity (too computationally expensive)

**Stage 3 (Template Matching)**
- Template slide animation is pedagogical device, not actual matched-filtering algorithm
- Real LIGO uses bank of thousands of templates, not single template

**Stage 4 (Interpretation)**
- Orbital diagram is schematic (not to scale, simplified dynamics)
- Energy calculation accurate to published GW150914 values

## Performance notes
- Canvas rendering at 60fps on desktop
- May need throttling on mobile devices
- Audio synthesis lightweight (single oscillator with frequency modulation)

## Code organization note
**Demo/Interactive separation pending**: Current code in core/ mixes demo logic (autonomous camera, transitions) with interactive controls. These concerns should be separated:
- core/ → rendering engine, data structures, physics/math
- demo/ → autonomous mode for homepage/showcase
- interactive/ → user controls, UI, interactive version

This separation is flagged for future work. Do not attempt during initial migration.
