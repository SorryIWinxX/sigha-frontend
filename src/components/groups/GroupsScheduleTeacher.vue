<template>
    <div class="flex flex-col gap-4 py-4">
        <!-- Unsaved Changes Indicator -->
        <div v-if="hasUnsavedChanges" class="bg-yellow-500 rounded-sm p-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <span class="text-white font-medium">
                        {{ changedGroups.size }} cambio{{ changedGroups.size !== 1 ? 's' : '' }} sin guardar
                    </span>
                </div>
                <Button variant="secondary" @click="toggleChangesDetails"
                    class="bg-white hover:bg-gray-200 text-black  px-2 py-1 text-xs">
                    {{ showChangesDetails ? 'Ocultar' : 'Ver' }} detalles
                    <ChevronDown :class="{ 'rotate-180': showChangesDetails }" class="w-4 h-4 transition-transform" />
                </Button>
            </div>

            <!-- Changes Details -->
            <div v-if="showChangesDetails" class="mt-3  rounded p-3">
                <div class="space-y-2">
                    <div v-for="change in detailedChanges" :key="change.groupId"
                        class="bg-white rounded p-2 text-black text-sm">
                        <div class="font-medium">{{ change.groupCode }} - {{ change.subject }}</div>
                        <div class="text-xs mt-1 space-y-1">
                            <div v-for="detail in change.changes" :key="detail.type" class="flex items-center gap-2">
                                <span class="inline-block w-2 h-2 bg-white rounded-full"></span>
                                <span>{{ detail.description }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters Section -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end items-center">
            <Button variant="primary" @click="groupsStore.openCreateModal()">
                <template #icon>
                    <Plus :size="18" />
                </template>
                Crear grupo
            </Button>


            <div class="w-full sm:w-auto flex gap-2">
                <Button variant="secondary" @click="toggleFilters">
                    <Filter class="w-4 h-4" />
                    Filtros
                    <span v-if="activeFiltersCount > 0"
                        class="ml-1 bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">
                        {{ activeFiltersCount }}
                    </span>
                </Button>

                <Button variant="secondary" @click="toggleFullscreen"
                    :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'">
                    <Maximize2 :size="18" />
                </Button>
                <Button variant="info" @click="openCopyScheduleModal">
                    Horario anterior
                    <ClipboardCopy :size="18" />
                </Button>
                <Button variant="danger" @click="undoChanges" :disabled="!hasUnsavedChanges">
                    Deshacer Cambios
                    <Trash2 :size="18" />
                </Button>

                <Button variant="primary" @click="saveChanges" :disabled="!hasUnsavedChanges || isSaving">
                    <span v-if="isSaving">Guardando...</span>
                    <span v-else>Guardar cambios</span>
                    <Save :size="18" />
                </Button>
            </div>
        </div>

        <!-- Filter Panel -->
        <div v-if="showFilters" class="p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Filter by level -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                    <Select id="filter-level" v-model="filters.level" :options="levelOptions" @change="applyFilters">
                    </Select>
                </div>

                <!-- Filter by professor -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Profesor</label>
                    <Select id="filter-professor" v-model="filters.professor" :options="professorOptions"
                        @change="applyFilters">
                    </Select>
                </div>

                <!-- Filter by subject -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Materia</label>
                    <Select id="filter-subject" v-model="filters.subject" :options="subjectOptions"
                        @change="applyFilters">
                    </Select>
                </div>
            </div>

            <div class="mt-4 flex gap-2">
                <Button variant="primary" @click="clearFilters">
                    Limpiar filtros
                </Button>
                <span class="text-sm text-gray-600 flex items-center">
                    Mostrando {{ groups.length }} de {{ allGroups.length }} horarios (grupos únicos: {{
                        uniqueFilteredGroupCount }} de {{ uniqueTotalGroupCount }})
                </span>
            </div>
        </div>

        <!-- Color Legend -->
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-sm">
            <div class="text-lg font-bold text-gray-700 mb-2">Colores por nivel</div>
            <div class="flex flex-wrap gap-x-4 gap-y-2 items-center">
                <div v-for="item in legendItems" :key="item.level" class="flex items-center gap-2">
                    <span :class="['inline-block w-4 h-4 rounded-full', item.bgClass]"></span>
                    <span class="text-sm text-gray-700">Nivel {{ item.level }}</span>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="text-gray-600">Cargando horarios...</div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="text-red-700">{{ error }}</div>
            <Button @click="loadScheduleData" variant="secondary" class="mt-2">
                Reintentar
            </Button>
        </div>

        <!-- Schedule Table -->
        <div v-else class="rounded-sm border border-gray-300 schedule-table-container" :class="{
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
                                class="border border-gray-300 p-2 bg-white align-top" @dragover="handleDragOver"
                                @drop="handleDrop($event, hour, day)" @dragenter="handleDragEnter($event, hour, day)"
                                @dragleave="handleDragLeave($event)" :class="{
                                    'bg-blue-50 border-blue-300': isDragOverSlot === `${hour}-${day}` && canDropInSlot(hour, day),
                                    'bg-red-100 border-red-300': isDragOverSlot === `${hour}-${day}` && !canDropInSlot(hour, day)
                                }" style="height: auto; min-height: 120px; max-height: 400px; overflow-y: auto;">

                                <!-- Groups Container -->
                                <div class="flex flex-col gap-2">
                                    <div v-for="group in getGroupsForSlot(hour, day)" :key="group.id" draggable="true"
                                        @dragstart="handleDragStart($event, group)" @dragend="handleDragEnd"
                                        @click="openProfessorModal(group, $event)"
                                        class="group w-52 rounded-sm p-3 transition-all duration-300 hover:translate-x-1 cursor-pointer relative"
                                        :class="[
                                            // Default styles
                                            'bg-gray-100 border-l-8',
                                            // Level-based border color and hover
                                            getGroupCardClasses(group),
                                            // Modified state indicator
                                            isGroupModified(group.id) ? 'ring-2 ring-amber-400' : '',
                                            // Drag states
                                            {
                                                'opacity-50 scale-95': draggedGroup?.id === group.id,
                                                'cursor-grab': !draggedGroup,
                                                'cursor-grabbing': draggedGroup?.id === group.id
                                            }
                                        ]">

                                        <!-- Modified indicator -->
                                        <div v-if="isGroupModified(group.id)"
                                            class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white z-1 animate-pulse">
                                        </div>

                                        <!-- Group Code -->
                                        <div class="font-bold text-sm group-hover:text-white text-gray-800 mb-1">
                                            {{ group.code }}
                                            <span v-if="isGroupModified(group.id)"
                                                class="text-amber-700 text-xs ml-1 font-medium">
                                                (modificado)
                                            </span>
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
                                            <div class="text-xs text-gray-700 group-hover:text-white truncate flex-1"
                                                :title="group.professor.name">
                                                {{ group.professor.name }}
                                            </div>

                                        </div>

                                        <!-- Level indicator -->
                                        <div class="mt-2">
                                            <span
                                                class="px-2 py-0.5 bg-info-500 text-white group-hover:bg-white group-hover:text-gray-500  rounded text-xs">
                                                {{ group.level }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Empty state -->
                                <div v-if="getGroupsForSlot(hour, day).length === 0"
                                    class="text-gray-400 text-xs text-center py-8 h-full flex items-center justify-center"
                                    :class="{
                                        'text-blue-700 font-medium': isDragOverSlot === `${hour}-${day}` && canDropInSlot(hour, day),
                                        'text-red-700 font-medium': isDragOverSlot === `${hour}-${day}` && !canDropInSlot(hour, day)
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

                <div class="text-normal text-gray-600 ">
                    <span
                        class="px-2 py-0.5 bg-info-500 text-white group-hover:bg-white group-hover:text-gray-500  rounded text-xs">
                        {{ selectedGroup.level }}
                    </span>
                </div>
            </div>

            <div class="mb-4">
                <Select id="professor-select" label="Profesor" v-model="selectedProfessorId"
                    :options="modalProfessorOptions" placeholder="Elige un profesor" width="w-full">
                </Select>

                <!-- Error de conflicto de horario -->
                <div v-if="professorConflictValidation.hasConflict"
                    class="mt-2 text-sm text-white bg-danger-500 p-2 rounded">
                    <div class="flex items-start space-x-2">

                        <div>
                            <div class="font-medium">Conflicto de horario</div>
                            <div class="text-sm">{{ professorConflictValidation.conflictMessage }}</div>
                        </div>
                    </div>
                </div>

                <!-- Mensaje cuando es el mismo profesor (pero no cuando es null/sin asignar) -->
                <div v-else-if="selectedGroup && selectedProfessorId === selectedGroup.professor.id && selectedProfessorId !== 'null'"
                    class="mt-2 text-sm text-white bg-gray-500 p-2 rounded">
                    <div class="flex items-center space-x-2">


                        <div>Este profesor ya está asignado a este grupo</div>
                    </div>
                </div>

                <!-- Información adicional cuando no hay profesores disponibles -->
                <div v-else-if="availableProfessors.length === 0"
                    class="mt-2 text-sm text-white bg-danger-500 p-2 rounded">
                    No hay profesores asignados al área que contiene esta materia.
                </div>
                <div v-else-if="availableProfessors.length < professors.length"
                    class="mt-2 text-sm text-white bg-primary-500 p-2 rounded">
                    Mostrando {{ availableProfessors.length }} de {{ professors.length }} profesores (solo los
                    asignados a esta área).
                </div>
            </div>

            <div class="flex justify-end space-x-2">
                <Button @click="openDeleteModal(selectedGroup)" variant="danger">
                    Eliminar
                </Button>
                <Button @click="closeProfessorModal" variant="secondary">
                    Cancelar
                </Button>
                <Button @click="saveProfessorChange" variant="primary" :disabled="!canSaveProfessorChange">
                    Guardar
                </Button>

            </div>
        </div>
    </div>

    <!-- Copy Previous Schedule Modal -->
    <div v-if="showCopyScheduleModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="closeCopyScheduleModal"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl p-6 w-96 max-w-[90vw]">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Copiar Horario Anterior</h3>
                <button @click="closeCopyScheduleModal" class="text-gray-400 hover:text-gray-600">
                    <X :size="20" />
                </button>
            </div>

            <div class="mb-4">
                <p class="text-sm text-gray-600 mb-4">
                    Selecciona el semestre del cual quieres copiar los horarios.
                    <strong class="text-amber-600">Esto reemplazará todos los horarios actuales.</strong>
                </p>

                <Select id="semester-select" label="Semestre anterior" v-model="selectedPreviousSemesterId"
                    :options="semesterOptions" placeholder="Selecciona un semestre" width="w-full">
                </Select>
            </div>

            <div class="flex justify-end space-x-3">
                <Button @click="closeCopyScheduleModal" variant="secondary">
                    Cancelar
                </Button>
                <Button @click="copyPreviousSchedule" variant="info"
                    :disabled="!selectedPreviousSemesterId || isCopyingSchedule">
                    <span v-if="isCopyingSchedule">Copiando...</span>
                    <span v-else>Copiar Horario</span>
                    <ClipboardCopy v-if="!isCopyingSchedule" :size="16" class="ml-1" />
                </Button>
            </div>
        </div>
    </div>

    <!-- Group Modal (Create/Edit) -->
    <GroupModal :is-visible="groupsStore.isModalOpen" :mode="groupsStore.getModalMode"
        :edit-data="groupsStore.getEditingGroup" @close="groupsStore.closeModal()" @submit="handleModalSubmit" />

    <!-- Delete Group Confirmation Modal -->
    <ConfirmationModal :is-visible="showDeleteModal" title="Eliminar Grupo"
        :message="groupToDelete ? `¿Estás seguro de que quieres eliminar el grupo ${groupToDelete.code}? Esta acción no se puede deshacer.` : ''"
        confirm-text="Eliminar" cancel-text="Cancelar" confirm-variant="danger" cancel-variant="secondary"
        @confirm="confirmDeleteGroup" @cancel="closeDeleteModal" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, reactive } from 'vue';
