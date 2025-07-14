<template>
    <router-link to="/user">
        <div class="flex items-center hover:bg-gray-200 cursor-pointer rounded-md p-2 gap-2">
            <div class="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img v-if="(authStore.currentUser as any)?.photo" :src="(authStore.currentUser as any).photo"
                    alt="Foto de perfil" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <User :size="24" />
                </div>
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
import { User } from 'lucide-vue-next';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

onMounted(() => {
    // Solo cargar si no tenemos la información del usuario
    if (!authStore.currentUser && authStore.isAuthenticated) {
        authStore.fetchCurrentUser();
    }
});
</script>
