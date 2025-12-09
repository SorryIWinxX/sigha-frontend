<template>
    <div class="h-full flex flex-col">
        <!-- Barra de acciones superior -->
        <div class="flex justify-between pt-2 items-center mb-4">
            <div class="flex items-center  h-15 gap-4 w-2/3">

                <Search v-model="searchTerm" placeholder="Buscar grupos..." />

                <!-- Filtro por materia -->
                <BaseMultiSelect :options="subjectOptions" v-model="selectedSubjectFilter"
                    placeholder="Filtrar por materias" searchPlaceholder="Buscar materias..." />
            </div>

            <div class="flex items-center gap-2">
                <!-- Botón refrescar -->
                <Button variant="secondary" @click="refreshTable" :disabled="isRefreshing">
                    <template #icon>
                        <RefreshCw :size="18" :class="{ 'animate-spin': isRefreshing }" />
                    </template>
                    Refrescar
                </Button>

                <!-- Botón crear -->
                <Button variant="primary" @click="groupsStore.openCreateModal()">
                    <template #icon>
                        <Plus :size="18" />
                    </template>
                    Crear grupo
                </Button>
            </div>
        </div>

        <!-- Tabla de grupos -->
        <div class="flex-1 min-h-0">
            <div class="w-full bg-white">
                <div class="overflow-hidden border border-gray-200 rounded-sm">
                    <table class="w-full">
                        <thead class="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left">
                                    <span class="text-gray-900 font-semibold">Código</span>
                                </th>
                                <th class="px-6 py-3 text-left">
                                    <span class="text-gray-900 font-semibold">Materia</span>
                                </th>
                                <th class="px-6 py-3 text-left">
                                    <span class="text-gray-900 font-semibold">Horarios</span>
                                </th>
                                <th class="px-6 py-3 text-center">
                                    <span class="text-gray-900 font-semibold">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <!-- Loading state -->
                            <tr v-if="groupsStore.isLoading">
                                <td colspan="4" class="px-6 py-8 text-center">
                                    <div class="flex items-center justify-center">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600">
                                        </div>
                                        <span class="ml-3 text-gray-600">Cargando grupos...</span>
                                    </div>
                                </td>
                            </tr>
                            <!-- Refreshing state -->
                            <tr v-else-if="isRefreshing">
                                <td colspan="4" class="px-6 py-8 text-center">
                                    <div class="flex items-center justify-center">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600">
                                        </div>
                                        <span class="ml-3 text-gray-600">Actualizando tabla...</span>
                                    </div>
                                </td>
                            </tr>
                            <!-- Error state -->
                            <tr v-else-if="groupsStore.hasError && groupsStore.getAllGroups.length === 0">
                                <td colspan="4" class="px-6 py-8 text-center">
                                    <div class="text-red-600">
                                        <p class="font-semibold">Error al cargar grupos</p>
                                        <p class="text-sm mt-1">{{ groupsStore.getError }}</p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Empty state -->
                            <tr v-else-if="!groupsStore.isLoading && paginatedGroups.length === 0">
                                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                                    <span v-if="searchTerm || selectedSubjectFilter">
                                        No se encontraron grupos con los filtros aplicados
                                    </span>
                                    <span v-else>
                                        No hay grupos para mostrar
                                    </span>
                                </td>
                            </tr>
                            <!-- Group rows -->
                            <tr v-else v-for="(group, index) in paginatedGroups" :key="group.id" :class="[
                                'border-b border-gray-100 hover:bg-gray-50',
                                { 'bg-gray-50/30': index % 2 === 0 },
                                { 'border-b-0': index === paginatedGroups.length - 1 }
                            ]">
                                <td class="px-6 py-3">
                                    <span class="text-gray-900 font-medium">{{ group.code }}</span>
                                </td>
                                <td class="px-6 py-3">
                                    <span class="text-gray-600">{{ getSubjectName(group.idSubject) }}</span>
                                </td>
                                <td class="px-6 py-3">
                                    <span class="text-gray-500">{{ groupsStore.formatSchedule(group) }}</span>
                                </td>
                                <td class="px-6 py-3">
                                    <div class="relative flex items-center justify-center">
                                        <button @click="toggleDropdown(group.id)"
                                            class="h-9 w-9 p-0 border border-gray-200 text-gray-500 cursor-pointer hover:text-white hover:border-white rounded-sm flex items-center justify-center hover:bg-[#67b83c] hover:border-gray-300">
                                            <MoreHorizontal class="h-4 w-4 transition-colors duration-200" />
                                        </button>
                                        <div v-if="openDropdown === group.id" :class="[
                                            'absolute z-50 w-48 bg-white rounded-sm border border-gray-200 shadow-lg overflow-hidden',
                                            index >= paginatedGroups.length - 2 ? 'bottom-10 right-0' : 'top-10 right-0'
                                        ]">
                                            <div class="py-1">
                                                <button
                                                    @click.stop="groupsStore.openEditModal(group); openDropdown = null"
                                                    class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 cursor-pointer last:border-b-0">
                                                    Editar grupo
                                                </button>
                                                <button @click.stop="openDeleteModal(group)"
                                                    class="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer">
                                                    Eliminar grupo
                                                </button>
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

        <!-- Pagination -->
        <div v-if="!groupsStore.isLoading && filteredGroups.length > 0"
            class="flex items-center justify-between mt-6 p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <div class="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <span>Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, totalGroups) }} de {{ totalGroups }}
                    grupos</span>
                <span class="mx-2">|</span>
                <span>Mostrar</span>
                <Select :modelValue="itemsPerPage" @update:modelValue="handleItemsPerPageChange" id="itemsPerPage"
                    :options="itemsPerPageOptions" :searchable="false">
                </Select>
                <span>por página</span>
            </div>
            <div class="flex items-center space-x-1">
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" :class="[
                    'px-3 py-2 text-sm border rounded-sm flex items-center font-medium transition-all duration-200',
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                ]">
                    <ChevronLeft class="w-4 h-4 mr-1" />
                    Anterior
                </button>

                <div class="flex space-x-1">
                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                        'px-3 py-2 text-sm border rounded-sm font-medium transition-all duration-200 min-w-[40px] flex items-center justify-center',
                        page === currentPage
                            ? 'text-white border-transparent'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    ]" :style="page === currentPage ? { backgroundColor: '#67b83c' } : {}">
                        {{ page }}
                    </button>
                </div>

                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" :class="[
                    'px-3 py-2 text-sm border rounded-sm flex items-center font-medium transition-all duration-200',
                    currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                ]">
                    Siguiente
                    <ChevronRight class="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>

        <!-- New Group Modal -->
        <GroupModal :is-visible="groupsStore.isModalOpen" :mode="groupsStore.getModalMode"
            :edit-data="groupsStore.getEditingGroup" @close="groupsStore.closeModal()" @submit="handleModalSubmit" />

        <!-- Modal de confirmación de eliminación -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-sm">
                <h3 class="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
                <p class="text-gray-600 mb-6">
                    ¿Estás seguro de que deseas eliminar el grupo <strong>{{ groupToDelete?.code }}</strong>?
                </p>
                <div class="flex justify-end gap-2">
                    <button @click="closeDeleteModal"
                        class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button @click="confirmDelete" :disabled="isDeleting"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                        {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Plus, Edit2, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-vue-next'
import { useGroupsStore } from '@/store/groupsStore'
import { useAreasStore } from '@/store/areasStore'
import { useSemesterStore } from '@/store/semesterStore'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import Search from '@/components/ui/base/BaseSearch.vue'
import BaseMultiSelect from '@/components/ui/base/BaseMultiSelect.vue'
import Button from '@/components/ui/base/BaseButton.vue'
import GroupModal from '@/components/groups/GroupModal.vue'

// Props
const props = defineProps({
    semesterId: {
        type: Number,
        default: null
    }
})

// Stores
const groupsStore = useGroupsStore()
const areasStore = useAreasStore()
const semesterStore = useSemesterStore()

// Estado reactivo
const searchTerm = ref('')
const selectedSubjectFilter = ref([])
const showDeleteModal = ref(false)
const groupToDelete = ref(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const isRefreshing = ref(false)
const openDropdown = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const itemsPerPageOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '100', value: 100 }
]

