<script setup lang="ts">
import request from '~/composables/request'
import { useUserStore } from '~/stores/user'

const user = useUserStore()
const formData = ref({
  name: '',
  email: '',
  password: '',
})

const submitForm = async() => {
  const response = await request.post('/user/signup', formData.value)

  if (Object.prototype.hasOwnProperty.call(response, 'error'))
    alert(`${response.error.message}`)

  else
    user.login(response.data)
}

</script>

<template>
  <form class="w-200px flex flex-col gap-15px" @submit.prevent="submitForm">
    <input v-model="formData.name" type="textt">
    <input v-model="formData.email" type="email">
    <input v-model="formData.password" type="password">

    <button class="btn">
      Submit
    </button>
  </form>
</template>

<route lang="yaml">
meta:
  name: Signup
  title: Sign up
  layout: default
</route>
