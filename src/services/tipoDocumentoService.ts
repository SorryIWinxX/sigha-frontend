import { useAuthStore } from '@/store/authStore'

export interface TipoDocumento {
  id?: string
  idSigla: number
  description: string
  sigla: string
}

export class TipoDocumentoService {
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

  async getTiposDocumento(): Promise<TipoDocumento[]> {
    try {
      const response = await fetch('/api/api/v1/tipoDocumento', {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching tipos de documento:', error)
      throw error
    }
  }

  async createTipoDocumento(tipoDocumento: Omit<TipoDocumento, 'id'>): Promise<TipoDocumento> {
    try {
      const response = await fetch('/api/api/v1/tipoDocumento', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(tipoDocumento),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating tipo de documento:', error)
      throw error
    }
  }

  async updateTipoDocumento(
    id: string,
    tipoDocumento: Omit<TipoDocumento, 'id'>,
  ): Promise<TipoDocumento> {
    try {
      const response = await fetch(`/api/api/v1/tipoDocumento/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(tipoDocumento),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating tipo de documento:', error)
      throw error
    }
  }
}
