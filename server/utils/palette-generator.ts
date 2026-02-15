import {
  parse,
  formatHex,
  oklch,
  wcagContrast,
  clampChroma,
} from 'culori'
import type { Oklch } from 'culori'
import type { ExtractedColor, ThemePalette, ThemeColors } from '../../types/theme'

// WCAG AA minimum contrast ratios
const MIN_CONTRAST_LARGE_TEXT = 3 // Large text (18pt+ or 14pt bold)
const MIN_CONTRAST_NORMAL_TEXT = 4.5 // Normal text
const MIN_CONTRAST_UI = 3 // UI components and graphical objects

/**
 * Convert a hex color to OKLCH for perceptually uniform manipulation.
 * OKLCH gives us independent lightness (L), chroma (C), and hue (H) channels.
 */
function hexToOklch(hex: string): Oklch {
  const parsed = parse(hex)
  if (!parsed) {
    return { mode: 'oklch', l: 0.5, c: 0.1, h: 0 }
  }
  const result = oklch(parsed)
  return result || { mode: 'oklch', l: 0.5, c: 0.1, h: 0 }
}

/**
 * Convert OKLCH back to hex, clamping chroma to stay in sRGB gamut.
 */
function oklchToHex(color: Oklch): string {
  const clamped = clampChroma(color, 'oklch')
  return formatHex(clamped) || '#000000'
}

/**
 * Adjust lightness of an OKLCH color to achieve a target contrast ratio
 * against a reference color. Searches by adjusting L incrementally.
 */
function adjustForContrast(
  color: Oklch,
  background: string,
  minContrast: number,
  preferDarker: boolean,
): string {
  const adjusted = { ...color, mode: 'oklch' as const }
  const step = preferDarker ? -0.02 : 0.02

  // Try up to 50 incremental steps
  for (let i = 0; i < 50; i++) {
    const hex = oklchToHex(adjusted)
    const contrast = wcagContrast(hex, background)
    if (contrast >= minContrast) {
      return hex
    }
    adjusted.l = Math.max(0, Math.min(1, adjusted.l + step))
  }

  // Fallback: return the most extreme version
  return oklchToHex(adjusted)
}

/**
 * Pick the best "primary" color from extracted colors.
 * Prefers colors that are saturated, cover a decent area, and aren't too
 * light or too dark.
 */
