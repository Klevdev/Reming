import { acceptHMRUpdate, defineStore } from 'pinia'
import request from '~/composables/request'

type user = userData & userTokens

interface userTokens {
  accessToken: string
  refreshToken: string
}

interface userData {
  _id: string
  name: string
  picture?: string
}

export const useUserStore = defineStore('user', () => {
  const loggedIn = ref(false)
  const _id = ref('')
  const name = ref('')
  const picture = ref('')

  const setData = (user: userData, save = true) => {
    _id.value = user._id
    name.value = user.name

    if (save) {
      localStorage.setItem('user', JSON.stringify({
        _id: _id.value,
        name: name.value,
        picture: picture.value,
      }))
    }
  }
  const setPicture = (picturePath: string, save = true) => {
    picture.value = picturePath || ''

    if (save) {
      localStorage.setItem('user', JSON.stringify({
        _id: _id.value,
        name: name.value,
        picture: picture.value,
      }))
    }
  }

  const refresh = (tokens: userTokens) => {
    document.cookie = `accessToken=${tokens.accessToken};expires=Mon, 18 Dec 2023 12:00:00 UTC;path=/;`
    document.cookie = `refreshToken=${tokens.refreshToken};expires=Mon, 18 Dec 2023 12:00:00 UTC;path=/;`
  }

  const login = (user: user) => {
    setData({
      _id: user._id,
      name: user.name,
    })
    setPicture(user.picture)
    refresh({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    })

    loggedIn.value = true
  }

  const logout = () => {
    request.delete('/user/logout', true)

    document.cookie = 'accessToken=;expires=Mon, 18 Dec 2003 12:00:00 UTC;'
    document.cookie = 'refreshToken=;expires=Mon, 18 Dec 2003 12:00:00 UTC;'

    _id.value = ''
    name.value = ''
    picture.value = ''

    localStorage.removeItem('user')

    loggedIn.value = false
  }

  return {
    loggedIn,
    _id,
    name,
    picture,
    login,
    logout,
    refresh,
    setData,
    setPicture,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
