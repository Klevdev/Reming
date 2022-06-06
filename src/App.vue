<script setup lang="ts">
import request from '~/composables/request'
import { useLayoutStore } from '~/stores/layout'
import { useUserStore } from '~/stores/user'
const layoutStore = useLayoutStore()

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Reming',
  meta: [
    { name: 'description', content: 'App for memorizing' },
  ],
})
onMounted(async() => {
  const user = useUserStore()
  try {
    const userData = JSON.parse(localStorage.getItem('user'))
    const { data, error } = await request.get('/user/refresh', true)
    if (!error) {
      user.refresh(data)
      user.loggedIn = true
      user.setData(userData, false)
      if (userData.picture)
        user.setPicture(userData.picture, false)
    }
  }
  catch {
    user.loggedIn = false
    user.refresh({ accessToken: '', refreshToken: '' })
    localStorage.removeItem('user')
  }
})
</script>

<template>
  <RouterView />

  <Confirm v-if="layoutStore.confirm.shown" />
  <AssetsMenu v-if="layoutStore.assetsMenu.shown" />
  <InputModal v-if="layoutStore.inputModal.shown" />
</template>
