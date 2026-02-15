import type { PodcastFeed } from '../../types/podcast'
import { parsePodcastFeed } from './feed-parser'

/**
 * Cache TTL in seconds (default: 1 hour)
 */
const CACHE_TTL = 60 * 60 // 3600 seconds

/**
 * Storage key for the podcast feed cache
 */
const CACHE_KEY_PREFIX = 'podcast:feed:'

/**
 * Generate cache key from feed URL
 */
function getCacheKey(feedUrl: string): string {
  // Use base64 encoding to handle special characters in URLs
  const encoded = Buffer.from(feedUrl).toString('base64')
  return `${CACHE_KEY_PREFIX}${encoded}`
}

/**
 * Fetch and parse podcast feed with caching
 * Uses Nitro's storage layer for persistent caching
 */
export const getCachedPodcastFeed = defineCachedFunction(
  async (feedUrl: string): Promise<PodcastFeed> => {
    // Fetch and parse the feed
    return await parsePodcastFeed(feedUrl)
  },
  {
    maxAge: CACHE_TTL,
    name: 'podcast-feed',
    getKey: (feedUrl: string) => getCacheKey(feedUrl),
  }
)

/**
 * Clear the cached podcast feed for a specific URL
 */
export async function clearFeedCache(feedUrl: string): Promise<void> {
  const storage = useStorage('cache')
  const cacheKey = `nitro:functions:podcast-feed:${getCacheKey(feedUrl)}.json`
  
  try {
    await storage.removeItem(cacheKey)
  } catch (error) {
    console.warn('Failed to clear feed cache:', error)
  }
}

/**
 * Clear all podcast feed caches
 */
export async function clearAllFeedCaches(): Promise<void> {
  const storage = useStorage('cache')
  
  try {
    const keys = await storage.getKeys('nitro:functions:podcast-feed:')
    await Promise.all(keys.map(key => storage.removeItem(key)))
  } catch (error) {
    console.warn('Failed to clear all feed caches:', error)
  }
}
