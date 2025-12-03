<template>
    <div class="fixed inset-0 flex items-center justify-center p-4 z-50 animate__animated bg-black/50"
        :class="isClosing ? 'animate__fadeOut animate__faster' : 'animate__fadeIn animate__faster'"
        @click="handleOverlayClick">
        <div class="bg-white rounded-sm shadow-xl max-w-full w-full mx-8 animate__animated"
            :class="isClosing ? 'animate__fadeOutDown animate__faster' : 'animate__fadeInUp animate__faster'"
            @click.stop>

            <!-- Modal Header -->
            <div class="border-b border-[#dcdfe3] px-6 py-4">
                <h1 class="text-xl font-semibold text-[#3b3e45] text-center">
                    Nuevo usuario
                </h1>
            </div>

            <!-- Modal Content -->
            <div class="p-6">
                <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <!-- Left side - Personal Information (2/4 columns) -->
                    <div class="xl:col-span-2">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Input id="nombre" v-model="formData.nombre" label="Nombre" placeholder="Ingrese el nombre"
                                required :uppercase="true" />

                            <Input id="apellido" v-model="formData.apellido" label="Apellido"
                                placeholder="Ingrese el apellido" required :uppercase="true" />

                            <Select id="tipoDocumento" v-model="formData.tipoDocumento" label="Tipo de documento"
                                :options="tiposDocumentoOptions" placeholder="Seleccione un tipo de documento">
                            </Select>

                            <Input id="numeroDocumento" v-model="formData.numeroDocumento" label="Número de documento"
                                placeholder="Ingrese el número" required :uppercase="true" />
                        </div>

                        <!-- Email Section -->
                        <div class="mb-6">
                            <Input id="email" v-model="formData.email" type="email" label="Correo Electrónico"
                                placeholder="ejemplo@correo.com" required />

                            <!-- Email Error Message -->
                            <div v-if="emailError" class="mt-3">
                                <div class="bg-danger-500 text-white rounded-sm p-3">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0">
                                            <TriangleAlert class="h-5 w-5 text-white" />
                                        </div>
                                        <div class="ml-3">
                                            <h3 class="text-sm font-medium text-white">
                                                Error de validación
                                            </h3>
                                            <div class="mt-1 text-sm text-white">
                                                <p>{{ emailError }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Email Warning -->
                            <div v-if="formData.email && !emailError && isEmailValid" class="mt-3">
                                <div class="bg-yellow-500 text-white rounded-sm p-3">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0">
                                            <TriangleAlert class="h-5 w-5 text-white" />
                                        </div>
                                        <div class="ml-3">
                                            <h3 class="text-sm font-medium text-white">
                                                Importante
                                            </h3>
                                            <div class="mt-1 text-sm text-white">
                                                <p>Este debe ser el correo electrónico real de la persona. La contraseña
                                                    temporal será enviada a esta dirección.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Temporary Password Section -->
                        <div class="border border-[#dcdfe3] rounded-sm p-4">
                            <label class="block text-sm font-medium text-gray-700 mb-3">
                                Clave Temporal
                            </label>
                            <div class="flex gap-3">
                                <Input id="clavetemporal" v-model="formData.clavetemporal"
                                    placeholder="Generar clave temporal" class="flex-1" />
                                <Button variant="primary" @click="generateTemporaryPassword" title="Generar clave">
                                    <template #icon>
                                        <RefreshCcw class="h-4 w-4" />
                                    </template>
                                </Button>
                                <Button variant="info" @click="copyTemporaryPassword" title="Copiar clave"
                                    :disabled="!formData.clavetemporal">
                                    <template #icon>
                                        <ClipboardCopy class="h-4 w-4" />
                                    </template>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <!-- Middle - Roles Section (1/4 column) -->
                    <div class="xl:col-span-1">
                        <div class="border border-[#dcdfe3] rounded-sm p-4 h-full">
                            <div class="flex items-center justify-between mb-4 pb-2">
                                <h2 class="text-sm font-semibold text-[#3b3e45]">
                                    Roles del Usuario
                                </h2>
                                <span class="text-xs text-white bg-primary-500 px-2 py-1 rounded">
                                    {{ selectedRolesCount }} seleccionado{{ selectedRolesCount !== 1 ? 's' : '' }}
                                </span>
                            </div>
                            <div class="space-y-3">
                                <div v-for="(role, index) in availableRoles" :key="index"
                                    class="flex items-start space-x-3 p-3 border border-[#dcdfe3] rounded hover:bg-[#f8f9fa] transition-colors">
                                    <CheckBox v-model="role.selected" :color="'#67b83c'" class="mt-0.5" />
                                    <div class="flex-1 min-w-0">
                                        <span class="text-sm font-medium text-[#3b3e45] block">{{ role.label }}</span>
                                        <p class="text-xs text-[#666e7d] mt-1 leading-relaxed">{{ role.description }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right side - Associated Areas (1/4 column) -->
                    <div class="xl:col-span-1">
                        <div class="border border-[#dcdfe3] rounded-sm p-4 h-full">
                            <div class="flex items-center justify-between mb-4 pb-2">
                                <h2 class="text-sm font-semibold text-[#3b3e45]">
                                    Áreas Asociadas
                                </h2>
                                <span class="text-xs text-white bg-primary-500 px-2 py-1 rounded">
                                    {{ selectedAreasCount }} seleccionada{{ selectedAreasCount !== 1 ? 's' : '' }}
                                </span>
                            </div>

                            <!-- Loading state for areas -->
                            <div v-if="loadingAreas" class="text-center py-8">
                                <p class="text-sm text-[#666e7d]">Cargando áreas...</p>
                            </div>

                            <!-- Areas list -->
                            <div v-else class="space-y-2 overflow-y-auto" style="max-height: 400px;">
                                <div v-for="(area, index) in availableAreas" :key="area.id || index"
                                    class="flex items-start space-x-3 p-3 bg-white border border-[#dcdfe3] rounded transition-colors"
                                    :class="isProfesorSelected ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed bg-gray-50'">
                                    <CheckBox v-model="area.selected" :color="'#67b83c'" class="mt-0.5"
                                        :disabled="!isProfesorSelected" />
                                    <div class="flex-1 min-w-0">
                                        <span class="text-sm font-medium text-gray-700 block"
                                            :class="!isProfesorSelected ? 'text-gray-400' : ''">{{ area.description
                                            }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty state for areas -->
                            <div v-if="!loadingAreas && availableAreas.length === 0" class="text-center py-8">
                                <p class="text-sm text-[#666e7d]">No hay áreas disponibles</p>
                            </div>


                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="border-t rounded-b-sm border-gray-300 px-6 py-4 ">
                <div class="flex justify-end gap-3">
                    <Button variant="secondary" @click="cancelForm">
                        Cancelar
                    </Button>
                    <Button @click="createUser" variant="primary"
                        :disabled="!isFormValid || loadingAreas || loadingTiposDocumento">
                        Crear Usuario
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal :isVisible="showConfirmation" title="Confirmar salida"
        message="¿Estás seguro de que deseas salir? Los datos ingresados se perderán." confirmText="Salir"
        cancelText="Cancelar" confirmVariant="danger" cancelVariant="secondary" @confirm="confirmClose"
        @cancel="showConfirmation = false" />
</template>

<script setup>
import { RefreshCcw, ClipboardCopy, TriangleAlert } from 'lucide-vue-next'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Input from '@/components/ui/base/BaseInput.vue'
import Button from '@/components/ui/base/BaseButton.vue'
import CheckBox from '@/components/ui/base/BaseCheckbox.vue'
import Select from '@/components/ui/base/BaseSelect.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import { showSuccessToast, showWarningToast, showErrorToast, showInfoToast } from '@/utils/toast.js'
import { newUserService } from '@/services/newUserService'
import { TipoDocumentoService } from '@/services/tipoDocumentoService'
import { AreasService } from '@/services/areasService'

// Define emits
const emit = defineEmits(['close', 'userCreated'])

// Services instances
const tipoDocumentoService = new TipoDocumentoService()
const areasService = new AreasService()

// Animation state
const isClosing = ref(false)
const showConfirmation = ref(false)

// Loading states
const loadingTiposDocumento = ref(false)
const loadingAreas = ref(false)

// Data from services
const tiposDocumento = ref([])
const tiposDocumentoOptions = computed(() => {
    return tiposDocumento.value.map(tipo => ({
        label: `${tipo.sigla} - ${tipo.description}`,
        value: tipo.idSigla
    }))
})
const availableAreas = ref([])

// Form data
const formData = reactive({
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    email: '',
    clavetemporal: '',
})

// Email validation state
const emailError = ref('')
const isEmailValid = ref(false)

// Available roles (these seem to be static based on the original code)
const availableRoles = ref([
    { id: 1, label: 'DIRECTOR DE ESCUELA', description: 'Gestión completa del sistema y usuarios', selected: false },
    { id: 2, label: 'COORDINADOR ACADEMICO', description: 'Creación y gestión de contenido académico', selected: false },
    { id: 3, label: 'PROFESOR', description: 'Acceso a cursos y materiales de estudio', selected: false },
])

// Load data on component mount
onMounted(async () => {
    await Promise.all([
        loadTiposDocumento(),
        loadAreas()
    ])
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
        const areas = await areasService.getAreas()
        availableAreas.value = areas.map(area => ({
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
        isEmailValid.value &&
        formData.tipoDocumento &&
        selectedRolesCount.value > 0 &&
        (isProfesorSelected.value ? selectedAreasCount.value > 0 : true)
})

// Watch for changes in nombre and apellido to transform to uppercase
watch(() => formData.nombre, (newValue) => {
    if (newValue && newValue !== newValue.toUpperCase()) {
        formData.nombre = newValue.toUpperCase()
    }
})

watch(() => formData.apellido, (newValue) => {
    if (newValue && newValue !== newValue.toUpperCase()) {
        formData.apellido = newValue.toUpperCase()
    }
})

// Email validation function
const validateEmail = (email) => {
    // Clear previous error state
    emailError.value = ''
    isEmailValid.value = false

    // If email is empty, just return without error
    if (!email || email.trim() === '') {
        return
    }

    // Trim whitespace
    const trimmedEmail = email.trim()

    // Basic email format validation - more comprehensive regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegex.test(trimmedEmail)) {
        emailError.value = 'Por favor ingrese un correo electrónico válido'
        return
    }

    // Additional basic checks
    const parts = trimmedEmail.split('@')
    if (parts.length !== 2) {
        emailError.value = 'Por favor ingrese un correo electrónico válido'
        return
    }

    const [localPart, domain] = parts

    // Check local part length
    if (localPart.length === 0 || localPart.length > 64) {
        emailError.value = 'La parte local del email no es válida'
        return
    }

    // Check domain length
    if (domain.length === 0 || domain.length > 253) {
        emailError.value = 'El dominio del correo electrónico no es válido'
        return
    }

    // Check for consecutive dots
    if (trimmedEmail.includes('..')) {
        emailError.value = 'El correo electrónico no puede contener puntos consecutivos'
        return
    }

    // Check that domain has at least one dot
    if (!domain.includes('.')) {
        emailError.value = 'El dominio debe contener al menos un punto'
        return
    }

    // If all validations pass, email is valid
    emailError.value = ''
    isEmailValid.value = true
}

// Watch for email changes to validate
watch(() => formData.email, (newValue) => {
    validateEmail(newValue)
})

// Computed property to check if form has any data
const hasFormData = computed(() => {
    return formData.nombre ||
        formData.apellido ||
        formData.tipoDocumento ||
        formData.numeroDocumento ||
        formData.email ||
        formData.clavetemporal ||
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
    if (hasFormData.value) {
        showConfirmation.value = true
        return
    }

    // Start closing animation
    isClosing.value = true

    // Wait for animation to complete before closing
    setTimeout(() => {
        // Reset form data
        Object.assign(formData, {
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            numeroDocumento: '',
            email: '',
            clavetemporal: '',
        })

        // Reset areas selection
        availableAreas.value.forEach(area => {
            area.selected = false
        })

        // Reset roles selection
        availableRoles.value.forEach(role => {
            role.selected = false
        })

        // Reset email validation
        emailError.value = ''
        isEmailValid.value = false

        // Emit close event
        emit('close')
    }, 500) // Wait for animation duration
}

const confirmClose = () => {
    showConfirmation.value = false
    // Start closing animation
    isClosing.value = true

    // Wait for animation to complete before closing
    setTimeout(() => {
        // Reset form data
        Object.assign(formData, {
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            numeroDocumento: '',
            email: '',
            clavetemporal: '',
        })

        // Reset areas selection
        availableAreas.value.forEach(area => {
            area.selected = false
        })

        // Reset roles selection
        availableRoles.value.forEach(role => {
            role.selected = false
        })

        // Reset email validation
        emailError.value = ''
        isEmailValid.value = false

        // Emit close event
        emit('close')
    }, 500) // Wait for animation duration
}

const closeModalWithoutConfirmation = () => {
    // Start closing animation
    isClosing.value = true

    // Wait for animation to complete before closing
    setTimeout(() => {
        // Reset form data
        Object.assign(formData, {
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            numeroDocumento: '',
            email: '',
            clavetemporal: '',
        })

        // Reset areas selection
        availableAreas.value.forEach(area => {
            area.selected = false
        })

        // Reset roles selection
        availableRoles.value.forEach(role => {
            role.selected = false
        })

        // Reset email validation
        emailError.value = ''
        isEmailValid.value = false

        // Emit close event
        emit('close')
    }, 500) // Wait for animation duration
}

const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'
    let result = ''
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    formData.clavetemporal = result
}

const copyTemporaryPassword = async () => {
    if (!formData.clavetemporal) {
        return
    }

    try {
        await navigator.clipboard.writeText(formData.clavetemporal)
        showSuccessToast('Clave temporal copiada al portapapeles')
    } catch (err) {
        console.error('Error al copiar al portapapeles:', err)
        const textArea = document.createElement('textarea')
        textArea.value = formData.clavetemporal
        document.body.appendChild(textArea)
        textArea.select()
        document.body.removeChild(textArea)
        showSuccessToast('Clave temporal copiada al portapapeles')
    }
}

const cancelForm = () => {
    closeModal()
}

const createUser = async () => {
    // Validate form data
    if (!isFormValid.value) {
        showWarningToast('Por favor complete todos los campos requeridos y seleccione al menos un área y un rol')
        return
    }

    // Additional validation for email
    if (!isEmailValid.value) {
        showErrorToast('Por favor ingrese un correo electrónico válido')
        return
    }

    // Additional validation for tipo documento
    if (!formData.tipoDocumento) {
        showErrorToast('Por favor seleccione un tipo de documento')
        return
    }

    // Get selected areas IDs
    const selectedAreasIds = availableAreas.value
        .filter(area => area.selected)
        .map(area => {
            const id = parseInt(area.id)
            return id
        })
        .filter(id => !isNaN(id)) // Filter out any NaN values

    // Get selected roles IDs
    const selectedRolesIds = availableRoles.value
        .filter(role => role.selected)
        .map(role => {
            const id = parseInt(role.id)
            return id
        })
        .filter(id => !isNaN(id)) // Filter out any NaN values

    // Parse and validate tipo documento idSigla
    const idSigla = parseInt(formData.tipoDocumento)
    if (isNaN(idSigla) || idSigla <= 0) {
        showErrorToast('Tipo de documento inválido')
        return
    }

    // Generate temporary password if not provided
    if (!formData.clavetemporal || formData.clavetemporal.trim() === '') {
        generateTemporaryPassword()
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

    // Prepare user data for API - ensure all values match the expected format
    const userData = {
        idTipoDocumento: idSigla,
        email: formData.email.trim(),
        documento: formData.numeroDocumento.trim(),
        password: formData.clavetemporal.trim(),
        firstName: formData.nombre.trim(),
        lastName: formData.apellido.trim(),
        idsRoles: selectedRolesIds,
        idsAreas: selectedAreasIds
    }

    try {
        // Call the API service
        const response = await newUserService.createUser(userData)

        // Process successful response

        // Show success message
        showSuccessToast('Usuario creado exitosamente')
        showInfoToast("Se envió un correo de bienvenida al usuario con la contraseña temporal")

        emit('userCreated', response)

        closeModalWithoutConfirmation()
    } catch (error) {
        console.error('Error creating user:', error)
        showErrorToast(error.message || 'Error al crear el usuario')
    }
}

const handleOverlayClick = () => {
    if (hasFormData.value) {
        showConfirmation.value = true
        return
    }
    closeModal()
}
</script>