<template>
    <div class="document-config p-4 rounded-sm">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-medium text-gray-900">Tipos de Documento</h2>
            <button @click="addNewDocumentRow"
                class="px-4 py-2 bg-[#67B83C] text-white text-sm font-medium rounded-sm hover:bg-green-700 transition-colors duration-200"
                :disabled="isCreating || isLoading"
                :class="{ 'opacity-50 cursor-not-allowed': isCreating || isLoading }">
                + Crear Tipo de Documento
            </button>
        </div>

        <!-- Indicador de carga -->
        <div v-if="isLoading && documents.length === 0" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#67B83C]"></div>
            <p class="mt-2 text-gray-500 text-sm">Cargando tipos de documento...</p>
        </div>

        <!-- Tabla usando el componente del sistema -->
        <div v-if="!isLoading || documents.length > 0" class="w-full bg-white">
            <div class="overflow-hidden border border-gray-200 rounded-sm">
                <table class="w-full">
                    <thead class="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left">
                                <span class="text-gray-900 font-semibold text-sm">Descripción</span>
                            </th>
                            <th class="px-6 py-3 text-left">
                                <span class="text-gray-900 font-semibold text-sm">Sigla</span>
                            </th>
                            <th class="px-6 py-3 text-center">
                                <span class="text-gray-900 font-semibold text-sm">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        <!-- Fila para crear nuevo tipo de documento -->
                        <tr v-if="isCreating" class="bg-blue-50 border-l-4 border-l-blue-500">
                            <td class="px-6 py-4">
                                <input v-model="newDocument.description" type="text"
                                    placeholder="Ej: Cedula de Ciudadania"
                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    @keyup.enter="saveNewDocument" @keyup.escape="cancelCreate">
                            </td>
                            <td class="px-6 py-4">
                                <input v-model="newDocument.sigla" type="text" placeholder="Ej: C.C"
                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    @keyup.enter="saveNewDocument" @keyup.escape="cancelCreate">
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="saveNewDocument"
                                        class="px-3 py-1.5 text-sm font-medium text-white rounded-sm transition-colors duration-200 flex items-center gap-2"
                                        :disabled="!canSaveNew || isSaving" :class="(canSaveNew && !isSaving)
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-gray-400 cursor-not-allowed'">
                                        <div v-if="isSaving"
                                            class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                        {{ isSaving ? 'Guardando...' : 'Guardar' }}
                                    </button>
                                    <button @click="cancelCreate"
                                        class="px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-sm hover:bg-gray-600 transition-colors duration-200">
                                        Cancelar
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Filas de tipos de documento existentes -->
                        <tr v-for="(document, index) in documents" :key="document.id" :class="[
                            'hover:bg-gray-50 transition-colors duration-150',
                            { 'bg-gray-50/30': index % 2 === 0 }
                        ]">
                            <!-- Modo edición -->
                            <template v-if="editingId === document.id">
                                <td class="px-6 py-4">
                                    <input v-model="editForm.description" type="text"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        @keyup.enter="saveEdit" @keyup.escape="cancelEdit">
                                </td>
                                <td class="px-6 py-4">
                                    <input v-model="editForm.sigla" type="text"
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
                                    <span class="text-gray-900 font-medium text-sm">{{ document.description }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-gray-600 text-sm">{{ document.sigla }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="relative flex items-center justify-center">
                                        <button @click="toggleDropdown(document.id || '')"
                                            class="h-9 w-9 p-0 border border-gray-200 text-gray-500 cursor-pointer hover:text-white hover:border-white rounded-sm flex items-center justify-center hover:bg-[#67b83c] hover:border-gray-300">
                                            <MoreHorizontal class="h-4 w-4 transition-colors duration-200" />
                                        </button>
                                        <div v-if="openDropdown === (document.id || '')" :class="[
                                            'absolute z-50 w-32 bg-white rounded-sm border border-gray-200 shadow-lg overflow-hidden',
                                            index >= documents.length - 2 ? 'bottom-10 right-0' : 'top-10 right-0'
                                        ]">
                                            <div class="flex">
                                                <button @click="startEdit(document)"
                                                    class="flex items-center justify-center flex-1 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-r border-gray-100 cursor-pointer">
                                                    <Edit class="h-5 w-5 text-gray-900" />
                                                </button>
                                                <button @click="deleteDocument(document.id || '')"
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
                        <tr v-if="documents.length === 0 && !isCreating">
                            <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                                No hay tipos de documento configurados. Haz clic en "Crear Tipo de Documento" para
                                agregar uno.
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
import { TipoDocumentoService } from '@/services/tipoDocumentoService'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import type { TipoDocumento } from '@/services/tipoDocumentoService'

