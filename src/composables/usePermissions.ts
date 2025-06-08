import { computed } from 'vue'
import { useAuthStore } from '@/store/authStore'

export function usePermissions() {
  const authStore = useAuthStore()

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role: string): boolean => {
    return authStore.userRoles.includes(role)
  }

  // Verificar si el usuario tiene al menos uno de los roles especificados
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => authStore.userRoles.includes(role))
  }

  // Roles específicos del sistema como computed properties para facilidad de uso
  const isProfesor = computed(() => hasRole('PROFESOR'))
  const isDirector = computed(() => hasRole('DIRECTOR DE ESCUELA'))
  const isCoordinador = computed(() => hasRole('COORDINADOR ACADEMICO'))
  const isAdmin = computed(() => hasAnyRole(['DIRECTOR DE ESCUELA', 'COORDINADOR ACADEMICO']))

  // Información del usuario
  const userRoles = computed(() => authStore.userRoles)
  const userId = computed(() => authStore.userId)
  const userDocument = computed(() => authStore.userDocument)

  return {
    // Funciones
    hasRole,
    hasAnyRole,

    // Computed properties para roles específicos
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
