<script setup lang="ts">
import type { Episode } from '~/types/podcast'

interface Props {
  episodes: Episode[]
  episodesPerPage?: number
  showArtwork?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  episodesPerPage: 12,
  loading: false,
})

const emit = defineEmits<{
  play: [episode: Episode]
}>()

// Search functionality
const searchQuery = ref('')
const filteredEpisodes = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.episodes
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.episodes.filter(episode => 
    String(episode.title).toLowerCase().includes(query) ||
    String(episode.description).toLowerCase().includes(query)
  )
})

// Pagination
const currentPage = ref(1)
const totalPages = computed(() => 
  Math.ceil(filteredEpisodes.value.length / props.episodesPerPage)
)

const paginatedEpisodes = computed(() => {
  const start = (currentPage.value - 1) * props.episodesPerPage
  const end = start + props.episodesPerPage
  return filteredEpisodes.value.slice(start, end)
})

const setPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Reset to page 1 when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

const handlePlay = (episode: Episode) => {
  emit('play', episode)
}
</script>

<template>
  <div>
    <EpisodeSearch
      @update:query="searchQuery = $event"
      :result-count="filteredEpisodes.length"
    />
    
    <div v-if="loading">
      <p>Loading episodes...</p>
    </div>
    
    <div v-else-if="filteredEpisodes.length === 0">
      <p>No episodes found.</p>
    </div>
    
    <div v-else>
      <div class="episode-grid">
        <EpisodeCard
          v-for="episode in paginatedEpisodes"
          :key="episode.guid"
          :episode="episode"
          :show-artwork="showArtwork"
          @play="handlePlay"
        />
      </div>
      
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="setPage"
      />
    </div>
  </div>
</template>
