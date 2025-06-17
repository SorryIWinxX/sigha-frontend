<template>
    <div v-if="(activeTab === 'individual' && selectedProfessorData) || activeTab === 'general'" class="pt-6">
        <div class="border border-gray-300 rounded-sm bg-white calendar-table-container"
            :class="{ 'fullscreen-mode': isFullscreen }">
            <div class="overflow-auto" :class="{ 'max-h-[80vh]': !isFullscreen, 'h-screen': isFullscreen }">
                <table class="w-full border-collapse" :class="{ 'fullscreen-table': isFullscreen }">
                    <!-- Fixed Header -->
                    <thead class="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th
                                class="p-3 text-center font-semibold text-gray-900 min-w-[80px] bg-gray-100 border border-gray-300">
                                Hora
                            </th>
                            <th
                                class="p-3 text-center font-semibold text-gray-900 min-w-[150px] bg-gray-100 border border-gray-300">
                                LUNES
                            </th>
                            <th
                                class="p-3 text-center font-semibold text-gray-900 min-w-[150px] bg-gray-100 border border-gray-300">
                                MARTES
                            </th>
                            <th
                                class="p-3 text-center font-semibold text-gray-900 min-w-[150px] bg-gray-100 border border-gray-300">
                                MIÉRCOLES
                            </th>
                            <th
                                class="p-3 text-center font-semibold text-gray-900 min-w-[150px] bg-gray-100 border border-gray-300">
                                JUEVES
                            </th>
                            <th
                                class="p-3 text-center font-semibold text-gray-900 min-w-[150px] bg-gray-100 border border-gray-300">
                                VIERNES
                            </th>
                            <th
                                class="p-3 text-center font-semibold text-gray-900 min-w-[150px] bg-gray-100 border border-gray-300">
                                SÁBADO
                            </th>
                            <th
                                class="p-3 text-center font-semibold text-gray-900 min-w-[150px] bg-gray-100 border border-gray-300">
                                DOMINGO
                            </th>
                        </tr>
                    </thead>
                    <!-- Scrollable Body -->
                    <tbody>
                        <tr v-for="hour in timeSlots" :key="hour">
                            <td
                                class="border-r border-b border-gray-300 p-3 text-center font-medium bg-gray-50 text-gray-900">
                                {{ hour }}
                            </td>
                            <td v-for="day in dayKeys" :key="`${hour}-${day}`"
                                class="border border-gray-300 p-1 bg-white"
                                :class="activeTab === 'general' ? 'min-h-[120px] align-top' : 'text-center min-h-[60px] align-middle'">

                                <!-- Vista Individual -->
                                <div v-if="activeTab === 'individual' && getIndividualSlot(hour, day)"
                                    class="border rounded p-2 text-center"
                                    :class="getProfessorCardClasses(getIndividualSlot(hour, day)?.statusId === getApproveStatusId() ? 'approved' : getIndividualSlot(hour, day)?.statusId === getRejectStatusId() ? 'rejected' : 'pending')">
                                    <!-- Status Badge -->
                                    <div class="flex items-center justify-center mb-2">
                                        <span :class="getStatusClasses(getIndividualSlot(hour, day)?.statusId)"
                                            class="text-xs">
                                            {{ getIndividualSlot(hour, day)?.statusDescription }}
                                        </span>
                                    </div>

                                    <!-- Areas and Subjects section removed for compact view -->

                                    <!-- Action Icons -->
                                    <div class="flex justify-center space-x-1">
                                        <button
                                            @click="updateSlotStatus(getIndividualSlot(hour, day)!, getApproveStatusId())"
                                            :disabled="isSlotUpdating(getIndividualSlot(hour, day)!, getApproveStatusId())"
                                            :class="[
                                                'p-1 rounded transition-colors',
                                                getIndividualSlot(hour, day)?.statusId === getApproveStatusId()
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-300 text-gray-600 hover:bg-green-600 hover:text-white',
                                                isSlotUpdating(getIndividualSlot(hour, day)!, getApproveStatusId())
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'cursor-pointer'
                                            ]" title="Aprobar">
                                            <Check :size="12" />
                                        </button>
                                        <button
                                            @click="updateSlotStatus(getIndividualSlot(hour, day)!, getRejectStatusId())"
                                            :disabled="isSlotUpdating(getIndividualSlot(hour, day)!, getRejectStatusId())"
                                            :class="[
                                                'p-1 rounded transition-colors',
                                                getIndividualSlot(hour, day)?.statusId === getRejectStatusId()
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-300 text-gray-600 hover:bg-red-600 hover:text-white',
                                                isSlotUpdating(getIndividualSlot(hour, day)!, getRejectStatusId())
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'cursor-pointer'
                                            ]" title="Rechazar">
                                            <X :size="12" />
                                        </button>
                                        <button
                                            @click="updateSlotStatus(getIndividualSlot(hour, day)!, getPendingStatusId())"
                                            :disabled="isSlotUpdating(getIndividualSlot(hour, day)!, getPendingStatusId())"
                                            :class="[
                                                'p-1 rounded transition-colors',
                                                getIndividualSlot(hour, day)?.statusId === getPendingStatusId()
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-300 text-gray-600 hover:bg-blue-600 hover:text-white',
                                                isSlotUpdating(getIndividualSlot(hour, day)!, getPendingStatusId())
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'cursor-pointer'
                                            ]" title="Pendiente">
                                            <Clock :size="12" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Vista General -->
                                <div v-else-if="activeTab === 'general'" class="space-y-2">
                                    <div v-if="getGeneralSlotProfessors(hour, day).length === 0"
                                        class="text-gray-500 text-sm">
                                        Sin disponibilidad
                                    </div>
                                    <div v-else>
                                        <!-- Professor Cards -->
                                        <div v-for="professorSlot in getGeneralSlotProfessors(hour, day)"
                                            :key="professorSlot.professor.id" class="border rounded-sm p-3 mb-2"
                                            :class="getProfessorCardClasses(professorSlot.status)">

                                            <!-- Professor Name with status -->
                                            <div class="flex items-center p-4 justify-between mb-3">
                                                <div class="flex items-center space-x-2">
                                                    <div
                                                        class="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                                                        <img v-if="professorSlot.professor.photo"
                                                            :src="professorSlot.professor.photo"
                                                            :alt="professorSlot.professor.name"
                                                            class="w-full h-full object-cover" />
                                                        <div v-else
                                                            class="w-full h-full flex items-center justify-center text-gray-400">
                                                            <UserIcon :size="32" />
                                                        </div>
                                                    </div>
                                                    <span
                                                        class="text-sm font-medium text-gray-900 whitespace-nowrap pr-2 overflow-hidden text-ellipsis">
                                                        {{ professorSlot.professor.name }}
                                                    </span>
                                                </div>
                                                <span :class="[
                                                    'px-2 py-1 rounded text-sm font-medium',
                                                    professorSlot.status === 'approved'
                                                        ? 'bg-green-500 text-white'
                                                        : professorSlot.status === 'rejected'
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-blue-500 text-white'
                                                ]">
                                                    {{ getStatusLabel(professorSlot.status) }}
                                                </span>
                                            </div>

                                            <!-- Subject tags -->
                                            <div class="flex flex-wrap gap-1 mb-3">
                                                <span v-for="subject in professorSlot.professor.subjects" :key="subject"
                                                    class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs border border-blue-200">
                                                    {{ subject }}
                                                </span>
                                            </div>

                                            <!-- Action Icons -->
                                            <div class="flex space-x-1">
                                                <button
                                                    @click="toggleSlotStatusGeneral(hour, day, professorSlot.professor.id, 'approved')"
                                                    :class="[
                                                        'p-1 rounded transition-colors',
                                                        professorSlot.status === 'approved'
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-gray-300 text-gray-600 hover:bg-green-600 hover:text-white'
                                                    ]">
                                                    <Check :size="14" />
                                                </button>
                                                <button
                                                    @click="toggleSlotStatusGeneral(hour, day, professorSlot.professor.id, 'rejected')"
                                                    :class="[
                                                        'p-1 rounded transition-colors',
                                                        professorSlot.status === 'rejected'
                                                            ? 'bg-red-600 text-white'
                                                            : 'bg-gray-300 text-gray-600 hover:bg-red-600 hover:text-white'
                                                    ]">
                                                    <X :size="14" />
                                                </button>
                                                <button
                                                    @click="toggleSlotStatusGeneral(hour, day, professorSlot.professor.id, 'pending')"
                                                    :class="[
                                                        'p-1 rounded transition-colors',
                                                        professorSlot.status === 'pending'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-300 text-gray-600 hover:bg-blue-600 hover:text-white'
                                                    ]">
                                                    <Clock :size="14" />
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Total Count -->
                                        <div v-if="getGeneralSlotProfessors(hour, day).length > 1"
                                            class="text-center text-black text-xs mt-2 bg-gray-200 py-1 rounded-sm">
                                            Total: {{ getGeneralSlotProfessors(hour, day).length }} profesores
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check, X, User as UserIcon, Clock } from 'lucide-vue-next'
import { useAreasStore } from '@/store/areasStore'
import { useStatusStore } from '@/store/statusStore'
import type { GlobalAvailabilityResponse, GlobalAvailabilitySlot, ProfessorAvailability } from '@/services/availabilityService'
import type { User } from '@/services/userServices'

