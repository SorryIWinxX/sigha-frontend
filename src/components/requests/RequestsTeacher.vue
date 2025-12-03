<template>
    <div class="h-full flex flex-col">
        <!-- Barra de búsqueda y acciones -->
        <div class="flex justify-between items-center mb-4">
            <div class="flex items-center h-15 gap-4">
                <Search v-model="searchTerm" placeholder="Buscar solicitudes..." />

                <!-- Filtro por tipo de solicitud -->
                <Select id="request-type-filter" v-model="selectedTypeFilter" :options="requestTypeFilterOptions"
                    placeholder="Todos los tipos">
                </Select>

                <!-- Filtro por estado -->
                <Select id="status-filter" v-model="selectedStatusFilter" :options="statusFilterOptions"
                    placeholder="Todos los estados">
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

                <!-- Botón nueva solicitud -->
                <Button variant="primary" @click="openNewRequestModal">
                    <template #icon>
                        <Plus :size="18" />
                    </template>
                    Nueva Solicitud
                </Button>
            </div>
        </div>

        <!-- Contenedores principales -->
        <div class="flex-1 flex min-h-0 gap-4">
            <!-- Bandeja de mis solicitudes -->
            <div class="flex w-1/3 flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 class="text-lg font-semibold text-gray-900">Mis Solicitudes</h2>
                    <p class="text-sm text-gray-600 mt-1">{{ filteredRequests.length }} solicitudes</p>
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
                        <p class="text-gray-500">No hay solicitudes</p>
                        <p class="text-sm text-gray-400 mt-1">Crea tu primera solicitud</p>
                    </div>

                    <!-- Lista de solicitudes -->
                    <div v-else class="divide-y divide-gray-100">
                        <div v-for="request in filteredRequests" :key="request.id" @click="selectRequest(request)"
                            :class="[
                                'px-6 py-4 cursor-pointer transition-all duration-150',
                                selectedRequest?.id === request.id
                                    ? 'bg-primary-50 border-l-6 border-l-primary-500'
                                    : 'hover:bg-gray-50 border-l-6 border-l-transparent'
                            ]">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <h3 class="font-semibold text-gray-900">{{ getRequestTypeLabel(request.type) }}
                                        </h3>
                                    </div>
                                    <div class="flex items-center gap-2 mt-2">
                                        <Calendar :size="14" class="text-gray-400" />
                                        <span class="text-sm text-gray-600">{{ formatDate(request.date) }}</span>
                                    </div>
                                    <div class="mt-2">
                                        <span :class="[
                                            'inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium',
                                            getStatusColor(request.status)
                                        ]">
                                            {{ getStatusLabel(request.status) }}
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
            <div class="flex w-full flex-col bg-white border border-gray-200 rounded-sm overflow-hidden">
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
                        <!-- Estado de la solicitud -->
                        <div class="flex items-center justify-between">
                            <span :class="[
                                'inline-flex items-center px-3 py-1.5 rounded-sm text-sm font-medium',
                                getStatusColor(selectedRequest.status)
                            ]">
                                {{ getStatusLabel(selectedRequest.status) }}
                            </span>
                            <Button v-if="selectedRequest.status === 'pending'" variant="danger" size="sm"
                                @click="cancelRequest">
                                <template #icon>
                                    <X :size="16" />
                                </template>
                                Cancelar Solicitud
                            </Button>
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

                        <!-- Respuesta del administrador (si existe) -->
                        <div v-if="selectedRequest.response" class="space-y-2">
                            <div class="border-t border-gray-200"></div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Respuesta del
                                Administrador</label>
                            <div class="bg-blue-50 border border-blue-200 rounded-sm p-4">
                                <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{{
                                    selectedRequest.response }}</p>
                                <div class="flex items-center gap-2 mt-3 text-xs text-gray-500">
                                    <Calendar :size="12" />
                                    <span>{{ formatDate(selectedRequest.responseDate) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de nueva solicitud -->
        <div v-if="showNewRequestModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click.self="closeNewRequestModal">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900">Nueva Solicitud</h2>
                </div>

                <div class="p-6 space-y-4">
                    <!-- Tipo de solicitud -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Solicitud *</label>
                        <Select id="new-request-type" v-model="newRequest.type" :options="requestTypes"
                            placeholder="Selecciona un tipo">
                        </Select>
                    </div>

                    <!-- Materia (opcional) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Materia</label>
                        <input type="text" v-model="newRequest.subject"
                            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Ej: Cálculo Diferencial" />
                    </div>

                    <!-- Código de grupo (opcional) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Código de Grupo</label>
                        <input type="text" v-model="newRequest.groupCode"
                            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Ej: A1" />
                    </div>

                    <!-- Fechas solicitadas (opcional) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fechas Solicitadas</label>
                        <input type="text" v-model="newRequest.requestedDates"
                            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Ej: 15-20 de Octubre, 2025" />
                    </div>

                    <!-- Comentario -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Comentario *</label>
                        <textarea v-model="newRequest.comment" rows="5"
                            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            placeholder="Describe tu solicitud en detalle..."></textarea>
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <Button variant="secondary" @click="closeNewRequestModal">
                        Cancelar
                    </Button>
                    <Button variant="primary" @click="submitNewRequest" :disabled="!isNewRequestValid">
                        <template #icon>
                            <Send :size="18" />
                        </template>
                        Enviar Solicitud
                    </Button>
                </div>
            </div>
        </div>

        <!-- Modal de confirmación para cancelar -->
        <ConfirmationModal :is-visible="showConfirmModal" :title="confirmModalTitle" :message="confirmModalMessage"
            :confirm-text="confirmModalConfirmText" :confirm-variant="confirmModalVariant"
            @confirm="handleConfirmCancel" @cancel="closeConfirmModal" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar, ChevronRight, FileText, Inbox, X, RefreshCw, Plus, Send } from 'lucide-vue-next'
import Search from '@/components/ui/base/BaseSearch.vue'
import Select from '@/components/ui/base/BaseSelect.vue'
import Button from '@/components/ui/base/BaseButton.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'

// Estado reactivo
const searchTerm = ref('')
const selectedTypeFilter = ref('')
const selectedStatusFilter = ref('')
const selectedRequest = ref(null)
const isLoading = ref(false)
const isRefreshing = ref(false)
const showNewRequestModal = ref(false)
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmModalConfirmText = ref('')
const confirmModalVariant = ref('primary')

// Datos del nuevo request
const newRequest = ref({
    type: '',
    subject: '',
    groupCode: '',
    requestedDates: '',
    comment: ''
})

// Tipos de solicitudes
const requestTypes = [
    { value: 'schedule_change', label: 'Cambio de Horario' },
    { value: 'absence', label: 'Permiso de Ausencia' },
    { value: 'group_assignment', label: 'Asignación de Grupo' },
    { value: 'availability_update', label: 'Actualización de Disponibilidad' },
    { value: 'other', label: 'Otro' }
]

const requestTypeFilterOptions = computed(() => [
    { label: 'Todos los tipos', value: '' },
    ...requestTypes
])

// Tipos de estados
const statusTypes = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'accepted', label: 'Aceptada' },
    { value: 'rejected', label: 'Rechazada' },
    { value: 'cancelled', label: 'Cancelada' }
]

