<template>
    <MainLayout>
        <div class="flex w-full pb-4">
            <h1 class="text-2xl font-bold text-gray-800">Usuarios</h1>
        </div>

        <!-- Users Management -->
        <UsersManagement />

    </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/layout/MainLayout.vue';
import UsersManagement from '@/components/UsersManagement.vue';

</script>