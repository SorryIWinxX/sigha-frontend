<template>
    <MainLayout>
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Horarios de Grupos</h1>
            <SemesterSelector />
        </div>
        <ScheduleGroups />
    </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/components/layout/MainLayout.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import ScheduleGroups from '@/components/ScheduleGroups.vue';
</script>