<template>
    <div class="space-y-6">
        <!-- Métricas principales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Total de grupos -->
            <div
                class="bg-white rounded-sm border border-gray-300  hover:bg-info-500 hover:text-white hover:border-info-500 hover:translate-x-1 hover:transition-all group p-6">
                <div class="flex items-center group-hover:text-white">
                    <div class="flex-1">
                        <p class="font-medium text-gray-600 group-hover:text-white">Total de Grupos</p>
                        <p class="text-3xl font-bold group-hover:text-white">{{ totalGroups }}</p>
                    </div>
                    <div class="w-12 h-12 bg-info-500 rounded-sm flex items-center justify-center">
                        <Users class="text-white" />
                    </div>
                </div>
            </div>

            <!-- Grupos asignados -->
            <div
                class="bg-white rounded-sm border border-gray-300  hover:bg-success-500 hover:text-white hover:border-success-500 hover:translate-x-1 hover:transition-all group p-6">
                <div class="flex items-center group-hover:text-white">
                    <div class="flex-1">
                        <p class=" font-medium text-gray-600 group-hover:text-white">Grupos con profesor</p>
                        <p class="text-3xl font-bold text-success-600 group-hover:text-white">{{ assignedGroups }}</p>
                    </div>
                    <div class="w-12 h-12 bg-success-500 rounded-sm flex items-center justify-center">
                        <CheckLine class="text-white" />
                    </div>
                </div>
            </div>

            <!-- Grupos sin asignar -->
            <div
                class="bg-white rounded-sm border border-gray-300  hover:bg-yellow-500 hover:text-white hover:border-yellow-500 hover:translate-x-1 hover:transition-all group p-6">
                <div class="flex items-center group-hover:text-white">
                    <div class="flex-1">
                        <p class=" font-medium text-gray-600 group-hover:text-white">Grupos sin profesor</p>
                        <p class="text-3xl font-bold group-hover:text-white text-yellow-500">{{ unassignedGroups }}</p>
                    </div>
                    <div class="w-12 h-12 bg-yellow-500 rounded-sm flex items-center justify-center">
                        <AlertCircle class="text-white" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Grupos por asignatura -->
        <div class="w-full border border-gray-300 rounded-sm">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Grupos por Asignatura</h2>
            </div>
            <div class="overflow-auto max-h-[50vh] rounded-sm">
                <table class="w-full">
                    <thead class="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th class="px-6 py-3 text-left">
                                <span class="text-gray-900 font-semibold">N°</span>
                            </th>

                            <th class="px-6 py-3 text-left">
                                <span class="text-gray-900 font-semibold">Asignatura</span>
                            </th>
                            <th class="px-6 py-3 text-left">
                                <span class="text-gray-900 font-semibold">Código</span>
                            </th>
                            <th class="px-6 py-3 text-left">
                                <span class="text-gray-900 font-semibold">Nivel</span>
                            </th>
                            <th class="px-6 py-3 text-center">
                                <span class="text-gray-900 font-semibold">Total Grupos</span>
                            </th>
                            <th class="px-6 py-3 text-center">
                                <span class="text-gray-900 font-semibold">Con docente</span>
                            </th>
                            <th class="px-6 py-3 text-center">
                                <span class="text-gray-900 font-semibold">Sin docente</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        <!-- Loading state -->
                        <tr v-if="loading">
                            <td colspan="7" class="px-6 py-8 text-center">
                                <div class="flex items-center justify-center">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    <span class="ml-3 text-gray-600">Cargando datos...</span>
                                </div>
                            </td>
                        </tr>
                        <!-- Empty state -->
                        <tr v-else-if="!loading && subjectStats.length === 0">
                            <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                                No se encontraron grupos por asignatura
                            </td>
                        </tr>
                        <!-- Subject rows -->
                        <tr v-else v-for="(stat, index) in subjectStats" :key="stat.subjectId" :class="[
                            'border-b border-gray-300 hover:bg-gray-100',
                            { 'bg-gray-50/30': index % 2 === 0 },
                            { 'border-b-0': index === subjectStats.length - 1 }
                        ]">
                            <td class="px-6 py-3">
                                <span class="text-gray-900 font-medium">{{ index + 1 }}</span>
                            </td>
                            <td class="px-6 py-3">
                                <span class="text-gray-900 font-medium">{{ stat.subjectName }}</span>
                            </td>
                            <td class="px-6 py-3">
                                <span class="text-gray-600">{{ stat.subjectCode }}</span>
                            </td>
                            <td class="px-6 py-3">
                                <span class="text-gray-600">{{ stat.level }}</span>
                            </td>
                            <td class="px-6 py-3">
                                <div class="flex items-center justify-center">
                                    <span
                                        class="inline-flex items-center px-3 py-1.5 rounded-sm text-sm bg-primary-500 text-white">
                                        {{ stat.totalGroups }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-3">
                                <div class="flex items-center justify-center">
                                    <span
                                        class="inline-flex items-center px-3 py-1.5 rounded-sm text-sm bg-success-500 text-white">
                                        {{ stat.assignedGroups }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-3">
                                <div class="flex items-center justify-center">
                                    <span
                                        class="inline-flex items-center px-3 py-1.5 rounded-sm text-sm bg-yellow-500 text-white">
                                        {{ stat.unassignedGroups }}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Grupos sin asignar detalle -->
        <div v-if="unassignedGroupsList.length > 0" class="bg-white rounded-sm border border-gray-300">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Grupos sin docente</h2>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="group in unassignedGroupsList" :key="group.id"
                        class="border border-gray-200 rounded-sm p-4 cursor-pointer  transition-shadow">
                        <div class="flex justify-between items-center ">
                            <div>
                                <h3 class="font-medium text-gray-900">{{ group.code }}</h3>
                                <p class="text-sm text-gray-600 truncate max-w-[150px]">{{
                                    getSubjectName(group.idSubject)
                                    }}</p>
                                <p class="text-xs text-gray-500">{{ getAreaName(group.idSubject) }}</p>
                            </div>
                            <span
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                Sin docente
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { GroupsService } from '@/services/groupsService'
import { AreasService } from '@/services/areasService'
import { SemesterService } from '@/services/semesterService'
import { useSemesterStore } from '@/store/semesterStore'
import type { Group } from '@/types/groups'
import type { Area, Subject } from '@/types/areas'
import type { Semester } from '@/types/semester'
import { Users, CheckLine, AlertCircle } from 'lucide-vue-next'

// Services
const groupsService = new GroupsService()
const areasService = new AreasService()
const semesterService = new SemesterService()
const semesterStore = useSemesterStore()

// Reactive data
const loading = ref(true)
const groups = ref<Group[]>([])
const areas = ref<Area[]>([])
const semesters = ref<Semester[]>([])
const semesterGroups = ref<Map<number, Group[]>>(new Map())

// Chart configuration
const chartWidth = ref(800)
const chartHeight = ref(320)
const margin = ref({ top: 20, right: 30, bottom: 60, left: 60 })

const testOptions = ref([
    { label: 'Todos', value: null },
    { label: 'juan', value: 2 },
    { label: 'julio', value: 3 },
    { label: 'agosto', value: 4 },
    { label: 'septiembre', value: 5 },
    { label: 'octubre', value: 6 },
    { label: 'noviembre', value: 7 },
    { label: 'diciembre', value: 8 }
])
// Tooltip state
const tooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    semester: '',
    groups: 0,
    date: ''
})

