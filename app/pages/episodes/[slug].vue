<script setup lang="ts">
// Composables and utils are auto-imported by Nuxt 4
const route = useRoute()
const router = useRouter()
const requestURL = useRequestURL()
const { podcast, findEpisodeBySlug } = usePodcast()
const player = useAudioPlayer()

// Get episode from slug
const slug = computed(() => route.params.slug as string)
const episode = computed(() => findEpisodeBySlug(slug.value))

// Handle 404 if episode not found
if (!episode.value && !import.meta.server) {
  navigateTo('/', { redirectCode: 404 })
}

// Linkified show notes with clickable timestamps
const showNotes = computed(() => {
  if (!episode.value?.htmlContent) return ''
  return linkifyTimestamps(episode.value.htmlContent)
})

// Handle timestamp clicks
const handleTimestampClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.classList.contains('timestamp-link')) {
    event.preventDefault()
    const timestamp = target.getAttribute('data-timestamp')
    if (timestamp && episode.value) {
      const seconds = parseInt(timestamp, 10)
      
      // Load episode if not current, then seek
      if (player.currentEpisode.value?.guid !== episode.value.guid) {
        player.play(episode.value).then(() => {
          player.seek(seconds)
        })
      } else {
        player.seek(seconds)
      }
    }
  }
}

// Auto-seek on mount if ?t= query parameter is present
onMounted(() => {
  if (route.query.t && episode.value) {
    const timestampSeconds = parseQueryTimestamp(route.query.t as string)
    if (timestampSeconds !== null) {
      // Small delay to ensure player is ready
      setTimeout(() => {
        if (player.currentEpisode.value?.guid === episode.value?.guid) {
          player.seek(timestampSeconds)
        }
      }, 500)
    }
  }
})

// Parse ?t= parameter (supports seconds, MM:SS, HH:MM:SS)
const parseQueryTimestamp = (timestamp: string): number | null => {
  if (/^\d+$/.test(timestamp)) {
    return parseInt(timestamp, 10)
  }

  const parts = timestamp.split(':').map(Number)
  if (parts.some(isNaN)) return null

  if (parts.length === 2) {
    const [minutes, seconds] = parts
    return minutes * 60 + seconds
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    return hours * 3600 + minutes * 60 + seconds
  }

  return null
}

// Share with timestamp
const shareUrl = computed(() => {
  if (!episode.value) return ''
  return player.getShareUrl(episode.value.slug)
})

