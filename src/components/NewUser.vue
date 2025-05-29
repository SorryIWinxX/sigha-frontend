<template>
    <div class="fixed inset-0 flex items-center justify-center p-4 z-50 animate__animated"
        :class="isClosing ? 'animate__fadeOut animate__faster' : 'animate__fadeIn animate__faster'"
        style="background-color: rgba(0, 0, 0, 0.7);" @click="handleOverlayClick">
        <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[85vh] overflow-y-auto animate__animated"
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
                            <h2 class="text-sm font-semibold text-[#3b3e45] mb-3  pb-2">
                                Áreas Asociadas
                            </h2>

                            <div class="space-y-2 mb-3 overflow-y-auto max-h-129">
                                <div v-for="(area, index) in availableAreas" :key="index"
                                    class="flex items-start space-x-2 p-2 bg-white border border-[#dcdfe3] rounded hover:bg-[#f8f9fa] transition-colors">
                                    <CheckBox v-model="area.selected" :color="'#67b83c'" class="mt-0.5" />
                                    <div class="flex-1 min-w-0">
                                        <span class="text-sm font-medium text-[#3b3e45] block">{{ area.name }}</span>
                                        <p class="text-xs text-[#666e7d] mt-0.5">{{ area.description }}</p>
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
import { ref, reactive, computed } from 'vue'
import Input from './common/Input.vue'
import Button from './common/Button.vue'
import CheckBox from './common/CheckBox.vue'
import Select from './common/Select.vue'
import { showSuccessToast } from '@/utils/toast.js'

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
        name: 'Matemáticas Discretas',
        description: 'Matemáticas aplicadas',
        selected: false
    },
    {
        name: 'Inteligencia Artificial',
        description: 'Ciencias computacionales',
        selected: false
    },
    {
        name: 'Bases de Datos',
        description: 'Gestión de información',
        selected: false
    },
    {
        name: 'Desarrollo Web',
        description: 'Tecnologías web',
        selected: false
    },
    {
        name: 'Seguridad Informática',
        description: 'Ciberseguridad y protección',
        selected: false
    },
    {
        name: 'Redes de Computadores',
        description: 'Infraestructura de red',
        selected: false
    },
    {
        name: 'Programación Móvil',
        description: 'Desarrollo de aplicaciones',
        selected: false
    },
    {
        name: 'Machine Learning',
        description: 'Aprendizaje automático',
        selected: false
    },
    {
        name: 'Sistemas Operativos',
        description: 'Administración de SO',
        selected: false
    },
    {
        name: 'Arquitectura de Software',
        description: 'Diseño de sistemas',
        selected: false
    }
])

// Available roles
const availableRoles = ref([
    { label: 'Administrador', description: 'Gestión completa del sistema y usuarios', selected: false },
    { label: 'Profesor', description: 'Creación y gestión de contenido académico', selected: false },
    { label: 'Estudiante', description: 'Acceso a cursos y materiales de estudio', selected: false },
])

// Computed properties
const selectedAreasCount = computed(() => {
    return availableAreas.value.filter(area => area.selected).length
})

const selectedRolesCount = computed(() => {
    return availableRoles.value.filter(role => role.selected).length
})

const isFormValid = computed(() => {
    return formData.nombre &&
        formData.apellido &&
        formData.numeroDocumento &&
        formData.email &&
        selectedRolesCount.value > 0 &&
        selectedAreasCount.value > 0
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

const createUser = () => {
    // Validate form data
    if (!isFormValid.value) {
        alert('Por favor complete todos los campos requeridos y seleccione al menos un área y un rol')
        return
    }

    // Get selected areas
    const selectedAreas = availableAreas.value
        .filter(area => area.selected)
        .map(area => area.name)

    // Get selected roles
    const selectedRoles = availableRoles.value
        .filter(role => role.selected)
        .map(role => role.label)

    // Prepare user data
    const userData = {
        ...formData,
        areas: selectedAreas,
        roles: selectedRoles
    }

    // Process form submission
    console.log('Creating user:', userData)

    // Here you would typically make an API call
    // After successful creation, show success message and close modal with animation
    showSuccessToast('Usuario creado exitosamente')

    closeModal()
}

const handleOverlayClick = () => {
    closeModal()
}
</script>