export interface Subject {
  id?: number
  code: string
  name: string
  level: string
}

export interface Area {
  id?: number
  description: string
  subjectList: Subject[]
}