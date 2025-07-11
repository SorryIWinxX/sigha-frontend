<template>
    <div class="semester-config p-4 rounded-sm">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-medium text-gray-900">Semestres</h2>
            <Button variant="primary" @click="addNewSemesterRow" :disabled="isCreating || isLoading">
                <template #icon>
                    <Plus :size="18" />
                </template>
                Crear Semestre
            </Button>
        </div>

        <!-- Tabla usando el componente del sistema -->
        <div class="w-full bg-white">
            <div class="overflow-x-auto border border-gray-200 rounded-sm">
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
                                        <ButtonIcon :icon="Check" title="Guardar cambios" @click="saveEdit" />
                                        <ButtonIcon :icon="X" title="Cancelar edición" @click="cancelEdit"
                                            variant="danger" />
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
                                    <div class="flex items-center justify-center">
                                        <ButtonIcon :icon="Edit" title="Editar semestre" @click="startEdit(semester)" />
                                    </div>
                                </td>
                            </template>
                        </tr>

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
                                    <ButtonIcon :icon="Check" title="Guardar cambios" @click="saveNewSemester" />
                                    <ButtonIcon :icon="X" title="Cancelar edición" @click="cancelCreate"
                                        variant="danger" />
                                </div>
                            </td>
                        </tr>

                        <!-- Estado de carga -->
                        <tr v-if="isLoading">
                            <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                                <div class="flex items-center justify-center gap-2">
                                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#67B83C]"></div>
                                    Cargando semestres...
                                </div>
                            </td>
                        </tr>

                        <!-- Estado vacío -->
                        <tr v-if="semesters.length === 0 && !isCreating && !isLoading">
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
import { Edit, Plus, Check, X } from 'lucide-vue-next'
import { SemesterService } from '@/services/semesterService'
import { useSemesterStore } from '@/store/semesterStore'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import type { Semester } from '@/types/semester'
import Button from '@/components/common/Button.vue'
import ButtonIcon from '@/components/common/ButtonIcon.vue'

// Instanciar el servicio y store
const semesterService = new SemesterService()
const semesterStore = useSemesterStore()

// Estado reactivo
const semesters = ref<Semester[]>([])
const isLoading = ref(false)
const isCreating = ref(false)
const isSaving = ref(false)
const editingId = ref<number | null>(null)
const openDropdown = ref<number | null>(null)

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

// Cargar semestres al montar el componente
const loadSemesters = async () => {
    isLoading.value = true
    try {
        const semesterData = await semesterService.getSemesters()
        // Ordenar semestres de forma descendente por fecha de inicio (más recientes primero)
        semesters.value = semesterData.sort((a, b) => {
            const dateA = new Date(a.startDate)
            const dateB = new Date(b.startDate)
            return dateB.getTime() - dateA.getTime()
        })
    } catch (error) {
        console.error('Error loading semesters:', error)
        showErrorToast('Error al cargar los semestres')
    } finally {
        isLoading.value = false
    }
}

// Funciones para crear
const addNewSemesterRow = () => {
    if (editingId.value) {
        cancelEdit()
    }
    resetNewSemester()
    isCreating.value = true
}

const saveNewSemester = async () => {
    if (!canSaveNew.value || isSaving.value) return

    const semesterData = {
        description: newSemester.description.trim(),
        startDate: newSemester.startDate,
        endDate: newSemester.endDate,
        availability: true
    }

    isSaving.value = true
    try {
        await semesterService.createSemester(semesterData)
        // Limpiar y recargar la lista para asegurar consistencia
        await loadSemesters()
        // Actualizar el store después de crear
        await semesterStore.loadSemesters()
        showSuccessToast('Semestre creado exitosamente')
        cancelCreate()
    } catch (error) {
        console.error('Error creating semester:', error)
        showErrorToast('Error al crear el semestre')
    } finally {
        isSaving.value = false
    }
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
    editingId.value = semester.id
    editForm.description = semester.description
    editForm.startDate = semester.startDate
    editForm.endDate = semester.endDate
}

const saveEdit = async () => {
    if (!editingId.value) return

    const updateData = {
        id: editingId.value,
        description: editForm.description.trim(),
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        availability: true
    }

    try {
        await semesterService.updateSemester(updateData)
        // Recargar la lista para asegurar consistencia con el servidor
        await loadSemesters()
        // Actualizar el store después de editar
        await semesterStore.loadSemesters()
        showSuccessToast('Semestre actualizado exitosamente')
        cancelEdit()
    } catch (error) {
        console.error('Error updating semester:', error)
        showErrorToast('Error al actualizar el semestre')
    }
}

const cancelEdit = () => {
    editingId.value = null
    editForm.description = ''
    editForm.startDate = ''
    editForm.endDate = ''
}

// Funciones de formato
const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''

    try {
        const date = new Date(dateString)
        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            return ''
        }
        return date.toLocaleDateString('es-ES')
    } catch (error) {
        console.error('Error formatting date:', error)
        return ''
    }
}

onMounted(() => {
    loadSemesters()
})
</script>

<style scoped></style>