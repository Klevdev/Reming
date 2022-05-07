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

  const login = (user: user) => {
    userName.value = user.name
    userSid.value = user.sid
    userPicture.value = user.picture

    document.cookie = `accessToken=${user.accessToken};expires=Mon, 18 Dec 2023 12:00:00 UTC;`
    document.cookie = `refreshToken=${user.refreshToken};expires=Mon, 18 Dec 2023 12:00:00 UTC;`

    userLoggedIn.value = true
  }
  return {
    userLoggedIn,
    userName,
    userSid,
    userPicture,
    login,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
