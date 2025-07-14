<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-sm shadow-xl w-full max-w-lg mx-4">
            <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900">
                        Cargar Disponibilidad Anterior
                    </h3>
                    <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <X :size="24" />
                    </button>
                </div>
            </div>

            <div class="px-6 py-4">
                <p class="text-sm text-gray-600 mb-4">
                    Selecciona un semestre anterior para cargar tu disponibilidad y aplicarla al semestre actual.
                </p>

                <div v-if="loading" class="flex items-center justify-center py-8">
                    <div class="text-sm text-gray-500">Cargando semestres...</div>
                </div>

                <div v-else-if="error" class="text-sm text-red-600 py-4">
                    Error al cargar los semestres anteriores
                </div>

                <div v-else-if="previousSemesters.length === 0" class="text-sm text-gray-500 py-4">
                    No hay semestres anteriores disponibles
                </div>

                <div v-else class="space-y-2">
                    <div v-for="semester in previousSemesters" :key="semester.id" @click="selectSemester(semester)"
                        class="p-3 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        :class="{
                            'border-primary-500 bg-primary-50': selectedSemester?.id === semester.id
                        }">
                        <div class="font-medium text-gray-900">{{ semester.description }}</div>
                        <div class="text-sm text-gray-600">
                            {{ formatDateRange(semester.startDate, semester.endDate) }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <Button @click="$emit('close')" variant="secondary">
                    Cancelar
                </Button>
                <Button @click="loadPreviousAvailability" :disabled="!selectedSemester || loadingAvailability"
                    variant="primary">
                    <Send :size="18" />
                    Cargar Disponibilidad
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { X, Send } from 'lucide-vue-next'
import Button from '@/components/ui/base/BaseButton.vue'
import { useSemesterStore } from '@/store/semesterStore'
import { useAuthStore } from '@/store/authStore'
import availabilityService from '@/services/availabilityService'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    currentSemesterId: {
        type: [String, Number],
        required: true
    }
})

const emit = defineEmits(['close', 'availability-loaded'])

const semesterStore = useSemesterStore()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref(false)
const selectedSemester = ref(null)
const loadingAvailability = ref(false)

// Computed para obtener semestres anteriores (excluyendo el actual)
const previousSemesters = computed(() => {
    return semesterStore.availableSemesters.filter(
        semester => semester.id !== Number(props.currentSemesterId)
    )
})

const formatDateRange = (startDate, endDate) => {
    const format = (date) =>
        new Date(date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })

    return `${format(startDate)} - ${format(endDate)}`
}

const selectSemester = (semester) => {
    selectedSemester.value = semester
}

const loadPreviousAvailability = async () => {
    if (!selectedSemester.value) return

    try {
        loadingAvailability.value = true

        const userId = authStore.userId
        if (!userId) {
            throw new Error('Usuario no identificado')
        }

        // Cargar disponibilidad del semestre seleccionado
        let availabilityData = null

        try {
            // Intentar primero con la API global
            const globalResponse = await availabilityService.getGlobalAvailability(
                userId,
                selectedSemester.value.id
            )
            availabilityData = globalResponse.disponibilidad
        } catch (globalError) {
            console.warn('Error loading global availability, trying with API simple:', globalError)

            // Para la API simple, necesitamos hacer una llamada manual porque necesita headers específicos
            try {
                const token = authStore.getToken()
                const currentUserId = authStore.userId

                if (!token || !currentUserId) {
                    throw new Error('No authentication data available')
                }

                const response = await fetch('/api/v1/availability/docente', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'UserId': currentUserId.toString(),
                        'semesterId': selectedSemester.value.id.toString(),
                    },
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const simpleResponse = await response.json()
                availabilityData = simpleResponse.disponibilidad
            } catch (simpleError) {
                console.error('Error with simple API as well:', simpleError)
                throw simpleError
            }
        }

        if (availabilityData && Object.keys(availabilityData).length > 0) {
            // Convertir formato de API a formato interno
            const convertedSlots = convertApiToInternalFormat(availabilityData)

            emit('availability-loaded', {
                slots: convertedSlots,
                semesterDescription: selectedSemester.value.description
            })

            showSuccessToast(`Disponibilidad cargada desde ${selectedSemester.value.description}`)
            emit('close')
        } else {
            showErrorToast('No se encontró disponibilidad para el semestre seleccionado')
        }

    } catch (error) {
        console.error('Error loading previous availability:', error)
        showErrorToast('Error al cargar la disponibilidad anterior')
    } finally {
        loadingAvailability.value = false
    }
}

const convertApiToInternalFormat = (apiData) => {
    const slots = []
    const dayMapping = {
        'LUNES': 1,
        'MARTES': 2,
        'MIERCOLES': 3,
        'JUEVES': 4,
        'VIERNES': 5,
        'SABADO': 6,
        'DOMINGO': 7
    }

    Object.keys(apiData).forEach(dayName => {
        const dayValue = dayMapping[dayName]
        if (dayValue) {
            apiData[dayName].forEach(slot => {
                slots.push({
                    day: dayValue,
                    hour: slot.hour,
                    statusId: null // Resetear el estado al cargar de semestre anterior
                })
            })
        }
    })

    return slots
}

// Cargar semestres cuando se abre el modal
watch(() => props.isOpen, async (isOpen) => {
    if (isOpen) {
        selectedSemester.value = null

        // Cargar semestres si no están cargados
        if (semesterStore.availableSemesters.length === 0) {
            try {
                loading.value = true
                error.value = false
                await semesterStore.loadSemesters()
            } catch (err) {
                console.error('Error loading semesters:', err)
                error.value = true
            } finally {
                loading.value = false
            }
        }
    }
})
</script>