<template>
    <div class="w-full h-full mt-4 text-gray-900 min-h-screen">
        <!-- Professor Selector -->
        <div class="mt-4">
            <div class="flex items-center justify-between">
                <div class="w-1/4">
                    <Select id="professor-select" v-model="selectedProfessor" placeholder="Seleccionar profesor"
                        :disabled="loading || !props.selectedSemester">
                        <option v-for="professor in professors" :key="professor.id" :value="professor.id">
                            {{ professor.firstName }} {{ professor.lastName }}
                        </option>
                    </Select>
                </div>

                <div class="flex gap-2">

                    <Button variant="danger" @click="rejectAll">

                        <XCircle :size="16" />

                        Rechazar todo
                    </Button>
                    <Button variant="info" @click="pendingAll">

                        <Clock :size="16" />

                        Pendiente todo
                    </Button>
                    <Button variant="primary" @click="approveAll">

                        <CheckCircle2 :size="16" />

                        Aprobar todo
                    </Button>
                </div>
            </div>




        </div>

        <!-- Professor Info Section -->
        <div v-if="selectedProfessorData" class="p-6 border border-gray-300 rounded-sm mt-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900">
                    {{ selectedProfessorData.firstName }} {{ selectedProfessorData.lastName }}
                </h2>
            </div>

            <!-- Areas and Subjects Section -->
            <div v-if="globalAvailability?.areas" class="flex gap-4 mb-4">
                <!-- Areas Column -->
                <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-700 mb-2">Áreas</h3>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="areaId in globalAvailability.areas" :key="areaId"
                            class="px-3 py-1.5 bg-info-500 text-white rounded-full text-sm ">
                            {{ areasStore.getAreaById(areaId)?.description }}
                        </span>
                    </div>
                </div>

                <!-- Subjects Column -->
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-700">Materias</h3>
                        <button @click="showAllSubjects = !showAllSubjects"
                            class="text-sm text-[#297400] hover:text-[#67B83C] flex items-center gap-1 cursor-pointer">
                            {{ showAllSubjects ? 'Ocultar' : 'Mostrar' }} todas
                            <ChevronDown :size="16" />
                        </button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <template v-for="areaId in globalAvailability.areas" :key="areaId">
                            <span v-for="(subject, index) in areasStore.getSubjectsByArea(areaId)"
                                :key="`${areaId}-${subject.id}`" v-show="showAllSubjects || index < 3"
                                class="px-3 py-1.5 bg-gray-200 text-black rounded-full text-sm ">
                                {{ subject.name }}
                            </span>
                            <span v-if="!showAllSubjects && areasStore.getSubjectsByArea(areaId).length > 3"
                                class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200">
                                +{{ areasStore.getSubjectsByArea(areaId).length - 3 }}
                            </span>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Component -->
        <TableAvailability active-tab="individual" :selected-professor-data="selectedProfessorData"
            :time-slots="timeSlots" :day-keys="dayKeys" :global-availability="globalAvailability"
            :all-professors-availability="[]" :professors="professors" :is-fullscreen="false" :selected-area-filter="''"
            :selected-subject-filter="''" @update-slot-status="updateSlotStatus" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { CheckCircle2, XCircle, Clock, ChevronDown } from 'lucide-vue-next'
import Select from '@/components/common/Select.vue'
import Button from '@/components/common/Button.vue'
import { userService } from '@/services/userServices'
import type { User } from '@/types/user'
import availabilityService from '@/services/availabilityService'
import type { GlobalAvailabilityResponse, GlobalAvailabilitySlot } from '@/types/availability'
import { useStatusStore } from '@/store/statusStore'
import { useAreasStore } from '@/store/areasStore'
import { showSuccessToast, showErrorToast } from '@/utils/toast.js'
import TableAvailability from './common/TableAvailability.vue'
import type { StatusAvailability } from '@/types/status'

// Props
const props = defineProps<{
    selectedSemester: any
}>()

// Stores
const statusStore = useStatusStore()
const areasStore = useAreasStore()

// Estado reactivo
const selectedProfessor = ref('')
const professors = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const loadingAvailability = ref(false)
const globalAvailability = ref<GlobalAvailabilityResponse | null>(null)
const updatingSlot = ref<{ [key: string]: boolean }>({})
const showAllSubjects = ref(false)

const timeSlots = ref([
    '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
])

const dayKeys = ref(['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'])

// Computed
const selectedProfessorData = computed(() => {
    return professors.value.find(p => p.id.toString() === selectedProfessor.value)
})

// Methods
async function loadProfessors() {
    try {
        loading.value = true
        error.value = ''
        const users = await userService.getUsers()

        professors.value = users.filter(user =>
            user.rolesDescriptions.some(role =>
                role.toLowerCase().includes('profesor') ||
                role.toLowerCase().includes('docente')
            )
        )

        if (professors.value.length > 0) {
            selectedProfessor.value = professors.value[0].id.toString()
        }
    } catch (err) {
        error.value = 'Error al cargar profesores'
        console.error('Error loading professors:', err)
    } finally {
        loading.value = false
    }
}

async function loadGlobalAvailability() {
    if (!selectedProfessor.value || !props.selectedSemester?.id) {
        return
    }

    try {
        loadingAvailability.value = true
        const response = await availabilityService.getGlobalAvailability(
            selectedProfessor.value,
            props.selectedSemester.id
        )
        globalAvailability.value = response
    } catch (err) {
        console.error('Error loading global availability:', err)
        globalAvailability.value = null
    } finally {
        loadingAvailability.value = false
    }
}

