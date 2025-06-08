<template>
    <router-link to="/user">
        <div class="flex items-center hover:bg-gray-200 cursor-pointer rounded-md p-2 gap-2">
            <div class="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden shadow-sm">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar"
                    class="w-full h-full object-cover" />
            </div>
            <span class="text-gray-800 font-medium">{{ userDisplayName }}</span>
        </div>
    </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

const userDisplayName = computed(() => {
    const documento = authStore.userDocument;
    return documento ? `Usuario ${documento}` : 'Usuario';
});
</script>