// Mock data for chart
const mockSemesterData = ref([
    { id: 1, description: '2023-1', startDate: '2023-01-15', endDate: '2023-05-30', totalGroups: 45 },
    { id: 2, description: '2023-2', startDate: '2023-06-15', endDate: '2023-11-30', totalGroups: 52 },
    { id: 3, description: '2024-1', startDate: '2024-01-15', endDate: '2024-05-30', totalGroups: 58 },
    { id: 4, description: '2024-2', startDate: '2024-06-15', endDate: '2024-11-30', totalGroups: 63 },
    { id: 5, description: '2025-1', startDate: '2025-01-15', endDate: '2025-05-30', totalGroups: 71 },
    { id: 6, description: '2025-2', startDate: '2025-06-15', endDate: '2025-11-30', totalGroups: 68 }
])

// Computed properties
const currentSemesterId = computed(() => semesterStore.currentSemester?.id)

const totalGroups = computed(() => groups.value.length)

const assignedGroups = computed(() =>
    groups.value.filter(group => group.idDocente && group.idDocente !== null).length
)

const unassignedGroups = computed(() =>
    groups.value.filter(group => !group.idDocente || group.idDocente === null).length
)

const unassignedGroupsList = computed(() =>
    groups.value.filter(group => !group.idDocente || group.idDocente === null)
)

