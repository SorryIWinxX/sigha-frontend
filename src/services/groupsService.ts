import { useAuthStore } from '@/store/authStore'
import { useSemesterStore } from '@/store/semesterStore'
import type {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupSchedule,
  ScheduleItem,
  BulkScheduleUpdateRequest,
} from '@/types/groups'

export class GroupsService {
  private getHeaders() {
    const authStore = useAuthStore()
    const semesterStore = useSemesterStore()
    const token = authStore.getToken()
    const userId = authStore.userId
    const semesterId = semesterStore.currentSemester?.id

    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!userId) {
      throw new Error('No user ID available')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      UserId: userId.toString(),
      semesterId: semesterId?.toString() || '',
    }

    return headers
  }

  async getGroups(semesterId?: number): Promise<Group[]> {
    try {
      const semesterStore = useSemesterStore()
      const targetSemesterId = semesterId || semesterStore.currentSemester?.id

      if (!targetSemesterId) {
        throw new Error('No semester ID available')
      }

      const response = await fetch(`/api/v1/group/by-semesters`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching groups:', error)
      throw error
    }
  }

  async getGroupById(id: number): Promise<Group | null> {
    try {
      const response = await fetch(`/api/v1/group/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching group by ID:', error)
      throw error
    }
  }

  async createGroup(groupData: CreateGroupRequest): Promise<Group> {
    try {
      // El semesterId ya se envía en el header a través de getHeaders()
      // El formato del body debe incluir: code, idSubject, scheduleList
      // idDocente es opcional y se envía solo si está presente en groupData
      const response = await fetch('/api/v1/group', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(groupData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating group:', error)
      throw error
    }
  }

  async updateGroup(id: number, groupData: UpdateGroupRequest): Promise<Group> {
    try {
      // idDocente es opcional y solo se envía si está presente en groupData
      const response = await fetch(`/api/v1/group/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(groupData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating group:', error)
      throw error
    }
  }

  async deleteGroup(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/v1/group/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting group:', error)
      throw error
    }
  }

  async getGroupsBySubject(subjectId: number, semesterId?: number): Promise<Group[]> {
    try {
      const groups = await this.getGroups(semesterId)
      return groups.filter((group) => group.idSubject === subjectId)
    } catch (error) {
      console.error('Error fetching groups by subject:', error)
      throw error
    }
  }

  // Método auxiliar para formatear horarios
  formatScheduleDisplay(schedule?: GroupSchedule, scheduleList?: ScheduleItem[]): string {
    // Priorizar scheduleList si está disponible
    if (scheduleList && scheduleList.length > 0) {
      return scheduleList
        .map((item) => {
          const hour = item.hour % 12 || 12
          const ampm = item.hour < 12 ? 'AM' : 'PM'
          return `${item.day}: ${hour}:00 ${ampm}`
        })
        .join(', ')
    }

    // Fallback al formato anterior
    if (schedule) {
      const entries = Object.entries(schedule)
      if (entries.length === 0) return 'Sin horario'
      return entries.map(([day, time]) => `${day}: ${time}`).join(', ')
    }

    return 'Sin horario'
  }

  // Método auxiliar para validar horarios (formato anterior)
  validateSchedule(schedule: GroupSchedule): boolean {
    const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const timePattern = /^(1[0-2]|[1-9])\s?(am|pm)$/i

    for (const [day, time] of Object.entries(schedule)) {
      if (!validDays.includes(day)) {
        throw new Error(`Día inválido: ${day}`)
      }
      if (!timePattern.test(time)) {
        throw new Error(`Formato de hora inválido: ${time}. Use formato como "1 pm", "10 am"`)
      }
    }

    return true
  }

  // Convertir scheduleList a schedule (para compatibilidad)
  scheduleListToSchedule(scheduleList: ScheduleItem[]): GroupSchedule {
    const schedule: GroupSchedule = {}
    const dayMapping: { [key: string]: string } = {
      LUNES: 'Lunes',
      MARTES: 'Martes',
      MIÉRCOLES: 'Miércoles',
      MIERCOLES: 'Miércoles', // Normalizar miércoles sin acento
      JUEVES: 'Jueves',
      VIERNES: 'Viernes',
      SÁBADO: 'Sábado',
      SABADO: 'Sábado', // Normalizar sábado sin acento
      DOMINGO: 'Domingo',
    }

    scheduleList.forEach((item) => {
      const hour = item.hour % 12 || 12
      const ampm = item.hour < 12 ? 'am' : 'pm'
      const timeString = `${hour} ${ampm}`
      const dayName = dayMapping[item.day.toUpperCase()] || item.day

      schedule[dayName] = timeString
    })

    return schedule
  }

  // Convertir schedule a scheduleList (para nuevo formato)
  scheduleToScheduleList(schedule: GroupSchedule): ScheduleItem[] {
    const scheduleList: ScheduleItem[] = []

    Object.entries(schedule).forEach(([day, time]) => {
      const match = time.match(/^(\d{1,2})\s?(am|pm)$/i)
      if (match) {
        let hour = parseInt(match[1])
        const ampm = match[2].toLowerCase()

        if (ampm === 'pm' && hour !== 12) hour += 12
        if (ampm === 'am' && hour === 12) hour = 0

        scheduleList.push({
          id: 0,
          hour: hour,
          day: day.toUpperCase(),
        })
      }
    })

    return scheduleList
  }

  // Validar scheduleList (nuevo formato)
  validateScheduleList(scheduleList: ScheduleItem[]): boolean {
    const validDays = [
      'LUNES',
      'MARTES',
      'MIÉRCOLES',
      'MIERCOLES', // Incluir ambas versiones de miércoles
      'JUEVES',
      'VIERNES',
      'SÁBADO',
      'SABADO', // Incluir ambas versiones de sábado
      'DOMINGO',
    ]

    for (const item of scheduleList) {
      if (!validDays.includes(item.day.toUpperCase())) {
        throw new Error(`Día inválido: ${item.day}`)
      }
      if (item.hour < 0 || item.hour > 23) {
        throw new Error(`Hora inválida: ${item.hour}. Debe estar entre 0 y 23`)
      }
    }

    return true
  }

  // Actualizar horarios de múltiples grupos
  async updateSchedules(scheduleUpdates: BulkScheduleUpdateRequest): Promise<void> {
    try {
      console.log('Datos enviados a la API:', JSON.stringify(scheduleUpdates, null, 2))

      const response = await fetch('/api/v1/schedule', {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(scheduleUpdates),
      })

      console.log('Respuesta de la API:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Error data from API:', errorData)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`)
      }

      console.log('Schedules updated successfully')
    } catch (error) {
      console.error('Error updating schedules:', error)
      throw error
    }
  }

  // Filtros para grupos
  async getGroupsByLevels(levelIds: number[]): Promise<Group[]> {
    try {
      const params = new URLSearchParams({
        idLevels: levelIds.join(','),
      })

      const response = await fetch(`/api/v1/group/by-levels?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching groups by levels:', error)
      throw error
    }
  }

  async getGroupsByDocente(docenteId: number): Promise<Group[]> {
    try {
      const params = new URLSearchParams({
        docenteId: docenteId.toString(),
      })

      const response = await fetch(`/api/v1/group/by-docente?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching groups by docente:', error)
      throw error
    }
  }

  async getGroupsBySubjectId(subjectId: number): Promise<Group[]> {
    try {
      const params = new URLSearchParams({
        subjectId: subjectId.toString(),
      })

      const response = await fetch(`/api/v1/group/by-subject?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching groups by subject:', error)
      throw error
    }
  }

  // Obtener grupos de un semestre específico
  async getGroupsBySemester(semesterId: number): Promise<Group[]> {
    try {
      const authStore = useAuthStore()
      const token = authStore.getToken()
      const userId = authStore.userId

      if (!token) {
        throw new Error('No authentication token available')
      }

      if (!userId) {
        throw new Error('No user ID available')
      }

      // Construir headers con el semestre específico
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        UserId: userId.toString(),
        semesterId: semesterId.toString(),
      }

      console.log(`Obteniendo grupos del semestre ${semesterId}`)

      const response = await fetch(`/api/v1/group/by-semesters`, {
        method: 'GET',
        headers: headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const groups = await response.json()
      console.log(`Grupos obtenidos del semestre ${semesterId}:`, groups.length)

      return groups
    } catch (error) {
      console.error('Error fetching groups by semester:', error)
      throw error
    }
  }

  // Obtener grupos con filtros
  async getGroupsByFilters(params: {
    semesterId: number
    idLevels?: number[]
    docentesIds?: number[]
    subjectIds?: number[]
  }): Promise<Group[]> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('semesterId', params.semesterId.toString())

      if (params.idLevels && params.idLevels.length > 0) {
        params.idLevels.forEach((id) => queryParams.append('idLevels', id.toString()))
      }

      if (params.docentesIds && params.docentesIds.length > 0) {
        params.docentesIds.forEach((id) => queryParams.append('docentesIds', id.toString()))
      }

      if (params.subjectIds && params.subjectIds.length > 0) {
        params.subjectIds.forEach((id) => queryParams.append('subjectIds', id.toString()))
      }

      const response = await fetch(`/api/v1/group/by-filters?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching groups by filters:', error)
      throw error
    }
  }

  // Copiar horarios de semestre anterior
  async copyPreviousSchedule(previousSemesterId: number, targetSemesterId?: number): Promise<void> {
    try {
      // Obtener las mismas referencias que usa getHeaders()
      const authStore = useAuthStore()
      const semesterStore = useSemesterStore()

      const userId = authStore.userId
      const semesterId = targetSemesterId || semesterStore.currentSemester?.id
      const token = authStore.getToken()

      if (!token) {
        throw new Error('No authentication token available')
      }

      if (!userId) {
        throw new Error('No user ID available')
      }

      if (!semesterId) {
        throw new Error('No target semester ID available')
      }

      console.log(
        'Copiando horarios del semestre:',
        previousSemesterId,
        'al semestre:',
        semesterId,
        'usuario:',
        userId,
      )

      // Paso 1: Obtener los grupos del semestre anterior
      const previousGroups = await this.getGroupsBySemester(previousSemesterId)
      console.log(`Encontrados ${previousGroups.length} grupos en el semestre anterior`)

      // Paso 2: Formatear los grupos al formato requerido
      const groupsToCreate = previousGroups.map((group: Group) => ({
        id: group.id,
        idSemestre: semesterId, // Cambiar al semestre de destino
        idSubject: group.idSubject,
        idDocente: null, // Siempre null como especificaste
        levelName: group.levelName || null,
        code: group.code,
        scheduleList: group.scheduleList || [],
      }))

      console.log('Grupos formateados para copiar:', groupsToCreate.length)

      // Construir headers manualmente para asegurar que el token se incluya
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        UserId: userId.toString(),
        semesterId: semesterId.toString(),
      }

      console.log('Headers enviados:', { ...headers, Authorization: 'Bearer [HIDDEN]' })
      console.log('Body enviado (primeros 2 grupos):', groupsToCreate.slice(0, 2))

      const response = await fetch('/api/v1/group/bulk', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(groupsToCreate),
      })

      console.log('Respuesta de la API:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Error data from API:', errorData)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`)
      }

      console.log('Previous schedule copied successfully')
    } catch (error) {
      console.error('Error copying previous schedule:', error)
      throw error
    }
  }
}

export const groupsService = new GroupsService()
