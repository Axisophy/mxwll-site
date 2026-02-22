/**
 * MXWLL Typography Configuration
 *
 * Font Stack:
 * - Neue Haas Grotesk: Primary sans (headlines, navigation, body, UI)
 * - Sabon: Serif accent (longer prose, articles, quotes)
 * - Input Mono: Monospace (data labels, metadata, code, control panels)
 *
 * Note: Using system fallbacks until font files are added
 * TODO: Add actual font files to public/fonts/ directory
 */

/**
 * Font class names for use in components
 * Using CSS variables defined in globals.css
 */
export const fontClassNames = ''

/**
 * Font variables for direct use
 * These will be populated once actual font files are added
 */
export const fontVars = {
  nhg: '--font-nhg',
  sabon: '--font-sabon',
  input: '--font-input',
}

// Placeholder exports to maintain compatibility
export const neueHaasGrotesk = { variable: '--font-nhg' }
export const sabon = { variable: '--font-sabon' }
export const inputMono = { variable: '--font-input' }