// Props
const props = defineProps<{
    activeTab: 'individual' | 'general'
    selectedProfessorData?: any
    timeSlots: string[]
    dayKeys: string[]
    globalAvailability?: GlobalAvailabilityResponse | null
    allProfessorsAvailability?: ProfessorAvailability[]
    professors?: User[]
    isFullscreen: boolean
    selectedAreaFilter?: string
    selectedSubjectFilter?: string
}>()

// Emits
const emit = defineEmits<{
    (e: 'updateSlotStatus', slot: GlobalAvailabilitySlot, newStatusId: number): void
    (e: 'toggleSlotStatusGeneral', hour: string, day: string, professorId: string, status: 'approved' | 'rejected' | 'pending'): void
}>()

// Stores
const areasStore = useAreasStore()
const statusStore = useStatusStore()

// Methods
function getIndividualSlot(hour: string, day: string): GlobalAvailabilitySlot | null {
    if (!props.globalAvailability?.disponibilidad) return null

    const hourNumber = parseInt(hour.split(':')[0])
    const daySlots = props.globalAvailability.disponibilidad[day]

    if (!daySlots) return null

    return daySlots.find(slot => slot.hour === hourNumber) || null
}

function getStatusClasses(statusId?: number): string {
    const baseClasses = 'px-3 py-1 rounded-sm  text-xs font-medium'

    switch (statusId) {
        case 1:
            return `${baseClasses} bg-yellow-500 text-white`
        case 2:
            return `${baseClasses} bg-green-500 text-white`
        default:
            return `${baseClasses} bg-red-500 text-white`
    }
}

