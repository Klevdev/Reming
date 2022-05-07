import { acceptHMRUpdate, defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const sidebarCollapsed = ref(true)
  const userPanelCollapsed = ref(true)
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  function toggleUserPanel() {
    userPanelCollapsed.value = !userPanelCollapsed.value
  }

  return {
    sidebarCollapsed,
    userPanelCollapsed,
    toggleSidebar,
    toggleUserPanel,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLayoutStore, import.meta.hot))
