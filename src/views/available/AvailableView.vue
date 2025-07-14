<template>
    <Layout>
        <div class="flex h-full flex-col overflow-hidden">
            <div class="flex w-full pb-4 justify-between items-center flex-shrink-0">
                <h1 class="text-2xl font-bold text-gray-800">Disponibilidad</h1>
                <SemesterSelector />
            </div>

            <div class="flex-1 min-h-0 bg-white overflow-hidden">
                <AvailabilityCalendar v-if="semesterStore.currentSemester"
                    :semester-id="semesterStore.currentSemester.id"
                    :semester-availability="semesterStore.currentSemester.availability" />
                <div v-else class="flex items-center justify-center h-full">
                    <div class="text-gray-500">Selecciona un semestre para configurar tu disponibilidad</div>
                </div>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import Layout from '@/components/layout/Layout.vue';
import { useSemesterStore } from '@/store/semesterStore'

const semesterStore = useSemesterStore()
</script>

<style>
/* Estilos adicionales si son necesarios */
</style>