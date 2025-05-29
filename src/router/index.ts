import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AssignedCalendarView from '../views/AssignedCalendarView.vue'
import AvailableView from '../views/AvailableView.vue'
import UserView from '../views/UserView.vue'
import ToastDemoView from '../views/ToastDemoView.vue'
import GroupsView from '../views/GroupsView.vue'
import UsersView from '../views/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/calendar-asigned',
      name: 'calendar-asigned',
      component: AssignedCalendarView,
    },
    {
      path: '/available',
      name: 'available',
      component: AvailableView,
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
    },
    {
      path: '/toast-demo',
      name: 'toast-demo',
      component: ToastDemoView,
    },
    {
      path: '/groups',
      name: 'groups',
      component: GroupsView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
    {
      path: '/admin/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
  ],
})

export default router
