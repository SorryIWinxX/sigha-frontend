<template>
    <div v-if="roleStore.canSwitchRoles" class="flex items-center">
        <div class="relative inline-flex items-center bg-gray-100 rounded-sm p-1">
            <!-- Opción Admin -->
            <button @click="switchToAdmin" :class="[
                'relative z-10 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200',
                roleStore.isAdminRole
                    ? 'bg-[#67B83C] text-white  border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
            ]">
                <div class="flex items-center gap-2">
                    <Settings :size="16" />
                    <span class="hidden sm:inline">Admin</span>
                </div>
            </button>

            <!-- Opción Profesor -->
            <button @click="switchToTeacher" :class="[
                'relative z-10 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200 ml-1',
                roleStore.isTeacherRole
                    ? 'bg-white text-gray-900 border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
            ]">
                <div class="flex items-center gap-2">
                    <GraduationCap :size="16" />
                    <span class="hidden sm:inline">Profesor</span>
                </div>
            </button>
        </div>

        <!-- Indicador de rol actual (texto) -->

    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, GraduationCap } from 'lucide-vue-next'
import { useRoleStore } from '@/store/roleStore'
import { useAuthStore } from '@/store/authStore'

const roleStore = useRoleStore()
const authStore = useAuthStore()
const router = useRouter()

const currentRoleDisplay = computed(() => {
    if (roleStore.isAdminRole) {
        return roleStore.activeRole === 'DIRECTOR DE ESCUELA' ? 'Director' : 'Coordinador'
    }
    return 'Profesor'
})

const switchToAdmin = () => {
    const userRoles = authStore.userRoles

    // Priorizar Director de Escuela, luego Coordinador Académico
    if (userRoles.includes('DIRECTOR DE ESCUELA')) {
        roleStore.setActiveRole('DIRECTOR DE ESCUELA')
    } else if (userRoles.includes('COORDINADOR ACADEMICO')) {
        roleStore.setActiveRole('COORDINADOR ACADEMICO')
    }
    window.location.href = '/available-management'


}

const switchToTeacher = () => {
    roleStore.setActiveRole('PROFESOR')
    window.location.href = '/available'

}
</script>