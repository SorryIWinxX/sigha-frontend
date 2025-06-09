<template>
    <div class="w-full h-full flex flex-col overflow-hidden bg-white">
        <div v-if="internalSelectedSlots.length > 0"
            class="mb-4 p-4 bg-yellow-50 border-2 border-yellow-500 rounded-lg flex-shrink-0">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <Info :size="20" class="text-yellow-500" />
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                        Estado de Disponibilidad
                    </h3>
                    <div class="mt-1 text-sm text-yellow-700">
                        <p>La disponibilidad seleccionada será revisada por el coordinador académico. Dependiendo de su
                            decisión, la disponibilidad será aprobada o rechazada.</p>
                        <p class="mt-1">
                            <span
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">
                                Verde: Aprobada
                            </span>
                            <span
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                                Amarillo: Debe cambiar las áreas seleccionadas
                            </span>
                            <span
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Azul: Aun no se ha revisado
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4 flex-shrink-0">
            <div
                class="flex items-center justify-center border border-[#DCDFE3] rounded-sm px-4 py-2 text-sm text-gray-700">
                <span class="font-medium mr-1.5">Horas Seleccionadas:</span>
                <span
                    class="inline-flex items-center justify-center bg-[#67B83C] text-white rounded-full h-6 min-w-[24px] px-2 text-xs font-semibold">
                    {{ internalSelectedSlots.length }}
                </span>
                <span v-if="loadingAvailability" class="ml-2 text-xs text-blue-600">Cargando...</span>
                <span v-if="availabilityError" class="ml-2 text-xs text-red-600">Error al cargar</span>
            </div>
            <div class="flex flex-wrap gap-2 w-full md:w-auto">
                <Button @click="clearAllSelections"
                    customClass="py-1.5 px-3 bg-[#B83C3C] hover:bg-[#A33434] text-white">
                    <template #icon>
                        <Trash2 :size="18" />
                    </template>
                    Eliminar todas
                </Button>
                <Button @click="undoSelection" :disabled="!canUndo"
                    customClass="py-1.5 px-3 border border-[#DCDFE3] hover:border-[#C3C8CC] text-gray-800">
                    <template #icon>
                        <Undo2 :size="18" />
                    </template>
                    Deshacer
                </Button>
                <Button @click="redoSelection" :disabled="!canRedo"
                    customClass="py-1.5 px-3 border border-[#DCDFE3] hover:border-[#C3C8CC] text-gray-800">
                    <template #icon>
                        <Redo2 :size="18" />
                    </template>
                    Rehacer
                </Button>
                <button
                    class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-sm bg-[#3c8bb8] hover:bg-[#345fa3] transition-all text-white text-sm font-normal cursor-pointer">
                    Disponibilidad Anterior
                    <ClipboardCopy :size="18" />
                </button>
                <button
                    class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-sm bg-[#67B83C] hover:bg-[#57A334] transition-all text-white text-sm font-normal cursor-pointer"
                    @click="sendAvailability" :disabled="isAvailabilitySent || loadingAvailability"
                    :class="{ 'opacity-50 cursor-not-allowed': isAvailabilitySent || loadingAvailability }">
                    <Send :size="18" />
                    {{ loadingAvailability ? 'Cargando...' : 'Enviar Disponibilidad' }}
                </button>
            </div>
        </div>

        <div class="flex-1 min-h-0 overflow-hidden">
            <Calendar @day-header-clicked="toggleSelectAllHoursInDay">
                <template #day-cell="{ day, hour }">
                    <div class="h-14 border-b border-l border-gray-200 relative flex items-center justify-center transition-all group"
                        :class="{
                            'bg-[#3c67b8] hover:bg-[#315495]': isSelected(day.value, hour.value),
                            'bg-[#3c67b89a]': isSelecting(day.value, hour.value),
                            'bg-gray-800 ': isLunchTime(hour.value) || isSunday(day.value),
                            'hover:bg-[#3C67B8] hover:text-white cursor-pointer': !isLunchTime(hour.value) && !isSunday(day.value),
                            'cursor-not-allowed': isLunchTime(hour.value) || isSunday(day.value)
                        }"
                        @mousedown="!isLunchTime(hour.value) && !isSunday(day.value) && startSelection($event, day.value, hour.value)"
                        @mousemove="handleMouseMove($event, day.value, hour.value)" @mouseup="endSelection()"
                        @mouseleave="handleMouseLeave(day.value, hour.value)"
                        @click="!isLunchTime(hour.value) && !isSunday(day.value) && toggleSelection(day.value, hour.value)">
                        <div class="flex flex-col items-center justify-center w-full h-full">
                            <span class="text-xs transition-opacity" :class="{
                                'opacity-0 group-hover:opacity-100 text-gray-400': !isSelected(day.value, hour.value) && !isLunchTime(hour.value) && !isSunday(day.value),
                                'opacity-100 text-white font-semibold': isSelected(day.value, hour.value),
                                'text-white opacity-80': isLunchTime(hour.value) || isSunday(day.value)
                            }">
                                {{ formatHourShort(hour.value) }}
                            </span>
                            <span v-if="isLunchTime(hour.value)"
                                class="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                :class="{ 'opacity-100': isLunchTime(hour.value) }">
                                Almuerzo
                            </span>
                            <span v-if="isSunday(day.value)"
                                class="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                :class="{ 'opacity-100': isSunday(day.value) }">
                                Festivo
                            </span>
                        </div>

                        <!-- Tooltip -->
                        <div
                            class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-3 rounded text-xs whitespace-nowrap opacity-0 pointer-events-none transition-opacity z-20 shadow-lg group-hover:opacity-100">
                            {{ day.label }} {{ hour.label }}
                            <div
                                class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45">
                            </div>
                        </div>
                    </div>
                </template>
            </Calendar>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { Trash2, Undo2, Redo2, X, Send, ClipboardCopy, Info } from 'lucide-vue-next';
