<script setup lang="ts">
import type { Person } from '~/types/podcast'

interface Props {
  people: Person[]
}

defineProps<Props>()
</script>

<template>
  <div class="people-grid">
    <PodcastPersonCard
      v-for="person in people"
      :key="person.slug"
      :person="person"
    />
  </div>
</template>

<style scoped>
.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .people-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 1rem;
  }
}
</style>
