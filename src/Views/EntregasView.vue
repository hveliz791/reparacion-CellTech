<template>
  <div class="container">
    <h3>📦 Teléfonos listos para entregar</h3>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Problema</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="e in equipos" :key="e.id">
            <td>{{ e.cliente?.nombre }}</td>
            <td>{{ e.marca }} {{ e.modelo }}</td>
            <td>{{ e.problema }}</td>
            <td>{{ e.cliente?.correo || 'Sin correo' }}</td>
            <td>
              <span class="estado reparado">
                Reparado
              </span>
            </td>
            <td>
              <button
                class="btn btn-primary"
                @click="entregarEquipo(e.id)"
              >
                Entregar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="equipos.length === 0" class="empty">
        No hay teléfonos listos para entregar.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../api/client'

const equipos = ref([])

const cargarEquipos = async () => {
  const { data } = await api.get('/equipos?estado=REPARADO')
  equipos.value = data
}

const entregarEquipo = async (id) => {
  const confirmar = confirm('¿Confirmas que el teléfono fue entregado?')

  if (!confirmar) return

  await api.patch(`/equipos/${id}/estado`, {
    estado: 'ENTREGADO',
  })

  alert('✅ Equipo marcado como entregado')

  await cargarEquipos()
}

onMounted(() => {
  cargarEquipos()
})
</script>