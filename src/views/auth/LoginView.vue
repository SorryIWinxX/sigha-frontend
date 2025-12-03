<template>
    <div class="flex flex-row h-screen">
        <div class="flex-1 flex justify-center items-center">
            <div
                class="flex w-full flex-col justify-center items-center bg-white border border-gray-300 shadow-sm rounded-lg p-8 h-full">
                <div class="w-full max-w-md">
                    <div class="mb-12 flex items-center justify-center">
                        <LogoSIGHA :width="60" :height="60" />
                        <h1 class="font-bold text-5xl px-4 text-gray-800">SIGHA</h1>

                    </div>
                    <h1 class="font-bold text-center text-xl px-4 text-[{{  }}]"> {{ schoolName }}</h1>
                    <!-- Login Form -->
                    <form v-if="!isForgotPasswordMode && !isChangePasswordMode" class="space-y-6">
                        <div class="space-y-2">
                            <label for="documento" class="block text-sm font-medium text-gray-700">
                                Documento
                            </label>
                            <div class="flex flex-row">
                                <input id="documento" v-model="documento" placeholder="1234567890"
                                    class="px-4 py-2 w-full border border-[#dcdfe3] rounded-md rounded-r-none focus:outline-none focus:border-[#67b83c] focus:ring-1 focus:ring-[#67b83c] focus:ring-opacity-30 transition-colors" />
                                <button type="button"
                                    class="px-3  bg-primary-500 rounded-sm  rounded-l-none hover:bg-primary-600 focus:outline-none focus:border-[#67b83c] transition-colors">
                                    <EmailOutline class="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="password" class="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div class="flex flex-row">
                                <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="••••••••"
                                    class="px-4 py-2 w-full border border-[#dcdfe3] rounded-sm rounded-r-none focus:outline-none focus:border-[#67b83c] focus:ring-1 focus:ring-[#67b83c] focus:ring-opacity-30 transition-colors" />
                                <button type="button" @click="showPassword = !showPassword"
                                    class="px-3  bg-primary-500 rounded-sm  rounded-l-none hover:bg-primary-600 focus:outline-none focus:border-[#67b83c] transition-colors">
                                    <EyeOutline v-if="!showPassword" class="w-5 h-5 text-white" />
                                    <EyeOffOutline v-else class="w-5 h-5 text-white" />
                                </button>

                            </div>
                            <div class="flex justify-end">
                                <a href="#" @click.prevent="isForgotPasswordMode = true"
                                    class="text-sm text-gray-500 hover:text-[#67b83c] transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>

                        <button type="submit" @click.prevent="authUser"
                            class="w-full bg-[#67b83c] hover:bg-[#5aa534] text-white py-3 rounded-md shadow-md font-medium transition-colors mt-4 cursor-pointer"
                            :class="{ 'opacity-50 !cursor-not-allowed hover:bg-[#67b83c]': !documento || !password }"
                            :disabled="!documento || !password">
                            Iniciar sesión
                        </button>
                    </form>

                    <!-- Forgot Password Form -->
                    <form v-else-if="isForgotPasswordMode" class="space-y-6">
                        <div class="flex justify-between items-center my-6">
                            <h2 class="text-xl font-semibold text-gray-800">Recuperar contraseña</h2>
                        </div>

                        <div class="space-y-2">
                            <label for="recover-documento" class="block text-sm font-medium text-gray-700">
                                Documento
                            </label>
                            <div class="flex flex-row">
                                <input id="recover-documento" v-model="forgotPasswordDocumento" placeholder="1234567890"
                                    class="px-4 py-2 w-full border border-[#dcdfe3] rounded-md rounded-r-none focus:outline-none focus:border-[#67b83c] focus:ring-1 focus:ring-[#67b83c] focus:ring-opacity-30 transition-colors" />
                                <div>
                                    <div
                                        class="w-full h-full rounded-r-md rounded-l-none flex bg-[#67b83c] hover:bg-[#5aa534] text-white transition-colors">
                                        <div class="w-10 flex items-center justify-center">
                                            <EmailOutline />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" @click="isForgotPasswordMode = false; forgotPasswordDocumento = ''"
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Volver
                            </button>
                            <button type="button" @click="forgotPassword"
                                class="px-4 py-2 bg-[#67b83c] hover:bg-[#5aa534] text-white rounded-md"
                                :disabled="!forgotPasswordDocumento">
                                Enviar
                            </button>
                        </div>
                    </form>

                    <!-- Change Password Form -->
                    <form v-else-if="isChangePasswordMode" class="space-y-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-semibold text-gray-800">Cambiar contraseña</h2>
                        </div>

                        <div class="bg-info-500 rounded-md p-4 mb-6">
                            <p class="text-white text-sm">
                                <strong>Atención:</strong> Debe cambiar su contraseña antes de continuar. Su contraseña
                                actual ha expirado o debe ser actualizada por motivos de seguridad.
                            </p>
                        </div>

                        <div class="space-y-2">
                            <label for="new-password" class="block text-sm font-medium text-gray-700">
                                Nueva contraseña
                            </label>
                            <div class="flex flex-row">
                                <input id="new-password" v-model="newPassword"
                                    :type="showNewPassword ? 'text' : 'password'" placeholder="••••••••"
                                    class="px-4 py-2 w-full border border-[#dcdfe3] rounded-sm rounded-r-none focus:outline-none focus:border-[#67b83c] focus:ring-1 focus:ring-[#67b83c] focus:ring-opacity-30 transition-colors" />
                                <button type="button" @click="showPassword = !showPassword"
                                    class="px-3  bg-primary-500 rounded-sm  rounded-l-none hover:bg-primary-600 focus:outline-none focus:border-[#67b83c] transition-colors">
                                    <EyeOutline v-if="!showPassword" class="w-5 h-5 text-white" />
                                    <EyeOffOutline v-else class="w-5 h-5 text-white" />
                                </button>

                            </div>
                            <p class="text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres.</p>
                        </div>

                        <div class="space-y-2">
                            <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                                Confirmar contraseña
                            </label>
                            <div class="flex flex-row">
                                <input id="confirm-password" v-model="confirmPassword"
                                    :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••"
                                    class="px-4 py-2 w-full border border-[#dcdfe3] rounded-sm rounded-r-none focus:outline-none focus:border-[#67b83c] focus:ring-1 focus:ring-[#67b83c] focus:ring-opacity-30 transition-colors" />
                                <button type="button" @click="showPassword = !showPassword"
                                    class="px-3  bg-primary-500 rounded-sm  rounded-l-none hover:bg-primary-600 focus:outline-none focus:border-[#67b83c] transition-colors">
                                    <EyeOutline v-if="!showPassword" class="w-5 h-5 text-white" />
                                    <EyeOffOutline v-else class="w-5 h-5 text-white" />
                                </button>
                            </div>
                            <p v-if="confirmPassword && newPassword !== confirmPassword"
                                class="text-xs text-danger-500">
                                Las contraseñas no coinciden.
                            </p>
                            <p v-if="newPassword && newPassword.length < 8" class="text-xs text-danger-500">
                                La contraseña debe tener al menos 8 caracteres.
                            </p>
                        </div>

                        <button type="submit" @click.prevent="changePassword"
                            class="w-full bg-[#67b83c] cursor-pointer hover:bg-[#5aa534] text-white py-3 rounded-md shadow-md font-medium transition-colors mt-4"
                            :disabled="!isPasswordValid">
                            Cambiar contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <div class="flex-grow bg-gray-50 flex items-center justify-center">
            <LogoSIGHA :width="500" :height="500" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LogoSIGHA from '@/components/logos/LogoSIGHA.vue'
