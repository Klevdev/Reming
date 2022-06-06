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

  const confirm = {
    shown: ref(false),
    message: ref(''),
    open: (message: string, confirmedCallback, declinedCallback = () => {}) => {
      confirm.shown.value = true
      confirm.message.value = message
      confirm.confirmedCallback.value = confirmedCallback
      confirm.declinedCallback.value = declinedCallback
    },
    close: () => {
      confirm.shown.value = false
      confirm.message.value = ''
      confirm.confirmedCallback.value = () => {}
      confirm.declinedCallback.value = () => {}
    },
    confirmedCallback: ref(() => {}),
    declinedCallback: ref(() => {}),
  }

  return {
    sidebarCollapsed,
    userPanelShow,
    toggleSidebar,
    toggleUserPanel,
    popup,
    confirm,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLayoutStore, import.meta.hot))
