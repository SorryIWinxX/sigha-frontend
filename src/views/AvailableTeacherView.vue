<template>
    <MainLayout>
        <div class="flex w-full justify-between items-center">
            <div class="flex items-center gap-4">
                <h1 class="text-2xl font-bold text-gray-800">Disponibilidad de profesores</h1>
                <ToggleText :model-value="localAvailability" @update:model-value="handleAvailabilityChange"
                    activeText="Habilitada" inactiveText="Deshabilitada"
                    :disabled="!semesterStore.currentSemester || isUpdating" />
            </div>

            <SemesterSelector />
        </div>

        <AvailabilityManCalendar :selected-semester="semesterStore.currentSemester" />
    </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import MainLayout from '@/components/layout/MainLayout.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import AvailabilityManCalendar from '@/components/AvailabilityManCalendar.vue';
import ToggleText from '@/components/ui/ToggleText.vue';
import { useSemesterStore } from '@/store/semesterStore'
import { SemesterService } from '@/services/semesterService'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const semesterStore = useSemesterStore()
const semesterService = new SemesterService()

// Estado local para el toggle
const localAvailability = ref(false)
const isUpdating = ref(false)

// Función para manejar el cambio del toggle
const handleAvailabilityChange = async (newValue: boolean) => {
    if (!semesterStore.currentSemester) return

    isUpdating.value = true
    try {
        await semesterService.updateAvailability(semesterStore.currentSemester.id, newValue)
        localAvailability.value = newValue
        showSuccessToast(
            newValue
                ? 'Disponibilidad habilitada correctamente'
                : 'correctamente'
        )
    } catch (error) {
        console.error('Error updating availability:', error)
        showErrorToast('Error al actualizar la disponibilidad')
    } finally {
        isUpdating.value = false
    }
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
