<template>
    <div class="w-full bg-white">
        <div class="border border-gray-200 rounded-sm">
            <table class="w-full">
                <thead class="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left">
                            <button @click="handleSort('name')"
                                class="flex items-center gap-2 text-gray-900 font-semibold cursor-pointer hover:text-green-600">
                                Nombre
                                <div v-if="sortConfig?.key === 'name'">
                                    <ChevronUp v-if="sortConfig.direction === 'asc'" class="w-4 h-4 text-green-600" />
                                    <ChevronDown v-else class="w-4 h-4 text-green-600" />
                                </div>
                                <div v-else class="flex flex-col">
                                    <ChevronUp class="w-4 h-4 text-gray-400 -mb-1" />
                                    <ChevronDown class="w-4 h-4 text-gray-400" />
                                </div>
                            </button>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-gray-900 font-semibold">Email</span>
                        </th>
                        <th class="px-6 py-3 text-center">
                            <button @click="handleSort('lastLogin')"
                                class="flex items-center gap-2 text-gray-900 font-semibold cursor-pointer hover:text-green-600">
                                Último ingreso
                                <div v-if="sortConfig?.key === 'lastLogin'">
                                    <ChevronUp v-if="sortConfig.direction === 'asc'" class="w-4 h-4 text-green-600" />
                                    <ChevronDown v-else class="w-4 h-4 text-green-600" />
                                </div>
                                <div v-else class="flex flex-col">
                                    <ChevronUp class="w-4 h-4 text-gray-400 -mb-1" />
                                    <ChevronDown class="w-4 h-4 text-gray-400" />
                                </div>
                            </button>
                        </th>
                        <th class="px-6 py-3 text-right">
                            <button @click="handleSort('permission')"
                                class="flex items-center justify-center gap-2 text-gray-900 font-semibold cursor-pointer hover:text-green-600">
                                Role
                                <div v-if="sortConfig?.key === 'permission'">
                                    <ChevronUp v-if="sortConfig.direction === 'asc'" class="w-4 h-4 text-green-600" />
                                    <ChevronDown v-else class="w-4 h-4 text-green-600" />
                                </div>
                                <div v-else class="flex flex-col">
                                    <ChevronUp class="w-4 h-4 text-gray-400 -mb-1" />
                                    <ChevronDown class="w-4 h-4 text-gray-400" />
                                </div>
                            </button>
                        </th>
                        <th class="px-6 py-3 text-right">
                            <button
                                class="flex items-center justify-center gap-2 text-gray-900 font-semibold cursor-pointer hover:text-green-600">
                                Activo
                            </button>
                        </th>
                        <th class="px-6 py-3 text-center">
                            <span class="text-gray-900 font-semibold">Acciones</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                    <!-- Loading state -->
                    <tr v-if="loading">
                        <td colspan="6" class="px-6 py-8 text-center">
                            <div class="flex items-center justify-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                <span class="ml-3 text-gray-600">Cargando usuarios...</span>
                            </div>
                        </td>
                    </tr>
                    <!-- Error state -->
                    <tr v-else-if="error && users.length === 0">
                        <td colspan="6" class="px-6 py-8 text-center">
                            <div class="text-red-600">
                                <p class="font-semibold">Error al cargar usuarios</p>
                                <p class="text-sm mt-1">{{ error }}</p>
                                <button @click="loadUsers"
                                    class="mt-3 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors">
                                    Reintentar
                                </button>
                            </div>
                        </td>
                    </tr>
                    <!-- Empty state -->
                    <tr v-else-if="!loading && filteredUsers.length === 0">
                        <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                            {{ props.searchQuery.trim() ? 'No se encontraron usuarios que coincidan con la búsqueda' :
                                'No se encontraron usuarios' }}
                        </td>
                    </tr>
                    <!-- User rows -->
                    <tr v-else v-for="(user, index) in paginatedUsers" :key="user.id" :class="[
                        'border-b border-gray-100 hover:bg-gray-50 ',
                        { 'bg-gray-50/30': index % 2 === 0 },
                        { 'border-b-0': index === paginatedUsers.length - 1 }
                    ]">
                        <td class="px-6 py-3">
                            <span class="text-gray-900 font-medium">{{ user.name }}</span>
                        </td>
                        <td class="px-6 py-3">
                            <span class="text-gray-600">{{ user.email }}</span>
                        </td>
                        <td class="px-6 py-3">
                            <span class="text-gray-500">{{ user.lastLogin }}</span>
                        </td>
                        <td class="px-3 py-1.5">
                            <span :class="[
                                'inline-flex items-center px-3 py-1.5 rounded-sm justify-center text-white text-sm',
                                user.permission === 'DIRECTOR DE ESCUELA' || user.permission === 'COORDINADOR ACADEMICO'
                                    ? 'bg-primary-500'
                                    : 'bg-slate-400'
                            ]">
                                {{ user.permission }}
                            </span>
                        </td>
                        <td class="px-6 py-3">
                            <div class="flex items-center justify-center">
                                <span :class="[
                                    'inline-flex items-center px-3 py-1.5 rounded-sm text-sm',
                                    user.isActive
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-danger-500 text-white'
                                ]">
                                    {{ user.isActive ? 'Activo' : 'Inactivo' }}
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-3">
                            <div class="relative flex items-center  justify-center">
                                <button @click="toggleDropdown(user.id)"
                                    class="h-9 w-9 p-0 border border-gray-200 text-gray-500 cursor-pointer hover:text-white hover:border-white rounded-sm flex items-center justify-center hover:bg-[#67b83c] hover:border-gray-300">
                                    <MoreHorizontal class="h-4 w-4 transition-colors duration-200" />
                                </button>
                                <div v-if="openDropdown === user.id" :class="[
                                    'absolute z-50 w-48 bg-white rounded-sm border border-gray-200 shadow-lg overflow-hidden',
                                    index >= paginatedUsers.length - 2 ? 'bottom-10 right-0' : 'top-10 right-0'
                                ]">
                                    <div class="py-1">
                                        <button @click.stop="viewUserDetails(user.id)"
                                            class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 cursor-pointer last:border-b-0">
                                            Ver detalles
                                        </button>
                                        <button @click.stop="editUser(user.id)"
                                            class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 cursor-pointer last:border-b-0">
                                            Editar usuario
                                        </button>
                                        <button @click.stop="toggleUserStatus(user.id, user.isActive)" :class="[
                                            'block w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer',
                                            user.isActive
                                                ? 'text-red-600 hover:bg-red-50'
                                                : 'text-green-600 hover:bg-green-50'
                                        ]">
                                            {{ user.isActive ? 'Deshabilitar usuario' : 'Habilitar usuario' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && users.length > 0"
            class="flex items-center justify-between mt-6 p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <div class="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <span>Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, totalUsers) }} de {{ totalUsers }}
                    usuarios</span>
                <span class="mx-2">|</span>
                <span>Mostrar</span>
                <Select :modelValue="itemsPerPage" class="w-15" @update:modelValue="handleItemsPerPageChange"
                    id="itemsPerPage" :options="itemsPerPageOptions" :searchable="false">
                </Select>
                <span>por página</span>
            </div>
            <div class="flex items-center space-x-1">
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" :class="[
                    'px-3 py-2 text-sm border rounded-sm flex items-center font-medium transition-all duration-200',
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                ]">
                    <ChevronLeft class="w-4 h-4 mr-1" />
                    Anterior
                </button>

                <div class="flex space-x-1">
                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                        'px-3 py-2 text-sm border rounded-sm font-medium transition-all duration-200 min-w-[40px] flex items-center justify-center',
                        page === currentPage
                            ? 'text-white border-transparent'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    ]" :style="page === currentPage ? { backgroundColor: '#67b83c' } : {}">
                        {{ page }}
                    </button>
                </div>

                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" :class="[
                    'px-3 py-2 text-sm border rounded-sm flex items-center font-medium transition-all duration-200',
                    currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                ]">
                    Siguiente
                    <ChevronRight class="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>

        <!-- User Details Modal -->
        <ShowUser v-if="showUserDetailsModal" :show="showUserDetailsModal" :userId="selectedUserId"
            @close="closeUserDetailsModal" />

        <!-- Edit User Modal -->
        <EditUser v-if="showEditUserModal" :show="showEditUserModal" :userId="selectedUserIdForEdit"
            @close="closeEditUserModal" @updated="handleUserUpdated" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import Select from '@/components/ui/base/BaseSelect.vue'
