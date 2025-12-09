import { defineStore } from 'pinia'
import { groupsService } from '@/services/groupsService'
import type { Group, CreateGroupRequest, UpdateGroupRequest } from '@/types/groups'
import { showErrorToast } from '@/utils/toast'

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [] as Group[],
    loading: false,
    error: null as string | null,
    currentSemesterId: null as number | null,
    // Modal state
    showModal: false,
    modalMode: 'create' as 'create' | 'edit',
    editingGroup: null as Group | null,
  }),

  getters: {
    // Obtener grupo por ID
    getGroupById: (state) => {
      return (id: number): Group | undefined => {
        return state.groups.find((group) => group.id === id)
      }
    },

    // Obtener todos los grupos
    getAllGroups: (state) => state.groups,

    // Obtener grupos por materia
    getGroupsBySubject: (state) => {
      return (subjectId: number): Group[] => {
        return state.groups.filter((group) => group.idSubject === subjectId)
      }
    },

    // Obtener grupos por semestre
    getGroupsBySemester: (state) => {
      return (semesterId: number): Group[] => {
        return state.groups.filter((group) => group.idSemestre === semesterId)
      }
    },

    // Contar grupos por materia
    getGroupsCountBySubject: (state) => {
      return (subjectId: number): number => {
        return state.groups.filter((group) => group.idSubject === subjectId).length
      }
    },

    // Verificar si un código de grupo ya existe en el semestre actual
    isGroupCodeExists: (state) => {
      return (code: string, semesterId: number, excludeId?: number): boolean => {
        return state.groups.some(
          (group) =>
            group.code === code && group.idSemestre === semesterId && group.id !== excludeId,
        )
      }
    },

    // Estado de carga
    isLoading: (state) => state.loading,

    // Verificar si hay error
    hasError: (state) => !!state.error,

    // Obtener el error actual
    getError: (state) => state.error,

    // Verificar si los grupos están cargados
    isLoaded: (state) => state.groups.length > 0,

    // Formatear horario para mostrar
    formatSchedule: () => {
      return (group: Group): string => {
        return groupsService.formatScheduleDisplay(group.schedule, group.scheduleList)
      }
    },

    // Modal state getters
    isModalOpen: (state) => state.showModal,
    getModalMode: (state) => state.modalMode,
    getEditingGroup: (state) => state.editingGroup,
  },

  actions: {
    // Limpiar error
    clearError() {
      this.error = null
    },

    // Establecer semestre actual
    setCurrentSemester(semesterId: number) {
      this.currentSemesterId = semesterId
    },

    // Cargar todos los grupos o por semestre
    async fetchGroups(semesterId?: number) {
      this.loading = true
      this.error = null

      try {
        const groups = await groupsService.getGroups(semesterId)
        this.groups = groups
        if (semesterId) {
          this.currentSemesterId = semesterId
        }
        return groups
      } catch (error) {
        console.error('Error fetching groups:', error)
        this.error = error instanceof Error ? error.message : 'Error desconocido al cargar grupos'
        showErrorToast(this.error || 'Error desconocido al cargar grupos')
      } finally {
        this.loading = false
      }
    },

    // Cargar un grupo específico
    async fetchGroupById(id: number) {
      this.loading = true
      this.error = null

      try {
        const group = await groupsService.getGroupById(id)
        if (group) {
          // Actualizar el grupo en el estado si ya existe, o agregarlo
          const index = this.groups.findIndex((g) => g.id === id)
          if (index !== -1) {
            this.groups[index] = group
          } else {
            this.groups.push(group)
          }
        }
        return group
      } catch (error) {
        console.error('Error fetching group:', error)
        this.error = error instanceof Error ? error.message : 'Error desconocido al cargar grupo'
        showErrorToast(this.error || 'Error desconocido al cargar grupo')
      } finally {
        this.loading = false
      }
    },

    // Crear un nuevo grupo
    async createGroup(groupData: CreateGroupRequest) {
      this.loading = true
      this.error = null

      try {
        // Validar horario antes de enviar
        if (groupData.scheduleList) {
          groupsService.validateScheduleList(groupData.scheduleList)
        }

        const newGroup = await groupsService.createGroup(groupData)

        // Agregar el nuevo grupo al estado
        this.groups.push(newGroup)

        return newGroup
      } catch (error) {
        console.error('Error creating group:', error)
        this.error = error instanceof Error ? error.message : 'Error desconocido al crear grupo'
        showErrorToast(this.error || 'Error desconocido al crear grupo')
      } finally {
        this.loading = false
      }
    },

    // Actualizar un grupo existente
    async updateGroup(id: number, groupData: UpdateGroupRequest) {
      this.loading = true
      this.error = null

      try {
        // Validar horario si se está actualizando
        if (groupData.scheduleList) {
          groupsService.validateScheduleList(groupData.scheduleList)
        }

        const updatedGroup = await groupsService.updateGroup(id, groupData)

        // Actualizar el grupo en el estado
        const index = this.groups.findIndex((group) => group.id === id)
        if (index !== -1) {
          this.groups[index] = updatedGroup
        }

        return updatedGroup
      } catch (error) {
        console.error('Error updating group:', error)
        this.error =
          error instanceof Error ? error.message : 'Error desconocido al actualizar grupo'
        showErrorToast(this.error || 'Error desconocido al actualizar grupo')
      } finally {
        this.loading = false
      }
    },

    // Eliminar un grupo
    async deleteGroup(id: number) {
      this.loading = true
      this.error = null

      try {
        await groupsService.deleteGroup(id)

        // Eliminar el grupo del estado
        const index = this.groups.findIndex((group) => group.id === id)
        if (index !== -1) {
          this.groups.splice(index, 1)
        }

        return true
      } catch (error) {
        console.error('Error deleting group:', error)
        this.error = error instanceof Error ? error.message : 'Error desconocido al eliminar grupo'
        showErrorToast(this.error || 'Error desconocido al eliminar grupo')
      } finally {
        this.loading = false
      }
    },

    // Buscar grupos por código
    searchGroupsByCode(searchTerm: string): Group[] {
      if (!searchTerm.trim()) {
        return this.groups
      }

      const term = searchTerm.toLowerCase()
      return this.groups.filter((group) => group.code.toLowerCase().includes(term))
    },

    // Refrescar grupos (forzar recarga)
    async refreshGroups(semesterId?: number) {
      return await this.fetchGroups(semesterId)
    },

    // Limpiar el estado
    clearState() {
      this.groups = []
      this.loading = false
      this.error = null
      this.currentSemesterId = null
    },

    // Modal actions
    openCreateModal() {
      this.modalMode = 'create'
      this.editingGroup = null
      this.showModal = true
    },

    openEditModal(group: Group) {
      this.modalMode = 'edit'
      this.editingGroup = group
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.editingGroup = null
    },
  },
})
