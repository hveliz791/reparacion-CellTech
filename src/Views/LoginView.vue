<template>
  <div class="login-page">
    <div class="login-card">
      <h2>📱 CellTech</h2>
      <p>Inicia sesión para continuar</p>

      <form @submit.prevent="login">
        <input
          v-model="form.email"
          type="email"
          placeholder="Correo"
          required
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Contraseña"
          required
        />

        <button class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/client'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
})

const login = async () => {
  try {
    loading.value = true
    error.value = ''

    const { data } = await api.post('/auth/login', form)

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    router.push('/')
  } catch (e) {
    error.value = 'Correo o contraseña incorrectos'
  } finally {
    loading.value = false
  }
}
</script>

<style>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f1f5f9;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.login-card h2 {
  margin-bottom: 8px;
}

.login-card p {
  margin-bottom: 18px;
  color: #64748b;
}

.error {
  margin-top: 12px;
  color: #ef4444 !important;
}
</style>