import { User as UserIcon, X, Save, Trash2, ArrowLeft, Plus, ClipboardCopy, Maximize2, Filter, ChevronDown, Info, AlertTriangle, FileText } from 'lucide-vue-next';
import Select from '@/components/ui/base/BaseSelect.vue';
import Button from '@/components/ui/base/BaseButton.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import GroupModal from '@/components/groups/GroupModal.vue';

// Toast notifications
import { showErrorToast, showSuccessToast } from '@/utils/toast';

// Services
import { groupsService } from '@/services/groupsService';
import { userService } from '@/services/userServices';
import { AreasService } from '@/services/areasService';
import { SemesterService } from '@/services/semesterService';
import { useSemesterStore } from '@/store/semesterStore';
import { useGroupsStore } from '@/store/groupsStore';

// Props
interface Props {
    semesterId?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
    semesterId: null
});

// Types
import type { Group as ApiGroup, ScheduleItem, BulkScheduleUpdateRequest, ScheduleUpdateItem } from '@/types/groups';
import type { User } from '@/types/user';
import type { Area, Subject } from '@/types/areas';
import type { Semester } from '@/types/semester';

// Component interfaces (for display)
interface Professor {
    id: string;
    name: string;
    department: string;
    photo?: string;
}

interface GroupDisplay {
    id: string;
    code: string;
    subject: string;
    professor: Professor;
    level: string;
    day: string;
    hour: string;
}

