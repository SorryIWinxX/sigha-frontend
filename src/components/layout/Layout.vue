<template>
    <div class="flex flex-col h-screen">
        <!-- Header/Navbar -->
        <header class="bg-white border-b border-[#DCDFE3]">
            <div class="flex justify-between items-center">
                <!-- Logo y branding -->
                <div class="flex items-center px-6 cursor-pointer" @click="router.push('/dashboard')">
                    <div class="flex items-center p-2">
                        <LogoSIGHA :width="50" :height="50" />
                    </div>
                    <div class="flex p-2">

                        <LogoUIS />
                    </div>
                    <div class="flex px-2">
                        <h1 class="font-bold text-center text-xl px-4 text-blue-500">{{ schoolName }}</h1>
                    </div>
                </div>

                <div class="w-1/3 items-center justify-center">
                    <GlobalSearch placeholder="Buscar en el sistema..." />
                </div>
                <div class="flex items-center justify-end px-2 gap-5">
                    <RoleToggle />

                    <div>
                        <Profile />
                    </div>
                    <div>
                        <Button variant="secondary" @click="logout">
                            <LogOut :size="20" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
        <!-- Main Content -->
        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <Sidebar />
            <!-- Main Content Area -->
            <main class="flex-1 overflow-auto">
                <div class="p-6">
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import LogoSIGHA from '@/components/logos/LogoSIGHA.vue';
import LogoUIS from '@/components/logos/LogoUIS.vue';
import Profile from '@/components/layout/Profile.vue';
import RoleToggle from '@/components/layout/RoleToggle.vue';
import { Bell, Settings, Calendar, LogOut } from 'lucide-vue-next';
import Sidebar from '@/components/layout/Sidebar.vue';
import GlobalSearch from '@/components/layout/GlobalSearch.vue';
import Button from '@/components/ui/base/BaseButton.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useRoleStore } from '@/store/roleStore';
import { onMounted } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const roleStore = useRoleStore();

// Environment variables
const schoolName = import.meta.env.VITE_SCHOOL

onMounted(() => {
    // Inicializar el rol activo cuando se monta el componente
    roleStore.loadFromStorage();
});

const logout = () => {
    // Limpiar el token del store de autenticación
    authStore.clearToken();
    // Limpiar el rol activo
    localStorage.removeItem('activeRole');
    // Redireccionar al login
    router.push('/login');
};
</script>