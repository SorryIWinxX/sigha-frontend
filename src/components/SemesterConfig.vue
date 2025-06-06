<template>
    <div class="semester-config p-4 rounded-sm">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-medium text-gray-900">Semestres</h2>
            <button @click="addNewSemesterRow"
                class="px-4 py-2 bg-[#67B83C] text-white text-sm font-medium rounded-sm hover:bg-green-700 transition-colors duration-200"
                :disabled="isCreating" :class="{ 'opacity-50 cursor-not-allowed': isCreating }">
                + Crear Semestre
            </button>
        </div>

        <!-- Tabla usando el componente del sistema -->
        <div class="w-full bg-white">
            <div class="overflow-hidden border border-gray-200 rounded-sm">
                <table class="w-full">
                    <thead class="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left">
                                <span class="text-gray-900 font-semibold text-sm">Descripción</span>
                            </th>
                            <th class="px-6 py-3 text-left">
                                <span class="text-gray-900 font-semibold text-sm">Fecha Inicio</span>
                            </th>
                            <th class="px-6 py-3 text-left">
                                <span class="text-gray-900 font-semibold text-sm">Fecha Fin</span>
                            </th>
                            <th class="px-6 py-3 text-center">
                                <span class="text-gray-900 font-semibold text-sm">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        <!-- Fila para crear nuevo semestre -->
                        <tr v-if="isCreating" class="bg-blue-50 border-l-4 border-l-blue-500">
                            <td class="px-6 py-4">
                                <input v-model="newSemester.description" type="text" placeholder="Ej: 2025-1"
                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    @keyup.enter="saveNewSemester" @keyup.escape="cancelCreate">
                            </td>
                            <td class="px-6 py-4">
                                <input v-model="newSemester.startDate" type="date"
                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    @keyup.enter="saveNewSemester" @keyup.escape="cancelCreate">
                            </td>
                            <td class="px-6 py-4">
                                <input v-model="newSemester.endDate" type="date"
                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    @keyup.enter="saveNewSemester" @keyup.escape="cancelCreate">
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="saveNewSemester"
                                        class="px-3 py-1.5 text-sm font-medium text-white rounded-sm transition-colors duration-200"
                                        :disabled="!canSaveNew" :class="canSaveNew
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-gray-400 cursor-not-allowed'">
                                        Guardar
                                    </button>
                                    <button @click="cancelCreate"
                                        class="px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-sm hover:bg-gray-600 transition-colors duration-200">
                                        Cancelar
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas de semestres existentes -->
                        <tr v-for="(semester, index) in semesters" :key="semester.id" :class="[
                            'hover:bg-gray-50 transition-colors duration-150',
                            { 'bg-gray-50/30': index % 2 === 0 }
                        ]">
                            <!-- Modo edición -->
                            <template v-if="editingId === semester.id">
                                <td class="px-6 py-4">
                                    <input v-model="editForm.description" type="text"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        @keyup.enter="saveEdit" @keyup.escape="cancelEdit">
                                </td>
                                <td class="px-6 py-4">
                                    <input v-model="editForm.startDate" type="date"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        @keyup.enter="saveEdit" @keyup.escape="cancelEdit">
                                </td>
                                <td class="px-6 py-4">
                                    <input v-model="editForm.endDate" type="date"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        @keyup.enter="saveEdit" @keyup.escape="cancelEdit">
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center justify-center gap-2">
                                        <button @click="saveEdit"
                                            class="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-sm hover:bg-green-700 transition-colors duration-200">
                                            Guardar
                                        </button>
                                        <button @click="cancelEdit"
                                            class="px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-sm hover:bg-gray-600 transition-colors duration-200">
                                            Cancelar
                                        </button>
                                    </div>
                                </td>
                            </template>

                            <!-- Modo vista -->
                            <template v-else>
                                <td class="px-6 py-4">
                                    <span class="text-gray-900 font-medium text-sm">{{ semester.description }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-gray-600 text-sm">{{ formatDate(semester.startDate) }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-gray-600 text-sm">{{ formatDate(semester.endDate) }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="relative flex items-center justify-center">
                                        <button @click="toggleDropdown(semester.id)"
                                            class="h-9 w-9 p-0 border border-gray-200 text-gray-500 cursor-pointer hover:text-white hover:border-white rounded-sm flex items-center justify-center hover:bg-[#67b83c] hover:border-gray-300">
                                            <MoreHorizontal class="h-4 w-4 transition-colors duration-200" />
                                        </button>
                                        <div v-if="openDropdown === semester.id" :class="[
                                            'absolute z-50 w-32 bg-white rounded-sm border border-gray-200 shadow-lg overflow-hidden',
                                            index >= semesters.length - 2 ? 'bottom-10 right-0' : 'top-10 right-0'
                                        ]">
                                            <div class="flex">
                                                <button @click="startEdit(semester)"
                                                    class="flex items-center justify-center flex-1 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-r border-gray-100 cursor-pointer">
                                                    <Edit class="h-5 w-5 text-gray-900" />
                                                </button>
                                                <button @click="deleteSemester(semester.id)"
                                                    class="flex items-center justify-center flex-1 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer">
                                                    <Trash2 class="h-5 w-5 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </template>
                        </tr>

                        <!-- Estado vacío -->
                        <tr v-if="semesters.length === 0 && !isCreating">
                            <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                                No hay semestres configurados. Haz clic en "Crear Semestre" para agregar uno.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-vue-next'

interface Semester {
    id: string
    description: string
    startDate: string
    endDate: string
}

// Estado reactivo
const semesters = ref<Semester[]>([
    {
        id: '1',
        description: '2025-1',
        startDate: '2025-01-01',
        endDate: '2025-06-30'
    }
])

const isCreating = ref(false)
const editingId = ref<string | null>(null)
const openDropdown = ref<string | null>(null)

const newSemester = reactive({
    description: '',
    startDate: '',
    endDate: ''
})

const editForm = reactive({
    description: '',
    startDate: '',
    endDate: ''
})

// Computed properties
const canSaveNew = computed(() => {
    return newSemester.description.trim() && newSemester.startDate && newSemester.endDate
})

// Funciones para crear
const addNewSemesterRow = () => {
    if (editingId.value) {
        cancelEdit()
    }
    resetNewSemester()
    isCreating.value = true
}

const saveNewSemester = () => {
    if (!canSaveNew.value) return

    const semester: Semester = {
        id: Date.now().toString(),
        description: newSemester.description.trim(),
        startDate: newSemester.startDate,
        endDate: newSemester.endDate
    }

    semesters.value.unshift(semester) // Agregar al inicio
    cancelCreate()
}

const cancelCreate = () => {
    isCreating.value = false
    resetNewSemester()
}

const resetNewSemester = () => {
    newSemester.description = ''
    newSemester.startDate = ''
    newSemester.endDate = ''
}

// Funciones para editar
const startEdit = (semester: Semester) => {
    if (isCreating.value) {
        cancelCreate()
    }
    closeDropdown()
    editingId.value = semester.id
    editForm.description = semester.description
    editForm.startDate = semester.startDate
    editForm.endDate = semester.endDate
}

const saveEdit = () => {
    if (!editingId.value) return

    const index = semesters.value.findIndex(s => s.id === editingId.value)
    if (index !== -1) {
        semesters.value[index] = {
            ...semesters.value[index],
            description: editForm.description.trim(),
            startDate: editForm.startDate,
            endDate: editForm.endDate
        }
    }

    cancelEdit()
}

const cancelEdit = () => {
    editingId.value = null
    editForm.description = ''
    editForm.startDate = ''
    editForm.endDate = ''
}

// Funciones del dropdown
const toggleDropdown = (semesterId: string) => {
    openDropdown.value = openDropdown.value === semesterId ? null : semesterId
}

const closeDropdown = () => {
    openDropdown.value = null
}

// Función para eliminar
const deleteSemester = (id: string) => {
    closeDropdown()
    if (confirm('¿Estás seguro de que quieres eliminar este semestre?')) {
        const index = semesters.value.findIndex(s => s.id === id)
        if (index !== -1) {
            semesters.value.splice(index, 1)
        }
    }
}

// Funciones de formato
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
    if (!event.target || !(event.target as Element).closest('.relative')) {
        openDropdown.value = null
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped></style>