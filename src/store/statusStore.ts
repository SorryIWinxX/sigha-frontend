import { defineStore } from 'pinia'
import StatusService from '@/services/statusService'
import type { StatusAvailability } from '@/types/status'

export const useStatusStore = defineStore('status', {
  state: () => ({
    statusAvailability: [] as StatusAvailability[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // Obtener status por ID
    getStatusById: (state) => {
      return (id: number): StatusAvailability | undefined => {
        return state.statusAvailability.find((status: StatusAvailability) => status.id === id)
      }
    },

    // Obtener todos los status
    getAllStatus: (state) => state.statusAvailability,

    // Estado de carga
    isLoading: (state) => state.loading,

    // Verificar si hay error
    hasError: (state) => !!state.error,

    // Obtener el error actual
    getError: (state) => state.error,

    // Verificar si los status están cargados
    isLoaded: (state) => state.statusAvailability.length > 0,
  },

  actions: {
    // Limpiar error
    clearError() {
      this.error = null
    },

    // Cargar todos los status de disponibilidad desde el servicio
    async fetchStatusAvailability() {
      this.loading = true
      this.error = null

      try {
        const statusList = await StatusService.getStatusAvailability()
        this.statusAvailability = statusList
        return statusList
      } catch (error) {
        console.error('Error fetching status availability:', error)
        this.error =
          error instanceof Error
            ? error.message
            : 'Error desconocido al cargar status de disponibilidad'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Refrescar status (forzar recarga)
    async refreshStatus() {
      return await this.fetchStatusAvailability()
    },

    // Limpiar el estado
    clearState() {
      this.statusAvailability = []
      this.loading = false
      this.error = null
    },
  },
})
