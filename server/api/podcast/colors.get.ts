import type { ThemeColorsResponse } from '../../../types/theme'
import { extractArtworkColors } from '../../utils/color-extractor'
import { generateThemePalette } from '../../utils/palette-generator'

/**
 * GET /api/podcast/colors
 *
 * Extracts colors from the podcast artwork and returns an accessible
 * theme palette for both light and dark modes. Results are cached
 * alongside the feed data (same TTL).
 */
export default defineCachedEventHandler(
  async (event): Promise<ThemeColorsResponse> => {
    // Get the feed URL and artwork from the podcast data
    const appConfig = useAppConfig(event)
    const feedUrl = appConfig.podcast?.feedUrl

    if (!feedUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Feed URL not configured',
      })
    }

    // Fetch the podcast feed to get artwork URL
    const { getCachedPodcastFeed } = await import('../../utils/feed-cache')
    const feed = await getCachedPodcastFeed(feedUrl)
    const artworkUrl = feed.podcast.artwork

    if (!artworkUrl) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No artwork found in podcast feed',
      })
    }

    // Extract colors from the artwork image
    const extractedColors = await extractArtworkColors(artworkUrl)

    if (extractedColors.length === 0) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Could not extract colors from artwork',
      })
    }

    // Generate accessible theme palette
    const palette = generateThemePalette(extractedColors)

    // Pick the source color (the primary that was chosen)
    const sourceColor = extractedColors[0]?.hex || '#574747'

    return {
      palette,
      sourceColor,
      extractedColors,
    }
  },
  {
    maxAge: 60 * 60, // Cache for 1 hour (same as feed)
    name: 'podcast-colors',
    getKey: (event) => {
      const appConfig = useAppConfig(event)
      return `colors:${appConfig.podcast?.feedUrl || 'default'}`
    },
  },
)
