<script setup lang="ts">
interface Props {
  platform: string
  url?: string
}

const props = defineProps<Props>()

interface PlatformInfo {
  label: string
  icon: string
  brandColor: string
  action: string // "LISTEN ON" or "SUBSCRIBE"
}

const platformMap: Record<string, PlatformInfo> = {
  apple: {
    label: 'Apple Podcasts',
    icon: 'simple-icons:applepodcasts',
    brandColor: '#D056F0',
    action: 'LISTEN ON',
  },
  spotify: {
    label: 'Spotify',
    icon: 'simple-icons:spotify',
    brandColor: '#1DB954',
    action: 'LISTEN ON',
  },
  youtube: {
    label: 'YouTube',
    icon: 'simple-icons:youtube',
    brandColor: '#FF0000',
    action: 'WATCH ON',
  },
  pocketcasts: {
    label: 'Pocket Casts',
    icon: 'simple-icons:pocketcasts',
    brandColor: '#F43E37',
    action: 'LISTEN ON',
  },
  overcast: {
    label: 'Overcast',
    icon: 'simple-icons:overcast',
    brandColor: '#FC7E0F',
    action: 'LISTEN ON',
  },
  rss: {
    label: 'RSS Feed',
    icon: 'ph:rss-bold',
    brandColor: '#F68A1F',
    action: 'SUBSCRIBE VIA',
  },
}

const info = computed(() => platformMap[props.platform] || {
  label: props.platform,
  icon: 'ph:link-bold',
  brandColor: 'var(--primary)',
  action: 'OPEN',
})

const isDisabled = computed(() => !props.url || props.url.trim() === '')
</script>

<template>
  <a
    v-if="!isDisabled"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="subscribe-btn"
  >
    <span class="subscribe-btn__icon" :style="{ color: info.brandColor }">
      <Icon :name="info.icon" size="22" />
    </span>
    <span class="subscribe-btn__text">
      <span class="subscribe-btn__action">{{ info.action }}</span>
      <span class="subscribe-btn__platform">{{ info.label }}</span>
    </span>
  </a>
</template>

<style scoped>
.subscribe-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: var(--card, var(--background));
  color: var(--foreground);
  text-decoration: none;
  transition: border-color var(--transition-fast),
              box-shadow var(--transition-fast),
              background-color var(--transition-fast);
  cursor: pointer;
  white-space: nowrap;
}

.subscribe-btn:hover {
  border-color: var(--muted-foreground);
  box-shadow: var(--shadow-small);
  background-color: var(--faint, var(--secondary));
}

.subscribe-btn:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.subscribe-btn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}

.subscribe-btn__text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.subscribe-btn__action {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.subscribe-btn__platform {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
}

/* Dark mode adjustments */
[data-theme="dark"] .subscribe-btn {
  background: var(--card, var(--secondary));
}
</style>
