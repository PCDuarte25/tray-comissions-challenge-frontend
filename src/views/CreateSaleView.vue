<template>
  <div class="create-sale-container">
    <div class="form-wrapper">
      <h2>Cadastrar Nova Venda</h2>

      <form @submit.prevent="submitSale" class="sale-form">
        <div class="form-group">
          <label for="value">Valor da Venda (R$)</label>
          <input
            type="number"
            id="value"
            v-model="saleData.value"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div class="form-group">
          <label for="sale_date">Data da Venda</label>
          <input
            type="date"
            id="sale_date"
            v-model="saleData.sale_date"
            required
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Cadastrar Venda' }}
          </button>
          <button type="button" @click="cancel" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>

      <div v-if="showToast" class="toast">
        <p>{{ toastMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const saleData = ref({
  seller_id: route.params.id as string,
  value: '',
  sale_date: new Date().toISOString().split('T')[0]
})

const loading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const submitSale = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  loading.value = true

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/sale`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        seller_id: saleData.value.seller_id,
        value: parseFloat(saleData.value.value),
        sale_date: saleData.value.sale_date
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao cadastrar venda')
    }

    toastMessage.value = 'Venda cadastrada com sucesso!'
    showToast.value = true

    setTimeout(() => {
      router.back()
    }, 2000)
  } catch (error) {
    console.error('Erro ao cadastrar venda:', error)
    toastMessage.value = 'Erro ao cadastrar venda'
    showToast.value = true
  } finally {
    loading.value = false

    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}

const cancel = () => {
  router.back()
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.create-sale-container {
  padding: 2rem;
  background-color: $app-background-color;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.form-wrapper {
  width: 100%;
  max-width: 600px;
  background-color: $white-color;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px $box-shadow-color;

  h2 {
    font-size: 1.8rem;
    color: $primary-color;
    margin-bottom: 1.5rem;
    text-align: center;
  }
}

.sale-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: $label-color;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid $border-color;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
    }
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.submit-btn {
  background-color: $primary-color;
  color: $white-color;

  &:hover:not(:disabled) {
    background-color: darken($primary-color, 10%);
  }
}

.cancel-btn {
  background-color: $white-color;
  color: $text-color;
  border: 1px solid $border-color !important;

  &:hover {
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

  &.error {
    background-color: $error-color;
  }
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
</style>
