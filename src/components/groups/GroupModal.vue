<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center p-4 z-50 animate__animated bg-black/50"
        :class="isClosing ? 'animate__fadeOut animate__faster' : 'animate__fadeIn animate__faster'"
        @click="handleOverlayClick">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto animate__animated"
            :class="isClosing ? 'animate__fadeOutDown animate__faster' : 'animate__fadeInUp animate__faster'"
            @click.stop>

            <!-- Confirmation Modal Overlay -->
            <ConfirmationModal :is-visible="showConfirmation" title="Confirmar salida"
                message="¿Estás seguro de que deseas salir? Los datos ingresados se perderán." confirm-text="Salir"
                cancel-text="Cancelar" confirm-variant="danger" cancel-variant="secondary" @confirm="confirmClose"
                @cancel="showConfirmation = false" />

            <!-- Modal Header -->
            <div class="border-b border-[#dcdfe3] px-6 py-4">
                <div class="flex justify-center items-center">
                    <h3 class="text-xl font-semibold text-[#3b3e45]">
                        {{ mode === 'create' ? 'Crear Grupo' : 'Editar Grupo' }}
                    </h3>
                </div>
            </div>

            <!-- Modal Content -->
            <div class="p-6">
                <!-- Form -->
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Basic Info Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Código -->
                        <div>
                            <Input id="code-input" v-model="formData.code" label="Código" type="text"
                                placeholder="Ej: A01, B02, GRP-001, MAT-A1" :uppercase="true" required />
                        </div>

                        <!-- Nivel (automático basado en la materia) -->
                        <div>
                            <Input id="level-input" :value="getSelectedSubjectLevel()" label="Nivel" readonly
                                :disabled="!formData.idSubject"
                                placeholder="Se asigna automáticamente según la materia" />
                        </div>
                    </div>

                    <!-- Selectors Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Materia -->
                        <Select id="subject-select" v-model="formData.idSubject" :options="subjectOptions"
                            label="Materia" placeholder="Seleccionar materia" required />

                        <!-- Usuario -->
                        <div>
                            <Select id="user-select" v-model="formData.idDocente" :options="teacherOptions"
                                label="Profesor" :disabled="!formData.idSubject" />
                            <div v-if="!formData.idSubject"
                                class="mt-1 text-sm text-yellow-500 flex items-center gap-1">
                                <span>Selecciona una materia primero</span>
                            </div>
                            <div v-else-if="formData.idSubject && filteredAvailableUsers.length === 0"
                                class="mt-1 text-sm text-amber-600 flex items-center gap-1">
                                <AlertTriangle :size="16" />
                                <span>No hay profesores disponibles para esta materia</span>
                            </div>
                        </div>
                    </div>

                    <!-- Schedule Section -->
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <h4 class="text-lg font-medium text-gray-700">Horarios de Clase</h4>
                            <div class="text-sm text-gray-500">
                                Haz clic en el calendario para agregar/quitar horarios
                            </div>
                        </div>

                        <!-- Calendar Container -->
                        <div class="border border-gray-200 rounded-lg overflow-hidden">
                            <Calendar cell-height="h-12">
                                <template #day-cell="{ day, hour }">
                                    <div :class="[
                                        'border-b border-l border-gray-200 relative h-12 flex items-center justify-center transition-all cursor-pointer group',
                                        isScheduleSelected(day.value, hour.value)
                                            ? 'bg-[#67b83c] text-white'
                                            : getAvailabilityBackgroundClass(day.value, hour.value) || 'hover:bg-gray-100'
                                    ]" @click="toggleSchedule(day.value, hour.value)">
                                        <div v-if="isScheduleSelected(day.value, hour.value)"
                                            class="flex items-center justify-center">
                                            <Check :size="16" />
                                        </div>
                                        <div v-else class="flex flex-col items-center justify-center w-full h-full">
                                            <span
                                                class="text-xs transition-opacity opacity-0 group-hover:opacity-100 text-gray-400">
                                                {{ formatHourShort(hour.value) }}
                                            </span>
                                        </div>
                                    </div>
                                </template>
                            </Calendar>
                        </div>

                        <!-- Selected Schedules Display -->
                        <div v-if="formData.scheduleList.length > 0" class="mt-4">
                            <h5 class="text-sm font-medium text-gray-700 mb-2">Horarios seleccionados:</h5>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="schedule in formData.scheduleList"
                                    :key="`${schedule.day}-${schedule.hour}`"
                                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#67b83c] text-white">
                                    {{ schedule.day }} {{ formatHour(schedule.hour) }}
                                    <button type="button" @click="removeSchedule(schedule.day, schedule.hour)"
                                        class="ml-2 hover:text-red-200">
                                        <X :size="14" />
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Modal Footer -->
            <div class="border-t border-[#dcdfe3] px-6 py-4 bg-[#f8f9fa]">
                <div class="flex justify-end gap-3">
                    <Button type="button" @click="handleCloseModal" variant="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" @click="handleSubmit"
                        :disabled="isSubmitting || formData.scheduleList.length === 0" variant="primary">
                        {{ isSubmitting ? 'Guardando...' : (mode === 'create' ? 'Crear Grupo' : 'Actualizar Grupo') }}
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { X, Check, AlertTriangle } from 'lucide-vue-next'
import { useAreasStore } from '@/store/areasStore'
import { useSemesterStore } from '@/store/semesterStore'
import { userService } from '@/services/userServices'
import Calendar from '@/components/ui/Calendar.vue'
import Select from '@/components/ui/base/BaseSelect.vue'
import Input from '@/components/ui/base/BaseInput.vue'
import Button from '@/components/ui/base/BaseButton.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import { AvailabilityService } from '@/services/availabilityService'

