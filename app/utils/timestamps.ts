/**
 * Parse and linkify timestamps in HTML show notes
 * Finds HH:MM:SS or MM:SS patterns and wraps them in clickable links
 */

/**
 * Parse a timestamp string to seconds
 * Supports: HH:MM:SS, MM:SS, or just SS
 */
export function parseTimestamp(timestamp: string): number {
  const parts = timestamp.split(':').map(Number)
  
  if (parts.length === 3) {
    // HH:MM:SS
    const [hours, minutes, seconds] = parts
    return hours * 3600 + minutes * 60 + seconds
  } else if (parts.length === 2) {
    // MM:SS
    const [minutes, seconds] = parts
    return minutes * 60 + seconds
  } else if (parts.length === 1) {
    // Just seconds
    return parts[0]
  }
  
  return 0
}

/**
 * Linkify timestamps in HTML content
 * Finds patterns like HH:MM:SS or MM:SS and wraps them in clickable elements
 * 
 * @param html - HTML string with potential timestamps
 * @param linkClass - CSS class to apply to timestamp links
 * @returns HTML string with clickable timestamps
 */
export function linkifyTimestamps(html: string, linkClass = 'timestamp-link'): string {
  if (!html) return ''
  
  // Pattern matches:
  // - HH:MM:SS (e.g., 01:23:45)
  // - MM:SS (e.g., 12:34)
  // With optional leading/trailing whitespace or brackets
  const timestampPattern = /(\b|\s|>|\[)(\d{1,2}:\d{2}(?::\d{2})?)(\b|\s|<|\])/g
  
  return html.replace(timestampPattern, (match, before, timestamp, after) => {
    const seconds = parseTimestamp(timestamp)
    // Use data-timestamp attribute for the actual value in seconds
    // This allows the click handler to easily get the seek position
    return `${before}<a href="#" class="${linkClass}" data-timestamp="${seconds}" onclick="return false;">${timestamp}</a>${after}`
  })
}

/**
 * Extract all timestamps from HTML content
 * Useful for generating a chapter list from show notes
 * 
 * @param html - HTML string with timestamps
 * @returns Array of { timestamp: string, seconds: number }
 */
export function extractTimestamps(html: string): Array<{ timestamp: string, seconds: number }> {
  if (!html) return []
  
  const timestampPattern = /(\b|\s|>|\[)(\d{1,2}:\d{2}(?::\d{2})?)(\b|\s|<|\])/g
  const timestamps: Array<{ timestamp: string, seconds: number }> = []
  const seen = new Set<string>()
  
  let match
  while ((match = timestampPattern.exec(html)) !== null) {
    const timestamp = match[2]
    if (!seen.has(timestamp)) {
      seen.add(timestamp)
      timestamps.push({
        timestamp,
        seconds: parseTimestamp(timestamp)
      })
    }
  }
  
  // Sort by time
  return timestamps.sort((a, b) => a.seconds - b.seconds)
}

/**
 * Format seconds back to timestamp string
 * @param seconds - Total seconds
 * @param includeHours - Force HH:MM:SS format even if hours = 0
 * @returns Formatted timestamp string
 */
export function formatTimestamp(seconds: number, includeHours = false): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  const pad = (num: number) => num.toString().padStart(2, '0')
  
  if (hours > 0 || includeHours) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`
  } else {
    return `${minutes}:${pad(secs)}`
  }
}
