<template>
    <div class="flex justify-between items-center py-4">
        <div class="w-1/3">
            <Search />
        </div>

        <Button customClass="bg-[#67b83c] text-white py-2 px-4" @click="openNewUserModal">
            <template #icon>
                <Plus :size="20" />
            </template>
            Nuevo usuario
        </Button>
    </div>
    <div class="w-full bg-white">
        <TableUsers />
    </div>

    <!-- NewUser Modal -->
    <NewUser v-if="showNewUserModal" @close="closeNewUserModal" />
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

// Modal methods
const openNewUserModal = () => {
    showNewUserModal.value = true;
};

const closeNewUserModal = () => {
    showNewUserModal.value = false;
};
</script>