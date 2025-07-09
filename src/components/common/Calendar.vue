<template>
    <div class="grid grid-cols-8 h-[calc(100vh-16rem)] overflow-y-auto">
        <!-- Encabezados -->
        <div
            class="h-14 flex items-center justify-center font-bold border-b border-gray-200 sticky top-0 z-20 bg-white">
        </div>
        <div v-for="day in days" :key="`header-${day.value}`"
            class="h-14 sticky top-0 z-20 flex items-center justify-center bg-white font-bold border-b border-l border-gray-200 text-gray-800 cursor-pointer hover:bg-[#67B83C] hover:text-white transition-colors relative"
            @click="$emit('day-header-clicked', day.value)">
            {{ day.label }}
        </div>

        <!-- Filas de horas -->
        <template v-for="hour in hours" :key="hour.value">
            <!-- Celda de hora -->
            <div :class="[
                'flex items-center justify-center border-b border-gray-200 text-xs text-gray-500 font-semibold',
                cellHeight
            ]">
                {{ hour.label }}
            </div>

            <!-- Celdas de días para esta hora -->
            <template v-for="day in days" :key="`${day.value}-${hour.value}`">
                <!-- Uso del slot para cada celda de día -->
                <slot name="day-cell" :day="day" :hour="hour">
                    <div :class="[
                        'border-b border-l border-gray-200 relative flex items-center justify-center transition-all group',
                        cellHeight
                    ]">
                        <div class="flex flex-col items-center justify-center w-full h-full">
                            <span class="text-xs transition-opacity opacity-0 group-hover:opacity-100 text-gray-400">
                                {{ formatHourShort(hour.value) }}
                            </span>
                        </div>
                    </div>
                </slot>
            </template>
        </template>
    </div>
</template>

<script setup>
// Props
const props = defineProps({
    cellHeight: {
        type: String,
        default: 'h-14' // 56px por defecto
    }
});

const emit = defineEmits(['day-header-clicked']);

const days = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' }
];

const hours = generateHours();

function generateHours() {
    const hours = [];
    for (let i = 6; i <= 22; i++) {
        const startHour = i % 12 || 12;
        const endHour = (i + 1) % 12 || 12;
        const startAmpm = i < 12 ? 'AM' : 'PM';
        const endAmpm = (i + 1) < 12 ? 'AM' : 'PM';
        hours.push({
            value: i,
            label: `${startHour}:00 ${startAmpm} - ${endHour}:00 ${endAmpm}`
        });
    }
    return hours;
}

function formatHourShort(hourValue) {
    const startHour = hourValue % 12 || 12;
    const endHour = (hourValue + 1) % 12 || 12;
    const startAmpm = hourValue < 12 ? 'AM' : 'PM';
    const endAmpm = (hourValue + 1) < 12 ? 'AM' : 'PM';
    return `${startHour}:00 ${startAmpm} - ${endHour}:00 ${endAmpm}`;
}
</script>