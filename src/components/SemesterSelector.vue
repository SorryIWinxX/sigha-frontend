<template>
    <div class="flex flex-col items-center w-full max-w-md">
        <div v-if="loading" class="flex items-center justify-center py-4">
            <div class="text-sm text-gray-500">Cargando semestres...</div>
        </div>
        <div v-else-if="error" class="flex items-center justify-center py-4">
            <div class="text-sm text-red-500">Error al cargar semestres</div>
        </div>
        <div v-else class="flex items-center justify-between w-full">
            <button @click="previousSemester" :disabled="!canGoPrevious" :class="buttonClass(canGoPrevious)">
                <ChevronLeft :size="20" />
            </button>

            <div class="flex-1 text-center px-4">
                <h1 class="text-xl font-semibold text-[#3b3e45]">{{ currentSemester?.description }}</h1>
                <p class="text-sm text-[#666e7d] mt-1">{{ dateRange }}</p>
            </div>

            <button @click="nextSemester" :disabled="!canGoNext" :class="buttonClass(canGoNext)">
                <ChevronRight :size="20" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { SemesterService } from '@/services/semesterService'

const semesterService = new SemesterService()
const availableSemesters = ref([])
const currentSemesterIndex = ref(0)
const loading = ref(true)
const error = ref(false)

const emit = defineEmits(['semester-changed'])

const currentSemester = computed(() => availableSemesters.value[currentSemesterIndex.value])
const canGoPrevious = computed(() => currentSemesterIndex.value > 0)
const canGoNext = computed(() => currentSemesterIndex.value < availableSemesters.value.length - 1)

const buttonClass = (canNavigate) => [
    'h-12 w-12 rounded-lg border border-[#dcdfe3] bg-white transition-colors flex items-center justify-center',
    canNavigate ? 'hover:bg-[#dcdfe3] cursor-pointer' : 'opacity-50 cursor-not-allowed'
]

const dateRange = computed(() => {
    if (!currentSemester.value) return ''

    const format = (date) => new Date(date).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
    return `${format(currentSemester.value.startDate)} - ${format(currentSemester.value.endDate)}`
})

const previousSemester = () => {
    if (canGoPrevious.value) {
        currentSemesterIndex.value--
    }
}

const nextSemester = () => {
    if (canGoNext.value) {
        currentSemesterIndex.value++
    }
}

const loadSemesters = async () => {
    try {
        loading.value = true
        error.value = false
        const semesters = await semesterService.getSemesters()
        availableSemesters.value = semesters

        // Si hay semestres, seleccionar el primero por defecto
        if (semesters.length > 0) {
            currentSemesterIndex.value = 0
        }
    } catch (err) {
        console.error('Error loading semesters:', err)
        error.value = true
        availableSemesters.value = []
    } finally {
        loading.value = false
    }
}

// Emitir el semestre seleccionado cuando cambie
watch(currentSemester, (newSemester) => {
    if (newSemester) {
        emit('semester-changed', newSemester)
    }
}, { deep: true })

onMounted(() => {
    loadSemesters()
})
</script>