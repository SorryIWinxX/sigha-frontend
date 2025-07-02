<template>
    <div class="flex flex-col gap-4 py-4">
        <!-- Filters Section -->
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="w-full sm:w-auto sm:flex-1">
                <Search />
            </div>
            <div class="w-full sm:w-auto sm:flex-1">
                <Select id="nivel-select" v-model="selectedNivel" placeholder="Selecciona un nivel" width="w-full">
                    <option value="">Todos</option>
                    <option value="1-2-3">1-2-3</option>
                    <option value="3-4-5">3-4-5</option>
                    <option value="5-6-7">5-6-7</option>
                    <option value="7-8-9-E">7-8-9-E</option>
                </Select>
            </div>

            <div class="w-full sm:w-auto flex gap-2">
                <Button variant="secondary" @click="toggleFullscreen"
                    :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'">
                    <Maximize2 :size="18" />
                </Button>
                <Button variant="info">
                    Horario anterior
                    <ClipboardCopy :size="18" />
                </Button>
                <Button variant="danger">
                    Deshacer Cambios

                    <Trash2 :size="18" />
                </Button>

                <Button variant="primary">
                    Guardar cambios
                    <Save :size="18" />
                </Button>


            </div>
        </div>

        <!-- Schedule Table -->
        <div class="rounded-sm border border-gray-300 schedule-table-container" :class="{
            'fixed inset-0 z-50 bg-white': isFullscreen,
            'relative': !isFullscreen
        }">
            <div class="overflow-auto" :class="{
                'h-screen': isFullscreen,
                'max-h-[80vh]': !isFullscreen
            }">
                <table class="w-full border-collapse">
                    <!-- Fixed Header -->
                    <thead class=" sticky top-0 z-10">
                        <tr class="bg-gray-100">
                            <th class="p-3 text-center font-semibold text-gray-900 min-w-[200px] border-gray-300">
                                Hora
                            </th>

                            <th v-for="day in dayKeys" :key="day"
                                class="p-3 text-center font-semibold text-gray-900 min-w-[200px]  ">
                                {{ getDayLabel(day) }}
                            </th>
                        </tr>
                    </thead>
                    <!-- Scrollable Body -->
                    <tbody>
                        <tr v-for="hour in timeSlots" :key="hour">
                            <td
                                class="border-r border-b border-gray-300 p-3 text-center font-medium bg-white text-gray-900">
                                {{ formatTimeRange(hour) }}
                            </td>
                            <td v-for="day in dayKeys" :key="`${hour}-${day}`"
                                class="border border-gray-300 p-2 bg-white min-h-[120px] align-top"
                                @dragover="handleDragOver" @drop="handleDrop($event, hour, day)"
                                @dragenter="handleDragEnter($event, hour, day)" @dragleave="handleDragLeave($event)"
                                :class="{
                                    'bg-blue-50 border-blue-300': isDragOverSlot === `${hour}-${day}`,
                                    'bg-red-50 border-red-300': isDragOverSlot === `${hour}-${day}` && !canDropInSlot(hour, day)
                                }">

                                <!-- Groups Container -->
                                <div class="flex flex-wrap gap-2">
                                    <div v-for="group in getGroupsForSlot(hour, day)" :key="group.id" draggable="true"
                                        @dragstart="handleDragStart($event, group)" @dragend="handleDragEnd"
                                        @click="openProfessorModal(group, $event)"
                                        class="group flex-1 min-w-[180px] rounded-sm p-3 transition-all duration-300 hover:translate-x-1 cursor-pointer bg-gray-100 border-l-8"
                                        :class="[
                                            getGroupCardClasses(group),
                                            {
                                                'opacity-50 scale-95': draggedGroup?.id === group.id,
                                                'cursor-grab': !draggedGroup,
                                                'cursor-grabbing': draggedGroup?.id === group.id
                                            }
                                        ]">

                                        <!-- Group Code -->
                                        <div class="font-bold text-sm group-hover:text-white text-gray-800 mb-1">
                                            {{ group.code }}
                                        </div>

                                        <!-- Subject -->
                                        <div class="text-xs group-hover:text-white text-gray-600 mb-2 truncate"
                                            :title="group.subject">
                                            {{ group.subject }}
                                        </div>

                                        <!-- Professor -->
                                        <div class="flex items-center space-x-2">
                                            <div
                                                class="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                <img v-if="group.professor.photo" :src="group.professor.photo"
                                                    :alt="group.professor.name" class="w-full h-full object-cover" />
                                                <div v-else
                                                    class="w-full h-full flex items-center justify-center text-gray-400">
                                                    <UserIcon :size="16" />
                                                </div>
                                            </div>
                                            <span class="text-xs text-gray-700 group-hover:text-white truncate flex-1"
                                                :title="group.professor.name">
                                                {{ group.professor.name }}
                                            </span>
                                        </div>

                                        <!-- Level indicator -->
                                        <div class="mt-2">
                                            <span
                                                class="px-2 py-0.5 bg-blue-100 text-blue-800 group-hover:text-white rounded text-xs">
                                                {{ group.level }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Empty state -->
                                <div v-if="getGroupsForSlot(hour, day).length === 0"
                                    class="text-gray-400 text-xs text-center py-4" :class="{
                                        'text-blue-600': isDragOverSlot === `${hour}-${day}` && canDropInSlot(hour, day),
                                        'text-red-600': isDragOverSlot === `${hour}-${day}` && !canDropInSlot(hour, day)
                                    }">
                                    <span v-if="isDragOverSlot === `${hour}-${day}` && canDropInSlot(hour, day)">
                                        ↓ Soltar aquí
                                    </span>
                                    <span v-else-if="isDragOverSlot === `${hour}-${day}` && !canDropInSlot(hour, day)">
                                        ✗ No se puede soltar aquí
                                    </span>
                                    <span v-else>
                                        Sin grupos programados
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Professor Selection Modal -->
    <div v-if="showProfessorModal && selectedGroup" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0" @click="closeProfessorModal"></div>
        <!-- Modal -->
        <div class="absolute bg-white border-l-8 shadow-xl rounded-sm p-4 w-80 max-w-[90vw]"
            :class="getModalBorderClass(selectedGroup)"
            :style="{ left: modalPosition.x + 'px', top: modalPosition.y + 'px' }">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-base font-semibold text-gray-800">{{ selectedGroup.code }}</h3>
                <button @click="closeProfessorModal" class="text-gray-400 hover:text-gray-600">
                    <X :size="18" />
                </button>
            </div>

            <div class="mb-3">
                <div class="text-normal text-gray-600 mb-1">
                    <strong>Materia:</strong> {{ selectedGroup.subject }}
                </div>
                <div class="text-normal text-gray-600 mb-1">
                    <strong>Profesor:</strong> {{ selectedGroup.professor.name }}
                </div>
                <div class="text-normal text-gray-600 ">
                    <strong>Nivel:</strong> 1
                </div>
            </div>

            <div class="mb-4">
                <Select id="professor-select" label="Seleccionar nuevo profesor:" v-model="selectedProfessorId"
                    placeholder="Elige un profesor" width="w-full">
                    <option v-for="professor in availableProfessors" :key="professor.id" :value="professor.id">
                        {{ professor.name }} - {{ professor.department }}
                    </option>
                </Select>
            </div>

            <div class="flex justify-end space-x-2">
                <Button @click="closeProfessorModal" variant="secondary">
                    Cancelar
                </Button>
                <Button @click="saveProfessorChange" variant="primary">
                    Guardar
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { User as UserIcon, X, Save, Trash2, ArrowLeft, ClipboardCopy, Maximize2 } from 'lucide-vue-next';
import Search from '@/components/common/Search.vue';
import Select from '@/components/common/Select.vue';
import Button from '@/components/common/Button.vue';

