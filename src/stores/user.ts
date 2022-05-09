import { acceptHMRUpdate, defineStore } from 'pinia'
import request from '~/composables/request'

type user = userData & userTokens

interface userTokens {
  accessToken: string
  refreshToken: string
}

interface userData {
  name: string
  picture?: string
}

export const useUserStore = defineStore('user', () => {
  const loggedIn = ref(false)
  const name = ref('')
  const picture = ref('')

  const setData = (user: userData, save = true) => {
    name.value = user.name
    picture.value = user.picture || ''

    if (save) {
      localStorage.setItem('user', JSON.stringify({
        name: name.value,
        picture: picture.value,
      }))
    }
  }

  const refresh = (tokens: userTokens) => {
    document.cookie = `accessToken=${tokens.accessToken};expires=Mon, 18 Dec 2023 12:00:00 UTC;`
    document.cookie = `refreshToken=${tokens.refreshToken};expires=Mon, 18 Dec 2023 12:00:00 UTC;`
  }

  const login = (user: user) => {
    setData({
      name: user.name,
      picture: user.picture,
    })
    refresh({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    })

    loggedIn.value = true
  }

  const logout = () => {
    request.delete('/user/logout', true).then(() => {
      document.cookie = 'accessToken=;expires=Mon, 18 Dec 2003 12:00:00 UTC;'
      document.cookie = 'refreshToken=;expires=Mon, 18 Dec 2003 12:00:00 UTC;'
    })

    name.value = ''
    picture.value = ''

    localStorage.removeItem('user')

    loggedIn.value = false
  }

  return {
    loggedIn,
    name,
    picture,
    login,
    logout,
    refresh,
    setData,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
