export default defineNuxtConfig({
  extends: ['..'],

  nitro: {
    preset: 'cloudflare-pages',
    // sharp uses native binaries incompatible with the CF edge runtime.
    // Alias it to a no-op so Rollup can bundle the worker without errors.
    alias: {
      sharp: 'unenv/runtime/mock/noop',
    },
  },
})
