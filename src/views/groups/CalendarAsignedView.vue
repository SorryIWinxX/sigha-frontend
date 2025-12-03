<template>
    <Layout>
        <h1 class="text-2xl font-bold mb-4">Horario Asignado</h1>

        <div v-if="userId">
            <GroupsSchedule :docente-id="userId" :read-only="true" />
        </div>
        <div v-else class="p-4 bg-red-50 text-red-700 rounded">
            No se pudo identificar el usuario docente.
        </div>
    </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue';
import GroupsSchedule from '@/components/groups/GroupsSchedule.vue';
import { useAuthStore } from '@/store/authStore';
import { computed } from 'vue';

const authStore = useAuthStore();
const userId = computed(() => authStore.userId);
</script>