async function updateSlotStatus(slot: GlobalAvailabilitySlot, newStatusId: number) {
    if (!props.selectedSemester?.id) {
        showErrorToast('No hay semestre seleccionado')
        return
    }

    const slotKey = `${slot.id}-${newStatusId}`

    if (updatingSlot.value[slotKey]) {
        return
    }

    try {
        updatingSlot.value[slotKey] = true

        await availabilityService.updateAvailabilityStatus(
            slot.id,
            newStatusId,
            props.selectedSemester.id
        )

        showSuccessToast('Estado actualizado exitosamente')
        await loadGlobalAvailability()

    } catch (err) {
        console.error('Error updating slot status:', err)
        showErrorToast('Error al actualizar el estado')
    } finally {
        updatingSlot.value[slotKey] = false
    }
}

function getApproveStatusId(): number {
    const approvedStatus = statusStore.getAllStatus.find((status: StatusAvailability) =>
        status.description.toLowerCase().includes('approved')
    )
    return approvedStatus?.id || 2
}

function getRejectStatusId(): number {
    const rejectedStatus = statusStore.getAllStatus.find((status: StatusAvailability) =>
        status.description.toLowerCase().includes('rejected')
    )
    return rejectedStatus?.id || 3
}

function getPendingStatusId(): number {
    const pendingStatus = statusStore.getAllStatus.find((status: StatusAvailability) =>
        status.description.toLowerCase().includes('pending')
    )
    return pendingStatus?.id || 1
}

async function approveAll() {
    if (!props.selectedSemester?.id) {
        showErrorToast('No hay semestre seleccionado')
        return
    }

    try {
        const approveStatusId = getApproveStatusId()

        if (!globalAvailability.value?.disponibilidad) {
            showErrorToast('No hay disponibilidad para aprobar')
            return
        }

        const allSlots: GlobalAvailabilitySlot[] = []
        Object.values(globalAvailability.value.disponibilidad).forEach(daySlots => {
            allSlots.push(...daySlots)
        })

        for (const slot of allSlots) {
            await availabilityService.updateAvailabilityStatus(
                slot.id,
                approveStatusId,
                props.selectedSemester.id
            )
        }

        showSuccessToast('Todas las disponibilidades han sido aprobadas')
        await loadGlobalAvailability()
    } catch (err) {
        console.error('Error approving all slots:', err)
        showErrorToast('Error al aprobar todas las disponibilidades')
    }
}

async function rejectAll() {
    if (!props.selectedSemester?.id) {
        showErrorToast('No hay semestre seleccionado')
        return
    }

    try {
        const rejectStatusId = getRejectStatusId()

        if (!globalAvailability.value?.disponibilidad) {
            showErrorToast('No hay disponibilidad para rechazar')
            return
        }

        const allSlots: GlobalAvailabilitySlot[] = []
        Object.values(globalAvailability.value.disponibilidad).forEach(daySlots => {
            allSlots.push(...daySlots)
        })

        for (const slot of allSlots) {
            await availabilityService.updateAvailabilityStatus(
                slot.id,
                rejectStatusId,
                props.selectedSemester.id
            )
        }

        showSuccessToast('Todas las disponibilidades han sido rechazadas')
        await loadGlobalAvailability()
    } catch (err) {
        console.error('Error rejecting all slots:', err)
        showErrorToast('Error al rechazar todas las disponibilidades')
    }
}

async function pendingAll() {
    if (!props.selectedSemester?.id) {
        showErrorToast('No hay semestre seleccionado')
        return
    }

    try {
        const pendingStatusId = getPendingStatusId()

        if (!globalAvailability.value?.disponibilidad) {
            showErrorToast('No hay disponibilidad para marcar como pendiente')
            return
        }

        const allSlots: GlobalAvailabilitySlot[] = []
        Object.values(globalAvailability.value.disponibilidad).forEach(daySlots => {
            allSlots.push(...daySlots)
        })

        for (const slot of allSlots) {
            await availabilityService.updateAvailabilityStatus(
                slot.id,
                pendingStatusId,
                props.selectedSemester.id
            )
        }

        showSuccessToast('Todas las disponibilidades han sido marcadas como pendientes')
        await loadGlobalAvailability()
    } catch (err) {
        console.error('Error setting all slots to pending:', err)
        showErrorToast('Error al marcar todas las disponibilidades como pendientes')
    }
}

// Lifecycle hooks
onMounted(async () => {
    if (!statusStore.isLoaded) {
        try {
            await statusStore.fetchStatusAvailability()
        } catch (err) {
            console.error('Error loading status availability:', err)
        }
    }

    if (!areasStore.isLoaded) {
        try {
            await areasStore.fetchAreas()
        } catch (err) {
            console.error('Error loading areas:', err)
        }
    }
})

// Watchers
watch(() => props.selectedSemester, async (newSemester) => {
    if (newSemester) {
        await loadProfessors()
        // Recargar disponibilidad si ya hay un profesor seleccionado
        if (selectedProfessor.value) {
            await loadGlobalAvailability()
        }
    }
}, { immediate: true })

watch(() => selectedProfessor.value, () => {
    if (selectedProfessor.value && props.selectedSemester) {
        loadGlobalAvailability()
    }
})
</script>