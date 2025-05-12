<template>
  <div class="pagination" v-if="lastPage > 1">
    <button :disabled="currentPage === 1" @click="goTo(currentPage - 1)">
      Anterior
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      :class="{ active: page === currentPage }"
      @click="goTo(page)"
    >
      {{ page }}
    </button>

    <button :disabled="currentPage === lastPage" @click="goTo(currentPage + 1)">
      Próxima
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  currentPage: Number,
  lastPage: Number,
})

const emit = defineEmits(['update:page'])

const goTo = (page) => {
  if (page >= 1 && page <= props.lastPage) {
    emit('update:page', page)
  }
}

const visiblePages = computed(() => {
  const pages = []
  const { currentPage, lastPage } = props

  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 4) pages.push('...')

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(lastPage - 1, currentPage + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (currentPage < lastPage - 3) pages.push('...')
    pages.push(lastPage)
  }

  return pages
})
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1.5rem;

  button {
    padding: 0.4rem 0.8rem;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    &.active {
      background-color: #007bff;
      color: white;
      font-weight: bold;
      border-color: #007bff;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
