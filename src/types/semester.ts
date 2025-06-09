export interface Semester {
  id: number
  description: string
  startDate: string
  endDate: string
  createdAt?: string
  updatedAt?: string
}

export interface SemesterRequest {
  description: string
  startDate: string
  endDate: string
}

export interface SemesterUpdateRequest {
  id: number
  description: string
  startDate: string
  endDate: string
}
