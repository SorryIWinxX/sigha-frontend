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
                    Nuevo usuario
                </h1>
            </div>

            <!-- Modal Content -->
            <div class="p-4">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <!-- Left side - Personal Information -->
                    <div class="lg:col-span-2">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input id="nombre" v-model="formData.nombre" label="Nombre" placeholder="Ingrese el nombre"
                                required />

                            <Input id="apellido" v-model="formData.apellido" label="Apellido"
                                placeholder="Ingrese el apellido" required />

                            <Select id="tipoDocumento" v-model="formData.tipoDocumento" label="Tipo de documento">
                                <option value="C.C">C.C</option>
                                <option value="T.I">T.I</option>
                                <option value="C.E">C.E</option>
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

                        <!-- Temporary Password Section -->
                        <div class="border border-[#dcdfe3] rounded-lg p-3">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Clave Temporal
                            </label>
                            <div class="flex gap-2">
                                <Input id="clavetemporal" v-model="formData.clavetemporal"
                                    placeholder="Generar clave temporal" class="flex-1" />
                                <Button @click="generateTemporaryPassword"
                                    custom-class="bg-[#67b83c] hover:bg-[#5ba332] text-white px-3 py-2 text-sm"
                                    title="Generar clave">
                                    <template #icon>
                                        <RefreshCcw class="h-4 w-4" />
                                    </template>
                                </Button>
                                <Button @click="copyTemporaryPassword"
                                    custom-class="bg-[#3C7CB8] hover:bg-[#3C7CB8] text-white px-3 py-2 text-sm"
                                    title="Copiar clave" :disabled="!formData.clavetemporal">
                                    <template #icon>
                                        <ClipboardCopy class="h-4 w-4" />
                                    </template>
                                </Button>
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

                            <!-- Warning message when PROFESOR is not selected -->
                            <div v-if="!isProfesorSelected"
                                class="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                <p>Las áreas asociadas solo están disponibles para el rol de PROFESOR</p>
                            </div>

                            <div class="space-y-2 mb-3 overflow-y-auto max-h-129">
                                <div v-for="(area, index) in availableAreas" :key="index"
                                    class="flex items-start space-x-2 p-2 bg-white border border-[#dcdfe3] rounded transition-colors"
                                    :class="isProfesorSelected ? 'hover:bg-[#f8f9fa]' : 'opacity-50 cursor-not-allowed bg-gray-50'">
                                    <CheckBox v-model="area.selected" :color="'#67b83c'" class="mt-0.5"
                                        :disabled="!isProfesorSelected" />
                                    <div class="flex-1 min-w-0">
                                        <span class="text-sm font-medium text-[#3b3e45] block"
                                            :class="!isProfesorSelected ? 'text-gray-400' : ''">{{ area.name }}</span>
                                        <p class="text-xs text-[#666e7d] mt-0.5"
                                            :class="!isProfesorSelected ? 'text-gray-400' : ''">{{
                                                area.description }}</p>
                                    </div>
                                </div>
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
                    <Button @click="createUser"
                        custom-class="px-4 py-2 bg-[#67b83c] hover:bg-[#5ba332] text-white transition-colors text-sm"
                        :disabled="!isFormValid">
                        Crear Usuario
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RefreshCcw, ClipboardCopy } from 'lucide-vue-next'
import { ref, reactive, computed, watch } from 'vue'
import Input from './common/Input.vue'
import Button from './common/Button.vue'
import CheckBox from './common/CheckBox.vue'
import Select from './common/Select.vue'
import { showSuccessToast, showWarningToast, showErrorToast } from '@/utils/toast.js'
import { newUserService } from '@/services/newUserService'

// Define emits
const emit = defineEmits(['close'])

// Animation state
const isClosing = ref(false)

// Form data
const formData = reactive({
    nombre: '',
    apellido: '',
    tipoDocumento: 'C.C',
    numeroDocumento: '',
    email: '',
    clavetemporal: '',
})

// Available areas with more detailed structure
const availableAreas = ref([
    {
        id: 1,
        name: 'Matemáticas Discretas',
        description: 'Matemáticas aplicadas',
        selected: false
    },
    {
        id: 2,
        name: 'Inteligencia Artificial',
        description: 'Ciencias computacionales',
        selected: false
    },
    {
        id: 3,
        name: 'Bases de Datos',
        description: 'Gestión de información',
        selected: false
    },
    {
        id: 4,
        name: 'Desarrollo Web',
        description: 'Tecnologías web',
        selected: false
    },
    {
        id: 5,
        name: 'Seguridad Informática',
        description: 'Ciberseguridad y protección',
        selected: false
    },
    {
        id: 6,
        name: 'Redes de Computadores',
        description: 'Infraestructura de red',
        selected: false
    },
    {
        id: 7,
        name: 'Programación Móvil',
        description: 'Desarrollo de aplicaciones',
        selected: false
    },
    {
        id: 8,
        name: 'Machine Learning',
        description: 'Aprendizaje automático',
        selected: false
    },
    {
        id: 9,
        name: 'Sistemas Operativos',
        description: 'Administración de SO',
        selected: false
    },
    {
        id: 10,
        name: 'Arquitectura de Software',
        description: 'Diseño de sistemas',
        selected: false
    }
])

// Available roles
const availableRoles = ref([
    { id: 1, label: 'DIRECTOR DE ESCUELA', description: 'Gestión completa del sistema y usuarios', selected: false },
    { id: 2, label: 'COORDINADOR ACADEMICO', description: 'Creación y gestión de contenido académico', selected: false },
    { id: 3, label: 'PROFESOR', description: 'Acceso a cursos y materiales de estudio', selected: false },
])

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
        selectedRolesCount.value > 0 &&
        (isProfesorSelected.value ? selectedAreasCount.value > 0 : true)
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
            nombre: '',
            apellido: '',
            tipoDocumento: 'C.C',
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
        // Aquí podrías agregar una notificación de éxito
        showSuccessToast('Clave temporal copiada al portapapeles')
    } catch (err) {
        console.error('Error al copiar al portapapeles:', err)
        // Fallback para navegadores que no soportan la API Clipboard
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

    // Get selected areas IDs
    const selectedAreasIds = availableAreas.value
        .filter(area => area.selected)
        .map(area => area.id)

    // Get selected roles IDs
    const selectedRolesIds = availableRoles.value
        .filter(role => role.selected)
        .map(role => role.id)

    // Map document type to number
    const documentTypeMap = {
        'C.C': 1,
        'T.I': 2,
        'C.E': 3
    }

    // Prepare user data for API
    const userData = {
        idTipoDocumento: documentTypeMap[formData.tipoDocumento],
        email: formData.email,
        documento: formData.numeroDocumento,
        password: formData.clavetemporal,
        firstName: formData.nombre,
        lastName: formData.apellido,
        idsRoles: selectedRolesIds,
        idsAreas: selectedAreasIds
    }

    try {
        // Call the API service
        const response = await newUserService.createUser(userData)

        // Process successful response
        console.log('User created successfully:', response)

        // Show success message
        showSuccessToast('Usuario creado exitosamente')

        // Close modal
        closeModal()
    } catch (error) {
        console.error('Error creating user:', error)
        showErrorToast(error.message || 'Error al crear el usuario')
    }
}

const handleOverlayClick = () => {
    closeModal()
}
</script>