// No longer needed - handled by NewGroupModal

// Materias disponibles (todas las materias de todas las áreas)
const availableSubjects = computed(() => {
    const subjects = []
    areasStore.getAllAreas.forEach(area => {
        area.subjectList.forEach(subject => {
            subjects.push(subject)
        })
    })
    return subjects
})

// Opciones para el BaseMultiSelect de filtro por materia
const subjectOptions = computed(() => {
    return availableSubjects.value.map(subject => `${subject.code} - ${subject.name}`)
})

// Mapa para convertir de texto seleccionado a ID de materia
const subjectTextToIdMap = computed(() => {
    const map = new Map()
    availableSubjects.value.forEach(subject => {
        map.set(`${subject.code} - ${subject.name}`, subject.id)
    })
    return map
})

// IDs de las materias seleccionadas
const selectedSubjectIds = computed(() => {
    return selectedSubjectFilter.value.map(text => subjectTextToIdMap.value.get(text)).filter(id => id !== undefined)
})

// Función para obtener el nombre de la materia
const getSubjectName = (subjectId) => {
    for (const area of areasStore.getAllAreas) {
        const subject = area.subjectList.find(s => s.id === subjectId)
        if (subject) return subject.name
    }
    return 'Materia desconocida'
}

// Grupos filtrados
const filteredGroups = computed(() => {
    let groups = groupsStore.getAllGroups

    // Filtrar por término de búsqueda
    if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase()
        groups = groups.filter(group => {
            const subjectName = getSubjectName(group.idSubject).toLowerCase()
            return group.code.toLowerCase().includes(term) ||
                subjectName.includes(term)
        })
    }

    // Filtrar por materias seleccionadas (múltiple)
    if (selectedSubjectIds.value.length > 0) {
        groups = groups.filter(group =>
            selectedSubjectIds.value.includes(group.idSubject)
        )
    }

    return groups
})

