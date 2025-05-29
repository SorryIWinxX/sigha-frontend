<template>
    <MainLayout>
        <div class="flex w-full">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Disponibilidad</h1>
        </div>
        <div class="flex justify-start py-4 items-start">
            <SemesterSelector />
        </div>

        <!-- Calendar Grid -->
        <AvailabilityCalendar />
    </MainLayout>
</template>

<script setup>
import AvailabilityCalendar from '@/components/AvailabilityCalendar.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import MainLayout from '@/components/layout/MainLayout.vue';
</script>

<style>
/* Estilos adicionales si son necesarios */
</style>