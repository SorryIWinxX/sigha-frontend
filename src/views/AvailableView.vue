<template>
    <MainLayout>
        <div class="flex h-full flex-col overflow-hidden">
            <div class="flex w-full pb-4 justify-between items-center flex-shrink-0">
                <h1 class="text-2xl font-bold text-gray-800">Disponibilidad</h1>
                <SemesterSelector @semester-changed="onSemesterChanged" />
            </div>
            <div class="flex-1 min-h-0 bg-white overflow-hidden">
                <AvailabilityCalendar v-if="selectedSemester" :semester-id="selectedSemester.id" />
                <div v-else class="flex items-center justify-center h-full">
                    <div class="text-gray-500">Selecciona un semestre para configurar tu disponibilidad</div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import AvailabilityCalendar from '@/components/AvailabilityCalendar.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import MainLayout from '@/components/layout/MainLayout.vue';

const selectedSemester = ref(null)

const onSemesterChanged = (semester) => {
    selectedSemester.value = semester
    console.log('Semestre seleccionado:', semester)
}
</script>

<style>
/* Estilos adicionales si son necesarios */
</style>