<template>
    <MainLayout>
        <div class="flex h-full flex-col">
            <div class="flex-1 min-h-0 overflow-auto">
                <!-- Header con avatar y título -->
                <div class="bg-white rounded-sm  border border-gray-300 p-4 mb-4">
                    <div class="flex items-start gap-4">
                        <!-- Avatar mejorado -->
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white">
                                <img v-if="userInfo.photo" :src="userInfo.photo" alt="Foto de perfil"
                                    class="w-full h-full object-cover" />
                                <div v-else class="w-full h-full flex items-center justify-center text-[#67B83C]">
                                    <User size="32" />
                                </div>
                            </div>
                            <label for="photo-upload"
                                class="flex items-center gap-1 bg-[#67B83C] hover:bg-[#69a14a] text-white px-3 py-1.5 rounded-md cursor-pointer transition-all text-sm font-medium">
                                <PlusCircle :size="18" />
                                Cambiar foto
                            </label>
                            <input id="photo-upload" type="file" accept="image/*" class="hidden"
                                @change="handlePhotoUpload" />
                        </div>

                        <!-- Información básica del header -->
                        <div class="flex-1">
                            <h1 class="text-xl font-bold text-gray-900">
                                {{ userInfo.firstName && userInfo.lastName ? `${userInfo.firstName}
                                ${userInfo.lastName}` : 'Información de Usuario' }}
                            </h1>
                            <p class="text-gray-600 ">{{ userInfo.email }}</p>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="inline-flex items-center px-2 py-0.5 rounded-sm font-medium"
                                    :class="userInfo.isActive ? 'bg-[#67B83C] text-white' : 'bg-gray-200 text-gray-800'">
                                    {{ userInfo.isActive ? 'Activo' : 'Inactivo' }}
                                </span>
                                <span class=" text-gray-500">ID: {{ userInfo.id }}</span>
                            </div>
                        </div>

                        <!-- Información del Sistema -->
                        <div class="min-w-[200px]">
                            <h3 class="text-md font-semibold text-gray-900 mb-2">Información del Sistema</h3>
                            <div class="space-y-2">
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium text-gray-600">Fecha de Creación</span>
                                    <span class="text-sm text-gray-900">{{ formatDate(userInfo.createAt) }}</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium text-gray-600">Última Actualización</span>
                                    <span class="text-sm text-gray-900">{{ formatDate(userInfo.updatedAt) }}</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium text-gray-600">Último Login</span>
                                    <span class="text-sm text-gray-900">{{ formatDate(userInfo.lastLogin) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Estado de cambios -->
                        <div v-if="hasChanges" class="text-right">
                            <div
                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                Cambios pendientes
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="loading" class="flex justify-center items-center py-8">
                    <div class="text-gray-500">Cargando información del usuario...</div>
                </div>

                <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <div class="text-red-700">{{ error }}</div>
                </div>

                <form v-else @submit.prevent="saveUserInfo" class="space-y-4">
                    <!-- Grid principal compacto -->
                    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4 xl:h-96">
                        <!-- Información Personal - 2 columnas -->
                        <div class="xl:col-span-2 h-full">
                            <div class="bg-white rounded-sm border border-gray-300 p-4 h-full flex flex-col">
                                <div class="flex items-center gap-2 mb-3">
                                    <h2 class="text-lg font-semibold text-gray-900">Información Personal</h2>
                                </div>

                                <div class="flex-1 flex flex-col justify-between">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <Input id="firstName" label="Nombres" v-model="userInfo.firstName"
                                                type="text" required />
                                        </div>

                                        <div>
                                            <Input id="lastName" label="Apellidos" v-model="userInfo.lastName"
                                                type="text" required />
                                        </div>

                                        <div>
                                            <Input id="email" label="Correo Electrónico" v-model="userInfo.email"
                                                type="email" required />
                                        </div>


                                    </div>

                                    <!-- Documento de identidad -->
                                    <div class="mt-3">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Documento de
                                            Identidad</label>
                                        <div class="grid grid-cols-3 gap-2">
                                            <Select id="type-document" v-model="userInfo.idTipoDocumento"
                                                placeholder="Tipo" class="col-span-1">
                                                <option v-for="tipo in tiposDocumento" :key="tipo.id" :value="tipo.id">
                                                    {{ tipo.sigla }}
                                                </option>
                                            </Select>
                                            <div class="col-span-2">
                                                <Input id="documento" v-model="userInfo.documento" type="text"
                                                    placeholder="Número de documento" required />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Roles -->
                                    <div class="mt-3">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Roles
                                            Asignados</label>
                                        <div
                                            class="min-h-[2.5rem] px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700 flex items-center">
                                            {{ userInfo.rolesDescriptions.join(', ') || 'Sin roles asignados' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cambio de Contraseña - 1 columna -->
                        <div class="h-full">
                            <div class="bg-white rounded-sm border border-gray-300 p-4 h-full flex flex-col">
                                <h2 class="text-lg font-semibold text-gray-900 mb-3">Cambio de Contraseña</h2>

                                <div class="flex-1 flex flex-col justify-between">
                                    <div class="space-y-3">
                                        <div>
                                            <Input id="current-password" label="Contraseña Actual"
                                                v-model="passwordChange.currentPassword" type="password" />
                                        </div>

                                        <div>
                                            <Input id="new-password" label="Nueva Contraseña"
                                                v-model="passwordChange.newPassword" type="password" />
                                        </div>

                                        <div>
                                            <Input id="confirm-password" label="Confirmar Contraseña"
                                                v-model="passwordChange.confirmPassword" type="password" />
                                        </div>

                                        <div v-if="passwordError" class="text-red-500 text-sm">
                                            {{ passwordError }}
                                        </div>
                                    </div>
                                    <Button @click="showPasswordConfirmation" variant="primary" customClass=""
                                        :disabled="!canChangePassword">
                                        Cambiar Contraseña
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <!-- Areas - 1 columna -->
                        <div class="max-h-[500px] overflow-y-auto">
                            <div class="bg-white rounded-sm border border-gray-300 p-4 h-full flex flex-col">
                                <div class="flex items-center gap-2 mb-3">
                                    <h2 class="text-lg font-semibold text-gray-900">Áreas Asignadas</h2>
                                </div>

                                <div class="flex-1 space-y-2 overflow-y-auto">
                                    <div v-for="area in userAreas" :key="area.id"
                                        class="flex items-center justify-between p-2 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm font-medium text-gray-900">{{ area.name }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="userAreas.length === 0"
                                    class="flex-1 flex items-center justify-center text-gray-500 text-sm">
                                    Sin áreas asignadas
                                </div>
                            </div>
                        </div>
                    </div>



                    <!-- Botones de acción fijos en la parte inferior -->
                    <div v-if="hasChanges" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div class="flex justify-between items-center">
                            <div class="text-sm text-gray-600">
                                Tienes cambios sin guardar
                            </div>
                            <div class="flex space-x-3">
                                <Button type="button" @click="showCancelConfirmation" variant="secondary">
                                    Cancelar
                                </Button>
                                <Button type="submit" :disabled="saving" variant="primary">
                                    {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Confirmation Modals -->
        <ConfirmationModal :isVisible="showCancelModal" title="Cancelar Cambios"
            message="¿Estás seguro de que deseas cancelar los cambios? Se perderán todos los datos no guardados."
            confirmText="Sí, cancelar" cancelText="No, continuar editando" confirmVariant="danger"
            cancelVariant="secondary" @confirm="confirmCancelChanges" @cancel="showCancelModal = false" />

        <ConfirmationModal :isVisible="showPasswordModal" title="Cambiar Contraseña"
            message="¿Estás seguro de que deseas cambiar tu contraseña? Esta acción no se puede deshacer."
            confirmText="Sí, cambiar" cancelText="Cancelar" confirmVariant="primary" cancelVariant="secondary"
            @confirm="confirmChangePassword" @cancel="showPasswordModal = false" />
    </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/layout/MainLayout.vue';
import { ref, computed, onMounted } from 'vue';
import { User, PlusCircle } from 'lucide-vue-next';
import Input from '@/components/common/Input.vue';
import Select from '@/components/common/Select.vue';
import { userService } from '@/services/userServices';
import { TipoDocumentoService } from '@/services/tipoDocumentoService';
import { useAreasStore } from '@/store/areasStore';
import { showSuccessToast } from '@/utils/toast.js';
import Button from '@/components/common/Button.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';

// Estados de la aplicación
const loading = ref(true);
const error = ref('');
const saving = ref(false);

// Estados para los modales de confirmación
const showCancelModal = ref(false);
const showPasswordModal = ref(false);

// Servicio de tipos de documento
const tipoDocumentoService = new TipoDocumentoService();
const tiposDocumento = ref([]);

// Store de áreas
const areasStore = useAreasStore();

// Áreas del usuario (ya no mock data)
const userAreas = ref([]);

// Datos del usuario
const userInfo = ref({
    id: 0,
    email: '',
    idTipoDocumento: 1,
    documento: '',
    firstName: '',
    lastName: '',
    isActive: true,
    idsRoles: [],
    rolesDescriptions: [],
    idAreas: [], // IDs de áreas asignadas al usuario
    createAt: '',
    updatedAt: '',
    lastLogin: '',
    photo: null // Campo adicional para la foto
});

// Guardar copia del estado original para detectar cambios
const originalUserInfo = ref();

// Cambio de contraseña
const passwordChange = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const passwordError = ref('');

// Computed para validar si se puede cambiar la contraseña
const canChangePassword = computed(() => {
    return (
        passwordChange.value.currentPassword &&
        passwordChange.value.newPassword &&
        passwordChange.value.confirmPassword &&
        passwordChange.value.newPassword === passwordChange.value.confirmPassword &&
        passwordChange.value.newPassword.length >= 6
    );
});

// Computed para verificar si ha habido cambios en el formulario
const hasChanges = computed(() => {
    if (!originalUserInfo.value) return false;

    return (
        userInfo.value.firstName !== originalUserInfo.value.firstName ||
        userInfo.value.lastName !== originalUserInfo.value.lastName ||
        userInfo.value.email !== originalUserInfo.value.email ||
        userInfo.value.documento !== originalUserInfo.value.documento ||
        userInfo.value.idTipoDocumento !== originalUserInfo.value.idTipoDocumento ||
        userInfo.value.isActive !== originalUserInfo.value.isActive ||
        JSON.stringify(userInfo.value.idAreas) !== JSON.stringify(originalUserInfo.value.idAreas)
    );
});

// Cargar tipos de documento
const loadTiposDocumento = async () => {
    try {
        const tipos = await tipoDocumentoService.getTiposDocumento();
        tiposDocumento.value = tipos;
    } catch (err) {
        console.error('Error loading tipos de documento:', err);
        // En caso de error, usar datos por defecto para no bloquear la UI
        tiposDocumento.value = [
            { id: 1, sigla: 'CC', description: 'Cédula de Ciudadanía' },
            { id: 2, sigla: 'CE', description: 'Cédula de Extranjería' },
            { id: 3, sigla: 'TI', description: 'Tarjeta de Identidad' },
            { id: 4, sigla: 'PAS', description: 'Pasaporte' }
        ];
    }
};

// Cargar áreas del usuario
const loadUserAreas = async () => {
    try {
        // Asegurar que las áreas están cargadas en el store
        if (!areasStore.isLoaded) {
            await areasStore.fetchAreas();
        }

        // Filtrar las áreas del usuario basándose en sus idAreas
        if (userInfo.value.idAreas && userInfo.value.idAreas.length > 0) {
            userAreas.value = userInfo.value.idAreas.map(areaId => {
                const area = areasStore.getAreaById(areaId);
                if (area) {
                    return {
                        id: area.id,
                        name: area.description,
                        color: getAreaColor(area.id), // Función para asignar colores
                        isActive: area.isActive || true
                    };
                }
                return null;
            }).filter(area => area !== null);
        } else {
            userAreas.value = [];
        }
    } catch (err) {
        console.error('Error loading user areas:', err);
        userAreas.value = [];
    }
};

// Función auxiliar para asignar colores a las áreas
const getAreaColor = (areaId) => {
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-orange-500',
        'bg-pink-500',
        'bg-yellow-500',
        'bg-indigo-500',
        'bg-red-500'
    ];
    return colors[areaId % colors.length];
};

// Cargar datos del usuario
const loadUserData = async () => {
    try {
        loading.value = true;
        error.value = '';

        const userData = await userService.getCurrentUser();
        userInfo.value = { ...userData, photo: null }; // Agregamos photo como null por defecto
        originalUserInfo.value = JSON.parse(JSON.stringify(userData));

        // Cargar las áreas del usuario después de cargar sus datos
        await loadUserAreas();

    } catch (err) {
        console.error('Error loading user data:', err);
        error.value = 'Error al cargar la información del usuario. Por favor, inténtelo de nuevo.';
    } finally {
        loading.value = false;
    }
};

// Métodos
const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userInfo.value.photo = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const changePassword = async () => {
    if (!canChangePassword.value) {
        if (passwordChange.value.newPassword !== passwordChange.value.confirmPassword) {
            passwordError.value = 'Las contraseñas no coinciden';
        } else if (passwordChange.value.newPassword.length < 6) {
            passwordError.value = 'La contraseña debe tener al menos 6 caracteres';
        }
        return;
    }

    try {
        passwordError.value = '';

        const passwordData = {
            documento: userInfo.value.documento,
            password: passwordChange.value.newPassword,
            lastPassword: passwordChange.value.currentPassword
        };

        await userService.changePassword(passwordData);

        // Reiniciar campos de contraseña
        passwordChange.value = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        showSuccessToast('Contraseña cambiada con éxito');

    } catch (err) {
        console.error('Error changing password:', err);
        passwordError.value = 'Error al cambiar la contraseña. Verifique que la contraseña actual sea correcta.';
    }
};

const saveUserInfo = async () => {
    try {
        saving.value = true;
        error.value = '';

        const updateData = {
            email: userInfo.value.email,
            idTipoDocumento: userInfo.value.idTipoDocumento,
            documento: userInfo.value.documento,
            firstName: userInfo.value.firstName,
            lastName: userInfo.value.lastName
        };

        const updatedUser = await userService.updateCurrentUser(updateData);

        window.location.reload();

    } catch (err) {
        console.error('Error saving user data:', err);
        error.value = 'Error al guardar la información. Por favor, inténtelo de nuevo.';
    } finally {
        saving.value = false;
    }
};

const resetForm = () => {
    if (originalUserInfo.value) {
        userInfo.value = { ...originalUserInfo.value, photo: userInfo.value.photo };
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
};

// Funciones para los modales de confirmación
const showCancelConfirmation = () => {
    showCancelModal.value = true;
};

const showPasswordConfirmation = () => {
    showPasswordModal.value = true;
};

const confirmCancelChanges = () => {
    showCancelModal.value = false;
    resetForm();
};

const confirmChangePassword = () => {
    showPasswordModal.value = false;
    changePassword();
};

// Cargar datos al montar el componente
onMounted(() => {
    loadUserData();
    loadTiposDocumento();
});
</script>
