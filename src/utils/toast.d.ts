export interface ToastOptions {
  type?: 'success' | 'danger' | 'info' | 'warning'
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
  transition?: string
  hideProgressBar?: boolean
  showIcon?: boolean
  timeout?: number
}

export declare function showToast(message: string, options?: ToastOptions): void
export declare function showSuccessToast(message: string): void
export declare function showErrorToast(message: string): void
export declare function showInfoToast(message: string): void
export declare function showWarningToast(message: string): void