import ShowUser from '@/components/users/ShowUser.vue'
import EditUser from '@/components/users/EditUser.vue'
import { userService } from '@/services/userServices'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

// Props
const props = defineProps({
    searchQuery: {
        type: String,
        default: ''
    }
})

// Reactive data
const users = ref([])
const loading = ref(false)
const error = ref('')
const sortConfig = ref(null)
const openDropdown = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const itemsPerPageOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '100', value: 100 }
]
const showUserDetailsModal = ref(false)
const selectedUserId = ref(null)
const showEditUserModal = ref(false)
const selectedUserIdForEdit = ref(null)

// Computed properties
const filteredUsers = computed(() => {
    if (!props.searchQuery.trim()) {
        return users.value
    }

    const normalizeText = (text) => {
        return (text || '')
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
    }
    const query = normalizeText(props.searchQuery)
    return users.value.filter(user => {
        // Buscar en nombre
        const nameMatch = normalizeText(user.name).includes(query)

        // Buscar en email
        const emailMatch = normalizeText(user.email).includes(query)

        // Buscar en permisos/rol
        const permissionMatch = normalizeText(user.permission).includes(query)

        return nameMatch || emailMatch || permissionMatch
    })
})

const totalUsers = computed(() => filteredUsers.value.length)
const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const paginatedUsers = computed(() => {
    let sortedUsers = [...filteredUsers.value]

    if (sortConfig.value) {
        sortedUsers.sort((a, b) => {
            const aValue = a[sortConfig.value.key]
            const bValue = b[sortConfig.value.key]

            if (aValue < bValue) return sortConfig.value.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.value.direction === 'asc' ? 1 : -1
            return 0
        })
    }

    return sortedUsers.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

// Watch for search query changes
watch(() => props.searchQuery, () => {
    // Reset page to 1 when search query changes
    currentPage.value = 1
})

// Methods
const loadUsers = async () => {
    loading.value = true
    error.value = ''

    try {
        const apiUsers = await userService.getUsers()
        users.value = userService.formatUsersForTable(apiUsers)

    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error al cargar usuarios'
        showErrorToast(error.value)
    } finally {
        loading.value = false
    }
}

const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.value && sortConfig.value.key === key && sortConfig.value.direction === 'asc') {
        direction = 'desc'
    }
    sortConfig.value = { key, direction }
}

