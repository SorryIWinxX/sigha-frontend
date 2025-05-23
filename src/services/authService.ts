// Provisional: Reemplazar con la URL real de la API
const API_BASE_URL = '/api/v1/login'

interface LoginResponse {
  token: string
  // Otros datos del usuario que puedan venir en la respuesta
  [key: string]: any
}

export const authService = {
  async login(cedula: string, contrasena: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cedula, contrasena }),
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Error en el inicio de sesión' }))
      throw new Error(errorData.message || 'Error en el inicio de sesión')
    }
    return response.json() as Promise<LoginResponse>
  },

  async forgotPassword(cedula: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cedula }),
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Error al solicitar el restablecimiento de contraseña' }))
      throw new Error(errorData.message || 'Error al solicitar el restablecimiento de contraseña')
    }
    // No se espera contenido en la respuesta exitosa típicamente
  },

  async checkCedulaExists(cedula: string): Promise<{ exists: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/check-cedula/${encodeURIComponent(cedula)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Si el backend devuelve un error específico para "no encontrado" que no sea un 404 genérico,
      // podrías manejarlo aquí. Por ahora, asumimos que un error significa que algo falló en la verificación.
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Error al verificar la cédula' }))
      throw new Error(errorData.message || 'Error al verificar la cédula')
    }

    // Asumimos que el backend devuelve un JSON como { exists: true } o { exists: false }
    return response.json() as Promise<{ exists: boolean; message?: string }>
  },
}
