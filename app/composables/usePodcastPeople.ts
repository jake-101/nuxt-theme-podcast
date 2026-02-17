import type { Episode, Person } from '~/types/podcast'

/**
 * Generate a URL-safe slug from a person's name
 */
function personSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Composable for querying persons extracted from Podcasting 2.0 podcast:person tags.
 *
 * Aggregates persons across all episodes, deduplicates by name,
 * and exposes helpers to find persons and their episodes.
 */
export const usePodcastPeople = () => {
  const { episodes } = usePodcast()

  /**
   * Aggregate all unique persons across all episodes.
   * Persons with the same name are merged; episode slugs are collected.
   */
  const people = computed<Person[]>(() => {
    const map = new Map<string, Person>()

    for (const episode of episodes.value) {
      const persons = episode.podcast2?.persons
      if (!persons?.length) continue

      for (const p of persons) {
        if (!p.name) continue

        const slug = personSlug(p.name)
        const existing = map.get(slug)

        if (existing) {
          // Merge: add episode slug if not already present
          if (!existing.episodeSlugs.includes(episode.slug)) {
            existing.episodeSlugs.push(episode.slug)
          }
          // Fill in missing metadata from later appearances
          if (!existing.img && p.img) existing.img = p.img
          if (!existing.href && p.href) existing.href = p.href
          if (!existing.role && p.role) existing.role = p.role
          if (!existing.group && p.group) existing.group = p.group
        } else {
          map.set(slug, {
            slug,
            name: p.name,
            role: p.role,
            group: p.group,
            img: p.img,
            href: p.href,
            episodeSlugs: [episode.slug],
          })
        }
      }
    }

    // Sort by number of appearances (most prolific first), then alphabetically
    return Array.from(map.values()).sort((a: Person, b: Person) => {
      const diff = b.episodeSlugs.length - a.episodeSlugs.length
      return diff !== 0 ? diff : a.name.localeCompare(b.name)
    })
  })

  /** Whether any episodes in this feed have podcast:person data */
  const hasPeople = computed(() => people.value.length > 0)

  /**
   * Find a single person by their slug
   */
  const findPersonBySlug = (slug: string): Person | undefined => {
    return people.value.find(p => p.slug === slug)
  }

  /**
   * Get the full Episode objects for a given person
   */
  const getEpisodesForPerson = (person: Person): Episode[] => {
    const slugSet = new Set(person.episodeSlugs)
    return episodes.value.filter(ep => slugSet.has(ep.slug))
  }

  /**
   * Get the persons that appear in a specific episode
   */
  const getPersonsForEpisode = (episodeSlug: string): Person[] => {
    return people.value.filter(p => p.episodeSlugs.includes(episodeSlug))
  }

  return {
    people,
    hasPeople,
    findPersonBySlug,
    getEpisodesForPerson,
    getPersonsForEpisode,
  }
}
