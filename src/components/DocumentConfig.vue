<template>
    <div class="document-config p-4 rounded-sm">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-medium text-gray-900">Tipos de Documento</h2>
            <Button @click="addNewDocumentRow" custom-class="px-4 py-2 bg-[#67B83C] text-white hover:bg-green-700"
                :disabled="isCreating || isLoading">
                <template #icon>
                    <Plus :size="16" />
                </template>
                Crear Tipo de Documento
            </Button>
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
                                    <ButtonIcon :icon="Check" title="Guardar cambios" @click="saveNewDocument" />
                                    <ButtonIcon :icon="X" title="Cancelar edición" @click="cancelCreate"
                                        variant="danger" />
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
                                        <ButtonIcon :icon="Check" title="Guardar cambios" @click="saveEdit"
                                            :disabled="!canSaveEdit || isEditing" />
                                        <ButtonIcon :icon="X" title="Cancelar edición" @click="cancelEdit"
                                            variant="danger" :disabled="isEditing" />
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
                                    <div class="flex items-center justify-center">
                                        <ButtonIcon :icon="Edit" title="Editar tipo de documento"
                                            @click="startEdit(document)" :disabled="isEditing || isCreating" />
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
import { Edit, Plus, Check, X } from 'lucide-vue-next'
import { TipoDocumentoService } from '@/services/tipoDocumentoService'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import type { TipoDocumento } from '@/types/tipoDocumento'
import Button from '@/components/common/Button.vue'
import ButtonIcon from '@/components/common/ButtonIcon.vue'

// Instanciar el servicio
const tipoDocumentoService = new TipoDocumentoService()

// Estado reactivo
const documents = ref<TipoDocumento[]>([])
const isLoading = ref(false)
const isCreating = ref(false)
const isSaving = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const newDocument = reactive({
    description: '',
    sigla: '',
})

const editForm = reactive({
    description: '',
    sigla: '',
})

// Computed properties
const canSaveNew = computed(() => {
    return newDocument.description.trim() && newDocument.sigla.trim()
})

const canSaveEdit = computed(() => {
    return editForm.description.trim() && editForm.sigla.trim()
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
        sigla: newDocument.sigla.trim(),
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

    // Validar que el documento tenga un ID válido
    if (!document.id) {
        showErrorToast('Error: El documento no tiene un ID válido')
        return
    }

    editingId.value = document.id
    editForm.description = document.description
    editForm.sigla = document.sigla
}

const saveEdit = async () => {
    if (!editingId.value) {
        showErrorToast('Error: No hay un documento seleccionado para editar')
        return
    }

    if (!canSaveEdit.value) {
        showErrorToast('Error: Los campos descripción y sigla son obligatorios')
        return
    }

    if (isEditing.value) return // Evitar múltiples llamadas

    const updateData = {
        description: editForm.description.trim(),
        sigla: editForm.sigla.trim(),
    }

    isEditing.value = true
    try {

        const updatedDocument = await tipoDocumentoService.updateTipoDocumento(editingId.value, updateData)

        // Actualizar el documento en la lista local
        const documentIndex = documents.value.findIndex((doc: TipoDocumento) => doc.id === editingId.value)
        if (documentIndex !== -1) {
            documents.value[documentIndex] = updatedDocument
        }

        showSuccessToast('Tipo de documento actualizado exitosamente')
        cancelEdit()
    } catch (error) {
        console.error('Error updating tipo de documento:', error)
        showErrorToast('Error al actualizar el tipo de documento')
    } finally {
        isEditing.value = false
    }
}

const cancelEdit = () => {
    editingId.value = null
    editForm.description = ''
    editForm.sigla = ''
    isEditing.value = false
}

onMounted(() => {
    loadTiposDocumento()
})
</script>

<style scoped></style>