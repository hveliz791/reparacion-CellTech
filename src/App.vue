<template>
  <router-view v-if="$route.path === '/login'" />

  <div v-else :class="['layout', { dark: darkMode }]">
    <aside :class="['sidebar', { open: menuOpen }]">
      <h2 class="logo">📱 TechFix</h2>

      <nav>
        <router-link to="/nuevo" @click="cerrarMenu">➕ Nuevo ingreso</router-link>
        <router-link to="/reparaciones" @click="cerrarMenu">🛠 Reparaciones</router-link>
        <router-link to="/entregas" @click="cerrarMenu">📦 Entregas</router-link>
      </nav>
    </aside>

    <div v-if="menuOpen" class="overlay" @click="cerrarMenu"></div>

    <main class="main">
      <div class="header">
        <button class="menu-btn" @click="menuOpen = true">☰</button>

        <h3>Panel de Control</h3>

        <div class="header-actions">
          <span class="user">{{ user?.nombre }} | {{ user?.rol }}</span>

          <button class="dark-btn" @click="darkMode = !darkMode">
            {{ darkMode ? '☀️' : '🌙' }}
          </button>

          <button class="btn btn-danger" @click="logout">
            Salir
          </button>
        </div>
      </div>

      <div class="dashboard">
        <div class="card stat">👥 Clientes <strong>{{ resumen.clientes }}</strong></div>
        <div class="card stat">📱 Equipos <strong>{{ resumen.equipos }}</strong></div>
        <div class="card stat">🟡 Pendientes <strong>{{ resumen.pendientes }}</strong></div>
        <div class="card stat">🔵 En proceso <strong>{{ resumen.enProceso }}</strong></div>
        <div class="card stat">🟢 Reparados <strong>{{ resumen.reparados }}</strong></div>
        <div class="card stat">📦 Entregados <strong>{{ resumen.entregados }}</strong></div>
      </div>

      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from './api/client'

const router = useRouter()

const menuOpen = ref(false)
const darkMode = ref(false)

const resumen = ref({
  clientes: 0,
  equipos: 0,
  pendientes: 0,
  enProceso: 0,
  reparados: 0,
  entregados: 0,
})

const user = computed(() => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser) : null
})

const cerrarMenu = () => {
  menuOpen.value = false
}

const cargarResumen = async () => {
  try {
    const { data } = await api.get('/dashboard/resumen')
    resumen.value = data
  } catch (error) {
    console.error('Error cargando dashboard', error)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    cargarResumen()
  }
})
</script>

<style>
.layout {
  --bg: #f1f5f9;
  --card: white;
  --text: #1e293b;
  --sidebar: #0f172a;

  display: flex;
  height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.layout.dark {
  --bg: #0f172a;
  --card: #1e293b;
  --text: #f1f5f9;
  --sidebar: #020617;
}

.sidebar {
  width: 230px;
  background: var(--sidebar);
  color: white;
  padding: 20px;
  transition: left 0.3s ease;
  z-index: 1001;
}

.logo {
  margin-bottom: 20px;
}

.sidebar a {
  display: block;
  color: #cbd5f5;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
  margin-bottom: 5px;
}

.sidebar a.router-link-active {
  background: #3b82f6;
  color: white;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background: var(--card);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user {
  font-size: 14px;
  color: #64748b;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  padding: 20px;
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.content {
  padding: 20px;
  overflow-y: auto;
}

.menu-btn {
  display: none;
  font-size: 22px;
  border: none;
  background: none;
  cursor: pointer;
}

.dark-btn {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
}

@media (max-width: 900px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
  }

  .header {
    align-items: flex-start;
    gap: 10px;
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    height: 100%;
  }

  .sidebar.open {
    left: 0;
  }

  .menu-btn {
    display: block;
  }

  .dashboard {
    grid-template-columns: 1fr;
  }
}
</style>