<template>
    <MainLayout>
        <div class="flex w-full pb-4">
            <h1 class="text-2xl font-bold text-gray-800">Areas y Materias</h1>
        </div>


        <div class="border border-gray-200 rounded-sm mt-4">
            <AreasConfig />
        </div>
    </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/components/layout/MainLayout.vue';
import AreasConfig from '@/components/AreasConfig.vue';
</script>