import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import AvailableView from '../views/available/AvailableView.vue'
import ProfileView from '../views/users/ProfileView.vue'
import UsersView from '../views/users/UsersView.vue'
import { useAuthStore } from '@/store/authStore'
import AreasSubjectsView from '@/views/areas/AreasSubjectsView.vue'
import AvailableManagementView from '@/views/available/AvailableManagementView.vue'
import SettingsView from '@/views/settings/SettingsView.vue'
import GroupsView from '@/views/groups/GroupsView.vue'
import ScheduleGroupsView from '@/views/groups/ScheduleGroupsView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import RequestsView from '@/views/requests/requestsView.vue'
import ScheduleGroupsTeachersView from '@/views/groups/ScheduleGroupsTeachersView.vue'
import CalendarAsignedView from '@/views/groups/CalendarAsignedView.vue'
import RequestsTeacherView from '@/views/requests/RequestsTeacherView.vue'

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
      path: '/available',
      name: 'available',
      component: AvailableView,
      meta: {
        requiresAuth: true,
        roles: ['PROFESOR'],
      },
    },
    {
      path: '/requests-teacher',
      name: 'requests-teacher',
      component: RequestsTeacherView,
      meta: {
        requiresAuth: true,
        roles: ['PROFESOR'],
      },
    },
    {
      path: '/user',
      name: 'user',
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/available-management',
      name: 'available-management',
      component: AvailableManagementView,
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
    {
      path: '/areas-subjects',
      name: 'areas-subjects',
      component: AreasSubjectsView,
      meta: {
        requiresAuth: true,
        roles: ['DIRECTOR DE ESCUELA', 'COORDINADOR ACADEMICO'],
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
      path: '/requests',
      name: 'requests',
      component: RequestsView,
      meta: {
        requiresAuth: true,
        roles: ['DIRECTOR DE ESCUELA', 'COORDINADOR ACADEMICO'],
      },
    },
    {
      path: '/calendar-asigned',
      name: 'calendar-asigned',
      component: CalendarAsignedView,
      meta: {
        requiresAuth: true,
        roles: ['PROFESOR'],
      },
    },
    {
      path: '/schedule-groups-teachers',
      name: 'schedule-groups-teachers',
      component: ScheduleGroupsTeachersView,
      meta: {
        requiresAuth: true,
        roles: ['DIRECTOR DE ESCUELA', 'COORDINADOR ACADEMICO'],
      },
    },
    {
      path: '/schedule-groups',
      name: 'schedule-groups',
      component: ScheduleGroupsView,
      meta: {
        requiresAuth: true,
        roles: ['DIRECTOR DE ESCUELA', 'COORDINADOR ACADEMICO'],
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
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

  if (needsAuth && !authStore.getToken()) {
    next('/login')
    return
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = authStore.userRoles

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
