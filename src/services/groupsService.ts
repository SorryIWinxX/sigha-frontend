import type {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupSchedule,
  ScheduleItem,
} from '@/types/groups'

// Mock data - grupos ficticios
const mockGroups: Group[] = [
  {
    id: 1,
    code: 'A01',
    idSemestre: 1,
    idSubject: 1,
    schedule: {
      Lunes: '1 pm',
      Miércoles: '3 pm',
      Viernes: '10 am',
    },
  },
  {
    id: 2,
    code: 'A02',
    idSemestre: 1,
    idSubject: 1,
    schedule: {
      Martes: '2 pm',
      Jueves: '4 pm',
    },
  },
  {
    id: 3,
    code: 'B01',
    idSemestre: 1,
    idSubject: 2,
    schedule: {
      Lunes: '9 am',
      Miércoles: '11 am',
      Viernes: '2 pm',
    },
  },
  {
    id: 4,
    code: 'B02',
    idSemestre: 1,
    idSubject: 2,
    schedule: {
      Martes: '8 am',
      Jueves: '10 am',
    },
  },
  {
    id: 5,
    code: 'C01',
    idSemestre: 1,
    idSubject: 3,
    schedule: {
      Lunes: '4 pm',
      Miércoles: '4 pm',
    },
  },
  {
    id: 6,
    code: 'D01',
    idSemestre: 1,
    idSubject: 1,
    idUser: 1,
    levelName: 'NIVEL 6', // Se asigna automáticamente desde la materia
    scheduleList: [
      {
        id: 1,
        hour: 10,
        day: 'LUNES',
      },
      {
        id: 2,
        hour: 10,
        day: 'MIÉRCOLES',
      },
      {
        id: 3,
        hour: 14,
        day: 'VIERNES',
      },
    ],
  },
]

export class GroupsService {
  private groups: Group[] = [...mockGroups]
  private nextId = 7

  // Simular delay de red
  private async delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getGroups(semesterId?: number): Promise<Group[]> {
    await this.delay()

    if (semesterId) {
      return this.groups.filter((group) => group.idSemestre === semesterId)
    }
    return [...this.groups]
  }

  async getGroupById(id: number): Promise<Group | null> {
    await this.delay()

    const group = this.groups.find((g) => g.id === id)
    return group ? { ...group } : null
  }

  async createGroup(groupData: CreateGroupRequest): Promise<Group> {
    await this.delay()

    // Validar que el código no exista en el mismo semestre
    const existingGroup = this.groups.find(
      (g) => g.code === groupData.code && g.idSemestre === groupData.idSemestre,
    )

    if (existingGroup) {
      throw new Error(`Ya existe un grupo con el código ${groupData.code} en este semestre`)
    }

    // Manejar ambos formatos de horario
    let processedData = { ...groupData }

    if (groupData.scheduleList && groupData.scheduleList.length > 0) {
      // Validar nuevo formato
      this.validateScheduleList(groupData.scheduleList)
      // Convertir a formato anterior para compatibilidad
      processedData.schedule = this.scheduleListToSchedule(groupData.scheduleList)
    } else if (groupData.schedule) {
      // Validar formato anterior
      this.validateSchedule(groupData.schedule)
      // Convertir a nuevo formato
      processedData.scheduleList = this.scheduleToScheduleList(groupData.schedule)
    }

    const newGroup: Group = {
      id: this.nextId++,
      ...processedData,
    }

    this.groups.push(newGroup)
    return { ...newGroup }
  }

  async updateGroup(id: number, groupData: UpdateGroupRequest): Promise<Group> {
    await this.delay()

    const index = this.groups.findIndex((g) => g.id === id)
    if (index === -1) {
      throw new Error(`Grupo con ID ${id} no encontrado`)
    }

    const currentGroup = this.groups[index]

    // Si se está actualizando el código, validar que no exista
    if (groupData.code && groupData.code !== currentGroup.code) {
      const existingGroup = this.groups.find(
        (g) => g.code === groupData.code && g.idSemestre === currentGroup.idSemestre && g.id !== id,
      )

      if (existingGroup) {
        throw new Error(`Ya existe un grupo con el código ${groupData.code} en este semestre`)
      }
    }

    // Manejar ambos formatos de horario
    let processedData = { ...groupData }

    if (groupData.scheduleList && groupData.scheduleList.length > 0) {
      // Validar nuevo formato
      this.validateScheduleList(groupData.scheduleList)
      // Convertir a formato anterior para compatibilidad
      processedData.schedule = this.scheduleListToSchedule(groupData.scheduleList)
    } else if (groupData.schedule) {
      // Validar formato anterior
      this.validateSchedule(groupData.schedule)
      // Convertir a nuevo formato
      processedData.scheduleList = this.scheduleToScheduleList(groupData.schedule)
    }

    const updatedGroup: Group = {
      ...currentGroup,
      ...processedData,
    }

    this.groups[index] = updatedGroup
    return { ...updatedGroup }
  }

  async deleteGroup(id: number): Promise<void> {
    await this.delay()

    const index = this.groups.findIndex((g) => g.id === id)
    if (index === -1) {
      throw new Error(`Grupo con ID ${id} no encontrado`)
    }

    this.groups.splice(index, 1)
  }

  async getGroupsBySubject(subjectId: number, semesterId?: number): Promise<Group[]> {
    await this.delay()

    let filtered = this.groups.filter((g) => g.idSubject === subjectId)

    if (semesterId) {
      filtered = filtered.filter((g) => g.idSemestre === semesterId)
    }

    return filtered
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
      JUEVES: 'Jueves',
      VIERNES: 'Viernes',
      SÁBADO: 'Sábado',
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
      // Parse time string like "1 pm", "10 am"
      const match = time.match(/^(\d{1,2})\s?(am|pm)$/i)
      if (match) {
        let hour = parseInt(match[1])
        const ampm = match[2].toLowerCase()

        if (ampm === 'pm' && hour !== 12) hour += 12
        if (ampm === 'am' && hour === 12) hour = 0

        scheduleList.push({
          id: null,
          hour: hour,
          day: day.toUpperCase(),
        })
      }
    })

    return scheduleList
  }

  // Validar scheduleList (nuevo formato)
  validateScheduleList(scheduleList: ScheduleItem[]): boolean {
    const validDays = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']

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
}

export const groupsService = new GroupsService()
