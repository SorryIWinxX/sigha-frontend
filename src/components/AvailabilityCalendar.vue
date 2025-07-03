<template>
    <div class="w-full h-full flex flex-col overflow-hidden bg-white">
        <!-- Mensaje cuando la disponibilidad está deshabilitada -->
        <div v-if="!props.semesterAvailability" class="mb-4 p-4 bg-danger-500  rounded-sm flex-shrink-0">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <X :size="20" class="text-white" />
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-white">
                        Disponibilidad Deshabilitada
                    </h3>
                    <div class="mt-1 text-sm text-white">
                        <p>La gestión de disponibilidad se encuentra inhabilitada para este período académico. No es
                            posible realizar cambios en la selección de horarios en este momento. Si necesita hacer
                            cambios por favor contacte con el coordinador académico.</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="internalSelectedSlots.length > 0 && !isInfoMessageClosed"
            class="mb-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-sm flex-shrink-0 relative">
            <button @click="closeInfoMessage"
                class="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Cerrar mensaje">
                <X :size="24" class="text-gray-600" />
            </button>
            <div class="flex items-start pr-8">
                <div class="flex-shrink-0">
                    <Info :size="24" class="text-gray-700" />
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-gray-800">
                        Información sobre Estados de Disponibilidad
                    </h3>
                    <div class="mt-1 text-sm text-gray-700">
                        <p>Una vez enviada tu disponibilidad, será evaluada por la coordinación académica. El estado de
                            cada franja horaria se indicará mediante colores:</p>
                        <p class="mt-2">
                            <span
                                class="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-green-500 text-white mr-2">
                                Verde: Aprobada
                            </span>
                            <span
                                class="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-yellow-500 text-white mr-2">
                                Amarillo: Rechazada
                            </span>
                            <span
                                class="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-info-500 text-white mr-2">
                                Azul: Pendiente de revisión
                            </span>
                            <span
                                class="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium border bg-white border-gray-300 text-gray-700">
                                Blanco: Sin definir
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
                <Button @click="clearAllSelections" :disabled="!props.semesterAvailability" variant="danger">
                    <Trash2 :size="18" />
                    Eliminar todas
                </Button>
                <Button @click="undoSelection" :disabled="!canUndo || !props.semesterAvailability" variant="secondary">
                    <Undo2 :size="18" />
                    Deshacer
                </Button>
                <Button @click="redoSelection" :disabled="!canRedo || !props.semesterAvailability" variant="secondary">
                    <Redo2 :size="18" />
                    Rehacer
                </Button>
                <Button variant="info" :disabled="!props.semesterAvailability">
                    <ClipboardCopy :size="18" />
                    Disponibilidad Anterior

                </Button>
                <Button variant="primary" @click="sendAvailability"
                    :disabled="isAvailabilitySent || loadingAvailability || !props.semesterAvailability">
                    <Send :size="18" />
                    {{ loadingAvailability ? 'Cargando...' : 'Enviar Disponibilidad' }}
                </Button>
            </div>
        </div>

        <div class="flex-1 min-h-0 overflow-hidden">
            <Calendar @day-header-clicked="handleDayHeaderClick">
                <template #day-cell="{ day, hour }">
                    <div class="h-14 border-b border-l border-gray-200 relative flex items-center justify-center transition-all group"
                        :class="[
                            {
                                'bg-gray-800': isLunchTime(hour.value) || isSunday(day.value),
                                'bg-[#3c67b89a]': isSelecting(day.value, hour.value) && props.semesterAvailability,
                                'hover:bg-[#3C67B8] hover:text-white cursor-pointer': !isLunchTime(hour.value) && !isSunday(day.value) && !isSelected(day.value, hour.value) && props.semesterAvailability,
                                'cursor-not-allowed': isLunchTime(hour.value) || isSunday(day.value) || !props.semesterAvailability
                            },
                            isSelected(day.value, hour.value) ? [
                                getStatusColors(getSlotStatus(day.value, hour.value)).bg,
                                getStatusColors(getSlotStatus(day.value, hour.value)).hover,
                                getStatusColors(getSlotStatus(day.value, hour.value)).text
                            ] : []
                        ]"
                        @mousedown="!isLunchTime(hour.value) && !isSunday(day.value) && props.semesterAvailability && startSelection($event, day.value, hour.value)"
                        @mousemove="props.semesterAvailability && handleMouseMove($event, day.value, hour.value)"
                        @mouseup="props.semesterAvailability && endSelection()"
                        @mouseleave="props.semesterAvailability && handleMouseLeave(day.value, hour.value)"
                        @click="!isLunchTime(hour.value) && !isSunday(day.value) && props.semesterAvailability && toggleSelection(day.value, hour.value)">
                        <div class="flex flex-col items-center justify-center w-full h-full">
                            <span v-if="!isLunchTime(hour.value) && !isSunday(day.value)"
                                class="text-xs transition-opacity" :class="{
                                    'opacity-0 group-hover:opacity-100 text-gray-400': !isSelected(day.value, hour.value),
                                    'opacity-100 text-white font-semibold': isSelected(day.value, hour.value)
                                }">
                                {{ formatHourShort(hour.value) }}
                            </span>
                            <span v-if="isSunday(day.value)"
                                class="text-sm bg-danger-500 text-white px-3 py-1.5 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                :class="{ 'opacity-100': isSunday(day.value) }">
                                Festivo
                            </span>
                            <span v-else-if="isLunchTime(hour.value)"
                                class="text-sm bg-danger-500 text-white px-3 py-1.5 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                :class="{ 'opacity-100': isLunchTime(hour.value) }">
                                Almuerzo
                            </span>

                        </div>

                        <!-- Tooltip -->
                        <div
                            class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-3 rounded text-xs whitespace-nowrap opacity-0 pointer-events-none transition-opacity z-20 shadow-lg group-hover:opacity-100">
                            <div>{{ day.label }} {{ hour.label }}</div>
                            <div v-if="isSelected(day.value, hour.value) && getSlotStatus(day.value, hour.value)"
                                class="text-xs opacity-80">
                                Estado: {{ getStatusDescription(getSlotStatus(day.value, hour.value)) }}
                            </div>
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
import { useStatusStore } from '@/store/statusStore';
import { useAuthStore } from '@/store/authStore';

