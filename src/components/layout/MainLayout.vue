<template>
    <div class="flex flex-col h-screen">
        <!-- Header/Navbar -->
        <header class="bg-white border-b border-[#DCDFE3]">
            <div class="flex justify-between items-center">
                <!-- Logo y branding -->
                <div class="flex items-center px-6">
                    <div class="flex items-center p-2">
                        <LogoSIGHA :width="50" :height="50" />
                    </div>
                    <div class="flex p-2">

                        <LogoUIS />
                    </div>
                </div>

                <div class="w-1/3 items-center justify-center">
                    <Search placeholder="Buscar" />
                </div>
                <div class="flex items-center justify-end px-2 gap-5">
                    <div>
                        <Settings />
                    </div>
                    <div>
                        <Bell />
                    </div>
                    <div>
                        <UserConfig />
                    </div>
                    <div>
                        <router-link to="/">
                            <Button @click="logout"
                                customClass="flex items-center cursor-pointer hover:bg-gray-200 rounded-md p-2">
                                <template #icon>
                                    <LogOut class="text-gray-700" :size="20" />
                                </template>
                            </Button>
                        </router-link>
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
import UserConfig from '@/components/UserConfig.vue';
import { Bell, Settings, Calendar, LogOut } from 'lucide-vue-next';
import Sidebar from '@/components/Sidebar.vue';
import Search from '@/components/common/Search.vue';
import Button from '@/components/common/Button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión
    // Por ejemplo, limpiar el token de autenticación del localStorage
    localStorage.removeItem('auth-token');
    // Redireccionar al login
    router.push('/login');
};
</script>