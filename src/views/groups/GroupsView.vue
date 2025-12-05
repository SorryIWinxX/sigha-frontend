<template>
    <Layout>
        <div class="flex h-full flex-col">
            <div class="flex w-full pb-4 justify-between items-center flex-shrink-0">
                <h1 class="text-2xl font-bold text-gray-800">Grupos</h1>
                <SemesterSelector @semester-changed="onSemesterChanged" />
            </div>

            <div class="flex-1 bg-white">
                <GroupsList :semester-id="currentSemesterId" />
            </div>
        </div>

    </Layout>
</template>
<script setup>
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import SemesterSelector from '@/components/SemesterSelector.vue'
import GroupsList from '@/components/groups/GroupsList.vue'
import { useSemesterStore } from '@/store/semesterStore'

const semesterStore = useSemesterStore()
const currentSemesterId = ref(semesterStore.currentSemester?.id || null)

const onSemesterChanged = (semester) => {
    currentSemesterId.value = semester?.id || null
}
</script>
<style scoped></style>
