export interface GroupSchedule {
  [day: string]: string // Formato: "1 pm", "2 pm", etc.
}

export interface ScheduleItem {
  id?: number | null
  hour: number
  day: string
}

export interface Group {
  id?: number
  code: string
  idSemestre: number
  idSubject: number
  idUser?: number
  levelName?: string
  schedule?: GroupSchedule // Formato anterior (para compatibilidad)
  scheduleList?: ScheduleItem[] // Nuevo formato
}

export interface CreateGroupRequest {
  code: string
  idSemestre: number
  idSubject: number
  idUser?: number
  levelName?: string // Se asigna automáticamente desde la materia
  schedule?: GroupSchedule // Formato anterior
  scheduleList?: ScheduleItem[] // Nuevo formato
}

export interface UpdateGroupRequest {
  code?: string
  idSubject?: number
  idUser?: number
  levelName?: string
  schedule?: GroupSchedule // Formato anterior
  scheduleList?: ScheduleItem[] // Nuevo formato
}
