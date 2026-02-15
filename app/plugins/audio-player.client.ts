/**
 * Client-only plugin to initialize the audio player at app root
 * Ensures Howler.js only loads on the client side (no SSR)
 * Auto-loads the latest episode (paused, ready to play)
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (import.meta.server) return
  
  const player = useAudioPlayer()
  
  // Use nuxtApp hook to run after app is ready
  nuxtApp.hook('app:mounted', async () => {
    const { episodes } = usePodcast()
    
    // Wait for episodes to be available
    watch(episodes, async (newEpisodes) => {
      if (newEpisodes && newEpisodes.length > 0 && !player.hasEpisode.value) {
        // Load the latest episode (first in the array)
        const latestEpisode = newEpisodes[0]
        console.log('Auto-loading latest episode:', latestEpisode.title)
        await player.play(latestEpisode)
        player.pause() // Immediately pause it - ready to play when user clicks
      }
    }, { immediate: true })
  })
})
