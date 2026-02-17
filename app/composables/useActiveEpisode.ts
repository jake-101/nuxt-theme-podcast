/**
 * Tracks which episode slug was clicked for navigation,
 * so only that card gets the shared element card transition.
 * Clears automatically when the route changes (i.e. navigating back).
 */
import { watch } from 'vue'
import { useRoute } from '#app'

const activeSlug = ref<string | null>(null)
let watcherSetup = false

export function useActiveEpisode() {
  // Set up route watcher once to clear on navigation
  if (!watcherSetup && import.meta.client) {
    watcherSetup = true
    const route = useRoute()
    watch(() => route.fullPath, () => {
      // Clear after a tick so the exit animation can start first
      setTimeout(() => {
        activeSlug.value = null
      }, 50)
    })
  }

  const setActive = (slug: string) => {
    activeSlug.value = slug
  }

  const clear = () => {
    activeSlug.value = null
  }

  const isActive = (slug: string) => activeSlug.value === slug

  return {
    activeSlug,
    setActive,
    clear,
    isActive,
  }
}
