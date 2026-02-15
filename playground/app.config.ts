export default defineAppConfig({
  podcast: {
    feedUrl: 'https://feed.syntax.fm/',
    siteTitle: 'Syntax - Tasty Web Development Treats',
    platforms: {
      spotify: 'https://open.spotify.com/show/4kYCRYJ3yK5DQbP5tbfZby',
      apple: 'https://podcasts.apple.com/us/podcast/syntax-tasty-web-development-treats/id1253186678',
      youtube: 'https://www.youtube.com/@syntaxfm',
      pocketcasts: 'https://pca.st/fmx9',
      overcast: 'https://overcast.fm/itunes1253186678',
      rss: 'https://feed.syntax.fm/',
    },
    episodesPerPage: 12,
    theme: 'auto',
  },
})
