<template>
    <div class="relative w-full">
        <form @submit="handleSearch" class="w-full">
            <div
                class="flex items-center bg-white border border-gray-300 focus-within:shadow-[inset_0_0_0_2px_#67B83C] focus-within:border-transparent rounded-sm transition-all duration-200">
                <div class="flex items-center justify-center pl-4 pr-3">
                    <Search class="h-5 w-5 text-gray-400 peer-focus:text-primary-500" />
                </div>
                <input ref="searchInput" type="text" v-model="query" :placeholder="placeholder" @focus="isOpen = true"
                    @blur="handleBlur" @keydown="handleKeyDown"
                    class="peer flex-1 py-2 pr-4 text-gray-700 placeholder:text-md placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0" />
            </div>
        </form>

        <!-- Dropdown de resultados -->
        <div v-if="isOpen && (filteredResults.length > 0 || query.length > 0)"
            class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-sm shadow-lg z-50 max-h-80 overflow-y-auto">

            <!-- Resultados de búsqueda -->
            <div v-if="filteredResults.length > 0">
                <div class="px-3 py-2 text-sm font-semibold text-primary-500 bg-gray-50 border-b-2">
                    Resultados ({{ filteredResults.length }})
                </div>
                <div v-for="(result, index) in filteredResults" :key="`${result.category}-${result.id}`" :class="[
                    'flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors',
                    index === selectedIndex ? 'bg-gray-100' : ''
                ]" @mousedown="selectResult(result)" @mouseenter="selectedIndex = index">
                    <component v-if="result.icon" :is="result.icon" :size="16" class="mr-3 text-gray-400" />
                    <div class="flex-1">
                        <div class="font-medium text-gray-900" v-html="highlightText(result.title)"></div>
                        <div v-if="result.description" class="text-sm text-gray-500"
                            v-html="highlightText(result.description)"></div>
                    </div>
                    <div class="text-xs text-gray-400 ml-2">{{ result.category }}</div>
                </div>
            </div>

            <!-- Sin resultados -->
            <div v-else-if="query.length > 0" class="px-3 py-4 text-center text-gray-500">
                <Search :size="20" class="mx-auto mb-2 text-gray-300" />
                <div class="text-sm">No se encontraron resultados para "{{ query }}"</div>
            </div>

            <!-- Sugerencias cuando no hay búsqueda -->
            <div v-else-if="query.length === 0">
                <div class="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                    Accesos rápidos
                </div>
                <div v-for="(suggestion, index) in quickAccessItems" :key="`quick-${suggestion.id}`" :class="[
                    'flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors',
                    index === selectedIndex ? 'bg-blue-50' : ''
                ]" @mousedown="selectResult(suggestion)" @mouseenter="selectedIndex = index">
                    <component v-if="suggestion.icon" :is="suggestion.icon" :size="16" class="mr-3 text-gray-400" />
                    <div class="flex-1">
                        <div class="font-medium text-gray-900">{{ suggestion.title }}</div>
                        <div v-if="suggestion.description" class="text-sm text-gray-500">{{ suggestion.description }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePermissions } from '@/composables/usePermissions'
import { useAuthStore } from '@/store/authStore'
import {
    Search,
    CalendarCog,
    CalendarRange,
    Users,
    Settings,
    Blocks,
    HelpCircle,
    SquareLibrary,
    LogOut,
    CalendarDays,
    User,
    GraduationCap,
    FileText,
    Calendar,
    Clock,
    BookOpen,
    UserCog
} from 'lucide-vue-next'

// Interfaces
interface SearchResult {
    id: string
    title: string
    description?: string
    category: string
    icon?: any
    action: () => void
    keywords: string[]
}

// Props
const props = defineProps({
    placeholder: {
        type: String,
        default: 'Buscar en el sistema...'
    }
})

// Composables
const router = useRouter()
const { isProfesor, isAdmin } = usePermissions()
const authStore = useAuthStore()

