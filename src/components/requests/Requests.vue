<template>
    <div class="h-full flex flex-col">
        <!-- Barra de búsqueda y filtros -->
        <div class="flex justify-between items-center mb-4">
            <div class="flex items-center h-15 gap-4">
                <Search v-model="searchTerm" placeholder="Buscar solicitudes..." />

                <!-- Filtro por tipo de solicitud -->
                <Select id="request-type-filter" v-model="selectedTypeFilter" placeholder="Todos los tipos">
                    <option value="">Todos los tipos</option>
                    <option v-for="type in requestTypes" :key="type.value" :value="type.value">
                        {{ type.label }}
                    </option>
                </Select>
            </div>

            <div class="flex items-center gap-2">
                <!-- Botón refrescar -->
                <Button variant="secondary" @click="refreshRequests" :disabled="isRefreshing">
                    <template #icon>
                        <RefreshCw :size="18" :class="{ 'animate-spin': isRefreshing }" />
                    </template>
                    Refrescar
                </Button>
            </div>
        </div>

        <!-- Contenedores principales -->
        <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Bandeja de solicitudes -->
            <div class="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 class="text-lg font-semibold text-gray-900">Bandeja de Solicitudes</h2>
                    <p class="text-sm text-gray-600 mt-1">{{ filteredRequests.length }} solicitudes pendientes</p>
                </div>

                <div class="flex-1 overflow-y-auto">
                    <!-- Loading state -->
                    <div v-if="isLoading" class="flex items-center justify-center py-12">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        <span class="ml-3 text-gray-600">Cargando solicitudes...</span>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="filteredRequests.length === 0"
                        class="flex flex-col items-center justify-center py-12">
                        <Inbox :size="48" class="text-gray-300 mb-3" />
                        <p class="text-gray-500">No hay solicitudes pendientes</p>
                    </div>

                    <!-- Lista de solicitudes -->
                    <div v-else class="divide-y divide-gray-100">
                        <div v-for="request in filteredRequests" :key="request.id" @click="selectRequest(request)"
                            :class="[
                                'px-6 py-4 cursor-pointer transition-all duration-150',
                                selectedRequest?.id === request.id
                                    ? 'bg-primary-50 border-l-4 border-l-primary-500'
                                    : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                            ]">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <User :size="16" class="text-gray-400" />
                                        <h3 class="font-semibold text-gray-900">{{ request.professorName }}</h3>
                                    </div>
                                    <div class="flex items-center gap-2 mt-2">
                                        <Calendar :size="14" class="text-gray-400" />
                                        <span class="text-sm text-gray-600">{{ formatDate(request.date) }}</span>
                                    </div>
                                    <div class="mt-2">
                                        <span :class="[
                                            'inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium',
                                            getRequestTypeColor(request.type)
                                        ]">
                                            {{ getRequestTypeLabel(request.type) }}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight :size="20" class="text-gray-400 flex-shrink-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detalle de solicitud -->
            <div class="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 class="text-lg font-semibold text-gray-900">Detalle de Solicitud</h2>
                </div>

                <div class="flex-1 overflow-y-auto">
                    <!-- Empty state -->
                    <div v-if="!selectedRequest"
                        class="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
                        <FileText :size="48" class="text-gray-300 mb-3" />
                        <p class="text-gray-500">Selecciona una solicitud para ver los detalles</p>
                    </div>

                    <!-- Detalle completo -->
                    <div v-else class="p-6 space-y-6">
                        <!-- Información del profesor -->
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <User :size="24" class="text-primary-600" />
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900">{{ selectedRequest.professorName }}
                                    </h3>
                                    <p class="text-sm text-gray-600">{{ selectedRequest.professorEmail }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Separador -->
                        <div class="border-t border-gray-200"></div>

                        <!-- Información de la solicitud -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Solicitud</label>
                                <span :class="[
                                    'inline-flex items-center px-3 py-1.5 rounded-sm text-sm font-medium',
                                    getRequestTypeColor(selectedRequest.type)
                                ]">
                                    {{ getRequestTypeLabel(selectedRequest.type) }}
                                </span>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Solicitud</label>
                                <div class="flex items-center gap-2">
                                    <Calendar :size="16" class="text-gray-400" />
                                    <span class="text-gray-900">{{ formatDate(selectedRequest.date) }}</span>
                                </div>
                            </div>

                            <div v-if="selectedRequest.subject">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                                <span class="text-gray-900">{{ selectedRequest.subject }}</span>
                            </div>

                            <div v-if="selectedRequest.groupCode">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Código de Grupo</label>
                                <span class="text-gray-900">{{ selectedRequest.groupCode }}</span>
                            </div>

                            <div v-if="selectedRequest.requestedDates">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Fechas Solicitadas</label>
                                <span class="text-gray-900">{{ selectedRequest.requestedDates }}</span>
                            </div>
                        </div>

                        <!-- Separador -->
                        <div class="border-t border-gray-200"></div>

                        <!-- Comentario -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Comentario</label>
                            <div class="bg-gray-50 border border-gray-200 rounded-sm p-4">
                                <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{{
                                    selectedRequest.comment }}</p>
                            </div>
                        </div>

                        <!-- Separador -->
                        <div class="border-t border-gray-200"></div>

                        <!-- Botones de acción -->
                        <div class="flex gap-3 pt-2">
                            <Button variant="danger" @click="rejectRequest" class="flex-1">
                                <template #icon>
                                    <X :size="18" />
                                </template>
                                Rechazar
                            </Button>
                            <Button variant="success" @click="acceptRequest" class="flex-1">
                                <template #icon>
                                    <Check :size="18" />
                                </template>
                                Aceptar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de confirmación -->
        <ConfirmationModal :is-visible="showConfirmModal" :title="confirmModalTitle" :message="confirmModalMessage"
            :confirm-text="confirmModalConfirmText" :confirm-variant="confirmModalVariant"
            @confirm="handleConfirmAction" @cancel="closeConfirmModal" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { User, Calendar, ChevronRight, FileText, Inbox, Check, X, RefreshCw } from 'lucide-vue-next'
