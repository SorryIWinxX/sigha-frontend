<template>
    <MainLayout>

        <div class="flex w-full pb-4">
            <h1 class="text-2xl font-bold text-gray-800">Configuraciónes del sistema</h1>
        </div>

        <div class="grid grid-cols-2  gap-4">
            <div class="border border-gray-200 rounded-sm mt-4">
                <SemesterConfig />
            </div>
            <div class=" border border-gray-200 rounded-sm mt-4">
                <DocumentConfig />
            </div>


        </div>


    </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/components/layout/MainLayout.vue';
import SemesterConfig from '@/components/SemesterConfig.vue';
import DocumentConfig from '@/components/DocumentConfig.vue';
import AreasConfig from '@/components/AreasConfig.vue';
</script>