// Estado reactivo
const query = ref('')
const isOpen = ref(false)
const selectedIndex = ref(0)
const searchInput = ref<HTMLInputElement>()

// Función para navegar
const navigateTo = (path: string) => {
    router.push(path)
    closeSearch()
}

// Función para ejecutar acción
const executeAction = (action: () => void) => {
    action()
    closeSearch()
}

// Cerrar búsqueda
const closeSearch = () => {
    isOpen.value = false
    query.value = ''
    selectedIndex.value = 0
}

// Todas las opciones de búsqueda
const searchItems = computed((): SearchResult[] => {
    const items: SearchResult[] = []

    // Elementos para profesores
    if (isProfesor.value) {
        items.push(
            {
                id: 'available',
                title: 'Disponibilidad',
                description: 'Gestionar mi disponibilidad horaria',
                category: 'Profesor',
                icon: CalendarCog,
                action: () => navigateTo('/available'),
                keywords: ['disponibilidad', 'horario', 'calendario', 'profesor', 'disponible', 'clases']
            }
        )
    }

    // Elementos para administradores
    if (isAdmin.value) {
        items.push(
            {
                id: 'schedule-groups',
                title: 'Horarios de Grupos',
                description: 'Gestionar horarios de grupos y materias',
                category: 'Administración',
                icon: CalendarDays,
                action: () => navigateTo('/schedule-groups'),
                keywords: ['horarios', 'grupos', 'materias', 'calendario', 'programación', 'asignación']
            },
            {
                id: 'groups',
                title: 'Grupos',
                description: 'Gestionar grupos de estudiantes',
                category: 'Administración',
                icon: Blocks,
                action: () => navigateTo('/groups'),
                keywords: ['grupos', 'estudiantes', 'clases', 'gestión', 'administrar']
            },
            {
                id: 'areas-subjects',
                title: 'Áreas y Materias',
                description: 'Configurar áreas de conocimiento y materias',
                category: 'Administración',
                icon: SquareLibrary,
                action: () => navigateTo('/areas-subjects'),
                keywords: ['áreas', 'materias', 'asignaturas', 'conocimiento', 'configuración', 'currículum']
            },
            {
                id: 'available-management',
                title: 'Disponibilidades',
                description: 'Ver disponibilidad de profesores',
                category: 'Administración',
                icon: CalendarRange,
                action: () => navigateTo('/available-management'),
                keywords: ['disponibilidad', 'profesores', 'docentes', 'horarios', 'asignación']
            },
            {
                id: 'users',
                title: 'Usuarios',
                description: 'Gestionar usuarios del sistema',
                category: 'Administración',
                icon: Users,
                action: () => navigateTo('/users'),
                keywords: ['usuarios', 'profesores', 'gestión', 'permisos', 'roles', 'personal']
            },
            {
                id: 'settings',
                title: 'Configuración',
                description: 'Configuración del sistema',
                category: 'Administración',
                icon: Settings,
                action: () => navigateTo('/settings'),
                keywords: ['configuración', 'ajustes', 'sistema', 'parámetros', 'semestre', 'documentos']
            }
        )
    }

    // Elementos comunes
    items.push(
        {
            id: 'profile',
            title: 'Mi Perfil',
            description: 'Ver y editar información personal',
            category: 'Cuenta',
            icon: User,
            action: () => navigateTo('/user'),
            keywords: ['perfil', 'cuenta', 'personal', 'información', 'datos', 'usuario']
        },
        {
            id: 'help',
            title: 'Ayuda',
            description: 'Obtener ayuda y soporte',
            category: 'Soporte',
            icon: HelpCircle,
            action: () => {
                // Aquí podrías abrir un modal de ayuda o redirigir a documentación
                console.log('Abrir ayuda')
            },
            keywords: ['ayuda', 'soporte', 'documentación', 'guía', 'manual', 'apoyo']
        },
        {
            id: 'logout',
            title: 'Cerrar Sesión',
            description: 'Salir del sistema',
            category: 'Cuenta',
            icon: LogOut,
            action: () => {
                authStore.clearToken()
                localStorage.removeItem('activeRole')
                navigateTo('/login')
            },
            keywords: ['cerrar', 'salir', 'logout', 'desconectar', 'terminar']
        }
    )

    // Elementos adicionales basados en funcionalidades específicas
    if (isAdmin.value) {
        items.push(
            {
                id: 'semester-config',
                title: 'Configuración de Semestres',
                description: 'Gestionar períodos académicos',
                category: 'Configuración',
                icon: Calendar,
                action: () => navigateTo('/settings'),
                keywords: ['semestre', 'período', 'académico', 'fechas', 'configuración']
            },
            {
                id: 'document-config',
                title: 'Tipos de Documento',
                description: 'Configurar tipos de documentos de identidad',
                category: 'Configuración',
                icon: FileText,
                action: () => navigateTo('/settings'),
                keywords: ['documentos', 'identidad', 'cédula', 'tipos', 'configuración']
            }
        )
    }

    return items
})

