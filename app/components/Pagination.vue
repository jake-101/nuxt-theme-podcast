<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  /** Max visible page buttons (excluding prev/next). Defaults to 7. */
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 7,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const isFirst = computed(() => props.currentPage === 1)
const isLast = computed(() => props.currentPage === props.totalPages)

/**
 * Build the list of page items to render.
 * Returns numbers for page buttons and null for ellipsis gaps.
 */
const pages = computed<(number | null)[]>(() => {
  const total = props.totalPages
  const current = props.currentPage
  const max = props.maxVisible

  // If everything fits, show all pages
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: (number | null)[] = []

  // Always show first page
  items.push(1)

  // How many slots remain after first, last, and two potential ellipses
  const sideSlots = Math.floor((max - 3) / 2) // slots on each side of current

  let rangeStart = Math.max(2, current - sideSlots)
  let rangeEnd = Math.min(total - 1, current + sideSlots)

  // Shift range if we're near the edges
  if (current - sideSlots <= 2) {
    rangeEnd = Math.min(total - 1, max - 2)
  }
  if (current + sideSlots >= total - 1) {
    rangeStart = Math.max(2, total - max + 3)
  }

  // Left ellipsis
  if (rangeStart > 2) {
    items.push(null)
  }

  // Page numbers in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    items.push(i)
  }

  // Right ellipsis
  if (rangeEnd < total - 1) {
    items.push(null)
  }

  // Always show last page
  items.push(total)

  return items
})

const goTo = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
    <!-- Previous -->
    <button
      type="button"
      class="pagination__btn pagination__prev"
      :disabled="isFirst"
      aria-label="Previous page"
      @click="goTo(currentPage - 1)"
    >
      <Icon name="ph:caret-left-bold" size="16" />
      <span class="pagination__btn-label">Previous</span>
    </button>

    <!-- Page numbers -->
    <ol class="pagination__pages">
      <li v-for="(page, index) in pages" :key="index">
        <span v-if="page === null" class="pagination__ellipsis" aria-hidden="true">&hellip;</span>
        <button
          v-else
          type="button"
          class="pagination__page"
          :class="{ 'pagination__page--active': page === currentPage }"
          :aria-current="page === currentPage ? 'page' : undefined"
          :aria-label="`Page ${page}`"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </li>
    </ol>

    <!-- Next -->
    <button
      type="button"
      class="pagination__btn pagination__next"
      :disabled="isLast"
      aria-label="Next page"
      @click="goTo(currentPage + 1)"
    >
      <span class="pagination__btn-label">Next</span>
      <Icon name="ph:caret-right-bold" size="16" />
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin: 2.5rem 0;
  flex-wrap: wrap;
}

.pagination__pages {
  all: unset;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
}

.pagination__pages li {
  all: unset;
  display: flex;
  align-items: center;
}

.pagination__btn,
.pagination__page {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-width: 36px;
  height: 36px;
  padding: 0 0.6rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
  background: transparent;
  color: var(--foreground);
  font-size: 0.875rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  user-select: none;
}

.pagination__btn:hover:not(:disabled),
.pagination__page:hover:not(.pagination__page--active) {
  background-color: var(--muted);
  border-color: var(--foreground, currentColor);
}

.pagination__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pagination__page--active {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
  font-weight: 600;
  cursor: default;
}

.pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  color: var(--muted-foreground);
  font-size: 0.875rem;
  letter-spacing: 0.1em;
}

/* Hide "Previous"/"Next" text on small screens, keep icons */
@media (max-width: 640px) {
  .pagination__btn-label {
    display: none;
  }

  .pagination__btn {
    padding: 0 0.5rem;
    min-width: 36px;
  }
}
</style>
