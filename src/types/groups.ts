export interface GroupSchedule {
  [day: string]: string // Formato: "1 pm", "2 pm", etc.
}

export interface ScheduleItem {
  id: number
  hour: number
  day: string
}

export interface Group {
  id: number
  code: string
  idSemestre: number
  idSubject: number
  idDocente?: number
  levelName?: string
  schedule?: GroupSchedule // Formato anterior (para compatibilidad)
  scheduleList?: ScheduleItem[] // Nuevo formato
}

export interface CreateGroupRequest {
  code: string
  idSubject: number
  idDocente?: number
  scheduleList: ScheduleItem[] // Requerido en la API
}

export interface UpdateGroupRequest {
  code?: string
  idSubject?: number
  idDocente?: number
  scheduleList?: ScheduleItem[]
}

// Interface for bulk schedule updates
export interface ScheduleUpdateItem {
  idGroup: number
  idDocente?: number // Solo se incluye si cambió el profesor
  scheduleList: Array<{
    hour: number
    day: string
  }>
}

export type BulkScheduleUpdateRequest = ScheduleUpdateItem[]
