<template>
  <div class="sellers-list-container">
    <h2>Vendedores Cadastrados</h2>

    <div v-if="sellers.length > 0" class="sellers-list">
      <ul>
        <li v-for="seller in sellers" :key="seller.id">
          <div class="seller-name">{{ seller.name }}</div>
          <div class="seller-email">{{ seller.email }}</div>
        </li>
      </ul>

      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          Anterior
        </button>

        <span>Página {{ currentPage }} de {{ lastPage }}</span>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage">
          Próxima
        </button>
      </div>
    </div>

    <div v-else class="no-sellers">
      <p>Não há vendedores cadastrados.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const sellers = ref([])
const currentPage = ref(1)
const lastPage = ref(1)

async function fetchSellers(page = 1) {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`http://localhost:8000/api/v1/seller?page=${page}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar vendedores')
    }

    const data = await response.json()
    sellers.value = data.data.data
    currentPage.value = data.data.meta.current_page
    lastPage.value = data.data.meta.last_page
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error)
  }
}

function changePage(page: number) {
  if (page >= 1 && page <= lastPage.value) {
    fetchSellers(page)
  }
}

onMounted(() => {
  fetchSellers()
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.sellers-list-container {
  padding: 2rem;
  background-color: $app-background-color;
  min-height: 100vh;

  h2 {
    font-size: 1.8rem;
    color: $primary-color;
    margin-bottom: 1.5rem;
  }
}

.sellers-list ul {
  list-style: none;
  padding: 0;
  background-color: $white-color;
  border-radius: 8px;
  box-shadow: 0 4px 6px $box-shadow-color;
  overflow: hidden;
}

.sellers-list li {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid $border-color;

  &:last-child {
    border-bottom: none;
  }

  .seller-name {
    font-weight: 600;
    color: $text-color;
  }

  .seller-email {
    color: $label-color;
  }

  &:hover {
    background-color: $hover-bg-color;
  }
}

.no-sellers {
  font-size: 1rem;
  color: $label-color;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;

  button {
    background-color: $primary-color;
    color: $white-color;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover:not(:disabled) {
      background-color: darken($primary-color, 10%);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 1rem;
    color: $text-color;
  }
}
</style>
