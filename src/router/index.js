import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import NuevoIngreso from '../views/NuevoIngresoView.vue'
import Reparaciones from '../views/ReparacionesView.vue'
import Entregas from '../views/EntregasView.vue'

const routes = [
  { path: '/login', component: LoginView },

  { path: '/nuevo', component: NuevoIngreso, meta: { requiresAuth: true } },
  { path: '/reparaciones', component: Reparaciones, meta: { requiresAuth: true } },
  { path: '/entregas', component: Entregas, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  if (to.path === '/login' && token) {
    return '/'
  }
})

export default router