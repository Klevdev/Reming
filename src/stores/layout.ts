import { acceptHMRUpdate, defineStore } from 'pinia'

<<<<<<< HEAD
export const useLayoutStore = defineStore('layout', {
  state: () => ({
    sidebarCollapsed: true,
    userPanelCollapsed: true,
  }),
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    toggleUserPanel() {
      this.userPanelCollapsed = !this.userPanelCollapsed
    },
  },
=======
interface PopupPayload {
  type: 'error' | 'success' | 'info'
  message: string
  action?: {
    text: string
    action: Function
  }
}

export const useLayoutStore = defineStore('layout', () => {
  const sidebarCollapsed = ref(true)
  const userPanelCollapsed = ref(true)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  function toggleUserPanel() {
    userPanelCollapsed.value = !userPanelCollapsed.value
  }

  function popup(payload: PopupPayload) {
    alert(payload.message)
  }

  return {
    sidebarCollapsed,
    userPanelCollapsed,
    toggleSidebar,
    toggleUserPanel,
    popup,
  }
>>>>>>> development
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLayoutStore, import.meta.hot))