// Interfaces
interface Professor {
    id: string;
    name: string;
    department: string;
    photo?: string;
}

interface Group {
    id: string;
    code: string;
    subject: string;
    professor: Professor;
    level: string;
    day: string;
    hour: string;
}

// Reactive state
const selectedNivel = ref('');
const showProfessorModal = ref(false);
const selectedGroup = ref<Group | null>(null);
const selectedProfessor = ref<Professor | null>(null);
const selectedProfessorId = ref('');
const modalPosition = ref({ x: 0, y: 0 });
const isFullscreen = ref(false);

// Drag and drop state
const draggedGroup = ref<Group | null>(null);
const isDragOverSlot = ref<string | null>(null);

// Days configuration
const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const dayLabels = {
    monday: 'LUNES',
    tuesday: 'MARTES',
    wednesday: 'MIÉRCOLES',
    thursday: 'JUEVES',
    friday: 'VIERNES',
    saturday: 'SÁBADO'
};

// Time slots (6 AM to 10 PM)
const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
];

// Mock data for professors
const mockProfessors: Professor[] = [
    { id: '1', name: 'Dr. Ana García', department: 'Matemáticas', photo: undefined },
    { id: '2', name: 'Prof. Carlos Ruiz', department: 'Física', photo: undefined },
    { id: '3', name: 'Dra. María López', department: 'Química', photo: undefined },
    { id: '4', name: 'Prof. Luis Martín', department: 'Biología', photo: undefined },
    { id: '5', name: 'Dr. Elena Rodríguez', department: 'Informática', photo: undefined },
    { id: '6', name: 'Prof. Juan Pérez', department: 'Literatura', photo: undefined }
];

