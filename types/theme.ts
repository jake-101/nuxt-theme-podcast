/**
 * A single extracted color from the artwork
 */
export interface ExtractedColor {
  hex: string
  red: number
  green: number
  blue: number
  area: number // Percentage of the image this color covers (0-1)
  saturation: number // 0-1
  lightness: number // 0-1
}

/**
 * Complete theme palette for light and dark modes
 * These map directly to oat.css CSS custom properties
 */
export interface ThemePalette {
  light: ThemeColors
  dark: ThemeColors
}

/**
 * Color values for a single mode (light or dark)
 * Property names match oat.css CSS custom property names
 */
export interface ThemeColors {
  primary: string
  'primary-foreground': string
  secondary: string
  'secondary-foreground': string
  accent: string
  muted: string
  'muted-foreground': string
  ring: string
  // Extended properties derived from artwork
  'podcast-vibrant': string // The most vibrant extracted color
  'podcast-muted': string // A desaturated variant for subtle backgrounds
}

/**
 * API response from /api/podcast/colors
 */
export interface ThemeColorsResponse {
  palette: ThemePalette
  sourceColor: string // The dominant color extracted from artwork (hex)
  extractedColors: ExtractedColor[] // All extracted colors for debugging
}
