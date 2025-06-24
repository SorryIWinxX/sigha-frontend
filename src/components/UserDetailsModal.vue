<template>
    <div class="fixed inset-0 flex items-center justify-center p-4 z-50 animate__animated"
        :class="isClosing ? 'animate__fadeOut animate__faster' : 'animate__fadeIn animate__faster'"
        style="background-color: rgba(0, 0, 0, 0.7);" @click="handleOverlayClick">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full animate__animated"
            :class="isClosing ? 'animate__fadeOutDown animate__faster' : 'animate__fadeInUp animate__faster'"
            @click.stop>
            <!-- Modal Header -->
            <div class="border-b border-[#dcdfe3] px-4 py-3">
                <h1 class="text-xl font-semibold text-[#3b3e45] text-center">
                    Detalles del Usuario
                </h1>
            </div>

            <!-- Modal Content -->
            <div class="p-4 max-h-[80vh] overflow-y-auto">
                <!-- Loading state -->
                <div v-if="loading" class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span class="ml-3 text-gray-600">Cargando información del usuario...</span>
                </div>

                <!-- Error state -->
                <div v-else-if="error" class="text-center py-8">
                    <div class="text-red-600">
                        <p class="font-semibold">Error al cargar la información</p>
                        <p class="text-sm mt-1">{{ error }}</p>
                        <button @click="loadUserDetails"
                            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors">
                            Reintentar
                        </button>
                    </div>
                </div>

                <!-- User Details -->
                <div v-else-if="userDetails" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Left Column -->
                    <div class="space-y-4">
                        <!-- Información Personal -->
                        <div
                            class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                            <div class="p-4">
                                <h2 class="text-lg font-medium text-gray-900 mb-3">Información Personal</h2>

                                <div class="flex flex-col md:flex-row gap-4 mb-4">
                                    <!-- Foto de perfil placeholder -->
                                    <div class="flex flex-col items-center">
                                        <div class="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-2">
                                            <div class="w-full h-full flex items-center justify-center text-gray-400">
                                                <User size="28" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Datos personales -->
                                    <div class="flex-1 grid grid-cols-1 gap-3">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                                            <div
                                                class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                                {{ userDetails.firstName }}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                                            <div
                                                class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                                {{ userDetails.lastName }}
                                            </div>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Documento de
                                                Identidad</label>
                                            <div
                                                class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                                {{ userDetails.documento }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Información de Cuenta -->
                        <div
                            class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                            <div class="p-4">
                                <h2 class="text-lg font-medium text-gray-900 mb-3">Información de Cuenta</h2>

                                <div class="space-y-3">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <div
                                            class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                            {{ userDetails.email }}
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                        <div class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md">
                                            <span :class="[
                                                'inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium',
                                                userDetails.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            ]">
                                                {{ userDetails.isActive ? 'Activo' : 'Inactivo' }}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Último
                                            Ingreso</label>
                                        <div
                                            class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                            {{ userDetails.lastLogin && userDetails.lastLogin !== 'null' ?
                                                formatDate(userDetails.lastLogin) : 'Nunca' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-4">
                        <!-- Roles Asignados -->
                        <div
                            class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                            <div class="p-4">
                                <h2 class="text-lg font-medium text-gray-900 mb-3">Roles Asignados</h2>

                                <div class="space-y-2">
                                    <div v-for="(role, index) in userDetails.rolesDescriptions" :key="index"
                                        class="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                                        <span class="text-gray-900 font-medium">{{ role }}</span>
                                        <span :class="[
                                            'inline-flex items-center px-3 py-1 rounded-sm text-xs font-medium',
                                            'bg-green-100 text-green-800'
                                        ]">
                                            Activo
                                        </span>
                                    </div>
                                    <div v-if="userDetails.rolesDescriptions.length === 0"
                                        class="text-gray-500 text-sm">
                                        No hay roles asignados
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Información de Auditoría -->
                        <div
                            class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                            <div class="p-4">
                                <h2 class="text-lg font-medium text-gray-900 mb-3">Información de Auditoría</h2>

                                <div class="space-y-3">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de
                                            Creación</label>
                                        <div
                                            class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                            {{ formatDate(userDetails.createAt) }}
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Última
                                            Actualización</label>
                                        <div
                                            class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                            {{ formatDate(userDetails.updatedAt) }}
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">ID de
                                            Usuario</label>
                                        <div
                                            class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                            {{ userDetails.id }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="border-t border-[#dcdfe3] px-4 py-3 bg-[#f8f9fa]">
                <div class="flex justify-end">
                    <button @click="closeModal"
                        class="px-4 py-2 border border-[#cfd3d4] text-[#666e7d] bg-white hover:bg-[#f4f4f4] transition-colors text-sm rounded-sm">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { User } from 'lucide-vue-next'
import { userService } from '@/services/userServices'
import { showErrorToast } from '@/utils/toast'

// Props
const props = defineProps({
    userId: {
        type: [Number, String],
        required: true
    },
    show: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['close'])

// Reactive data
const isClosing = ref(false)
const loading = ref(false)
const error = ref('')
const userDetails = ref(null)

// Methods
const loadUserDetails = async () => {
    if (!props.userId) return

    loading.value = true
    error.value = ''
    userDetails.value = null

    try {
        // Convert string ID to number if needed
        const userId = typeof props.userId === 'string' ? parseInt(props.userId) : props.userId

        const response = await userService.getUserById(userId)
        userDetails.value = response
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error al cargar los detalles del usuario'
        showErrorToast(error.value)
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'

    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (err) {
        return 'Fecha inválida'
    }
}

const closeModal = () => {
    isClosing.value = true
    setTimeout(() => {
        emit('close')
        isClosing.value = false
        userDetails.value = null
        error.value = ''
    }, 500)
}

const handleOverlayClick = () => {
    closeModal()
}

// Watch for show prop changes
watch(() => props.show, (newValue) => {
    if (newValue && props.userId) {
        loadUserDetails()
    }
}, { immediate: true })

// Also watch for userId changes
watch(() => props.userId, (newValue) => {
    if (props.show && newValue) {
        loadUserDetails()
    }
})
</script>