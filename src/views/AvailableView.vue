<template>
    <MainLayout>
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Disponibilidad</h1>
        <!-- Calendar Grid -->
        <AvailabilityCalendar />
    </MainLayout>
</template>

<script setup>
import AvailabilityCalendar from '@/components/AvailabilityCalendar.vue';
import MainLayout from '@/components/layout/MainLayout.vue';
</script>

<style>
/* Estilos adicionales si son necesarios */
</style>