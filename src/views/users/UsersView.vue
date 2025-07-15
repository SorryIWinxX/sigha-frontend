<template>
    <Layout>
        <div class="flex w-full pb-4">
            <h1 class="text-2xl font-bold text-gray-800">Usuarios</h1>
        </div>

        <!-- Users Management -->
        <UsersManagement />

    </Layout>
</template>

<script setup>
import Layout from '@/components/layout/Layout.vue';
import UsersManagement from '@/components/users/UsersManagement.vue';

</script>