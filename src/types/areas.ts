export interface Subject {
  id: number
  code: string
  name: string
  level: string
  idLevel: number
}

export interface CreateSubjectRequest {
  code: string
  idArea: number
  idLevel: number
  name: string
}

export interface Area {
  id: number
  description: string
  subjectList: Subject[]
}