// Mock data for groups
const mockGroups: Group[] = [
    {
        id: '1',
        code: 'MAT-101-A',
        subject: 'Cálculo Diferencial',
        professor: mockProfessors[0],
        level: '1-2-3',
        day: 'monday',
        hour: '08:00'
    },
    {
        id: '2',
        code: 'FIS-201-B',
        subject: 'Física Mecánica',
        professor: mockProfessors[1],
        level: '3-4-5',
        day: 'monday',
        hour: '08:00'
    },
    {
        id: '3',
        code: 'QUI-102-A',
        subject: 'Química General',
        professor: mockProfessors[2],
        level: '1-2-3',
        day: 'tuesday',
        hour: '10:00'
    },
    {
        id: '4',
        code: 'BIO-301-C',
        subject: 'Biología Molecular',
        professor: mockProfessors[3],
        level: '5-6-7',
        day: 'wednesday',
        hour: '14:00'
    },
    {
        id: '5',
        code: 'INF-401-A',
        subject: 'Programación Avanzada',
        professor: mockProfessors[4],
        level: '7-8-9-E',
        day: 'thursday',
        hour: '16:00'
    },
    {
        id: '6',
        code: 'LIT-102-B',
        subject: 'Literatura Española',
        professor: mockProfessors[5],
        level: '1-2-3',
        day: 'friday',
        hour: '09:00'
    },
    {
        id: '7',
        code: 'MAT-201-B',
        subject: 'Cálculo Integral',
        professor: mockProfessors[0],
        level: '3-4-5',
        day: 'tuesday',
        hour: '08:00'
    },
    {
        id: '8',
        code: 'FIS-102-A',
        subject: 'Física General',
        professor: mockProfessors[1],
        level: '1-2-3',
        day: 'wednesday',
        hour: '10:00'
    },
    {
        id: '9',
        code: 'MAT-301-A',
        subject: 'Cálculo Diferencial',
        professor: mockProfessors[0],
        level: '5-6-7',
        day: 'thursday',
        hour: '10:00'
    },
    {
        id: '10',
        code: 'QUI-201-B',
        subject: 'Química General',
        professor: mockProfessors[2],
        level: '3-4-5',
        day: 'friday',
        hour: '14:00'
    },
    {
        id: '11',
        code: 'FIS-301-C',
        subject: 'Física Mecánica',
        professor: mockProfessors[1],
        level: '5-6-7',
        day: 'saturday',
        hour: '08:00'
    }
];

// Computed
const filteredGroups = computed(() => {
    if (!selectedNivel.value) return mockGroups;
    return mockGroups.filter(group => group.level === selectedNivel.value);
});

const availableProfessors = computed(() => {
    return mockProfessors.filter(prof => prof.id !== selectedGroup.value?.professor.id);
});

// Methods
function getDayLabel(day: string): string {
    return dayLabels[day as keyof typeof dayLabels] || day.toUpperCase();
}

function formatTimeRange(hour: string): string {
    const [hourNum, minutes] = hour.split(':').map(Number);
    const nextHour = hourNum + 1;

    // Format current hour
    const currentFormatted = formatTime(hourNum, minutes);
    // Format next hour
    const nextFormatted = formatTime(nextHour, 0);

    return `${currentFormatted} - ${nextFormatted}`;
}