import Button from '@/components/common/Button.vue';
import Calendar from '@/components/common/Calendar.vue';
import availabilityService from '@/services/availabilityService';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

// Props y emits
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    semesterId: {
        type: [String, Number],
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

// Estado
const isSelectionActive = ref(false);
const selectionStart = ref(null);
const selectionMode = ref('single'); // 'single', 'multiple', 'range'
const temporarySelection = ref([]);
const history = ref([]);
const historyIndex = ref(-1);
const ctrlKeyPressed = ref(false);
const isDragging = ref(false);
const lastSelectedCell = ref(null);
const lunchHours = [12, 13]; // 12 PM a 2 PM (12 y 13 en formato 24h)
const internalSelectedSlots = ref([]);
const isAvailabilitySent = ref(false);
const loadingAvailability = ref(false);
const availabilityError = ref(null);

// Computed properties
const sortedSelectedSlots = computed(() => {
    return [...internalSelectedSlots.value].sort((a, b) => {
        if (a.day !== b.day) {
            return a.day - b.day;
        }
        return a.hour - b.hour;
    });
});

const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < history.value.length - 1);

// Watch
// Inicializar el estado interno con el valor del modelo
internalSelectedSlots.value = [...props.modelValue];

// Métodos
function formatHourShort(hourValue) {
    const hour = hourValue % 12 || 12;
    const ampm = hourValue < 12 ? 'a' : 'p';
    return `${hour}${ampm}`;
}

function isSelected(day, hour) {
    return internalSelectedSlots.value.some(slot => slot.day === day && slot.hour === hour);
}

function isSelecting(day, hour) {
    return temporarySelection.value.some(slot => slot.day === day && slot.hour === hour);
}

function isLunchTime(hour) {
    return lunchHours.includes(hour);
}

function isSunday(day) {
    // Sunday is day 7 in this calendar
    return day === 7;
}

