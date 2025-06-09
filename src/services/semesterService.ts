import { useAuthStore } from '@/store/authStore'
import type { Semester, SemesterRequest, SemesterUpdateRequest } from '@/types/semester'

export class SemesterService {
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

  async getSemesters(): Promise<Semester[]> {
    try {
      const response = await fetch('/api/api/v1/semesters', {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching semesters:', error)
      throw error
    }
  }

  async createSemester(semesterData: SemesterRequest): Promise<Semester> {
    try {
      const response = await fetch('/api/api/v1/semesters', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(semesterData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating semester:', error)
      throw error
    }
  }

  async updateSemester(semesterData: SemesterUpdateRequest): Promise<Semester> {
    try {
      const response = await fetch('/api/api/v1/semesters', {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(semesterData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating semester:', error)
      throw error
    }
  }

  async deleteSemester(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/api/v1/semesters/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting semester:', error)
      throw error
    }
  }
}
