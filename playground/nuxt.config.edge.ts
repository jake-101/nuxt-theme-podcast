export default defineNuxtConfig({
  extends: ['..'],

  nitro: {
    preset: 'cloudflare-pages',
    // sharp and its sub-packages use native binaries incompatible with CF edge.
    // Resolve them all to a virtual empty module so Rollup can bundle cleanly.
    alias: {
      'sharp': 'unenv/runtime/mock/noop',
    },
    rollupConfig: {
      plugins: [
        {
          name: 'stub-sharp',
          resolveId(id: string) {
            if (id.startsWith('@img/sharp') || id === 'sharp') {
              return { id: 'unenv/runtime/mock/noop', external: false }
            }
          },
        },
      ],
    },
  },
})