// Props
const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'create', // 'create' | 'edit'
        validator: (value) => ['create', 'edit'].includes(value)
    },
    editData: {
        type: Object,
        default: null
    }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// Stores
const areasStore = useAreasStore()
const semesterStore = useSemesterStore()
const availabilityService = new AvailabilityService()
// Animation and modal state
const isClosing = ref(false)
const showConfirmation = ref(false)

// State
const isSubmitting = ref(false)
const availableUsers = ref([])
const loadingUsers = ref(false)
const teacherAvailability = ref(null)
const loadingAvailability = ref(false)

// Form data
const formData = ref({
    id: null,
    code: ''.toUpperCase(),
    idSemestre: '',
    idSubject: '',
    idDocente: '',
    scheduleList: []
})


// Fetch teacher availability
const fetchTeacherAvailability = async () => {
    if (!formData.value.idDocente || formData.value.idDocente === 'null') {
        teacherAvailability.value = null
        return
    }

    loadingAvailability.value = true
    try {
        const response = await availabilityService.getGlobalAvailability(
            formData.value.idDocente,
            semesterStore.currentSemester?.id
        )
        teacherAvailability.value = response
        console.log('Teacher availability:', response)
    } catch (error) {
        console.error('Error fetching teacher availability:', error)
        teacherAvailability.value = null
    } finally {
        loadingAvailability.value = false
    }
}

// Computed
const availableSubjects = computed(() => {
    const subjects = []
    areasStore.getAllAreas.forEach(area => {
        area.subjectList.forEach(subject => {
            subjects.push(subject)
        })
    })
    // Ordenar alfabéticamente por nombre
    return subjects.sort((a, b) => a.name.localeCompare(b.name))
})

const availableSemesters = computed(() => {
    return semesterStore.availableSemesters || []
})

// Filtrar profesores que pueden dictar la materia seleccionada
const filteredAvailableUsers = computed(() => {
    if (!formData.value.idSubject) {
        return availableUsers.value
    }

    // Encontrar el área de la materia seleccionada
    const selectedSubject = availableSubjects.value.find(subject =>
        subject.id === parseInt(formData.value.idSubject)
    )

    if (!selectedSubject) {
        return availableUsers.value
    }

    // Encontrar el área que contiene esta materia
    const subjectArea = areasStore.getAllAreas.find(area =>
        area.subjectList.some(subject => subject.id === selectedSubject.id)
    )

    if (!subjectArea) {
        return availableUsers.value
    }

    // Filtrar usuarios que tienen asignada esta área
    return availableUsers.value.filter(user =>
        user.idAreas && user.idAreas.includes(subjectArea.id)
    )
})