function toggleSelection(day, hour) {
    // No permitir seleccionar horas de almuerzo o domingos
    if (isLunchTime(hour) || isSunday(day)) return;

    if (!isDragging.value) {
        if (isSelected(day, hour)) {
            removeSelection(day, hour);
        } else {
            addSelection(day, hour);
        }
    }
}

function selectAllHoursInDay(day) {
    // Crear una copia del array actual
    const newSelection = [...internalSelectedSlots.value];

    // Obtener todas las horas excepto las de almuerzo
    const selectableHours = Array.from({ length: 17 }, (_, i) => i + 6)
        .filter(h => !isLunchTime(h));

    // Verificar qué horas ya están seleccionadas para este día (excluyendo almuerzo)
    const selectedHoursForDay = internalSelectedSlots.value
        .filter(slot => slot.day === day && !isLunchTime(slot.hour))
        .map(slot => slot.hour);

    // Si todas las horas seleccionables del día ya están seleccionadas, las quitamos
    if (selectedHoursForDay.length === selectableHours.length) {
        // Eliminar todas las horas de este día
        const filteredSelection = newSelection.filter(slot => slot.day !== day);
        internalSelectedSlots.value = filteredSelection;
    } else {
        // Agregar todas las horas que faltan para este día (excepto almuerzo)
        selectableHours.forEach(hour => {
            if (!isSelected(day, hour)) {
                newSelection.push({ day, hour });
            }
        });
        internalSelectedSlots.value = newSelection;
    }

    saveToHistory();
}

function startSelection(event, day, hour) {
    // No permitir seleccionar horas de almuerzo
    if (isLunchTime(hour)) return;

    // Prevenir selección de texto durante el arrastre
    event.preventDefault();

    isSelectionActive.value = true;
    isDragging.value = false;
    selectionStart.value = { day, hour };
    lastSelectedCell.value = { day, hour };

    // Determinar el modo de selección
    if (event.ctrlKey || event.metaKey) {
        selectionMode.value = 'multiple';
    } else {
        selectionMode.value = 'range';
        temporarySelection.value = [];
    }
}

function handleMouseMove(event, day, hour) {
    if (!isSelectionActive.value) return;

    // Si el mouse se movió, estamos en modo arrastre
    if (lastSelectedCell.value && (lastSelectedCell.value.day !== day || lastSelectedCell.value.hour !== hour)) {
        isDragging.value = true;
        lastSelectedCell.value = { day, hour };

        if (selectionMode.value === 'range') {
            // Calcular el rango entre la celda inicial y la actual
            temporarySelection.value = calculateRange(selectionStart.value, { day, hour });

            // Filtrar las horas de almuerzo de la selección temporal
            temporarySelection.value = temporarySelection.value.filter(slot => !isLunchTime(slot.hour));
        }
    }
}

function handleMouseLeave(day, hour) {
    // No hacemos nada especial al salir de una celda
}

function endSelection() {
    if (!isSelectionActive.value) return;

    isSelectionActive.value = false;

    if (selectionMode.value === 'range' && temporarySelection.value.length > 0 && isDragging.value) {
        // Aplicar la selección temporal al modelo
        const newSelection = [...internalSelectedSlots.value];

        temporarySelection.value.forEach(slot => {
            if (!isSelected(slot.day, slot.hour) && !isLunchTime(slot.hour)) {
                newSelection.push(slot);
            }
        });

        internalSelectedSlots.value = newSelection;
        temporarySelection.value = [];
        saveToHistory();
    }

    isDragging.value = false;
}

function calculateRange(start, end) {
    const range = [];

    // Determinar los límites del rango
    const startDay = Math.min(start.day, end.day);
    const endDay = Math.max(start.day, end.day);
    const startHour = Math.min(start.hour, end.hour);
    const endHour = Math.max(start.hour, end.hour);

    // Generar todas las celdas dentro del rango
    for (let day = startDay; day <= endDay; day++) {
        for (let hour = startHour; hour <= endHour; hour++) {
            // Excluir horas de almuerzo y domingos
            if (!isLunchTime(hour) && !isSunday(day)) {
                range.push({ day, hour });
            }
        }
    }

    return range;
}

