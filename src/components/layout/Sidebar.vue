<script setup lang="ts">
import { computed, onMounted, ref, type Component } from 'vue';
import { useRouter } from 'vue-router';
import { CalendarCog, CalendarRange, PanelLeftClose, PanelLeftOpen, Users, Settings, Blocks, HelpCircle, SquareLibrary, LogOut, CalendarDays, Home, ChevronDown, Earth, FileText } from 'lucide-vue-next';
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

// Estado abierto/cerrado para submenús, indexado por etiqueta del item padre
const openSubmenus = ref<Record<string, boolean>>({});

const isSubmenuOpen = (key: string) => {
    return !!openSubmenus.value[key];
};

const toggleSubmenu = (key: string) => {
    hasBeenToggled.value = true;
    openSubmenus.value[key] = !openSubmenus.value[key];
};

const handleLogout = () => {
    // Limpiar tokens y datos de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirigir al login
    router.push('/login');
};

type SidebarLinkItem = { to: string; icon: Component; label: string };
type SidebarParentItem = { icon: Component; label: string; submenu: SidebarLinkItem[] };
type SidebarItem = SidebarLinkItem | SidebarParentItem;

const menuItems = computed<SidebarItem[]>(() => {
    const items: SidebarItem[] = [];

    // Elementos para profesores
    if (isProfesor.value) {
        items.push({
            to: '/available',
            icon: CalendarCog,
            label: 'Disponibilidad',
        },
            {
                to: '/requests-teacher',
                icon: FileText,
                label: 'Solicitudes',
            },
            {
                to: '/calendar-asigned',
                icon: CalendarDays,
                label: 'Horario Asignado',
            }
        );
    }

    // Elementos para directores y coordinadores
    if (isAdmin.value) {
        items.push(
            { to: '/dashboard', icon: Home, label: 'Dashboard' },
            {
                icon: CalendarDays,
                label: 'Horarios de Grupos',
                submenu: [
                    { to: '/schedule-groups-teachers', icon: Users, label: 'Docentes' },
                    { to: '/schedule-groups', icon: Earth, label: 'General' },
                ],
            },
            { to: '/groups', icon: Blocks, label: 'Grupos' },
            { to: '/areas-subjects', icon: SquareLibrary, label: 'Areas y Materias' },
            { to: '/available-management', icon: CalendarRange, label: 'Disponibilidades' },
            { to: '/users', icon: Users, label: 'Usuarios' },
            { to: '/requests', icon: FileText, label: 'Solicitudes' },
            { to: '/settings', icon: Settings, label: 'Configuración' },

        );
    }

    return items;
});

const isParentItem = (item: SidebarItem): item is SidebarParentItem => {
    return 'submenu' in item;
};

const isLinkItem = (item: SidebarItem): item is SidebarLinkItem => {
    return 'to' in item;
};
</script>

<template>
    <aside
        :class="[isSidebarOpen ? 'w-60' : 'w-20', 'bg-gray-50 flex rounded-r-lg flex-col transition-all duration-300 ease-in-out']">
        <div :class="['flex p-4 items-center', isSidebarOpen ? 'justify-between' : 'justify-center']">
            <h1 v-if="isSidebarOpen" :class="['font-semibold']">Menu</h1>
            <button @click="toggleSidebar"
                class="p-2 rounded-md hover:bg-gray-100 hover:text-primary-500 transition-colors flex items-center">
                <PanelLeftClose v-if="isSidebarOpen" :size="20" />
                <PanelLeftOpen v-else :size="20" />
            </button>
        </div>
        <nav class="flex-1">
            <ul>
                <li v-for="item in menuItems" :key="item.label">
                    <!-- Item con submenú -->
                    <template v-if="isParentItem(item)">
                        <button type="button" @click="isSidebarOpen && toggleSubmenu(item.label)"
                            :class="['w-full flex items-center py-3  text-gray-600 hover:bg-gray-100 hover:text-primary-500 rounded-r-sm transition-colors', isSidebarOpen ? 'px-6' : 'px-4 justify-center']">
                            <component :is="item.icon" :class="[
                                isSidebarOpen ? 'mr-3' : 'mr-0',

                            ]" :size="20" />
                            <span v-if="isSidebarOpen" :class="['flex-1 text-left']">
                                {{ item.label }}
                            </span>
                            <ChevronDown v-if="isSidebarOpen" :size="16" :class="[
                                'transition-transform duration-200',
                                isSubmenuOpen(item.label) ? 'rotate-180' : 'rotate-0'
                            ]" />
                        </button>
                        <ul v-if="isSidebarOpen && isSubmenuOpen(item.label)"
                            class=" rounded-sm  border-t border-r border-l border-gray-200 mt-1 mr-4 ml-4">
                            <li v-for="sub in item.submenu" :key="sub.to">
                                <router-link :to="sub.to"
                                    :class="['flex items-center py-2 text-gray-600  hover:text-primary-500 hover:bg-gray-100 border-b border-gray-200 rounded-r-sm transition-colors', isSidebarOpen ? 'pl-10 pr-6' : 'px-4 justify-center']"
                                    active-class="text-white hover:text-primary-500  font-semibold bg-gray-700 rounded-r-sm">
                                    <component :is="sub.icon" :class="[
                                        isSidebarOpen ? 'mr-3' : 'mr-0',
                                    ]" :size="18" />
                                    <span v-if="isSidebarOpen">
                                        {{ sub.label }}
                                    </span>
                                </router-link>
                            </li>
                        </ul>
                    </template>

                    <!-- Item normal -->
                    <template v-else-if="isLinkItem(item)">
                        <router-link :to="item.to"
                            :class="['flex items-center py-3 text-gray-600 hover:bg-gray-100 hover:text-primary-500 rounded-r-sm transition-colors', isSidebarOpen ? 'px-6' : 'px-4 justify-center']"
                            active-class="text-white hover:text-primary-500 font-semibold bg-gray-700 rounded-r-sm">
                            <component :is="item.icon" :class="[
                                isSidebarOpen ? 'mr-3' : 'mr-0',
                            ]" :size="20" />
                            <span v-if="isSidebarOpen">
                                {{ item.label }}
                            </span>
                        </router-link>
                    </template>
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