const copyShareUrl = async () => {
  if (shareUrl.value) {
    try {
      await navigator.clipboard.writeText(shareUrl.value)
      alert('Share link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
}

// Play this episode
const playEpisode = () => {
  if (episode.value) {
    player.play(episode.value)
  }
}

// SEO: Episode meta tags and structured data
useHead({
  title: computed(() => {
    if (!episode.value || !podcast.value) return 'Episode'
    return `${episode.value.title} - ${podcast.value.title}`
  }),
  meta: computed(() => {
    if (!episode.value || !podcast.value) return []
    
    const episodeUrl = `${requestURL.origin}/episodes/${episode.value.slug}`
    const ogTags = generateEpisodeOGTags(episode.value, podcast.value, episodeUrl)
    const twitterTags = generateEpisodeTwitterTags(episode.value, podcast.value)
    
    return [
      { name: 'description', content: episode.value.description },
      // Open Graph
      { property: 'og:title', content: ogTags['og:title'] },
      { property: 'og:description', content: ogTags['og:description'] },
      { property: 'og:image', content: ogTags['og:image'] },
      { property: 'og:type', content: ogTags['og:type'] },
      { property: 'og:url', content: ogTags['og:url'] },
      { property: 'og:audio', content: ogTags['og:audio'] },
      { property: 'og:audio:type', content: ogTags['og:audio:type'] },
      // Twitter Card
      { name: 'twitter:card', content: twitterTags['twitter:card'] },
      { name: 'twitter:title', content: twitterTags['twitter:title'] },
      { name: 'twitter:description', content: twitterTags['twitter:description'] },
      { name: 'twitter:image', content: twitterTags['twitter:image'] },
    ]
  }),
  script: computed(() => {
    if (!episode.value || !podcast.value) return []
    
    return [
      {
        type: 'application/ld+json',
        children: JSON.stringify(generateEpisodeSD(episode.value, podcast.value)),
      },
    ]
  }),
})
</script>

<template>
  <div v-if="episode && podcast" class="episode-page">
    <!-- Episode header -->
    <header class="episode-header">
      <!-- Episode artwork -->
      <div class="episode-artwork">
        <NuxtImg 
          :src="episode.artwork || podcast.artwork" 
          :alt="`${episode.title} artwork`"
          width="300"
          height="300"
          loading="eager"
        />
      </div>

      <!-- Episode metadata -->
      <div class="episode-meta">
        <div class="episode-badges">
          <!-- Episode type badge -->
          <span 
            v-if="episode.episodeType" 
            class="badge episode-type"
            :class="`type-${episode.episodeType}`"
          >
            {{ episode.episodeType }}
          </span>
          
          <!-- Explicit badge -->
          <span v-if="episode.explicit" class="badge explicit">
            Explicit
          </span>
        </div>

        <h1 class="episode-title">{{ episode.title }}</h1>

        <div class="episode-details">
          <span class="episode-date">{{ formatDate(episode.pubDate) }}</span>
          <span class="separator">•</span>
          <span class="episode-duration">{{ formatDuration(episode.duration) }}</span>
          <template v-if="episode.episodeNumber">
            <span class="separator">•</span>
            <span class="episode-number">
              <template v-if="episode.seasonNumber">S{{ episode.seasonNumber }} </template>
              E{{ episode.episodeNumber }}
            </span>
          </template>
        </div>

        <!-- Play button -->
        <button 
          class="play-button"
          type="button"
          @click="playEpisode"
        >
          <span v-if="player.currentEpisode?.guid === episode.guid && player.isPlaying">
            ⏸️ Pause
          </span>
          <span v-else>
            ▶️ Play Episode
          </span>
        </button>

        <!-- Share button -->
        <button 
          class="share-button"
          type="button"
          @click="copyShareUrl"
          title="Copy shareable link with current timestamp"
        >
          🔗 Share
        </button>
      </div>
    </header>

    <!-- Episode description -->
    <section v-if="episode.description" class="episode-description">
      <p>{{ episode.description }}</p>
    </section>

    <!-- Keywords -->
    <section v-if="episode.keywords && episode.keywords.length > 0" class="episode-keywords">
      <div class="keywords">
        <span 
          v-for="keyword in episode.keywords" 
          :key="keyword"
          class="keyword-tag"
        >
          {{ keyword }}
        </span>
      </div>
    </section>

    <!-- Show notes with clickable timestamps -->
    <section v-if="showNotes" class="episode-shownotes">
      <h2>Show Notes</h2>
      <div 
        class="shownotes-content"
        v-html="showNotes"
        @click="handleTimestampClick"
      ></div>
    </section>

    <!-- Podcasting 2.0 features -->
    <section v-if="episode.transcript || episode.funding || episode.persons" class="podcast20-features">
      <!-- Transcript link -->
      <div v-if="episode.transcript" class="feature-item">
        <h3>Transcript</h3>
        <a 
          :href="episode.transcript.url" 
          target="_blank" 
          rel="noopener"
          class="transcript-link"
        >
          {{ episode.transcript.type }} transcript
        </a>
      </div>

      <!-- Funding/support links -->
      <div v-if="episode.funding" class="feature-item">
        <h3>Support</h3>
        <a 
          :href="episode.funding.url" 
          target="_blank" 
          rel="noopener"
          class="funding-link"
        >
          {{ episode.funding.message || 'Support this podcast' }}
        </a>
      </div>

      <!-- Episode contributors -->
      <div v-if="episode.persons && episode.persons.length > 0" class="feature-item">
        <h3>Contributors</h3>
        <ul class="persons-list">
          <li v-for="person in episode.persons" :key="person.name">
            <strong>{{ person.name }}</strong>
            <span v-if="person.role"> - {{ person.role }}</span>
            <a 
              v-if="person.href" 
              :href="person.href" 
              target="_blank" 
              rel="noopener"
            >
              🔗
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- Original episode link -->
    <section v-if="episode.link" class="episode-footer">
      <a 
        :href="episode.link" 
        target="_blank" 
        rel="noopener"
        class="original-link"
      >
        View original episode page →
      </a>
    </section>
  </div>

  <!-- 404 fallback -->
  <div v-else class="episode-not-found">
    <h1>Episode not found</h1>
    <p>The episode you're looking for doesn't exist.</p>
    <NuxtLink to="/" class="back-link">← Back to home</NuxtLink>
  </div>
</template>

<style scoped>
.episode-page {
  max-width: 100%;
}

.episode-header {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.episode-artwork img {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.episode-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.episode-type {
  background-color: var(--primary, #2563eb);
  color: white;
}

.type-bonus {
  background-color: var(--accent, #8b5cf6);
}

.type-trailer {
  background-color: var(--warning, #f59e0b);
}

.explicit {
  background-color: var(--error, #dc2626);
  color: white;
}

.episode-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  line-height: 1.2;
}

.episode-details {
  color: var(--text-muted, #6b7280);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.separator {
  margin: 0 0.5rem;
}

.play-button,
.share-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.play-button:hover,
.share-button:hover {
  background-color: var(--muted);
  border-color: var(--primary);
}

.play-button {
  background-color: var(--primary, #2563eb);
  color: white;
  border-color: var(--primary, #2563eb);
}

.play-button:hover {
  opacity: 0.9;
}

.episode-description {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--bg-alt, #f9fafb);
  border-radius: 0.5rem;
}

.episode-keywords {
  margin-bottom: 2rem;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-tag {
  padding: 0.25rem 0.75rem;
  background-color: var(--bg-alt, #f3f4f6);
  border: 1px solid var(--border);
  border-radius: 1rem;
  font-size: 0.875rem;
  color: var(--text-muted, #6b7280);
}

.episode-shownotes {
  margin-bottom: 2rem;
}

.episode-shownotes h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.shownotes-content {
  line-height: 1.7;
}

/* Style timestamp links */
.shownotes-content :deep(.timestamp-link) {
  color: var(--primary, #2563eb);
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
}

.shownotes-content :deep(.timestamp-link:hover) {
  opacity: 0.8;
}

.podcast20-features {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--bg-alt, #f9fafb);
  border-radius: 0.5rem;
}

.feature-item {
  margin-bottom: 1rem;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-item h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.transcript-link,
.funding-link {
  color: var(--primary, #2563eb);
  text-decoration: underline;
}

.persons-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.persons-list li {
  padding: 0.25rem 0;
}

.episode-footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.original-link {
  color: var(--primary, #2563eb);
  text-decoration: underline;
}

.episode-not-found {
  text-align: center;
  padding: 3rem 1rem;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--primary, #2563eb);
  text-decoration: underline;
}

/* Responsive layout */
@media (max-width: 768px) {
  .episode-header {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .episode-artwork {
    max-width: 300px;
    margin: 0 auto;
  }

  .episode-title {
    font-size: 1.5rem;
  }
  
  .play-button,
  .share-button {
    display: block;
    width: 100%;
    margin-right: 0;
  }
}
</style>
