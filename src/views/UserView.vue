<template>
    <MainLayout>
        <div class="flex h-full flex-col">
            <div class="flex-1 min-h-0 overflow-auto">
                <h1 class="text-2xl font-bold text-gray-900 mb-4">Información de Usuario</h1>

                <div v-if="loading" class="flex justify-center items-center py-8">
                    <div class="text-gray-500">Cargando información del usuario...</div>
                </div>

                <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                    <div class="text-red-700">{{ error }}</div>
                </div>

                <form v-else @submit.prevent="saveUserInfo" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Left Column -->
                        <div class="space-y-4">
                            <!-- Información Personal -->
                            <div
                                class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                                <div class="p-4">
                                    <h2 class="text-lg font-medium text-gray-900 mb-3">Información Personal</h2>

                                    <div class="flex flex-col md:flex-row gap-4 mb-4">
                                        <!-- Foto de perfil -->
                                        <div class="flex flex-col items-center">
                                            <div
                                                class="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2">
                                                <img v-if="userInfo.photo" :src="userInfo.photo" alt="Foto de perfil"
                                                    class="w-full h-full object-cover" />
                                                <div v-else
                                                    class="w-full h-full flex items-center justify-center text-gray-400">
                                                    <User size="32" />
                                                </div>
                                            </div>
                                            <label for="photo-upload"
                                                class="cursor-pointer border border-gray-300 hover:border-gray-400 text-black px-2 py-1 rounded-md text-xs">
                                                Cambiar foto
                                            </label>
                                            <input id="photo-upload" type="file" accept="image/*" class="hidden"
                                                @change="handlePhotoUpload" />
                                        </div>

                                        <!-- Datos personales -->
                                        <div class="flex-1 grid grid-cols-1 gap-3">
                                            <div>
                                                <Input id="firstName" label="Nombres" v-model="userInfo.firstName"
                                                    type="text" required />
                                            </div>

                                            <div>
                                                <Input id="lastName" label="Apellidos" v-model="userInfo.lastName"
                                                    type="text" required />
                                            </div>

                                            <div>
                                                <label for="documento"
                                                    class="block text-sm font-medium text-gray-700 mb-1">Documento
                                                    de Identidad</label>
                                                <div class="flex gap-2">
                                                    <Select id="type-document" v-model="userInfo.id_type_document"
                                                        placeholder="Seleccionar tipo" width="w-auto"
                                                        class="min-w-[120px]">
                                                        <option v-for="tipo in tiposDocumento" :key="tipo.idSigla"
                                                            :value="tipo.idSigla">
                                                            {{ tipo.sigla }} - {{ tipo.description }}
                                                        </option>
                                                    </Select>
                                                    <Input id="documento" v-model="userInfo.documento" type="text"
                                                        placeholder="Número de documento" required class="flex-1" />
                                                </div>
                                            </div>

                                            <div>
                                                <label for="email"
                                                    class="block text-sm font-medium text-gray-700 mb-1">Correo
                                                    Electrónico</label>
                                                <Input id="email" v-model="userInfo.email" type="email" required />
                                            </div>

                                            <div>
                                                <label for="roles"
                                                    class="block text-sm font-medium text-gray-700 mb-1">Roles</label>
                                                <div id="roles"
                                                    class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                                    {{ userInfo.rolesDescriptions.join(', ') || 'Sin roles asignados' }}
                                                </div>
                                            </div>

                                            <div>
                                                <label for="isActive"
                                                    class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                                <div class="flex items-center">
                                                    <input id="isActive" type="checkbox" v-model="userInfo.isActive"
                                                        class="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                                    <span class="text-sm text-gray-700">
                                                        {{ userInfo.isActive ? 'Activo' : 'Inactivo' }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Información del Sistema -->
                            <div
                                class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                                <div class="p-4">
                                    <h2 class="text-lg font-medium text-gray-900 mb-3">Información del Sistema</h2>

                                    <div class="space-y-2 text-sm text-gray-600">
                                        <div>
                                            <span class="font-medium">ID de Usuario:</span> {{ userInfo.id }}
                                        </div>
                                        <div>
                                            <span class="font-medium">Fecha de Creación:</span> {{
                                                formatDate(userInfo.createAt) }}
                                        </div>
                                        <div>
                                            <span class="font-medium">Última Actualización:</span> {{
                                                formatDate(userInfo.updatedAt) }}
                                        </div>
                                        <div>
                                            <span class="font-medium">Último Login:</span> {{
                                                formatDate(userInfo.lastLogin) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column -->
                        <div class="space-y-4">
                            <!-- Cambio de Contraseña -->
                            <div
                                class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                                <div class="p-4">
                                    <h2 class="text-lg font-medium text-gray-900 mb-3">Cambio de Contraseña</h2>

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

                                        <button type="button" @click="changePassword"
                                            class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                            :disabled="!canChangePassword">
                                            Cambiar Contraseña
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex justify-end space-x-4 pt-2">
                        <button v-if="hasChanges" type="button" @click="resetForm"
                            class="px-4 py-2 bg-gray-500 text-white rounded-md cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            Cancelar
                        </button>
                        <button v-if="hasChanges" type="submit" :disabled="saving"
                            class="px-4 py-2 bg-[#67B83C] text-white rounded-md cursor-pointer hover:bg-[#69a14a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
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

// Estados de la aplicación
const loading = ref(true);
const error = ref('');
const saving = ref(false);

// Servicio de tipos de documento
const tipoDocumentoService = new TipoDocumentoService();
const tiposDocumento = ref([]);

// Datos del usuario
const userInfo = ref({
    id: 0,
    email: '',
    id_type_document: 1,
    documento: '',
    firstName: '',
    lastName: '',
    isActive: true,
    idsRoles: [],
    rolesDescriptions: [],
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
        userInfo.value.id_type_document !== originalUserInfo.value.id_type_document ||
        userInfo.value.isActive !== originalUserInfo.value.isActive
    );
});

// Cargar tipos de documento
const loadTiposDocumento = async () => {
    try {
        const tipos = await tipoDocumentoService.getTiposDocumento();
        tiposDocumento.value = tipos;
    } catch (err) {
        console.error('Error loading tipos de documento:', err);
    }
};

// Cargar datos del usuario
const loadUserData = async () => {
    try {
        loading.value = true;
        error.value = '';

        const userData = await userService.getCurrentUser();
        userInfo.value = { ...userData, photo: null }; // Agregamos photo como null por defecto
        originalUserInfo.value = JSON.parse(JSON.stringify(userData));

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

const changePassword = () => {
    if (!canChangePassword.value) {
        if (passwordChange.value.newPassword !== passwordChange.value.confirmPassword) {
            passwordError.value = 'Las contraseñas no coinciden';
        } else if (passwordChange.value.newPassword.length < 6) {
            passwordError.value = 'La contraseña debe tener al menos 6 caracteres';
        }
        return;
    }

    // Aquí iría la lógica para cambiar la contraseña
    // Por ejemplo, una llamada a una API
    console.log('Cambiando contraseña...');

    // Reiniciar campos de contraseña
    passwordChange.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    passwordError.value = '';

    // Mostrar mensaje de éxito (en un caso real usarías un sistema de notificaciones)
    alert('Contraseña cambiada con éxito');
};

const saveUserInfo = async () => {
    try {
        saving.value = true;
        error.value = '';

        const updateData = {
            id: userInfo.value.id,
            email: userInfo.value.email,
            id_type_document: userInfo.value.id_type_document,
            documento: userInfo.value.documento,
            firstName: userInfo.value.firstName,
            lastName: userInfo.value.lastName,
            isActive: userInfo.value.isActive,
            idsRoles: userInfo.value.idsRoles,
            rolesDescriptions: userInfo.value.rolesDescriptions
        };

        const updatedUser = await userService.updateUser(userInfo.value.id, updateData);

        // Actualizar los datos locales con la respuesta del servidor
        userInfo.value = { ...updatedUser, photo: userInfo.value.photo };
        originalUserInfo.value = JSON.parse(JSON.stringify(updatedUser));

        alert('Información guardada con éxito');

    } catch (err) {
        console.error('Error saving user data:', err);
        error.value = 'Error al guardar la información. Por favor, inténtelo de nuevo.';
    } finally {
        saving.value = false;
    }
};

const resetForm = () => {
    if (confirm('¿Estás seguro de que deseas cancelar los cambios?')) {
        if (originalUserInfo.value) {
            userInfo.value = { ...originalUserInfo.value, photo: userInfo.value.photo };
        }
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

// Cargar datos al montar el componente
onMounted(() => {
    loadUserData();
    loadTiposDocumento();
});
</script>
