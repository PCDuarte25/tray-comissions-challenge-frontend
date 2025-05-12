<template>
  <div class="seller-details-container">
    <h2>Detalhes do Vendedor</h2>

    <div v-if="seller" class="seller-info">
      <div class="seller-text">
        <p><strong>Nome:</strong> {{ seller.name }}</p>
        <p><strong>Email:</strong> {{ seller.email }}</p>
        <p><strong>Data de Criação:</strong> {{ formatDate(seller.created_at) }}</p>
      </div>

      <div class="button-container">
        <button @click="resendReport" class="resend-report-btn">
          Reenviar Relatório
        </button>
        <button @click="goToCreateSale" class="create-sale-btn">
          Cadastrar Venda
        </button>
      </div>
    </div>

    <div v-else>
      <p>Carregando detalhes...</p>
    </div>

    <div class="sales-section" v-if="sales.length > 0">
      <h3>Vendas do Vendedor</h3>
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
    </div>

    <div v-else>
      <p>Não há vendas registradas para este vendedor.</p>
    </div>

    <div v-if="showToast" class="toast">
      <p>Relatório reenviado com sucesso!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const seller = ref(null)
const sales = ref([])
const route = useRoute()
const router = useRouter()
const showToast = ref(false)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}-${month}-${year}`
}

const formatApiDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const goToCreateSale = () => {
  const sellerId = route.params.id as string
  router.push(`/dashboard/vendedores/${sellerId}/cadastrar-venda`)
}

async function fetchSellerDetails(id: string) {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`http://localhost:8000/api/v1/seller/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar os detalhes do vendedor')
    }

    const data = await response.json()
    seller.value = data.data
  } catch (error) {
    console.error('Erro ao buscar vendedor:', error)
  }
}

async function fetchSellerSales(id: string) {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`http://localhost:8000/api/v1/seller/${id}/sale`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    const data = await response.json()
    sales.value = data.data
  } catch (error) {
    console.error('Erro ao buscar vendas do vendedor:', error)
  }
}

async function resendReport() {
  const token = localStorage.getItem('token')
  const sellerId = route.params.id as string

  if (!token) return

  const date = formatApiDate(new Date())

  try {
    const response = await fetch(`http://localhost:8000/api/v1/seller/${sellerId}/resend-report`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ date })
    })

    if (!response.ok) {
      throw new Error('Erro ao reenviar o relatório')
    }

    showToast.value = true

    setTimeout(() => {
      showToast.value = false
    }, 3000)
  } catch (error) {
    console.error('Erro ao reenviar relatório:', error)
  }
}

onMounted(() => {
  const sellerId = route.params.id as string
  fetchSellerDetails(sellerId)
  fetchSellerSales(sellerId)
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.seller-details-container {
  padding: 2rem;
  background-color: $app-background-color;
  min-height: 100vh;

  h2 {
    font-size: 1.8rem;
    color: $primary-color;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    color: $secondary-color;
    margin: 2rem 0 1rem;
  }

  .seller-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .seller-text {
    flex: 1;
  }

  .button-container {
    display: flex;
    align-items: center;
  }

  .resend-report-btn {
    background-color: $primary-color;
    color: $white-color;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }

  // Adicione isso no seu estilo existente
  .create-sale-btn {
    background-color: $secondary-color;
    color: $white-color;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-left: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken($secondary-color, 10%);
    }
  }

  .sales-section {
    margin-top: 2rem;
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

  .toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.3s ease-in-out, fadeOut 0.3s 2.7s forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
  }
}
</style>
