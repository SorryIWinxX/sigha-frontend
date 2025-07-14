<template>
    <div class="fixed inset-0 flex items-center justify-center p-4 z-50 animate__animated"
        :class="isClosing ? 'animate__fadeOut animate__faster' : 'animate__fadeIn animate__faster'"
        style="background-color: rgba(0, 0, 0, 0.7);" @click="handleOverlayClick">
        <div class="bg-white rounded-sm shadow-xl max-w-5xl w-full animate__animated"
            :class="isClosing ? 'animate__fadeOutDown animate__faster' : 'animate__fadeInUp animate__faster'"
            @click.stop>
            <!-- Modal Header -->
            <div class="border-b border-[#dcdfe3] px-4 py-3">
                <h1 class="text-xl font-semibold text-[#3b3e45] text-center">
                    Detalles del Usuario
                </h1>
            </div>

            <!-- Modal Content -->
            <div class="p-4">
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
                <div v-else-if="userDetails" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <!-- Left Column - Personal Information -->
                    <div class="lg:col-span-2 space-y-4">
                        <!-- Información Personal -->
                        <div class="border border-[#dcdfe3] rounded-sm p-3">
                            <h2 class="text-sm font-semibold text-[#3b3e45] mb-3">Información Personal</h2>

                            <!-- Profile Photo and Basic Info -->
                            <div class="flex flex-col items-center mb-4">
                                <div class="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-3">
                                    <div class="w-full h-full flex items-center justify-center text-gray-400">
                                        <User size="32" />
                                    </div>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-900 text-center">
                                    {{ userDetails.firstName }} {{ userDetails.lastName }}
                                </h3>
                                <span :class="[
                                    'inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium mt-2',
                                    userDetails.isActive
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-danger-500 text-white'
                                ]">
                                    {{ userDetails.isActive ? 'Activo' : 'Inactivo' }}
                                </span>
                            </div>

                            <!-- Personal Details -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Documento de
                                        Identidad</label>
                                    <div
                                        class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-sm text-gray-700">
                                        {{ userDetails.documento }}
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div
                                        class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-sm text-gray-700">
                                        {{ userDetails.email }}
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Último
                                        Ingreso</label>
                                    <div
                                        class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-sm text-gray-700">
                                        {{ userDetails.lastLogin && userDetails.lastLogin !== 'null' ?
                                            formatDate(userDetails.lastLogin) : 'Nunca' }}
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">ID de
                                        Usuario</label>
                                    <div
                                        class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-sm text-gray-700">
                                        {{ userDetails.id }}
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de
                                        Creación</label>
                                    <div
                                        class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-sm text-gray-700">
                                        {{ formatDate(userDetails.createAt) }}
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Última
                                        Actualización</label>
                                    <div
                                        class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-sm text-gray-700">
                                        {{ formatDate(userDetails.updatedAt) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Roles Asignados -->
                        <div class="border border-gray-300 rounded-sm p-3">
                            <h2 class="text-sm font-semibold text-[#3b3e45] mb-3">Roles Asignados</h2>

                            <div v-if="userDetails.rolesDescriptions.length > 0" class=" flex gap-3">
                                <div v-for="(role, index) in userDetails.rolesDescriptions" :key="index"
                                    class="flex items-center justify-between px-3 py-1.5 bg-info-500 rounded-full text-white">
                                    <span class="text-white text-sm">{{ role }}</span>
                                </div>
                            </div>
                            <div v-else class="text-center py-6">
                                <div class="text-gray-400 mb-2">
                                    <User size="24" class="mx-auto" />
                                </div>
                                <p class="text-gray-500 text-sm">No hay roles asignados</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Areas -->
                    <div class="lg:col-span-1">
                        <div class="border border-[#dcdfe3] rounded-lg p-3">
                            <div class="flex items-center justify-between mb-3 pb-2">
                                <h2 class="text-sm font-semibold text-[#3b3e45]">
                                    Áreas Asignadas
                                </h2>
                                <span class="text-xs text-white bg-primary-500 px-2 py-1 rounded">
                                    {{ assignedAreas.length }} asignada{{ assignedAreas.length !== 1 ? 's' : '' }}
                                </span>
                            </div>

                            <!-- Loading areas -->
                            <div v-if="loadingAreas" class="text-center py-4">
                                <p class="text-sm text-[#666e7d]">Cargando áreas...</p>
                            </div>

                            <!-- Areas content -->
                            <div v-else-if="assignedAreas.length > 0"
                                class="space-y-2 mb-3 overflow-y-auto max-h-[calc(130vh-20vh)]">
                                <div v-for="area in assignedAreas" :key="area.id"
                                    class="flex items-center justify-between p-3 border border-gray-200 rounded-sm">
                                    <span class="text-black font-medium">{{ area.description }}</span>
                                </div>
                            </div>

                            <!-- No areas assigned -->
                            <div v-else class="text-center py-4">
                                <div class="text-gray-400 mb-2">
                                    <div class="w-6 h-6 mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3-9h-6.75v6.75M19.5 12v6.75a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 18.75V5.25A1.5 1.5 0 014.5 3.75h15a1.5 1.5 0 011.5 1.5v3.75" />
                                        </svg>
                                    </div>
                                </div>
                                <p class="text-sm text-[#666e7d]">No hay áreas asignadas</p>
                            </div>

                            <!-- Areas error -->
                            <div v-if="areasError" class="text-center py-4">
                                <p class="text-red-600 text-sm">{{ areasError }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="border-t border-gray-200 px-4 py-3">
                <div class="flex justify-end gap-2">
                    <Button @click="closeModal" variant="secondary">Cerrar</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { User } from 'lucide-vue-next'
import Button from '@/components/ui/base/BaseButton.vue'
import { userService } from '@/services/userServices'
import { AreasService } from '@/services/areasService'
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

// Services
const areasService = new AreasService()

// Reactive data
const isClosing = ref(false)
const loading = ref(false)
const loadingAreas = ref(false)
const error = ref('')
const areasError = ref('')
const userDetails = ref(null)
const availableAreas = ref([])

// Computed
const assignedAreas = computed(() => {
    if (!userDetails.value?.idAreas || !availableAreas.value.length) {
        return []
    }

    return availableAreas.value.filter(area =>
        userDetails.value.idAreas.includes(area.id)
    )
})

// Methods
const loadAreas = async () => {
    if (availableAreas.value.length > 0) return // Ya están cargadas

    loadingAreas.value = true
    areasError.value = ''

    try {
        availableAreas.value = await areasService.getAreas()
    } catch (err) {
        areasError.value = 'Error al cargar las áreas'
        console.error('Error loading areas:', err)
    } finally {
        loadingAreas.value = false
    }
}

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

        // Load areas if user has assigned areas
        if (response.idAreas && response.idAreas.length > 0) {
            await loadAreas()
        }
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
        areasError.value = ''
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