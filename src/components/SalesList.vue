<template>
  <div class="sales-list-container">
    <h2>Histórico de Vendas</h2>

    <table class="sales-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Valor</th>
          <th>Comissão</th>
          <th>Data da Venda</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in sales" :key="sale.id">
          <td>{{ sale.id }}</td>
          <td>R$ {{ parseFloat(sale.value).toFixed(2) }}</td>
          <td>R$ {{ parseFloat(sale.commission).toFixed(2) }}</td>
          <td>{{ formatDate(sale.sale_date) }}</td>
        </tr>
      </tbody>
    </table>

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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const sales = ref([])
const currentPage = ref(1)
const lastPage = ref(1)

async function fetchSales(page = 1) {
  const token = localStorage.getItem('token')
  if (!token) return

  const response = await fetch(`http://localhost:8000/api/v1/sale?page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  const data = await response.json()

  sales.value = data.data.data
  currentPage.value = data.data.meta.current_page
  lastPage.value = data.data.meta.last_page
}

function changePage(page: number) {
  if (page >= 1 && page <= lastPage.value) {
    fetchSales(page)
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR')
}

onMounted(() => {
  fetchSales()
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.sales-list-container {
  padding: 2rem;
  background-color: $app-background-color;
  min-height: 100vh;

  h2 {
    font-size: 1.8rem;
    color: $primary-color;
    margin-bottom: 1.5rem;
  }
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
  background-color: $white-color;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px $box-shadow-color;

  th {
    background-color: $table-header-bg-color;
    text-align: left;
    padding: 1rem;
    color: $label-color;
    font-weight: 600;
    border-bottom: 1px solid $border-color;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid $border-color;
    color: $text-color;
  }

  tr:hover {
    background-color: $hover-bg-color;
  }
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
