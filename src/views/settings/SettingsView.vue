<template>
    <Layout>

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


    </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue';
import SemesterConfig from '@/components/configuration/SemesterConfiguration.vue';
import DocumentConfig from '@/components/configuration/DocumentConfiguration.vue';
</script>