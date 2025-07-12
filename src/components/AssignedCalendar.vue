<template>
    <div class="w-full mx-auto  py-4 bg-white">
        <div
            class="flex flex-wrap gap-x-6 gap-y-2 justify-center items-center mb-6 p-4 border border-gray-200 rounded-md">
            <span v-for="subjectItem in uniqueSubjects" :key="subjectItem.name" class="flex items-center gap-2">
                <span :class="['w-4 h-4 rounded-full block', subjectItem.colorClass.split(' ')[0]]"></span>
                <span class="text-sm text-gray-700">{{ subjectItem.name }}</span>
            </span>
        </div>
        <div class="overflow-x-auto">
            <Calendar>
                <template #day-cell="{ day, hour }">
                    <div
                        class="h-16 border-b border-l border-gray-200 relative flex items-center justify-center transition-all group p-1">
                        <div v-if="getAssignment(day.value, hour.value)"
                            :class="['p-2 rounded-md shadow-md text-xs w-full h-full flex flex-col justify-center', getSubjectColorClass(getAssignment(day.value, hour.value).subject)]">
                            <p class="font-semibold">Grupo: {{ getAssignment(day.value, hour.value).groupNumber }}</p>
                            <p>Salón: {{ getAssignment(day.value, hour.value).classroom }}</p>
                            <p>Materia: {{ getAssignment(day.value, hour.value).subject }}</p>
                        </div>
                        <div v-else class="flex flex-col items-center justify-center w-full h-full">
                            <span class="text-xs transition-opacity opacity-0 group-hover:opacity-100 text-gray-400">
                                {{ formatHourShort(hour.value) }}
                            </span>
                        </div>
                    </div>
                </template>
            </Calendar>
        </div>
    </div>
</template>

<script setup>
import Calendar from '@/components/ui/Calendar.vue';
import { computed } from 'vue';

const dummyAssignments = [
    { day: 1, hour: 8, groupNumber: 'G1', classroom: 'A101', subject: 'Matemáticas' },
    { day: 2, hour: 10, groupNumber: 'G2', classroom: 'B203', subject: 'Física' },
    { day: 3, hour: 14, groupNumber: 'G3', classroom: 'C305', subject: 'Química' },
    { day: 5, hour: 16, groupNumber: 'G4', classroom: 'D407', subject: 'Programación' },
    { day: 4, hour: 9, groupNumber: 'G5', classroom: 'E501', subject: 'Historia' },
    { day: 1, hour: 11, groupNumber: 'G6', classroom: 'F601', subject: 'Arte' },
];

const subjectColors = {
    'Matemáticas': 'bg-red-200 text-red-800',
    'Física': 'bg-green-200 text-green-800',
    'Química': 'bg-blue-200 text-blue-800',
    'Programación': 'bg-yellow-200 text-yellow-800',
    'Historia': 'bg-purple-200 text-purple-800',
    'Arte': 'bg-pink-200 text-pink-800',
};

const uniqueSubjects = computed(() => {
    const subjects = new Set(dummyAssignments.map(a => a.subject));
    return Array.from(subjects).map(subjectName => ({
        name: subjectName,
        colorClass: subjectColors[subjectName] || 'bg-gray-200 text-gray-800'
    }));
});

function getAssignment(dayValue, hourValue) {
    return dummyAssignments.find(assignment => assignment.day === dayValue && assignment.hour === hourValue);
}

function getSubjectColorClass(subjectName) {
    return subjectColors[subjectName] || 'bg-gray-200 text-gray-800';
}

function formatHourShort(hourValue) {
    const hour = hourValue % 12 || 12;
    const ampm = hourValue < 12 ? 'a' : 'p';
    return `${hour}${ampm}`;
}
</script>
