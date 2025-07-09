import { useAuthStore } from '@/store/authStore'
import type { StatusAvailability } from '@/types/status'

class StatusService {
  private getHeaders() {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      UserId: userId.toString(),
    }
  }

  async getStatusAvailability(): Promise<StatusAvailability[]> {
    try {
      const response = await fetch(`/api/v1/status-availability`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching status availability:', error)
      throw error
    }
  }

  async getStatus() {
    try {
      const response = await fetch(`/api/v1/status`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching status:', error)
      throw error
    }
  }
}

export default new StatusService()
