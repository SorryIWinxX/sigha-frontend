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
    try {
      // Log the data being sent for debugging
      console.log('NewUserService - Sending data:', userData)

      // Validate required fields before sending
      if (!userData.idTipoDocumento || isNaN(userData.idTipoDocumento)) {
        throw new Error('ID de tipo de documento es requerido y debe ser un número válido')
      }

      if (!userData.email || !userData.documento || !userData.firstName || !userData.lastName) {
        throw new Error('Todos los campos obligatorios deben estar completos')
      }

      if (!userData.idsRoles || userData.idsRoles.length === 0) {
        throw new Error('Debe seleccionar al menos un rol')
      }

      const response = await fetch(`/public/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      console.log('NewUserService - Response status:', response.status)

      if (!response.ok) {
        let errorMessage = 'Error al crear el usuario'

        try {
          const errorData = await response.json()
          console.log('NewUserService - Error response:', errorData)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          console.log('NewUserService - Could not parse error response:', parseError)
          // Try to get response text for debugging
          try {
            const errorText = await response.text()
            console.log('NewUserService - Error response text:', errorText)
            errorMessage = errorText || errorMessage
          } catch (textError) {
            console.log('NewUserService - Could not get response text:', textError)
          }
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('NewUserService - Success response:', result)
      return result as NewUserResponse
    } catch (error) {
      console.error('NewUserService - Error in createUser:', error)
      throw error
    }
  },
}
