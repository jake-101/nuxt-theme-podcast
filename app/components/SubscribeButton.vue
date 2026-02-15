<script setup lang="ts">
interface Props {
  platform: string
  url?: string
}

const props = defineProps<Props>()

const platformLabels: Record<string, string> = {
  spotify: 'Spotify',
  apple: 'Apple Podcasts',
  youtube: 'YouTube',
  pocketcasts: 'Pocket Casts',
  overcast: 'Overcast',
  rss: 'RSS Feed',
}

const label = computed(() => platformLabels[props.platform] || props.platform)
const isDisabled = computed(() => !props.url || props.url.trim() === '')
</script>

<template>
  <a
    v-if="!isDisabled"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    role="button"
  >
    {{ label }}
  </a>
</template>
