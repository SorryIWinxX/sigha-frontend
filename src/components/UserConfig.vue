<template>
    <router-link to="/user">
        <div class="flex items-center hover:bg-gray-200 cursor-pointer rounded-md p-2 gap-2">
            <div class="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"></path>
                </svg>
            </div>
            <div class="flex flex-col">
                <span class="text-gray-800 font-medium text-sm">{{ authStore.userDisplayName }}</span>
                <span class="text-gray-500 text-xs">{{ authStore.userRolesDisplay }}</span>
            </div>
        </div>
    </router-link>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

onMounted(() => {
    // Solo cargar si no tenemos la información del usuario
    if (!authStore.currentUser && authStore.isAuthenticated) {
        authStore.fetchCurrentUser();
    }
});
</script>