function addSelection(day, hour) {
    // No permitir seleccionar horas de almuerzo o domingos
    if (isLunchTime(hour) || isSunday(day)) return;

    if (!isSelected(day, hour)) {
        // Crear una nueva copia del array para asegurar la reactividad
        const newSelection = [...internalSelectedSlots.value, { day, hour }];
        internalSelectedSlots.value = newSelection;
        saveToHistory();
    }
}

function removeSelection(day, hour) {
    const index = internalSelectedSlots.value.findIndex(slot => slot.day === day && slot.hour === hour);
    if (index !== -1) {
        const newSelection = [...internalSelectedSlots.value];
        newSelection.splice(index, 1);
        internalSelectedSlots.value = newSelection;
        saveToHistory();
    }
}

function clearAllSelections() {
    if (internalSelectedSlots.value.length > 0) {
        internalSelectedSlots.value = [];
        saveToHistory();
    }
}

function handleKeyDown(event) {
    if (event.ctrlKey || event.metaKey) {
        ctrlKeyPressed.value = true;
    }
}

function handleKeyUp(event) {
    if (!event.ctrlKey && !event.metaKey) {
        ctrlKeyPressed.value = false;
    }
}

function saveToHistory() {
    // Si estamos en medio del historial, eliminar los estados futuros
    if (historyIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, historyIndex.value + 1);
    }

    // Guardar el estado actual
    history.value.push(JSON.stringify(internalSelectedSlots.value));
    historyIndex.value = history.value.length - 1;

    // Emitir actualización al modelo
    emit('update:modelValue', internalSelectedSlots.value);
}

function undoSelection() {
    if (canUndo.value) {
        historyIndex.value--;
        internalSelectedSlots.value = JSON.parse(history.value[historyIndex.value]);
        emit('update:modelValue', internalSelectedSlots.value);
    }
}

function redoSelection() {
    if (canRedo.value) {
        historyIndex.value++;
        internalSelectedSlots.value = JSON.parse(history.value[historyIndex.value]);
        emit('update:modelValue', internalSelectedSlots.value);
    }
}

function toggleSelectAllHoursInDay(dayValue) {
    // Sundays (day 7) are holidays and cannot have all hours selected.
    if (isSunday(dayValue)) return;

    const selectableHours = [];
    // Hours are from 6 to 22 as per Calendar.vue generateHours
    for (let h = 6; h <= 22; h++) {
        if (!isLunchTime(h)) {
            selectableHours.push(h);
        }
    }

    const currentDaySelections = internalSelectedSlots.value
        .filter(slot => slot.day === dayValue && !isLunchTime(slot.hour))
        .map(slot => slot.hour);

    let allSelected = true;
    if (selectableHours.length === 0 && currentDaySelections.length > 0) { // Should not happen if day is not Sunday
        allSelected = true; // Consider all selected if no selectable hours but some are selected (edge case cleanup)
    } else if (selectableHours.length === 0 && currentDaySelections.length === 0) {
        allSelected = false; // No selectable hours and none selected, so not all selected
    } else {
        allSelected = selectableHours.every(h => currentDaySelections.includes(h)) &&
            currentDaySelections.length === selectableHours.length;
    }

    if (allSelected) {
        // Deselect all for this day
        internalSelectedSlots.value = internalSelectedSlots.value.filter(slot => slot.day !== dayValue);
    } else {
        // Select all for this day
        // First, remove any existing selections for this day to avoid duplicates and ensure clean select all
        internalSelectedSlots.value = internalSelectedSlots.value.filter(slot => slot.day !== dayValue);
        selectableHours.forEach(hour => {
            internalSelectedSlots.value.push({ day: dayValue, hour });
        });
    }
    saveToHistory();
}

