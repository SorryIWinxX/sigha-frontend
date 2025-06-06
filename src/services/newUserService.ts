const PATH_API = '/public/auth/register'

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV
  ? '/api' // This will use the Vite proxy
  : import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:8080'

interface NewUserRequest {
  idTipoDocumento: number
  email: string
  documento: string
  password: string
  firstName: string
  lastName: string
  idsRoles: number[]
  idsAreas: number[]
}

interface NewUserResponse {
  password: string
}

export const newUserService = {
  async createUser(userData: NewUserRequest): Promise<NewUserResponse> {
    const response = await fetch(`${API_BASE_URL}${PATH_API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Error al crear el usuario' }))
      throw new Error(errorData.message || 'Error al crear el usuario')
    }

    return response.json() as Promise<NewUserResponse>
  },
}