const statusFilterOptions = computed(() => [
    { label: 'Todos los estados', value: '' },
    ...statusTypes
])

// Mock data - Solicitudes del profesor (simulando datos del profesor logueado)
const myRequests = ref([
    {
        id: 1,
        date: '2025-11-01T14:30:00',
        type: 'schedule_change',
        subject: 'Cálculo Diferencial',
        groupCode: 'A1',
        requestedDates: '15-20 de Noviembre, 2025',
        comment: 'Solicito cambio de horario del grupo A1 debido a compromisos académicos en otra institución. Propongo mover las clases de lunes y miércoles a martes y jueves en el mismo horario.',
        status: 'pending',
        response: null,
        responseDate: null
    },
    {
        id: 2,
        date: '2025-10-28T10:15:00',
        type: 'absence',
        subject: 'Álgebra Lineal',
        groupCode: 'B2',
        requestedDates: '5-7 de Noviembre, 2025',
        comment: 'Necesito permiso de ausencia por participación en conferencia internacional de matemáticas en Bogotá. He coordinado con el profesor sustituto para cubrir mis clases.',
        status: 'accepted',
        response: 'Solicitud aprobada. Por favor, coordina con el profesor sustituto y envía el cronograma de recuperación.',
        responseDate: '2025-10-29T09:00:00'
    },
    {
        id: 3,
        date: '2025-10-25T16:45:00',
        type: 'group_assignment',
        subject: 'Programación Orientada a Objetos',
        groupCode: null,
        requestedDates: null,
        comment: 'Solicito ser asignado al grupo C3 de Programación Orientada a Objetos. Tengo experiencia previa con este curso y disponibilidad en el horario propuesto.',
        status: 'rejected',
        response: 'Lo sentimos, el grupo C3 ya tiene un profesor asignado. Te notificaremos si hay cambios en la asignación.',
        responseDate: '2025-10-26T11:30:00'
    },
    {
        id: 4,
        date: '2025-10-20T09:20:00',
        type: 'availability_update',
        subject: null,
        groupCode: null,
        requestedDates: 'Semestre 2025-2',
        comment: 'Actualización de disponibilidad para el próximo semestre. A partir de diciembre tendré disponibilidad completa los días lunes, miércoles y viernes de 8:00 AM a 6:00 PM.',
        status: 'accepted',
        response: 'Disponibilidad actualizada correctamente en el sistema. Se tomará en cuenta para la asignación del próximo semestre.',
        responseDate: '2025-10-21T08:15:00'
    },
    {
        id: 5,
        date: '2025-10-15T11:30:00',
        type: 'other',
        subject: 'Ecuaciones Diferenciales',
        groupCode: 'D4',
        requestedDates: null,
        comment: 'Solicito autorización para realizar salida de campo con los estudiantes al laboratorio de investigación externo. La actividad está relacionada con el proyecto final del curso.',
        status: 'pending',
        response: null,
        responseDate: null
    }
])

