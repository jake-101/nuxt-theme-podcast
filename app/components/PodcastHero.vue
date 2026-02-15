<script setup lang="ts">
import type { Podcast, PlatformLinks } from '~/types/podcast'

interface Props {
  podcast: Podcast
  platforms?: PlatformLinks
}

const props = defineProps<Props>()

const platformEntries = computed(() => {
  if (!props.platforms) return []
  return Object.entries(props.platforms).filter(([_, url]) => url && url.trim() !== '')
})
</script>

<template>
  <header class="podcast-hero">
    <div class="podcast-hero__artwork">
      <NuxtImg :src="podcast.artwork" :alt="`${podcast.title} artwork`" width="300" height="300" loading="eager" />
    </div>
    <div class="podcast-hero__content">
      <h1>{{ podcast.title }}</h1>
      <p class="podcast-hero__author">{{ podcast.author }}</p>
      <p class="podcast-hero__description">{{ podcast.description }}</p>

      <nav v-if="platformEntries.length > 0" class="podcast-hero__subscribe" aria-label="Subscribe to podcast">
        <div class="subscribe-buttons">
          <SubscribeButton
            v-for="[platform, url] in platformEntries"
            :key="platform"
            :platform="platform"
            :url="url"
          />
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.podcast-hero__author {
  font-weight: 600;
  color: var(--muted-foreground);
  margin-top: 0.25rem;
}

.podcast-hero__description {
  margin-top: 0.75rem;
  line-height: 1.6;
  color: var(--foreground);
}

.podcast-hero__subscribe {
  margin-top: 1.5rem;
}

.subscribe-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

@media (max-width: 768px) {
  .subscribe-buttons {
    gap: 0.5rem;
  }
}
</style>
