<template>
    <div class="bg-gray-50 h-[calc(100vh-20vh)] flex flex-col">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200">
            <div class="flex gap-4 items-center">
                <Search v-model="searchQuery" />
                <Button
                    customClass="px-4 py-2.5 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                    @click="toggleFilters">
                    <Filter class="w-4 h-4" />
                    Filtros
                    <span v-if="activeFiltersCount > 0" class="ml-1 bg-[#67b83c] text-white text-xs rounded-full px-2 py-0.5">
                        {{ activeFiltersCount }}
                    </span>
                </Button>
                <Button customClass="bg-[#67b83c] w-40 text-white py-2.5 px-4" @click="addNewAreaRow">
                    <template #icon>
                        <Plus :size="20" />
                    </template>
                    Crear area
                </Button>
            </div>
            
            <!-- Filter Panel -->
            <div v-if="showFilters" class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-sm">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Filter by subject count -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad de materias</label>
                        <Select v-model="filters.subjectCount" @change="applyFilters">
                            <option value="">Todas</option>
                            <option value="0">Sin materias</option>
                            <option value="1-5">1-5 materias</option>
                            <option value="6-10">6-10 materias</option>
                            <option value="11+">Más de 10 materias</option>
                        </Select>
                    </div>
                    
                    <!-- Filter by subject level -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nivel de materias</label>
                        <Select v-model="filters.subjectLevel" @change="applyFilters">
                            <option value="">Todos los niveles</option>
                            <option value="1">Nivel 1</option>
                            <option value="2">Nivel 2</option>
                            <option value="3">Nivel 3</option>
                            <option value="4">Nivel 4</option>
                            <option value="5">Nivel 5</option>
                        </Select>
                    </div>
                    
                    <!-- Filter by area type -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de área</label>
                        <Select v-model="filters.areaType" @change="applyFilters">
                            <option value="">Todos los tipos</option>
                            <option value="matematicas">Matemáticas</option>
                            <option value="arquitectura">Arquitectura/Hardware</option>
                            <option value="software">Software</option>
                            <option value="other">Otros</option>
                        </Select>
                    </div>
                </div>
                
                <div class="mt-4 flex gap-2">
                    <Button 
                        customClass="px-4 py-2 bg-[#67b83c] text-white text-sm rounded-sm hover:bg-[#5ba632] transition-colors"
                        @click="clearFilters">
                        Limpiar filtros
                    </Button>
                    <span class="text-sm text-gray-600 flex items-center">
                        Mostrando {{ filteredAreas.length }} de {{ areas.length }} áreas
                    </span>
                </div>
            </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-auto px-6 py-6">
            <!-- Search results info -->
            <div v-if="searchQuery.trim() || (!searchQuery.trim() && hasActiveFilters)" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-blue-800">
                        <span v-if="searchQuery.trim()">
                            Buscando "<strong>{{ searchQuery }}</strong>" en nombres de áreas, asignaturas y códigos
                            - {{ filteredAreas.length }} área(s) encontrada(s)
                        </span>
                        <span v-if="!searchQuery.trim() && hasActiveFilters">
                            Filtros aplicados - {{ filteredAreas.length }} área(s) encontrada(s)
                        </span>
                    </div>
                    <Button 
                        customClass="text-xs px-2 py-1 text-blue-600 hover:text-blue-800"
                        @click="clearSearchAndFilters">
                        Limpiar
                    </Button>
                </div>
            </div>

            <!-- Indicador de carga -->
            <div v-if="isLoading && areas.length === 0" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#67B83C]"></div>
                <p class="mt-4 text-gray-500">Cargando áreas...</p>
            </div>

            <!-- Fila para crear nueva área -->
            <div v-if="isCreating" class="bg-white rounded-sm border border-gray-200 mb-4 p-6">
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
                    class="bg-white rounded-sm border border-gray-200 overflow-visible relative">
                    <!-- Header del área -->
                    <div class="p-6">
                        <div class="flex items-center justify-between" v-if="editingId !== area.id">
                            <div class="flex items-center gap-4 flex-1">
                                <button @click="toggleArea(area.id || 0)"
                                    class="p-1 hover:bg-gray-100 rounded-sm transition-colors duration-200">
                                    <ChevronRight class="w-10 h-10 text-gray-500 transition-transform duration-200"
                                        :class="{ 'rotate-90': expandedAreas.has(area.id || 0) }" />
                                </button>

                                <div class="flex-1">
                                    <h3 class="text-lg font-semibold text-gray-900 mb-1" v-html="highlightSearchTerm(area.description)"></h3>
                                    <p class="text-sm text-gray-600">{{ getAreaSubtitle(area.description) }}</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-6">
                                <div class="flex gap-4">
                                    <span
                                        class="inline-flex items-center px-3 py-1 rounded-sm text-sm bg-[#3C6EB8] text-white font-medium">
                                        {{ getSubjectsCount(area.id || 0) }} materias
                                    </span>
                                </div>

                                <div class="relative">
                                    <button @click="toggleDropdown(area.id || 0)"
                                        class="h-9 w-9 p-0 border border-gray-200 text-gray-500 cursor-pointer hover:text-white hover:border-gray-300 rounded-sm flex items-center justify-center hover:bg-[#67b83c] transition-colors duration-200">
                                        <MoreHorizontal class="h-4 w-4" />
                                    </button>
                                    <div v-if="openDropdown === (area.id || 0)"
                                        class="absolute z-[9999] w-48 bg-white py-2 rounded-sm border border-gray-200 shadow-xl overflow-hidden top-10 right-0"
                                        >
                                        <div class="flex flex-col">
                                            <button @click="startEdit(area)"
                                                class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-200 transition-colors duration-150 border-t border-b border-gray-100 cursor-pointer text-left">
                                                <Edit class="h-4 w-4 text-gray-600" />
                                                <span class="text-sm">Editar área</span>
                                            </button>
                                            <button @click="createSubject(area.id || 0)"
                                                class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-white hover:bg-[#67b83c] transition-colors duration-150 border-b border-gray-100 cursor-pointer text-left">

                                                <Plus class="h-4 w-4" />
                                                <span class="text-sm">Crear asignatura</span>
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
                    <div v-if="expandedAreas.has(area.id || 0)" class="border-t border-gray-200 bg-gray-50 relative">
                        <div class="p-6">
                            <!-- Formulario para crear nueva asignatura -->
                            <div v-if="creatingSubjectForArea === area.id" class="bg-white rounded-sm border border-gray-200 mb-4 p-4">
                                <div class="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Código</label>
                                        <input v-model="newSubject.code" type="text" placeholder="Ej: MAT001"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#67B83C] focus:border-transparent"
                                            @keyup.enter="saveNewSubject" @keyup.escape="cancelCreateSubject">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Asignatura</label>
                                        <input v-model="newSubject.name" type="text" placeholder="Ej: Cálculo Diferencial"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#67B83C] focus:border-transparent"
                                            @keyup.enter="saveNewSubject" @keyup.escape="cancelCreateSubject">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                                        <Select v-model="newSubject.level"
                                            >
                                            <option value="">Seleccionar nivel</option>
                                            <option value="1">Nivel 1</option>
                                            <option value="2">Nivel 2</option>
                                            <option value="3">Nivel 3</option>
                                            <option value="4">Nivel 4</option>
                                            <option value="5">Nivel 5</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="flex gap-2 justify-end">
                                    <button @click="saveNewSubject"
                                        class="px-4 py-2 text-sm font-medium text-white rounded-sm transition-colors duration-200"
                                        :disabled="!canSaveNewSubject || isSavingSubject"
                                        :class="(canSaveNewSubject && !isSavingSubject) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'">
                                        {{ isSavingSubject ? 'Guardando...' : 'Guardar Asignatura' }}
                                    </button>
                                    <button @click="cancelCreateSubject"
                                        class="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-sm hover:bg-gray-600 transition-colors duration-200">
                                        Cancelar
                                    </button>
                                </div>
                            </div>

                            <!-- Lista de asignaturas -->
                            <div class="space-y-3">
                                <div v-for="subject in getSubjectsByArea(area.id || 0)" :key="subject.id"
                                    class="bg-white rounded-sm border border-gray-200 transition-colors duration-200">
                                    
                                    <!-- Modo visualización -->
                                    <div v-if="editingSubjectId !== subject.id" class="flex items-center justify-between p-4">
                                        <div class="flex gap-6 flex-1">
                                            <div class="min-w-0">
                                                <span class="text-sm text-gray-500">Código</span>
                                                <p class="font-medium text-gray-900" v-html="highlightSearchTerm(subject.code)"></p>
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <span class="text-sm text-gray-500">Asignatura</span>
                                                <p class="font-medium text-gray-900" v-html="highlightSearchTerm(subject.name)"></p>
                                            </div>
                                            <div class="min-w-0 pr-6">
                                                <span class="text-sm text-gray-500">Nivel</span>
                                                <p class="font-medium text-gray-900">Nivel {{ subject.level }}</p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <ButtonIcon :icon="Edit" title="Editar asignatura" @click="startEditSubject(subject, area.id || 0)" />
                                        </div>
                                    </div>

                                    <!-- Modo edición de asignatura -->
                                    <div v-if="editingSubjectId === subject.id" class="p-4">
                                        <div class="grid grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Código</label>
                                                <input v-model="editSubjectForm.code" type="text"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#67B83C] focus:border-transparent"
                                                    @keyup.enter="saveEditSubject" @keyup.escape="cancelEditSubject">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Asignatura</label>
                                                <input v-model="editSubjectForm.name" type="text"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#67B83C] focus:border-transparent"
                                                    @keyup.enter="saveEditSubject" @keyup.escape="cancelEditSubject">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                                                <Select v-model="editSubjectForm.level"
                                                    >
                                                    <option value="">Seleccionar nivel</option>
                                                    <option value="1">Nivel 1</option>
                                                    <option value="2">Nivel 2</option>
                                                    <option value="3">Nivel 3</option>
                                                    <option value="4">Nivel 4</option>
                                                    <option value="5">Nivel 5</option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div class="flex gap-2 justify-end">
                                            <button @click="saveEditSubject"
                                                class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-sm hover:bg-green-700 transition-colors duration-200">
                                                Guardar
                                            </button>
                                            <button @click="cancelEditSubject"
                                                class="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-sm hover:bg-gray-600 transition-colors duration-200">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Botón para agregar asignatura cuando no hay ninguna -->
                                <div v-if="getSubjectsByArea(area.id || 0).length === 0 && creatingSubjectForArea !== area.id" 
                                     class="text-center py-8">
                                    <p class="text-gray-500 mb-4">No hay asignaturas en esta área</p>
                                    <button @click="createSubject(area.id || 0)"
                                        class="px-4 py-2 bg-[#67b83c] text-white text-sm font-medium rounded-sm hover:bg-[#5ba632] transition-colors duration-200 flex items-center gap-2 mx-auto">
                                        <Plus class="w-4 h-4" />
                                        Crear primera asignatura
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No results found -->
            <div v-if="filteredAreas.length === 0 && (searchQuery.trim() || hasActiveFilters) && areas.length > 0 && !isLoading"
                class="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div class="text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <p class="text-lg font-medium text-gray-900 mb-1">No se encontraron resultados</p>
                    <p class="text-gray-600 mb-4">
                        Intenta con diferentes términos de búsqueda o ajusta los filtros.
                    </p>
                    <Button 
                        customClass="px-4 py-2 bg-[#67b83c] text-white text-sm rounded-sm hover:bg-[#5ba632]"
                        @click="clearSearchAndFilters">
                        Limpiar búsqueda y filtros
                    </Button>
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
import { AreasService } from '@/services/areasService'
import type { Area, Subject } from '@/types/areas'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import Search from '@/components/common/Search.vue'
import Button from '@/components/common/Button.vue'
import { ChevronRight } from 'lucide-vue-next'
import ButtonIcon from '@/components/common/ButtonIcon.vue'
import Select from '@/components/common/Select.vue'

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

// Estados para filtros
const showFilters = ref(false)
const filters = reactive({
    subjectCount: '',
    subjectLevel: '',
    areaType: ''
})

// Estados para asignaturas
const creatingSubjectForArea = ref<number | null>(null)
const editingSubjectId = ref<number | null>(null)
const isSavingSubject = ref(false)
const currentEditingAreaId = ref<number | null>(null)

const newArea = reactive({
    description: '',
    subjectList: [] as Subject[]
})

const editForm = reactive({
    description: '',
    subjectList: [] as Subject[]
})

const newSubject = reactive({
    code: '',
    name: '',
    level: ''
})

const editSubjectForm = reactive({
    code: '',
    name: '',
    level: ''
})

// Computed properties
const canSaveNew = computed(() => {
    return newArea.description.trim()
})

const canSaveNewSubject = computed(() => {
    return newSubject.code.trim() && newSubject.name.trim() && newSubject.level.trim()
})

// Computed para filtros
const hasActiveFilters = computed(() => {
    return !!(filters.subjectCount || filters.subjectLevel || filters.areaType)
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.subjectCount) count++
    if (filters.subjectLevel) count++
    if (filters.areaType) count++
    return count
})

