export interface User {
  id: number
  email: string
  idTipoDocumento: number
  documento: string
  firstName: string
  lastName: string
  isActive: boolean
  idsRoles: number[]
  rolesDescriptions: string[]
  createAt: string
  updatedAt: string
  lastLogin: string
  photo?: string
  idAreas?: number[]
}

export interface UserTableFormat {
  id: string
  name: string
  email: string
  lastLogin: string
  permission: string
  isActive: boolean
  selected?: boolean
}

export interface UpdateUserRequest {
  id: number
  email: string
  idTipoDocumento: number
  documento: string
  firstName: string
  lastName: string
  isActive: boolean
  idsRoles: number[]
  rolesDescriptions: string[]
  idAreas: number[]
}

export interface UpdateCurrentUserRequest {
  email: string
  idTipoDocumento: number
  documento: string
  firstName: string
  lastName: string
}

export interface ChangePasswordRequest {
  documento: string
  password: string
  lastPassword: string
}

export interface NewUserRequest {
  idTipoDocumento: number
  email: string
  documento: string
  password: string
  firstName: string
  lastName: string
  idsRoles: number[]
  idsAreas: number[]
}

export interface NewUserResponse {
  password: string
}