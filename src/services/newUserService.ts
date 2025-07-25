import type { NewUserRequest, NewUserResponse } from '@/types/user'

export const newUserService = {
  async createUser(userData: NewUserRequest): Promise<NewUserResponse> {
    try {
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

      if (!response.ok) {
        let errorMessage = 'Error al crear el usuario'

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          try {
            const errorText = await response.text()
            errorMessage = errorText || errorMessage
          } catch (textError) {
          }
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      return result as NewUserResponse
    } catch (error) {
      throw error
    }
  },
}
