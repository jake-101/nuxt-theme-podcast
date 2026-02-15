<script setup lang="ts">
const appConfig = useAppConfig()
const podcastTitle = computed(() => appConfig.podcast?.siteTitle || 'Podcast')
const rssUrl = computed(() => appConfig.podcast?.platforms?.rss || appConfig.podcast?.feedUrl)
</script>

<template>
  <footer>
    <div class="container">
      <p>
        <strong>{{ podcastTitle }}</strong>
        <span v-if="rssUrl"> &middot; <a :href="rssUrl" target="_blank" rel="noopener">RSS Feed</a></span>
      </p>
      <p>
        <small>Powered by <a href="https://github.com/yourusername/nuxt-podcast-theme" target="_blank" rel="noopener">nuxt-podcast-theme</a></small>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
