import { defineStore } from 'pinia'
import { userService } from '@/services/userServices'
import type { User } from '@/types/user'

interface TokenPayload {
  roles: string[]
  documento: string
  userId: number
  exp?: number
  iat?: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    currentUser: null as User | null,
    userLoading: false,
    userError: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,

    tokenPayload: (state): TokenPayload | null => {
      if (!state.token) return null

      try {
        // Decodificar el token JWT (solo el payload, sin verificar la firma)
        const base64Url = state.token.split('.')[1]
        if (!base64Url) return null

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
        )

        return JSON.parse(jsonPayload)
      } catch (error) {
        console.error('Error decodificando el token:', error)
        return null
      }
    },

    userRoles(): string[] {
      return this.tokenPayload?.roles || []
    },

    userId(): number | null {
      return this.tokenPayload?.userId || null
    },

    userDocument(): string | null {
      return this.tokenPayload?.documento || null
    },

    userDisplayName(): string {
      if (this.currentUser) {
        return `${this.currentUser.firstName} ${this.currentUser.lastName}`
      }
      return 'Usuario'
    },

    userRolesDisplay(): string {
      if (this.currentUser && this.currentUser.rolesDescriptions.length > 0) {
        return this.currentUser.rolesDescriptions.join(', ')
      }
      return 'Sin rol asignado'
    },

    hasRole(): (role: string) => boolean {
      return (role: string): boolean => {
        return this.tokenPayload?.roles?.includes(role) || false
      }
    },

    hasAnyRole(): (roles: string[]) => boolean {
      return (roles: string[]): boolean => {
        if (!this.tokenPayload?.roles) return false
        return roles.some((role) => this.tokenPayload!.roles.includes(role))
      }
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },

    getToken() {
      return this.token
    },

    clearToken() {
      this.token = ''
      this.currentUser = null
      this.userError = null
      localStorage.removeItem('token')
    },

    initializeFromStorage() {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        this.token = storedToken
      }
    },

    async fetchCurrentUser(force = false) {
      // Si ya tenemos el usuario y no es forzado, no hacer nada
      if (this.currentUser && !force) {
        return this.currentUser
      }

      // Si no hay token, no hacer nada
      if (!this.token) {
        return null
      }

      try {
        this.userLoading = true
        this.userError = null

        const user = await userService.getCurrentUser()
        this.currentUser = user
        return user
      } catch (error) {
        console.error('Error fetching current user:', error)
        this.userError = error instanceof Error ? error.message : 'Error desconocido'
        this.currentUser = null
        return null
      } finally {
        this.userLoading = false
      }
    },

    async refreshUser() {
      return await this.fetchCurrentUser(true)
    },
  },
})
