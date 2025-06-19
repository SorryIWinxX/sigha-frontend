<template>
    <div class="bg-gray-50 h-[calc(100vh-20vh)] flex flex-col">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200">
            <div class="flex gap-4 items-center">
                <Search v-model="searchQuery" />
                <Button
                    customClass="px-4 py-2.5 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                    <Filter class="w-4 h-4" />
                    Filtros
                </Button>
                <Button customClass="bg-[#67b83c] w-40 text-white py-2.5 px-4" @click="addNewAreaRow">
                    <template #icon>
                        <Plus :size="20" />
                    </template>
                    Crear area
                </Button>
            </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-auto px-6 py-6">
            <!-- Indicador de carga -->
            <div v-if="isLoading && areas.length === 0" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#67B83C]"></div>
                <p class="mt-4 text-gray-500">Cargando áreas...</p>
            </div>

            <!-- Fila para crear nueva área -->
            <div v-if="isCreating" class="bg-white rounded-lg border border-gray-200 mb-4 p-6">
                <div class="flex items-center gap-4">
                    <input v-model="newArea.description" type="text" placeholder="Ej: MATEMÁTICAS COMPUTACIONALES"
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#67B83C] focus:border-transparent"
                        @keyup.enter="saveNewArea" @keyup.escape="cancelCreate">
                    <div class="flex gap-2">
                        <button @click="saveNewArea"
                            class="px-4 py-2 text-sm font-medium text-white rounded-sm transition-colors duration-200 flex items-center gap-2"
                            :disabled="!canSaveNew || isSaving"
                            :class="(canSaveNew && !isSaving) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'">
                            <div v-if="isSaving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white">
                            </div>
                            {{ isSaving ? 'Guardando...' : 'Guardar' }}
                        </button>
                        <button @click="cancelCreate"
                            class="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-sm hover:bg-gray-600 transition-colors duration-200">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Áreas -->
            <div class="space-y-4">
                <div v-for="area in filteredAreas" :key="area.id"
                    class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <!-- Header del área -->
                    <div class="p-6">
                        <div class="flex items-center justify-between" v-if="editingId !== area.id">
                            <div class="flex items-center gap-4 flex-1">
                                <button @click="toggleArea(area.id || 0)"
                                    class="p-1 hover:bg-gray-100 rounded-sm transition-colors duration-200">
                                    <svg class="w-5 h-5 text-gray-500 transition-transform duration-200"
                                        :class="{ 'rotate-90': expandedAreas.has(area.id || 0) }" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5l7 7-7 7">
                                        </path>
                                    </svg>
                                </button>

                                <div class="flex-1">
                                    <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ area.description }}</h3>
                                    <p class="text-sm text-gray-600">{{ getAreaSubtitle(area.description) }}</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-6">
                                <div class="flex gap-4">
                                    <span
                                        class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
                                        {{ getSubjectsCount(area.id || 0) }} materias
                                    </span>
                                </div>

                                <div class="relative">
                                    <button @click="toggleDropdown(area.id || 0)"
                                        class="h-9 w-9 p-0 border border-gray-200 text-gray-500 cursor-pointer hover:text-white hover:border-gray-300 rounded-sm flex items-center justify-center hover:bg-[#67b83c] transition-colors duration-200">
                                        <MoreHorizontal class="h-4 w-4" />
                                    </button>
                                    <div v-if="openDropdown === (area.id || 0)"
                                        class="absolute z-50 w-32 bg-white rounded-sm border border-gray-200 shadow-lg overflow-hidden top-10 right-0">
                                        <div class="flex">
                                            <button @click="startEdit(area)"
                                                class="flex items-center justify-center flex-1 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-r border-gray-100 cursor-pointer">
                                                <Edit class="h-5 w-5 text-gray-900" />
                                            </button>
                                            <button @click="deleteArea(area.id || 0)"
                                                class="flex items-center justify-center flex-1 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer">
                                                <Trash2 class="h-5 w-5 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Modo edición -->
                        <div v-if="editingId === area.id" class="flex items-center gap-4">
                            <input v-model="editForm.description" type="text"
                                class="flex-1 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#67B83C] focus:border-transparent"
                                @keyup.enter="saveEdit" @keyup.escape="cancelEdit">
                            <div class="flex gap-2">
                                <button @click="saveEdit"
                                    class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-sm hover:bg-green-700 transition-colors duration-200">
                                    Guardar
                                </button>
                                <button @click="cancelEdit"
                                    class="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-sm hover:bg-gray-600 transition-colors duration-200">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Materias expandidas -->
                    <div v-if="expandedAreas.has(area.id || 0)" class="border-t border-gray-200 bg-gray-50">
                        <div class="p-6">
                            <div class="space-y-3">
                                <div v-for="subject in getSubjectsByArea(area.id || 0)" :key="subject.id"
                                    class="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                                    <div class="flex items-center gap-4">
                                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">{{ subject.name }}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estado vacío -->
            <div v-if="areas.length === 0 && !isCreating && !isLoading"
                class="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div class="text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                        </path>
                    </svg>
                    <p class="text-lg font-medium text-gray-900 mb-1">No hay áreas configuradas</p>
                    <p class="text-gray-600">Haz clic en "Crear Área" para agregar una nueva área de estudio.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { MoreHorizontal, Edit, Trash2, Filter, Plus } from 'lucide-vue-next'
