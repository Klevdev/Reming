import { acceptHMRUpdate, defineStore } from 'pinia'

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
  const userPanelShow = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  function toggleUserPanel(value = undefined) {
    if (value === undefined)
      userPanelShow.value = !userPanelShow.value
    else
      userPanelShow.value = value
  }

  function popup(payload: PopupPayload) {
    alert(payload.message)
  }

  return {
    sidebarCollapsed,
    userPanelShow,
    toggleSidebar,
    toggleUserPanel,
    popup,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLayoutStore, import.meta.hot))
