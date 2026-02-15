/**
 * Generate a URL-safe slug from a string
 * @param text - The text to slugify (usually episode title)
 * @param episodeNumber - Optional episode number to prepend for uniqueness
 * @returns URL-safe slug
 */
export function generateSlug(text: string, episodeNumber?: number): string {
  // Ensure text is a string
  const textStr = String(text || '')
  
  let slug = textStr
    .toLowerCase()
    .trim()
    // Replace ampersands with 'and'
    .replace(/&/g, '-and-')
    // Remove apostrophes
    .replace(/'/g, '')
    // Replace any non-alphanumeric characters with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Collapse multiple hyphens into one
    .replace(/-+/g, '-')
  
  // Prepend episode number if provided for uniqueness
  if (episodeNumber !== undefined) {
    slug = `${episodeNumber}-${slug}`
  }
  
  // Limit length to avoid overly long URLs (keep first 100 chars)
  if (slug.length > 100) {
    slug = slug.substring(0, 100).replace(/-[^-]*$/, '') // Remove partial word at end
  }
  
  return slug
}
