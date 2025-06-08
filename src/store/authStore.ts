import { defineStore } from 'pinia'

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
      localStorage.removeItem('token')
    },

    initializeFromStorage() {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        this.token = storedToken
      }
    },
  },
})
