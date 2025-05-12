<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const router = useRouter()

const handleLogin = async () => {
  try {
    // Aqui você fará a chamada para o backend e verificará a resposta
    // Supondo que o token seja armazenado no localStorage
    const res = await fetch('http://localhost:9000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    if (!res.ok) {
      throw new Error('Login failed')
    }

    const data = await res.json()
    localStorage.setItem('token', data.token)

    // Redireciona para o Dashboard após o login
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = 'Email ou senha incorretos.'
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Digite seu email" required />
        </div>

        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" placeholder="Digite sua senha" required />
        </div>

        <button type="submit" class="login-btn">Entrar</button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $app-background-color;
}

.login-box {
  background-color: $white-color;
  border-radius: 8px;
  box-shadow: 0 4px 6px $box-shadow-color;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  text-align: center;

  h1 {
    color: $primary-color;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .input-group {
    margin-bottom: 1.5rem;
    text-align: left;
    label {
      color: $label-color;
      font-size: 1rem;
      margin-bottom: 0.5rem;
      display: block;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid $border-color;
      border-radius: 4px;
      font-size: 1rem;
      outline: none;

      &:focus {
        border-color: $primary-color;
        box-shadow: 0 0 4px rgba(66, 133, 244, 0.4);
      }
    }
  }

  .login-btn {
    background-color: $primary-color;
    color: $white-color;
    padding: 1rem;
    width: 100%;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken($primary-color, 10%);
    }

    &:active {
      background-color: darken($primary-color, 15%);
    }
  }

  .error-message {
    color: $error-color;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
