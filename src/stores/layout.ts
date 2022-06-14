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
  const notificationsShow = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  function toggleUserPanel(value = undefined) {
    if (value === undefined)
      userPanelShow.value = !userPanelShow.value
    else
      userPanelShow.value = value
  }
  function toggleNotifications(value = undefined) {
    if (value === undefined)
      notificationsShow.value = !notificationsShow.value
    else
      notificationsShow.value = value
  }

  const popup = {
    shown: ref(false),
    message: ref(''),
    type: ref(''),
    action: ref({}),
    closeTO: null,
    show: (payload: PopupPayload) => {
      if (popup.shown)
        popup.close()
      if (popup.closeTO) {
        clearTimeout(popup.closeTO)
        popup.close()
      }
      popup.closeTO = null
      popup.shown.value = true
      popup.message.value = payload.message
      popup.type.value = payload.type
      popup.action.value = payload.action
    },
    close: () => {
      if (popup.closeTO)
        clearTimeout(popup.closeTO)
      popup.shown.value = false
      popup.message.value = ''
      popup.type.value = ''
      popup.action.value = {}
    },
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

  const inputModal = {
    shown: ref(false),
    message: ref(''),
    open: (message, inputValue) => {
      inputModal.message.value = message
      inputModal.shown.value = true
      inputModal.inputValue = inputValue
    },
    close: () => {
      inputModal.message.value = ''
      inputModal.shown.value = false
      inputModal.inputValue = null
    },
    inputValue: null,
  }

  const assetsMenu = {
    shown: ref(false),
    open: (assetRef) => {
      assetsMenu.shown.value = true
      assetsMenu.assetRef = assetRef
    },
    close: () => {
      assetsMenu.shown.value = false
      assetsMenu.assetRef = null
    },
    assetRef: null,
  }

  const assetUpload = {
    shown: ref(false),
    open: () => {
      assetUpload.shown.value = true
    },
    close: () => {
      assetUpload.shown.value = false
    },
  }
  const assetView = {
    shown: ref(false),
    assetId: ref(''),
    open: (assetId) => {
      assetView.assetId.value = assetId
      assetView.shown.value = true
    },
    close: () => {
      assetView.assetId.value = ''
      assetView.shown.value = false
    },
  }

  const folderCreate = {
    shown: ref(false),
    open: () => {
      folderCreate.shown.value = true
    },
    close: () => {
      folderCreate.shown.value = false
    },
  }

  const materialStats = {
    shown: ref(false),
    materialId: ref(''),
    study: ref({}),
    open: (materialId, study) => {
      materialStats.materialId.value = materialId
      materialStats.study.value = study
      materialStats.shown.value = true
    },
    close: () => {
      materialStats.materialId.value = ''
      materialStats.study.value = {}
      materialStats.shown.value = false
    },
  }

  return {
    sidebarCollapsed,
    userPanelShow,
    notificationsShow,
    toggleSidebar,
    toggleUserPanel,
    toggleNotifications,
    popup,
    confirm,
    assetsMenu,
    inputModal,
    assetUpload,
    assetView,
    folderCreate,
    materialStats,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLayoutStore, import.meta.hot))
