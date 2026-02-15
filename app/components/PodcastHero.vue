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
      <p><strong>{{ podcast.author }}</strong></p>
      <p>{{ podcast.description }}</p>
      
      <div v-if="platformEntries.length > 0">
        <h2>Subscribe</h2>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <SubscribeButton
            v-for="[platform, url] in platformEntries"
            :key="platform"
            :platform="platform"
            :url="url"
          />
        </div>
      </div>
    </div>
  </header>
</template>
