import { acceptHMRUpdate, defineStore } from 'pinia'

interface user {
  name: string
  sid: string
  picture: string
  accessToken: string
  refreshToken: string
}

export const useUserStore = defineStore('user', () => {
  const userLoggedIn = ref(false)
  const userName = ref('')
  const userSid = ref('')
  const userPicture = ref('')

  const setData = (user: user) => {
    userName.value = user.name
    userSid.value = user.sid
    userPicture.value = user.picture
  }

  const refresh = (accessToken: string, refreshToken: string) => {
    document.cookie = `accessToken=${accessToken};expires=Mon, 18 Dec 2023 12:00:00 UTC;`
    document.cookie = `refreshToken=${refreshToken};expires=Mon, 18 Dec 2023 12:00:00 UTC;`
  }

  const login = (user: user) => {
    setData(user)
    refresh(user.accessToken, user.refreshToken)

    userLoggedIn.value = true
  }

  const logout = () => {
    userName.value = ''
    userSid.value = ''
    userPicture.value = ''

    document.cookie = 'accessToken=;expires=Mon, 18 Dec 2003 12:00:00 UTC;'
    document.cookie = 'refreshToken=;expires=Mon, 18 Dec 2003 12:00:00 UTC;'

    userLoggedIn.value = false
  }

  return {
    userLoggedIn,
    userName,
    userSid,
    userPicture,
    login,
    logout,
    refresh,
    setData,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
