<template>
    <div class="fixed inset-0 flex items-center justify-center p-4 z-50 animate__animated"
        :class="isClosing ? 'animate__fadeOut animate__faster' : 'animate__fadeIn animate__faster'"
        style="background-color: rgba(0, 0, 0, 0.7);" @click="handleOverlayClick">
        <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full animate__animated"
            :class="isClosing ? 'animate__fadeOutDown animate__faster' : 'animate__fadeInUp animate__faster'"
            @click.stop>
            <!-- Modal Header -->
            <div class="border-b border-[#dcdfe3] px-4 py-3">
                <h1 class="text-xl font-semibold text-[#3b3e45] text-center">
                    Editar Usuario
                </h1>
            </div>

            <!-- Modal Content -->
            <div class="p-4">
                <!-- Loading state -->
                <div v-if="loading" class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span class="ml-3 text-gray-600">Cargando datos del usuario...</span>
                </div>

                <!-- Error state -->
                <div v-else-if="error" class="text-center py-8">
                    <div class="text-red-600">
                        <p class="font-semibold">Error al cargar los datos del usuario</p>
                        <p class="text-sm mt-1">{{ error }}</p>
                        <button @click="loadUserData"
                            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors">
                            Reintentar
                        </button>
                    </div>
                </div>

                <!-- Form -->
                <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <!-- Left side - Personal Information -->
                    <div class="lg:col-span-2">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input id="nombre" v-model="formData.nombre" label="Nombre" placeholder="Ingrese el nombre"
                                required />

                            <Input id="apellido" v-model="formData.apellido" label="Apellido"
                                placeholder="Ingrese el apellido" required />

                            <Select id="tipoDocumento" v-model="formData.tipoDocumento" label="Tipo de documento">
                                <option value="" disabled>Seleccione un tipo de documento</option>
                                <option v-for="tipo in tiposDocumento" :key="tipo.id" :value="tipo.idSigla">
                                    {{ tipo.sigla }} - {{ tipo.description }}
                                </option>
                            </Select>

                            <Input id="numeroDocumento" v-model="formData.numeroDocumento" label="Número de documento"
                                placeholder="Ingrese el número" required />

                            <Input id="email" v-model="formData.email" type="email" label="Correo Electrónico"
                                placeholder="ejemplo@correo.com" required />



                            <!-- Roles Section -->
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Roles del Usuario
                                </label>
                                <div class="border border-[#dcdfe3] rounded-lg p-3 bg-white">
                                    <div class="space-y-2">
                                        <div v-for="(role, index) in availableRoles" :key="index"
                                            class="flex items-start space-x-2 p-2 border border-[#dcdfe3] rounded hover:bg-[#f8f9fa] transition-colors">
                                            <CheckBox v-model="role.selected" :color="'#67b83c'" class="mt-0.5" />
                                            <div class="flex-1 min-w-0">
                                                <span class="text-sm font-medium text-[#3b3e45] block">{{ role.label
                                                }}</span>
                                                <p class="text-xs text-[#666e7d] mt-0.5">{{ role.description }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right side - Associated Areas -->
                    <div class="lg:col-span-1">
                        <div class="border border-[#dcdfe3] rounded-lg p-3">
                            <div class="flex items-center justify-between mb-3 pb-2">
                                <h2 class="text-sm font-semibold text-[#3b3e45]">
                                    Áreas Asociadas
                                </h2>
                                <span class="text-xs text-[#666e7d] bg-[#f8f9fa] px-2 py-1 rounded">
                                    {{ selectedAreasCount }} seleccionada{{ selectedAreasCount !== 1 ? 's' : '' }}
                                </span>
                            </div>

                            <!-- Loading state for areas -->
                            <div v-if="loadingAreas" class="text-center py-4">
                                <p class="text-sm text-[#666e7d]">Cargando áreas...</p>
                            </div>

                            <!-- Areas list -->
                            <div v-else class="space-y-2 mb-3 overflow-y-auto max-h-[calc(130vh-20vh)]">
                                <div v-for="(area, index) in availableAreas" :key="area.id || index"
                                    class="flex items-start space-x-2 p-2 bg-white border border-[#dcdfe3] rounded transition-colors"
                                    :class="isProfesorSelected ? 'hover:bg-[#f8f9fa]' : 'opacity-50 cursor-not-allowed bg-gray-50'">
                                    <CheckBox v-model="area.selected" :color="'#67b83c'" class="mt-0.5"
                                        :disabled="!isProfesorSelected" />
                                    <div class="flex-1 min-w-0">
                                        <span class="text-sm font-medium text-[#3b3e45] block"
                                            :class="!isProfesorSelected ? 'text-gray-400' : ''">{{ area.description
                                            }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty state for areas -->
                            <div v-if="!loadingAreas && availableAreas.length === 0" class="text-center py-4">
                                <p class="text-sm text-[#666e7d]">No hay áreas disponibles</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="border-t border-[#dcdfe3] px-4 py-3 bg-[#f8f9fa]">
                <div class="flex justify-end gap-2">
                    <Button @click="cancelForm"
                        custom-class="px-4 py-2 border border-[#cfd3d4] text-[#666e7d] bg-white hover:bg-[#f4f4f4] transition-colors text-sm">
                        Cancelar
                    </Button>
                    <Button @click="updateUser"
                        custom-class="px-4 py-2 bg-[#67b83c] hover:bg-[#5ba332] text-white transition-colors text-sm"
                        :disabled="!isFormValid || loading || submitting || loadingAreas || loadingTiposDocumento">
                        {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Input from './common/Input.vue'
import Button from './common/Button.vue'
import CheckBox from './common/CheckBox.vue'
import Select from './common/Select.vue'
import { showSuccessToast, showWarningToast, showErrorToast } from '@/utils/toast.js'
import { userService } from '@/services/userServices'
import { TipoDocumentoService } from '@/services/tipoDocumentoService'
import { useAreasStore } from '@/store/areasStore'

// Props
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    userId: {
        type: [String, Number],
        required: true
    }
})

// Define emits
const emit = defineEmits(['close', 'updated'])

// Services instances
const tipoDocumentoService = new TipoDocumentoService()
const areasStore = useAreasStore()

// Animation state
const isClosing = ref(false)

// Loading states
const loading = ref(false)
const submitting = ref(false)
const loadingTiposDocumento = ref(false)
const loadingAreas = ref(false)
const error = ref('')

// Data from services
const tiposDocumento = ref([])
const userData = ref(null)

// Form data
const formData = reactive({
    id: 0,
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    email: '',
    isActive: true,
})

// Available roles (these seem to be static based on the original code)
const availableRoles = ref([
    { id: 1, label: 'DIRECTOR DE ESCUELA', description: 'Gestión completa del sistema y usuarios', selected: false },
    { id: 2, label: 'COORDINADOR ACADEMICO', description: 'Creación y gestión de contenido académico', selected: false },
    { id: 3, label: 'PROFESOR', description: 'Acceso a cursos y materiales de estudio', selected: false },
])

// Available areas (from store)
const availableAreas = ref([])

// Load data on component mount
onMounted(async () => {
    if (props.show && props.userId) {
        await Promise.all([
            loadTiposDocumento(),
            loadAreas(),
            loadUserData()
        ])
    }
})

// Watch for prop changes
watch(() => props.show, (newShow) => {
    if (newShow && props.userId) {
        loadUserData()
        if (tiposDocumento.value.length === 0) {
            loadTiposDocumento()
        }
        if (availableAreas.value.length === 0) {
            loadAreas()
        }
    }
})

watch(() => props.userId, (newUserId) => {
    if (newUserId && props.show) {
        loadUserData()
    }
})

// Methods to load data from services
const loadTiposDocumento = async () => {
    try {
        loadingTiposDocumento.value = true
        const tipos = await tipoDocumentoService.getTiposDocumento()
        tiposDocumento.value = tipos
    } catch (error) {
        console.error('Error loading tipos de documento:', error)
        showErrorToast('Error al cargar los tipos de documento')
    } finally {
        loadingTiposDocumento.value = false
    }
}

const loadAreas = async () => {
    try {
        loadingAreas.value = true
        await areasStore.fetchAreas()

        // Initialize availableAreas with selected property
        availableAreas.value = areasStore.getAllAreas.map(area => ({
            ...area,
            selected: false
        }))
    } catch (error) {
        console.error('Error loading areas:', error)
        showErrorToast('Error al cargar las áreas')
    } finally {
        loadingAreas.value = false
    }
}

const loadUserData = async () => {
    if (!props.userId) return

    loading.value = true
    error.value = ''

    try {
        const user = await userService.getUserById(props.userId)
        userData.value = user

        // Populate form data
        formData.id = user.id
        formData.nombre = user.firstName
        formData.apellido = user.lastName
        formData.tipoDocumento = user.idTipoDocumento.toString()
        formData.numeroDocumento = user.documento
        formData.email = user.email
        formData.isActive = user.isActive

        // Update roles selection
        availableRoles.value.forEach(role => {
            role.selected = user.idsRoles.includes(role.id)
        })

        // Update areas selection
        if (user.idAreas && user.idAreas.length > 0) {
            // Wait for areas to be loaded if not already loaded
            if (availableAreas.value.length === 0) {
                await loadAreas()
            }

            // Mark selected areas
            availableAreas.value.forEach(area => {
                area.selected = user.idAreas.includes(area.id)
            })
        } else {
            // If no areas assigned, make sure all are unselected
            availableAreas.value.forEach(area => {
                area.selected = false
            })
        }

    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error al cargar los datos del usuario'
        showErrorToast(error.value)
        console.error('Error loading user data:', err)
    } finally {
        loading.value = false
    }
}

// Computed properties
const selectedAreasCount = computed(() => {
    return availableAreas.value.filter(area => area.selected).length
})

const selectedRolesCount = computed(() => {
    return availableRoles.value.filter(role => role.selected).length
})

// Check if PROFESOR role is selected
const isProfesorSelected = computed(() => {
    return availableRoles.value.find(role => role.label === 'PROFESOR')?.selected || false
})

const isFormValid = computed(() => {
    return formData.nombre &&
        formData.apellido &&
        formData.numeroDocumento &&
        formData.email &&
        formData.tipoDocumento &&
        selectedRolesCount.value > 0 &&
        (isProfesorSelected.value ? selectedAreasCount.value > 0 : true)
})

// Watch for changes in nombre and apellido to transform to uppercase
watch(() => formData.nombre, (newValue) => {
    formData.nombre = newValue.toUpperCase()
})

watch(() => formData.apellido, (newValue) => {
    formData.apellido = newValue.toUpperCase()
})

// Computed property to check if form has any data
const hasFormData = computed(() => {
    return formData.nombre ||
        formData.apellido ||
        formData.tipoDocumento ||
        formData.numeroDocumento ||
        formData.email ||
        availableRoles.value.some(role => role.selected) ||
        availableAreas.value.some(area => area.selected)
})

// Watch for changes in PROFESOR role selection
watch(isProfesorSelected, (newValue, oldValue) => {
    // If PROFESOR was deselected, clear all selected areas
    if (oldValue && !newValue) {
        availableAreas.value.forEach(area => {
            area.selected = false
        })
    }
})

// Methods
const closeModal = () => {
    // Start closing animation
    isClosing.value = true

    // Wait for animation to complete before closing
    setTimeout(() => {
        // Reset form data
        Object.assign(formData, {
            id: 0,
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            numeroDocumento: '',
            email: '',
            isActive: true,
        })

        // Reset areas selection
        availableAreas.value.forEach(area => {
            area.selected = false
        })

        // Reset roles selection
        availableRoles.value.forEach(role => {
            role.selected = false
        })

        // Reset states
        isClosing.value = false
        error.value = ''

        // Emit close event
        emit('close')
    }, 500) // Wait for animation duration
}

const cancelForm = () => {
    closeModal()
}

const updateUser = async () => {
    // Validate form data
    if (!isFormValid.value) {
        showWarningToast('Por favor complete todos los campos requeridos y seleccione al menos un rol')
        return
    }

    // Additional validation for tipo documento
    if (!formData.tipoDocumento) {
        showErrorToast('Por favor seleccione un tipo de documento')
        return
    }

    submitting.value = true

    try {
        // Get selected areas IDs
        const selectedAreasIds = availableAreas.value
            .filter(area => area.selected)
            .map(area => parseInt(area.id))
            .filter(id => !isNaN(id))

        // Get selected roles IDs
        const selectedRolesIds = availableRoles.value
            .filter(role => role.selected)
            .map(role => parseInt(role.id))
            .filter(id => !isNaN(id))

        // Get selected roles descriptions
        const selectedRolesDescriptions = availableRoles.value
            .filter(role => role.selected)
            .map(role => role.label)

        // Parse tipo documento
        const idSigla = parseInt(formData.tipoDocumento)
        if (isNaN(idSigla) || idSigla <= 0) {
            showErrorToast('Tipo de documento inválido')
            return
        }

        // Additional validation
        if (selectedRolesIds.length === 0) {
            showErrorToast('Debe seleccionar al menos un rol')
            return
        }

        // If PROFESOR is selected, areas are required
        if (isProfesorSelected.value && selectedAreasIds.length === 0) {
            showErrorToast('Debe seleccionar al menos un área cuando el rol PROFESOR está seleccionado')
            return
        }

        // Prepare user data for API
        const updateData = {
            id: formData.id,
            email: formData.email.trim(),
            idTipoDocumento: idSigla,
            documento: formData.numeroDocumento.trim(),
            firstName: formData.nombre.trim(),
            lastName: formData.apellido.trim(),
            isActive: formData.isActive,
            idsRoles: selectedRolesIds,
            rolesDescriptions: selectedRolesDescriptions,
            idAreas: selectedAreasIds
        }

        console.log('Updating user with data:', updateData)

        // Call the API service
        const updatedUser = await userService.updateUser(formData.id, updateData)

        // Process successful response
        console.log('User updated successfully:', updatedUser)

        // Show success message
        showSuccessToast('Usuario actualizado exitosamente')

        // Emit updated event
        emit('updated', updatedUser)

        // Close modal
        closeModal()
    } catch (error) {
        console.error('Error updating user:', error)
        showErrorToast(error.message || 'Error al actualizar el usuario')
    } finally {
        submitting.value = false
    }
}

const handleOverlayClick = () => {
    if (hasFormData.value) {
        if (!confirm('¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.')) {
            return
        }
    }
    closeModal()
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