// Props y emits
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    semesterId: {
        type: [String, Number],
        required: true
    },
    semesterAvailability: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:modelValue']);

// Store
const statusStore = useStatusStore();
const authStore = useAuthStore();

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
const isInfoMessageClosed = ref(false);

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

function getSlotStatus(day, hour) {
    const slot = internalSelectedSlots.value.find(slot => slot.day === day && slot.hour === hour);
    return slot?.statusId || null;
}

function getStatusColors(statusId) {
    switch (statusId) {
        case 1: // ENVIADO
            return {
                bg: 'bg-info-500',
                hover: 'hover:bg-info-600',
                text: 'text-white'
            };
        case 2: // APROBADO
            return {
                bg: 'bg-primary-500',
                hover: 'hover:bg-primary-600',
                text: 'text-white'
            };
        case 3: // RECHAZADO
            return {
                bg: 'bg-warning-500',
                hover: 'hover:bg-warning-600',
                text: 'text-white'
            };
        default: // Sin estado o nuevo
            return {
                bg: 'bg-[#3c67b8]',
                hover: 'hover:bg-[#315495]',
                text: 'text-white'
            };
    }
}

function getStatusDescription(statusId) {
    const status = statusStore.getStatusById(statusId);
    return status?.description || 'Sin estado';
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

    // Verificar si el slot está aprobado o rechazado
    const currentStatus = getSlotStatus(day, hour);
    if (currentStatus === 2 || currentStatus === 3) return;

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
                newSelection.push({ day, hour, statusId: null });
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
            // Verificar si el slot está aprobado o rechazado
            const currentStatus = getSlotStatus(slot.day, slot.hour);
            if (!isSelected(slot.day, slot.hour) && !isLunchTime(slot.hour) && currentStatus !== 2 && currentStatus !== 3) {
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
            // Excluir horas de almuerzo, domingos y slots aprobados/rechazados
            if (!isLunchTime(hour) && !isSunday(day)) {
                const currentStatus = getSlotStatus(day, hour);
                if (currentStatus !== 2 && currentStatus !== 3) {
                    range.push({ day, hour, statusId: null });
                }
            }
        }
    }

    return range;
}

