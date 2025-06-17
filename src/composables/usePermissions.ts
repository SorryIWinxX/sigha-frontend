import { computed } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useRoleStore } from '@/store/roleStore'

export function usePermissions() {
  const authStore = useAuthStore()
  const roleStore = useRoleStore()

  // Verificar si el usuario tiene un rol específico (basado en todos sus roles)
  const hasRole = (role: string): boolean => {
    return authStore.userRoles.includes(role)
  }

  // Verificar si el usuario tiene al menos uno de los roles especificados (basado en todos sus roles)
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => authStore.userRoles.includes(role))
  }

  // Verificaciones basadas en el rol actualmente seleccionado
  const isActiveRole = (role: string): boolean => {
    return roleStore.activeRole === role
  }

  // Roles específicos del sistema como computed properties para facilidad de uso
  // Estos ahora se basan en el rol activo del usuario
  const isProfesor = computed(() => roleStore.isTeacherRole)
  const isDirector = computed(() => isActiveRole('DIRECTOR DE ESCUELA'))
  const isCoordinador = computed(() => isActiveRole('COORDINADOR ACADEMICO'))
  const isAdmin = computed(() => roleStore.isAdminRole)

  // Información del usuario
  const userRoles = computed(() => authStore.userRoles)
  const userId = computed(() => authStore.userId)
  const userDocument = computed(() => authStore.userDocument)

  return {
    // Funciones
    hasRole,
    hasAnyRole,
    isActiveRole,

    // Computed properties para roles específicos (basados en rol activo)
    isProfesor,
    isDirector,
    isCoordinador,
    isAdmin,

    // Información del usuario
    userRoles,
    userId,
    userDocument,
  }
}
