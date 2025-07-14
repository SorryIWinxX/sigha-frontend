<template>
    <Layout>
        <div class="flex justify-between items-center pb-4">
            <h1 class="text-2xl font-bold">Dashboard</h1>
            <SemesterSelector />
        </div>
        <DashboardAdmin />
    </Layout>
</template>
<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import DashboardAdmin from '@/components/dashboard/DashboardAdmin.vue';
</script>