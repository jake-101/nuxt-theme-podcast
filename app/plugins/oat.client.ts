// Import oat.js for WebComponents (client-only)
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    import('@knadh/oat/oat.min.js')
  }
})
