import type { Podcast, Episode } from '~/types/podcast'

/**
 * Generate schema.org PodcastSeries structured data for SEO
 * @see https://schema.org/PodcastSeries
 */
export function generatePodcastSeriesSD(podcast: Podcast) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: podcast.title,
    author: {
      '@type': 'Person',
      name: podcast.author,
    },
    description: podcast.description,
    image: podcast.artwork,
    url: podcast.link || podcast.feedUrl,
    ...(podcast.language && { inLanguage: podcast.language }),
    ...(podcast.copyright && { copyrightHolder: { '@type': 'Organization', name: podcast.copyright } }),
    webFeed: podcast.feedUrl,
  }
}

/**
 * Generate schema.org PodcastEpisode structured data for SEO
 * @see https://schema.org/PodcastEpisode
 */
export function generateEpisodeSD(episode: Episode, podcast: Podcast) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: episode.title,
    description: episode.description,
    ...(episode.episodeNumber && { episodeNumber: episode.episodeNumber }),
    ...(episode.seasonNumber && { partOfSeason: {
      '@type': 'PodcastSeason',
      seasonNumber: episode.seasonNumber,
    }}),
    datePublished: episode.pubDate,
    duration: `PT${Math.floor(episode.duration)}S`, // ISO 8601 duration format
    url: episode.link,
    image: episode.artwork || podcast.artwork,
    associatedMedia: {
      '@type': 'MediaObject',
      contentUrl: episode.audioUrl,
      encodingFormat: episode.audioType,
      ...(episode.audioLength && { contentSize: episode.audioLength }),
    },
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: podcast.title,
      url: podcast.link || podcast.feedUrl,
    },
  }
}

/**
 * Generate Open Graph meta tags for podcast pages
 */
export function generatePodcastOGTags(podcast: Podcast) {
  return {
    'og:title': podcast.title,
    'og:description': podcast.description,
    'og:image': podcast.artwork,
    'og:type': 'website',
    ...(podcast.link && { 'og:url': podcast.link }),
  }
}

/**
 * Generate Open Graph meta tags for episode pages
 */
export function generateEpisodeOGTags(episode: Episode, podcast: Podcast, episodeUrl?: string) {
  return {
    'og:title': `${episode.title} - ${podcast.title}`,
    'og:description': episode.description,
    'og:image': episode.artwork || podcast.artwork,
    'og:type': 'music.song', // Closest OG type for podcast episodes
    ...(episodeUrl && { 'og:url': episodeUrl }),
    'og:audio': episode.audioUrl,
    'og:audio:type': episode.audioType,
  }
}

/**
 * Generate Twitter Card meta tags for podcast pages
 */
export function generatePodcastTwitterTags(podcast: Podcast) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': podcast.title,
    'twitter:description': podcast.description,
    'twitter:image': podcast.artwork,
  }
}

/**
 * Generate Twitter Card meta tags for episode pages
 */
export function generateEpisodeTwitterTags(episode: Episode, podcast: Podcast) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': `${episode.title} - ${podcast.title}`,
    'twitter:description': episode.description,
    'twitter:image': episode.artwork || podcast.artwork,
  }
}