function pickPrimaryColor(colors: ExtractedColor[]): ExtractedColor {
  if (colors.length === 0) {
    return {
      hex: '#574747',
      red: 87, green: 71, blue: 71,
      area: 1, saturation: 0.1, lightness: 0.31,
    }
  }

  // Score each color: prefer saturated, mid-lightness, decent-area colors
  const scored = colors.map(c => {
    let score = 0
    // Saturation: strongly prefer saturated colors
    score += c.saturation * 40
    // Area: prefer colors that are prominent (but don't over-weight)
    score += Math.min(c.area, 0.4) * 20
    // Lightness: prefer mid-range (0.3-0.7), penalize extremes
    const lightPenalty = Math.abs(c.lightness - 0.5) * 30
    score -= lightPenalty
    return { color: c, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored[0].color
}

/**
 * Pick a secondary/accent color that's distinct from the primary.
 */
function pickSecondaryColor(colors: ExtractedColor[], primaryHex: string): ExtractedColor | null {
  const primaryOklch = hexToOklch(primaryHex)

  // Find a color with a different hue from the primary
  const candidates = colors
    .filter(c => c.hex !== primaryHex)
    .map(c => {
      const colorOklch = hexToOklch(c.hex)
      const hueDiff = Math.abs((colorOklch.h || 0) - (primaryOklch.h || 0))
      const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff)
      return { color: c, hueDiff: normalizedHueDiff }
    })
    .filter(c => c.hueDiff > 30) // At least 30 degrees different
    .sort((a, b) => b.color.saturation - a.color.saturation)

  return candidates.length > 0 ? candidates[0].color : null
}

/**
 * Generate a complete, accessible theme palette from extracted artwork colors.
 *
 * Strategy:
 * - Pick the most vibrant/prominent color as "primary"
 * - Derive secondary, muted, accent from the same hue family
 * - For light mode: ensure text colors have 4.5:1+ contrast on white
 * - For dark mode: ensure text colors have 4.5:1+ contrast on near-black
 * - Use OKLCH to keep perceptual consistency
 */
export function generateThemePalette(colors: ExtractedColor[]): ThemePalette {
  const primary = pickPrimaryColor(colors)
  const secondary = pickSecondaryColor(colors, primary.hex)
  const primaryOklch = hexToOklch(primary.hex)

  return {
    light: generateLightTheme(primaryOklch, secondary ? hexToOklch(secondary.hex) : null),
    dark: generateDarkTheme(primaryOklch, secondary ? hexToOklch(secondary.hex) : null),
  }
}

/**
 * Generate light mode theme colors.
 * Light background (#fff), dark text.
 */
function generateLightTheme(primary: Oklch, secondary: Oklch | null): ThemeColors {
  const WHITE = '#ffffff'
  const NEAR_BLACK = '#09090b'

  // Primary: needs 4.5:1 contrast against white for text,
  // and 3:1 for UI components (buttons)
  // Darken the primary until it passes contrast on white
  const primaryForUI: Oklch = {
    ...primary,
    mode: 'oklch',
    // Ensure chroma is vivid enough to read as colored
    c: Math.max(primary.c || 0.05, 0.08),
  }
  const primaryHex = adjustForContrast(primaryForUI, WHITE, MIN_CONTRAST_NORMAL_TEXT, true)

  // Primary foreground: white or near-black, whichever has better contrast
  const primaryFgWhite = wcagContrast(primaryHex, WHITE)
  const primaryFgBlack = wcagContrast(primaryHex, NEAR_BLACK)
  const primaryFg = primaryFgWhite > primaryFgBlack ? WHITE : NEAR_BLACK

  // Secondary: very light tinted background (high L, low C)
  const secondaryOklch: Oklch = {
    mode: 'oklch',
    l: 0.96,
    c: Math.min((primary.c || 0.05) * 0.3, 0.03),
    h: primary.h,
  }
  const secondaryHex = oklchToHex(secondaryOklch)

  // Secondary foreground: the primary color (readable on the light secondary bg)
  const secondaryFgHex = adjustForContrast(
    { ...primary, mode: 'oklch', c: Math.max(primary.c || 0.05, 0.06) },
    secondaryHex,
    MIN_CONTRAST_NORMAL_TEXT,
    true,
  )

  // Accent: similar to secondary but slightly more saturated
  const accentOklch: Oklch = {
    mode: 'oklch',
    l: 0.94,
    c: Math.min((primary.c || 0.05) * 0.4, 0.04),
    h: primary.h,
  }
  const accentHex = oklchToHex(accentOklch)

  // Muted: neutral with a hint of the primary hue
  const mutedOklch: Oklch = {
    mode: 'oklch',
    l: 0.96,
    c: Math.min((primary.c || 0.05) * 0.15, 0.015),
    h: primary.h,
  }
  const mutedHex = oklchToHex(mutedOklch)

  // Muted foreground: mid-tone with primary hue tint
  const mutedFgOklch: Oklch = {
    mode: 'oklch',
    l: 0.55,
    c: Math.min((primary.c || 0.05) * 0.3, 0.03),
    h: primary.h,
  }
  const mutedFgHex = adjustForContrast(mutedFgOklch, WHITE, MIN_CONTRAST_UI, true)

  // Ring: same as primary
  const ringHex = primaryHex

  // Vibrant: the purest form of the extracted color (for decorative use)
  const vibrantOklch: Oklch = {
    mode: 'oklch',
    l: Math.max(0.55, Math.min(0.7, primary.l || 0.5)),
    c: Math.max(primary.c || 0.1, 0.15),
    h: primary.h,
  }
  const vibrantHex = oklchToHex(vibrantOklch)

  // Podcast muted: desaturated tint for subtle backgrounds
  const podcastMutedOklch: Oklch = {
    mode: 'oklch',
    l: 0.92,
    c: Math.min((primary.c || 0.05) * 0.25, 0.025),
    h: primary.h,
  }
  const podcastMutedHex = oklchToHex(podcastMutedOklch)

  return {
    'primary': primaryHex,
    'primary-foreground': primaryFg,
    'secondary': secondaryHex,
    'secondary-foreground': secondaryFgHex,
    'accent': accentHex,
    'muted': mutedHex,
    'muted-foreground': mutedFgHex,
    'ring': ringHex,
    'podcast-vibrant': vibrantHex,
    'podcast-muted': podcastMutedHex,
  }
}

/**
 * Generate dark mode theme colors.
 * Dark background (#09090b), light text.
 */
function generateDarkTheme(primary: Oklch, secondary: Oklch | null): ThemeColors {
  const NEAR_BLACK = '#09090b'
  const DARK_CARD = '#18181b'
  const NEAR_WHITE = '#fafafa'

  // Primary in dark mode: lighten the primary so it reads on dark backgrounds
  // For buttons: need 3:1 against dark bg. For text: 4.5:1
  const primaryForDark: Oklch = {
    ...primary,
    mode: 'oklch',
    c: Math.max(primary.c || 0.05, 0.08),
  }
  const primaryHex = adjustForContrast(primaryForDark, NEAR_BLACK, MIN_CONTRAST_NORMAL_TEXT, false)

  // Primary foreground: dark text on the light primary
  const primaryFgWhite = wcagContrast(primaryHex, NEAR_WHITE)
  const primaryFgBlack = wcagContrast(primaryHex, NEAR_BLACK)
  const primaryFg = primaryFgBlack > primaryFgWhite ? NEAR_BLACK : NEAR_WHITE

  // Secondary: dark tinted surface
  const secondaryOklch: Oklch = {
    mode: 'oklch',
    l: 0.22,
    c: Math.min((primary.c || 0.05) * 0.25, 0.025),
    h: primary.h,
  }
  const secondaryHex = oklchToHex(secondaryOklch)

  // Secondary foreground: light text on dark secondary
  const secondaryFgOklch: Oklch = {
    mode: 'oklch',
    l: 0.9,
    c: Math.min((primary.c || 0.05) * 0.2, 0.02),
    h: primary.h,
  }
  const secondaryFgHex = adjustForContrast(secondaryFgOklch, secondaryHex, MIN_CONTRAST_NORMAL_TEXT, false)

  // Accent
  const accentOklch: Oklch = {
    mode: 'oklch',
    l: 0.24,
    c: Math.min((primary.c || 0.05) * 0.3, 0.03),
    h: primary.h,
  }
  const accentHex = oklchToHex(accentOklch)

  // Muted: dark surface with subtle hue
  const mutedOklch: Oklch = {
    mode: 'oklch',
    l: 0.22,
    c: Math.min((primary.c || 0.05) * 0.15, 0.015),
    h: primary.h,
  }
  const mutedHex = oklchToHex(mutedOklch)

  // Muted foreground
  const mutedFgOklch: Oklch = {
    mode: 'oklch',
    l: 0.65,
    c: Math.min((primary.c || 0.05) * 0.2, 0.02),
    h: primary.h,
  }
  const mutedFgHex = adjustForContrast(mutedFgOklch, NEAR_BLACK, MIN_CONTRAST_UI, false)

  // Ring
  const ringOklch: Oklch = {
    mode: 'oklch',
    l: 0.82,
    c: Math.min((primary.c || 0.05) * 0.3, 0.03),
    h: primary.h,
  }
  const ringHex = oklchToHex(ringOklch)

  // Vibrant (brighter in dark mode for decorative pops)
  const vibrantOklch: Oklch = {
    mode: 'oklch',
    l: Math.max(0.65, Math.min(0.8, (primary.l || 0.5) + 0.2)),
    c: Math.max(primary.c || 0.1, 0.15),
    h: primary.h,
  }
  const vibrantHex = oklchToHex(vibrantOklch)

  // Podcast muted
  const podcastMutedOklch: Oklch = {
    mode: 'oklch',
    l: 0.2,
    c: Math.min((primary.c || 0.05) * 0.2, 0.02),
    h: primary.h,
  }
  const podcastMutedHex = oklchToHex(podcastMutedOklch)

  return {
    'primary': primaryHex,
    'primary-foreground': primaryFg,
    'secondary': secondaryHex,
    'secondary-foreground': secondaryFgHex,
    'accent': accentHex,
    'muted': mutedHex,
    'muted-foreground': mutedFgHex,
    'ring': ringHex,
    'podcast-vibrant': vibrantHex,
    'podcast-muted': podcastMutedHex,
  }
}
