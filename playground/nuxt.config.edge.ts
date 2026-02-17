export default defineNuxtConfig({
  extends: ['..'],

  nitro: {
    preset: 'cloudflare-pages',
  },

  // IPX (default image provider) depends on sharp which uses native binaries
  // incompatible with the Cloudflare edge runtime. Use Cloudflare's built-in
  // image resizing instead — no sharp dependency, runs natively on the edge.
  image: {
    provider: 'cloudflare',
  },
})
