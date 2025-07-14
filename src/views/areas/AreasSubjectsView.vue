<template>
    <Layout>
        <div class="flex w-full pb-4">
            <h1 class="text-2xl font-bold text-gray-800">Areas y Materias</h1>
        </div>


        <div class="border border-gray-200 rounded-sm mt-4">
            <AreasConfiguration />
        </div>
    </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue';
import AreasConfiguration from '@/components/configuration/AreasConfiguration.vue';
</script>