import Search from '@/components/ui/base/BaseSearch.vue'
import Select from '@/components/ui/base/BaseSelect.vue'
import Button from '@/components/ui/base/BaseButton.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'

// Estado reactivo
const searchTerm = ref('')
const selectedTypeFilter = ref('')
const selectedRequest = ref(null)
const isLoading = ref(false)
const isRefreshing = ref(false)
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmModalConfirmText = ref('')
const confirmModalVariant = ref('primary')
const pendingAction = ref(null)

// Tipos de solicitudes
const requestTypes = [
    { value: 'schedule_change', label: 'Cambio de Horario' },
    { value: 'absence', label: 'Permiso de Ausencia' },
    { value: 'group_assignment', label: 'Asignación de Grupo' },
    { value: 'availability_update', label: 'Actualización de Disponibilidad' },
    { value: 'other', label: 'Otro' }
]

// Mock data - Solicitudes de ejemplo
const mockRequests = ref([
    {
        id: 1,
        professorName: 'Dr. Carlos Pérez',
        professorEmail: 'carlos.perez@uis.edu.co',
        date: '2025-10-05T14:30:00',
        type: 'schedule_change',
        subject: 'Cálculo Diferencial',
        groupCode: 'A1',
        requestedDates: '15-20 de Octubre, 2025',
        comment: 'Solicito cambio de horario del grupo A1 debido a compromisos académicos en otra institución. Propongo mover las clases de lunes y miércoles a martes y jueves en el mismo horario.'
    },
    {
        id: 2,
        professorName: 'Dra. María González',
        professorEmail: 'maria.gonzalez@uis.edu.co',
        date: '2025-10-04T10:15:00',
        type: 'absence',
        subject: 'Álgebra Lineal',
        groupCode: 'B2',
        requestedDates: '10-12 de Octubre, 2025',
        comment: 'Necesito permiso de ausencia por participación en conferencia internacional de matemáticas en Bogotá. He coordinado con el profesor sustituto para cubrir mis clases.'
    },
    {
        id: 3,
        professorName: 'Ing. Roberto Martínez',
        professorEmail: 'roberto.martinez@uis.edu.co',
        date: '2025-10-03T16:45:00',
        type: 'group_assignment',
        subject: 'Programación Orientada a Objetos',
        groupCode: null,
        requestedDates: null,
        comment: 'Solicito ser asignado al grupo C3 de Programación Orientada a Objetos. Tengo experiencia previa con este curso y disponibilidad en el horario propuesto.'
    },
    {
        id: 4,
        professorName: 'Dra. Ana López',
        professorEmail: 'ana.lopez@uis.edu.co',
        date: '2025-10-02T09:20:00',
        type: 'availability_update',
        subject: null,
        groupCode: null,
        requestedDates: 'Semestre 2025-2',
        comment: 'Actualización de disponibilidad para el próximo semestre. A partir de noviembre tendré disponibilidad completa los días lunes, miércoles y viernes de 8:00 AM a 6:00 PM.'
    },
    {
        id: 5,
        professorName: 'Dr. Luis Ramírez',
        professorEmail: 'luis.ramirez@uis.edu.co',
        date: '2025-10-01T11:30:00',
        type: 'schedule_change',
        subject: 'Ecuaciones Diferenciales',
        groupCode: 'D4',
        requestedDates: '8-10 de Octubre, 2025',
        comment: 'Solicito ajuste de horario para el grupo D4. Propongo adelantar 30 minutos la hora de inicio para evitar conflictos con el laboratorio de física.'
    },
    {
        id: 6,
        professorName: 'Dra. Patricia Silva',
        professorEmail: 'patricia.silva@uis.edu.co',
        date: '2025-09-30T15:00:00',
        type: 'other',
        subject: 'Estadística Aplicada',
        groupCode: 'E5',
        requestedDates: null,
        comment: 'Solicito autorización para realizar actividades prácticas en laboratorio de computación adicional al horario regular. Los estudiantes necesitan más tiempo para completar los proyectos de análisis de datos.'
    },
    {
        id: 7,
        professorName: 'Dr. Fernando Torres',
        professorEmail: 'fernando.torres@uis.edu.co',
        date: '2025-09-29T13:45:00',
        type: 'absence',
        subject: 'Base de Datos',
        groupCode: 'F1',
        requestedDates: '18-19 de Octubre, 2025',
        comment: 'Solicito permiso por motivos de salud. Adjunto certificado médico. La Dra. Silva ha aceptado cubrir mis clases durante estos días.'
    }
])

