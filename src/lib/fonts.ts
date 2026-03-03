/**
 * MXWLL Typography Configuration
 *
 * Font Stack: Neue Haas Grotesk only
 * - NHG 400 (regular): body text, prose, descriptions
 * - NHG 500 (medium): labels, metadata, data readouts (uppercase, 0.05em tracking)
 * - NHG 700 (bold): headings, display text (letter-spacing: -0.03em)
 *
 * Sabon and Input Mono have been removed (March 2026).
 * Legacy class names (font-sabon, font-input) redirect to NHG via globals.css.
 */

/**
 * Font class names for use in components
 * Using CSS variables defined in globals.css
 */
export const fontClassNames = ''

/**
 * Font variables for direct use
 */
export const fontVars = {
  nhg: '--font-nhg',
  display: '--font-display',
  text: '--font-text',
}

// Exports
export const neueHaasGrotesk = { variable: '--font-nhg' }
