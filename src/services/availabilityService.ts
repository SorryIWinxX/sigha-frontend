import { useAuthStore } from '@/store/authStore'

export interface AvailabilitySlot {
  hour: number
  statusId?: number
}

export interface AvailabilityData {
  [day: string]: AvailabilitySlot[]
}

export interface AvailabilityRequest {
  disponibilidad: AvailabilityData
}

export interface AvailabilityResponse {
  disponibilidad?: AvailabilityData
}

export class AvailabilityService {
  private getHeaders(semesterId: string | number) {
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
      userId: userId.toString(),
      semesterId: semesterId.toString(),
    }
  }

  async getAvailability(semesterId: string | number): Promise<AvailabilityResponse> {
    try {
      const response = await fetch('/api/api/v1/availability', {
        method: 'GET',
        headers: this.getHeaders(semesterId),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching availability:', error)
      throw error
    }
  }

  async sendAvailability(
    semesterId: string | number,
    availability: AvailabilityData,
  ): Promise<AvailabilityResponse> {
    try {
      const requestBody: AvailabilityRequest = {
        disponibilidad: availability,
      }

      const response = await fetch('/api/api/v1/availability', {
        method: 'POST',
        headers: this.getHeaders(semesterId),
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending availability:', error)
      throw error
    }
  }
}

export default new AvailabilityService()