// Reactive state
const showProfessorModal = ref(false);
const selectedGroup = ref<GroupDisplay | null>(null);
const selectedProfessor = ref<Professor | null>(null);
const selectedProfessorId = ref('');
const modalPosition = ref({ x: 0, y: 0 });
const isFullscreen = ref(false);
const loading = ref(true);
const error = ref<string | null>(null);

// Search and filter state
const searchQuery = ref('');
const showFilters = ref(false);
const filters = reactive({
    level: '',
    professor: '',
    subject: ''
});

// Drag and drop state
const draggedGroup = ref<GroupDisplay | null>(null);
const isDragOverSlot = ref<string | null>(null);

// Change tracking state
const hasUnsavedChanges = ref(false);
const isSaving = ref(false);
const originalGroups = ref<GroupDisplay[]>([]);
const changedGroups = ref<Set<string>>(new Set());

// Data
const groups = ref<GroupDisplay[]>([]);
const allGroups = ref<GroupDisplay[]>([]);
const professors = ref<Professor[]>([]);
const subjects = ref<Subject[]>([]);
const areasData = ref<Area[]>([]);
const usersData = ref<User[]>([]);

// Store
const semesterStore = useSemesterStore();
const groupsStore = useGroupsStore();
const areasService = new AreasService();
const semesterService = new SemesterService();

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

// Day mapping for API data
const dayMapping: { [key: string]: string } = {
    'LUNES': 'monday',
    'MARTES': 'tuesday',
    'MIERCOLES': 'wednesday',
    'JUEVES': 'thursday',
    'VIERNES': 'friday',
    'SABADO': 'saturday'
};

// Time slots (6 AM to 10 PM)
const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
];

// Options for selects
const levelOptions = [
    { label: 'Todos los niveles', value: '' },
    { label: '1-2-3', value: '1-2-3' },
    { label: '3-4-5', value: '3-4-5' },
    { label: '5-6-7', value: '5-6-7' },
    { label: '7-8-9-E', value: '7-8-9-E' }
]

const professorOptions = computed(() => [
    { label: 'Todos los profesores', value: '' },
    ...sortedProfessors.value.map(p => ({ label: p.name, value: p.id }))
])

const subjectOptions = computed(() => [
    { label: 'Todas las materias', value: '' },
    ...subjects.value.map(s => ({ label: `${s.code} - ${s.name}`, value: s.id.toString() }))
])

const modalProfessorOptions = computed(() => [
    { label: 'SIN ASIGNAR', value: 'null' },
    ...availableProfessors.value.map(p => ({ label: p.name, value: p.id }))
])

const semesterOptions = computed(() => [
    { label: 'Selecciona un semestre', value: '' },
    ...availableSemesters.value.map(s => ({ label: s.description, value: s.id }))
])

// Load data functions
async function loadScheduleData() {
    try {
        loading.value = true;
        error.value = null;

        // Use semesterId prop or fallback to current semester from store
        const semesterId = props.semesterId || semesterStore.currentSemester?.id;
        if (!semesterId) {
            throw new Error('No hay semestre seleccionado');
        }

        // Load data in parallel
        const [apiGroups, users, areas] = await Promise.all([
            groupsService.getGroups(semesterId),
            userService.getUsers(),
            areasService.getAreas()
        ]);

        // Store raw data for filtering
        usersData.value = users;
        areasData.value = areas;

        // Map users to professors
        professors.value = users.map((user: User) => ({
            id: user.id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            department: user.rolesDescriptions.join(', ') || 'Sin departamento',
            photo: user.photo
        }));

        // Extract subjects from areas
        subjects.value = areas.flatMap((area: Area) => area.subjectList);

        // Map API groups to display format and filter only groups with schedules
        const mappedGroups = apiGroups
            .filter((group: ApiGroup) => group.scheduleList && group.scheduleList.length > 0)
            .flatMap((group: ApiGroup) => mapGroupToDisplayFormat(group))
            .filter((group: GroupDisplay | null) => group !== null) as GroupDisplay[];

        groups.value = mappedGroups;
        allGroups.value = [...mappedGroups];

        // Store original state for change tracking
        originalGroups.value = JSON.parse(JSON.stringify(mappedGroups));
        hasUnsavedChanges.value = false;
        changedGroups.value.clear();

        console.log('groups.value', groups.value);

        // Summary counts for quick comparison
        const uniqueApiGroupIds = new Set(mappedGroups.map(g => parseInt(g.id.split('-')[0])));
        console.log('Total de horarios (tarjetas):', mappedGroups.length);
        console.log('Total de grupos únicos:', uniqueApiGroupIds.size);



        loading.value = false;
    } catch (err) {
        console.error('Error loading schedule data:', err);
        error.value = err instanceof Error ? err.message : 'Error al cargar los datos';
        loading.value = false;
    }
}

function mapGroupToDisplayFormat(apiGroup: ApiGroup): GroupDisplay[] {
    if (!apiGroup.scheduleList || apiGroup.scheduleList.length === 0) {
        return [];
    }

    // Find subject name
    const subject = subjects.value.find(s => s.id === apiGroup.idSubject);
    const subjectName = subject?.name || `Materia ${apiGroup.idSubject}`;

    // Find professor
    const professor = professors.value.find(p => p.id === apiGroup.idDocente?.toString());
    const professorInfo: Professor = professor || {
        id: apiGroup.idDocente?.toString() || 'null',
        name: 'SIN ASIGNAR',
        department: 'Sin departamento'
    };

    // Map each schedule item to a display group
    return apiGroup.scheduleList.map(schedule => {
        const dayKey = dayMapping[schedule.day.toUpperCase()];
        const hourStr = formatHourToTimeSlot(schedule.hour);

        if (!dayKey || !hourStr) {
            return null;
        }

        return {
            id: `${apiGroup.id}-${schedule.hour}-${schedule.day}`,
            code: apiGroup.code,
            subject: subjectName,
            professor: professorInfo,
            level: apiGroup.levelName || 'Sin nivel',
            day: dayKey,
            hour: hourStr
        };
    }).filter(group => group !== null) as GroupDisplay[];
}

function formatHourToTimeSlot(hour: number): string | null {
    // Convert 24-hour format to our time slots format
    const hourStr = hour.toString().padStart(2, '0') + ':00';
    return timeSlots.includes(hourStr) ? hourStr : null;
}

// Computed
const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.level) count++;
    if (filters.professor) count++;
    if (filters.subject) count++;
    return count;
});

// Conteo de grupos únicos (por id de grupo del API) para comparar
const uniqueTotalGroupCount = computed(() => {
    const ids = new Set(allGroups.value.map(g => parseInt(g.id.split('-')[0])));
    return ids.size;
});

const uniqueFilteredGroupCount = computed(() => {
    const ids = new Set(groups.value.map(g => parseInt(g.id.split('-')[0])));
    return ids.size;
});

// Profesores ordenados alfabéticamente para el filtro
const sortedProfessors = computed(() => {
    return [...professors.value].sort((a, b) => a.name.localeCompare(b.name));
});