// Instanciar el servicio
const tipoDocumentoService = new TipoDocumentoService()

// Estado reactivo
const documents = ref<TipoDocumento[]>([])
const isLoading = ref(false)
const isCreating = ref(false)
const isSaving = ref(false)
const editingId = ref<string | null>(null)
const openDropdown = ref<string | null>(null)

const newDocument = reactive({
    description: '',
    sigla: ''
})

const editForm = reactive({
    description: '',
    sigla: ''
})

// Computed properties
const canSaveNew = computed(() => {
    return newDocument.description.trim() && newDocument.sigla.trim()
})

// Cargar tipos de documento al montar el componente
const loadTiposDocumento = async () => {
    isLoading.value = true
    try {
        documents.value = await tipoDocumentoService.getTiposDocumento()
    } catch (error) {
        console.error('Error loading tipos de documento:', error)
        showErrorToast('Error al cargar los tipos de documento')
    } finally {
        isLoading.value = false
    }
}

// Funciones para crear
const addNewDocumentRow = () => {
    if (editingId.value) {
        cancelEdit()
    }
    resetNewDocument()
    isCreating.value = true
}

const saveNewDocument = async () => {
    if (!canSaveNew.value || isSaving.value) return

    const tipoDocumento = {
        description: newDocument.description.trim(),
        sigla: newDocument.sigla.trim()
    }

    isSaving.value = true
    try {
        await tipoDocumentoService.createTipoDocumento(tipoDocumento)
        // Limpiar y recargar la lista para asegurar consistencia
        await loadTiposDocumento()
        showSuccessToast('Tipo de documento creado exitosamente')
        cancelCreate()
    } catch (error) {
        console.error('Error creating tipo de documento:', error)
        showErrorToast('Error al crear el tipo de documento')
    } finally {
        isSaving.value = false
    }
}

const cancelCreate = () => {
    isCreating.value = false
    resetNewDocument()
}

const resetNewDocument = () => {
    newDocument.description = ''
    newDocument.sigla = ''
}

// Funciones para editar
const startEdit = (document: TipoDocumento) => {
    if (isCreating.value) {
        cancelCreate()
    }
    closeDropdown()
    editingId.value = document.id || ''
    editForm.description = document.description
    editForm.sigla = document.sigla
}

const saveEdit = async () => {
    if (!editingId.value) return

    const updateData = {
        description: editForm.description.trim(),
        sigla: editForm.sigla.trim()
    }

    try {
        await tipoDocumentoService.updateTipoDocumento(editingId.value, updateData)
        // Recargar la lista para asegurar consistencia con el servidor
        await loadTiposDocumento()
        showSuccessToast('Tipo de documento actualizado exitosamente')
        cancelEdit()
    } catch (error) {
        console.error('Error updating tipo de documento:', error)
        showErrorToast('Error al actualizar el tipo de documento')
    }
}

const cancelEdit = () => {
    editingId.value = null
    editForm.description = ''
    editForm.sigla = ''
}

// Funciones del dropdown
const toggleDropdown = (documentId: string) => {
    openDropdown.value = openDropdown.value === documentId ? null : documentId
}

const closeDropdown = () => {
    openDropdown.value = null
}

// Función para eliminar (no disponible según requerimientos)
const deleteDocument = (id: string) => {
    closeDropdown()
    alert('La función de eliminar no está disponible para tipos de documento.')
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
    if (!event.target || !(event.target as Element).closest('.relative')) {
        openDropdown.value = null
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    loadTiposDocumento()
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped></style>