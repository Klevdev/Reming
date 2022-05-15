<script setup lang="ts">
import request from '~/composables/request'
import { useUserStore } from '~/stores/user'

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
  const userData = localStorage.getItem('user')
  if (userData) {
    const { data, error } = await request.get('/user/refresh', true)
    if (!error) {
      user.refresh(data)
      user.loggedIn = true
      user.setData(JSON.parse(userData), false)
    }
  }
  else {
    user.loggedIn = false
    user.refresh({ accessToken: '', refreshToken: '' })
  }
})
</script>

<template>
  <RouterView />
</template>
