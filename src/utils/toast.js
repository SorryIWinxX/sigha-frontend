import { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

/**
 * Display a toast notification
 * @param {string} message - The message to display
 * @param {object} options - Toast options
 */
export const showToast = (message, options = {}) => {
  createToast(message, {
    type: 'success',
    position: 'top-right',
    transition: 'slide',
    hideProgressBar: true,
    showIcon: true,
    ...options,
  })
}

// Predefined toast functions
export const showSuccessToast = (message) => {
  showToast(message, { type: 'success' })
}

export const showErrorToast = (message) => {
  showToast(message, { type: 'danger' })
}

export const showInfoToast = (message) => {
  showToast(message, { type: 'info' })
}

export const showWarningToast = (message) => {
  showToast(message, { type: 'warning' })
}
