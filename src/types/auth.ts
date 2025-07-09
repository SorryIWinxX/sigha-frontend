export interface LoginResponse {
  token: string
  forcePasswordReset?: boolean
}

export interface ErrorResponse {
  error: string
  status?: number
  timestamp?: string
  message?: string
}