import EmailOutline from 'vue-material-design-icons/EmailOutline.vue'
import EyeOutline from 'vue-material-design-icons/EyeOutline.vue'
import EyeOffOutline from 'vue-material-design-icons/EyeOffOutline.vue'
import { AuthService } from '@/services/authService'
import { showSuccessToast, showErrorToast, showInfoToast } from '@/utils/toast'
import { useAuthStore } from '@/store/authStore'
import { useRoleStore } from '@/store/roleStore'
import { useRouter } from 'vue-router'
import { userService } from '@/services/userServices'

const authStore = useAuthStore()
const roleStore = useRoleStore()
const router = useRouter()

// Environment variables
const schoolName = import.meta.env.VITE_SCHOOL
const schoolColor = import.meta.env.VITE_COLOR

// Form state
const documento = ref('')
const password = ref('')
const forgotPasswordDocumento = ref('')
const isForgotPasswordMode = ref(false)
const isChangePasswordMode = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')

// Password visibility state
const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Create auth service instance
const authService = new AuthService()

// Computed property for password validation
const isPasswordValid = computed(() => {
    return newPassword.value.length >= 8 && newPassword.value === confirmPassword.value
})

const authUser = async () => {

    const success = await authService.login(documento.value, password.value)

    if (success) {
        if (authService.getForcePasswordReset().value) {
            isChangePasswordMode.value = true
            showInfoToast('Debe cambiar su contraseña antes de continuar')
            return
        }

        showSuccessToast('Login successful')
        redirectUser()
    } else {
        showErrorToast(authService.getError().value || 'Login failed')
    }
}

const changePassword = async () => {
    if (!isPasswordValid.value) {
        showErrorToast('Las contraseñas no coinciden o no cumplen los requisitos')
        return
    }

    const success = await authService.changePassword(newPassword.value)

    if (success) {
        showSuccessToast('Contraseña cambiada exitosamente')
        isChangePasswordMode.value = false
        router.push('/')
    } else {
        showErrorToast(authService.getError().value || 'Error al cambiar la contraseña')
    }
}

const redirectUser = () => {
    // Inicializar el rol activo
    roleStore.initializeRole()

    // Redirigir según el rol del usuario
    const userRoles = authStore.userRoles

    if (userRoles.includes('DIRECTOR DE ESCUELA') || userRoles.includes('COORDINADOR ACADEMICO')) {
        router.push('/dashboard')
    } else if (userRoles.includes('PROFESOR')) {
        // Redirigir a vista de profesor
        router.push('/available')
    } else {
        // Redirigir a vista de usuario por defecto
        router.push('/user')
    }
}

const forgotPassword = async () => {
    try {
        await userService.forgotPassword(forgotPasswordDocumento.value)
        showSuccessToast('Recuperación de contraseña enviada')
        isForgotPasswordMode.value = false
        forgotPasswordDocumento.value = ''
    } catch (error) {
        showErrorToast(error instanceof Error ? error.message : 'Error al enviar la recuperación de contraseña')
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&display=swap');
</style>
