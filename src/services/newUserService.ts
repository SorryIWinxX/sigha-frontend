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
    const response = await fetch(`/public/auth/register`, {
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
