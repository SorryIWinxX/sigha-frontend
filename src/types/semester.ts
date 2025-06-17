export interface Semester {
  id: number
  description: string
  startDate: string
  endDate: string
  availability: boolean
  createdAt?: string
  updatedAt?: string
}

export interface SemesterRequest {
  description: string
  startDate: string
  endDate: string
  availability?: boolean
}

export interface SemesterUpdateRequest {
  id: number
  description: string
  startDate: string
  endDate: string
  availability?: boolean
}
