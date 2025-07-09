<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CalendarCog, CalendarRange, PanelLeftClose, PanelLeftOpen, Users, Settings, Blocks, HelpCircle, SquareLibrary, LogOut, CalendarDays } from 'lucide-vue-next';
import { usePermissions } from '@/composables/usePermissions';
import { useSidebarStore } from '@/store/sidebarStore';

const { isProfesor, isAdmin } = usePermissions();
const router = useRouter();
const sidebarStore = useSidebarStore();

// Control de animaciones - solo animar después del primer toggle
const hasBeenToggled = ref(false);

// Inicializar el store desde localStorage al montar el componente
onMounted(() => {
    sidebarStore.initializeFromStorage();
});

// Computed para obtener el estado del sidebar desde el store
const isSidebarOpen = computed(() => sidebarStore.isOpen);

// Computed para las clases de animación de iconos
const iconAnimationClasses = computed(() => {
    if (!hasBeenToggled.value) return 'animate__animated'; // Sin animación específica en la carga inicial

    return [
        'animate__animated',
        isSidebarOpen.value ? 'animate__fadeInLeft' : 'animate__fadeInRight'
    ];
});

// Computed para las clases de animación de texto
const textAnimationClasses = computed(() => {
    if (!hasBeenToggled.value || !isSidebarOpen.value) return '';

    return 'animate__animated animate__fadeIn';
});

// Computed para las clases de animación del título
const titleAnimationClasses = computed(() => {
    if (!hasBeenToggled.value || !isSidebarOpen.value) return '';

    return 'animate__animated animate__fadeIn';
});

// Computed para las clases de animación de los botones toggle
const toggleButtonAnimationClasses = computed(() => {
    if (!hasBeenToggled.value) return '';

    return 'animate__animated animate__fadeIn';
});

const toggleSidebar = () => {
    hasBeenToggled.value = true; // Marcar que se ha hecho toggle
    sidebarStore.toggleSidebar();
};

const handleLogout = () => {
    // Limpiar tokens y datos de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirigir al login
    router.push('/login');
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

        );
    }

    // Elementos para directores y coordinadores
    if (isAdmin.value) {
        items.push(
            {
                to: '/schedule-groups',
                icon: CalendarDays,
                label: 'Horarios de Grupos',
            },
            {
                to: '/groups',
                icon: Blocks,
                label: 'Grupos',
            },
            {
                to: '/areas-subjects',
                icon: SquareLibrary,
                label: 'Areas y Materias',
            },
            {
                to: '/available-teacher',
                icon: CalendarRange,
                label: 'Disponibilidades',
            },
            {
                to: '/users',
                icon: Users,
                label: 'Usuarios',
            },
            {
                to: '/settings',
                icon: Settings,
                label: 'Configuración',
            },


        );
    }

    return items;
});
</script>

<template>
    <aside
        :class="[isSidebarOpen ? 'w-60' : 'w-20', 'bg-gray-50 flex rounded-r-lg flex-col transition-all duration-300 ease-in-out']">
        <div :class="['flex p-4 items-center', isSidebarOpen ? 'justify-between' : 'justify-center']">
            <h1 v-if="isSidebarOpen" :class="['font-semibold', titleAnimationClasses]">Menu</h1>
            <button @click="toggleSidebar" class="p-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                <PanelLeftClose v-if="isSidebarOpen" :size="20" :class="toggleButtonAnimationClasses" />
                <PanelLeftOpen v-else :size="20" :class="toggleButtonAnimationClasses" />
            </button>
        </div>
        <nav class="flex-1">
            <ul>
                <li v-for="item in menuItems" :key="item.to">
                    <router-link :to="item.to"
                        :class="['flex items-center py-3 text-gray-600 hover:bg-gray-100 rounded-r-sm transition-colors', isSidebarOpen ? 'px-6' : 'px-4 justify-center']"
                        active-class="text-black font-semibold bg-gray-200 rounded-r-sm">
                        <component :is="item.icon" :class="[
                            isSidebarOpen ? 'mr-3' : 'mr-0',
                            iconAnimationClasses
                        ]" :size="20" />
                        <span v-if="isSidebarOpen" :class="textAnimationClasses">
                            {{ item.label }}
                        </span>
                    </router-link>
                </li>
            </ul>
        </nav>
        <div
            :class="['group flex items-center gap-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer', isSidebarOpen ? 'p-4 px-6' : 'p-4 justify-center']">
            <HelpCircle :class="iconAnimationClasses" />
            <span v-if="isSidebarOpen" :class="textAnimationClasses">
                Ayuda
            </span>
        </div>
        <div @click="handleLogout"
            :class="['group flex items-center gap-2 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer border-t border-gray-200', isSidebarOpen ? 'p-4 px-6' : 'p-4 justify-center']">
            <LogOut :class="iconAnimationClasses" />
            <span v-if="isSidebarOpen" :class="textAnimationClasses">
                Cerrar sesión
            </span>
        </div>
    </aside>
</template>
