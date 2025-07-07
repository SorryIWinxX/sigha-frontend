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
        <TableUsers ref="tableUsersRef" :searchQuery="searchQuery" />
    </div>

    <!-- NewUser Modal -->
    <NewUser v-if="showNewUserModal" @close="closeNewUserModal" @userCreated="handleUserCreated" />
</template>

<script setup>
import { ref } from 'vue';
import Button from '@/components/common/Button.vue';
import { Plus } from 'lucide-vue-next';
import Search from '@/components/common/Search.vue';
import TableUsers from '@/components/TableUsers.vue';
import NewUser from '@/components/NewUser.vue';

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