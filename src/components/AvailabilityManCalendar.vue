<template>
    <div class="w-full h-full mt-4 text-gray-900 min-h-screen calendar-container">
        <!-- Header with title and tabs -->
        <div class="py-2">
            <!-- Navigation Tabs -->
            <NavegationTabs v-model="activeTab" :tabs="[
                { value: 'individual', label: 'Vista Individual', icon: UserIcon },
                { value: 'general', label: 'Vista General', icon: Users }
            ]" />
        </div>

        <!-- Tab Content -->
        <div class="mt-4">
            <!-- Vista Individual -->
            <AvailabilityIndividual v-if="activeTab === 'individual'" :selected-semester="props.selectedSemester" />

            <!-- Vista General -->
            <AvailabilityGeneral v-if="activeTab === 'general'" :selected-semester="props.selectedSemester" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User as UserIcon, Users } from 'lucide-vue-next'
import NavegationTabs from '@/components/common/NavegationTabs.vue'
import AvailabilityIndividual from '@/components/AvailabilityIndividual.vue'
import AvailabilityGeneral from '@/components/AvailabilityGeneral.vue'

// Props
const props = defineProps<{
    selectedSemester: any
}>()

// Estado reactivo
const activeTab = ref<'individual' | 'general'>('individual')
</script>
