<script setup lang="ts">
// import { useUserStore } from '~/stores/user'

// const user = useUserStore()
// const name = $ref(user.savedName)

// const router = useRouter()
// const go = () => {
//   if (name)
//     router.push(`/hi/${encodeURIComponent(name)}`)
// }

// const { t } = useI18n()

async function f() {
  document.cookie = 'accessToken=Test;max-age=10m;'
  await fetch('http://localhost:3000/test', {
    credentials: 'include',
    method: 'GET',
  })
}

</script>

<template>
  <button class="btn" @click="f">
    f for fetch
  </button>
</template>

<route lang="yaml">
meta:
  title: Home
  layout: default
</route>