// Solicitudes filtradas
const filteredRequests = computed(() => {
    let requests = mockRequests.value

    // Filtrar por término de búsqueda
    if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase()
        requests = requests.filter(request =>
            request.professorName.toLowerCase().includes(term) ||
            request.professorEmail.toLowerCase().includes(term) ||
            request.comment.toLowerCase().includes(term) ||
            (request.subject && request.subject.toLowerCase().includes(term)) ||
            (request.groupCode && request.groupCode.toLowerCase().includes(term))
        )
    }

    // Filtrar por tipo de solicitud
    if (selectedTypeFilter.value) {
        requests = requests.filter(request => request.type === selectedTypeFilter.value)
    }

    // Ordenar por fecha (más reciente primero)
    return requests.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Métodos
const selectRequest = (request) => {
    selectedRequest.value = request
}

const refreshRequests = async () => {
    isRefreshing.value = true
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    isRefreshing.value = false
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getRequestTypeLabel = (type) => {
    const typeObj = requestTypes.find(t => t.value === type)
    return typeObj ? typeObj.label : 'Desconocido'
}

const getRequestTypeColor = (type) => {
    const colors = {
        schedule_change: 'bg-info-100 text-info-700',
        absence: 'bg-warning-100 text-warning-700',
        group_assignment: 'bg-success-100 text-success-700',
        availability_update: 'bg-primary-100 text-primary-700',
        other: 'bg-gray-100 text-gray-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
}

const acceptRequest = () => {
    if (!selectedRequest.value) return

    confirmModalTitle.value = 'Aceptar Solicitud'
    confirmModalMessage.value = `¿Estás seguro de que deseas <strong>aceptar</strong> la solicitud de <strong>${selectedRequest.value.professorName}</strong>?`
    confirmModalConfirmText.value = 'Aceptar'
    confirmModalVariant.value = 'success'
    pendingAction.value = 'accept'
    showConfirmModal.value = true
}

const rejectRequest = () => {
    if (!selectedRequest.value) return

    confirmModalTitle.value = 'Rechazar Solicitud'
    confirmModalMessage.value = `¿Estás seguro de que deseas <strong>rechazar</strong> la solicitud de <strong>${selectedRequest.value.professorName}</strong>?`
    confirmModalConfirmText.value = 'Rechazar'
    confirmModalVariant.value = 'danger'
    pendingAction.value = 'reject'
    showConfirmModal.value = true
}

const handleConfirmAction = () => {
    if (pendingAction.value === 'accept') {
        // Simular aceptación de solicitud
        console.log('Solicitud aceptada:', selectedRequest.value)
        // Remover de la lista
        const index = mockRequests.value.findIndex(r => r.id === selectedRequest.value.id)
        if (index !== -1) {
            mockRequests.value.splice(index, 1)
        }
        selectedRequest.value = null
    } else if (pendingAction.value === 'reject') {
        // Simular rechazo de solicitud
        console.log('Solicitud rechazada:', selectedRequest.value)
        // Remover de la lista
        const index = mockRequests.value.findIndex(r => r.id === selectedRequest.value.id)
        if (index !== -1) {
            mockRequests.value.splice(index, 1)
        }
        selectedRequest.value = null
    }

    closeConfirmModal()
}

const closeConfirmModal = () => {
    showConfirmModal.value = false
    confirmModalTitle.value = ''
    confirmModalMessage.value = ''
    confirmModalConfirmText.value = ''
    confirmModalVariant.value = 'primary'
    pendingAction.value = null
}
</script>

<style scoped></style>