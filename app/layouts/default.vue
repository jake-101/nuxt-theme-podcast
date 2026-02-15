<script setup lang="ts">
import { useHead } from '#app'

const appConfig = useAppConfig()
const { podcast } = usePodcast()

// Dark mode support using VueUse
const colorMode = useColorMode({
  attribute: 'data-theme',
  modes: {
    light: 'light',
    dark: 'dark',
  },
})

// Initialize theme from app config
onMounted(() => {
  if (appConfig.podcast.theme !== 'auto') {
    colorMode.value = appConfig.podcast.theme
  }
})

// Toggle dark mode
const toggleDarkMode = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}

// RSS auto-discovery meta tag
useHead({
  link: [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: computed(() => podcast.value?.title || 'Podcast RSS Feed'),
      href: computed(() => appConfig.podcast.platforms.rss || appConfig.podcast.feedUrl),
    },
  ],
})
</script>

<template>
  <div class="podcast-layout">
    <!-- Header with dark mode toggle -->
    <header class="site-header">
      <div class="container">
        <nav class="site-nav">
          <NuxtLink to="/" class="site-logo">
            <h1>{{ podcast?.title || appConfig.podcast.siteTitle || 'Podcast' }}</h1>
          </NuxtLink>
          
          <button 
            class="theme-toggle"
            type="button"
            @click="toggleDarkMode"
            :aria-label="colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <Icon v-if="colorMode === 'dark'" name="ph:sun-bold" size="20" />
            <Icon v-else name="ph:moon-bold" size="20" />
          </button>
        </nav>
      </div>
    </header>

    <!-- Main content area -->
    <main class="main-content">
      <div class="container">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <PodcastFooter />

    <!-- Sticky audio player at bottom -->
    <AudioPlayer />
  </div>
</template>

<style scoped>
.podcast-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* Account for sticky audio player height */
  padding-bottom: 100px;
}

.site-header {
  background-color: var(--background);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.site-logo {
  text-decoration: none;
  color: inherit;
}

.site-logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  padding: 0.5rem;
  cursor: pointer;
  line-height: 1;
  color: var(--foreground);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: var(--muted);
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .podcast-layout {
    padding-bottom: 120px; /* More space on mobile */
  }
  
  .site-logo h1 {
    font-size: 1.25rem;
  }
  
  .main-content {
    padding: 1rem 0;
  }
}
</style>
