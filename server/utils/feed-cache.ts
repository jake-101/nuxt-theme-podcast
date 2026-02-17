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
 * In-memory cache for the feed during prerendering.
 * During `nuxi generate`, all routes run in the same Node process, so this
 * module-level Map is shared across every route and prevents redundant
 * fetch+parse cycles (the Nitro storage cache uses async I/O that can
 * still cause duplicate in-flight requests).
 */
const memoryCache = new Map<string, Promise<PodcastFeed>>()

/**
 * Nitro storage-backed cache (persists across server restarts in dev/production)
 */
const _cachedFetch = defineCachedFunction(
  async (feedUrl: string): Promise<PodcastFeed> => {
    return await parsePodcastFeed(feedUrl)
  },
  {
    maxAge: CACHE_TTL,
    name: 'podcast-feed',
    getKey: (feedUrl: string) => getCacheKey(feedUrl),
  }
)

/**
 * Fetch and parse podcast feed with caching.
 * Uses an in-memory dedup layer on top of Nitro's storage cache so that
 * concurrent prerender routes share a single fetch+parse promise.
 */
export function getCachedPodcastFeed(feedUrl: string): Promise<PodcastFeed> {
  const existing = memoryCache.get(feedUrl)
  if (existing) return existing

  const promise = _cachedFetch(feedUrl)
  memoryCache.set(feedUrl, promise)
  return promise
}

/**
 * Clear the cached podcast feed for a specific URL
 */
export async function clearFeedCache(feedUrl: string): Promise<void> {
  memoryCache.delete(feedUrl)
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
  memoryCache.clear()
  const storage = useStorage('cache')
  
  try {
    const keys = await storage.getKeys('nitro:functions:podcast-feed:')
    await Promise.all(keys.map(key => storage.removeItem(key)))
  } catch (error) {
    console.warn('Failed to clear all feed caches:', error)
  }
}
