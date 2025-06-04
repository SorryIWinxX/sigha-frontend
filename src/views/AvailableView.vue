<template>
    <MainLayout>
        <div class="flex h-full flex-col">
            <div class="flex w-full pb-4 justify-between items-center">
                <h1 class="text-2xl font-bold text-gray-800">Disponibilidad</h1>
                <SemesterSelector />
            </div>
            <div class="flex-1 min-h-0 bg-white">
                <AvailabilityCalendar />
            </div>
        </div>
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