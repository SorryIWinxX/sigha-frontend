<template>
    <MainLayout>
        <div>

            <div class="min-h-screen">
                <div class="">
                    <h1 class="text-2xl font-bold text-gray-900 mb-6">Información de Usuario</h1>

                    <form @submit.prevent="saveUserInfo" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Left Column -->
                            <div class="space-y-6">
                                <!-- Información Personal -->
                                <div
                                    class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                                    <div class="p-6">
                                        <h2 class="text-lg font-medium text-gray-900 mb-4">Información Personal</h2>

                                        <div class="flex flex-col md:flex-row gap-6 mb-6">
                                            <!-- Foto de perfil -->
                                            <div class="flex flex-col items-center">
                                                <div
                                                    class="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-2">
                                                    <img v-if="userInfo.photo" :src="userInfo.photo"
                                                        alt="Foto de perfil" class="w-full h-full object-cover" />
                                                    <div v-else
                                                        class="w-full h-full flex items-center justify-center text-gray-400">
                                                        <User size="48" />
                                                    </div>
                                                </div>
                                                <label for="photo-upload"
                                                    class="cursor-pointer border border-gray-300 hover:border-gray-400 text-black px-3 py-1 rounded-md text-sm">
                                                    Cambiar foto
                                                </label>
                                                <input id="photo-upload" type="file" accept="image/*" class="hidden"
                                                    @change="handlePhotoUpload" />
                                            </div>

                                            <!-- Datos personales -->
                                            <div class="flex-1 grid grid-cols-1 gap-4">
                                                <div>

                                                    <Input id="nombres" label="Nombres" v-model="userInfo.nombres"
                                                        type="text" required />
                                                </div>

                                                <div>
                                                    <label for="cedula"
                                                        class="block text-sm font-medium text-gray-700 mb-1">Documento
                                                        de Identidad</label>
                                                    <div class="flex gap-2">
                                                        <select v-model="userInfo.documentType"
                                                            class="px-3 py-2 border border-[#dcdfe3] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#67B83C]">
                                                            <option value="CC">CC</option>
                                                            <option value="TI">TI</option>
                                                            <option value="TE">TE</option>
                                                        </select>
                                                        <Input id="cedula" v-model="userInfo.cedula" type="text"
                                                            placeholder="Número de documento" required class="flex-1" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label for="role"
                                                        class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                    <div id="role"
                                                        class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                                                        {{ userInfo.role }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Áreas Asignadas -->
                                <div
                                    class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                                    <div class="p-6">
                                        <h2 class="text-lg font-medium text-gray-900 mb-4">Áreas Asignadas</h2>

                                        <div class="flex flex-wrap gap-2">
                                            <div v-for="(area, index) in userInfo.areasAsignadas" :key="index"
                                                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {{ area }}
                                            </div>
                                            <div v-if="userInfo.areasAsignadas.length === 0"
                                                class="text-gray-500 text-sm">
                                                No hay áreas asignadas
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                                    <div class="p-6">
                                        <h2 class="text-lg font-medium text-gray-900 mb-4">Correos Electrónicos</h2>

                                        <div v-for="(email, index) in userInfo.emails" :key="index"
                                            class="flex items-center mb-3">
                                            <Input :id="`email-${index}`" v-model="userInfo.emails[index]" type="email"
                                                :aria-label="`Email ${index + 1}`" required class="flex-1" />
                                            <button type="button" @click="removeEmail(index)"
                                                class="ml-2 text-red-500 p-2"
                                                :aria-label="`Eliminar email ${index + 1}`">
                                                <Trash2 size="20" />
                                            </button>
                                        </div>

                                        <button type="button" @click="addEmail"
                                            class="mt-2 flex items-center text-primary font-medium">
                                            <PlusCircle size="20" class="mr-1" />
                                            Agregar correo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="space-y-6">
                                <!-- Emails -->


                                <!-- Números de Teléfono -->
                                <div
                                    class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                                    <div class="p-6">
                                        <h2 class="text-lg font-medium text-gray-900 mb-4">Números de Teléfono</h2>

                                        <div v-for="(phone, index) in userInfo.phones" :key="index"
                                            class="flex items-center mb-3">
                                            <Input :id="`phone-${index}`" v-model="userInfo.phones[index]" type="tel"
                                                :aria-label="`Teléfono ${index + 1}`" required class="flex-1" />
                                            <button type="button" @click="removePhone(index)"
                                                class="ml-2 text-red-500 p-2"
                                                :aria-label="`Eliminar teléfono ${index + 1}`">
                                                <Trash2 size="20" />
                                            </button>
                                        </div>

                                        <button type="button" @click="addPhone"
                                            class="mt-2 flex items-center text-primary font-medium">
                                            <PlusCircle size="20" class="mr-1" />
                                            Agregar teléfono
                                        </button>
                                    </div>
                                </div>

                                <!-- Cambio de Contraseña -->
                                <div
                                    class="border border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-sm overflow-hidden">
                                    <div class="p-6">
                                        <h2 class="text-lg font-medium text-gray-900 mb-4">Cambio de Contraseña</h2>

                                        <div class="space-y-4">
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
                        <div class="flex justify-end space-x-4">
                            <button v-if="hasChanges" type="submit"
                                class="px-4 py-2 bg-[#67B83C] text-white rounded-md cursor-pointer hover:bg-[#69a14a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/layout/MainLayout.vue';
import { ref, computed } from 'vue';
import { User, Trash2, PlusCircle } from 'lucide-vue-next';
import Input from '@/components/common/Input.vue';

// Datos del usuario
const userInfo = ref({
    nombres: 'Juan Carlos Pérez',
    cedula: '1234567890',
    documentType: 'CC',
    role: 'Desarrollador Senior',
    photo: null,
    emails: ['juancarlos@example.com', 'jcperez@empresa.com'],
    areasAsignadas: ['Desarrollo', 'Diseño'],
    phones: ['555-1234', '555-5678']
});

// Guardar copia del estado original para detectar cambios
const originalUserInfo = ref(JSON.parse(JSON.stringify(userInfo.value)));

// Áreas disponibles
const availableAreas = ref([
    'Desarrollo',
    'Diseño',
    'Marketing',
    'Ventas',
    'Recursos Humanos',
    'Administración',
    'Finanzas',
    'Soporte Técnico',
    'Atención al Cliente'
]);

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
    return JSON.stringify(userInfo.value) !== JSON.stringify(originalUserInfo.value);
});

// Métodos
const addEmail = () => {
    userInfo.value.emails.push('');
};

const removeEmail = (index) => {
    userInfo.value.emails.splice(index, 1);
};

const addPhone = () => {
    userInfo.value.phones.push('');
};

const removePhone = (index) => {
    userInfo.value.phones.splice(index, 1);
};

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

const saveUserInfo = () => {
    // Aquí iría la lógica para guardar la información del usuario
    // Por ejemplo, una llamada a una API
    console.log('Guardando información del usuario:', userInfo.value);

    // Actualizar el estado original después de guardar
    originalUserInfo.value = JSON.parse(JSON.stringify(userInfo.value));

    // Mostrar mensaje de éxito (en un caso real usarías un sistema de notificaciones)
    alert('Información guardada con éxito');
};

const resetForm = () => {
    // Aquí podrías recargar los datos originales del usuario desde el servidor
    // Por ahora, simplemente mostramos un mensaje
    if (confirm('¿Estás seguro de que deseas cancelar los cambios?')) {
        // Recargar datos originales
        userInfo.value = JSON.parse(JSON.stringify(originalUserInfo.value));
        console.log('Cancelando cambios...');
    }
};
</script>