const filteredAreas = computed(() => {
    let result = areas.value

    // Aplicar filtro de búsqueda - solo busca en área, asignatura y código
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        
        result = result.filter(area => {
            try {
                // Buscar en el nombre del área
                const areaNameMatch = area.description?.toLowerCase().includes(query) || false
                
                // Buscar en las asignaturas (nombre y código)
                const subjectMatch = area.subjectList?.some(subject => {
                    const nameMatch = subject.name?.toLowerCase().includes(query) || false
                    const codeMatch = subject.code?.toLowerCase().includes(query) || false
                    return nameMatch || codeMatch
                }) || false
                
                const matches = areaNameMatch || subjectMatch
                
                return matches
            } catch (error) {
                console.error('Error filtering area:', area, error)
                return false
            }
        })
        
    }

    // Aplicar filtros adicionales solo si no hay búsqueda activa
    if (!searchQuery.value.trim()) {
        if (filters.subjectCount) {
            result = result.filter(area => {
                const count = area.subjectList.length
                switch (filters.subjectCount) {
                    case '0':
                        return count === 0
                    case '1-5':
                        return count >= 1 && count <= 5
                    case '6-10':
                        return count >= 6 && count <= 10
                    case '11+':
                        return count > 10
                    default:
                        return true
                }
            })
        }

        if (filters.subjectLevel) {
            result = result.filter(area => {
                return area.subjectList.some(subject => subject.level === filters.subjectLevel)
            })
        }

        if (filters.areaType) {
            result = result.filter(area => {
                const description = area.description.toLowerCase()
                switch (filters.areaType) {
                    case 'matematicas':
                        return description.includes('matemáticas') || description.includes('matematicas')
                    case 'arquitectura':
                        return description.includes('arquitectura') || description.includes('computador') || description.includes('hardware')
                    case 'software':
                        return description.includes('software')
                    case 'other':
                        return !(description.includes('matemáticas') || description.includes('matematicas') || 
                               description.includes('arquitectura') || description.includes('computador') || 
                               description.includes('hardware') || description.includes('software'))
                    default:
                        return true
                }
            })
        }
    }

    return result
})

