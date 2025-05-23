import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { ROUTES } from '@/constants/routes'
import { authService } from '@/services/authService'
import { showSuccessToast, showErrorToast } from '@/utils/toast.js'

interface DecodedToken {
  role: string
  [key: string]: any
}

export function useAuth() {
  const router = useRouter()
  const loginLoading = ref(false)
  const loginError = ref<string | null>(null)
  const forgotPasswordLoading = ref(false)
  const forgotPasswordError = ref<string | null>(null)
  const forgotPasswordSuccess = ref<string | null>(null)

  // Config
  const DUMMY_MODE = true // Enable dummy mode for development
  const DUMMY_USERS = [
    { cedula: '1234567890', password: 'admin123', role: 'admin' },
    { cedula: '0987654321', password: 'user123', role: 'user' },
  ]

  const getRedirectPathByRole = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'admin':
        return ROUTES.ADMIN.HOME
      case 'user':
        return ROUTES.USER.HOME
      default:
        return ROUTES.DEFAULT
    }
  }

  const isDummyCedulaValid = (cedula: string): boolean => {
    return DUMMY_USERS.some((user) => user.cedula === cedula)
  }

  const findDummyUser = (cedula: string, password: string) => {
    return DUMMY_USERS.find((user) => user.cedula === cedula && user.password === password)
  }

  const login = async (cedula: string, password: string) => {
    loginLoading.value = true
    loginError.value = null

    try {
      // 1. Validar campos vacíos
      if (!cedula.trim()) {
        loginError.value = 'La cédula es requerida.'
        showErrorToast('La cédula es requerida.')
        return false
      }
      if (!password.trim()) {
        loginError.value = 'La contraseña es requerida.'
        showErrorToast('La contraseña es requerida.')
        return false
      }

      if (DUMMY_MODE) {
        // Dummy login process
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay

        // Check if cedula exists
        if (!isDummyCedulaValid(cedula)) {
          loginError.value = 'La cédula no está registrada.'
          showErrorToast('La cédula no está registrada.')
          return false
        }

        // Check credentials
        const dummyUser = findDummyUser(cedula, password)
        if (!dummyUser) {
          loginError.value = 'Credenciales inválidas.'
          showErrorToast('Credenciales inválidas.')
          return false
        }

        // Create dummy token (just for simulation)
        const dummyToken = btoa(JSON.stringify({ role: dummyUser.role, sub: dummyUser.cedula }))
        localStorage.setItem('authToken', dummyToken)
        localStorage.setItem('userRole', dummyUser.role)

        showSuccessToast('Inicio de sesión exitoso')
        router.push(getRedirectPathByRole(dummyUser.role))
        return true
      }

      // Real API process
      // 2. Verificar si la cédula existe
      const cedulaCheckResponse = await authService.checkCedulaExists(cedula.trim())
      if (!cedulaCheckResponse.exists) {
        loginError.value = cedulaCheckResponse.message || 'La cédula no está registrada.'
        showErrorToast(cedulaCheckResponse.message || 'La cédula no está registrada.')
        return false
      }

      // 3. Si la cédula existe, intentar iniciar sesión
      const loginResponse = await authService.login(cedula.trim(), password)
      console.log('Login successful, token:', loginResponse.token)

      // 4. Almacenar el token
      localStorage.setItem('authToken', loginResponse.token)

      // 5. Decodificar el token para obtener el rol
      try {
        const decodedToken = jwtDecode<DecodedToken>(loginResponse.token)
        const userRole = decodedToken.role
        if (userRole) {
          localStorage.setItem('userRole', userRole)
          console.log('User role:', userRole)

          // Redirigir al usuario basado en su rol
          showSuccessToast('Inicio de sesión exitoso')
          router.push(getRedirectPathByRole(userRole))
          return true
        } else {
          console.warn('El token JWT no contiene un campo de rol (role).')
          localStorage.removeItem('userRole')
          router.push(ROUTES.DEFAULT)
          return true
        }
      } catch (e) {
        console.error('Error al decodificar el token JWT:', e)
        loginError.value = 'Token inválido recibido del servidor después del login.'
        showErrorToast('Token inválido recibido del servidor después del login.')
        localStorage.removeItem('authToken')
        localStorage.removeItem('userRole')
        return false
      }
    } catch (err: any) {
      loginError.value = err.message || 'Error al iniciar sesión. Verifique sus credenciales.'
      showErrorToast(err.message || 'Error al iniciar sesión. Verifique sus credenciales.')
      console.error('Login process failed:', err)
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      return false
    } finally {
      loginLoading.value = false
    }
  }

  const forgotPassword = async (cedula: string) => {
    forgotPasswordLoading.value = true
    forgotPasswordError.value = null
    forgotPasswordSuccess.value = null

    try {
      if (!cedula.trim()) {
        forgotPasswordError.value = 'La cédula es requerida para recuperar la contraseña.'
        showErrorToast('La cédula es requerida para recuperar la contraseña.')
        return false
      }

      if (DUMMY_MODE) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Check if the cedula exists in our dummy data
        const validCedula = DUMMY_USERS.some((user) => user.cedula === cedula)

        // Always show success to prevent user enumeration
        forgotPasswordSuccess.value =
          'Si la cédula está registrada, se ha enviado un correo con instrucciones para recuperar tu contraseña.'
        showSuccessToast(
          'Si la cédula está registrada, se ha enviado un correo con instrucciones para recuperar tu contraseña.',
        )

        // Just for the developer to know if it would have worked
        if (validCedula) {
          console.log('Recovery request would have been sent for dummy cedula:', cedula)
        } else {
          console.log('Invalid dummy cedula:', cedula)
        }

        return true
      }

      await authService.forgotPassword(cedula)
      console.log('Recovery request sent for cedula:', cedula)
      forgotPasswordSuccess.value =
        'Si la cédula está registrada, se ha enviado un correo con instrucciones para recuperar tu contraseña.'
      showSuccessToast(
        'Si la cédula está registrada, se ha enviado un correo con instrucciones para recuperar tu contraseña.',
      )
      return true
    } catch (error: any) {
      forgotPasswordError.value =
        error.message || 'Error al solicitar la recuperación. Intente más tarde.'
      showErrorToast(error.message || 'Error al solicitar la recuperación. Intente más tarde.')
      console.error('Forgot password failed:', error)
      return false
    } finally {
      forgotPasswordLoading.value = false
    }
  }

  return {
    login,
    loginLoading,
    loginError,
    forgotPassword,
    forgotPasswordLoading,
    forgotPasswordError,
    forgotPasswordSuccess,
  }
}
