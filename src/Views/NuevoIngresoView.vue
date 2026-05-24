<template>
  <div class="container">
    <h3>📱 Nuevo ingreso de teléfono</h3>

    <form @submit.prevent="guardar">
      <!-- CLIENTE -->
      <div class="card">
        <h4>Datos del cliente</h4>

        <input
          v-model="form.nombre"
          placeholder="Nombre"
          required
        />

        <input
          v-model="form.telefono"
          placeholder="Teléfono"
          required
        />

        <input
          v-model="form.correo"
          placeholder="Correo"
          type="email"
        />
      </div>

      <!-- TELEFONO -->
      <div class="card mt">
        <h4>Datos del teléfono</h4>

        <input
          v-model="form.marca"
          placeholder="Marca"
          required
        />

        <input
          v-model="form.modelo"
          placeholder="Modelo"
          required
        />

        <textarea
          v-model="form.problema"
          placeholder="Problema del equipo"
          required
        ></textarea>
      </div>

      <button
        class="btn btn-primary"
        :disabled="loading"
      >
        {{ loading ? 'Guardando...' : 'Guardar ingreso' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '../api/client'

const loading = ref(false)

const form = reactive({
  nombre: '',
  telefono: '',
  correo: '',
  marca: '',
  modelo: '',
  problema: '',
})

const limpiarFormulario = () => {
  form.nombre = ''
  form.telefono = ''
  form.correo = ''
  form.marca = ''
  form.modelo = ''
  form.problema = ''
}

const guardar = async () => {
  try {
    loading.value = true

    // 1. Crear cliente
    const clienteResponse = await api.post('/clientes', {
      nombre: form.nombre,
      telefono: form.telefono,
      correo: form.correo || undefined,
    })

    const clienteId = clienteResponse.data.id

    // 2. Crear equipo
    await api.post('/equipos', {
      clienteId,
      marca: form.marca,
      modelo: form.modelo,
      problema: form.problema,
    })

    alert('✅ Ingreso registrado correctamente')

    limpiarFormulario()
  } catch (error) {
    console.error(error)
    alert('❌ Error al guardar')
  } finally {
    loading.value = false
  }
}
</script>