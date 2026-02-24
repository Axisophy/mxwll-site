# Known Issues

## Open
- DevTools frame profiling is still pending in a browser session (desktop transition and mobile simulation).
- Current dataset does not include `phot_g_mean_mag` or `parallax`, so magnitude sizing uses `abs_mag` fallback and HR Y uses `abs_mag` fallback.

## Resolved
- Demo and interactive concerns are now separated for the homepage path.
- Sky projection vertical fill issue in demo mode was a mapping bug in prior code (`dec` scaled to half-height). Demo now maps Dec -90/+90 to full canvas height.

## Browser compatibility notes
- Demo relies on WebGL2. If WebGL2 is unavailable, the component logs an error and does not render stars.
- DPR is capped (`2.0` desktop, `1.5` mobile) for stable performance and predictable point density.

## Declination fill diagnosis
The previous 2/3-style vertical compression was a code mapping bug in the old pipeline (Dec mapped to half-height). In the new demo, mapping uses full Dec range. If stars do not touch absolute top/bottom edges, that is data distribution: the dataset spans about -89.29 to +89.41 degrees, not exactly -90/+90.
