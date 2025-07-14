<template>
    <Layout>
        <div class="flex justify-between items-center pb-4">
            <h1 class="text-2xl font-bold">Horarios de Grupos</h1>
            <SemesterSelector @semester-changed="onSemesterChanged" />
        </div>
        <GroupsSchedule :semester-id="currentSemesterId" />
    </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue';
import SemesterSelector from '@/components/SemesterSelector.vue';
import GroupsSchedule from '@/components/groups/GroupsSchedule.vue';
import { useSemesterStore } from '@/store/semesterStore'
import type { Semester } from '@/types/semester'

const semesterStore = useSemesterStore()
const currentSemesterId = ref(semesterStore.currentSemester?.id || null)

const onSemesterChanged = (semester: Semester | null) => {
    currentSemesterId.value = semester?.id || null
}
</script>