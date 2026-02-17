export default defineNuxtConfig({
  extends: ['..'],

  // Force static output for Cloudflare Pages (overrides auto-detected cloudflare-module)
  nitro: {
    preset: 'static',
    prerender: {
      // Prerender multiple routes in parallel to speed up static builds
      concurrency: 20,
      // Crawl links from rendered pages to discover all routes
      crawlLinks: true,
    },
  },
})
