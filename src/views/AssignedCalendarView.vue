<template>
    <MainLayout>
        <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Calendario Asignado</h1>
            <div class="flex-grow">
                <AssignedCalendar />
            </div>
        </div>

    </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/layout/MainLayout.vue';
import AssignedCalendar from '@/components/AssignedCalendar.vue';
</script>
