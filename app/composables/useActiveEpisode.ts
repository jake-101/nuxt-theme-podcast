/**
 * Tracks which episode slug was clicked for navigation,
 * so only that card gets the shared element card transition.
 * Uses useState for SSR-safe shared state (no cross-request leaks).
 */
export function useActiveEpisode() {
  const activeSlug = useState<string | null>('activeEpisode', () => null)

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
