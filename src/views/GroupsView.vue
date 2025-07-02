<template>
    <MainLayout>
        <div class="flex h-full flex-col overflow-hidden">
            <div class="flex w-full pb-4 justify-between items-center flex-shrink-0">
                <h1 class="text-2xl font-bold text-gray-800">Grupos</h1>
                <SemesterSelector @semester-changed="onSemesterChanged" />
            </div>

            <div class="flex-1 min-h-0 bg-white overflow-hidden">
                <GroupsTable :semester-id="currentSemesterId" />
            </div>
        </div>

    </MainLayout>
</template>
<script setup>
import { ref } from 'vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import SemesterSelector from '@/components/SemesterSelector.vue'
import GroupsTable from '@/components/GroupsTable.vue'
import { useSemesterStore } from '@/store/semesterStore'

const semesterStore = useSemesterStore()
const currentSemesterId = ref(semesterStore.currentSemester?.id || null)

const onSemesterChanged = (semester) => {
    currentSemesterId.value = semester?.id || null
}
</script>
<style scoped></style>