const toggleDropdown = (userId) => {
    openDropdown.value = openDropdown.value === userId ? null : userId
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const handleItemsPerPageChange = (value) => {
    itemsPerPage.value = parseInt(value)
    currentPage.value = 1 // Reset to first page when changing items per page
}

const viewUserDetails = (userId) => {
    selectedUserId.value = userId
    showUserDetailsModal.value = true
    openDropdown.value = null // Close the dropdown
}

const closeUserDetailsModal = () => {
    showUserDetailsModal.value = false
    selectedUserId.value = null
}

const editUser = (userId) => {
    selectedUserIdForEdit.value = userId
    showEditUserModal.value = true
    openDropdown.value = null // Close the dropdown
}

const closeEditUserModal = () => {
    showEditUserModal.value = false
    selectedUserIdForEdit.value = null
}

const handleUserUpdated = (updatedUser) => {
    // Refresh the users list to show the updated data
    loadUsers()
    showSuccessToast('La tabla de usuarios ha sido actualizada')
}

const toggleUserStatus = async (userId, currentStatus) => {
    try {
        const user = users.value.find(u => u.id === userId)
        if (!user) {
            showErrorToast('Usuario no encontrado')
            return
        }

        // Toggle the user status using the service method
        await userService.toggleUserStatus(parseInt(userId), !currentStatus)

        // Refresh the table
        await loadUsers()

        const statusText = !currentStatus ? 'habilitado' : 'deshabilitado'
        showSuccessToast(`Usuario ${statusText} exitosamente`)

        // Close dropdown
        openDropdown.value = null

    } catch (error) {
        showErrorToast('Error al cambiar el estado del usuario')
    }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    // Don't close if clicking on modal or if modal is open
    if (showUserDetailsModal.value) return

    if (!event.target.closest('.relative')) {
        openDropdown.value = null
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    loadUsers()
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// Expose methods to parent component
defineExpose({
    loadUsers,
    refreshUsers: loadUsers
})
</script>

<style scoped>
/* Remove custom checkbox styling since we're using the CheckBox component */
</style>