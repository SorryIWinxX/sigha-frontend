<template>
    <div class="flex flex-col items-center w-full max-w-lg">
        <div v-if="semesterStore.loading" class="flex items-center justify-center py-4">
            <div class="text-sm text-gray-500">Cargando semestres...</div>
        </div>
        <div v-else-if="semesterStore.error" class="flex items-center justify-center py-4">
            <div class="text-sm text-red-500">Error al cargar semestres</div>
        </div>
        <div v-else class="flex items-center justify-between w-full">
            <button @click="semesterStore.previousSemester()" :disabled="!semesterStore.canGoPrevious"
                :class="buttonClass(semesterStore.canGoPrevious)">
                <ChevronLeft :size="20" />
            </button>

            <div class="flex-1 text-center px-4">
                <h1 class="text-xl font-semibold text-[#3b3e45]">{{ semesterStore.currentSemester?.description }}</h1>
                <p class="text-sm text-[#666e7d] mt-1">{{ semesterStore.dateRange }}</p>
            </div>

            <button @click="semesterStore.nextSemester()" :disabled="!semesterStore.canGoNext"
                :class="buttonClass(semesterStore.canGoNext)">
                <ChevronRight :size="20" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useSemesterStore } from '@/store/semesterStore'

const semesterStore = useSemesterStore()
const emit = defineEmits(['semester-changed'])

const buttonClass = (canNavigate) => [
    'h-12 w-12 rounded-lg border border-[#dcdfe3] bg-white transition-colors flex items-center justify-center',
    canNavigate ? 'hover:bg-[#dcdfe3] cursor-pointer' : 'opacity-50 cursor-not-allowed'
]

// Emitir el semestre seleccionado cuando cambie
watch(() => semesterStore.currentSemester, (newSemester) => {
    if (newSemester) {
        emit('semester-changed', newSemester)
    }
}, { deep: true })

onMounted(async () => {
    // Solo cargar semestres si no están ya cargados
    if (semesterStore.availableSemesters.length === 0) {
        await semesterStore.loadSemesters()
    }
})
</script>