const subjectStats = computed(() => {
    const stats: Array<{
        subjectId: number
        areaName: string
        subjectName: string
        subjectCode: string
        level: string
        totalGroups: number
        assignedGroups: number
        unassignedGroups: number
    }> = []

    // Crear un mapa de todas las asignaturas
    const subjectMap = new Map<number, { subject: Subject; area: Area }>()
    areas.value.forEach(area => {
        area.subjectList.forEach(subject => {
            subjectMap.set(subject.id, { subject, area })
        })
    })

    // Agrupar grupos por asignatura
    const groupsBySubject = new Map<number, Group[]>()
    groups.value.forEach(group => {
        if (!groupsBySubject.has(group.idSubject)) {
            groupsBySubject.set(group.idSubject, [])
        }
        groupsBySubject.get(group.idSubject)!.push(group)
    })

    // Crear estadísticas para cada asignatura que tiene grupos
    groupsBySubject.forEach((subjectGroups, subjectId) => {
        const subjectInfo = subjectMap.get(subjectId)
        if (subjectInfo) {
            const assigned = subjectGroups.filter(g => g.idDocente && g.idDocente !== null).length
            const unassigned = subjectGroups.length - assigned

            stats.push({
                subjectId,
                areaName: subjectInfo.area.description,
                subjectName: subjectInfo.subject.name,
                subjectCode: subjectInfo.subject.code,
                level: subjectInfo.subject.level,
                totalGroups: subjectGroups.length,
                assignedGroups: assigned,
                unassignedGroups: unassigned
            })
        }
    })

    return stats.sort((a, b) => b.areaName.localeCompare(a.areaName))
})

const semesterGrowth = computed(() => {
    const growth = semesters.value
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .map((semester, index, sortedSemesters) => {
            const semesterGroupsCount = semesterGroups.value.get(semester.id)?.length || 0
            const previousCount = index > 0 ? (semesterGroups.value.get(sortedSemesters[index - 1].id)?.length || 0) : 0
            const growthValue = index > 0 ? semesterGroupsCount - previousCount : 0

            return {
                ...semester,
                totalGroups: semesterGroupsCount,
                growth: growthValue
            }
        })

    return growth.reverse() // Mostrar más recientes primero
})

// Chart computed properties
const maxGroups = computed(() => {
    return Math.max(...mockSemesterData.value.map(s => s.totalGroups)) + 10
})

const chartData = computed(() => {
    const data = mockSemesterData.value
    const chartArea = {
        width: chartWidth.value - margin.value.left - margin.value.right,
        height: chartHeight.value - margin.value.top - margin.value.bottom
    }

    return data.map((semester, index) => {
        const x = margin.value.left + (index * chartArea.width) / (data.length - 1)
        const y = margin.value.top + chartArea.height - (semester.totalGroups / maxGroups.value) * chartArea.height

        return {
            x,
            y,
            label: semester.description,
            semester: semester.description,
            groups: semester.totalGroups,
            date: formatDate(semester.startDate),
            data: semester
        }
    })
})

const linePath = computed(() => {
    if (chartData.value.length === 0) return ''

    let path = `M ${chartData.value[0].x} ${chartData.value[0].y}`
    for (let i = 1; i < chartData.value.length; i++) {
        path += ` L ${chartData.value[i].x} ${chartData.value[i].y}`
    }
    return path
})

