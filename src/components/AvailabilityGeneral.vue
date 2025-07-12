<template>
    <div class="w-full h-full mt-4 text-gray-900 min-h-screen">
        <!-- Vista General Info Section -->
        <div class="p-6 border border-gray-300 rounded-sm bg-white mt-4">
            <h2 class="text-xl font-semibold mb-2 text-gray-900">Vista General</h2>

            <!-- Filters Section -->
            <div class="flex flex-wrap gap-4 mb-4">
                <!-- Areas Filter -->
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Filtrar por Área</label>
                    <Select v-model="selectedAreaFilter" placeholder="Todas las áreas">
                        <option value="">Todas las áreas</option>
                        <option v-for="area in areasStore.areas" :key="area.id" :value="area.id">
                            {{ area.description }}
                        </option>
                    </Select>
                </div>

                <!-- Subjects Filter -->
                <div class="flex-1 max-w-[200px]">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Filtrar por Materia</label>
                    <Select v-model="selectedSubjectFilter" placeholder="Todas las materias">
                        <option value="">Todas las materias</option>
                        <option v-for="subject in filteredSubjects" :key="subject.id" :value="subject.id">
                            {{ subject.code }} - {{ subject.name }}
                        </option>
                    </Select>
                </div>

                <!-- Clear Filters Button -->
                <div class="flex items-end gap-2">
                    <Button variant="secondary" @click="clearFilters">
                        Limpiar filtros
                    </Button>
                    <Button variant="secondary" @click="toggleFullscreen"
                        :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'">

                        <Maximize2 :size="20" class="text-gray-600" />

                    </Button>

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

        <!-- Table Component -->
        <TableAvailability active-tab="general" :selected-professor-data="null" :time-slots="timeSlots"
            :day-keys="dayKeys" :global-availability="null" :all-professors-availability="allProfessorsAvailability"
            :professors="professors" :is-fullscreen="isFullscreen" :selected-area-filter="selectedAreaFilter"
            :selected-subject-filter="selectedSubjectFilter" @toggle-slot-status-general="toggleSlotStatusGeneral" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { CheckCircle2, XCircle, Clock, Maximize2 } from 'lucide-vue-next'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import { userService } from '@/services/userServices'
import type { User } from '@/types/user'
import type { ProfessorAvailability, GlobalAvailabilitySlot } from '@/types/availability'
import availabilityService from '@/services/availabilityService'
import { useStatusStore } from '@/store/statusStore'
import { useAreasStore } from '@/store/areasStore'
import { showSuccessToast, showErrorToast } from '@/utils/toast.js'
import TableAvailability from '@/components/ui/TableAvailability.vue'
import type { StatusAvailability } from '@/types/status'

// Props
const props = defineProps<{
    selectedSemester: any
}>()

// Stores
const statusStore = useStatusStore()
const areasStore = useAreasStore()

// Estado reactivo
const professors = ref<User[]>([])
const allProfessorsAvailability = ref<ProfessorAvailability[]>([])
const loadingAllAvailability = ref(false)
const selectedAreaFilter = ref('')
const selectedSubjectFilter = ref('')
const isFullscreen = ref(false)

const timeSlots = ref([
    '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
])

