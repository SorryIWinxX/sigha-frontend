import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const useRoleStore = defineStore('role', {
  state: () => ({
    activeRole: '' as string,
  }),
  getters: {
    isTeacherRole: (state) => state.activeRole === 'PROFESOR',
    isAdminRole: (state) =>
      state.activeRole === 'DIRECTOR DE ESCUELA' || state.activeRole === 'COORDINADOR ACADEMICO',

    canSwitchRoles(): boolean {
      const authStore = useAuthStore()
      const userRoles = authStore.userRoles

      // Verificar si el usuario tiene tanto rol de admin como de profesor
      const hasAdminRole = userRoles.some(
        (role) => role === 'DIRECTOR DE ESCUELA' || role === 'COORDINADOR ACADEMICO',
      )
      const hasTeacherRole = userRoles.includes('PROFESOR')

      return hasAdminRole && hasTeacherRole
    },

    availableRoles(): string[] {
      const authStore = useAuthStore()
      return authStore.userRoles
    },
  },
  actions: {
    initializeRole() {
      const authStore = useAuthStore()
      const userRoles = authStore.userRoles

      if (userRoles.length > 0) {
        // Priorizar roles administrativos
        if (userRoles.includes('DIRECTOR DE ESCUELA')) {
          this.activeRole = 'DIRECTOR DE ESCUELA'
        } else if (userRoles.includes('COORDINADOR ACADEMICO')) {
          this.activeRole = 'COORDINADOR ACADEMICO'
        } else if (userRoles.includes('PROFESOR')) {
          this.activeRole = 'PROFESOR'
        } else {
          this.activeRole = userRoles[0]
        }
      }
    },

    setActiveRole(role: string) {
      const authStore = useAuthStore()

      if (authStore.userRoles.includes(role)) {
        this.activeRole = role
        localStorage.setItem('activeRole', role)
      }
    },

    loadFromStorage() {
      const storedRole = localStorage.getItem('activeRole')
      const authStore = useAuthStore()

      if (storedRole && authStore.userRoles.includes(storedRole)) {
        this.activeRole = storedRole
      } else {
        this.initializeRole()
      }
    },
  },
})
