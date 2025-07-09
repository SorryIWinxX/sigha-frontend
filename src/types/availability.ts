
export interface AvailabilitySlot {
  hour: number
  statusId?: number
}

export interface AvailabilityData {
  [day: string]: AvailabilitySlot[]
}

export interface AvailabilityRequest {
  disponibilidad: AvailabilityData
}

export interface AvailabilityResponse {
  disponibilidad?: AvailabilityData
}

export interface GlobalAvailabilitySlot {
  id: number
  hour: number
  statusId: number
  statusDescription: string
}

export interface GlobalAvailabilityData {
  [day: string]: GlobalAvailabilitySlot[]
}

export interface GlobalAvailabilityResponse {
  userIdDocent: number
  areas: number[]
  disponibilidad: GlobalAvailabilityData
}

export interface UpdateAvailabilityStatusRequest {
  newStatusId: number
}

export interface UpdateAvailabilityStatusResponse {
  message: string
  success: boolean
}

export interface ProfessorAvailability {
  userIdDocent: number
  areas: number[]
  disponibilidad: GlobalAvailabilityData
}