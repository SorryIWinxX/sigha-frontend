import { useAuthStore } from '@/store/authStore'
import { ref, type Ref } from 'vue'
import type { LoginResponse } from '@/types/auth'

export class AuthService {
  private jwt: Ref<string>
  private error: Ref<string>
  private forcePasswordReset: Ref<boolean>
  private documento: Ref<string>
  private lastPassword: Ref<string>
  private authStore = useAuthStore()

  constructor() {
    this.jwt = ref('')
    this.error = ref('')
    this.forcePasswordReset = ref(false)
    this.documento = ref('')
    this.lastPassword = ref('')
  }

  getJwt(): Ref<string> {
    return this.jwt
  }

  getError(): Ref<string> {
    return this.error
  }

  getForcePasswordReset(): Ref<boolean> {
    return this.forcePasswordReset
  }

  async login(documento: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`/public/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documento,
          password,
        }),
      })

      const response = await res.json()
      if ('error' in response) {
        this.error.value = response.message || response.error
        return false
      }

      const loginResponse = response as LoginResponse
      this.jwt.value = loginResponse.token
      this.authStore.setToken(loginResponse.token)
      this.forcePasswordReset.value = loginResponse.forcePasswordReset || false
      this.documento.value = documento
      this.lastPassword.value = password

      return true
    } catch (error) {
      this.error.value = error instanceof Error ? error.message : 'Error desconocido'
      return false
    }
  }

  async changePassword(newPassword: string): Promise<boolean> {
    const token = this.authStore.getToken()
    const userId = this.authStore.userId?.toString()

    if (!token) {
      this.error.value = 'No hay token de autenticación disponible'
      return false
    }

    if (!userId) {
      this.error.value = 'No hay userId disponible'
      return false
    }

    try {
      const res = await fetch('/api/v1/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
        body: JSON.stringify({
          documento: this.documento.value,
          password: newPassword,
          lastPassword: this.lastPassword.value,
        }),
      })

      const response = await res.json()
      if ('error' in response) {
        this.error.value = response.message || response.error
        return false
      }

      this.forcePasswordReset.value = false
      this.lastPassword.value = newPassword
      return true
    } catch (error) {
      this.error.value = error instanceof Error ? error.message : 'Error desconocido'
      return false
    }
  }
}
