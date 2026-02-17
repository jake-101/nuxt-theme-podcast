export default defineNuxtConfig({
  extends: ['..'],

  nitro: {
    preset: 'cloudflare-pages',
    // sharp uses native binaries incompatible with the CF edge runtime.
    // Replace it with an empty mock so Nitro can bundle the worker successfully.
    replace: {
      'require("sharp")': 'null',
      'require(\'sharp\')': 'null',
    },
  },

  // Use Cloudflare's built-in image resizing — no sharp dependency.
  image: {
    provider: 'cloudflare',
  },
})