// Solicitudes filtradas
const filteredRequests = computed(() => {
    let requests = myRequests.value

    // Filtrar por término de búsqueda
    if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase()
        requests = requests.filter(request =>
            request.comment.toLowerCase().includes(term) ||
            (request.subject && request.subject.toLowerCase().includes(term)) ||
            (request.groupCode && request.groupCode.toLowerCase().includes(term)) ||
            getRequestTypeLabel(request.type).toLowerCase().includes(term)
        )
    }

    // Filtrar por tipo de solicitud
    if (selectedTypeFilter.value) {
        requests = requests.filter(request => request.type === selectedTypeFilter.value)
    }

    // Filtrar por estado
    if (selectedStatusFilter.value) {
        requests = requests.filter(request => request.status === selectedStatusFilter.value)
    }

    // Ordenar por fecha (más reciente primero)
    return requests.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Validación del nuevo request
const isNewRequestValid = computed(() => {
    return newRequest.value.type && newRequest.value.comment.trim().length > 0
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
        schedule_change: 'bg-info-500 text-white',
        absence: 'bg-danger-500 text-white',
        group_assignment: 'bg-yellow-500 text-white',
        availability_update: 'bg-orange-500 text-white',
        other: 'bg-gray-500 text-white'
    }
    return colors[type] || 'bg-gray-500 text-white'
}

const getStatusLabel = (status) => {
    const statusObj = statusTypes.find(s => s.value === status)
    return statusObj ? statusObj.label : 'Desconocido'
}

const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
        accepted: 'bg-green-100 text-green-800 border border-green-300',
        rejected: 'bg-red-100 text-red-800 border border-red-300',
        cancelled: 'bg-gray-100 text-gray-800 border border-gray-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-300'
}

const openNewRequestModal = () => {
    showNewRequestModal.value = true
}

const closeNewRequestModal = () => {
    showNewRequestModal.value = false
    // Reset form
    newRequest.value = {
        type: '',
        subject: '',
        groupCode: '',
        requestedDates: '',
        comment: ''
    }
}

const submitNewRequest = () => {
    if (!isNewRequestValid.value) return

    // Crear nueva solicitud
    const newRequestData = {
        id: myRequests.value.length + 1,
        date: new Date().toISOString(),
        type: newRequest.value.type,
        subject: newRequest.value.subject || null,
        groupCode: newRequest.value.groupCode || null,
        requestedDates: newRequest.value.requestedDates || null,
        comment: newRequest.value.comment,
        status: 'pending',
        response: null,
        responseDate: null
    }

    myRequests.value.unshift(newRequestData)
    selectedRequest.value = newRequestData

    console.log('Nueva solicitud creada:', newRequestData)
    closeNewRequestModal()
}

const cancelRequest = () => {
    if (!selectedRequest.value || selectedRequest.value.status !== 'pending') return

    confirmModalTitle.value = 'Cancelar Solicitud'
    confirmModalMessage.value = '¿Estás seguro de que deseas <strong>cancelar</strong> esta solicitud? Esta acción no se puede deshacer.'
    confirmModalConfirmText.value = 'Cancelar Solicitud'
    confirmModalVariant.value = 'danger'
    showConfirmModal.value = true
}

const handleConfirmCancel = () => {
    if (selectedRequest.value) {
        selectedRequest.value.status = 'cancelled'
        console.log('Solicitud cancelada:', selectedRequest.value)
    }
    closeConfirmModal()
}

const closeConfirmModal = () => {
    showConfirmModal.value = false
    confirmModalTitle.value = ''
    confirmModalMessage.value = ''
    confirmModalConfirmText.value = ''
    confirmModalVariant.value = 'primary'
}
</script>

<style scoped></style>