/**
 * Filtra los profesores que pueden enseñar la materia del grupo seleccionado
 * basándose en las áreas asignadas a cada profesor
 */
function getProfessorsForSubject(subjectName: string): Professor[] {
    // Encuentra la materia por nombre
    const subject = subjects.value.find(s => s.name === subjectName);
    if (!subject) {
        return professors.value;
    }

    // Encuentra el área que contiene esta materia
    const area = areasData.value.find((area: Area) =>
        area.subjectList.some((areaSubject: Subject) => areaSubject.id === subject.id)
    );

    if (!area) {
        return professors.value;
    }

    // Filtra los profesores que tienen esta área asignada
    return professors.value.filter(professor => {
        const professorUser = usersData.value.find((user: User) => user.id.toString() === professor.id);
        return professorUser?.idAreas?.includes(area.id) || false;
    });
}

const availableProfessors = computed(() => {
    let availableProfs = [];

    if (!selectedGroup.value) {
        availableProfs = professors.value;
    } else {
        availableProfs = getProfessorsForSubject(selectedGroup.value.subject);
    }

    // Ordenar alfabéticamente
    return [...availableProfs].sort((a, b) => a.name.localeCompare(b.name));
});

// Validation for professor assignment
const professorConflictValidation = computed(() => {
    if (!selectedGroup.value || !selectedProfessorId.value || selectedProfessorId.value === 'null') {
        return { hasConflict: false, conflictMessage: '', conflictingGroups: [] };
    }

    // Validate against ALL groups in the system, not just filtered ones
    const conflictingGroups = allGroups.value.filter(group =>
        group.id !== selectedGroup.value!.id && // Not the same group
        group.professor.id === selectedProfessorId.value && // Same professor
        group.hour === selectedGroup.value!.hour && // Same hour
        group.day === selectedGroup.value!.day // Same day
    );

    if (conflictingGroups.length > 0) {
        const conflictingGroup = conflictingGroups[0];
        const dayName = getDayLabel(selectedGroup.value.day);
        const timeRange = formatTimeRange(selectedGroup.value.hour);

        return {
            hasConflict: true,
            conflictMessage: `El profesor ya tiene asignado el grupo ${conflictingGroup.code} en ${dayName} de ${timeRange}`,
            conflictingGroups: conflictingGroups
        };
    }

    return { hasConflict: false, conflictMessage: '', conflictingGroups: [] };
});

