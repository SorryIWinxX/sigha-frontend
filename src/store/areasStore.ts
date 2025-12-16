import { defineStore } from 'pinia'
import { AreasService } from '@/services/areasService'
import type { Area, Subject } from '@/types/areas'

export const useAreasStore = defineStore('areas', {
  state: () => ({
    areas: [] as Area[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // Obtener área por ID
    getAreaById: (state) => {
      return (id: number): Area | undefined => {
        return state.areas.find((area) => area.id === id)
      }
    },

    // Obtener todas las áreas
    getAllAreas: (state) => state.areas,

    // Obtener materias por área (ordenadas alfabéticamente por nombre)
    getSubjectsByArea: (state) => {
      return (areaId: number): Subject[] => {
        const area = state.areas.find((area) => area.id === areaId)
        const subjects = area?.subjectList || []
        // Ordenar alfabéticamente por nombre
        return [...subjects].sort((a, b) => a.name.localeCompare(b.name))
      }
    },

    // Contar materias por área
    getSubjectsCount: (state) => {
      return (areaId: number): number => {
        const area = state.areas.find((area) => area.id === areaId)
        return area?.subjectList.length || 0
      }
    },

    // Estado de carga
    isLoading: (state) => state.loading,

    // Verificar si hay error
    hasError: (state) => !!state.error,

    // Obtener el error actual
    getError: (state) => state.error,

    // Verificar si las áreas están cargadas
    isLoaded: (state) => state.areas.length > 0,
  },

  actions: {
    // Limpiar error
    clearError() {
      this.error = null
    },

    // Cargar todas las áreas desde el servicio
    async fetchAreas() {
      this.loading = true
      this.error = null

      try {
        const areasService = new AreasService()
        const areas = await areasService.getAreas()
        this.areas = areas
        return areas
      } catch (error) {
        console.error('Error fetching areas:', error)
        this.error = error instanceof Error ? error.message : 'Error desconocido al cargar áreas'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Crear una nueva área
    async createArea(areaData: Omit<Area, 'id'>) {
      this.loading = true
      this.error = null

      try {
        const areasService = new AreasService()
        const newArea = await areasService.createArea(areaData)

        // Agregar la nueva área al estado
        this.areas.push(newArea)

        return newArea
      } catch (error) {
        console.error('Error creating area:', error)
        this.error = error instanceof Error ? error.message : 'Error desconocido al crear área'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Actualizar un área existente
    async updateArea(id: number, areaData: Omit<Area, 'id'>) {
      this.loading = true
      this.error = null

      try {
        const areasService = new AreasService()
        const updatedArea = await areasService.updateArea(id, areaData)

        // Actualizar el área en el estado
        const index = this.areas.findIndex((area) => area.id === id)
        if (index !== -1) {
          this.areas[index] = updatedArea
        }

        return updatedArea
      } catch (error) {
        console.error('Error updating area:', error)
        this.error = error instanceof Error ? error.message : 'Error desconocido al actualizar área'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Eliminar área del estado local (para cuando se elimine desde el backend)
    removeAreaFromState(id: number) {
      const index = this.areas.findIndex((area) => area.id === id)
      if (index !== -1) {
        this.areas.splice(index, 1)
      }
    },

    // Buscar áreas por descripción
    searchAreasByDescription(searchTerm: string): Area[] {
      if (!searchTerm.trim()) {
        return this.areas
      }

      const normalizeText = (text: string) => {
        return (text || '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
      }

      const term = normalizeText(searchTerm)
      return this.areas.filter(
        (area) =>
          normalizeText(area.description).includes(term) ||
          area.subjectList.some((subject) => normalizeText(subject.name).includes(term)),
      )
    },

    // Refrescar áreas (forzar recarga)
    async refreshAreas() {
      return await this.fetchAreas()
    },

    // Limpiar el estado
    clearState() {
      this.areas = []
      this.loading = false
      this.error = null
    },
  },
})
