export default defineAppConfig({
  podcast: {
    // RSS feed URL - required
    feedUrl: '',
    
    // Site metadata
    siteTitle: '',
    
    // Platform links for subscribe buttons
    platforms: {
      spotify: '',
      apple: '',
      youtube: '',
      pocketcasts: '',
      overcast: '',
      rss: '',
    },
    
    // Display options
    episodesPerPage: 12,
    
    // Theme: 'light', 'dark', or 'auto'
    theme: 'auto',
  },
})
