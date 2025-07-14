<template>
    <Layout>
        <div class="flex w-full pb-4">
            <h1 class="text-2xl font-bold text-gray-800">Usuarios</h1>
        </div>

        <!-- Users Management -->
        <ManagmentUser />

    </Layout>
</template>

<script setup>
import Layout from '@/components/layout/Layout.vue';
import ManagmentUser from '@/components/users/ManagmentUser.vue';

</script>