// Pagination computed properties
const totalGroups = computed(() => filteredGroups.value.length)
const totalPages = computed(() => Math.ceil(totalGroups.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const paginatedGroups = computed(() => {
    return filteredGroups.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

// Pagination methods
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const handleItemsPerPageChange = (value) => {
    itemsPerPage.value = parseInt(value)
    currentPage.value = 1 // Reset to first page when changing items per page
}

// Dropdown methods
const toggleDropdown = (groupId) => {
    openDropdown.value = openDropdown.value === groupId ? null : groupId
}

const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
        openDropdown.value = null
    }
}

// Función auxiliar para refrescar la tabla
const refreshTable = async () => {
    isRefreshing.value = true
    try {
        const currentSemesterId = props.semesterId || semesterStore.currentSemester?.id
        if (currentSemesterId) {
            await groupsStore.fetchGroups(currentSemesterId)
        }
    } catch (error) {
        console.error('Error refrescando tabla:', error)
        showErrorToast('Error al actualizar la tabla')
    } finally {
        isRefreshing.value = false
    }
}

// Funciones del modal de eliminación
const openDeleteModal = (group) => {
    groupToDelete.value = group
    showDeleteModal.value = true
    openDropdown.value = null
}

const closeDeleteModal = () => {
    showDeleteModal.value = false
    groupToDelete.value = null
}

const confirmDelete = async () => {
    if (!groupToDelete.value) return

    isDeleting.value = true
    try {
        await groupsStore.deleteGroup(groupToDelete.value.id)

        // Refrescar la tabla después de eliminar
        await refreshTable()

        showSuccessToast(`Grupo ${groupToDelete.value.code} eliminado exitosamente`)
        closeDeleteModal()
    } catch (error) {
        console.error('Error eliminando grupo:', error)
        showErrorToast('Error al eliminar el grupo. Por favor intenta de nuevo.')
    } finally {
        isDeleting.value = false
    }
}

// Manejo del formulario del modal
const handleModalSubmit = async (groupData) => {
    isSubmitting.value = true

    try {
        if (groupsStore.getModalMode === 'create') {
            await groupsStore.createGroup(groupData)
            showSuccessToast(`Grupo ${groupData.code} creado exitosamente`)
        } else {
            await groupsStore.updateGroup(groupsStore.getEditingGroup.id, groupData)
            showSuccessToast(`Grupo ${groupData.code} actualizado exitosamente`)
        }

        // Refrescar la tabla después de crear/editar
        await refreshTable()

        groupsStore.closeModal()
    } catch (error) {
        console.error('Error creating group:', error)

        let errorMessage = error?.message || 'Error desconocido al crear grupo'

        // Intentar limpiar el mensaje si viene del servicio
        if (errorMessage.includes('HTTP error!') && errorMessage.includes('message:')) {
            try {
                const parts = errorMessage.split('message:')
                const content = parts[1].trim()
                // Intentar parsear si es JSON
                if (content.startsWith('{')) {
                    const parsed = JSON.parse(content)
                    if (parsed.message) {
                        errorMessage = parsed.message
                    }
                } else {
                    errorMessage = content
                }
            } catch (e) {
                // Si falla, usar el mensaje original
            }
        }

        showErrorToast(errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

// Watch for filter changes to reset pagination
watch([searchTerm, selectedSubjectFilter], () => {
    currentPage.value = 1
})

// Cargar datos iniciales
onMounted(async () => {
    document.addEventListener('click', handleClickOutside)

    try {
        // Cargar áreas si no están cargadas
        if (!areasStore.isLoaded) {
            await areasStore.fetchAreas()
        }

        // Cargar grupos para el semestre actual
        const currentSemesterId = props.semesterId || semesterStore.currentSemester?.id
        if (currentSemesterId) {
            await groupsStore.fetchGroups(currentSemesterId)
        }
    } catch (error) {
        console.error('Error cargando datos:', error)
    }
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// Recargar grupos cuando cambie el semestre (prop o store)
watch([() => props.semesterId, () => semesterStore.currentSemester], async ([newSemesterId, newSemester]) => {
    const semesterId = newSemesterId || newSemester?.id
    if (semesterId) {
        try {
            await groupsStore.fetchGroups(semesterId)
            currentPage.value = 1 // Reset pagination when changing semester
        } catch (error) {
            console.error('Error cargando grupos para el semestre:', error)
        }
    }
}, { deep: true })
</script>
