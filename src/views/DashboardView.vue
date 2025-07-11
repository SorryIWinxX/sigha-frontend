<template>
    <MainLayout>
        <div class="flex justify-between items-center pb-4">
            <h1 class="text-2xl font-bold">Dashboard</h1>
            <SemesterSelector />
        </div>
        <Dashboard />
    </MainLayout>
</template>
<script setup lang="ts">
import MainLayout from '@/components/layout/MainLayout.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import Dashboard from '@/components/Dashboard.vue';
</script>