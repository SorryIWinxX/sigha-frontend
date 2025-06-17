import { defineStore } from 'pinia'
import { SemesterService } from '@/services/semesterService'
import type { Semester } from '@/types/semester'

const SEMESTER_STORAGE_KEY = 'currentSemester'

export const useSemesterStore = defineStore('semester', {
  state: () => ({
    availableSemesters: [] as Semester[],
    currentSemester: null as Semester | null,
    currentSemesterIndex: 0,
    loading: false,
    error: false,
  }),

  getters: {
    canGoPrevious: (state) => state.currentSemesterIndex > 0,
    canGoNext: (state) => state.currentSemesterIndex < state.availableSemesters.length - 1,

    dateRange: (state) => {
      if (!state.currentSemester) return ''

      const format = (date: string) =>
        new Date(date).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

      return `${format(state.currentSemester.startDate)} - ${format(state.currentSemester.endDate)}`
    },

    // Getter para obtener el estado del availability del semestre actual
    currentAvailability: (state) => {
      return state.currentSemester?.availability ?? false
    },
  },

  actions: {
    async loadSemesters() {
      const semesterService = new SemesterService()

      try {
        this.loading = true
        this.error = false
        const semesters = await semesterService.getSemesters()
        this.availableSemesters = semesters

        // Si hay semestres disponibles y no hay uno seleccionado, inicializar
        if (semesters.length > 0) {
          // Intentar cargar el semestre guardado en localStorage
          const savedSemester = this.loadFromStorage()

          if (savedSemester) {
            // Buscar el índice del semestre guardado
            const savedIndex = semesters.findIndex((s) => s.id === savedSemester.id)
            if (savedIndex !== -1) {
              this.currentSemesterIndex = savedIndex
              this.currentSemester = semesters[savedIndex]
            } else {
              // Si el semestre guardado no existe más, usar el primero
              this.setCurrentSemester(0)
            }
          } else {
            // Si no hay semestre guardado, usar el primero
            this.setCurrentSemester(0)
          }
        }
      } catch (err) {
        console.error('Error loading semesters:', err)
        this.error = true
        this.availableSemesters = []
        this.currentSemester = null
      } finally {
        this.loading = false
      }
    },

    setCurrentSemester(index: number) {
      if (index >= 0 && index < this.availableSemesters.length) {
        this.currentSemesterIndex = index
        this.currentSemester = this.availableSemesters[index]
        this.saveToStorage()
      }
    },

    previousSemester() {
      if (this.canGoPrevious) {
        this.setCurrentSemester(this.currentSemesterIndex - 1)
      }
    },

    nextSemester() {
      if (this.canGoNext) {
        this.setCurrentSemester(this.currentSemesterIndex + 1)
      }
    },

    // Action para actualizar el availability del semestre actual
    async updateAvailability(availability: boolean) {
      if (!this.currentSemester) {
        throw new Error('No hay semestre seleccionado')
      }

      const originalSemester = { ...this.currentSemester }
      const semesterService = new SemesterService()

      // Actualizar inmediatamente el estado local para respuesta instantánea
      this.currentSemester.availability = availability
      this.availableSemesters[this.currentSemesterIndex].availability = availability
      this.saveToStorage()

      try {
        // Sincronizar con el backend
        const updatedSemester = await semesterService.updateAvailability(
          originalSemester.id,
          availability,
        )

        // Actualizar con la respuesta del servidor para asegurar consistencia
        this.currentSemester = updatedSemester
        this.availableSemesters[this.currentSemesterIndex] = updatedSemester
        this.saveToStorage()

        return updatedSemester
      } catch (error) {
        // Si falla, revertir al estado original
        this.currentSemester = originalSemester
        this.availableSemesters[this.currentSemesterIndex] = originalSemester
        this.saveToStorage()

        console.error('Error updating semester availability:', error)
        throw error
      }
    },

    saveToStorage() {
      if (this.currentSemester) {
        localStorage.setItem(SEMESTER_STORAGE_KEY, JSON.stringify(this.currentSemester))
      }
    },

    loadFromStorage(): Semester | null {
      try {
        const saved = localStorage.getItem(SEMESTER_STORAGE_KEY)
        return saved ? JSON.parse(saved) : null
      } catch (error) {
        console.error('Error loading semester from storage:', error)
        return null
      }
    },

    clearStorage() {
      localStorage.removeItem(SEMESTER_STORAGE_KEY)
    },

    // Método para obtener el semestre actual desde otros componentes
    getCurrentSemester(): Semester | null {
      return this.currentSemester
    },
  },
})
