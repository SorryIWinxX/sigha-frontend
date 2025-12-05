import { useAuthStore } from '@/store/authStore'
import type { Area, Subject, CreateSubjectRequest } from '@/types/areas'

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
      UserId: userId.toString(),
    }
  }

  async getAreas(): Promise<Area[]> {
    try {
      const response = await fetch('/api/v1/area', {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('/Error fetching areas:', error)
      throw error
    }
  }

  async createArea(area: Omit<Area, 'id'>): Promise<Area> {
    try {
      const response = await fetch('/api/v1/area', {
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

  async updateArea(id: number, area: Omit<Area, 'id'>): Promise<Area> {
    try {
      const response = await fetch(`/api/v1/area/${id}`, {
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

  async createSubject(subjectData: CreateSubjectRequest): Promise<Subject> {
    try {
      const response = await fetch('/api/v1/subject', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(subjectData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating subject:', error)
      throw error
    }
  }

  async updateSubject(
    areaId: number,
    subjectId: number,
    subject: Omit<Subject, 'id'>,
  ): Promise<Subject> {
    try {
      const response = await fetch(`/api/v1/subject/${subjectId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(subject),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating subject:', error)
      throw error
    }
  }

  async deleteSubject(areaId: number, subjectId: number): Promise<void> {
    try {
      const response = await fetch(`/api/v1/subject/${subjectId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
      throw error
    }
  }
}
