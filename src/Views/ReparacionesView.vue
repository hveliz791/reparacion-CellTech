<template>
  <div class="container">
    <h3>🛠 Teléfonos en reparación</h3>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Problema</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="e in equipos" :key="e.id">
            <td>{{ e.cliente?.nombre }}</td>
            <td>{{ e.marca }} {{ e.modelo }}</td>
            <td>{{ e.problema }}</td>
            <td>
              <span :class="['estado', claseEstado(e.estado)]">
                {{ textoEstado(e.estado) }}
              </span>
            </td>
            <td>
              <button
                v-if="e.estado === 'PENDIENTE'"
                class="btn btn-primary"
                @click="cambiarEstado(e.id, 'EN_PROCESO')"
              >
                Iniciar
              </button>

              <button
                v-else-if="e.estado === 'EN_PROCESO'"
                class="btn btn-success"
                @click="cambiarEstado(e.id, 'REPARADO')"
              >
                Marcar reparado
              </button>

              <span v-else>
                Sin acción
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="equipos.length === 0" class="empty">
        No hay teléfonos registrados.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../api/client'

const equipos = ref([])

const cargarEquipos = async () => {
  const { data } = await api.get('/equipos')
  equipos.value = data.filter((e) => e.estado !== 'ENTREGADO')
}

const cambiarEstado = async (id, estado) => {
  await api.patch(`/equipos/${id}/estado`, { estado })

  if (estado === 'REPARADO') {
    alert('✅ Equipo reparado. Si el cliente tiene correo, se envió notificación.')
  }

  await cargarEquipos()
}

const textoEstado = (estado) => {
  const estados = {
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En proceso',
    REPARADO: 'Reparado',
    ENTREGADO: 'Entregado',
  }

  return estados[estado] || estado
}

const claseEstado = (estado) => {
  const clases = {
    PENDIENTE: 'pendiente',
    EN_PROCESO: 'enproceso',
    REPARADO: 'reparado',
    ENTREGADO: 'entregado',
  }

  return clases[estado] || ''
}

onMounted(() => {
  cargarEquipos()
})
</script>