const dayKeys = ref(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'])

// Computed properties
const filteredSubjects = computed(() => {
    if (!selectedAreaFilter.value) {
        return areasStore.areas.flatMap(area =>
            areasStore.getSubjectsByArea(area.id || 0)
        )
    }
    const areaId = parseInt(selectedAreaFilter.value)
    return areaId ? areasStore.getSubjectsByArea(areaId) : []
})

// Methods
async function loadProfessors() {
    try {
        const users = await userService.getUsers()
        professors.value = users.filter(user =>
            user.rolesDescriptions.some(role =>
                role.toLowerCase().includes('profesor') ||
                role.toLowerCase().includes('docente')
            )
        )
    } catch (err) {
        console.error('Error loading professors:', err)
    }
}

async function loadAllProfessorsAvailability() {
    if (!props.selectedSemester?.id) {
        return
    }

    try {
        loadingAllAvailability.value = true
        const response = await availabilityService.getAllProfessorsAvailability(props.selectedSemester.id)
        allProfessorsAvailability.value = response
    } catch (err) {
        console.error('Error loading all professors availability:', err)
        showErrorToast('Error al cargar la disponibilidad de todos los profesores')
    } finally {
        loadingAllAvailability.value = false
    }
}

async function toggleSlotStatusGeneral(hour: string, day: string, professorId: string, status: 'approved' | 'rejected' | 'pending') {
    const professorAvailability = allProfessorsAvailability.value.find(
        (pa: ProfessorAvailability) => pa.userIdDocent.toString() === professorId
    )

    if (!professorAvailability) return

    const daySlots = professorAvailability.disponibilidad[day]
    if (!daySlots) return

    const slot = daySlots.find((s: GlobalAvailabilitySlot) => s.hour === parseInt(hour.split(':')[0]))
    if (!slot) return

    const newStatusId = status === 'approved' ? getApproveStatusId() : status === 'rejected' ? getRejectStatusId() : getPendingStatusId()

    try {
        await availabilityService.updateAvailabilityStatus(
            slot.id,
            newStatusId,
            props.selectedSemester.id
        )

        showSuccessToast('Estado actualizado exitosamente')
        await loadAllProfessorsAvailability()
    } catch (err) {
        console.error('Error updating slot status:', err)
        showErrorToast('Error al actualizar el estado')
    }
}

function clearFilters() {
    selectedAreaFilter.value = ''
    selectedSubjectFilter.value = ''
}

function toggleFullscreen() {
    const element = document.querySelector('.calendar-table-container')
    if (!element) return

    if (!isFullscreen.value) {
        if (element.requestFullscreen) {
            element.requestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
    }
}

function handleFullscreenChange() {
    isFullscreen.value = !!document.fullscreenElement
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

        if (!allProfessorsAvailability.value.length) {
            showErrorToast('No hay disponibilidad para aprobar')
            return
        }

        for (const professorAvailability of allProfessorsAvailability.value) {
            for (const daySlots of Object.values(professorAvailability.disponibilidad)) {
                for (const slot of daySlots) {
                    await availabilityService.updateAvailabilityStatus(
                        slot.id,
                        approveStatusId,
                        props.selectedSemester.id
                    )
                }
            }
        }

        showSuccessToast('Todas las disponibilidades han sido aprobadas')
        await loadAllProfessorsAvailability()
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

        if (!allProfessorsAvailability.value.length) {
            showErrorToast('No hay disponibilidad para rechazar')
            return
        }

        for (const professorAvailability of allProfessorsAvailability.value) {
            for (const daySlots of Object.values(professorAvailability.disponibilidad)) {
                for (const slot of daySlots) {
                    await availabilityService.updateAvailabilityStatus(
                        slot.id,
                        rejectStatusId,
                        props.selectedSemester.id
                    )
                }
            }
        }

        showSuccessToast('Todas las disponibilidades han sido rechazadas')
        await loadAllProfessorsAvailability()
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

        if (!allProfessorsAvailability.value.length) {
            showErrorToast('No hay disponibilidad para marcar como pendiente')
            return
        }

        for (const professorAvailability of allProfessorsAvailability.value) {
            for (const daySlots of Object.values(professorAvailability.disponibilidad)) {
                for (const slot of daySlots) {
                    await availabilityService.updateAvailabilityStatus(
                        slot.id,
                        pendingStatusId,
                        props.selectedSemester.id
                    )
                }
            }
        }

        showSuccessToast('Todas las disponibilidades han sido marcadas como pendientes')
        await loadAllProfessorsAvailability()
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

    document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

// Watchers
watch(() => props.selectedSemester, (newSemester) => {
    if (newSemester) {
        loadProfessors()
        loadAllProfessorsAvailability()
    }
}, { immediate: true })
</script>
