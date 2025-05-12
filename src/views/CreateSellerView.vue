<template>
  <div class="create-seller-container">
    <div class="form-wrapper">
      <h2>Criar Vendedor</h2>
      <form @submit.prevent="createSeller">
        <div class="form-group">
          <label for="name">Nome:</label>
          <input v-model="newSeller.name" type="text" id="name" required placeholder="Digite o nome do vendedor" />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            v-model="newSeller.email"
            type="email"
            id="email"
            required
            placeholder="Digite o email do vendedor"
            :class="{'input-error': emailError}"
          />
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const newSeller = ref({
  name: '',
  email: '',
})

const emailError = ref('')
const router = useRouter()

async function createSeller() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/seller`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: newSeller.value.name,
        email: newSeller.value.email,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      if (data.errors && data.errors.email) {
        emailError.value = data.errors.email[0]
        return
      }
      throw new Error('Erro ao criar vendedor')
    }

    router.push('/dashboard/vendedores')
  } catch (error) {
    console.error('Erro ao criar vendedor:', error)
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.create-seller-container {
  padding: 2rem;
  background-color: $app-background-color;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-wrapper {
  width: 100%;
  max-width: 500px;
  background-color: $white-color;
  border-radius: 8px;
  box-shadow: 0 4px 6px $box-shadow-color;
  padding: 2.5rem;

  h2 {
    font-size: 1.8rem;
    color: $primary-color;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 1rem;
      color: $text-color;
      font-weight: 500;
    }

    input {
      padding: 0.8rem;
      border: 1px solid $border-color;
      border-radius: 4px;
      font-size: 1rem;
      color: $text-color;
      outline: none;
      transition: border-color 0.3s ease;

      &::placeholder {
        color: $label-color;
      }

      &:focus {
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
      }

      &.input-error {
        border-color: $error-color;
      }
    }

    .error-message {
      color: $error-color;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }

  button {
    background-color: $primary-color;
    color: $white-color;
    padding: 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.3s ease;
    margin-top: 0.5rem;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
}
</style>