function getApproveStatusId(): number {
    const approvedStatus = statusStore.getAllStatus.find(status =>
        status.description.toLowerCase().includes('aprobad') ||
        status.description.toLowerCase().includes('approved')
    )
    return approvedStatus?.id || 2
}

function getRejectStatusId(): number {
    const rejectedStatus = statusStore.getAllStatus.find(status =>
        status.description.toLowerCase().includes('rechazad') ||
        status.description.toLowerCase().includes('rejected')
    )
    return rejectedStatus?.id || 3
}

function getPendingStatusId(): number {
    const pendingStatus = statusStore.getAllStatus.find(status =>
        status.description.toLowerCase().includes('pendiente') ||
        status.description.toLowerCase().includes('pending') ||
        status.description.toLowerCase().includes('enviado') ||
        status.description.toLowerCase().includes('sent')
    )
    return pendingStatus?.id || 1
}

function getProfessorCardClasses(status: 'approved' | 'rejected' | 'pending'): string {
    switch (status) {
        case 'approved': return 'border-green-500 bg-green-50'
        case 'rejected': return 'border-red-500 bg-red-50'
        case 'pending': return 'border-blue-500 bg-blue-50'
        default: return 'border-gray-300 bg-gray-50'
    }
}

function getStatusLabel(status: string | null): string {
    switch (status) {
        case 'approved': return 'Aprobado'
        case 'rejected': return 'Rechazado'
        case 'pending': return 'Pendiente'
        default: return ''
    }
}