function formatTime(hour: number, minutes: number): string {
    const period = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function getGroupsForSlot(hour: string, day: string): Group[] {
    return filteredGroups.value.filter(group =>
        group.hour === hour && group.day === day
    );
}

/**
 * Genera un color determinístico basado en el nombre de la materia
 * Utiliza colores Tailwind del orden 500 para mantener consistencia
 */
function getSubjectColor(subject: string): string {
    // Colores Tailwind 500 disponibles
    const colors = [
        'red-500',
        'orange-500',
        'amber-500',
        'yellow-500',
        'lime-500',
        'green-500',
        'emerald-500',
        'teal-500',
        'cyan-500',
        'sky-500',
        'blue-500',
        'indigo-500',
        'violet-500',
        'purple-500',
        'fuchsia-500',
        'pink-500',
        'rose-500'
    ];

    // Generar un hash simple basado en el nombre de la materia
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
        const char = subject.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a 32bit integer
    }

    // Usar el hash para seleccionar un color de forma determinística
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
}

/**
 * Obtiene las clases CSS para una tarjeta de grupo basadas en la materia
 */
function getGroupCardClasses(group: Group): string {
    const subjectColor = getSubjectColor(group.subject);

    // Mapear colores Tailwind a clases de border y hover
    const colorMap: { [key: string]: { border: string; hover: string } } = {
        'red-500': { border: 'border-red-500', hover: 'hover:bg-red-500' },
        'orange-500': { border: 'border-orange-500', hover: 'hover:bg-orange-500' },
        'amber-500': { border: 'border-amber-500', hover: 'hover:bg-amber-500' },
        'yellow-500': { border: 'border-yellow-500', hover: 'hover:bg-yellow-500' },
        'lime-500': { border: 'border-lime-500', hover: 'hover:bg-lime-500' },
        'green-500': { border: 'border-green-500', hover: 'hover:bg-green-500' },
        'emerald-500': { border: 'border-emerald-500', hover: 'hover:bg-emerald-500' },
        'teal-500': { border: 'border-teal-500', hover: 'hover:bg-teal-500' },
        'cyan-500': { border: 'border-cyan-500', hover: 'hover:bg-cyan-500' },
        'sky-500': { border: 'border-sky-500', hover: 'hover:bg-sky-500' },
        'blue-500': { border: 'border-blue-500', hover: 'hover:bg-blue-500' },
        'indigo-500': { border: 'border-indigo-500', hover: 'hover:bg-indigo-500' },
        'violet-500': { border: 'border-violet-500', hover: 'hover:bg-violet-500' },
        'purple-500': { border: 'border-purple-500', hover: 'hover:bg-purple-500' },
        'fuchsia-500': { border: 'border-fuchsia-500', hover: 'hover:bg-fuchsia-500' },
        'pink-500': { border: 'border-pink-500', hover: 'hover:bg-pink-500' },
        'rose-500': { border: 'border-rose-500', hover: 'hover:bg-rose-500' }
    };

    const colors = colorMap[subjectColor] || { border: 'border-gray-500', hover: 'hover:bg-gray-500' };
    return `${colors.border} ${colors.hover}`;
}

/**
 * Obtiene la clase de border para el modal basada en la materia
 */
function getModalBorderClass(group: Group): string {
    const subjectColor = getSubjectColor(group.subject);

    const colorMap: { [key: string]: string } = {
        'red-500': 'border-red-500',
        'orange-500': 'border-orange-500',
        'amber-500': 'border-amber-500',
        'yellow-500': 'border-yellow-500',
        'lime-500': 'border-lime-500',
        'green-500': 'border-green-500',
        'emerald-500': 'border-emerald-500',
        'teal-500': 'border-teal-500',
        'cyan-500': 'border-cyan-500',
        'sky-500': 'border-sky-500',
        'blue-500': 'border-blue-500',
        'indigo-500': 'border-indigo-500',
        'violet-500': 'border-violet-500',
        'purple-500': 'border-purple-500',
        'fuchsia-500': 'border-fuchsia-500',
        'pink-500': 'border-pink-500',
        'rose-500': 'border-rose-500'
    };

    return colorMap[subjectColor] || 'border-gray-500';
}

// Drag and Drop Methods
function handleDragStart(event: DragEvent, group: Group) {
    draggedGroup.value = group;
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', group.id);

    // Prevent the click event when dragging
    event.stopPropagation();
}

function handleDragEnd() {
    draggedGroup.value = null;
    isDragOverSlot.value = null;
}

function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
}

