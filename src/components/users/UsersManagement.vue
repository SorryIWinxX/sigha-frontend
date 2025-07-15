<template>
    <div class="flex justify-between items-center py-4">
        <div class="w-1/3">
            <Search placeholder="Buscar usuarios" @search="handleSearch" />
        </div>

        <Button variant="primary" @click="openNewUserModal">
            <template #icon>
                <Plus :size="18" />
            </template>
            Nuevo usuario
        </Button>
    </div>
    <div class="w-full bg-white">
        <ListUsers ref="tableUsersRef" :searchQuery="searchQuery" />
    </div>

    <!-- NewUser Modal -->
    <CreateUser v-if="showNewUserModal" @close="closeNewUserModal" @userCreated="handleUserCreated" />
</template>

<script setup>
import { ref } from 'vue';
import Button from '@/components/ui/base/BaseButton.vue';
import { Plus } from 'lucide-vue-next';
import Search from '@/components/ui/base/BaseSearch.vue';
import ListUsers from '@/components/users/ListUsers.vue';
import CreateUser from '@/components/users/CreateUser.vue';

// Modal state
const showNewUserModal = ref(false);

// Search state
const searchQuery = ref('');

// Modal methods
const openNewUserModal = () => {
    showNewUserModal.value = true;
};

const closeNewUserModal = () => {
    showNewUserModal.value = false;
};

// Search methods
const handleSearch = (query) => {
    searchQuery.value = query;
};

const tableUsersRef = ref(null);

const handleUserCreated = () => {
    if (tableUsersRef.value) {
        tableUsersRef.value.loadUsers();
    }
};
</script>