async function loadAvailability() {
    if (!props.semesterId) return;

    try {
        loadingAvailability.value = true;
        availabilityError.value = null;

        const response = await availabilityService.getAvailability(props.semesterId);

        if (response.disponibilidad) {
            // Convertir la disponibilidad de la API al formato interno
            const loadedSlots = convertApiToInternalFormat(response.disponibilidad);
            internalSelectedSlots.value = loadedSlots;

            // Limpiar historial y guardar el estado cargado
            history.value = [];
            historyIndex.value = -1;
            saveToHistory();
        } else {
            // Si no hay disponibilidad, asegurarse de que esté vacío
            internalSelectedSlots.value = [];
            history.value = [];
            historyIndex.value = -1;
            saveToHistory();
        }

        // Reset availability sent status
        isAvailabilitySent.value = false;
    } catch (error) {
        console.error('Error loading availability:', error);
        availabilityError.value = error.message;

        // En caso de error, mantener vacío y reiniciar historial
        internalSelectedSlots.value = [];
        history.value = [];
        historyIndex.value = -1;
        saveToHistory();
    } finally {
        loadingAvailability.value = false;
    }
}

function convertApiToInternalFormat(apiData) {
    const slots = [];
    const dayMapping = {
        'LUNES': 1,
        'MARTES': 2,
        'MIERCOLES': 3,
        'JUEVES': 4,
        'VIERNES': 5,
        'SABADO': 6,
        'DOMINGO': 7
    };

    Object.keys(apiData).forEach(dayName => {
        const dayValue = dayMapping[dayName];
        if (dayValue) {
            apiData[dayName].forEach(slot => {
                slots.push({
                    day: dayValue,
                    hour: slot.hour
                });
            });
        }
    });

    return slots;
}

function convertInternalToApiFormat(internalSlots) {
    const groupedByDay = {};
    const dayNames = {
        1: 'LUNES',
        2: 'MARTES',
        3: 'MIERCOLES',
        4: 'JUEVES',
        5: 'VIERNES',
        6: 'SABADO',
        7: 'DOMINGO'
    };

    internalSlots.forEach(slot => {
        // Skip Sundays as they are holidays
        if (slot.day === 7) return;

        const dayName = dayNames[slot.day];
        if (!groupedByDay[dayName]) {
            groupedByDay[dayName] = [];
        }

        groupedByDay[dayName].push({
            hour: slot.hour,
            statusId: 1
        });
    });

    return groupedByDay;
}

async function sendAvailability() {
    if (!props.semesterId) {
        console.error('No semester ID provided');
        return;
    }

    try {
        // Convertir al formato de la API
        const apiFormatData = convertInternalToApiFormat(internalSelectedSlots.value);

        // Log para depuración
        console.log("Disponibilidad a enviar:", apiFormatData);

        // Enviar a la API
        await availabilityService.sendAvailability(props.semesterId, apiFormatData);

        showSuccessToast("Disponibilidad enviada exitosamente");
        isAvailabilitySent.value = true;

        // Opcional: recargar la disponibilidad para confirmar
        // await loadAvailability();

    } catch (error) {
        showErrorToast('Error al enviar la disponibilidad');
        // Opcional: mostrar un mensaje de error al usuario
    }
}

// Watchers
watch(() => props.semesterId, (newSemesterId) => {
    if (newSemesterId) {
        loadAvailability();
    }
}, { immediate: true });

// Lifecycle hooks
onMounted(() => {
    // Agregar event listeners para teclas Ctrl/Cmd
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Agregar event listener para detener la selección si el mouse sale del calendario
    document.addEventListener('mouseup', endSelection);
});

onBeforeUnmount(() => {
    // Limpiar event listeners
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('mouseup', endSelection);
});
</script>