function handleDragEnter(event: DragEvent, hour: string, day: string) {
    event.preventDefault();
    isDragOverSlot.value = `${hour}-${day}`;
}

function handleDragLeave(event: DragEvent) {
    // Only clear the drag over state if we're actually leaving the cell
    const target = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (!target.contains(relatedTarget)) {
        isDragOverSlot.value = null;
    }
}

function canDropInSlot(hour: string, day: string): boolean {
    if (!draggedGroup.value) return false;

    // Check if the professor has a conflict at this time
    const conflictingGroups = mockGroups.filter(group =>
        group.id !== draggedGroup.value!.id &&
        group.hour === hour &&
        group.day === day &&
        group.professor.id === draggedGroup.value!.professor.id
    );

    return conflictingGroups.length === 0;
}

function handleDrop(event: DragEvent, hour: string, day: string) {
    event.preventDefault();

    if (!draggedGroup.value || !canDropInSlot(hour, day)) {
        isDragOverSlot.value = null;
        return;
    }

    // Find the group in the mock data and update its schedule
    const groupIndex = mockGroups.findIndex(g => g.id === draggedGroup.value!.id);
    if (groupIndex !== -1) {
        const oldHour = mockGroups[groupIndex].hour;
        const oldDay = mockGroups[groupIndex].day;

        mockGroups[groupIndex].hour = hour;
        mockGroups[groupIndex].day = day;

        console.log(`Grupo ${mockGroups[groupIndex].code} movido de ${getDayLabel(oldDay)} ${oldHour} a ${getDayLabel(day)} ${hour}`);

        // In a real app, this would make an API call to update the schedule
        // await updateGroupSchedule(draggedGroup.value.id, { hour, day });
    }

    isDragOverSlot.value = null;
}

function openProfessorModal(group: Group, event: MouseEvent) {
    // Don't open modal if we're dragging
    if (draggedGroup.value) return;

    selectedGroup.value = group;
    selectedProfessor.value = null;
    selectedProfessorId.value = '';

    // Calculate modal position relative to the clicked element
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const modalWidth = 320; // w-80 = 320px
    const modalHeight = 300; // Approximate modal height
    const padding = 10;

    // Calculate position (try to position to the right, fallback to left if no space)
    let x = rect.right + padding;
    let y = rect.top;

    // Check if modal would go off-screen to the right
    if (x + modalWidth > window.innerWidth) {
        x = rect.left - modalWidth - padding;
    }

    // Check if modal would go off-screen at the bottom
    if (y + modalHeight > window.innerHeight) {
        y = window.innerHeight - modalHeight - padding;
    }

    // Ensure modal doesn't go off-screen at the top or left
    x = Math.max(padding, x);
    y = Math.max(padding, y);

    modalPosition.value = { x, y };
    showProfessorModal.value = true;
}

function closeProfessorModal() {
    showProfessorModal.value = false;
    selectedGroup.value = null;
    selectedProfessor.value = null;
    selectedProfessorId.value = '';
}

function saveProfessorChange() {
    if (selectedGroup.value && selectedProfessorId.value) {
        // Find the selected professor by ID
        const newProfessor = mockProfessors.find(p => p.id === selectedProfessorId.value);

        if (newProfessor) {
            // Update the group's professor
            const groupIndex = mockGroups.findIndex(g => g.id === selectedGroup.value!.id);
            if (groupIndex !== -1) {
                mockGroups[groupIndex].professor = newProfessor;
            }

            // In a real app, this would make an API call
            console.log(`Cambiando profesor del grupo ${selectedGroup.value.code} a ${newProfessor.name}`);
        }

        closeProfessorModal();
    }
}

function toggleFullscreen() {
    const element = document.querySelector('.schedule-table-container')
    if (!element) return

    if (!isFullscreen.value) {
        if (element.requestFullscreen) {
            element.requestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
    }
}

function handleFullscreenChange() {
    isFullscreen.value = !!document.fullscreenElement
}

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

// Emitir evento cuando cambie el nivel (opcional, por si el componente padre necesita saberlo)
defineEmits(['nivelChanged']);
</script>

<style scoped>
/* Custom scrollbar for modal */
.max-h-48::-webkit-scrollbar {
    width: 6px;
}

.max-h-48::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Drag and drop styles */
.cursor-grab {
    cursor: grab;
}

.cursor-grabbing {
    cursor: grabbing;
}

/* Drag and drop styles only */
</style>