const canSaveProfessorChange = computed(() => {
    if (!selectedProfessorId.value || availableProfessors.value.length === 0) {
        return false;
    }

    // Check for conflicts
    if (professorConflictValidation.value.hasConflict) {
        return false;
    }

    // Check if it's the same professor (no change needed), but allow null/sin asignar
    if (selectedGroup.value && selectedProfessorId.value === selectedGroup.value.professor.id && selectedProfessorId.value !== 'null') {
        return false;
    }

    return true;
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

function getGroupsForSlot(hour: string, day: string): GroupDisplay[] {
    return groups.value.filter(group =>
        group.hour === hour && group.day === day
    );
}

/**
 * Asigna un color específico basado en el nivel del grupo
 * Cada nivel tiene un color único asignado
 */
function getLevelColor(level: string): string {
    // Colores definidos por variables de entorno (si existen)
    const envLevelColors: { [key: string]: string } = {
        '1': import.meta.env.VITE_LEVEL_COLOR_1 || '',
        '2': import.meta.env.VITE_LEVEL_COLOR_2 || '',
        '3': import.meta.env.VITE_LEVEL_COLOR_3 || '',
        '4': import.meta.env.VITE_LEVEL_COLOR_4 || '',
        '5': import.meta.env.VITE_LEVEL_COLOR_5 || '',
        '6': import.meta.env.VITE_LEVEL_COLOR_6 || '',
        '7': import.meta.env.VITE_LEVEL_COLOR_7 || '',
        '8': import.meta.env.VITE_LEVEL_COLOR_8 || '',
        '9': import.meta.env.VITE_LEVEL_COLOR_9 || '',
        '10': import.meta.env.VITE_LEVEL_COLOR_10 || '',
        'E': import.meta.env.VITE_LEVEL_COLOR_E || ''
    };

    // Si hay color en env para el nivel exacto, usarlo
    if (envLevelColors[level]) {
        return envLevelColors[level];
    }

    // Mapeo por defecto de niveles a colores
    const levelColorMap: { [key: string]: string } = {
        // Colores vibrantes, bien diferenciados
        '1': 'red-500',
        '2': 'purple-500',
        '3': 'amber-500',
        '4': 'indigo-600',
        '5': 'lime-500',
        '6': 'green-500',
        '7': 'yellow-500',
        '8': 'rose-500',
        '9': 'violet-500',
        '10': 'blue-500',
        'E': 'stone-700', // Marrón aproximado
        // Rangos de niveles
        '1-2-3': 'pink-600',
        '3-4-5': 'indigo-600',
        '5-6-7': 'teal-600',
        '7-8-9-E': 'yellow-600'
    };

    // Buscar coincidencia exacta primero
    if (levelColorMap[level]) {
        return levelColorMap[level];
    }

    // Si no hay coincidencia exacta, extraer el primer número del nivel
    const match = level.match(/(\d+)/);
    if (match) {
        const firstNumber = match[1];
        // Intentar con variables de entorno para el primer número del rango
        if (envLevelColors[firstNumber]) {
            return envLevelColors[firstNumber];
        }
        if (levelColorMap[firstNumber]) {
            return levelColorMap[firstNumber];
        }
    }

    // Color por defecto
    return 'gray-500';
}

/**
 * Obtiene las clases CSS para una tarjeta de grupo basadas en el nivel
 */
function getGroupCardClasses(group: GroupDisplay): string {
    const levelColor = getLevelColor(group.level);

    // Mapear colores Tailwind a clases de border y hover
    const colorMap: { [key: string]: { border: string; hover: string } } = {
        'red-500': { border: 'border-red-500', hover: 'hover:bg-red-500' },
        'red-600': { border: 'border-red-600', hover: 'hover:bg-red-600' },
        'orange-500': { border: 'border-orange-500', hover: 'hover:bg-orange-500' },
        'orange-600': { border: 'border-orange-600', hover: 'hover:bg-orange-600' },
        'amber-500': { border: 'border-amber-500', hover: 'hover:bg-amber-500' },
        'amber-600': { border: 'border-amber-600', hover: 'hover:bg-amber-600' },
        'yellow-500': { border: 'border-yellow-500', hover: 'hover:bg-yellow-500' },
        'yellow-600': { border: 'border-yellow-600', hover: 'hover:bg-yellow-600' },
        'lime-500': { border: 'border-lime-500', hover: 'hover:bg-lime-500' },
        'lime-600': { border: 'border-lime-600', hover: 'hover:bg-lime-600' },
        'green-500': { border: 'border-green-500', hover: 'hover:bg-green-500' },
        'green-600': { border: 'border-green-600', hover: 'hover:bg-green-600' },
        'emerald-500': { border: 'border-emerald-500', hover: 'hover:bg-emerald-500' },
        'emerald-600': { border: 'border-emerald-600', hover: 'hover:bg-emerald-600' },
        'teal-500': { border: 'border-teal-500', hover: 'hover:bg-teal-500' },
        'teal-600': { border: 'border-teal-600', hover: 'hover:bg-teal-600' },
        'cyan-500': { border: 'border-cyan-500', hover: 'hover:bg-cyan-500' },
        'cyan-600': { border: 'border-cyan-600', hover: 'hover:bg-cyan-600' },
        'sky-500': { border: 'border-sky-500', hover: 'hover:bg-sky-500' },
        'sky-600': { border: 'border-sky-600', hover: 'hover:bg-sky-600' },
        'blue-500': { border: 'border-blue-500', hover: 'hover:bg-blue-500' },
        'blue-600': { border: 'border-blue-600', hover: 'hover:bg-blue-600' },
        'indigo-500': { border: 'border-indigo-500', hover: 'hover:bg-indigo-500' },
        'indigo-600': { border: 'border-indigo-600', hover: 'hover:bg-indigo-600' },
        'violet-500': { border: 'border-violet-500', hover: 'hover:bg-violet-500' },
        'violet-600': { border: 'border-violet-600', hover: 'hover:bg-violet-600' },
        'purple-500': { border: 'border-purple-500', hover: 'hover:bg-purple-500' },
        'purple-600': { border: 'border-purple-600', hover: 'hover:bg-purple-600' },
        'fuchsia-500': { border: 'border-fuchsia-500', hover: 'hover:bg-fuchsia-500' },
        'fuchsia-600': { border: 'border-fuchsia-600', hover: 'hover:bg-fuchsia-600' },
        'pink-500': { border: 'border-pink-500', hover: 'hover:bg-pink-500' },
        'pink-600': { border: 'border-pink-600', hover: 'hover:bg-pink-600' },
        'rose-500': { border: 'border-rose-500', hover: 'hover:bg-rose-500' },
        'rose-600': { border: 'border-rose-600', hover: 'hover:bg-rose-600' },
        'stone-700': { border: 'border-stone-700', hover: 'hover:bg-stone-700' }
    };

    const colors = colorMap[levelColor] || { border: 'border-gray-500', hover: 'hover:bg-gray-500' };
    return `${colors.border} ${colors.hover}`;
}

/**
 * Obtiene la clase de border para el modal basada en el nivel
 */
function getModalBorderClass(group: GroupDisplay): string {
    const levelColor = getLevelColor(group.level);

    const colorMap: { [key: string]: string } = {
        'red-500': 'border-red-500',
        'red-600': 'border-red-600',
        'orange-500': 'border-orange-500',
        'orange-600': 'border-orange-600',
        'amber-500': 'border-amber-500',
        'amber-600': 'border-amber-600',
        'yellow-500': 'border-yellow-500',
        'yellow-600': 'border-yellow-600',
        'lime-500': 'border-lime-500',
        'lime-600': 'border-lime-600',
        'green-500': 'border-green-500',
        'green-600': 'border-green-600',
        'emerald-500': 'border-emerald-500',
        'emerald-600': 'border-emerald-600',
        'teal-500': 'border-teal-500',
        'teal-600': 'border-teal-600',
        'cyan-500': 'border-cyan-500',
        'cyan-600': 'border-cyan-600',
        'sky-500': 'border-sky-500',
        'sky-600': 'border-sky-600',
        'blue-500': 'border-blue-500',
        'blue-600': 'border-blue-600',
        'indigo-500': 'border-indigo-500',
        'indigo-600': 'border-indigo-600',
        'violet-500': 'border-violet-500',
        'violet-600': 'border-violet-600',
        'purple-500': 'border-purple-500',
        'purple-600': 'border-purple-600',
        'fuchsia-500': 'border-fuchsia-500',
        'fuchsia-600': 'border-fuchsia-600',
        'pink-500': 'border-pink-500',
        'pink-600': 'border-pink-600',
        'rose-500': 'border-rose-500',
        'rose-600': 'border-rose-600',
        'stone-700': 'border-stone-700'
    };

    return colorMap[levelColor] || 'border-gray-500';
}

// Leyenda de colores
const legendItems = computed(() => {
    const levels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'E'];
    // Mapear tokens a clases bg-*
    const bgColorMap: { [key: string]: string } = {
        'red-500': 'bg-red-500',
        'red-600': 'bg-red-600',
        'orange-500': 'bg-orange-500',
        'orange-600': 'bg-orange-600',
        'amber-500': 'bg-amber-500',
        'amber-600': 'bg-amber-600',
        'yellow-500': 'bg-yellow-500',
        'yellow-600': 'bg-yellow-600',
        'lime-500': 'bg-lime-500',
        'lime-600': 'bg-lime-600',
        'green-500': 'bg-green-500',
        'green-600': 'bg-green-600',
        'emerald-500': 'bg-emerald-500',
        'emerald-600': 'bg-emerald-600',
        'teal-500': 'bg-teal-500',
        'teal-600': 'bg-teal-600',
        'cyan-500': 'bg-cyan-500',
        'cyan-600': 'bg-cyan-600',
        'sky-500': 'bg-sky-500',
        'sky-600': 'bg-sky-600',
        'blue-500': 'bg-blue-500',
        'blue-600': 'bg-blue-600',
        'indigo-500': 'bg-indigo-500',
        'indigo-600': 'bg-indigo-600',
        'violet-500': 'bg-violet-500',
        'violet-600': 'bg-violet-600',
        'purple-500': 'bg-purple-500',
        'purple-600': 'bg-purple-600',
        'fuchsia-500': 'bg-fuchsia-500',
        'fuchsia-600': 'bg-fuchsia-600',
        'pink-500': 'bg-pink-500',
        'pink-600': 'bg-pink-600',
        'rose-500': 'bg-rose-500',
        'rose-600': 'bg-rose-600',
        'stone-700': 'bg-stone-700',
        'gray-500': 'bg-gray-500'
    };

    return levels.map(lvl => {
        const token = getLevelColor(lvl);
        return {
            level: lvl,
            bgClass: bgColorMap[token] || 'bg-gray-500'
        };
    });
});

// Drag and Drop Methods
function handleDragStart(event: DragEvent, group: GroupDisplay) {
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

    // Si el profesor está sin asignar, permitir el drop sin verificar conflictos
    if (draggedGroup.value.professor.id === 'null') return true;

    // Check if the professor has a conflict at this time against ALL groups
    const conflictingGroups = allGroups.value.filter(group =>
        group.id !== draggedGroup.value!.id &&
        group.hour === hour &&
        group.day === day &&
        group.professor.id === draggedGroup.value!.professor.id
    );

    return conflictingGroups.length === 0;
}

function handleDrop(event: DragEvent, hour: string, day: string) {
    event.preventDefault();

    if (!draggedGroup.value) {
        isDragOverSlot.value = null;
        return;
    }

    // Check if the drop is valid and show specific error messages
    if (!canDropInSlot(hour, day)) {
        // Find conflicting groups to provide a specific error message (check ALL groups)
        const conflictingGroups = allGroups.value.filter(group =>
            group.id !== draggedGroup.value!.id &&
            group.hour === hour &&
            group.day === day &&
            group.professor.id === draggedGroup.value!.professor.id
        );

        if (conflictingGroups.length > 0) {
            const conflictingGroup = conflictingGroups[0];
            showErrorToast(
                `No se puede asignar: El profesor ${draggedGroup.value.professor.name} ya tiene el grupo ${conflictingGroup.code} programado en ${getDayLabel(day)} de ${formatTimeRange(hour)}`
            );
        } else {
            showErrorToast(
                `No se puede asignar el grupo ${draggedGroup.value.code} en ${getDayLabel(day)} de ${formatTimeRange(hour)}`
            );
        }

        isDragOverSlot.value = null;
        return;
    }

    // Find the group in the data and update its schedule
    const groupIndex = groups.value.findIndex(g => g.id === draggedGroup.value!.id);
    if (groupIndex !== -1) {
        const oldHour = groups.value[groupIndex].hour;
        const oldDay = groups.value[groupIndex].day;

        groups.value[groupIndex].hour = hour;
        groups.value[groupIndex].day = day;

        // Also update allGroups to maintain consistency
        const allGroupsIndex = allGroups.value.findIndex(g => g.id === draggedGroup.value!.id);
        if (allGroupsIndex !== -1) {
            allGroups.value[allGroupsIndex].hour = hour;
            allGroups.value[allGroupsIndex].day = day;
        }

        // Mark group as changed
        changedGroups.value.add(draggedGroup.value!.id);
        hasUnsavedChanges.value = true;

        // Update change details if they are currently shown
        if (showChangesDetails.value) {
            generateDetailedChanges();
        }

        // Show success message
        showSuccessToast(
            `Grupo ${groups.value[groupIndex].code} movido exitosamente a ${getDayLabel(day)} de ${formatTimeRange(hour)}`
        );

        console.log(`Grupo ${groups.value[groupIndex].code} movido de ${getDayLabel(oldDay)} ${oldHour} a ${getDayLabel(day)} ${hour}`);

        // TODO: In a real app, this would make an API call to update the schedule
        // await updateGroupSchedule(draggedGroup.value.id, { hour, day });
    }

    isDragOverSlot.value = null;
}

function openProfessorModal(group: GroupDisplay, event: MouseEvent) {
    // Don't open modal if we're dragging
    if (draggedGroup.value) return;

    selectedGroup.value = group;
    selectedProfessor.value = null;
    selectedProfessorId.value = group.professor.id;

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
    if (!selectedGroup.value || !selectedProfessorId.value) {
        showErrorToast('Por favor selecciona un profesor');
        return;
    }

    // Validate for conflicts
    if (professorConflictValidation.value.hasConflict) {
        showErrorToast(professorConflictValidation.value.conflictMessage);
        return;
    }

    let newProfessor: Professor;

    if (selectedProfessorId.value === 'null') {
        // Handle "SIN ASIGNAR" case
        newProfessor = {
            id: 'null',
            name: 'SIN ASIGNAR',
            department: 'Sin departamento'
        };
    } else {
        // Find the selected professor by ID
        const foundProfessor = professors.value.find(p => p.id === selectedProfessorId.value);
        if (!foundProfessor) {
            showErrorToast('Profesor no encontrado');
            return;
        }
        newProfessor = foundProfessor;
    }

    // Extract the API group ID from the selected group (format: apiGroupId-hour-day)
    const apiGroupId = selectedGroup.value.id.split('-')[0];

    // Update ALL groups that belong to the same API group (same base ID)
    const groupsToUpdate = groups.value.filter(g => g.id.split('-')[0] === apiGroupId);

    groupsToUpdate.forEach(group => {
        const groupIndex = groups.value.findIndex(g => g.id === group.id);
        if (groupIndex !== -1) {
            groups.value[groupIndex].professor = { ...newProfessor };

            // Mark each group as changed
            changedGroups.value.add(group.id);
        }
    });

    // Also update allGroups to maintain consistency
    allGroups.value.forEach((group, index) => {
        if (group.id.split('-')[0] === apiGroupId) {
            allGroups.value[index].professor = { ...newProfessor };
        }
    });

    hasUnsavedChanges.value = true;

    // Update change details if they are currently shown
    if (showChangesDetails.value) {
        generateDetailedChanges();
    }

    // Show success message
    showSuccessToast(
        `Profesor del grupo ${selectedGroup.value.code} cambiado a ${newProfessor.name} en todos sus horarios (${groupsToUpdate.length} horarios)`
    );

    console.log(`Cambiando profesor del grupo ${selectedGroup.value.code} a ${newProfessor.name} en ${groupsToUpdate.length} horarios`);

    closeProfessorModal();

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

// Save and undo functions
async function saveChanges() {
    if (!hasUnsavedChanges.value || changedGroups.value.size === 0) {
        showErrorToast('No hay cambios para guardar');
        return;
    }

    try {
        isSaving.value = true;

        console.log('Changed groups:', Array.from(changedGroups.value));
        console.log('Groups with changes:', changedGroups.value.size);

        // Group changes by original group ID (from API)
        const groupChanges = new Map<number, ScheduleUpdateItem>();

        // Process all changed groups
        for (const changedGroupId of changedGroups.value) {
            const currentGroup = groups.value.find(g => g.id === changedGroupId);
            const originalGroup = originalGroups.value.find(g => g.id === changedGroupId);

            if (!currentGroup || !originalGroup) continue;

            // Extract the original API group ID from the display group ID
            const apiGroupId = parseInt(currentGroup.id.split('-')[0]);

            // Get or create the update item for this group
            let updateItem = groupChanges.get(apiGroupId);
            if (!updateItem) {
                updateItem = {
                    idGroup: apiGroupId,
                    scheduleList: []
                };
                groupChanges.set(apiGroupId, updateItem);
            }

            // Check if professor changed (always check, not just when creating new item)
            if (currentGroup.professor.id !== originalGroup.professor.id) {
                if (currentGroup.professor.id === 'null') {
                    updateItem.idDocente = null;
                } else {
                    updateItem.idDocente = parseInt(currentGroup.professor.id);
                }
            }

            // Convert day and hour back to API format
            const dayMapping: { [key: string]: string } = {
                'monday': 'LUNES',
                'tuesday': 'MARTES',
                'wednesday': 'MIERCOLES',
                'thursday': 'JUEVES',
                'friday': 'VIERNES',
                'saturday': 'SABADO'
            };

            const apiDay = dayMapping[currentGroup.day];
            const apiHour = parseInt(currentGroup.hour.split(':')[0]);

            // Add schedule item if not already present
            const existingSchedule = updateItem.scheduleList.find(s =>
                s.hour === apiHour && s.day === apiDay
            );

            if (!existingSchedule) {
                updateItem.scheduleList.push({
                    hour: apiHour,
                    day: apiDay
                });
            }
        }

        // Prepare final payload for API
        const completeGroupChanges: ScheduleUpdateItem[] = [];

        for (const [apiGroupId, updateItem] of groupChanges) {
            // Get all display groups that belong to this API group (current state)
            const allGroupSchedules = groups.value.filter(g => {
                const groupApiId = parseInt(g.id.split('-')[0]);
                return groupApiId === apiGroupId;
            });

            if (allGroupSchedules.length === 0) {
                console.warn(`No schedules found for API group ${apiGroupId}, skipping...`);
                continue;
            }

            // Build complete schedule list with current state
            const dayMapping: { [key: string]: string } = {
                'monday': 'LUNES',
                'tuesday': 'MARTES',
                'wednesday': 'MIERCOLES',
                'thursday': 'JUEVES',
                'friday': 'VIERNES',
                'saturday': 'SABADO'
            };

            const completeScheduleList = allGroupSchedules.map(g => ({
                hour: parseInt(g.hour.split(':')[0]),
                day: dayMapping[g.day]
            }));

            const completeUpdateItem: ScheduleUpdateItem = {
                idGroup: apiGroupId,
                scheduleList: completeScheduleList
            };

            // Add professor change if it exists
            if (updateItem.idDocente !== undefined) {
                completeUpdateItem.idDocente = updateItem.idDocente;
            }

            completeGroupChanges.push(completeUpdateItem);
        }

        // Send update to API
        await groupsService.updateSchedules(completeGroupChanges);

        // Reload data from API to ensure consistency
        await loadScheduleData();

        // Reapply filters if any were active
        if (hasActiveFilters.value) {
            applyFilters();
        }

        showSuccessToast('Cambios guardados exitosamente');

    } catch (error) {
        console.error('Error saving changes:', error);
        showErrorToast('Error al guardar los cambios: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
        isSaving.value = false;
    }
}

function undoChanges() {
    if (!hasUnsavedChanges.value) {
        showErrorToast('No hay cambios para deshacer');
        return;
    }

    // Restore original state
    allGroups.value = JSON.parse(JSON.stringify(originalGroups.value));
    hasUnsavedChanges.value = false;
    changedGroups.value.clear();

    // Reapply filters to update the displayed groups
    applyFilters();

    showSuccessToast('Cambios deshechados exitosamente');
}

// Filter functions
function toggleFilters() {
    showFilters.value = !showFilters.value;
}

function applyFilters() {
    if (!hasActiveFilters.value) {
        // If no filters, show all groups
        groups.value = [...allGroups.value];
        return;
    }

    let filteredData = [...allGroups.value];

    // Apply level filter
    if (filters.level) {
        filteredData = filteredData.filter(group => {
            // Check if the group level matches the selected level range
            const groupLevel = group.level;

            switch (filters.level) {
                case '1-2-3':
                    return ['1', '2', '3'].some(level => groupLevel.includes(level));
                case '3-4-5':
                    return ['3', '4', '5'].some(level => groupLevel.includes(level));
                case '5-6-7':
                    return ['5', '6', '7'].some(level => groupLevel.includes(level));
                case '7-8-9-E':
                    return ['7', '8', '9', 'E'].some(level => groupLevel.includes(level));
                default:
                    return true;
            }
        });
    }

    // Apply professor filter
    if (filters.professor) {
        filteredData = filteredData.filter(group =>
            group.professor.id === filters.professor
        );
    }

    // Apply subject filter
    if (filters.subject) {
        const selectedSubject = subjects.value.find(s => s.id.toString() === filters.subject);
        if (selectedSubject) {
            filteredData = filteredData.filter(group =>
                group.subject === selectedSubject.name
            );
        }
    }

    // Apply filters but don't validate conflicts here - we want to show filtered groups
    // Conflicts will be validated when assigning professors
    groups.value = filteredData;
}

const hasActiveFilters = computed(() => {
    return !!(filters.level || filters.professor || filters.subject);
});

function clearFilters() {
    filters.level = '';
    filters.professor = '';
    filters.subject = '';
    groups.value = allGroups.value;
}

// Watch for semester changes
watch(() => props.semesterId, async (newSemesterId) => {
    if (newSemesterId !== null) {
        await loadScheduleData();
    }
}, { immediate: false });

// Watch for semester store changes when no semesterId prop is provided
watch(() => semesterStore.currentSemester, async (newSemester) => {
    if (newSemester && !props.semesterId) {
        await loadScheduleData();
    }
}, { immediate: false });

// Lifecycle hooks
onMounted(async () => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Prevent accidental navigation when there are unsaved changes
    window.addEventListener('beforeunload', handleBeforeUnload);

    const semesterId = props.semesterId || semesterStore.currentSemester?.id;
    if (semesterId) {
        await loadScheduleData();
    } else {
        loading.value = false;
    }
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
});

// Handle before unload to warn about unsaved changes
function handleBeforeUnload(event: BeforeUnloadEvent) {
    if (hasUnsavedChanges.value) {
        event.preventDefault();
        event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
        return event.returnValue;
    }
}

// Component emits
defineEmits(['nivelChanged']);

// New state for detailed changes
const showChangesDetails = ref(false);
const detailedChanges = ref<{ groupId: string; groupCode: string; subject: string; changes: { type: string; description: string }[] }[]>([]);

// State for copy previous schedule modal
const showCopyScheduleModal = ref(false);
const availableSemesters = ref<Semester[]>([]);
const selectedPreviousSemesterId = ref<number | null>(null);
const isCopyingSchedule = ref(false);

// Delete group modal state
const showDeleteModal = ref(false);
const groupToDelete = ref<GroupDisplay | null>(null);
const isDeleting = ref(false);

function isGroupModified(groupId: string): boolean {
    const currentGroup = groups.value.find(g => g.id === groupId);
    const originalGroup = originalGroups.value.find(g => g.id === groupId);

    if (!currentGroup || !originalGroup) return false;

    return JSON.stringify(currentGroup) !== JSON.stringify(originalGroup);
}

function generateDetailedChanges() {
    const changes: { groupId: string; groupCode: string; subject: string; changes: { type: string; description: string }[] }[] = [];

    for (const groupId of changedGroups.value) {
        const currentGroup = groups.value.find(g => g.id === groupId);
        const originalGroup = originalGroups.value.find(g => g.id === groupId);

        if (!currentGroup || !originalGroup) continue;

        const groupChanges: { type: string; description: string }[] = [];

        // Check if schedule changed (day or hour)
        if (currentGroup.day !== originalGroup.day || currentGroup.hour !== originalGroup.hour) {
            const originalDay = getDayLabel(originalGroup.day);
            const originalTime = formatTimeRange(originalGroup.hour);
            const newDay = getDayLabel(currentGroup.day);
            const newTime = formatTimeRange(currentGroup.hour);

            if (currentGroup.day !== originalGroup.day && currentGroup.hour !== originalGroup.hour) {
                groupChanges.push({
                    type: 'schedule',
                    description: `Horario: ${originalDay} ${originalTime} → ${newDay} ${newTime}`
                });
            } else if (currentGroup.day !== originalGroup.day) {
                groupChanges.push({
                    type: 'day',
                    description: `Día: ${originalDay} → ${newDay}`
                });
            } else {
                groupChanges.push({
                    type: 'hour',
                    description: `Hora: ${originalTime} → ${newTime}`
                });
            }
        }

        // Check if professor changed
        if (currentGroup.professor.id !== originalGroup.professor.id) {
            groupChanges.push({
                type: 'professor',
                description: `Profesor: ${originalGroup.professor.name} → ${currentGroup.professor.name}`
            });
        }

        if (groupChanges.length > 0) {
            changes.push({
                groupId: groupId,
                groupCode: currentGroup.code,
                subject: currentGroup.subject,
                changes: groupChanges
            });
        }
    }

    detailedChanges.value = changes;
}

function toggleChangesDetails() {
    showChangesDetails.value = !showChangesDetails.value;
    if (showChangesDetails.value) {
        generateDetailedChanges();
    } else {
        detailedChanges.value = [];
    }
}

// Copy previous schedule methods
async function openCopyScheduleModal() {
    try {
        // Load available semesters
        const semesters = await semesterService.getSemesters();
        const currentSemesterId = props.semesterId || semesterStore.currentSemester?.id;

        // Filter out current semester and only show previous ones
        availableSemesters.value = semesters.filter(sem => sem.id !== currentSemesterId);

        if (availableSemesters.value.length === 0) {
            showErrorToast('No hay semestres anteriores disponibles');
            return;
        }

        selectedPreviousSemesterId.value = null;
        showCopyScheduleModal.value = true;
    } catch (error) {
        console.error('Error loading semesters:', error);
        showErrorToast('Error al cargar semestres anteriores');
    }
}

function closeCopyScheduleModal() {
    showCopyScheduleModal.value = false;
    selectedPreviousSemesterId.value = null;
    availableSemesters.value = [];
}

async function copyPreviousSchedule() {
    if (!selectedPreviousSemesterId.value) {
        showErrorToast('Por favor selecciona un semestre');
        return;
    }

    if (hasUnsavedChanges.value) {
        showErrorToast('Tienes cambios sin guardar. Guarda o descarta los cambios antes de copiar un horario anterior.');
        return;
    }

    try {
        isCopyingSchedule.value = true;

        const targetSemesterId = props.semesterId || semesterStore.currentSemester?.id;
        await groupsService.copyPreviousSchedule(selectedPreviousSemesterId.value, targetSemesterId);

        showSuccessToast('Horario anterior copiado exitosamente');
        closeCopyScheduleModal();

        // Reload the schedule data to show the copied schedule
        await loadScheduleData();

    } catch (error) {
        console.error('Error copying previous schedule:', error);
        showErrorToast('Error al copiar el horario anterior: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
        isCopyingSchedule.value = false;
    }
}

function openDeleteModal(group: GroupDisplay) {
    groupToDelete.value = group;
    showDeleteModal.value = true;
}

function closeDeleteModal() {
    showDeleteModal.value = false;
    groupToDelete.value = null;
}

async function confirmDeleteGroup() {
    if (!groupToDelete.value) {
        closeDeleteModal();
        return;
    }

    if (hasUnsavedChanges.value) {
        showErrorToast('Tienes cambios sin guardar. Guarda o descarta los cambios antes de eliminar un grupo.');
        closeDeleteModal();
        return;
    }

    try {
        isDeleting.value = true;

        // Extract the API group ID from the display group ID (format: apiGroupId-hour-day)
        const apiGroupId = parseInt(groupToDelete.value.id.split('-')[0]);
        await groupsService.deleteGroup(apiGroupId);

        // Remove all cards for this group (same code) from local state
        const groupCode = groupToDelete.value.code;

        // Remove from changed groups set first (before filtering groups)
        const groupsToRemove = Array.from(changedGroups.value).filter(id => {
            const group = groups.value.find(g => g.id === id);
            return group && group.code === groupCode;
        });
        groupsToRemove.forEach(id => changedGroups.value.delete(id));

        // Now remove from all arrays
        groups.value = groups.value.filter(g => g.code !== groupCode);
        allGroups.value = allGroups.value.filter(g => g.code !== groupCode);
        originalGroups.value = originalGroups.value.filter(g => g.code !== groupCode);

        // Update unsaved changes status
        hasUnsavedChanges.value = changedGroups.value.size > 0;
        showProfessorModal.value = false

        showSuccessToast(`Grupo ${groupToDelete.value.code} eliminado exitosamente.`);
        closeDeleteModal();
    } catch (error) {
        console.error('Error deleting group:', error);
        showErrorToast('Error al eliminar el grupo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        closeDeleteModal(); // Close modal even on error
    } finally {
        isDeleting.value = false;

    }
}

// Handle group modal submit (create/edit)
async function handleModalSubmit(groupData: any) {
    try {
        if (groupsStore.getModalMode === 'create') {
            await groupsStore.createGroup(groupData);
            showSuccessToast(`Grupo ${groupData.code} creado exitosamente`);
        } else {
            await groupsStore.updateGroup(groupsStore.getEditingGroup!.id, groupData);
            showSuccessToast(`Grupo ${groupData.code} actualizado exitosamente`);
        }

        // Reload schedule data to show the new/updated group
        await loadScheduleData();

        groupsStore.closeModal();
    } catch (error) {
        console.error('Error guardando grupo:', error);
        const action = groupsStore.getModalMode === 'create' ? 'crear' : 'actualizar';
        showErrorToast(`Error al ${action} el grupo. Por favor intenta de nuevo.`);
    }
}
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


.cursor-grabbing {
    cursor: grabbing;
}

/* Drag and drop styles only */

/* Custom scrollbar for table cells */
td::-webkit-scrollbar {
    width: 4px;
}

td::-webkit-scrollbar-track {
    background: #f9fafb;
    border-radius: 2px;
}

td::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
}

td::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* Ensure groups stack nicely */
.group+.group {
    margin-top: 0.5rem;
}
</style>