// Funciones para filtros
const toggleFilters = () => {
    showFilters.value = !showFilters.value
}

const applyFilters = () => {
    // Los filtros se aplican automáticamente a través del computed filteredAreas
}

const clearFilters = () => {
    filters.subjectCount = ''
    filters.subjectLevel = ''
    filters.areaType = ''
}

const clearSearchAndFilters = () => {
    searchQuery.value = ''
    clearFilters()
}

// Función para resaltar términos de búsqueda
const highlightSearchTerm = (text: string): string => {
    if (!searchQuery.value.trim() || !text) {
        return text || ''
    }
    
    const query = searchQuery.value.trim()
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}

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
    if (creatingSubjectForArea.value) {
        cancelCreateSubject()
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
    if (creatingSubjectForArea.value) {
        cancelCreateSubject()
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

// Funciones para asignaturas
const createSubject = (areaId: number) => {
    closeDropdown()
    if (editingId.value) {
        cancelEdit()
    }
    if (editingSubjectId.value) {
        cancelEditSubject()
    }
    resetNewSubject()
    creatingSubjectForArea.value = areaId
    // Expandir automáticamente el área donde se está creando la asignatura
    expandedAreas.value.add(areaId)
}

const saveNewSubject = async () => {
    if (!canSaveNewSubject.value || isSavingSubject.value || !creatingSubjectForArea.value) return

    const subjectData = {
        code: newSubject.code.trim(),
        name: newSubject.name.trim(),
        level: newSubject.level.trim()
    }

    isSavingSubject.value = true
    try {
        await areasService.createSubject(creatingSubjectForArea.value, subjectData)
        await loadAreas()
        showSuccessToast('Asignatura creada exitosamente')
        cancelCreateSubject()
    } catch (error) {
        console.error('Error creating subject:', error)
        showErrorToast('Error al crear la asignatura')
    } finally {
        isSavingSubject.value = false
    }
}

const cancelCreateSubject = () => {
    creatingSubjectForArea.value = null
    resetNewSubject()
}

const resetNewSubject = () => {
    newSubject.code = ''
    newSubject.name = ''
    newSubject.level = ''
}

const startEditSubject = (subject: Subject, areaId: number) => {
    if (creatingSubjectForArea.value) {
        cancelCreateSubject()
    }
    if (editingId.value) {
        cancelEdit()
    }
    
    editingSubjectId.value = subject.id || null
    currentEditingAreaId.value = areaId
    editSubjectForm.code = subject.code
    editSubjectForm.name = subject.name
    editSubjectForm.level = subject.level
}

const saveEditSubject = async () => {
    if (!editingSubjectId.value || !currentEditingAreaId.value) return

    const updateData = {
        code: editSubjectForm.code.trim(),
        name: editSubjectForm.name.trim(),
        level: editSubjectForm.level.trim()
    }

    try {
        await areasService.updateSubject(currentEditingAreaId.value, editingSubjectId.value, updateData)
        await loadAreas()
        showSuccessToast('Asignatura actualizada exitosamente')
        cancelEditSubject()
    } catch (error) {
        console.error('Error updating subject:', error)
        showErrorToast('Error al actualizar la asignatura')
    }
}

const cancelEditSubject = () => {
    editingSubjectId.value = null
    currentEditingAreaId.value = null
    editSubjectForm.code = ''
    editSubjectForm.name = ''
    editSubjectForm.level = ''
}

const deleteSubjectConfirm = async (subject: Subject, areaId: number) => {
    if (!subject.id) return
    
    if (confirm(`¿Estás seguro de que deseas eliminar la asignatura "${subject.name}"?`)) {
        try {
            await areasService.deleteSubject(areaId, subject.id)
            await loadAreas()
            showSuccessToast('Asignatura eliminada exitosamente')
        } catch (error) {
            console.error('Error deleting subject:', error)
            showErrorToast('Error al eliminar la asignatura')
        }
    }
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