function addSelection(day, hour, statusId = null) {
    // No permitir seleccionar horas de almuerzo o domingos
    if (isLunchTime(hour) || isSunday(day)) return;

    // Verificar si el slot está aprobado o rechazado
    const currentStatus = getSlotStatus(day, hour);
    if (currentStatus === 2 || currentStatus === 3) return;

    if (!isSelected(day, hour)) {
        // Crear una nueva copia del array para asegurar la reactividad
        const newSelection = [...internalSelectedSlots.value, { day, hour, statusId }];
        internalSelectedSlots.value = newSelection;
        saveToHistory();
    }
}

function removeSelection(day, hour) {
    // Verificar si el slot está aprobado o rechazado
    const currentStatus = getSlotStatus(day, hour);
    if (currentStatus === 2 || currentStatus === 3) return;

    const index = internalSelectedSlots.value.findIndex(slot => slot.day === day && slot.hour === hour);
    if (index !== -1) {
        const newSelection = [...internalSelectedSlots.value];
        newSelection.splice(index, 1);
        internalSelectedSlots.value = newSelection;
        saveToHistory();
    }
}

function clearAllSelections() {
    // Filtrar los slots que no están aprobados ni rechazados
    const slotsToKeep = internalSelectedSlots.value.filter(slot => {
        const status = slot.statusId;
        return status === 2 || status === 3;
    });

    if (slotsToKeep.length !== internalSelectedSlots.value.length) {
        internalSelectedSlots.value = slotsToKeep;
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

function handleDayHeaderClick(dayValue) {
    if (!props.semesterAvailability) {
        return;
    }

    toggleSelectAllHoursInDay(dayValue);
}

function toggleSelectAllHoursInDay(dayValue) {

    // Sundays (day 7) are holidays and cannot have all hours selected.
    if (isSunday(dayValue)) {
        return;
    }

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
            internalSelectedSlots.value.push({ day: dayValue, hour, statusId: null });
        });
    }
    saveToHistory();
}

async function loadAvailability() {
    if (!props.semesterId) return;

    try {
        loadingAvailability.value = true;
        availabilityError.value = null;

        // Cargar estados si no están cargados
        if (!statusStore.isLoaded) {
            await statusStore.fetchStatusAvailability();
        }

        // Intentar cargar disponibilidad global si tenemos userId
        const userId = authStore.userId;
        let loadedSlots = [];

        if (userId) {
            try {
                const globalResponse = await availabilityService.getGlobalAvailability(userId, props.semesterId);
                if (globalResponse.disponibilidad) {
                    loadedSlots = convertGlobalApiToInternalFormat(globalResponse.disponibilidad);
                }
            } catch (globalError) {
                console.warn('Error loading global availability, falling back to simple availability:', globalError);

                // Fallback a la API simple
                const response = await availabilityService.getAvailability(props.semesterId);
                if (response.disponibilidad) {
                    loadedSlots = convertApiToInternalFormat(response.disponibilidad);
                }
            }
        } else {
            // Si no hay userId, usar la API simple
            const response = await availabilityService.getAvailability(props.semesterId);
            if (response.disponibilidad) {
                loadedSlots = convertApiToInternalFormat(response.disponibilidad);
            }
        }

        internalSelectedSlots.value = loadedSlots;

        // Limpiar historial y guardar el estado cargado
        history.value = [];
        historyIndex.value = -1;
        saveToHistory();

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
                    hour: slot.hour,
                    statusId: slot.statusId || null
                });
            });
        }
    });

    return slots;
}

function convertGlobalApiToInternalFormat(globalApiData) {
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

    Object.keys(globalApiData).forEach(dayName => {
        const dayValue = dayMapping[dayName];
        if (dayValue) {
            globalApiData[dayName].forEach(slot => {
                slots.push({
                    day: dayValue,
                    hour: slot.hour,
                    statusId: slot.statusId
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

        // Enviar a la API
        await availabilityService.sendAvailability(props.semesterId, apiFormatData);

        showSuccessToast("Disponibilidad enviada exitosamente");
        isAvailabilitySent.value = true;

    } catch (error) {
        showErrorToast('Error al enviar la disponibilidad');
    }
}

function closeInfoMessage() {
    isInfoMessageClosed.value = true;
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
