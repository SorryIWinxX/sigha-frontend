<template>
    <div class="flex flex-row h-screen">
        <div class="flex-1 flex justify-center items-center">
            <div class="flex w-full flex-col justify-center items-center bg-white shadow-md rounded-lg p-8 h-full">
                <div class="w-full max-w-md">
                    <div class="mb-12 flex items-center justify-center">
                        <LogoSIGHA :width="60" :height="60" />
                        <h1 class="font-bold text-5xl px-4 text-gray-800">SIGHA</h1>
                    </div>

                    <!-- Login Form -->
                    <form v-if="!isForgotPasswordMode" @submit.prevent="handleLogin" class="space-y-6">
                        <div class="space-y-2">
                            <label for="cedula" class="block text-sm font-medium text-gray-700">
                                Cédula
                            </label>
                            <div class="flex flex-row">
                                <input id="cedula" v-model="cedula" placeholder="1234567890"
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

                        <div class="space-y-2">
                            <label for="password" class="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div class="flex flex-row">
                                <input id="password" v-model="password" type="password" placeholder="••••••••"
                                    class="px-4 py-2 w-full border border-[#dcdfe3] rounded-md rounded-r-none focus:outline-none focus:border-[#67b83c] focus:ring-1 focus:ring-[#67b83c] focus:ring-opacity-30 transition-colors" />
                                <div>
                                    <div
                                        class="w-full h-full rounded-r-md rounded-l-none flex bg-[#67b83c] hover:bg-[#5aa534] text-white transition-colors">
                                        <div class="w-10 flex items-center justify-center">
                                            <LockOutline />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <a href="#" @click.prevent="isForgotPasswordMode = true"
                                    class="text-sm text-gray-500 hover:text-[#67b83c] transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>

                        <div v-if="loginError" class="text-red-500 text-sm">
                            {{ loginError }}
                        </div>

                        <button type="submit"
                            class="w-full bg-[#67b83c] cursor-pointer hover:bg-[#5aa534] text-white py-3 rounded-md shadow-md font-medium transition-colors mt-4"
                            :disabled="loginLoading">
                            {{ loginLoading ? 'Iniciando...' : 'Iniciar sesión' }}
                        </button>
                    </form>

                    <!-- Forgot Password Form -->
                    <form v-else @submit.prevent="handleForgotPassword" class="space-y-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-semibold text-gray-800">Recuperar contraseña</h2>
                        </div>

                        <div class="space-y-2">
                            <label for="recover-cedula" class="block text-sm font-medium text-gray-700">
                                Cédula
                            </label>
                            <div class="flex flex-row">
                                <input id="recover-cedula" v-model="forgotPasswordCedula" placeholder="1234567890"
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

                        <div v-if="forgotPasswordError" class="text-red-500 text-sm">
                            {{ forgotPasswordError }}
                        </div>
                        <div v-if="forgotPasswordSuccess" class="text-green-600 text-sm">
                            {{ forgotPasswordSuccess }}
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button"
                                @click="isForgotPasswordMode = false; forgotPasswordError = null; forgotPasswordSuccess = null; forgotPasswordCedula = ''"
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Volver
                            </button>
                            <button type="submit"
                                class="px-4 py-2 bg-[#67b83c] hover:bg-[#5aa534] text-white rounded-md"
                                :disabled="forgotPasswordLoading || !forgotPasswordCedula">
                                {{ forgotPasswordLoading ? 'Enviando...' : 'Enviar' }}
                            </button>
                        </div>
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
import { ref } from 'vue'
import LogoSIGHA from '../components/logos/LogoSIGHA.vue'
import LockOutline from 'vue-material-design-icons/LockOutline.vue'
import EmailOutline from 'vue-material-design-icons/EmailOutline.vue'
import { showSuccessToast, showErrorToast } from '@/utils/toast.js'
import { useAuth } from '@/composables/useAuth'

// Auth composable
const {
    login,
    loginLoading,
    loginError,
    forgotPassword,
    forgotPasswordLoading,
    forgotPasswordError,
    forgotPasswordSuccess
} = useAuth()

// Form state
const cedula = ref('')
const password = ref('')
const forgotPasswordCedula = ref('')
const isForgotPasswordMode = ref(false)

// Handle login submission
const handleLogin = async () => {
    await login(cedula.value, password.value)
}

// Handle forgot password submission
const handleForgotPassword = async () => {
    await forgotPassword(forgotPasswordCedula.value)
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&display=swap');
</style>
