<script setup lang="ts">
import { ref, computed } from 'vue';
import { CalendarCog, CalendarRange, PanelLeftClose, PanelLeftOpen, Users, Settings, UsersRound } from 'lucide-vue-next';
import { usePermissions } from '@/composables/usePermissions';

const isSidebarOpen = ref(true);
const { isProfesor, isAdmin } = usePermissions();

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const menuItems = computed(() => {
    const items = [];

    // Elementos para profesores
    if (isProfesor.value) {
        items.push(
            {
                to: '/available',
                icon: CalendarCog,
                label: 'Disponibilidad',
            },
            {
                to: '/calendar-asigned',
                icon: CalendarRange,
                label: 'Calendario asignado',
            }
        );
    }

    // Elementos para directores y coordinadores
    if (isAdmin.value) {
        items.push(
            {
                to: '/groups',
                icon: UsersRound,
                label: 'Grupos',
            },
            {
                to: '/users',
                icon: Users,
                label: 'Usuarios',
            },
            {
                to: '/admin/settings',
                icon: Settings,
                label: 'Configuración',
            }
        );
    }

    return items;
});
</script>

<template>
    <aside
        :class="[isSidebarOpen ? 'w-60' : 'w-20', 'bg-gray-50 flex rounded-r-lg flex-col transition-all duration-300 ease-in-out']">
        <div :class="['flex p-4 items-center', isSidebarOpen ? 'justify-between' : 'justify-center']">
            <h1 v-if="isSidebarOpen" class=" font-semibold">Menu</h1>
            <button @click="toggleSidebar" class="p-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                <PanelLeftClose v-if="isSidebarOpen" :size="20" />
                <PanelLeftOpen v-else :size="20" />
            </button>
        </div>
        <nav class="flex-1">
            <ul>
                <li v-for="item in menuItems" :key="item.to">
                    <router-link :to="item.to"
                        :class="['flex items-center py-3 text-gray-600 hover:bg-gray-100 rounded-r-sm transition-colors', isSidebarOpen ? 'px-6' : 'px-4 justify-center']"
                        active-class="text-black font-semibold bg-gray-200 rounded-r-sm">
                        <component :is="item.icon" :class="isSidebarOpen ? 'mr-3' : 'mr-0'" :size="20" />
                        <span v-if="isSidebarOpen">{{ item.label }}</span>
                    </router-link>
                </li>
            </ul>
        </nav>
        <div
            :class="['group flex items-center gap-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer', isSidebarOpen ? 'p-4 px-6' : 'p-4 justify-center']">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-help-circle group-hover:stroke-gray-800">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
            </svg>
            <span v-if="isSidebarOpen">Ayuda</span>
        </div>
    </aside>
</template>
