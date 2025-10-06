<template>
    <Layout>
        <div class="flex justify-between items-center pb-4">
            <h1 class="text-2xl font-bold text-gray-800">Solicitudes</h1>
            <SemesterSelector />
        </div>
        <div class="mt-4 h-[calc(100vh-180px)]">
            <Requests />
        </div>
    </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue';
import Requests from '@/components/requests/Requests.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
</script>