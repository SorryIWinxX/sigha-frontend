<template>
    <MainLayout>
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Horarios de Grupos</h1>
            <SemesterSelector @semester-changed="onSemesterChanged" />
        </div>
        <ScheduleGroups :semester-id="currentSemesterId" />
    </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '@/components/layout/MainLayout.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import ScheduleGroups from '@/components/ScheduleGroups.vue';
import { useSemesterStore } from '@/store/semesterStore'
import type { Semester } from '@/types/semester'

const semesterStore = useSemesterStore()
const currentSemesterId = ref(semesterStore.currentSemester?.id || null)

const onSemesterChanged = (semester: Semester | null) => {
    currentSemesterId.value = semester?.id || null
}
</script>