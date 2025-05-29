<template>
    <div class="flex flex-col items-center w-full max-w-md">
        <div class="flex items-center justify-between w-full">
            <button @click="previousSemester" :disabled="!canGoPrevious" :class="buttonClass(canGoPrevious)">
                <ChevronLeft :size="20" />
            </button>

            <div class="flex-1 text-center px-4">
                <h1 class="text-xl font-semibold text-[#3b3e45]">{{ currentSemester.name }}</h1>
                <p class="text-sm text-[#666e7d] mt-1">{{ dateRange }}</p>
            </div>

            <button @click="nextSemester" :disabled="!canGoNext" :class="buttonClass(canGoNext)">
                <ChevronRight :size="20" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const availableSemesters = ref([
    { id: '2024-I', name: 'Semestre 2024-I', startDate: '2024-03-15', endDate: '2024-07-31' },
    { id: '2024-II', name: 'Semestre 2024-II', startDate: '2024-08-15', endDate: '2024-12-15' },
    { id: '2025-I', name: 'Semestre 2025-I', startDate: '2025-03-15', endDate: '2025-07-31' }
])

const currentSemesterIndex = ref(1)
const emit = defineEmits(['semester-changed'])

const currentSemester = computed(() => availableSemesters.value[currentSemesterIndex.value])
const canGoPrevious = computed(() => currentSemesterIndex.value > 0)
const canGoNext = computed(() => currentSemesterIndex.value < availableSemesters.value.length - 1)

const buttonClass = (canNavigate) => [
    'h-12 w-12 rounded-lg border border-[#dcdfe3] bg-white transition-colors flex items-center justify-center',
    canNavigate ? 'hover:bg-[#dcdfe3] cursor-pointer' : 'opacity-50 cursor-not-allowed'
]

const dateRange = computed(() => {
    const format = (date) => new Date(date).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
    return `${format(currentSemester.value.startDate)} - ${format(currentSemester.value.endDate)}`
})

const previousSemester = () => canGoPrevious.value && currentSemesterIndex.value--
const nextSemester = () => canGoNext.value && currentSemesterIndex.value++

watch(currentSemester, (newSemester) => emit('semester-changed', newSemester), { deep: true })
</script>