// Resultados filtrados
const filteredResults = computed((): SearchResult[] => {
    if (!query.value.trim()) {
        return []
    }

    const searchTerm = query.value.toLowerCase().trim()

    return searchItems.value.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchTerm)
        const descriptionMatch = item.description?.toLowerCase().includes(searchTerm)
        const keywordMatch = item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))

        return titleMatch || descriptionMatch || keywordMatch
    })
})

// Accesos rápidos (elementos más usados)
const quickAccessItems = computed((): SearchResult[] => {
    const quick: SearchResult[] = []

    if (isProfesor.value) {
        quick.push(searchItems.value.find(item => item.id === 'available')!)
    }

    if (isAdmin.value) {
        quick.push(
            searchItems.value.find(item => item.id === 'schedule-groups')!,
            searchItems.value.find(item => item.id === 'groups')!,
            searchItems.value.find(item => item.id === 'users')!
        )
    }

    quick.push(
        searchItems.value.find(item => item.id === 'profile')!,
        searchItems.value.find(item => item.id === 'settings')!
    )

    return quick.filter(Boolean)
})

// Resaltar texto
const highlightText = (text: string): string => {
    if (!query.value.trim()) {
        return text
    }

    const searchTerm = query.value.trim()
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark class="bg-primary-200 px-1 rounded">$1</mark>')
}

// Manejar selección
const selectResult = (result: SearchResult) => {
    result.action()
}

// Manejar teclas
const handleKeyDown = (event: KeyboardEvent) => {
    const maxIndex = (filteredResults.value.length > 0 ? filteredResults.value.length : quickAccessItems.value.length) - 1

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault()
            selectedIndex.value = Math.min(selectedIndex.value + 1, maxIndex)
            break
        case 'ArrowUp':
            event.preventDefault()
            selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
            break
        case 'Enter':
            event.preventDefault()
            if (filteredResults.value.length > 0) {
                selectResult(filteredResults.value[selectedIndex.value])
            } else if (quickAccessItems.value.length > 0) {
                selectResult(quickAccessItems.value[selectedIndex.value])
            }
            break
        case 'Escape':
            closeSearch()
            searchInput.value?.blur()
            break
    }
}

// Manejar blur
const handleBlur = () => {
    // Delay para permitir clicks en los resultados
    setTimeout(() => {
        isOpen.value = false
    }, 200)
}

// Manejar envío del formulario
const handleSearch = (e: Event) => {
    e.preventDefault()
    if (filteredResults.value.length > 0) {
        selectResult(filteredResults.value[0])
    }
}

// Reset índice cuando cambian los resultados
computed(() => {
    selectedIndex.value = 0
})
</script>

<style scoped>
mark {
    background-color: #fef08a;
    padding: 0 2px;
    border-radius: 2px;
}
</style>