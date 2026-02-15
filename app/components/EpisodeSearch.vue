<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

interface Props {
  resultCount?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:query': [query: string]
}>()

const searchInput = ref('')
const debouncedSearch = refDebounced(searchInput, 300)

watch(debouncedSearch, (newValue) => {
  emit('update:query', newValue)
})

const clearSearch = () => {
  searchInput.value = ''
}
</script>

<template>
  <div style="margin: 1.5rem 0;">
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <input
        v-model="searchInput"
        type="text"
        placeholder="Search episodes..."
        aria-label="Search episodes"
      />
      <button
        v-if="searchInput"
        @click="clearSearch"
        type="button"
        aria-label="Clear search"
      >
        Clear
      </button>
    </div>
    <p v-if="resultCount !== undefined" style="margin-top: 0.5rem;">
      <small>{{ resultCount }} {{ resultCount === 1 ? 'episode' : 'episodes' }} found</small>
    </p>
  </div>
</template>
