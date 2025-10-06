<template>
    <Layout>
        <div class="flex w-full justify-between items-center">
            <div class="flex items-center gap-4">
                <h1 class="text-2xl font-bold text-gray-800">Disponibilidad de profesores</h1>
                <ToggleText :model-value="localAvailability" @update:model-value="handleToggleClick"
                    activeText="Habilitada" inactiveText="Deshabilitada"
                    :disabled="!semesterStore.currentSemester || isUpdating" />
            </div>

            <SemesterSelector />
        </div>

        <AvailabilityManagement :selected-semester="semesterStore.currentSemester" />

        <!-- Modal de confirmación -->
        <ConfirmationModal :isVisible="showConfirmModal" :title="confirmModalTitle" :message="confirmModalMessage"
            :confirmText="pendingValue ? 'Habilitar' : 'Deshabilitar'" cancelText="Cancelar"
            :confirmVariant="pendingValue ? 'primary' : 'danger'" @confirm="confirmAvailabilityChange"
            @cancel="cancelAvailabilityChange" />
    </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import Layout from '@/components/layout/Layout.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import AvailabilityManagement from '@/components/availability/AvailabilityManagement.vue';
import ToggleText from '@/components/ui/ToggleText.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import { useSemesterStore } from '@/store/semesterStore'
import { SemesterService } from '@/services/semesterService'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const semesterStore = useSemesterStore()
const semesterService = new SemesterService()

// Estado local para el toggle
const localAvailability = ref(false)
const isUpdating = ref(false)

// Estados para el modal de confirmación
const showConfirmModal = ref(false)
const pendingValue = ref<boolean | null>(null)

// Textos dinámicos para el modal
const confirmModalTitle = computed(() => {
    return pendingValue.value
        ? '¿Habilitar disponibilidad de profesores?'
        : '¿Deshabilitar disponibilidad de profesores?'
})

const confirmModalMessage = computed(() => {
    return pendingValue.value
        ? '<span class="font-bold text-md text-red-500">TODOS</span>  los profesores podrán registrar su disponibilidad para el semestre seleccionado.'
        : '<span class="font-bold text-md text-red-500">TODOS</span> los profesores no podrán registrar su disponibilidad para el semestre seleccionado.'
})

// Función para manejar el click en el toggle (muestra el modal)
const handleToggleClick = (newValue: boolean) => {
    if (!semesterStore.currentSemester) return

    pendingValue.value = newValue
    showConfirmModal.value = true
}

// Función para confirmar el cambio
const confirmAvailabilityChange = async () => {
    if (!semesterStore.currentSemester || pendingValue.value === null) return

    showConfirmModal.value = false
    isUpdating.value = true

    try {
        await semesterService.updateAvailability(semesterStore.currentSemester.id, pendingValue.value)
        localAvailability.value = pendingValue.value
        showSuccessToast(
            pendingValue.value
                ? 'Disponibilidad habilitada correctamente'
                : 'Disponibilidad deshabilitada correctamente'
        )
    } catch (error) {
        console.error('Error updating availability:', error)
        showErrorToast('Error al actualizar la disponibilidad')
    } finally {
        isUpdating.value = false
        pendingValue.value = null
    }
}

// Función para cancelar el cambio
const cancelAvailabilityChange = () => {
    showConfirmModal.value = false
    pendingValue.value = null
}

// Observar cambios en el semestre actual para actualizar el estado local
watch(() => semesterStore.currentSemester, (newSemester) => {
    if (newSemester) {
        localAvailability.value = newSemester.availability
    }
}, { immediate: true })

// Cargar semestres al montar el componente si no están cargados
onMounted(async () => {
    if (semesterStore.availableSemesters.length === 0) {
        await semesterStore.loadSemesters()
    }
})
</script>
