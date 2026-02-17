export default defineNuxtConfig({
  extends: ['..'],

  // Force static output for Cloudflare Pages (overrides auto-detected cloudflare-module)
  nitro: {
    preset: 'static',
  },
})
