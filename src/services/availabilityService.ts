import { useAuthStore } from '@/store/authStore'
import type {
  ProfessorAvailability,
  GlobalAvailabilityResponse,
  UpdateAvailabilityStatusResponse,
  AvailabilityData,
  AvailabilityRequest,
  AvailabilityResponse,
  GlobalAvailabilitySlot,
} from '@/types/availability'

export type AllProfessorsAvailabilityResponse = ProfessorAvailability[]

export class AvailabilityService {
  private getHeaders(semesterId: string | number, newStatusId?: number) {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    const userId = authStore.userId

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    const headers: any = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      userId: userId.toString(),
      semesterId: semesterId.toString(),
    }

    if (newStatusId !== undefined) {
      headers.newStatusId = newStatusId.toString()
    }

    return headers
  }

  async getAvailability(semesterId: string | number): Promise<AvailabilityResponse> {
    try {
      const response = await fetch('/api/v1/availability/docente', {
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

      const response = await fetch('/api/v1/availability', {
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

  async getGlobalAvailability(
    docentId: string | number,
    semesterId: string | number,
  ): Promise<GlobalAvailabilityResponse> {
    try {
      const response = await fetch(`/api/v1/availability/global/${docentId}`, {
        method: 'GET',
        headers: this.getHeaders(semesterId),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching global availability:', error)
      throw error
    }
  }

  async updateAvailabilityStatus(
    idDisponibilidad: string | number,
    newStatusId: number,
    semesterId: string | number,
  ): Promise<UpdateAvailabilityStatusResponse> {
    try {
      const response = await fetch(`/api/v1/availability/${idDisponibilidad}`, {
        method: 'PUT',
        headers: this.getHeaders(semesterId, newStatusId),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating availability status:', error)
      throw error
    }
  }

  async getAllProfessorsAvailability(
    semesterId: string | number,
  ): Promise<AllProfessorsAvailabilityResponse> {
    try {
      const response = await fetch('/api/v1/availability/global', {
        method: 'GET',
        headers: this.getHeaders(semesterId),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching all professors availability:', error)
      throw error
    }
  }
}

export default new AvailabilityService()
