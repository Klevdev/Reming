<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const user = useUserStore()
const formData = ref({
  email: '',
  password: '',
})

const submitForm = async() => {
  const res = await fetch('http://localhost:3000/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include',
    body: JSON.stringify(formData.value),
  })
  const response = await res.json()

  if (Object.prototype.hasOwnProperty.call(response, 'error'))
    alert(`${response.error.message}`)

  else
    user.login(response.data)
}

</script>

<template>
  <form class="w-200px flex flex-col gap-5px" @submit.prevent="submitForm">
    <input v-model="formData.email" type="email">
    <input v-model="formData.password" type="password">

    <button class="btn">
      Submit
    </button>
  </form>
</template>

<route lang="yaml">
meta:
  name: Login
  title: Log in
  layout: default
</route>
