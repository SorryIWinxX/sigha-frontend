import { useAuthStore } from '@/store/authStore'

export interface Area {
  id?: string
  description: string
}

export class AreasService {
  private authStore = useAuthStore()

  private getHeaders() {
    const token = this.authStore.getToken()
    const userId = this.authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      userId: userId.toString(),
    }
  }

  async getAreas(): Promise<Area[]> {
    try {
      const response = await fetch('/api/api/v1/area', {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching areas:', error)
      throw error
    }
  }

  async createArea(area: Omit<Area, 'id'>): Promise<Area> {
    try {
      const response = await fetch('/api/api/v1/area', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(area),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating area:', error)
      throw error
    }
  }

  async updateArea(id: string, area: Omit<Area, 'id'>): Promise<Area> {
    try {
      const response = await fetch(`/api/api/v1/area/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(area),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating area:', error)
      throw error
    }
  }
}