const subjectOptions = computed(() => {
    const options = availableSubjects.value.map(subject => ({
        value: subject.id,
        label: `${subject.code} - ${subject.name}`
    }))
    return [
        { value: '', label: 'Seleccionar materia' },
        ...options
    ]
})

const teacherOptions = computed(() => {
    const options = filteredAvailableUsers.value.map(user => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`
    }))
    return [
        { value: 'null', label: 'SIN ASIGNAR' },
        ...options
    ]
})

// Check if form has any data
const hasFormData = computed(() => {
    return formData.value.code ||
        formData.value.idSubject ||
        formData.value.idDocente ||
        formData.value.scheduleList.length > 0
})

// Obtener el nivel de la materia seleccionada
const getSelectedSubjectLevel = () => {
    if (!formData.value.idSubject) return ''

    const selectedSubject = availableSubjects.value.find(subject =>
        subject.id === parseInt(formData.value.idSubject)
    )

    return selectedSubject?.level || ''
}

// Schedule methods
const isScheduleSelected = (day, hour) => {
    return formData.value.scheduleList.some(schedule =>
        schedule.day === getDayName(day).toUpperCase() && schedule.hour === hour
    )
}

const getAvailabilityStatus = (day, hour) => {
    if (!teacherAvailability.value || !teacherAvailability.value.disponibilidad) {
        return null
    }

    const dayName = getDayName(day).toUpperCase()
    const dayAvailability = teacherAvailability.value.disponibilidad[dayName]

    if (!dayAvailability) {
        return null
    }

    const slot = dayAvailability.find(slot => slot.hour === hour)
    return slot ? { statusId: slot.statusId, statusDescription: slot.statusDescription } : null
}

const getAvailabilityBackgroundClass = (day, hour) => {
    const availability = getAvailabilityStatus(day, hour)
    if (!availability) {
        return ''
    }

    switch (availability.statusId) {
        case 1: // ENVIADO
            return 'bg-info-200'
        case 2: // APROBADO
            return 'bg-primary-200'
        case 3: // RECHAZADO (assuming 3 is rejected based on user description)
            return 'bg-danger-200'
        default:
            return ''
    }
}

const toggleSchedule = (day, hour) => {
    const dayName = getDayName(day).toUpperCase()
    const existingIndex = formData.value.scheduleList.findIndex(schedule =>
        schedule.day === dayName && schedule.hour === hour
    )

    if (existingIndex > -1) {
        // Remove existing schedule
        formData.value.scheduleList.splice(existingIndex, 1)
    } else {
        // Add new schedule
        formData.value.scheduleList.push({
            id: null, // Will be assigned by backend
            day: dayName,
            hour: hour
        })
    }
}

const removeSchedule = (day, hour) => {
    const index = formData.value.scheduleList.findIndex(schedule =>
        schedule.day === day && schedule.hour === hour
    )
    if (index > -1) {
        formData.value.scheduleList.splice(index, 1)
    }
}

// Helper methods
const getDayName = (dayValue) => {
    if (typeof dayValue === 'string') {
        return dayValue.toUpperCase()
    }
    const days = {
        1: 'LUNES',
        2: 'MARTES',
        3: 'MIERCOLES', // Sin tilde para compatibilidad con backend
        4: 'JUEVES',
        5: 'VIERNES',
        6: 'SABADO', // Sin tilde para compatibilidad con backend
        7: 'DOMINGO'
    }
    return days[dayValue] || ''
}

const formatHour = (hour) => {
    const startHour = hour % 12 || 12
    const endHour = (hour + 1) % 12 || 12
    const startAmpm = hour < 12 ? 'AM' : 'PM'
    const endAmpm = (hour + 1) < 12 ? 'AM' : 'PM'
    return `${startHour}:00 ${startAmpm} - ${endHour}:00 ${endAmpm}`
}

const formatHourShort = (hour) => {
    const hourFormat = hour % 12 || 12
    const ampm = hour < 12 ? 'a' : 'p'
    return `${hourFormat}${ampm}`
}

// Form methods
const resetForm = () => {
    formData.value = {
        id: null,
        code: ''.toUpperCase(),
        idSemestre: semesterStore.currentSemester?.id || '',
        idSubject: '',
        idDocente: 'null',
        scheduleList: []
    }
}

const loadFormData = () => {
    if (props.mode === 'edit' && props.editData) {
        formData.value = {
            id: props.editData.id,
            code: props.editData.code || ''.toUpperCase(),
            idSemestre: props.editData.idSemestre || '',
            idSubject: props.editData.idSubject || '',
            idDocente: props.editData.idDocente !== null ? props.editData.idDocente : 'null',
            scheduleList: props.editData.scheduleList ? [...props.editData.scheduleList] : []
        }
    } else {
        resetForm()
    }
}

// Modal close methods
const handleCloseModal = () => {
    if (hasFormData.value) {
        showConfirmation.value = true
        return
    }
    closeModal()
}

const confirmClose = () => {
    showConfirmation.value = false
    closeModal()
}

const closeModal = () => {
    // Start closing animation
    isClosing.value = true

    // Wait for animation to complete before closing
    setTimeout(() => {
        // Reset form
        resetForm()

        // Reset animation state
        isClosing.value = false
        showConfirmation.value = false

        // Emit close event
        emit('close')
    }, 500) // Wait for animation duration
}

const handleOverlayClick = () => {
    if (hasFormData.value) {
        showConfirmation.value = true
        return
    }
    closeModal()
}

const handleSubmit = async () => {
    if (formData.value.scheduleList.length === 0) {
        alert('Por favor selecciona al menos un horario')
        return
    }

    isSubmitting.value = true
    try {
        // Preparar datos según la interfaz CreateGroupRequest/UpdateGroupRequest
        const groupData = {
            code: formData.value.code.trim().toUpperCase(),
            idSubject: parseInt(formData.value.idSubject),
            scheduleList: formData.value.scheduleList
        }

        // Solo incluir idDocente si no es "SIN ASIGNAR"
        if (formData.value.idDocente !== 'null') {
            groupData.idDocente = parseInt(formData.value.idDocente)
        }

        // Para modo de edición, incluir el ID
        if (props.mode === 'edit' && formData.value.id) {
            groupData.id = formData.value.id
        }

        emit('submit', groupData)

        // Close modal after successful submission
        closeModal()
    } catch (error) {
        console.error('Error submitting form:', error)
    } finally {
        isSubmitting.value = false
    }
}

// Load users
const loadUsers = async () => {
    loadingUsers.value = true
    try {
        const users = await userService.getUsers()
        availableUsers.value = users.filter(user => user.isActive)
    } catch (error) {
        console.error('Error loading users:', error)
        availableUsers.value = []
    } finally {
        loadingUsers.value = false
    }
}

// Watchers
watch(() => props.isVisible, (newValue) => {
    if (newValue) {
        loadFormData()
        // Reset animation state when modal opens
        isClosing.value = false
        showConfirmation.value = false
    }
})

watch(() => props.editData, () => {
    if (props.isVisible) {
        loadFormData()
    }
})

// Limpiar selección de profesor cuando cambie la materia
watch(() => formData.value.idSubject, (newSubjectId, oldSubjectId) => {
    if (newSubjectId !== oldSubjectId && formData.value.idDocente) {
        // Verificar si el profesor actual puede dictar la nueva materia
        const currentProfessor = availableUsers.value.find(user =>
            user.id === parseInt(formData.value.idDocente)
        )

        if (currentProfessor) {
            const isStillAvailable = filteredAvailableUsers.value.some(user =>
                user.id === currentProfessor.id
            )

            if (!isStillAvailable) {
                formData.value.idDocente = 'null'
            }
        }
    }
})

// Fetch availability when docente changes
watch(() => formData.value.idDocente, async (newDocenteId) => {
    if (newDocenteId && newDocenteId !== 'null') {
        await fetchTeacherAvailability()
    } else {
        teacherAvailability.value = null
    }
})

// Lifecycle
onMounted(async () => {
    // Load initial data
    try {
        if (!areasStore.isLoaded) {
            await areasStore.fetchAreas()
        }
        if (semesterStore.availableSemesters.length === 0) {
            await semesterStore.loadSemesters()
        }
        await loadUsers()
    } catch (error) {
        console.error('Error loading initial data:', error)
    }
})
</script>