const areaPath = computed(() => {
    if (chartData.value.length === 0) return ''

    const baseY = chartHeight.value - margin.value.bottom
    let path = `M ${chartData.value[0].x} ${baseY}`
    path += ` L ${chartData.value[0].x} ${chartData.value[0].y}`

    for (let i = 1; i < chartData.value.length; i++) {
        path += ` L ${chartData.value[i].x} ${chartData.value[i].y}`
    }

    path += ` L ${chartData.value[chartData.value.length - 1].x} ${baseY} Z`
    return path
})

const totalGrowth = computed(() => {
    const data = mockSemesterData.value
    if (data.length < 2) return 0
    return data[data.length - 1].totalGroups - data[0].totalGroups
})

const averageGroups = computed(() => {
    const data = mockSemesterData.value
    if (data.length === 0) return 0
    const sum = data.reduce((acc, semester) => acc + semester.totalGroups, 0)
    return Math.round(sum / data.length)
})

// Methods
const getSubjectName = (subjectId: number): string => {
    for (const area of areas.value) {
        const subject = area.subjectList.find(s => s.id === subjectId)
        if (subject) return subject.name
    }
    return 'Asignatura desconocida'
}

const getAreaName = (subjectId: number): string => {
    for (const area of areas.value) {
        const subject = area.subjectList.find(s => s.id === subjectId)
        if (subject) return area.description
    }
    return 'Área desconocida'
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const showTooltip = (event: MouseEvent, point: any) => {
    tooltip.value = {
        visible: true,
        x: event.offsetX + 10,
        y: event.offsetY - 10,
        semester: point.semester,
        groups: point.groups,
        date: point.date
    }
}

const hideTooltip = () => {
    tooltip.value.visible = false
}

const loadData = async () => {
    try {
        loading.value = true

        // Cargar datos básicos solo si no están cargados
        if (areas.value.length === 0 || semesters.value.length === 0) {
            const [areasData, semestersData] = await Promise.all([
                areasService.getAreas(),
                semesterService.getSemesters()
            ])
            areas.value = areasData
            semesters.value = semestersData
        }

        // Cargar grupos del semestre actual
        if (currentSemesterId.value) {
            groups.value = await groupsService.getGroups(currentSemesterId.value)

            // Actualizar el mapa de grupos por semestre para el semestre actual
            semesterGroups.value.set(currentSemesterId.value, groups.value)
        }

        // Cargar grupos históricos para todos los semestres solo en la primera carga
        if (semesterGroups.value.size === 0) {
            const semesterGroupsPromises = semesters.value.map(async (semester) => {
                try {
                    const semesterGroupsData = await groupsService.getGroups(semester.id)
                    return { semesterId: semester.id, groups: semesterGroupsData }
                } catch (error) {
                    console.warn(`Error loading groups for semester ${semester.id}:`, error)
                    return { semesterId: semester.id, groups: [] }
                }
            })

            const semesterGroupsResults = await Promise.all(semesterGroupsPromises)

            // Poblar el mapa de grupos por semestre
            semesterGroups.value.clear()
            semesterGroupsResults.forEach(result => {
                semesterGroups.value.set(result.semesterId, result.groups)
            })
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error)
    } finally {
        loading.value = false
    }
}

// Función para cargar solo los grupos del semestre actual
const loadSemesterGroups = async (semesterId: number) => {
    try {
        loading.value = true
        groups.value = await groupsService.getGroups(semesterId)
        semesterGroups.value.set(semesterId, groups.value)
    } catch (error) {
        console.error('Error loading semester groups:', error)
    } finally {
        loading.value = false
    }
}

// Watcher para recargar datos cuando cambie el semestre
watch(() => semesterStore.currentSemester, (newSemester, oldSemester) => {
    if (newSemester && newSemester.id !== oldSemester?.id) {
        // Si ya tenemos las áreas cargadas, solo cargar los grupos del nuevo semestre
        if (areas.value.length > 0) {
            loadSemesterGroups(newSemester.id)
        } else {
            // Si no tenemos las áreas, cargar todo
            loadData()
        }
    }
}, { deep: true })

onMounted(() => {
    loadData()
})
</script>