import { AreasService, type Area, type Subject } from '@/services/areasService'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import Search from '@/components/common/Search.vue'
import Button from '@/components/common/Button.vue'

// Instanciar el servicio
const areasService = new AreasService()

// Estado reactivo
const areas = ref<Area[]>([])
const isLoading = ref(false)
const isCreating = ref(false)
const isSaving = ref(false)
const editingId = ref<number | null>(null)
const openDropdown = ref<number | null>(null)
const expandedAreas = ref<Set<number>>(new Set())
const searchQuery = ref('')

const newArea = reactive({
    description: '',
    subjectList: [] as Subject[]
})

const editForm = reactive({
    description: '',
    subjectList: [] as Subject[]
})

// Computed properties
const canSaveNew = computed(() => {
    return newArea.description.trim()
})

const filteredAreas = computed(() => {
    if (!searchQuery.value.trim()) {
        return areas.value
    }

    const query = searchQuery.value.toLowerCase()
    return areas.value.filter(area => {
        const areaMatches = area.description.toLowerCase().includes(query)
        const subjectMatches = area.subjectList.some(subject =>
            subject.name.toLowerCase().includes(query)
        )
        return areaMatches || subjectMatches
    })
})

// Funciones para materias
const getSubjectsByArea = (areaId: number): Subject[] => {
    const area = areas.value.find(area => area.id === areaId)
    return area?.subjectList || []
}

const getSubjectsCount = (areaId: number): number => {
    const area = areas.value.find(area => area.id === areaId)
    return area?.subjectList.length || 0
}

const getAreaSubtitle = (description: string): string => {
    if (description.toLowerCase().includes('matemáticas') || description.toLowerCase().includes('matematicas')) {
        return 'Fundamentos matemáticos para la computación'
    } else if (description.toLowerCase().includes('arquitectura') || description.toLowerCase().includes('computador')) {
        return 'Hardware y arquitectura de sistemas'
    } else if (description.toLowerCase().includes('software')) {
        return 'Desarrollo y gestión de software'
    }
    return 'Área de conocimiento especializado'
}

// Función para expandir/colapsar áreas
const toggleArea = (areaId: number) => {
    if (expandedAreas.value.has(areaId)) {
        expandedAreas.value.delete(areaId)
    } else {
        expandedAreas.value.add(areaId)
    }
}

// Cargar áreas al montar el componente
const loadAreas = async () => {
    isLoading.value = true
    try {
        areas.value = await areasService.getAreas()
    } catch (error) {
        console.error('Error loading areas:', error)
        showErrorToast('Error al cargar las áreas')
    } finally {
        isLoading.value = false
    }
}

// Funciones para crear
const addNewAreaRow = () => {
    if (editingId.value) {
        cancelEdit()
    }
    resetNewArea()
    isCreating.value = true
}

const saveNewArea = async () => {
    if (!canSaveNew.value || isSaving.value) return

    const areaData = {
        description: newArea.description.trim(),
        subjectList: newArea.subjectList
    }

    isSaving.value = true
    try {
        await areasService.createArea(areaData)
        await loadAreas()
        showSuccessToast('Área creada exitosamente')
        cancelCreate()
    } catch (error) {
        console.error('Error creating area:', error)
        showErrorToast('Error al crear el área')
    } finally {
        isSaving.value = false
    }
}

const cancelCreate = () => {
    isCreating.value = false
    resetNewArea()
}

const resetNewArea = () => {
    newArea.description = ''
    newArea.subjectList = []
}

// Funciones para editar
const startEdit = (area: Area) => {
    if (isCreating.value) {
        cancelCreate()
    }
    closeDropdown()
    editingId.value = area.id || null
    editForm.description = area.description
    editForm.subjectList = [...area.subjectList]
}

const saveEdit = async () => {
    if (!editingId.value) return

    const updateData = {
        description: editForm.description.trim(),
        subjectList: editForm.subjectList
    }

    try {
        await areasService.updateArea(editingId.value, updateData)
        await loadAreas()
        showSuccessToast('Área actualizada exitosamente')
        cancelEdit()
    } catch (error) {
        console.error('Error updating area:', error)
        showErrorToast('Error al actualizar el área')
    }
}

const cancelEdit = () => {
    editingId.value = null
    editForm.description = ''
    editForm.subjectList = []
}

// Funciones del dropdown
const toggleDropdown = (areaId: number) => {
    openDropdown.value = openDropdown.value === areaId ? null : areaId
}

const closeDropdown = () => {
    openDropdown.value = null
}

// Función para eliminar
const deleteArea = (id: number) => {
    closeDropdown()
    alert('La función de eliminar no está disponible para áreas.')
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
    if (!event.target || !(event.target as Element).closest('.relative')) {
        openDropdown.value = null
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    loadAreas()
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped></style>