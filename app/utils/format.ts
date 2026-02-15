/**
 * Format utilities for podcast data
 */

/**
 * Format a date string into a human-readable format
 * @param dateString - ISO date string or RSS date string
 * @returns Formatted date (e.g., "Feb 15, 2026")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format duration in seconds to HH:MM:SS or MM:SS
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}

/**
 * Parse duration string into seconds
 * Handles HH:MM:SS, MM:SS, or plain seconds
 * @param input - Duration string or number
 * @returns Duration in seconds
 */
export function parseDuration(input: string | number | undefined): number {
  if (!input) return 0
  
  // If already a number, return it
  if (typeof input === 'number') {
    return Math.floor(input)
  }
  
  // Parse HH:MM:SS or MM:SS format
  const parts = input.toString().split(':').map(p => parseInt(p, 10))
  
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1]
  } else if (parts.length === 1 && !isNaN(parts[0])) {
    // Just seconds
    return parts[0]
  }
  
  return 0
}
