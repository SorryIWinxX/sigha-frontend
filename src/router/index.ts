import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AssignedCalendarView from '../views/AssignedCalendarView.vue'
import AvailableView from '../views/AvailableView.vue'
import UserView from '../views/UserView.vue'
import GroupsView from '../views/GroupsView.vue'
import UsersView from '../views/UsersView.vue'
import { useAuthStore } from '@/store/authStore'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/calendar-asigned',
      name: 'calendar-asigned',
      component: AssignedCalendarView,
      meta: {
        requiresAuth: true,
        roles: ['PROFESOR'],
      },
    },
    {
      path: '/available',
      name: 'available',
      component: AvailableView,
      meta: {
        requiresAuth: true,
        roles: ['PROFESOR'],
      },
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/groups',
      name: 'groups',
      component: GroupsView,
      meta: {
        requiresAuth: true,
        roles: ['DIRECTOR DE ESCUELA', 'COORDINADOR ACADEMICO'],
      },
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: {
        requiresAuth: false,
        roles: ['DIRECTOR DE ESCUELA', 'COORDINADOR ACADEMICO'],
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        requiresAuth: true,
        roles: ['DIRECTOR DE ESCUELA', 'COORDINADOR ACADEMICO'],
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const needsAuth = to.meta.requiresAuth
  const requiredRoles = to.meta.roles as string[] | undefined

  // Si la ruta requiere autenticación y no hay token
  if (needsAuth && !authStore.getToken()) {
    next('/login')
    return
  }

  // Si la ruta requiere roles específicos
  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = authStore.userRoles

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role))

    if (!hasRequiredRole) {
      // Redirigir a una página de acceso denegado o a la página principal
      next('/login')
      return
    }
  }

  next()
})
export default router