function getGeneralSlotProfessors(hour: string, day: string): Array<{
    professor: {
        id: string
        name: string
        subjects: string[]
        photo?: string
    }
    status: 'approved' | 'rejected' | 'pending'
}> {
    if (!props.allProfessorsAvailability) return []

    const professorSlots: Array<{
        professor: {
            id: string
            name: string
            subjects: string[]
            photo?: string
        }
        status: 'approved' | 'rejected' | 'pending'
    }> = []

    for (const professorAvailability of props.allProfessorsAvailability) {
        // Aplicar filtro de área
        if (props.selectedAreaFilter && !professorAvailability.areas.includes(parseInt(props.selectedAreaFilter))) {
            continue
        }

        // Aplicar filtro de materia
        if (props.selectedSubjectFilter) {
            const professorSubjects = professorAvailability.areas.flatMap(areaId =>
                areasStore.getSubjectsByArea(areaId)
            )
            const hasSubject = professorSubjects.some(subject =>
                subject.id.toString() === props.selectedSubjectFilter
            )
            if (!hasSubject) {
                continue
            }
        }

        const daySlots = professorAvailability.disponibilidad[day]
        if (daySlots) {
            const slot = daySlots.find(s => s.hour === parseInt(hour.split(':')[0]))
            if (slot) {
                const status: 'approved' | 'rejected' | 'pending' =
                    slot.statusId === 2 ? 'approved' :
                        slot.statusId === 3 ? 'rejected' :
                            'pending'

                // Get the professor from the professors list
                const professor = props.professors?.find(
                    p => p.id.toString() === professorAvailability.userIdDocent.toString()
                )

                professorSlots.push({
                    professor: {
                        id: professorAvailability.userIdDocent.toString(),
                        name: professor ? `${professor.firstName} ${professor.lastName}` : `Profesor ${professorAvailability.userIdDocent}`,
                        subjects: professorAvailability.areas.map(areaId =>
                            areasStore.getAreaById(areaId)?.description || `Área ${areaId}`
                        ),
                        photo: professor?.photo
                    },
                    status
                })
            }
        }
    }

    return professorSlots
}

function updateSlotStatus(slot: GlobalAvailabilitySlot, newStatusId: number) {
    emit('updateSlotStatus', slot, newStatusId)
}

function toggleSlotStatusGeneral(hour: string, day: string, professorId: string, status: 'approved' | 'rejected' | 'pending') {
    emit('toggleSlotStatusGeneral', hour, day, professorId, status)
}

// Computed
const isSlotUpdating = computed(() => {
    return (slot: GlobalAvailabilitySlot, statusId: number) => false // This should be managed by the parent component
})
</script>

<style scoped>
.fullscreen-mode {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    margin: 0;
    border: none;
    border-radius: 0;
}

.fullscreen-table {
    height: 100vh;
}

.fullscreen-table thead {
    position: sticky;
    top: 0;
    z-index: 10;
}

.fullscreen-table tbody {
    height: calc(100vh - 60px);
    /* Adjust based on your header height */
}
</style>