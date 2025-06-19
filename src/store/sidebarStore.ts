import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isOpen: localStorage.getItem('sidebarOpen') !== 'false', // Por defecto abierto, a menos que esté guardado como false
  }),

  getters: {
    // Obtener el estado actual del sidebar
    getSidebarState: (state) => state.isOpen,
  },

  actions: {
    // Alternar el estado del sidebar
    toggleSidebar() {
      this.isOpen = !this.isOpen
      this.saveSidebarState()
    },

    // Abrir el sidebar
    openSidebar() {
      this.isOpen = true
      this.saveSidebarState()
    },

    // Cerrar el sidebar
    closeSidebar() {
      this.isOpen = false
      this.saveSidebarState()
    },

    // Guardar el estado en localStorage
    saveSidebarState() {
      localStorage.setItem('sidebarOpen', this.isOpen.toString())
    },

    // Inicializar desde localStorage
    initializeFromStorage() {
      const saved = localStorage.getItem('sidebarOpen')
      if (saved !== null) {
        this.isOpen = saved === 'true'
      }
    },
  },
})
