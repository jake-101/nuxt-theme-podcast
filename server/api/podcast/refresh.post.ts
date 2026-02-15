import type { PodcastFeed } from '../../../types/podcast'
import { clearFeedCache, getCachedPodcastFeed } from '../../utils/feed-cache'

/**
 * POST /api/podcast/refresh
 * 
 * Clears the cached podcast feed and fetches fresh data.
 * Useful for webhooks/cron jobs when the RSS feed is updated.
 * 
 * Returns the fresh podcast feed data.
 */
export default defineEventHandler(async (event): Promise<PodcastFeed> => {
  try {
    // Get the feed URL from app config
    const appConfig = useAppConfig(event)
    const feedUrl = appConfig.podcast?.feedUrl
    
    // Validate feed URL is configured
    if (!feedUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Feed URL not configured',
        message: 'podcast.feedUrl must be set in app.config.ts',
      })
    }
    
    // Clear the cache for this feed
    try {
      await clearFeedCache(feedUrl)
    } catch (error) {
      console.warn('Failed to clear feed cache:', error)
      // Continue anyway - we'll still fetch fresh data
    }
    
    // Fetch fresh data
    try {
      const feed = await getCachedPodcastFeed(feedUrl)
      
      // Log successful refresh
      console.log(`Podcast feed refreshed successfully: ${feed.podcast.title} (${feed.episodes.length} episodes)`)
      
      return feed
    } catch (error) {
      // Handle feed fetch/parse errors
      const message = error instanceof Error ? error.message : 'Unknown error'
      
      // Check for common error types
      if (message.includes('Failed to fetch feed')) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Feed unavailable',
          message: `Unable to fetch RSS feed: ${message}`,
        })
      } else if (message.includes('Failed to parse RSS XML')) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Invalid feed format',
          message: `Unable to parse RSS feed: ${message}`,
        })
      } else if (message.includes('timeout')) {
        throw createError({
          statusCode: 504,
          statusMessage: 'Feed timeout',
          message: 'RSS feed request timed out',
        })
      }
      
      // Generic error
      throw createError({
        statusCode: 500,
        statusMessage: 'Feed processing failed',
        message: `Failed to process podcast feed: ${message}`,
      })
    }
  } catch (error) {
    // Re-throw H3 errors (already formatted)
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    // Handle unexpected errors
    console.error('Unexpected error in /api/podcast/refresh:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      message: 'An unexpected error occurred while refreshing the podcast feed',
    })
  }
})
